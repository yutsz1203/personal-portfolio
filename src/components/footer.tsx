import { Icons } from "./common/icons"
import {Button} from "./ui/button"

const SOCIAL_LINKS = [
  { href: "https://github.com/yutsz1203", label: "GitHub", icon: Icons.github},
  { href: "https://www.linkedin.com/in/mervin-yu", label: "LinkedIn", icon: Icons.linkedin },
  { href: "mailto:mervinyu@link.cuhk.edu.hk", label: "Email", icon: Icons.mail },
  { href: "https://leetcode.com/u/yutsz", label: "LeetCode", icon: Icons.leetcode },
] as const;

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs tracking-tight text-muted-foreground">
          © {new Date().getFullYear()} Mervin Yu
        </p>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="text-xs tracking-tight text-muted-foreground no-underline transition-colors"
              >
                <Icon/>
              </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
