"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FileList from "../components/FileList";
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
import { useTheme } from "next-themes";
import useDrive from "../components/hooks/drive";
import { Menu } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    files,
    isLoading,
    driveInfo,
    currentFolderId,
    currentFolderName,
    folderPath,
    searchTerm,
    isAISearch,
    setSearchTerm,
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
  } = useDrive();
  const { theme } = useTheme();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Toaster
        position="top-center"
        containerStyle={{
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10000,
        }}
        toastOptions={{
          style: {
            background: theme === "dark" ? "#374151" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            border:
              theme === "dark" ? "1px solid #4B5563" : "1px solid #E5E7EB",
          },
        }}
      />

      <div className="max-w-[1800px] w-full mx-auto flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isAISearch={isAISearch}
          onToggleAISearch={handleToggleAISearch}
          onSearch={handleSearchClick}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            driveInfo={driveInfo}
            onCreateFolder={handleCreateFolder}
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            formatBytes={formatBytes}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            fileInputRef={React.useRef<HTMLInputElement>(null)}
            isLoading={isLoading}
          />

          <FileList
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
      </div>

      <Dialog
        open={isCreateFolderModalOpen}
        onOpenChange={(open) => {
          if (!isCreatingFolder) setIsCreateFolderModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo thư mục mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateFolderSubmit}>
            <div className="py-4">
              <Input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nhập tên thư mục"
                disabled={isCreatingFolder}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  !isCreatingFolder && setIsCreateFolderModalOpen(false)
                }
                disabled={isCreatingFolder}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isCreatingFolder || !newFolderName.trim()}
              >
                {isCreatingFolder ? "Đang tạo..." : "Tạo thư mục"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
