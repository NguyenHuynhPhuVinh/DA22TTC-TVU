"use client";
import React from "react";
import { DriveInfo } from "../types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus, FileUp, FolderUp, HardDrive, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface SidebarProps {
  driveInfo: DriveInfo | null;
  onCreateFolder: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatBytes: (bytes: number) => string;
  isOpen: boolean;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

export default function Sidebar({
  driveInfo,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  formatBytes,
  isOpen,
  onClose,
  fileInputRef,
  isLoading = false,
}: SidebarProps) {
  const folderInputRef = React.useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isInteractionOpen, setIsInteractionOpen] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkTheme(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkTheme(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleCreateFolder = () => {
    onClose();
    onCreateFolder();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed md:sticky top-0 md:top-[84px] w-72",
          "bg-background border-r",
          "p-4 transition-transform duration-300 ease-out",
          "z-50 flex flex-col shadow-lg md:shadow-none",
          "h-[100vh] md:h-[calc(100vh-84px)] overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-bold text-foreground">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="mt-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={handleCreateFolder}
              className="w-full justify-start gap-3 mb-4"
              size="lg"
            >
              <FolderPlus className="w-5 h-5" />
              <span>Tạo Thư Mục</span>
            </Button>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3.5"
                asChild
              >
                <label htmlFor="fileInput" className="cursor-pointer">
                  <FileUp className="w-5 h-5" />
                  <span>Tải File Lên</span>
                </label>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3.5"
                asChild
              >
                <label htmlFor="folderInput" className="cursor-pointer">
                  <FolderUp className="w-5 h-5" />
                  <span>Tải Thư Mục Lên</span>
                </label>
              </Button>
            </div>

            {/* Hidden inputs */}
            <input
              id="fileInput"
              type="file"
              multiple
              onChange={(e) => {
                onUploadFile(e);
                onClose();
              }}
              className="hidden"
              ref={fileInputRef}
            />
            <input
              id="folderInput"
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              onChange={(e) => {
                onUploadFolder(e);
                onClose();
              }}
              className="hidden"
              ref={folderInputRef}
            />

            <div className="mt-6">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-3.5"
              >
                <HardDrive className="w-5 h-5" />
                <span>DA22TTC</span>
              </Button>
            </div>
          </>
        )}

        {driveInfo && !isLoading ? (
          <div className="mt-auto p-4 bg-muted/50 rounded-xl">
            <div className="text-sm font-medium text-foreground mb-2">
              Bộ nhớ đã dùng
            </div>
            <Progress
              value={(driveInfo.used / driveInfo.total) * 100}
              className="h-2"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              {formatBytes(driveInfo.remaining)} còn trống
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-auto p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3 rounded-full" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
