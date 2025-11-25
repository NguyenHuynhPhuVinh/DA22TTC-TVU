"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridBackground, CircuitLines, ScanLine, CyberGrid } from "@/components/ui/tech";

interface TechLayoutProps {
  children: React.ReactNode;
  showGrid?: boolean;
  showCircuits?: boolean;
  showScanLine?: boolean;
  showCyberGrid?: boolean;
  accentColor?: string;
}

export const TechLayout: React.FC<TechLayoutProps> = ({
  children,
  showGrid = true,
  showCircuits = false,
  showScanLine = false,
  showCyberGrid = false,
  accentColor = "#00ff88",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Kill any existing animations on this element
    gsap.killTweensOf(container);
    
    // Set initial state immediately to prevent flash
    gsap.set(container, { opacity: 0 });

    // Initial page load animation with slight delay for DOM ready
    requestAnimationFrame(() => {
      gsap.to(container, { 
        opacity: 1, 
        duration: 0.5, 
        ease: "power2.out" 
      });
    });

    // Cleanup on unmount
    return () => {
      gsap.killTweensOf(container);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground overflow-hidden"
    >
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none">
        {showGrid && (
          <GridBackground
            className="opacity-20"
            dotColor="hsl(var(--foreground))"
            lineColor="hsl(var(--foreground))"
            animated
          />
        )}
        {showCircuits && (
          <CircuitLines
            className="opacity-15"
            color="hsl(var(--foreground))"
            pulseColor={accentColor}
          />
        )}
        {showCyberGrid && (
          <CyberGrid
            className="opacity-20"
            color={accentColor}
            perspective
          />
        )}
        {showScanLine && <ScanLine color={accentColor} speed={8} />}
      </div>

      {/* Vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 pointer-events-none">
        <div className="w-12 h-12 border-t-2 border-l-2" style={{ borderColor: `${accentColor}30` }} />
        <div className="absolute top-0 left-0 w-2 h-2" style={{ backgroundColor: accentColor }} />
      </div>
      <div className="fixed top-4 right-4 pointer-events-none">
        <div className="w-12 h-12 border-t-2 border-r-2" style={{ borderColor: `${accentColor}30` }} />
        <div className="absolute top-0 right-0 w-2 h-2" style={{ backgroundColor: accentColor }} />
      </div>
      <div className="fixed bottom-4 left-4 pointer-events-none">
        <div className="w-12 h-12 border-b-2 border-l-2" style={{ borderColor: `${accentColor}30` }} />
        <div className="absolute bottom-0 left-0 w-2 h-2" style={{ backgroundColor: accentColor }} />
      </div>
      <div className="fixed bottom-4 right-4 pointer-events-none">
        <div className="w-12 h-12 border-b-2 border-r-2" style={{ borderColor: `${accentColor}30` }} />
        <div className="absolute bottom-0 right-0 w-2 h-2" style={{ backgroundColor: accentColor }} />
      </div>

      {/* Bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 pointer-events-none overflow-hidden">
        <div 
          className="h-full animate-pulse"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

export default TechLayout;
