"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface GridBackgroundProps {
  className?: string;
  dotColor?: string;
  lineColor?: string;
  animated?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  className = "",
  dotColor = "currentColor",
  lineColor = "currentColor",
  animated = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated || !svgRef.current) return;

    const dots = svgRef.current.querySelectorAll(".grid-dot");
    
    gsap.fromTo(
      dots,
      { opacity: 0.1 },
      {
        opacity: 0.4,
        duration: 2,
        stagger: {
          each: 0.02,
          from: "random",
          repeat: -1,
          yoyo: true,
        },
        ease: "sine.inOut",
      }
    );

    return () => {
      gsap.killTweensOf(dots);
    };
  }, [animated]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={lineColor}
            strokeWidth="0.5"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      
      {/* Animated dots at intersections */}
      {Array.from({ length: 20 }).map((_, row) =>
        Array.from({ length: 30 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            className="grid-dot"
            cx={col * 40}
            cy={row * 40}
            r="1"
            fill={dotColor}
            opacity="0.2"
          />
        ))
      )}
    </svg>
  );
};

export default GridBackground;
