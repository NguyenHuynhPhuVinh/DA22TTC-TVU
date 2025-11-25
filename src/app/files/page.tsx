"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TechLayout, TechSidebar } from "@/components/layout";
import {
  HomeFileCard,
  HomeBreadcrumb,
  HomeToolbar,
  HomeEmptyState,
  HomeDropZone,
} from "@/components/home";
import { FilePreviewDialog } from "@/components/files/FilePreviewDialog";
import { AdminLoginModal, AdminConfigModal } from "@/components/admin";
import {
  ParticleField,
  TechBadge,
  WaveformVisualizer,
  DataStream,
  LoadingDots,
  RadarScan,
  TerminalText,
  NeonText,
  HackerText,
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
import { Menu, FolderPlus, Search, Sparkles, RefreshCw, Home, Settings } from "lucide-react";
import Link from "next/link";

export default function FilesPage() {
  return (
    <Suspense fallback={<FilesPageLoading />}>
      <FilesPageContent />
    </Suspense>
  );
}

function FilesPageLoading() {
  return (
    <TechLayout showGrid showCircuits accentColor="#00ff88">
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RadarScan size={80} color="#00ff88" speed={2} />
          <LoadingDots color="#00ff88" size={6} />
        </div>
      </div>
    </TechLayout>
  );
}

function FilesPageContent() {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for ?admin in URL
  useEffect(() => {
    if (searchParams.has("admin") && !isAdmin) {
      setShowLoginModal(true);
      // Remove ?admin from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams, isAdmin]);

  const handleAdminLogin = (password: string) => {
    setAdminPassword(password);
    setIsAdmin(true);
  };

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
    startDeleteEffect,
    handleDeleteComplete,
    deletingFileId,
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

  // Animation handled by framer-motion instead of GSAP

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
              <NeonText className="text-sm font-mono font-bold" color="#00ff88" flickerSpeed="slow" glowIntensity="medium">FILE_SYSTEM</NeonText>
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
              {isAdmin && (
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="p-2 text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors border border-[#00ff88]/30"
                  title="Admin Config"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              <TechBadge variant={isAdmin ? "warning" : "success"} size="sm" pulse>
                {isAdmin ? "ADMIN" : "ONLINE"}
              </TechBadge>
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
                      <TerminalText color="#00ff88" prefix="// " typingSpeed={80}>SCANNING_FILES...</TerminalText>
                    </div>
                  </div>
                </div>
              ) : sortedFiles.length === 0 ? (
                <HomeEmptyState onCreateFolder={handleCreateFolder} onUploadFile={triggerFileUpload} />
              ) : (
                <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-1"}>
                  <AnimatePresence mode="popLayout">
                    {sortedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        layout
                      >
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
                          isDeleting={deletingFileId === file.id}
                          onFolderClick={() => handleFolderClick(file.id, file.name)}
                          onCopyLink={() => { navigator.clipboard.writeText(generateDownloadLink(file.id)); toast.success("LINK_COPIED"); }}
                          onDownload={() => { file.mimeType === "application/vnd.google-apps.folder" ? handleDownloadFolder(file.id, file.name) : handleDownload(file.id, file.name); }}
                          onDelete={() => startDeleteEffect(file.id)}
                          onDeleteComplete={handleDeleteComplete}
                          onPreview={() => setPreviewFile({ id: file.id, name: file.name })}
                          formatFileSize={formatFileSize}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
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

      {/* Admin Modals */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAdminLogin}
      />
      <AdminConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        adminPassword={adminPassword}
      />

      <Dialog open={isCreateFolderModalOpen} onOpenChange={(open) => { if (!isCreatingFolder) setIsCreateFolderModalOpen(open); }}>
        <DialogContent className="sm:max-w-md border border-[#00ff88]/40 rounded-none bg-black/95 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)]">
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,136,0.03)_50%)] bg-[length:100%_4px]" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-pulse" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-pulse" />
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00ff88]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00ff88]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00ff88]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00ff88]" />

          {/* Header */}
          <div className="border-b border-[#00ff88]/30 bg-[#00ff88]/5 px-6 py-5 relative">
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[#00ff88]/10 to-transparent" />
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 font-mono relative">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-[#00ff88] flex items-center justify-center bg-[#00ff88]/10">
                    <FolderPlus className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff88] animate-pulse" />
                </div>
                <div>
                  <HackerText className="text-lg font-bold text-[#00ff88]" color="#00ff88" speed={50} triggerOnHover={false}>
                    NEW_FOLDER
                  </HackerText>
                  <p className="text-[10px] text-[#00ff88]/60 font-mono mt-1">{/* INITIALIZE_DIRECTORY */}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Creating overlay */}
          {isCreatingFolder && (
            <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
              {/* Animated border */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-[scan_1s_linear_infinite]" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-[scan_1s_linear_infinite_reverse]" />
              </div>
              
              {/* Radar effect */}
              <div className="relative mb-6">
                <RadarScan size={100} color="#00ff88" speed={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderPlus className="w-8 h-8 text-[#00ff88] animate-pulse" />
                </div>
              </div>

              {/* Progress text */}
              <div className="text-center space-y-3">
                <TerminalText color="#00ff88" prefix="$ " typingSpeed={50} showCursor>
                  {`mkdir ${newFolderName}`}
                </TerminalText>
                <div className="flex items-center gap-2 justify-center">
                  <LoadingDots color="#00ff88" size={6} />
                  <span className="text-[#00ff88]/80 font-mono text-xs">CREATING_DIRECTORY...</span>
                </div>
              </div>

              {/* Fake progress steps */}
              <div className="mt-6 space-y-2 text-[10px] font-mono text-[#00ff88]/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00ff88] animate-pulse" />
                  <span>ALLOCATING_SPACE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00ff88]/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span>WRITING_METADATA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00ff88]/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
                  <span>SYNCING_TO_CLOUD</span>
                </div>
              </div>

              {/* Binary decoration */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[8px] font-mono text-[#00ff88]/20">
                  01001101 01001011 01000100 01001001 01010010
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreateFolderSubmit} className={`p-6 relative ${isCreatingFolder ? "opacity-0" : ""}`}>
            {/* Input field */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00ff88]/50 via-[#00ff88] to-[#00ff88]/50 opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative bg-black">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff88]/50 font-mono text-sm">&gt;</div>
                <Input 
                  type="text" 
                  value={newFolderName} 
                  onChange={(e) => setNewFolderName(e.target.value)} 
                  placeholder="ENTER_FOLDER_NAME" 
                  disabled={isCreatingFolder} 
                  className="rounded-none border-0 bg-transparent font-mono text-sm h-14 pl-8 text-[#00ff88] placeholder:text-[#00ff88]/30 focus-visible:ring-0" 
                  autoFocus 
                />
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center justify-between mt-5 px-1">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${newFolderName.length > 0 ? "bg-[#00ff88] animate-pulse" : "bg-[#00ff88]/30"}`} />
                <span className="text-[10px] font-mono text-[#00ff88]/60">
                  {newFolderName.length > 0 ? "READY_TO_CREATE" : "AWAITING_INPUT"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#00ff88]/40">{newFolderName.length}/255</span>
                <div className="w-16 h-1 bg-[#00ff88]/20 overflow-hidden">
                  <div 
                    className="h-full bg-[#00ff88] transition-all duration-300"
                    style={{ width: `${Math.min(newFolderName.length / 255 * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Waveform */}
            <div className="mt-4 flex justify-center">
              <WaveformVisualizer color="#00ff88" bars={20} height={30} active={newFolderName.length > 0} />
            </div>

            {/* Buttons */}
            <DialogFooter className="mt-6 gap-3 flex-row">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => !isCreatingFolder && setIsCreateFolderModalOpen(false)} 
                disabled={isCreatingFolder} 
                className="flex-1 rounded-none font-mono text-xs h-11 border border-[#00ff88]/30 text-[#00ff88]/70 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/50"
              >
                [ESC] CANCEL
              </Button>
              <Button 
                type="submit" 
                disabled={isCreatingFolder || !newFolderName.trim()} 
                className="flex-1 rounded-none font-mono text-xs h-11 bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:bg-[#00ff88]/30 disabled:text-black/50 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
              >
                [ENTER] CREATE
              </Button>
            </DialogFooter>

            {/* Bottom decoration */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00ff88]/30" />
              <span className="text-[8px] font-mono text-[#00ff88]/30">SYS.MKDIR</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00ff88]/30" />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TechLayout>
  );
}
