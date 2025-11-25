"use client";
import React, { useState } from "react";
import { TechLayout, TechHeader, TechSidebar } from "@/components/layout";
import { TechFileList } from "@/components/files";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "react-hot-toast";
import useDrive from "@/components/hooks/drive";
import { Menu } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <TechLayout showGrid showCircuits={false} showScanLine={false}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
            borderRadius: 0,
            fontSize: "12px",
            fontFamily: "monospace",
          },
        }}
      />

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center h-14 px-4 border-b border-border">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 text-xs font-mono tracking-wider">DA22TTC</span>
      </div>

      <TechHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isAISearch={isAISearch}
        onToggleAISearch={handleToggleAISearch}
        onSearch={handleSearchClick}
        onReloadCache={handleReloadCache}
        isReloading={isReloading}
      />

      <div className="flex flex-1 overflow-hidden">
        <TechSidebar
          driveInfo={driveInfo}
          onCreateFolder={handleCreateFolder}
          onUploadFile={handleUploadFile}
          onUploadFolder={handleUploadFolder}
          formatBytes={formatBytes}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          fileInputRef={React.useRef<HTMLInputElement>(null)}
          isLoading={isSidebarLoading}
        />

        <TechFileList
          files={files}
          isLoading={isLoading}
          currentFolderId={currentFolderId}
          currentFolderName={currentFolderName}
          folderPath={folderPath}
          onFolderClick={(id) => {
            const folder = files.find((f) => f.id === id);
            handleFolderClick(id, folder?.name);
          }}
          onBreadcrumbClick={handleBreadcrumbClick}
          onBackClick={handleBackClick}
          onDownload={handleDownload}
          onUploadFile={handleUploadFile}
          onUploadFolder={handleUploadFolder}
          onCheckFolderContent={checkFolderContent}
          onDelete={handleDelete}
        />
      </div>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderModalOpen}
        onOpenChange={(open) => {
          if (!isCreatingFolder) setIsCreateFolderModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-none border-border font-mono">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal font-mono">NEW_FOLDER</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateFolderSubmit}>
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="FOLDER_NAME"
              disabled={isCreatingFolder}
              className="rounded-none border-border font-mono text-xs"
              autoFocus
            />

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => !isCreatingFolder && setIsCreateFolderModalOpen(false)}
                disabled={isCreatingFolder}
                className="rounded-none font-mono text-xs"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={isCreatingFolder || !newFolderName.trim()}
                className="rounded-none font-mono text-xs"
              >
                {isCreatingFolder ? "CREATING..." : "CREATE"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TechLayout>
  );
}
