"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import type { MotionTrigger } from "@/components/motion/reveal";
import { ITEM_DISTANCE, ITEM_DURATION } from "@/components/motion/timing";

type ListTag = "div" | "ul" | "ol" | "section";
type ItemTag = "div" | "li";

type StaggerListProps = {
  children: ReactNode;
  className?: string;
  as?: ListTag;
  stagger?: number;
  delay?: number;
  trigger?: MotionTrigger;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: ItemTag;
};

const containerVariants = (
  stagger: number,
  delay: number,
  duration: number,
): Variants => ({
  hidden: { opacity: 0 },
  shown: {
    opacity: 1,
    transition: {
      duration,
      delay,
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const itemVariants = (distance: number, duration: number): Variants => ({
  hidden: { opacity: 0, y: distance },
  shown: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
});

export function StaggerList({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
  trigger = "view",
}: StaggerListProps) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      variants={containerVariants(stagger, delay, ITEM_DURATION)}
      initial="hidden"
      {...(trigger === "mount"
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: { once: true, amount: 0.2 } })}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag className={className} variants={itemVariants(ITEM_DISTANCE, ITEM_DURATION)}>
      {children}
    </Tag>
  );
}