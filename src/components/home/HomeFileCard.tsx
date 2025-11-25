"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { NeonBorder, TechBadge, TechProgress } from "@/components/ui/tech";
import { FolderTechIcon, FileTechIcon } from "@/components/icons/TechIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Download, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeFileCardProps {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: number;
  isUploading?: boolean;
  uploadProgress?: number;
  isAdmin: boolean;
  viewMode?: "grid" | "list";
  onFolderClick: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onPreview?: () => void;
  formatFileSize: (bytes: number) => string;
}

export const HomeFileCard: React.FC<HomeFileCardProps> = ({
  id,
  name,
  mimeType,
  createdTime,
  size,
  isUploading,
  uploadProgress,
  isAdmin,
  viewMode = "grid",
  onFolderClick,
  onCopyLink,
  onDownload,
  onDelete,
  onPreview,
  formatFileSize,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFolder = mimeType === "application/vnd.google-apps.folder";

  useEffect(() => {
    if (!cardRef.current || viewMode === "list") return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -6,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [viewMode]);

  const handleClick = () => {
    if (isFolder && !isUploading) {
      if (viewMode === "grid") {
        gsap.to(cardRef.current, {
          scale: 0.98,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          onComplete: onFolderClick,
        });
      } else {
        onFolderClick();
      }
    }
  };

  const handleDoubleClick = () => {
    if (!isFolder && !isUploading && onPreview) {
      onPreview();
    }
  };

  // List view layout
  if (viewMode === "list") {
    return (
      <div
        ref={cardRef}
        className={cn(
          "group cursor-pointer border border-border hover:border-[#00ff88]/50 bg-card transition-colors",
          isUploading && "opacity-60 pointer-events-none"
        )}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Icon */}
          {isFolder ? (
            <FolderTechIcon size={24} className="text-[#00ff88] shrink-0" />
          ) : (
            <FileTechIcon size={24} className="text-[#00aaff] shrink-0" />
          )}

          {/* Name */}
          <h3 className="flex-1 text-sm font-mono font-medium truncate group-hover:text-[#00ff88] transition-colors">
            {name}
          </h3>

          {/* Badge */}
          <TechBadge variant={isFolder ? "success" : "info"} size="sm">
            {isFolder ? "FOLDER" : name.split(".").pop()?.toUpperCase() || "FILE"}
          </TechBadge>

          {/* Size */}
          <span className="w-20 text-right text-[10px] font-mono text-muted-foreground shrink-0">
            {size ? formatFileSize(size) : "-"}
          </span>

          {/* Date */}
          <span className="w-24 text-right text-[10px] font-mono text-muted-foreground shrink-0">
            {new Date(createdTime).toLocaleDateString("vi-VN")}
          </span>

          {/* Actions */}
          {!isUploading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                {!isFolder && onPreview && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPreview(); }} className="text-xs">
                    <Eye className="w-4 h-4 mr-2" />
                    VIEW
                  </DropdownMenuItem>
                )}
                {!isFolder && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopyLink(); }} className="text-xs">
                    <Copy className="w-4 h-4 mr-2" />
                    COPY_LINK
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(); }} className="text-xs">
                  <Download className="w-4 h-4 mr-2" />
                  DOWNLOAD
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs text-destructive focus:text-destructive"
                      onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      DELETE
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="w-24 shrink-0">
              <TechProgress value={uploadProgress || 0} max={100} height="sm" color="#00ff88" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div
      ref={cardRef}
      className={cn(
        "group cursor-pointer",
        isUploading && "opacity-60 pointer-events-none"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <NeonBorder
        color={isFolder ? "#00ff88" : "#00aaff"}
        animated={false}
        intensity="low"
        className="bg-card h-full"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {isFolder ? (
                <FolderTechIcon size={36} className="text-[#00ff88]" />
              ) : (
                <FileTechIcon size={36} className="text-[#00aaff]" />
              )}
              <TechBadge
                variant={isFolder ? "success" : "info"}
                size="sm"
              >
                {isFolder ? "FOLDER" : name.split(".").pop()?.toUpperCase() || "FILE"}
              </TechBadge>
            </div>

            {!isUploading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                  {!isFolder && onPreview && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPreview(); }} className="text-xs">
                      <Eye className="w-4 h-4 mr-2" />
                      VIEW
                    </DropdownMenuItem>
                  )}
                  {!isFolder && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopyLink(); }} className="text-xs">
                      <Copy className="w-4 h-4 mr-2" />
                      COPY_LINK
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(); }} className="text-xs">
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-xs text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        DELETE
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Name */}
          <h3 className="text-sm font-mono font-medium truncate mb-2 group-hover:text-[#00ff88] transition-colors">
            {name}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <span>{new Date(createdTime).toLocaleDateString("vi-VN")}</span>
            {size && <span>{formatFileSize(size)}</span>}
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="mt-4">
              <TechProgress
                value={uploadProgress || 0}
                max={100}
                height="sm"
                color="#00ff88"
              />
              <div className="text-[10px] font-mono text-[#00ff88] text-right mt-1">
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      </NeonBorder>
    </div>
  );
};

export default HomeFileCard;
