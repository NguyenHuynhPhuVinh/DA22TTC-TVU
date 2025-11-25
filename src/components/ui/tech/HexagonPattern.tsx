"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface HexagonPatternProps {
  className?: string;
  color?: string;
  animated?: boolean;
}

export const HexagonPattern: React.FC<HexagonPatternProps> = ({
  className = "",
  color = "currentColor",
  animated = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated || !svgRef.current) return;

    const hexagons = svgRef.current.querySelectorAll(".hex");
    
    gsap.fromTo(
      hexagons,
      { opacity: 0.05, scale: 0.95 },
      {
        opacity: 0.15,
        scale: 1,
        duration: 3,
        stagger: {
          each: 0.1,
          from: "center",
          repeat: -1,
          yoyo: true,
        },
        ease: "sine.inOut",
      }
    );

    return () => {
      gsap.killTweensOf(hexagons);
    };
  }, [animated]);

  const hexPath = "M 30 0 L 60 17.32 L 60 51.96 L 30 69.28 L 0 51.96 L 0 17.32 Z";

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hex-pattern"
          width="90"
          height="104"
          patternUnits="userSpaceOnUse"
        >
          <g className="hex" transform="translate(0, 0)">
            <path d={hexPath} fill="none" stroke={color} strokeWidth="0.5" opacity="0.1" />
          </g>
          <g className="hex" transform="translate(45, 52)">
            <path d={hexPath} fill="none" stroke={color} strokeWidth="0.5" opacity="0.1" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      
      {/* Highlighted hexagons */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g
          key={i}
          className="hex"
          transform={`translate(${100 + i * 150}, ${80 + (i % 3) * 120})`}
          opacity="0.1"
        >
          <path d={hexPath} fill="none" stroke={color} strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
};

export default HexagonPattern;
