"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface LightningUploadProgressProps {
  value: number;
  max?: number;
  className?: string;
  onComplete?: () => void;
}

// Component pixel spark nhảy xung quanh
const PixelSpark: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}> = ({ x, y, size, color, duration }) => {
  const sparkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparkRef.current) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 25;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    gsap.fromTo(
      sparkRef.current,
      { opacity: 1, scale: 1, x: 0, y: 0 },
      {
        opacity: 0,
        scale: 0.3,
        x: targetX,
        y: targetY,
        duration: duration,
        ease: "power2.out",
      }
    );
  }, [duration]);

  return (
    <div
      ref={sparkRef}
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
      }}
    />
  );
};

// Component sét nhánh nhỏ khi đang upload
const MiniLightning: React.FC<{
  startX: number;
  startY: number;
  length: number;
  angle: number;
}> = ({ startX, startY, length, angle }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    gsap.fromTo(
      pathRef.current,
      { opacity: 1, strokeWidth: 2 },
      { opacity: 0, strokeWidth: 0, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  const segments = 4;
  let path = `M ${startX} ${startY}`;
  let currentX = startX;
  let currentY = startY;

  for (let i = 0; i < segments; i++) {
    const segLength = length / segments;
    const offsetX = (Math.random() - 0.5) * 8;
    currentX += Math.cos(angle) * segLength + offsetX;
    currentY += Math.sin(angle) * segLength + (Math.random() - 0.5) * 6;
    path += ` L ${currentX} ${currentY}`;
  }

  return (
    <svg className="absolute pointer-events-none overflow-visible" style={{ left: 0, top: 0, width: "100%", height: "100%" }}>
      <path ref={pathRef} d={path} stroke="#00ff88" strokeWidth="2" fill="none" style={{ filter: "drop-shadow(0 0 3px #00ff88)" }} />
    </svg>
  );
};

// Component sét đánh lớn - render qua Portal vào body
const ThunderStrikePortal: React.FC<{ targetX: number; targetY: number; onFinish: () => void }> = ({
  targetX,
  targetY,
  onFinish,
}) => {
  const [bolts, setBolts] = useState<{ id: number; path: string; delay: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const generateBolt = (endX: number, endY: number, startOffsetX: number, variance: number): string => {
      const points: { x: number; y: number }[] = [];
      const segments = 12;
      const startX = endX + startOffsetX;
      const startY = 0;

      points.push({ x: startX, y: startY });

      for (let i = 1; i < segments; i++) {
        const progress = i / segments;
        const x = startX + (endX - startX) * progress + (Math.random() - 0.5) * variance;
        const y = startY + (endY - startY) * progress;
        points.push({ x, y });
      }

      points.push({ x: endX, y: endY });
      return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    };

    const newBolts = [
      { id: 1, path: generateBolt(targetX, targetY, 0, 100), delay: 0 },
      { id: 2, path: generateBolt(targetX, targetY, -40, 60), delay: 0.06 },
      { id: 3, path: generateBolt(targetX, targetY, 40, 60), delay: 0.1 },
    ];
    setBolts(newBolts);

    // Flash màn hình
    const createFlash = (delay: number, opacity: number) => {
      setTimeout(() => {
        const flash = document.createElement("div");
        flash.style.cssText = `
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,255,136,0.3) 0%, rgba(255,255,255,0.6) 50%, rgba(0,255,255,0.3) 100%);
          z-index: 99999;
          pointer-events: none;
          opacity: ${opacity};
        `;
        document.body.appendChild(flash);
        gsap.to(flash, { opacity: 0, duration: 0.25, ease: "power2.out", onComplete: () => flash.remove() });
      }, delay);
    };

    createFlash(0, 0.9);
    createFlash(250, 0.6);
    createFlash(400, 0.4);

    // Rung màn hình
    setTimeout(() => {
      const shakeTimeline = gsap.timeline();
      shakeTimeline
        .to("body", { x: 15, y: -8, duration: 0.05, ease: "none" })
        .to("body", { x: -15, y: 8, duration: 0.05, ease: "none" })
        .to("body", { x: 12, y: -5, duration: 0.05, ease: "none" })
        .to("body", { x: -12, y: 5, duration: 0.05, ease: "none" })
        .to("body", { x: 8, y: -3, duration: 0.05, ease: "none" })
        .to("body", { x: -8, y: 3, duration: 0.05, ease: "none" })
        .to("body", { x: 4, y: -1, duration: 0.05, ease: "none" })
        .to("body", { x: 0, y: 0, duration: 0.15, ease: "power2.out" });
    }, 80);

    // Kết thúc sau 1.8s
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, [targetX, targetY, onFinish]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 99998 }}>
      <svg className="w-full h-full" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="impactGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#00ff88" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00ffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bolts.map((bolt) => (
          <g key={bolt.id}>
            {/* Outer glow */}
            <path
              d={bolt.path}
              stroke="#00ffff"
              strokeWidth="30"
              fill="none"
              opacity="0"
              style={{ filter: "blur(15px)" }}
            >
              <animate attributeName="opacity" values="0;0.7;0.4;0.6;0.3;0" dur="1.2s" begin={`${bolt.delay}s`} fill="freeze" />
            </path>
            {/* Main bolt */}
            <path
              d={bolt.path}
              stroke="#00ff88"
              strokeWidth="6"
              fill="none"
              opacity="0"
              style={{ filter: "url(#glow)" }}
            >
              <animate attributeName="opacity" values="0;1;0.5;1;0.3;1;0.1;0" dur="1.2s" begin={`${bolt.delay}s`} fill="freeze" />
              <animate attributeName="stroke-width" values="6;10;6;8;5;6;3" dur="1.2s" begin={`${bolt.delay}s`} fill="freeze" />
            </path>
            {/* Core white */}
            <path d={bolt.path} stroke="#ffffff" strokeWidth="2" fill="none" opacity="0">
              <animate attributeName="opacity" values="0;1;0.6;1;0.4;0" dur="1.2s" begin={`${bolt.delay}s`} fill="freeze" />
            </path>
          </g>
        ))}

        {/* Impact explosion at target */}
        <circle cx={targetX} cy={targetY} r="5" fill="url(#impactGlow)" opacity="0">
          <animate attributeName="r" values="5;100;80" dur="1s" fill="freeze" />
          <animate attributeName="opacity" values="0;1;0" dur="1s" fill="freeze" />
        </circle>

        {/* Spark particles at impact */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const distance = 60 + Math.random() * 40;
          const endX = targetX + Math.cos(angle) * distance;
          const endY = targetY + Math.sin(angle) * distance;
          return (
            <circle key={i} cx={targetX} cy={targetY} r="3" fill="#00ff88" opacity="0">
              <animate attributeName="cx" values={`${targetX};${endX}`} dur="0.6s" begin="0.1s" fill="freeze" />
              <animate attributeName="cy" values={`${targetY};${endY}`} dur="0.6s" begin="0.1s" fill="freeze" />
              <animate attributeName="opacity" values="0;1;0" dur="0.6s" begin="0.1s" fill="freeze" />
              <animate attributeName="r" values="4;2;0" dur="0.6s" begin="0.1s" fill="freeze" />
            </circle>
          );
        })}
      </svg>
    </div>,
    document.body
  );
};

export const LightningUploadProgress: React.FC<LightningUploadProgressProps> = ({
  value,
  max = 100,
  className,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; size: number; color: string; duration: number }[]>([]);
  const [lightnings, setLightnings] = useState<{ id: number; x: number; y: number; length: number; angle: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showThunder, setShowThunder] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const sparkIdRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const percentage = Math.min((value / max) * 100, 100);

  const createEffects = useCallback(() => {
    if (!containerRef.current || percentage >= 100) return;

    const containerWidth = containerRef.current.offsetWidth;
    const progressX = (percentage / 100) * containerWidth;

    const newSparks: typeof sparks = [];
    const sparkCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < sparkCount; i++) {
      sparkIdRef.current += 1;
      const colors = ["#00ff88", "#00ffff", "#88ff00", "#ffffff"];
      newSparks.push({
        id: sparkIdRef.current,
        x: progressX - 2 + Math.random() * 4,
        y: Math.random() * 8,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 0.3 + Math.random() * 0.3,
      });
    }

    setSparks((prev) => [...prev.slice(-20), ...newSparks]);

    if (Math.random() < 0.3) {
      sparkIdRef.current += 1;
      const angles = [-Math.PI / 4, -Math.PI / 3, -Math.PI / 2, -Math.PI * 0.6, Math.PI / 4, Math.PI / 3, Math.PI / 2];
      setLightnings((prev) => [
        ...prev.slice(-5),
        {
          id: sparkIdRef.current,
          x: progressX,
          y: 4,
          length: 15 + Math.random() * 20,
          angle: angles[Math.floor(Math.random() * angles.length)],
        },
      ]);
    }
  }, [percentage]);

  useEffect(() => {
    if (percentage > 0 && percentage < 100) {
      intervalRef.current = setInterval(createEffects, 80);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [percentage, createEffects]);

  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, { width: `${percentage}%`, duration: 0.3, ease: "power2.out" });
  }, [percentage]);

  useEffect(() => {
    if (percentage >= 100 && !isComplete && containerRef.current) {
      setIsComplete(true);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Lấy vị trí chính xác của item trên màn hình
      const rect = containerRef.current.getBoundingClientRect();
      setTargetPosition({ x: rect.left + rect.width / 2, y: rect.top });

      setTimeout(() => setShowThunder(true), 200);
    }
  }, [percentage, isComplete]);

  const handleThunderFinish = useCallback(() => {
    setShowThunder(false);
    onComplete?.();
  }, [onComplete]);

  return (
    <div className={cn("relative", className)}>
      <div ref={containerRef} className="relative h-1 bg-muted overflow-visible">
        <div
          ref={progressRef}
          className="absolute inset-y-0 left-0 bg-[#00ff88]"
          style={{ width: 0, boxShadow: "0 0 8px #00ff88, 0 0 16px #00ff88" }}
        />
        {sparks.map((spark) => (
          <PixelSpark key={spark.id} x={spark.x} y={spark.y} size={spark.size} color={spark.color} duration={spark.duration} />
        ))}
        {lightnings.map((l) => (
          <MiniLightning key={l.id} startX={l.x} startY={l.y} length={l.length} angle={l.angle} />
        ))}
      </div>

      {showThunder && <ThunderStrikePortal targetX={targetPosition.x} targetY={targetPosition.y} onFinish={handleThunderFinish} />}
    </div>
  );
};

export default LightningUploadProgress;
