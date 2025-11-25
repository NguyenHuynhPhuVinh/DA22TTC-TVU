"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  corners?: boolean;
  onClick?: () => void;
}

export const TechCard: React.FC<TechCardProps> = ({
  children,
  className,
  hover = true,
  glow = false,
  corners = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!hover) return;
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    
    if (glowRef.current && glow) {
      gsap.to(glowRef.current, {
        opacity: 1,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!hover) return;
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    
    if (glowRef.current && glow) {
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!glowRef.current || !glow) return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 255, 136, 0.1) 0%, transparent 50%)`;
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative bg-card border border-border transition-colors",
        hover && "cursor-pointer hover:border-foreground/30",
        className
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Corner decorations */}
      {corners && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-foreground/30" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-foreground/30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-foreground/30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-foreground/30" />
        </>
      )}

      {/* Glow effect */}
      {glow && (
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity"
        />
      )}

      {children}
    </div>
  );
};

export default TechCard;
