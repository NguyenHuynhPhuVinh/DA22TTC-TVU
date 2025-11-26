"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TechLayout } from "@/components/layout";
import {
  ParticleField,
  DataStream,
  GlitchText,
  TechBadge,
  PulseRing,
  NeonBorder,
  CyberText,
  HackerText,
  VoidText,
  VoidZone,
  TechRubikCube,
} from "@/components/ui/tech";
import { HardDrive, FileText, Lock, ChevronLeft, ChevronRight, Database } from "lucide-react";

interface WorldCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: "available" | "coming_soon" | "locked";
  href?: string;
  stats?: { label: string; value: string }[];
}

const worlds: WorldCard[] = [
  {
    id: "files",
    title: "FILE_SYSTEM",
    subtitle: "Google Drive Storage",
    description: "Quản lý và lưu trữ tài liệu với khả năng tìm kiếm AI và đồng bộ Google Drive realtime.",
    icon: <HardDrive className="w-12 h-12" />,
    color: "#00ff88",
    status: "available",
    href: "/files",
    stats: [
      { label: "STORAGE", value: "2 TB" },
      { label: "SYNC", value: "REALTIME" },
    ],
  },
  {
    id: "txt",
    title: "TXT_STORAGE",
    subtitle: "Code & Notes",
    description: "Lưu trữ văn bản, code snippets và ghi chú với syntax highlighting tự động.",
    icon: <FileText className="w-12 h-12" />,
    color: "#00d4ff",
    status: "available",
    href: "/txt",
    stats: [
      { label: "FORMAT", value: "TXT/CODE" },
      { label: "HIGHLIGHT", value: "AUTO" },
    ],
  },
  {
    id: "coming",
    title: "NULL_ZONE",
    subtitle: "Coming Soon",
    description: "Khu vực đang được phát triển. Tính năng mới sẽ sớm được cập nhật.",
    icon: <Lock className="w-12 h-12" />,
    color: "#666666",
    status: "coming_soon",
    stats: [
      { label: "STATUS", value: "DEV" },
      { label: "ETA", value: "TBD" },
    ],
  },
];

export default function Home() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  // No GSAP needed - using framer-motion instead

  const goToWorld = (index: number) => {
    if (index >= 0 && index < worlds.length) {
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => goToWorld(currentIndex - 1);
  const handleNext = () => goToWorld(currentIndex + 1);

  const handleEnterWorld = (world: WorldCard) => {
    if (world.status === "available" && world.href) {
      router.push(world.href);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    scrollStartX.current = currentIndex * window.innerWidth;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 100) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <TechLayout showGrid={false} accentColor="#00ff88">
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField color="#00ff88" particleCount={40} speed={0.3} connectDistance={120} className="opacity-20" />
        <DataStream color="#00ff88" density={6} speed={50} className="opacity-5" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-screen w-screen overflow-hidden relative"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#00ff88] flex items-center justify-center">
                <Database className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <CyberText className="text-lg font-bold" primaryColor="#00ff88" secondaryColor="#00d4ff">TomiSakaeTech</CyberText>
                <p className="text-[10px] text-muted-foreground font-mono">SELECT_WORLD</p>
              </div>
            </div>
            <TechBadge variant="success" size="sm" pulse>v2.0</TechBadge>
          </div>
        </header>

        {/* World Cards Container */}
        <motion.div
          animate={{ x: -currentIndex * (typeof window !== 'undefined' ? window.innerWidth : 0) }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="flex h-full"
          style={{ width: `${worlds.length * 100}vw` }}
        >
          {worlds.map((world, index) => (
            <div
              key={world.id}
              className="w-screen h-screen flex items-center justify-center p-8"
            >
              <div className="max-w-lg w-full">
                {/* World Card - Wrap with VoidZone for coming_soon */}
                <VoidZone active={world.status === "coming_soon"} intensity="medium">
                  <div
                    className={`relative border-2 p-8 transition-all duration-300 cursor-pointer group ${
                      world.status === "available"
                        ? "border-current"
                        : "border-muted-foreground/30"
                    }`}
                    style={{ 
                      borderColor: world.status === "available" ? world.color : undefined,
                      ['--shadow-color' as string]: world.color,
                    }}
                    onMouseEnter={(e) => {
                      if (world.status === "available") {
                        e.currentTarget.style.boxShadow = `0 0 30px ${world.color}4D`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '';
                    }}
                    onClick={() => handleEnterWorld(world)}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: world.color }} />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: world.color }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: world.color }} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: world.color }} />

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <PulseRing color={world.color} size={100} rings={world.status === "available" ? 3 : 0} speed={3} />
                        <div className="absolute inset-0 flex items-center justify-center" style={{ color: world.color }}>
                          {world.icon}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-4">
                      {world.status === "available" ? (
                        <HackerText className="text-2xl font-bold mb-1" color={world.color} triggerOnHover>
                          {world.title}
                        </HackerText>
                      ) : (
                        <VoidText className="text-2xl font-bold mb-1" color="#555555" voidColor="#111111">
                          {world.title}
                        </VoidText>
                      )}
                      <p className="text-xs text-muted-foreground font-mono">{world.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                      {world.description}
                    </p>

                    {/* Stats */}
                    {world.stats && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {world.stats.map((stat) => (
                          <div key={stat.label} className="text-center p-3 bg-muted/20 border border-border">
                            <p className="text-[10px] text-muted-foreground font-mono mb-1">{stat.label}</p>
                            <p className="text-sm font-mono font-bold" style={{ color: world.color }}>{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Enter Button */}
                    {world.status === "available" ? (
                      <NeonBorder color={world.color} intensity="medium" animated>
                        <button className="w-full py-4 font-mono text-sm font-bold tracking-wider transition-colors hover:bg-white/5">
                          ENTER_WORLD →
                        </button>
                      </NeonBorder>
                    ) : (
                      <div className="w-full py-4 text-center font-mono text-sm text-muted-foreground border border-dashed border-muted-foreground/30">
                        COMING_SOON
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <TechBadge
                        variant={world.status === "available" ? "success" : "warning"}
                        size="sm"
                        pulse={world.status === "available"}
                      >
                        {world.status === "available" ? "ACTIVE" : "LOCKED"}
                      </TechBadge>
                    </div>
                  </div>
                </VoidZone>

                {/* World Index */}
                <div className="text-center mt-6">
                  <span className="text-xs font-mono text-muted-foreground">
                    WORLD_{String(index + 1).padStart(2, "0")} / {String(worlds.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 border border-border bg-background/80 backdrop-blur-xs disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          style={{ 
            ['--hover-color' as string]: worlds[currentIndex].color 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = worlds[currentIndex].color;
            e.currentTarget.style.color = worlds[currentIndex].color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.color = '';
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === worlds.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 border border-border bg-background/80 backdrop-blur-xs disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = worlds[currentIndex].color;
            e.currentTarget.style.color = worlds[currentIndex].color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.color = '';
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {worlds.map((world, index) => (
            <button
              key={world.id}
              onClick={() => goToWorld(index)}
              className={`w-3 h-3 border transition-all ${
                currentIndex === index
                  ? "scale-125"
                  : "border-muted-foreground hover:border-foreground"
              }`}
              style={currentIndex === index ? { 
                backgroundColor: world.color, 
                borderColor: world.color 
              } : undefined}
            />
          ))}
        </div>

        {/* Swipe Hint */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <GlitchText className="text-[10px] font-mono text-muted-foreground" intensity="low">
            ← SWIPE_TO_NAVIGATE →
          </GlitchText>
        </div>

        {/* 3D Rubik Cube */}
        <TechRubikCube size={30} color="#00ff88" />
      </motion.div>
    </TechLayout>
  );
}
