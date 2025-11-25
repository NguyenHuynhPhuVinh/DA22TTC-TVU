"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { DriveInfo } from "@/types";
import { TechProgress, StatusIndicator } from "@/components/ui/tech";
import { FolderTechIcon, UploadTechIcon, StorageTechIcon } from "@/components/icons/TechIcons";
import { FolderPlus, FileUp, FolderUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface TechSidebarProps {
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

export const TechSidebar: React.FC<TechSidebarProps> = ({
  driveInfo,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  formatBytes,
  isOpen,
  onClose,
  fileInputRef,
  isLoading = false,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const storagePercent = driveInfo ? (driveInfo.used / driveInfo.total) * 100 : 0;

  useEffect(() => {
    if (!isLoading && navRef.current) {
      const items = navRef.current.querySelectorAll(".nav-item");
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [isLoading]);

  const handleItemHover = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, {
      x: enter ? 4 : 0,
      backgroundColor: enter ? "hsl(var(--muted) / 0.5)" : "transparent",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/90 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed md:sticky top-0 md:top-[120px] w-72 bg-background border-r border-border z-50",
          "flex flex-col h-screen md:h-[calc(100vh-120px)]",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <span className="text-xs font-mono tracking-wider text-muted-foreground">
            // MENU
          </span>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-4 py-3 border-b border-border/50">
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
            // ACTIONS
          </span>
        </div>

        {/* Navigation */}
        <div ref={navRef} className="flex-1 p-3 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-muted/30 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <nav className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onCreateFolder();
                }}
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="nav-item w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors group"
              >
                <FolderPlus className="w-4 h-4 text-muted-foreground group-hover:text-[#00ff88] transition-colors" />
                <span className="font-mono text-xs">NEW_FOLDER</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  ⌘N
                </span>
              </button>

              <label
                htmlFor="fileInput"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="nav-item w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors group"
              >
                <FileUp className="w-4 h-4 text-muted-foreground group-hover:text-[#00ff88] transition-colors" />
                <span className="font-mono text-xs">UPLOAD_FILE</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  ⌘U
                </span>
              </label>

              <label
                htmlFor="folderInput"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="nav-item w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors group"
              >
                <FolderUp className="w-4 h-4 text-muted-foreground group-hover:text-[#00ff88] transition-colors" />
                <span className="font-mono text-xs">UPLOAD_FOLDER</span>
              </label>

              {/* Divider */}
              <div className="my-4 border-t border-border/50" />

              {/* Drive info */}
              <div className="nav-item px-4 py-3">
                <div className="flex items-center gap-3 mb-3">
                  <StorageTechIcon size={16} className="text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">STORAGE</span>
                </div>
                <StatusIndicator status="online" size="sm" />
              </div>
            </nav>
          )}

          {/* Hidden Inputs */}
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
        </div>

        {/* Storage Info */}
        {driveInfo && !isLoading && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-3">
              <span>DISK_USAGE</span>
              <span className="text-foreground">{storagePercent.toFixed(1)}%</span>
            </div>
            <TechProgress
              value={storagePercent}
              max={100}
              height="sm"
              color="#00ff88"
            />
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">FREE:</span>
              <span className="text-[#00ff88]">{formatBytes(driveInfo.remaining)}</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-4 border-t border-border">
            <div className="h-3 w-20 bg-muted/30 animate-pulse mb-3" />
            <div className="h-1 bg-muted/30" />
            <div className="h-3 w-28 bg-muted/30 animate-pulse mt-3" />
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/50">
          <span className="text-[9px] font-mono text-muted-foreground/50">
            // DA22TTC-TVU SYSTEM
          </span>
        </div>
      </aside>
    </>
  );
};

export default TechSidebar;
