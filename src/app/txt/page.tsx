"use client";
import React, { useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useNote } from "../../components/hooks/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Copy, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NotePage = () => {
  const {
    notes,
    setNotes,
    newNote,
    setNewNote,
    loading,
    expandedNotes,
    setExpandedNotes,
    deleteMode,
    setDeleteMode,
    deleteCode,
    setDeleteCode,
    handleAddNote,
    handleDeleteNote,
    handleKeyDown,
    handleCopy,
    handleGoBack,
    toggleNoteExpansion,
    countLines,
  } = useNote();
  const { theme } = useTheme();

  useEffect(() => {
    if (deleteMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [deleteMode]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Quay lại trang chủ</span>
          </Button>

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            Ghi chú
          </h1>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-4">
          <TextareaAutosize
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập ghi chú mới..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono"
            minRows={3}
          />
          <Button onClick={handleAddNote} className="w-full mt-3 gap-2">
            <Plus className="w-4 h-4" />
            Thêm ghi chú
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[150px] w-full rounded-xl" />
              <Skeleton className="h-[150px] w-full rounded-xl" />
              <Skeleton className="h-[150px] w-full rounded-xl" />
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "group bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
                  deleteMode === note.id ? "ring-2 ring-destructive" : ""
                )}
              >
                <div className="p-4">
                  <div className="relative">
                    <pre
                      className={cn(
                        "overflow-x-auto",
                        !expandedNotes[note.id]
                          ? "max-h-[150px] overflow-y-hidden"
                          : ""
                      )}
                    >
                      <code
                        className="hljs block rounded-xl p-4 bg-gray-900 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: hljs.highlightAuto(note.content).value,
                        }}
                      />
                    </pre>

                    {countLines(note.content) > 5 &&
                      !expandedNotes[note.id] && (
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end justify-center pb-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNoteExpansion(note.id);
                            }}
                          >
                            Xem thêm
                          </Button>
                        </div>
                      )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(note.content)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteMode(note.id);
                          setDeleteCode("");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={deleteMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMode(null);
            setDeleteCode("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa ghi chú</DialogTitle>
            <DialogDescription className="text-destructive font-medium">
              Nhập &quot;XOA&quot; để xác nhận xóa ghi chú
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              value={deleteCode}
              onChange={(e) => setDeleteCode(e.target.value)}
              placeholder="Nhập mã xác nhận"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteMode(null);
                setDeleteCode("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteNote(deleteMode!)}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default NotePage;
