"use client";


import { motion } from "motion/react";
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
  const hidden = { opacity: 0, y: ITEM_DISTANCE };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      transition={{
        duration: 0.5,
        delay,
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