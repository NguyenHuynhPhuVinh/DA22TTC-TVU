"use client";
import React, { useEffect, useState, useRef } from "react";
import "highlight.js/styles/github-dark.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import gsap from "gsap";
import { useNote } from "@/components/hooks/note";
import { TechLayout } from "@/components/layout";
import { 
  ParticleField, 
  DataStream, 
  RadarScan, 
  LoadingDots,
  StatusIndicator,
} from "@/components/ui/tech";
import {
  TxtHero,
  TxtNavbar,
  TxtToolbar,
  TxtNoteCard,
  TxtNoteList,
  TxtPagination,
  TxtEmptyState,
  TxtAddDialog,
  TxtDeleteDialog,
} from "@/components/txt";

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
  const gridRef = useRef<HTMLDivElement>(null);

  // Animate notes on page change - items visible by default
  useEffect(() => {
    if (!loading && gridRef.current && paginatedNotes.length > 0) {
      const items = gridRef.current.querySelectorAll(".note-item");
      gsap.fromTo(
        items,
        { opacity: 0.5, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.out",
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

  return (
    <TechLayout showGrid={false}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField 
          color="#00ff88" 
          particleCount={30} 
          speed={0.3} 
          connectDistance={150}
          className="opacity-30"
        />
        <DataStream 
          color="#00ff88" 
          density={10} 
          speed={80}
          className="opacity-10"
        />
      </div>

      {/* Navigation */}
      <TxtNavbar
        totalNotes={filteredNotes.length}
        onBack={handleGoBack}
        onAdd={() => setShowAddForm(true)}
      />

      {/* Hero Section */}
      <TxtHero totalNotes={filteredNotes.length} />

      {/* Toolbar */}
      <TxtToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportAll={handleDownloadAll}
        totalResults={filteredNotes.length}
        disabled={loading}
      />

      {/* Content */}
      <main className="px-6 lg:px-12 py-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-border p-6 animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="h-4 w-20 bg-muted/30 mb-4" />
                    <div className="h-32 bg-muted/30 mb-4" />
                    <div className="h-4 w-16 bg-muted/30" />
                  </div>
                ))}
              </div>
              {/* Loading overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <RadarScan size={80} color="#00ff88" speed={2} />
                  <div className="flex items-center gap-2">
                    <LoadingDots color="#00ff88" size={6} />
                    <span className="text-xs font-mono text-muted-foreground">LOADING_NOTES</span>
                  </div>
                </div>
              </div>
            </div>
          ) : paginatedNotes.length === 0 ? (
            <TxtEmptyState
              isSearching={!!searchQuery}
              onCreateNew={() => setShowAddForm(true)}
            />
          ) : (
            <>
              {viewMode === "grid" ? (
                <div
                  ref={gridRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {paginatedNotes.map((note, index) => (
                    <div key={note.id} className="note-item">
                      <TxtNoteCard
                        id={note.id}
                        content={note.content}
                        timestamp={note.timestamp}
                        index={(currentPage - 1) * 6 + index + 1}
                        isExpanded={expandedNotes[note.id] || false}
                        onToggleExpand={() => toggleNoteExpansion(note.id)}
                        onCopy={() => handleCopy(note.content)}
                        onDownload={() => handleDownload(note.content, note.timestamp)}
                        onDelete={() => {
                          setDeleteMode(note.id);
                          setDeleteCode("");
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div ref={gridRef}>
                  <TxtNoteList
                    notes={paginatedNotes}
                    expandedNotes={expandedNotes}
                    currentPage={currentPage}
                    onToggleExpand={toggleNoteExpansion}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onDelete={(id) => {
                      setDeleteMode(id);
                      setDeleteCode("");
                    }}
                  />
                </div>
              )}

              <TxtPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          )}
        </div>
      </main>

      {/* Add Dialog */}
      <TxtAddDialog
        open={showAddForm}
        onOpenChange={setShowAddForm}
        value={newNote}
        onChange={setNewNote}
        onSave={handleAddNote}
      />

      {/* Delete Dialog */}
      <TxtDeleteDialog
        open={deleteMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMode(null);
            setDeleteCode("");
          }
        }}
        confirmCode={deleteCode}
        onConfirmCodeChange={setDeleteCode}
        onConfirm={() => handleDeleteNote(deleteMode!)}
      />

      {/* Status indicator - Fixed bottom right */}
      <div className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-3 border border-border bg-background/95 backdrop-blur-sm px-4 py-2">
        <StatusIndicator status={loading ? "loading" : "online"} size="sm" />
        <span className="text-[10px] font-mono text-muted-foreground">
          {loading ? "SYNCING" : `${filteredNotes.length}_NOTES`}
        </span>
      </div>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#00ff88",
            color: "#000",
            borderRadius: 0,
            fontSize: "11px",
            fontFamily: "monospace",
            fontWeight: "bold",
          },
        }}
      />
    </TechLayout>
  );
};

export default TxtPage;
