"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import hljs from "highlight.js";
import { TechBadge } from "@/components/ui/tech";
import { Copy, Download, Trash2, ChevronDown, ChevronUp, Terminal, Cpu, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface TxtNoteListProps {
  notes: Note[];
  currentPage: number;
  onView: (note: Note, index: number) => void;
  onCopy: (content: string) => void;
  onDownload: (content: string, timestamp: number) => void;
  onDelete: (id: string) => void;
}

const VISIBLE_COUNT = 3; // Số note hiển thị vừa màn hình

export const TxtNoteList: React.FC<TxtNoteListProps> = ({
  notes,
  currentPage,
  onView,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("vi-VN");
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const countLines = (text: string) => text.split("\n").length;

  // Reset khi đổi page
  useEffect(() => {
    setStartIndex(0);
  }, [currentPage]);

  // Visible notes
  const visibleNotes = notes.slice(startIndex, startIndex + VISIBLE_COUNT);
  const canScrollUp = startIndex > 0;
  const canScrollDown = startIndex + VISIBLE_COUNT < notes.length;

  // Scroll handlers với animation
  const scrollUp = useCallback(() => {
    if (!canScrollUp || !listRef.current) return;
    
    gsap.to(listRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setStartIndex(prev => Math.max(0, prev - 1));
        gsap.fromTo(listRef.current, 
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    });
  }, [canScrollUp]);

  const scrollDown = useCallback(() => {
    if (!canScrollDown || !listRef.current) return;
    
    gsap.to(listRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setStartIndex(prev => Math.min(notes.length - VISIBLE_COUNT, prev + 1));
        gsap.fromTo(listRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    });
  }, [canScrollDown, notes.length]);

  // Keyboard + wheel navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollDown();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        e.preventDefault();
        if (e.deltaY > 0) scrollDown();
        else scrollUp();
      }
    };

    const container = containerRef.current;
    window.addEventListener("keydown", handleKeyDown);
    container?.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [scrollUp, scrollDown]);

  // Initial animation
  useEffect(() => {
    if (!listRef.current || notes.length === 0) return;
    const items = listRef.current.querySelectorAll(".list-item");
    gsap.fromTo(items,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }
    );
  }, [notes, currentPage]);

  if (notes.length === 0) return null;

  return (
    <div ref={containerRef} className="h-full flex flex-col relative">
      {/* Header với indicator */}
      <div className="shrink-0 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] border border-[#00d4ff]/30">
            <Terminal className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span className="text-[10px] font-mono text-[#00d4ff]">
              VIEWING_{String(startIndex + 1).padStart(2, "0")}-{String(Math.min(startIndex + VISIBLE_COUNT, notes.length)).padStart(2, "0")}/{String(notes.length).padStart(2, "0")}
            </span>
          </div>
        </div>
        
        {/* Scroll hint */}
        <div className="text-[9px] font-mono text-muted-foreground/50 flex items-center gap-2">
          <span>↑↓ SCROLL</span>
          <span className="w-1 h-1 bg-muted-foreground/30" />
          <span>WHEEL_ENABLED</span>
        </div>
      </div>

      {/* Scroll Up Button */}
      <button
        onClick={scrollUp}
        disabled={!canScrollUp}
        className={cn(
          "shrink-0 w-full py-2 mb-2 border flex items-center justify-center gap-2 transition-all duration-300",
          canScrollUp
            ? "border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] cursor-pointer"
            : "border-border/20 text-muted-foreground/20 cursor-not-allowed"
        )}
      >
        <ChevronUp className="w-4 h-4" />
        <span className="text-[10px] font-mono font-bold">
          {canScrollUp ? `LOAD_PREV (${startIndex} MORE)` : "TOP_REACHED"}
        </span>
        <ChevronUp className="w-4 h-4" />
        {canScrollUp && (
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#00d4ff]/50 to-transparent" />
        )}
      </button>

      {/* Notes List - each item stretches to fill available space */}
      <div ref={listRef} className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden pt-2">
        {visibleNotes.map((note, idx) => {
          const globalIndex = (currentPage - 1) * 6 + startIndex + idx + 1;
          const lineCount = countLines(note.content);

          return (
            <article
              key={note.id}
              className="list-item flex-1 min-h-0 group border border-[#00d4ff]/20 hover:border-[#00d4ff]/60 hover:translate-y-[-2px] bg-[#0a0a0f]/60 backdrop-blur-xs transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
              onClick={() => onView(note, globalIndex)}
            >
              {/* Item Header */}
              <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-[#00d4ff]/10 bg-[#00d4ff]/5 relative z-10">
                <div className="flex items-center gap-3">
                  <TechBadge variant="success" size="sm">
                    #{String(globalIndex).padStart(3, "0")}
                  </TechBadge>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                    <Cpu className="w-3 h-3" />
                    <span>{lineCount}L</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right text-[9px] font-mono">
                    <span className="text-muted-foreground">{formatDate(note.timestamp)}</span>
                    <span className="text-[#00d4ff] ml-2">{formatTime(note.timestamp)}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onCopy(note.content); }}
                      className="p-1.5 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDownload(note.content, note.timestamp); }}
                      className="p-1.5 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Item Content */}
              <div className="flex-1 min-h-0 p-3 overflow-hidden">
                <pre className="overflow-hidden h-full">
                  <code
                    className="hljs block p-2 text-[11px] leading-relaxed rounded-none bg-[#0d1117] font-mono h-full overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlightAuto(note.content).value,
                    }}
                  />
                </pre>
                <div className="absolute inset-x-3 bottom-3 h-8 bg-linear-to-t from-[#0d1117] to-transparent pointer-events-none" />
              </div>

              {/* View overlay on hover - positioned on article level */}
              <div className="absolute inset-0 bg-[#00d4ff]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117]/95 border border-[#00d4ff]/50 text-[9px] font-mono text-[#00d4ff]">
                  <Maximize2 className="w-3 h-3" />
                  VIEW_FULL
                </div>
              </div>

              {/* Scan line */}
              <div className="shrink-0 h-0.5 bg-linear-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
            </article>
          );
        })}
      </div>

      {/* Scroll Down Button */}
      <button
        onClick={scrollDown}
        disabled={!canScrollDown}
        className={cn(
          "shrink-0 w-full py-2 mt-2 border flex items-center justify-center gap-2 transition-all duration-300 relative",
          canScrollDown
            ? "border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] cursor-pointer"
            : "border-border/20 text-muted-foreground/20 cursor-not-allowed"
        )}
      >
        <ChevronDown className="w-4 h-4" />
        <span className="text-[10px] font-mono font-bold">
          {canScrollDown ? `LOAD_NEXT (${notes.length - startIndex - VISIBLE_COUNT} MORE)` : "END_REACHED"}
        </span>
        <ChevronDown className="w-4 h-4" />
        {canScrollDown && (
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#00d4ff]/50 to-transparent" />
        )}
      </button>

      {/* Side progress bar */}
      <div className="absolute right-0 top-16 bottom-16 w-1 flex flex-col gap-0.5">
        {notes.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "flex-1 transition-all duration-300",
              idx >= startIndex && idx < startIndex + VISIBLE_COUNT
                ? "bg-[#00d4ff] shadow-[0_0_6px_#00d4ff]"
                : "bg-[#00d4ff]/15"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default TxtNoteList;
