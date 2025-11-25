"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { TechLayout, TechSidebar } from "@/components/layout";
import {
  HomeFileCard,
  HomeBreadcrumb,
  HomeToolbar,
  HomeEmptyState,
  HomeDropZone,
} from "@/components/home";
import { FilePreviewDialog } from "@/components/files/FilePreviewDialog";
import {
  ParticleField,
  NeonBorder,
  TechBadge,
  WaveformVisualizer,
  DataStream,
  GlitchText,
  PulseRing,
  LoadingDots,
  HologramEffect,
  RadarScan,
  TechProgress,
} from "@/components/ui/tech";
import { useFileList } from "@/components/hooks/file-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "react-hot-toast";
import useDrive from "@/components/hooks/drive";
import { Menu, FolderPlus, Search, Sparkles, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function FilesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    files,
    isLoading,
    isSidebarLoading,
    driveInfo,
    currentFolderId,
    currentFolderName,
    folderPath,
    searchTerm,
    isAISearch,
    handleSearchChange,
    handleSearchClick,
    handleFolderClick,
    handleBreadcrumbClick,
    handleBackClick,
    handleToggleAISearch,
    handleDelete,
    formatBytes,
    handleCreateFolder,
    handleCreateFolderSubmit,
    handleUploadFile,
    handleUploadFolder,
    checkFolderContent,
    handleDownload,
    isCreatingFolder,
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen,
    newFolderName,
    setNewFolderName,
    handleReloadCache,
    isReloading,
  } = useDrive();

  const {
    files: sortedFiles,
    uniqueExtensions,
    showFolders,
    setShowFolders,
    selectedExtension,
    setSelectedExtension,
    sortCriteria,
    setSortCriteria,
    isGridView,
    setIsGridView,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    generateDownloadLink,
    handleDownloadFolder,
    isAdminMode,
    formatFileSize,
    SortCriteria,
  } = useFileList({
    files,
    isLoading,
    currentFolderId,
    currentFolderName,
    folderPath,
    onFolderClick: handleFolderClick,
    onBreadcrumbClick: handleBreadcrumbClick,
    onBackClick: handleBackClick,
    onDownload: handleDownload,
    onUploadFile: handleUploadFile,
    onUploadFolder: handleUploadFolder,
    onCheckFolderContent: checkFolderContent,
    onDelete: handleDelete,
  });

  useEffect(() => {
    if (!isLoading && gridRef.current && sortedFiles.length > 0) {
      const items = gridRef.current.querySelectorAll(".file-item");
      // Reset opacity first then animate
      gsap.set(items, { opacity: 1, y: 0 });
      gsap.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: "power2.out" });
    }
  }, [isLoading, sortedFiles, isGridView]);

  const triggerFileUpload = () => fileInputRef.current?.click();

  return (
    <TechLayout showGrid showCircuits accentColor="#00ff88">
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField color="#00ff88" particleCount={35} speed={0.2} connectDistance={100} className="opacity-15" />
        <DataStream color="#00ff88" density={8} speed={60} className="opacity-10" />
      </div>

      <Toaster position="bottom-center" toastOptions={{ style: { background: "#00ff88", color: "#000", borderRadius: 0, fontSize: "11px", fontFamily: "monospace", fontWeight: "bold" } }} />

      {/* Fixed full-height layout */}
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <header className="shrink-0 z-50 bg-background/95 border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-muted-foreground hover:text-[#00ff88]">
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-xs font-mono hidden sm:inline">HOME</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <GlitchText className="text-sm font-mono font-bold" intensity="low">FILE_SYSTEM</GlitchText>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={isAISearch ? "// AI SEARCH..." : "// SEARCH..."}
                  className="w-full bg-muted/30 border border-border pl-10 pr-20 py-2 text-sm font-mono outline-none focus:border-[#00ff88]/50"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                />
                <button onClick={handleToggleAISearch} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 ${isAISearch ? "text-[#00ff88]" : "text-muted-foreground"}`}>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {handleReloadCache && (
                <button onClick={handleReloadCache} disabled={isReloading} className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <RefreshCw className={`w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
                </button>
              )}
              <TechBadge variant="success" size="sm" pulse>ONLINE</TechBadge>
            </div>
          </div>
        </header>

        {/* Main area - Sidebar fixed, content scrolls */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Sidebar - Fixed height, internal scroll if needed */}
          <TechSidebar
            driveInfo={driveInfo}
            onCreateFolder={handleCreateFolder}
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            formatBytes={formatBytes}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            fileInputRef={fileInputRef}
            isLoading={isSidebarLoading}
          />

          {/* Main content area */}
          <main
            className="flex-1 flex flex-col overflow-hidden relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <HomeDropZone isVisible={isDragging} />

            {/* Fixed: Breadcrumb + Toolbar */}
            <div className="shrink-0 p-4 md:px-6 md:pt-4 md:pb-2 border-b border-border/50 bg-background">
              <HomeBreadcrumb
                currentFolderId={currentFolderId}
                currentFolderName={currentFolderName}
                folderPath={folderPath}
                onNavigate={(id, index) => {
                  if (id === null) handleBackClick();
                  else if (index !== undefined) handleBreadcrumbClick(id, index);
                }}
                onBack={handleBackClick}
              />

              <HomeToolbar
                totalItems={sortedFiles.length}
                showFolders={showFolders}
                onToggleFolders={() => setShowFolders(!showFolders)}
                selectedExtension={selectedExtension}
                onSelectExtension={setSelectedExtension}
                uniqueExtensions={uniqueExtensions}
                sortCriteria={sortCriteria}
                onSortChange={(criteria) => setSortCriteria(criteria as typeof SortCriteria[keyof typeof SortCriteria])}
                isGridView={isGridView}
                onToggleView={() => setIsGridView(!isGridView)}
                isLoading={isLoading}
              />
            </div>

            {/* Scrollable: File list only */}
            <div className="flex-1 overflow-y-auto p-4 md:px-6">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RadarScan size={80} color="#00ff88" speed={2} />
                    <div className="flex items-center gap-2">
                      <LoadingDots color="#00ff88" size={6} />
                      <span className="text-xs font-mono text-muted-foreground">SCANNING_FILES</span>
                    </div>
                  </div>
                </div>
              ) : sortedFiles.length === 0 ? (
                <HomeEmptyState onCreateFolder={handleCreateFolder} onUploadFile={triggerFileUpload} />
              ) : (
                <div ref={gridRef} className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-1"}>
                  {sortedFiles.map((file) => (
                    <div key={file.id} className="file-item">
                      <HomeFileCard
                        id={file.id}
                        name={file.name}
                        mimeType={file.mimeType}
                        createdTime={file.createdTime}
                        size={file.size}
                        isUploading={file.isUploading}
                        uploadProgress={file.uploadProgress}
                        isAdmin={isAdminMode}
                        viewMode={isGridView ? "grid" : "list"}
                        onFolderClick={() => handleFolderClick(file.id, file.name)}
                        onCopyLink={() => { navigator.clipboard.writeText(generateDownloadLink(file.id)); toast.success("LINK_COPIED"); }}
                        onDownload={() => { file.mimeType === "application/vnd.google-apps.folder" ? handleDownloadFolder(file.id, file.name) : handleDownload(file.id, file.name); }}
                        onDelete={() => handleDelete(file.id)}
                        onPreview={() => setPreviewFile({ id: file.id, name: file.name })}
                        formatFileSize={formatFileSize}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple onChange={handleUploadFile} className="hidden" />

      {/* File Preview Dialog */}
      <FilePreviewDialog
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileId={previewFile?.id || ""}
        fileName={previewFile?.name || ""}
        onDownload={() => {
          if (previewFile) {
            handleDownload(previewFile.id, previewFile.name);
          }
        }}
      />

      <Dialog open={isCreateFolderModalOpen} onOpenChange={(open) => { if (!isCreatingFolder) setIsCreateFolderModalOpen(open); }}>
        <DialogContent className="sm:max-w-md border-[#00ff88]/30 rounded-none bg-background p-0 overflow-hidden">
          <HologramEffect color="#00ff88" className="absolute inset-0 pointer-events-none"><div /></HologramEffect>
          <div className="border-b border-[#00ff88]/20 bg-[#00ff88]/5 px-6 py-4 relative">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 font-mono">
                <div className="relative">
                  <PulseRing color="#00ff88" size={32} rings={2} />
                  <div className="absolute inset-0 flex items-center justify-center"><FolderPlus className="w-4 h-4 text-[#00ff88]" /></div>
                </div>
                <GlitchText intensity="low">NEW_FOLDER</GlitchText>
                <TechBadge variant="success" size="sm" pulse>CREATE</TechBadge>
              </DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={handleCreateFolderSubmit} className="p-6 relative">
            <NeonBorder color="#00ff88" intensity="medium" animated>
              <Input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="FOLDER_NAME" disabled={isCreatingFolder} className="rounded-none border-0 bg-transparent font-mono text-sm h-12" autoFocus />
            </NeonBorder>
            <div className="flex items-center justify-between mt-4">
              <WaveformVisualizer color="#00ff88" bars={12} height={24} active={newFolderName.length > 0} />
              {newFolderName.length > 0 && <div className="w-24"><TechProgress value={Math.min(newFolderName.length * 5, 100)} max={100} color="#00ff88" height="sm" showValue /></div>}
            </div>
            <DialogFooter className="mt-6 gap-3">
              <Button type="button" variant="ghost" onClick={() => !isCreatingFolder && setIsCreateFolderModalOpen(false)} disabled={isCreatingFolder} className="rounded-none font-mono text-xs">CANCEL</Button>
              <Button type="submit" disabled={isCreatingFolder || !newFolderName.trim()} className="rounded-none font-mono text-xs bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
                {isCreatingFolder ? <span className="flex items-center gap-2"><LoadingDots color="#000" size={4} />CREATING</span> : "CREATE_FOLDER"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TechLayout>
  );
}
