"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import gsap from "gsap";
import { GlitchText, StatusIndicator, TechButton } from "@/components/ui/tech";
import { NoteTechIcon, SearchTechIcon, ChipIcon } from "@/components/icons/TechIcons";
import { RefreshCw, Sparkles } from "lucide-react";

interface TechHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAISearch: boolean;
  onToggleAISearch: () => void;
  onSearch: () => void;
  onReloadCache?: () => void;
  isReloading?: boolean;
}

export const TechHeader: React.FC<TechHeaderProps> = ({
  searchTerm,
  onSearchChange,
  isAISearch,
  onToggleAISearch,
  onSearch,
  onReloadCache,
  isReloading,
}) => {
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".header-element",
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-background/95 border-b border-border"
    >
      {/* Top bar with status */}
      <div className="border-b border-border/50 px-6 py-1.5">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusIndicator status="online" label="System" size="sm" />
            <span className="text-[10px] text-muted-foreground font-mono tracking-wider">
              v2.0.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-muted-foreground font-mono">
              {new Date().toLocaleDateString("vi-VN")}
            </span>
            <ChipIcon size={14} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">
          {/* Logo */}
          <div ref={logoRef} className="header-element flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 border border-foreground/30 flex items-center justify-center">
                <span className="text-lg font-bold font-mono">D</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00ff88]" />
            </div>
            <div>
              <GlitchText className="text-sm font-bold tracking-tight" intensity="low">
                DA22TTC
              </GlitchText>
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider">
                FILE SYSTEM
              </p>
            </div>
          </div>

          {/* Search */}
          <div ref={searchRef} className="header-element flex-1 max-w-2xl">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchTechIcon size={18} className="text-muted-foreground group-focus-within:text-foreground transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={isAISearch ? "// AI SEARCH MODE" : "// SEARCH FILES..."}
                className="w-full bg-muted/30 border border-border focus:border-foreground/50 pl-12 pr-24 py-3 text-sm font-mono outline-none transition-all placeholder:text-muted-foreground/50"
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
              
              {/* Search border animation */}
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-[#00ff88] transition-all duration-300"
                style={{ width: searchFocused ? "100%" : "0%" }}
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isAISearch && (
                  <button
                    onClick={onSearch}
                    className="px-2 py-1 text-xs font-mono text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors"
                  >
                    RUN
                  </button>
                )}
                <button
                  onClick={onToggleAISearch}
                  className={`p-2 transition-colors ${
                    isAISearch ? "text-[#00ff88]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="header-element flex items-center gap-2">
            {onReloadCache && (
              <button
                onClick={onReloadCache}
                disabled={isReloading}
                className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all disabled:opacity-30"
              >
                <RefreshCw className={`w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
              </button>
            )}

            <TechButton
              variant="secondary"
              onClick={() => router.push("/txt")}
              icon={<NoteTechIcon size={16} />}
            >
              <span className="font-mono text-xs">TXT</span>
            </TechButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TechHeader;
