#!/usr/bin/env python3
"""Fetch missing book covers from the iTunes Search API and wire them into books.ts.

For every entry in src/content/books.ts that has no `cover` field, this searches
the iTunes ebook catalogue, picks the best title+author match, downloads the
artwork, converts it to WebP in public/books/, and inserts a `cover` block with
the real pixel dimensions.

Usage:
    python3 scripts/fetch_book_covers.py --dry-run     # show what it would do
    python3 scripts/fetch_book_covers.py               # do it, confirming each
    python3 scripts/fetch_book_covers.py --yes         # no prompts
    python3 scripts/fetch_book_covers.py --title "Nexus" --force   # redo one

Requires Pillow (`python3 -c "import PIL"`). No other dependencies.
"""

from __future__ import annotations

import argparse
import difflib
import hashlib
import io
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path

try:
    from PIL import Image

    HAVE_PILLOW = True
except ImportError:  # Optional: without it we keep the original JPEG.
    HAVE_PILLOW = False

REPO = Path(__file__).resolve().parent.parent
BOOKS_TS = REPO / "src" / "content" / "books.ts"
COVERS_DIR = REPO / "public" / "books"

ITUNES_ENDPOINT = "https://itunes.apple.com/search"
USER_AGENT = "personal-portfolio-cover-fetcher/1.0"

# Apple stores the publisher's original (often ~1700x2600), so fetch big and
# downscale locally. iTunes `bb` URLs are a *bounding box* preserving aspect
# ratio, so a 2000 box yields ~1310x2000 for a 2:3 cover.
#
# Storing ~800px wide rather than the ~480px the layout strictly needs at 2x
# leaves headroom: book covers are dense small type, and a source with no
# margin above the display size shows compression artefacts on that type.
DEFAULT_FETCH_BOX = 2000
DEFAULT_TARGET_WIDTH = 800
DEFAULT_QUALITY = 85

# Below this combined title+author similarity we refuse to auto-accept a result.
MATCH_THRESHOLD = 0.62

# Author similarity below this means the "author" is probably a summary
# publisher rather than the real one. See the penalty in search_itunes.
AUTHOR_MISMATCH_LIMIT = 0.35


@dataclass
class BookEntry:
    """One object literal inside the `books` array."""

    title: str
    author: str
    start: int  # offset of `{` in the source
    end: int  # offset just past the matching `}`
    author_line_end: int  # offset just past the newline ending the author line
    indent: str
    # Span of the existing `cover: {...},` block, or None when there isn't one.
    cover_span: tuple[int, int] | None

    @property
    def has_cover(self) -> bool:
        return self.cover_span is not None

    def edit_span(self) -> tuple[int, int]:
        """Where a fresh cover block should go: replacing the old one, or inserted."""
        if self.cover_span is not None:
            return self.cover_span
        return (self.author_line_end, self.author_line_end)


@dataclass
class Candidate:
    title: str
    author: str
    artwork_url: str
    score: float


def fail(message: str) -> "NoReturn":  # type: ignore[valid-type]
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(1)


def _ssl_context() -> ssl.SSLContext:
    """Build a verifying context that works on python.org framework builds.

    Those installs ship no CA bundle and ignore the macOS keychain, so the
    default context fails with CERTIFICATE_VERIFY_FAILED. certifi fixes it when
    present; otherwise we fall back and let the error surface with guidance.
    """
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


SSL_CONTEXT = _ssl_context()

# Set on the child process so a relaunch can never loop.
RELAUNCH_MARKER = "FETCH_BOOK_COVERS_RELAUNCHED"

# Interpreters worth trying when the current one has no CA bundle. macOS ships
# several Python 3 installs and only some can verify TLS.
CANDIDATE_INTERPRETERS = (
    "/usr/bin/python3",
    "/opt/homebrew/bin/python3",
    "/usr/local/bin/python3",
)


def _has_ca_bundle() -> bool:
    """True when this interpreter can actually verify a TLS certificate.

    python.org framework builds ship no CA bundle and ignore the macOS keychain,
    which shows up as an empty trust store — checkable without a network call.
    """
    try:
        return SSL_CONTEXT.cert_store_stats()["x509_ca"] > 0
    except Exception:  # noqa: BLE001 - treat an unreadable store as unusable
        return False


def _probe(interpreter: str) -> tuple[bool, bool] | None:
    """Return (has_ca_bundle, has_pillow) for another interpreter."""
    code = (
        "import ssl;"
        "ca = ssl.create_default_context().cert_store_stats()['x509_ca'] > 0;"
        "\ntry:\n import PIL; p = True\nexcept ImportError: p = False\n"
        "print(int(ca), int(p))"
    )
    try:
        result = subprocess.run(
            [interpreter, "-c", code], capture_output=True, text=True, timeout=15
        )
        ca, pillow = result.stdout.split()
        return bool(int(ca)), bool(int(pillow))
    except Exception:  # noqa: BLE001 - a candidate that won't probe is unusable
        return None


def maybe_relaunch() -> None:
    """Re-exec under an interpreter that can do TLS, if this one cannot.

    Without this the script is unusable on whichever python3 happens to be first
    on PATH, which is a poor trap for a convenience tool.
    """
    if _has_ca_bundle() or os.environ.get(RELAUNCH_MARKER):
        return

    seen = {os.path.realpath(sys.executable)}
    candidates = [*CANDIDATE_INTERPRETERS]
    found_on_path = shutil.which("python3")
    if found_on_path:
        candidates.append(found_on_path)

    best: str | None = None
    for candidate in candidates:
        real = os.path.realpath(candidate)
        if real in seen or not os.path.exists(candidate):
            continue
        seen.add(real)
        probed = _probe(candidate)
        if probed is None or not probed[0]:
            continue
        best = candidate
        if probed[1]:  # TLS *and* Pillow — stop looking
            break

    if best is None:
        return  # Let the normal TLS error path print its guidance.

    print(
        f"note: {sys.executable}\n"
        f"      has no CA bundle, so TLS would fail. Re-running under:\n"
        f"      {best}\n"
    )
    # execve replaces this process; anything still buffered would be lost.
    sys.stdout.flush()
    os.execve(
        best,
        [best, os.path.abspath(__file__), *sys.argv[1:]],
        {**os.environ, RELAUNCH_MARKER: "1"},
    )


def _tls_help() -> str:
    return (
        "TLS certificate verification failed. This interpreter has no CA bundle:\n"
        f"    {sys.executable}\n"
        "Fix it with any one of:\n"
        "  - use a working interpreter:  /usr/bin/python3 scripts/fetch_book_covers.py\n"
        f"  - install certifi:            {sys.executable} -m pip install certifi\n"
        '  - run Python\'s installer:      "/Applications/Python 3.12/Install Certificates.command"'
    )


# --------------------------------------------------------------------------
# Parsing books.ts
#
# Deliberately not a real TS parser: the file is a hand-maintained array of flat
# object literals, so brace matching plus field regexes is enough and keeps the
# script dependency-free. It will refuse to guess if the shape looks unexpected.
# --------------------------------------------------------------------------


def _read_string_field(obj_src: str, field: str) -> str | None:
    match = re.search(rf'\b{field}\s*:\s*"((?:[^"\\]|\\.)*)"', obj_src)
    if not match:
        return None
    return json.loads(f'"{match.group(1)}"')


def _split_top_level_objects(source: str) -> list[tuple[int, int]]:
    """Return (start, end) offsets of each `{...}` directly inside `books`."""
    array_match = re.search(r"export\s+const\s+books\s*:\s*Book\[\]\s*=\s*\[", source)
    if not array_match:
        fail("could not find `export const books: Book[] = [` in books.ts")

    spans: list[tuple[int, int]] = []
    i = array_match.end()
    depth = 0
    obj_start = -1
    in_string: str | None = None
    escaped = False

    while i < len(source):
        ch = source[i]

        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == in_string:
                in_string = None
            i += 1
            continue

        if ch in "\"'`":
            in_string = ch
        elif ch == "{":
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                spans.append((obj_start, i + 1))
        elif ch == "]" and depth == 0:
            break

        i += 1

    if depth != 0:
        fail("unbalanced braces in books.ts — fix the file or parse manually")
    return spans


def _find_cover_span(source: str, start: int, end: int) -> tuple[int, int] | None:
    """Absolute span of `cover: { ... },` (including trailing comma/newline)."""
    match = re.search(r"\n[ \t]*cover\s*:\s*\{", source[start:end])
    if not match:
        return None

    block_start = start + match.start() + 1  # keep the preceding newline
    i = start + match.end() - 1  # at the `{`
    depth = 0
    while i < end:
        if source[i] == "{":
            depth += 1
        elif source[i] == "}":
            depth -= 1
            if depth == 0:
                i += 1
                break
        i += 1

    # Swallow a trailing comma and the rest of that line.
    while i < end and source[i] in ", \t":
        i += 1
    if i < end and source[i] == "\n":
        i += 1
    return (block_start, i)


def parse_books(source: str) -> list[BookEntry]:
    entries: list[BookEntry] = []

    for start, end in _split_top_level_objects(source):
        obj_src = source[start:end]
        title = _read_string_field(obj_src, "title")
        author = _read_string_field(obj_src, "author")

        if title is None or author is None:
            fail(
                f"a book entry at offset {start} is missing a literal `title` or "
                "`author` — the script only handles plain string fields"
            )

        author_match = re.search(r'\bauthor\s*:\s*"(?:[^"\\]|\\.)*"\s*,?[^\S\n]*\n', obj_src)
        if not author_match:
            fail(f"could not locate the author line for {title!r}")

        indent_match = re.search(r"\n([ \t]*)author\s*:", obj_src)
        indent = indent_match.group(1) if indent_match else "    "

        entries.append(
            BookEntry(
                title=title,
                author=author,
                start=start,
                end=end,
                author_line_end=start + author_match.end(),
                indent=indent,
                cover_span=_find_cover_span(source, start, end),
            )
        )

    return entries


# --------------------------------------------------------------------------
# iTunes lookup
# --------------------------------------------------------------------------


def _normalise(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    # Drop subtitles and edition noise before comparing (both ASCII and CJK
    # punctuation, since Chinese titles use fullwidth forms).
    text = re.split(r"[:(\[：（【]", text)[0]
    # Keep word characters of ANY script: a [^a-z0-9 ] filter erases CJK titles
    # entirely, and two empty strings compare as a perfect 1.00 match.
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    return " ".join(text.split())


def _similarity(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, _normalise(a), _normalise(b)).ratio()


def search_itunes(title: str, author: str, limit: int = 10) -> list[Candidate]:
    query = urllib.parse.urlencode(
        {
            "term": f"{title} {author}",
            "entity": "ebook",
            "limit": str(limit),
            "country": "US",
        }
    )
    request = urllib.request.Request(
        f"{ITUNES_ENDPOINT}?{query}", headers={"User-Agent": USER_AGENT}
    )

    try:
        with urllib.request.urlopen(request, timeout=20, context=SSL_CONTEXT) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        if isinstance(exc.reason, ssl.SSLCertVerificationError):
            fail(_tls_help())
        print(f"  ! iTunes lookup failed: {exc}")
        return []
    except Exception as exc:  # noqa: BLE001 - surface any other network/parse failure
        print(f"  ! iTunes lookup failed: {exc}")
        return []

    candidates: list[Candidate] = []
    for result in payload.get("results", []):
        artwork = result.get("artworkUrl100")
        if not artwork:
            continue
        result_title = result.get("trackName", "")
        result_author = result.get("artistName", "")
        # Weight the title more heavily; authors are often "First M. Last" vs "First Last".
        title_score = _similarity(title, result_title)
        author_score = _similarity(author, result_author)
        score = 0.7 * title_score + 0.3 * author_score

        # Study guides, summaries and "Book Analysis" editions carry almost the
        # exact title but a different publisher as author. A near-perfect title
        # with an unrelated author is the signature of a derivative work, so
        # demote it below the auto-accept threshold rather than trusting it.
        if author_score < AUTHOR_MISMATCH_LIMIT:
            score *= 0.6
        candidates.append(
            Candidate(
                title=result_title,
                author=result_author,
                artwork_url=artwork,
                score=score,
            )
        )

    candidates.sort(key=lambda c: c.score, reverse=True)
    return candidates


def artwork_at_box(url: str, box: int) -> str:
    """Rewrite `.../100x100bb.jpg` to the requested bounding box."""
    rewritten, count = re.subn(r"/\d+x\d+bb\.(jpg|png)$", f"/{box}x{box}bb.jpg", url)
    if count == 0:
        # Unexpected shape; the original still works, just smaller.
        print("  ! artwork URL had an unfamiliar shape, using it as-is")
        return url
    return rewritten


# --------------------------------------------------------------------------
# Download + convert
# --------------------------------------------------------------------------


def slugify(title: str) -> str:
    text = unicodedata.normalize("NFKD", title)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^A-Za-z0-9]+", "-", text).strip("-").lower()
    if text:
        return text
    # Non-Latin titles strip to nothing, and every one of them would collide on
    # a shared fallback name, so key them on the title instead.
    digest = hashlib.sha1(title.encode("utf-8")).hexdigest()[:10]
    return f"book-{digest}"


def _image_size(data: bytes) -> tuple[int, int]:
    """Read intrinsic dimensions from JPEG or PNG bytes, without Pillow."""
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        width = int.from_bytes(data[16:20], "big")
        height = int.from_bytes(data[20:24], "big")
        return width, height

    if data[:2] != b"\xff\xd8":
        fail("downloaded artwork is neither JPEG nor PNG")

    # Walk JPEG segments to the start-of-frame marker, which carries the size.
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        # SOF0-SOF15, excluding the non-frame markers DHT/JPG/DAC.
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            height = int.from_bytes(data[i + 5 : i + 7], "big")
            width = int.from_bytes(data[i + 7 : i + 9], "big")
            return width, height
        i += 2 + int.from_bytes(data[i + 2 : i + 4], "big")

    fail("could not read dimensions from the downloaded JPEG")


def download_cover(
    url: str, covers_dir: Path, slug: str, quality: int, target_width: int
) -> tuple[Path, int, int, int]:
    """Download artwork, downscale to `target_width`, convert to WebP.

    Returns (path, width, height, bytes_written). Falls back to storing the
    downloaded JPEG as-is when Pillow is unavailable — Next.js re-encodes to
    WebP/AVIF at serve time either way, so this only affects repo size.
    """
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30, context=SSL_CONTEXT) as response:
        raw = response.read()

    covers_dir.mkdir(parents=True, exist_ok=True)

    if not HAVE_PILLOW:
        # No resampler available, so the CDN already sized this for us.
        destination = covers_dir / f"{slug}.jpg"
        destination.write_bytes(raw)
        width, height = _image_size(raw)
        return destination, width, height, destination.stat().st_size

    destination = covers_dir / f"{slug}.webp"
    image = Image.open(io.BytesIO(raw))
    # WebP has no CMYK/palette support; normalise first.
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGB")

    if image.width > target_width:
        height = round(target_width * image.height / image.width)
        image = image.resize((target_width, height), Image.LANCZOS)

    image.save(destination, format="WEBP", quality=quality, method=6)
    return destination, image.width, image.height, destination.stat().st_size


# --------------------------------------------------------------------------
# Writing books.ts
# --------------------------------------------------------------------------


def _ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def build_cover_block(
    entry: BookEntry, src: str, width: int, height: int
) -> str:
    i = entry.indent
    inner = i + "  "
    return (
        f"{i}cover: {{\n"
        f"{inner}src: {_ts_string(src)},\n"
        f"{inner}alt: {_ts_string(f'{entry.title} cover')},\n"
        f"{inner}width: {width},\n"
        f"{inner}height: {height},\n"
        f"{i}}},\n"
    )


def apply_edits(source: str, edits: list[tuple[int, int, str]]) -> str:
    """Replace [start, end) spans, back to front so earlier offsets stay valid."""
    for start, end, text in sorted(edits, key=lambda e: e[0], reverse=True):
        source = source[:start] + text + source[end:]
    return source


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------


def main() -> int:
    maybe_relaunch()

    parser = argparse.ArgumentParser(
        description="Fetch missing book covers from iTunes and wire them into books.ts."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="search and report, but download nothing and edit nothing",
    )
    parser.add_argument(
        "--yes", action="store_true", help="accept the best match without prompting"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="also process books that already have a cover, overwriting the image",
    )
    parser.add_argument(
        "--title",
        help="only process the book whose title contains this (case-insensitive)",
    )
    parser.add_argument(
        "--target-width",
        type=int,
        default=DEFAULT_TARGET_WIDTH,
        help=f"stored cover width in px (default {DEFAULT_TARGET_WIDTH})",
    )
    parser.add_argument(
        "--box",
        type=int,
        default=DEFAULT_FETCH_BOX,
        help=(
            f"iTunes bounding box to fetch before downscaling "
            f"(default {DEFAULT_FETCH_BOX}; Apple holds up to ~2600px)"
        ),
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=DEFAULT_QUALITY,
        help=f"WebP quality 1-100 (default {DEFAULT_QUALITY})",
    )
    args = parser.parse_args()

    if not BOOKS_TS.exists():
        fail(f"{BOOKS_TS} not found — run this from the portfolio repo")

    source = BOOKS_TS.read_text(encoding="utf-8")
    entries = parse_books(source)

    targets = [e for e in entries if args.force or not e.has_cover]
    if args.title:
        needle = args.title.lower()
        targets = [e for e in targets if needle in e.title.lower()]

    if not targets:
        print("Nothing to do — every book already has a cover.")
        print("(Use --force to refetch, or --title to target one.)")
        return 0

    print(f"{len(entries)} books in books.ts, {len(targets)} to process.")
    if HAVE_PILLOW:
        print("Pillow found — covers will be converted to WebP.\n")
    else:
        print(
            "Pillow not found on this interpreter — covers will be saved as JPEG.\n"
            "Next.js re-encodes to WebP/AVIF at serve time, so this only costs repo\n"
            f"size. For WebP on disk: {sys.executable} -m pip install pillow\n"
        )

    edits: list[tuple[int, int, str]] = []
    skipped: list[str] = []

    for entry in targets:
        print(f"» {entry.title} — {entry.author}")
        candidates = search_itunes(entry.title, entry.author)
        time.sleep(0.4)  # iTunes throttles at roughly 20 calls/minute

        if not candidates:
            print("  ! no results\n")
            skipped.append(entry.title)
            continue

        best = candidates[0]
        print(f"  best: {best.title} — {best.author}  (score {best.score:.2f})")

        if best.score < MATCH_THRESHOLD and not args.yes:
            print("  ! weak match. Other candidates:")
            for i, candidate in enumerate(candidates[1:5], start=2):
                print(f"      {i}. {candidate.title} — {candidate.author} ({candidate.score:.2f})")

            if args.dry_run:
                # Reporting mode: never block, never guess.
                print("  would prompt for a choice (weak match)\n")
                skipped.append(entry.title)
                continue

            if not sys.stdin.isatty():
                print("  ! stdin is not a terminal, skipping (rerun interactively or use --yes)\n")
                skipped.append(entry.title)
                continue

            try:
                choice = input("  accept [1], pick a number, or press enter to skip: ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\n  skipped\n")
                skipped.append(entry.title)
                continue

            if not choice:
                print("  skipped\n")
                skipped.append(entry.title)
                continue
            try:
                best = candidates[int(choice) - 1]
            except (ValueError, IndexError):
                print("  unrecognised choice, skipping\n")
                skipped.append(entry.title)
                continue

        # Without Pillow we cannot resample, so ask the CDN for the final size.
        box = args.box if HAVE_PILLOW else round(args.target_width * 1.55)
        url = artwork_at_box(best.artwork_url, box)
        slug = slugify(entry.title)
        extension = "webp" if HAVE_PILLOW else "jpg"
        expected = COVERS_DIR / f"{slug}.{extension}"

        if args.dry_run:
            print(f"  would fetch  {url}")
            print(f"  would write  {expected.relative_to(REPO)}")
            print(f"  would set    src: /books/{slug}.{extension}\n")
            continue

        if expected.exists() and not args.force:
            print(f"  ! {expected.name} already exists, skipping (use --force)\n")
            skipped.append(entry.title)
            continue

        try:
            destination, width, height, size = download_cover(
                url, COVERS_DIR, slug, args.quality, args.target_width
            )
        except Exception as exc:  # noqa: BLE001
            print(f"  ! download failed: {exc}\n")
            skipped.append(entry.title)
            continue

        public_src = f"/books/{destination.name}"

        print(f"  wrote {destination.relative_to(REPO)}  {width}x{height}  {size // 1024}k")

        span_start, span_end = entry.edit_span()
        edits.append(
            (span_start, span_end, build_cover_block(entry, public_src, width, height))
        )
        print(f"  queued books.ts {'rewrite' if entry.has_cover else 'insert'}\n")

    if args.dry_run:
        print("Dry run — nothing downloaded, nothing written.")
        return 0

    if edits:
        BOOKS_TS.write_text(apply_edits(source, edits), encoding="utf-8")
        print(f"Updated {BOOKS_TS.relative_to(REPO)} with {len(edits)} cover block(s).")
    else:
        print("No books.ts changes.")

    if skipped:
        print("\nSkipped (add these by hand or rerun):")
        for title in skipped:
            print(f"  - {title}")

    print("\nNext: npx tsc --noEmit && npm run build")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
