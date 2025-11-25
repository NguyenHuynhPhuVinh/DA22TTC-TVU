"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridBackground, CircuitLines, ScanLine } from "@/components/ui/tech";

interface TechLayoutProps {
  children: React.ReactNode;
  showGrid?: boolean;
  showCircuits?: boolean;
  showScanLine?: boolean;
}

export const TechLayout: React.FC<TechLayoutProps> = ({
  children,
  showGrid = true,
  showCircuits = false,
  showScanLine = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial page load animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
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
            className="opacity-30"
            dotColor="hsl(var(--foreground))"
            lineColor="hsl(var(--foreground))"
          />
        )}
        {showCircuits && (
          <CircuitLines
            className="opacity-20"
            color="hsl(var(--foreground))"
            pulseColor="#00ff88"
          />
        )}
        {showScanLine && <ScanLine color="#00ff88" speed={6} />}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-foreground/20 pointer-events-none" />
      <div className="fixed top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-foreground/20 pointer-events-none" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-foreground/20 pointer-events-none" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-foreground/20 pointer-events-none" />
    </div>
  );
};

export default TechLayout;
