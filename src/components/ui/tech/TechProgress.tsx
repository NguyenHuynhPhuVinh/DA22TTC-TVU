"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface TechProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  animated?: boolean;
  color?: string;
  height?: "sm" | "md" | "lg";
}

export const TechProgress: React.FC<TechProgressProps> = ({
  value,
  max = 100,
  className,
  showValue = false,
  animated = true,
  color = "#00ff88",
  height = "md",
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const percentage = Math.min((value / max) * 100, 100);

  const heightClasses = {
    sm: "h-0.5",
    md: "h-1",
    lg: "h-2",
  };

  useEffect(() => {
    if (!barRef.current || !animated) return;

    gsap.to(barRef.current, {
      width: `${percentage}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [percentage, animated]);

  return (
    <div className={cn("relative", className)}>
      {showValue && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn("bg-muted overflow-hidden", heightClasses[height])}>
        <div
          ref={barRef}
          className={cn("h-full transition-all", heightClasses[height])}
          style={{
            width: animated ? 0 : `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {/* Animated segments */}
      <div className="absolute inset-0 flex pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-background/50"
            style={{ opacity: i < (percentage / 100) * 20 ? 0.3 : 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default TechProgress;
