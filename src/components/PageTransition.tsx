"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  variant?: "fade" | "slideUp" | "slideInRight" | "zoomIn" | "blur";
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  slideInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
    transition: { duration: 0.5, ease: "easeInOut" },
  },
} as const;

export default function PageTransition({
  children,
  variant = "slideUp",
}: PageTransitionProps) {
  const variantConfig = variants[variant];

  return (
    <motion.div
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={variantConfig.transition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
