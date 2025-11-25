"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  GlitchText,
  TechBadge,
  LoadingDots,
  NeonBorder,
  PulseRing,
} from "@/components/ui/tech";
import { FileTechIcon } from "@/components/icons/TechIcons";
import { X, Download, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  onDownload: () => void;
}

interface PreviewData {
  previewType: "text" | "image" | "video" | "audio" | "pdf" | "unsupported";
  name: string;
  mimeType: string;
  size?: string;
  content?: string;
  thumbnailLink?: string;
  downloadUrl?: string;
  streamUrl?: string;
  error?: string;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  isOpen,
  onClose,
  fileId,
  fileName,
  onDownload,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && fileId) {
      fetchPreview();
    }
    return () => {
      setPreviewData(null);
      setIsLoading(true);
    };
  }, [isOpen, fileId]);

  const fetchPreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/drive/preview?fileId=${fileId}`);
      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      console.error("Error fetching preview:", error);
      setPreviewData({
        previewType: "unsupported",
        name: fileName,
        mimeType: "unknown",
        error: "Failed to load preview",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = () => {
    if (previewData?.content) {
      navigator.clipboard.writeText(previewData.content);
      setCopied(true);
      toast.success("CONTENT_COPIED");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: string | number) => {
    const size = typeof bytes === "string" ? parseInt(bytes) : bytes;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getLanguageFromMimeType = (mimeType: string): string => {
    const map: Record<string, string> = {
      "application/json": "json",
      "text/javascript": "javascript",
      "application/javascript": "javascript",
      "text/html": "html",
      "text/css": "css",
      "text/markdown": "markdown",
      "text/xml": "xml",
      "application/xml": "xml",
    };
    return map[mimeType] || "plaintext";
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <PulseRing color="#00ff88" size={60} rings={3} />
          <div className="flex items-center gap-2 mt-4">
            <LoadingDots color="#00ff88" size={6} />
            <span className="text-xs font-mono text-muted-foreground">LOADING_PREVIEW</span>
          </div>
        </div>
      );
    }

    if (!previewData || previewData.error) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <FileTechIcon size={48} className="text-muted-foreground mb-4" />
          <p className="text-sm font-mono text-muted-foreground mb-2">
            {previewData?.error || "PREVIEW_UNAVAILABLE"}
          </p>
          <Button onClick={onDownload} variant="outline" className="rounded-none font-mono text-xs mt-4">
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD_FILE
          </Button>
        </div>
      );
    }

    switch (previewData.previewType) {
      case "text":
        return (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyContent}
                className="h-8 px-2 font-mono text-xs"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <NeonBorder color="#00ff88" intensity="low">
              <pre className="p-4 text-xs font-mono overflow-auto max-h-[60vh] bg-muted/20">
                <code>{previewData.content}</code>
              </pre>
            </NeonBorder>
          </div>
        );

      case "image":
        return (
          <div className="flex items-center justify-center p-4">
            <img
              src={previewData.streamUrl || ""}
              alt={previewData.name}
              className="max-w-full max-h-[60vh] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = previewData.thumbnailLink || "";
              }}
            />
          </div>
        );

      case "video":
        return (
          <div className="p-4">
            <video
              controls
              className="w-full max-h-[60vh]"
              src={previewData.streamUrl || ""}
            >
              Your browser does not support video playback.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="p-8 flex flex-col items-center">
            <FileTechIcon size={64} className="text-[#00ff88] mb-6" />
            <audio controls className="w-full max-w-md" src={previewData.streamUrl || ""}>
              Your browser does not support audio playback.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div className="p-4">
            <iframe
              src={previewData.streamUrl || ""}
              className="w-full h-[60vh] border-0"
              title={previewData.name}
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <FileTechIcon size={48} className="text-muted-foreground mb-4" />
            <p className="text-sm font-mono text-muted-foreground mb-2">
              PREVIEW_NOT_SUPPORTED
            </p>
            <p className="text-xs font-mono text-muted-foreground/60 mb-4">
              {previewData.mimeType}
            </p>
            <Button onClick={onDownload} variant="outline" className="rounded-none font-mono text-xs">
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD_FILE
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden rounded-none border-[#00ff88]/30 bg-background p-0">
        {/* Header */}
        <div className="border-b border-[#00ff88]/20 bg-[#00ff88]/5 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between font-mono">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileTechIcon size={24} className="text-[#00ff88] shrink-0" />
                <GlitchText intensity="low" className="truncate">
                  {fileName}
                </GlitchText>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {previewData?.size && (
                  <TechBadge variant="default" size="sm">
                    {formatFileSize(previewData.size)}
                  </TechBadge>
                )}
                {previewData?.mimeType && (
                  <TechBadge variant="info" size="sm">
                    {previewData.mimeType.split("/").pop()?.toUpperCase()}
                  </TechBadge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="overflow-auto">{renderPreview()}</div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-muted/20">
          <div className="text-[10px] font-mono text-muted-foreground">
            FILE_ID: {fileId.slice(0, 12)}...
          </div>
          <div className="flex items-center gap-2">
            {previewData?.downloadUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(previewData.downloadUrl, "_blank")}
                className="h-8 rounded-none font-mono text-xs"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                OPEN
              </Button>
            )}
            <Button
              size="sm"
              onClick={onDownload}
              className="h-8 rounded-none font-mono text-xs bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
            >
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;
