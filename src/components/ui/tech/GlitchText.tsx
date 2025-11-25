"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface GlitchTextProps {
  children: string;
  className?: string;
  glitchColor1?: string;
  glitchColor2?: string;
  intensity?: "low" | "medium" | "high";
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className = "",
  glitchColor1 = "#00ffff",
  glitchColor2 = "#ff00ff",
  intensity = "low",
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  const intensityConfig = {
    low: { interval: 5000, duration: 150 },
    medium: { interval: 3000, duration: 200 },
    high: { interval: 1500, duration: 300 },
  };

  useEffect(() => {
    const config = intensityConfig[intensity];
    
    const glitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), config.duration);
    };

    const interval = setInterval(glitch, config.interval);
    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <span
      ref={textRef}
      className={`relative inline-block ${className}`}
      style={{ 
        textShadow: isGlitching 
          ? `2px 0 ${glitchColor1}, -2px 0 ${glitchColor2}` 
          : "none",
        transform: isGlitching ? `translateX(${Math.random() * 2 - 1}px)` : "none",
        transition: "none",
      }}
    >
      {children}
      {isGlitching && (
        <>
          <span
            className="absolute inset-0"
            style={{
              color: glitchColor1,
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: "translateX(-2px)",
              opacity: 0.8,
            }}
            aria-hidden
          >
            {children}
          </span>
          <span
            className="absolute inset-0"
            style={{
              color: glitchColor2,
              clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
              transform: "translateX(2px)",
              opacity: 0.8,
            }}
            aria-hidden
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;
