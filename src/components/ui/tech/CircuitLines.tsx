"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface CircuitLinesProps {
  className?: string;
  color?: string;
  pulseColor?: string;
}

export const CircuitLines: React.FC<CircuitLinesProps> = ({
  className = "",
  color = "currentColor",
  pulseColor = "#00ff88",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const pulses = svgRef.current.querySelectorAll(".circuit-pulse");
    
    pulses.forEach((pulse, i) => {
      gsap.to(pulse, {
        attr: { offset: "100%" },
        duration: 2 + i * 0.5,
        repeat: -1,
        ease: "none",
        delay: i * 0.3,
      });
    });

    return () => {
      gsap.killTweensOf(pulses);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Pulse gradient */}
        <linearGradient id="pulse-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop className="circuit-pulse" offset="0%" stopColor={pulseColor} />
          <stop offset="5%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="pulse-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop className="circuit-pulse" offset="0%" stopColor={pulseColor} />
          <stop offset="5%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Horizontal circuit lines */}
      <g opacity="0.15">
        <path d="M 0 100 H 200 L 220 120 H 400" stroke={color} strokeWidth="1" fill="none" />
        <path d="M 0 200 H 150 L 170 180 H 350 L 370 200 H 500" stroke={color} strokeWidth="1" fill="none" />
        <path d="M 0 300 H 100 L 120 320 H 280" stroke={color} strokeWidth="1" fill="none" />
      </g>

      {/* Vertical circuit lines */}
      <g opacity="0.15">
        <path d="M 100 0 V 150 L 120 170 V 400" stroke={color} strokeWidth="1" fill="none" />
        <path d="M 300 0 V 100 L 280 120 V 250 L 300 270 V 500" stroke={color} strokeWidth="1" fill="none" />
      </g>

      {/* Animated pulse lines */}
      <path d="M 0 100 H 200 L 220 120 H 400" stroke="url(#pulse-gradient-1)" strokeWidth="2" fill="none" />
      <path d="M 100 0 V 150 L 120 170 V 400" stroke="url(#pulse-gradient-2)" strokeWidth="2" fill="none" />

      {/* Circuit nodes */}
      <g fill={color} opacity="0.3">
        <circle cx="200" cy="100" r="3" />
        <circle cx="220" cy="120" r="3" />
        <circle cx="150" cy="200" r="3" />
        <circle cx="170" cy="180" r="3" />
        <circle cx="350" cy="200" r="3" />
        <circle cx="100" cy="150" r="3" />
        <circle cx="120" cy="170" r="3" />
        <circle cx="300" cy="100" r="3" />
        <circle cx="280" cy="120" r="3" />
      </g>
    </svg>
  );
};

export default CircuitLines;
