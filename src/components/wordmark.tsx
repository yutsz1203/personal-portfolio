"use client";

// Client component: the collapse is driven by live scroll position.

import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

/** Scroll offset, in px, past which the wordmark collapses to its initials. */
const COLLAPSE_AT = 16;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

// Snapshot is a boolean, so a scroll only re-renders when the wordmark
// actually has to change state. The server snapshot keeps the markup
// expanded, and a reload that restores a scrolled position corrects itself
// on hydration without a mismatch.
const isScrolled = () => window.scrollY > COLLAPSE_AT;
const isScrolledOnServer = () => false;

type WordmarkProps = {
  className?: string;
};

function Collapsing({
  collapsed,
  transition,
  children,
}: {
  collapsed: boolean;
  transition: Transition;
  children: ReactNode;
}) {
  return (
    <motion.span
      className="inline-block overflow-hidden"
      initial={false}
      animate={{ width: collapsed ? 0 : "auto", opacity: collapsed ? 0 : 1 }}
      transition={transition}
    >
      {children}
    </motion.span>
  );
}

export function Wordmark({ className }: WordmarkProps) {
  const collapsed = useSyncExternalStore(
    subscribeToScroll,
    isScrolled,
    isScrolledOnServer,
  );
  const reduceMotion = useReducedMotion();

  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

  return (
    <Link href="/" className={className}>
      <span className="sr-only">Mervin Yu</span>
      <span aria-hidden className="flex items-center whitespace-nowrap">
        M
        <Collapsing collapsed={collapsed} transition={transition}>
          ervin&nbsp;
        </Collapsing>
        Y
        <Collapsing collapsed={collapsed} transition={transition}>
          u
        </Collapsing>
      </span>
    </Link>
  );
}
