"use client";
import React, { useEffect, useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import gsap from "gsap";
import { useNote } from "@/components/hooks/note";
import { TechLayout } from "@/components/layout";
import { TechCard, TechButton, GlitchText, TypeWriter, TechProgress, StatusIndicator } from "@/components/ui/tech";
import { NoteTechIcon, CodeIcon, TerminalIcon } from "@/components/icons/TechIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  X,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

const TxtPage = () => {
  const {
    newNote,
    setNewNote,
    loading,
    expandedNotes,
    deleteMode,
    setDeleteMode,
    deleteCode,
    setDeleteCode,
    handleAddNote,
    handleDeleteNote,
    handleCopy,
    handleGoBack,
    toggleNoteExpansion,
    countLines,
    currentPage,
    totalPages,
    paginatedNotes,
    goToPage,
    searchQuery,
    setSearchQuery,
    filteredNotes,
  } = useNote();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [heroComplete, setHeroComplete] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Hero animation
  useEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".hero-element",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            onComplete: () => setHeroComplete(true),
          }
        );
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  // Notes animation
  useEffect(() => {
    if (!loading && gridRef.current && paginatedNotes.length > 0) {
      const items = gridRef.current.querySelectorAll(".note-card");
      gsap.fromTo(
        items,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "power3.out",
        }
      );
    }
  }, [loading, paginatedNotes, currentPage, viewMode]);

  useEffect(() => {
    document.body.style.overflow = deleteMode ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [deleteMode]);

  const handleDownload = (content: string, timestamp: number) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `note-${new Date(timestamp).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("DOWNLOADED");
  };

  const handleDownloadAll = () => {
    if (filteredNotes.length === 0) return;
    const allContent = filteredNotes
      .map(
        (note, i) =>
          `// NOTE_${String(i + 1).padStart(3, "0")} [${new Date(note.timestamp).toISOString()}]\n${note.content}`
      )
      .join("\n\n---\n\n");
    const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-notes-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`EXPORTED_${filteredNotes.length}_NOTES`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN");
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TechLayout showGrid showCircuits={false}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        {/* Top status bar */}
        <div className="border-b border-border/50 px-6 py-1.5">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <StatusIndicator status="online" label="TXT_MODULE" size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-muted-foreground font-mono">
                {filteredNotes.length} RECORDS
              </span>
              <TerminalIcon size={14} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK</span>
            </button>

            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff88]" />
              <span className="text-xs font-mono font-bold">TXT://</span>
            </div>

            <TechButton
              variant="secondary"
              size="sm"
              onClick={() => setShowAddForm(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              <span className="font-mono text-xs">NEW</span>
            </TechButton>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="pt-36 pb-16 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl">
            <div className="hero-element flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-[#00ff88]" />
              <span className="text-[10px] font-mono text-muted-foreground tracking-wider">
                TEXT_STORAGE_SYSTEM
              </span>
            </div>
            
            <h1 className="hero-element text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] mb-6 font-mono">
              {heroComplete ? (
                <GlitchText intensity="low">TXT_</GlitchText>
              ) : (
                <TypeWriter text="TXT_" speed={100} cursor={false} onComplete={() => setHeroComplete(true)} />
              )}
              <br />
              <span className="text-muted-foreground">STORAGE</span>
            </h1>
            
            <p className="hero-element text-sm text-muted-foreground font-mono leading-relaxed">
              // Lưu trữ code snippets, ghi chú và văn bản
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[88px] z-40 bg-background border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4 gap-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="// SEARCH..."
                className="w-full bg-transparent pl-6 pr-8 py-2 text-xs font-mono outline-none placeholder:text-muted-foreground/50"
              />
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-[#00ff88] transition-all duration-300"
                style={{ width: searchFocused ? "100%" : "0%" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownloadAll}
                disabled={filteredNotes.length === 0}
                className="text-xs font-mono text-muted-foreground hover:text-[#00ff88] transition-colors disabled:opacity-30"
              >
                EXPORT_ALL
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="px-6 lg:px-12 py-12">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-2"
              )}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border border-border p-6 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="h-3 w-24 bg-muted/30 mb-4" />
                  <div className="h-24 bg-muted/30 mb-4" />
                  <div className="h-3 w-16 bg-muted/30" />
                </div>
              ))}
            </div>
          ) : paginatedNotes.length === 0 ? (
            <div className="py-32 text-center">
              <CodeIcon size={64} className="mx-auto text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground mb-2 font-mono">
                {searchQuery ? "NO_RESULTS_FOUND" : "EMPTY_DATABASE"}
              </p>
              <p className="text-xs text-muted-foreground/60 font-mono mb-8">
                {searchQuery ? "// Try different keywords" : "// Start adding notes"}
              </p>
              {!searchQuery && (
                <TechButton variant="secondary" onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-mono text-xs">CREATE_FIRST</span>
                </TechButton>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div
                  ref={gridRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {paginatedNotes.map((note, index) => (
                    <TechCard
                      key={note.id}
                      className={cn(
                        "note-card p-5 flex flex-col",
                        deleteMode === note.id && "border-destructive"
                      )}
                      corners
                      hover
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#00ff88]" />
                          <span className="text-[10px] font-mono text-muted-foreground">
                            NOTE_{String((currentPage - 1) * 6 + index + 1).padStart(3, "0")}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {formatTime(note.timestamp)}
                        </span>
                      </div>

                      {/* Code */}
                      <div className="flex-1 mb-4">
                        <div className="relative">
                          <pre
                            className={cn(
                              "overflow-x-auto",
                              !expandedNotes[note.id] && "max-h-[140px] overflow-y-hidden"
                            )}
                          >
                            <code
                              className="hljs block p-4 text-[12px] leading-relaxed rounded-none bg-[#0d1117] font-mono"
                              dangerouslySetInnerHTML={{
                                __html: hljs.highlightAuto(note.content).value,
                              }}
                            />
                          </pre>
                          {countLines(note.content) > 6 && !expandedNotes[note.id] && (
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d1117] to-transparent" />
                          )}
                        </div>
                        {countLines(note.content) > 6 && (
                          <button
                            onClick={() => toggleNoteExpansion(note.id)}
                            className="mt-2 text-[10px] font-mono text-[#00ff88] hover:underline"
                          >
                            {expandedNotes[note.id] ? "COLLAPSE" : "EXPAND"}
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {formatDate(note.timestamp)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(note.content)}
                            className="p-1.5 text-muted-foreground hover:text-[#00ff88] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownload(note.content, note.timestamp)}
                            className="p-1.5 text-muted-foreground hover:text-[#00ff88] transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteMode(note.id);
                              setDeleteCode("");
                            }}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </TechCard>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div ref={gridRef} className="border border-border divide-y divide-border">
                  {paginatedNotes.map((note, index) => (
                    <article
                      key={note.id}
                      className={cn(
                        "note-card group p-5",
                        deleteMode === note.id && "bg-destructive/5"
                      )}
                    >
                      <div className="flex items-start gap-6">
                        {/* Index */}
                        <div className="w-16 shrink-0 pt-1">
                          <span className="text-[10px] font-mono text-[#00ff88]">
                            #{String((currentPage - 1) * 6 + index + 1).padStart(3, "0")}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <pre
                            className={cn(
                              "overflow-x-auto",
                              !expandedNotes[note.id] && "max-h-[100px] overflow-y-hidden"
                            )}
                          >
                            <code
                              className="hljs block p-4 text-[12px] leading-relaxed rounded-none bg-[#0d1117] font-mono"
                              dangerouslySetInnerHTML={{
                                __html: hljs.highlightAuto(note.content).value,
                              }}
                            />
                          </pre>
                          {countLines(note.content) > 4 && (
                            <button
                              onClick={() => toggleNoteExpansion(note.id)}
                              className="mt-2 text-[10px] font-mono text-[#00ff88] hover:underline"
                            >
                              {expandedNotes[note.id] ? "COLLAPSE" : "EXPAND"}
                            </button>
                          )}
                        </div>

                        {/* Meta & Actions */}
                        <div className="w-32 shrink-0 flex flex-col items-end gap-3">
                          <div className="text-right">
                            <div className="text-[10px] font-mono text-muted-foreground">
                              {formatDate(note.timestamp)}
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground">
                              {formatTime(note.timestamp)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(note.content)}
                              className="p-1.5 text-muted-foreground hover:text-[#00ff88] transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(note.content, note.timestamp)}
                              className="p-1.5 text-muted-foreground hover:text-[#00ff88] transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteMode(note.id);
                                setDeleteCode("");
                              }}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 pt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={cn(
                          "w-10 h-10 text-xs font-mono transition-colors",
                          currentPage === page
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {String(page).padStart(2, "0")}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-2xl border-border rounded-none font-mono">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal font-mono flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ff88]" />
              NEW_NOTE
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TextareaAutosize
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="// Paste code, text or notes here..."
              className="w-full min-h-[240px] p-4 bg-[#0d1117] text-sm font-mono leading-relaxed resize-none outline-none border border-border focus:border-[#00ff88] transition-colors text-white"
              minRows={10}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowAddForm(false)}
              className="rounded-none font-mono text-xs"
            >
              CANCEL
            </Button>
            <Button
              onClick={() => {
                handleAddNote();
                setShowAddForm(false);
              }}
              disabled={!newNote.trim()}
              className="rounded-none font-mono text-xs bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
            >
              SAVE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMode(null);
            setDeleteCode("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md border-border rounded-none font-mono">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal font-mono text-destructive">
              DELETE_NOTE
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs font-mono text-muted-foreground py-2">
            // Type <span className="text-[#00ff88]">XOA</span> to confirm
          </p>
          <Input
            value={deleteCode}
            onChange={(e) => setDeleteCode(e.target.value)}
            placeholder="CONFIRMATION_CODE"
            className="rounded-none border-border font-mono text-xs text-center"
            autoFocus
          />
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteMode(null);
                setDeleteCode("");
              }}
              className="rounded-none font-mono text-xs"
            >
              CANCEL
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteNote(deleteMode!)}
              disabled={deleteCode.toUpperCase() !== "XOA"}
              className="rounded-none font-mono text-xs"
            >
              DELETE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#00ff88",
            color: "#000",
            borderRadius: 0,
            fontSize: "11px",
            fontFamily: "monospace",
          },
        }}
      />
    </TechLayout>
  );
};

export default TxtPage;
