"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import hljs from "highlight.js";
import { TechBadge } from "@/components/ui/tech";
import { Copy, Download, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface TxtNoteListProps {
  notes: Note[];
  expandedNotes: { [key: string]: boolean };
  currentPage: number;
  onToggleExpand: (id: string) => void;
  onCopy: (content: string) => void;
  onDownload: (content: string, timestamp: number) => void;
  onDelete: (id: string) => void;
}

export const TxtNoteList: React.FC<TxtNoteListProps> = ({
  notes,
  expandedNotes,
  currentPage,
  onToggleExpand,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("vi-VN");
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const countLines = (text: string) => text.split("\n").length;

  useEffect(() => {
    if (!listRef.current || notes.length === 0) return;

    const items = listRef.current.querySelectorAll(".list-item");
    gsap.fromTo(
      items,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power3.out",
      }
    );
  }, [notes, currentPage]);

  return (
    <div ref={listRef} className="flex flex-col gap-2">
      {notes.map((note, index) => {
        const lineCount = countLines(note.content);
        const shouldTruncate = lineCount > 5;
        const isExpanded = expandedNotes[note.id];

        return (
          <article
            key={note.id}
            className="list-item group border border-border hover:border-[#00d4ff] transition-all"
          >
            <div className="p-5">
              <div className="flex items-start gap-6">
                {/* Index */}
                <div className="w-20 shrink-0">
                  <TechBadge variant="success" size="sm">
                    #{String((currentPage - 1) * 6 + index + 1).padStart(3, "0")}
                  </TechBadge>
                  <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                    {lineCount} LINES
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <pre
                    className={cn(
                      "overflow-x-auto",
                      !isExpanded && shouldTruncate && "max-h-[120px] overflow-y-hidden"
                    )}
                  >
                    <code
                      className="hljs block p-4 text-[12px] leading-relaxed rounded-none bg-[#0d1117] font-mono"
                      dangerouslySetInnerHTML={{
                        __html: hljs.highlightAuto(note.content).value,
                      }}
                    />
                  </pre>
                  
                  {shouldTruncate && (
                    <button
                      onClick={() => onToggleExpand(note.id)}
                      className="mt-2 flex items-center gap-1 text-[10px] font-mono text-[#00d4ff] hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          COLLAPSE
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          SHOW_MORE
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Meta & Actions */}
                <div className="w-36 shrink-0 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {formatDate(note.timestamp)}
                    </div>
                    <div className="text-[10px] font-mono text-[#00d4ff]">
                      {formatTime(note.timestamp)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onCopy(note.content)}
                      className="p-1.5 text-muted-foreground hover:text-[#00d4ff] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDownload(note.content, note.timestamp)}
                      className="p-1.5 text-muted-foreground hover:text-[#00d4ff] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(note.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TxtNoteList;
