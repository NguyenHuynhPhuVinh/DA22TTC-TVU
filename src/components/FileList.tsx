"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { useFileList } from "./hooks/file-list";
import { FileListProps } from "../types";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Folder,
  File,
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
  UploadCloud,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileList({
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
}: FileListProps) {
  const { theme } = useTheme();

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
    hasFolders,
    openMenuId,
    showDeleteModal,
    deletePassword,
    fileToDelete,
    isDeleting,
    isAdminMode,
    handleMouseLeave,
    setOpenMenuId,
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
    setIsDeleting,
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

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden bg-background min-h-0"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div
          className="absolute inset-0 bg-primary/5 backdrop-blur-sm border-2 border-dashed 
                    border-primary rounded-xl flex items-center justify-center transition-all duration-300 z-50"
        >
          <div className="text-center bg-background p-6 rounded-xl shadow-lg">
            <UploadCloud className="mx-auto h-12 w-12 text-primary animate-bounce" />
            <p className="mt-4 text-sm font-medium text-primary">
              Thả file hoặc thư mục để tải lên
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="p-2 md:p-4 md:pb-2">
        {currentFolderId && (
          <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm mb-2 overflow-x-auto whitespace-nowrap">
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium"
              onClick={() => onBackClick()}
            >
              DA22TTC
            </Button>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary font-medium truncate max-w-[80px] md:max-w-[200px]"
                  onClick={() => onBreadcrumbClick(folder.id, index)}
                >
                  {folder.name}
                </Button>
              </React.Fragment>
            ))}
            {currentFolderName && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground font-medium truncate max-w-[100px] md:max-w-[200px]">
                  {currentFolderName}
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          {currentFolderId && (
            <Button variant="outline" onClick={onBackClick} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Quay lại</span>
            </Button>
          )}

          {!isLoading && (
            <div
              className={`flex flex-wrap items-center gap-2 ${
                currentFolderId ? "" : "ml-auto"
              }`}
            >
              {/* Nút ẩn/hiện thư mục */}
              <Button
                variant="outline"
                onClick={() => setShowFolders(!showFolders)}
                title={showFolders ? "Ẩn thư mục" : "Hiện thư mục"}
                className="gap-2"
              >
                {showFolders ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="hidden md:inline">
                  {showFolders ? "Ẩn thư mục" : "Hiện thư mục"}
                </span>
              </Button>

              {/* Dropdown bộ lọc đuôi file */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="hidden md:inline">
                      {selectedExtension
                        ? `.${selectedExtension}`
                        : "Loại file"}
                    </span>
                    <ChevronDown className="w-4 h-4 hidden md:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setSelectedExtension(null)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedExtension === null ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Tất cả
                  </DropdownMenuItem>
                  {uniqueExtensions.map((ext) => (
                    <DropdownMenuItem
                      key={ext}
                      onClick={() => setSelectedExtension(ext)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedExtension === ext
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      .{ext}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dropdown bộ lọc sắp xếp */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden md:inline">Sắp xếp</span>
                    <ChevronDown className="w-4 h-4 hidden md:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setSortCriteria(SortCriteria.Default)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        sortCriteria === SortCriteria.Default
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Mặc định
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortCriteria(SortCriteria.Name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        sortCriteria === SortCriteria.Name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Tên
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortCriteria(SortCriteria.Size)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        sortCriteria === SortCriteria.Size
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Dung lượng
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortCriteria(SortCriteria.Date)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        sortCriteria === SortCriteria.Date
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Ngày tạo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Nút chuyển đổi grid/list view */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsGridView(!isGridView)}
              >
                {isGridView ? (
                  <List className="w-4 h-4" />
                ) : (
                  <LayoutGrid className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* File Grid/List với khả năng cuộn */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
        <div
          className={`
                    grid gap-2 py-2
                    ${
                      isGridView
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    }
                `}
        >
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-card p-4 rounded-xl shadow-sm border"
              >
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full mr-3" />
                  <Skeleton className="h-5 w-[200px]" />
                </div>
              </div>
            ))
          ) : sortedFiles.length === 0 ? (
            <div
              className="col-span-full flex flex-col items-center justify-center py-16 
                            bg-card rounded-xl border border-dashed"
            >
              <Folder className="w-16 h-16 mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">
                Thư mục trống
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Chưa có tệp tin hoặc thư mục nào
              </p>
            </div>
          ) : (
            sortedFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative",
                  file.isUploading ? "opacity-80 pointer-events-none" : ""
                )}
                onClick={() =>
                  file.mimeType === "application/vnd.google-apps.folder"
                    ? onFolderClick(file.id)
                    : null
                }
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-4">
                  <div className="flex items-center">
                    {/* File/Folder Icon */}
                    {file.mimeType === "application/vnd.google-apps.folder" ? (
                      <Folder className="w-10 h-10 text-blue-500 mr-3 fill-current" />
                    ) : (
                      <File className="w-10 h-10 text-muted-foreground mr-3" />
                    )}

                    {/* File/Folder Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-4">
                        <span>
                          {new Date(file.createdTime).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {file.size && <span>{formatFileSize(file.size)}</span>}
                      </div>
                    </div>

                    {/* Download Button */}
                    {!file.isUploading && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {file.mimeType !==
                            "application/vnd.google-apps.folder" && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = generateDownloadLink(file.id);
                                navigator.clipboard.writeText(link);
                                toast.success("Đã sao chép link tải file!");
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Sao chép link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              file.mimeType ===
                              "application/vnd.google-apps.folder"
                                ? handleDownloadFolder(file.id, file.name)
                                : onDownload(file.id, file.name);
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          {isAdminMode && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => handleDelete(e, file)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa vĩnh viễn
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {(file.isUploading || compressingFolder === file.id) && (
                    <div className="mt-4">
                      <Progress
                        value={
                          file.isUploading
                            ? file.uploadProgress
                            : compressionProgress
                        }
                        className="h-2"
                      />
                      <div className="text-xs font-medium text-muted-foreground text-right mt-1">
                        {file.isUploading
                          ? file.uploadProgress
                          : compressionProgress}
                        %
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa vĩnh viễn</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{fileToDelete?.name}&quot;? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Nhập mật khẩu admin"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword("");
                setFileToDelete(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting || !deletePassword}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
