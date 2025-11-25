"use client";
import React, { useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import { useFileList } from "@/components/hooks/file-list";
import { FileListProps } from "@/types";
import { TechCard, TechProgress } from "@/components/ui/tech";
import { FolderTechIcon, FileTechIcon, UploadTechIcon, DownloadTechIcon } from "@/components/icons/TechIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  ArrowUpDown,
  LayoutGrid,
  List,
  MoreVertical,
  Copy,
  Download,
  Trash2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const TechFileList: React.FC<FileListProps> = ({
  files,
  isLoading,
  currentFolderId,
  currentFolderName,
  folderPath = [],
  onFolderClick,
  onBreadcrumbClick,
  onBackClick,
  onDownload,
  onUploadFile,
  onUploadFolder,
  onCheckFolderContent,
  onDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const {
    files: sortedFiles,
    uniqueExtensions,
    showFolders,
    setSortCriteria,
    setSelectedExtension,
    setShowFolders,
    isGridView,
    setIsGridView,
    isDragging,
    compressingFolder,
    compressionProgress,
    showDeleteModal,
    deletePassword,
    fileToDelete,
    isDeleting,
    isAdminMode,
    handleMouseLeave,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
    generateDownloadLink,
    handleDownloadFolder,
    handleDelete,
    confirmDelete,
    selectedExtension,
    sortCriteria,
    SortCriteria,
    formatFileSize,
    setDeletePassword,
    setShowDeleteModal,
    setFileToDelete,
  } = useFileList({
    files,
    isLoading,
    currentFolderId,
    currentFolderName,
    folderPath,
    onFolderClick,
    onBreadcrumbClick,
    onBackClick,
    onDownload,
    onUploadFile,
    onUploadFolder,
    onCheckFolderContent,
    onDelete,
  });

  // Animate files on load
  useEffect(() => {
    if (!isLoading && gridRef.current && sortedFiles.length > 0) {
      const items = gridRef.current.querySelectorAll(".file-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: "power3.out",
        }
      );
    }
  }, [isLoading, sortedFiles, isGridView]);

  const handleFileClick = (fileId: string, mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      gsap.to(`[data-file-id="${fileId}"]`, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => onFolderClick(fileId),
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col overflow-hidden bg-background relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-background/98 border-2 border-dashed border-[#00ff88]/50 flex items-center justify-center z-50">
          <div className="text-center">
            <UploadTechIcon size={64} className="mx-auto text-[#00ff88] mb-6 animate-bounce" />
            <p className="text-lg font-mono text-[#00ff88]">DROP_FILES_HERE</p>
            <p className="text-xs font-mono text-muted-foreground mt-2">// UPLOAD TO CURRENT DIRECTORY</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b border-border px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        {currentFolderId && (
          <div className="flex items-center gap-2 text-xs font-mono mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => onBackClick()}
              className="text-muted-foreground hover:text-[#00ff88] transition-colors shrink-0"
            >
              ROOT
            </button>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                <button
                  onClick={() => onBreadcrumbClick(folder.id, index)}
                  className="text-muted-foreground hover:text-[#00ff88] transition-colors truncate max-w-[150px]"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
            {currentFolderName && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                <span className="text-[#00ff88] truncate max-w-[150px]">{currentFolderName}</span>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {currentFolderId && (
              <button
                onClick={onBackClick}
                className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">BACK</span>
              </button>
            )}
            
            {!isLoading && (
              <span className="text-[10px] font-mono text-muted-foreground">
                {sortedFiles.length} ITEMS
              </span>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-1">
              {/* Toggle Folders */}
              <button
                onClick={() => setShowFolders(!showFolders)}
                className={cn(
                  "p-2.5 transition-all duration-200",
                  showFolders ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {showFolders ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 p-2.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {selectedExtension ? `.${selectedExtension}` : "TYPE"}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                  <DropdownMenuItem onClick={() => setSelectedExtension(null)} className="text-xs">
                    <Check className={cn("mr-2 w-3 h-3", !selectedExtension ? "opacity-100" : "opacity-0")} />
                    ALL
                  </DropdownMenuItem>
                  {uniqueExtensions.map((ext) => (
                    <DropdownMenuItem key={ext} onClick={() => setSelectedExtension(ext)} className="text-xs">
                      <Check className={cn("mr-2 w-3 h-3", selectedExtension === ext ? "opacity-100" : "opacity-0")} />
                      .{ext}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 p-2.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">SORT</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Default)} className="text-xs">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Default ? "opacity-100" : "opacity-0")} />
                    DEFAULT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Name)} className="text-xs">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Name ? "opacity-100" : "opacity-0")} />
                    NAME
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Size)} className="text-xs">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Size ? "opacity-100" : "opacity-0")} />
                    SIZE
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Date)} className="text-xs">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Date ? "opacity-100" : "opacity-0")} />
                    DATE
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <button
                onClick={() => setIsGridView(!isGridView)}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isGridView ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 lg:p-8">
            <div className={cn(
              isGridView 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                : "space-y-2"
            )}>
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="border border-border p-5 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted/30" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted/30 mb-2" />
                      <div className="h-3 w-20 bg-muted/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : sortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-24">
            <FolderTechIcon size={64} className="text-muted-foreground/30 mb-6" />
            <p className="text-lg font-mono text-muted-foreground mb-2">EMPTY_DIRECTORY</p>
            <p className="text-xs font-mono text-muted-foreground/60">// DROP FILES TO UPLOAD</p>
          </div>
        ) : (
          <div ref={gridRef} className="p-6 lg:p-8">
            {isGridView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFiles.map((file) => (
                  <TechCard
                    key={file.id}
                    className={cn(
                      "file-item p-5",
                      file.isUploading && "opacity-60 pointer-events-none"
                    )}
                    hover={!file.isUploading}
                    corners
                    onClick={() => handleFileClick(file.id, file.mimeType)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      {file.mimeType === "application/vnd.google-apps.folder" ? (
                        <FolderTechIcon size={32} className="text-[#00ff88]" />
                      ) : (
                        <FileTechIcon size={32} className="text-muted-foreground" />
                      )}

                      {!file.isUploading && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                            {file.mimeType !== "application/vnd.google-apps.folder" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(generateDownloadLink(file.id));
                                  toast.success("LINK_COPIED");
                                }}
                                className="text-xs"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                COPY_LINK
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                file.mimeType === "application/vnd.google-apps.folder"
                                  ? handleDownloadFolder(file.id, file.name)
                                  : onDownload(file.id, file.name);
                              }}
                              className="text-xs"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              DOWNLOAD
                            </DropdownMenuItem>
                            {isAdminMode && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-xs text-destructive focus:text-destructive"
                                  onClick={(e) => handleDelete(e, file)}
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

                    <div className="text-sm font-mono truncate mb-2">{file.name}</div>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                      <span>{new Date(file.createdTime).toLocaleDateString("vi-VN")}</span>
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                    </div>

                    {(file.isUploading || compressingFolder === file.id) && (
                      <div className="mt-4">
                        <TechProgress
                          value={file.isUploading ? file.uploadProgress || 0 : compressionProgress}
                          max={100}
                          height="sm"
                          color="#00ff88"
                        />
                        <div className="text-[10px] font-mono text-[#00ff88] text-right mt-1">
                          {file.isUploading ? file.uploadProgress : compressionProgress}%
                        </div>
                      </div>
                    )}
                  </TechCard>
                ))}
              </div>
            ) : (
              <div className="border border-border divide-y divide-border">
                {sortedFiles.map((file) => (
                  <div
                    key={file.id}
                    data-file-id={file.id}
                    className={cn(
                      "file-item group flex items-center gap-5 p-4 cursor-pointer transition-all duration-200",
                      "hover:bg-muted/30",
                      file.isUploading && "opacity-60 pointer-events-none"
                    )}
                    onClick={() => handleFileClick(file.id, file.mimeType)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {file.mimeType === "application/vnd.google-apps.folder" ? (
                      <FolderTechIcon size={24} className="text-[#00ff88] shrink-0" />
                    ) : (
                      <FileTechIcon size={24} className="text-muted-foreground shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono truncate">{file.name}</div>
                    </div>

                    <div className="hidden sm:flex items-center gap-8 text-[10px] font-mono text-muted-foreground shrink-0">
                      <span className="w-24">{new Date(file.createdTime).toLocaleDateString("vi-VN")}</span>
                      <span className="w-20 text-right">{file.size ? formatFileSize(file.size) : "—"}</span>
                    </div>

                    {!file.isUploading && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1.5 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                          {file.mimeType !== "application/vnd.google-apps.folder" && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(generateDownloadLink(file.id));
                                toast.success("LINK_COPIED");
                              }}
                              className="text-xs"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              COPY_LINK
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              file.mimeType === "application/vnd.google-apps.folder"
                                ? handleDownloadFolder(file.id, file.name)
                                : onDownload(file.id, file.name);
                            }}
                            className="text-xs"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            DOWNLOAD
                          </DropdownMenuItem>
                          {isAdminMode && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-xs text-destructive focus:text-destructive"
                                onClick={(e) => handleDelete(e, file)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                DELETE
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {(file.isUploading || compressingFolder === file.id) && (
                      <div className="w-24 shrink-0">
                        <TechProgress
                          value={file.isUploading ? file.uploadProgress || 0 : compressionProgress}
                          max={100}
                          height="sm"
                          color="#00ff88"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md rounded-none border-border font-mono">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal font-mono">DELETE_FILE</DialogTitle>
            <DialogDescription className="text-xs font-mono">
              // CONFIRM DELETION OF &quot;{fileToDelete?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="ADMIN_PASSWORD"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="rounded-none border-border font-mono text-xs"
          />
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword("");
                setFileToDelete(null);
              }}
              className="rounded-none font-mono text-xs"
            >
              CANCEL
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting || !deletePassword}
              className="rounded-none font-mono text-xs"
            >
              {isDeleting ? "DELETING..." : "DELETE"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechFileList;
