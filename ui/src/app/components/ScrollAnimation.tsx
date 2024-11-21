"use client";

import { useInView, motion } from "framer-motion";
import { useRef } from "react";

export default function ScrollAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1.5 }}
    >
      {children}
    </motion.div>
  );
}
