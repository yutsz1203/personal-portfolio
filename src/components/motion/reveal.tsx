"use client";


import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { ITEM_DISTANCE } from "@/components/motion/timing";

export type MotionTrigger = "view" | "mount";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  trigger?: MotionTrigger;
};

export function Reveal({
  children,
  className,
  delay = 0,
  trigger = "view",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const hidden = { opacity: 0, y: reduceMotion ? 0 : ITEM_DISTANCE };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
      {...(trigger === "mount"
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, amount: 0.2 } })}
    >
      {children}
    </motion.div>
  );
}