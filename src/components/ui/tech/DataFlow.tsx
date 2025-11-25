"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface DataFlowProps {
  className?: string;
  direction?: "horizontal" | "vertical";
  color?: string;
  speed?: number;
}

export const DataFlow: React.FC<DataFlowProps> = ({
  className = "",
  direction = "horizontal",
  color = "#00ff88",
  speed = 3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = containerRef.current.querySelectorAll(".data-particle");
    
    particles.forEach((particle, i) => {
      const delay = i * 0.2;
      
      if (direction === "horizontal") {
        gsap.fromTo(
          particle,
          { x: "-100%", opacity: 0 },
          {
            x: "100vw",
            opacity: 1,
            duration: speed,
            repeat: -1,
            delay,
            ease: "none",
          }
        );
      } else {
        gsap.fromTo(
          particle,
          { y: "-100%", opacity: 0 },
          {
            y: "100vh",
            opacity: 1,
            duration: speed,
            repeat: -1,
            delay,
            ease: "none",
          }
        );
      }
    });

    return () => {
      gsap.killTweensOf(particles);
    };
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="data-particle absolute"
          style={{
            [direction === "horizontal" ? "top" : "left"]: `${20 + i * 15}%`,
            width: direction === "horizontal" ? "60px" : "2px",
            height: direction === "horizontal" ? "2px" : "60px",
            background: `linear-gradient(${direction === "horizontal" ? "90deg" : "180deg"}, transparent, ${color}, transparent)`,
          }}
        />
      ))}
    </div>
  );
};

export default DataFlow;
