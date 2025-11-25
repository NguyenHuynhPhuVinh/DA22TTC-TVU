"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScanLineProps {
  className?: string;
  color?: string;
  speed?: number;
  direction?: "down" | "up";
}

export const ScanLine: React.FC<ScanLineProps> = ({
  className = "",
  color = "#00ff88",
  speed = 4,
  direction = "down",
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    const fromY = direction === "down" ? "-100%" : "100%";
    const toY = direction === "down" ? "100vh" : "-100vh";

    gsap.fromTo(
      lineRef.current,
      { y: fromY },
      {
        y: toY,
        duration: speed,
        repeat: -1,
        ease: "none",
      }
    );

    return () => {
      gsap.killTweensOf(lineRef.current);
    };
  }, [speed, direction]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        }}
      />
    </div>
  );
};

export default ScanLine;
