"use client";

import type React from "react";

import { useRef, type ReactNode } from "react";
import { motion, type PanInfo } from "framer-motion";

interface HorizontalScrollProps {
  children: ReactNode;
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!containerRef.current) return;
    containerRef.current.scrollLeft -= info.delta.x;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto"
      style={{
        height: "calc(100vh - 100px)",
      }}
    >
      <motion.div
        className="flex gap-4 h-full w-fit"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        style={{ cursor: "grab" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
