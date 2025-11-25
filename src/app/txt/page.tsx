"use client";
import React, { useEffect, useState } from "react";
import "highlight.js/styles/github-dark.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useNote } from "@/components/hooks/note";
import { TechLayout } from "@/components/layout";
import {
  ParticleField,
  DataStream,
  RadarScan,
  LoadingDots,
  GlitchText,
  CyberText,
  PixelText,
} from "@/components/ui/tech";
import {
  TxtToolbar,
  TxtNoteCard,
  TxtNoteList,
  TxtPagination,
  TxtEmptyState,
  TxtAddDialog,
  TxtDeleteDialog,
  TxtViewDialog,
} from "@/components/txt";
import { Home, Plus, FileText } from "lucide-react";

type ViewMode = "grid" | "list";

interface ViewingNote {
  note: { id: string; content: string; timestamp: number };
  index: number;
}

const TxtPage = () => {
  const {
    newNote,
    setNewNote,
    loading,
    deleteMode,
    setDeleteMode,
    deleteCode,
    setDeleteCode,
    handleAddNote,
    handleDeleteNote,
    handleCopy,
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
  const [viewingNote, setViewingNote] = useState<ViewingNote | null>(null);

  // Animation variants for notes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  useEffect(() => {
    document.body.style.overflow = deleteMode ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
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
      .map((note, i) => `// NOTE_${String(i + 1).padStart(3, "0")} [${new Date(note.timestamp).toISOString()}]\n${note.content}`)
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
    <TechLayout showGrid={false} accentColor="#00d4ff">
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField color="#00d4ff" particleCount={30} speed={0.3} connectDistance={150} className="opacity-20" />
        <DataStream color="#00d4ff" density={8} speed={60} className="opacity-5" />
      </div>

      <div className="h-screen flex flex-col overflow-hidden">
      {/* Simple Header */}
      <header className="shrink-0 z-50 bg-background/95 border-b border-border backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
              <span className="text-xs font-mono hidden sm:inline">HOME</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00d4ff]" />
              <CyberText className="text-sm font-bold">TXT_STORAGE</CyberText>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlitchText className="text-xs font-mono text-muted-foreground hidden sm:inline" intensity="low">
              {`${filteredNotes.length} NOTES`}
            </GlitchText>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#00d4ff] text-black font-mono text-xs font-bold hover:bg-[#00d4ff]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">NEW</span>
            </button>
          </div>
        </div>
      </header>

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
      <main className="flex-1 overflow-hidden px-4 md:px-6 lg:px-8 py-6 relative z-10">
        <div className="max-w-[1400px] mx-auto h-full flex flex-col">
          {loading ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-border p-6 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="h-4 w-20 bg-muted/30 mb-4" />
                    <div className="h-32 bg-muted/30 mb-4" />
                    <div className="h-4 w-16 bg-muted/30" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <RadarScan size={80} color="#00d4ff" speed={2} />
                  <div className="flex items-center gap-2">
                    <LoadingDots color="#00d4ff" size={6} />
                    <PixelText color="#00d4ff" pixelSize={2} scrambleOnMount>LOADING_NOTES</PixelText>
                  </div>
                </div>
              </div>
            </div>
          ) : paginatedNotes.length === 0 ? (
            <TxtEmptyState isSearching={!!searchQuery} onCreateNew={() => setShowAddForm(true)} />
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="flex-1 overflow-y-auto">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={`grid-${currentPage}-${searchQuery}`}
                  >
                    {paginatedNotes.map((note, index) => (
                      <motion.div key={note.id} variants={itemVariants} className="note-item">
                        <TxtNoteCard
                          id={note.id}
                          content={note.content}
                          timestamp={note.timestamp}
                          index={(currentPage - 1) * 6 + index + 1}
                          onView={() => setViewingNote({ note, index: (currentPage - 1) * 6 + index + 1 })}
                          onCopy={() => handleCopy(note.content)}
                          onDownload={() => handleDownload(note.content, note.timestamp)}
                          onDelete={() => { setDeleteMode(note.id); setDeleteCode(""); }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <div className="flex-1 min-h-0 overflow-hidden">
                  <TxtNoteList
                    notes={paginatedNotes}
                    currentPage={currentPage}
                    onView={(note, idx) => setViewingNote({ note, index: idx })}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onDelete={(id) => { setDeleteMode(id); setDeleteCode(""); }}
                  />
                </div>
              )}
              <TxtPagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </>
          )}
        </div>
      </main>

      </div>

      <TxtAddDialog open={showAddForm} onOpenChange={setShowAddForm} value={newNote} onChange={setNewNote} onSave={handleAddNote} />

      <TxtViewDialog
        open={viewingNote !== null}
        onOpenChange={(open) => { if (!open) setViewingNote(null); }}
        note={viewingNote?.note || null}
        index={viewingNote?.index || 0}
        onCopy={() => viewingNote && handleCopy(viewingNote.note.content)}
        onDownload={() => viewingNote && handleDownload(viewingNote.note.content, viewingNote.note.timestamp)}
        onDelete={() => {
          if (viewingNote) {
            setDeleteMode(viewingNote.note.id);
            setDeleteCode("");
            setViewingNote(null);
          }
        }}
      />

      <TxtDeleteDialog
        open={deleteMode !== null}
        onOpenChange={(open) => { if (!open) { setDeleteMode(null); setDeleteCode(""); } }}
        confirmCode={deleteCode}
        onConfirmCodeChange={setDeleteCode}
        onConfirm={() => handleDeleteNote(deleteMode!)}
      />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: "#00d4ff", color: "#000", borderRadius: 0, fontSize: "11px", fontFamily: "monospace", fontWeight: "bold" },
        }}
      />
    </TechLayout>
  );
};

export default TxtPage;
