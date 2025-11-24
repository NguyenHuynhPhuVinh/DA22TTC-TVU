"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Notebook, Search, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAISearch: boolean;
  onToggleAISearch: () => void;
  onSearch: () => void;
}

export default function Header({
  searchTerm,
  onSearchChange,
  isAISearch,
  onToggleAISearch,
  onSearch,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div
      className="flex flex-col md:flex-row items-center p-5 gap-4 md:gap-0 
            border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
            shadow-sm sticky top-0 z-10"
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-4 md:mb-0 mr-8">
        DA22TTC-TVU
      </h1>
      <div className="flex-1 w-full md:mr-8">
        <div className="max-w-[720px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={
              isAISearch ? "Tìm kiếm bằng AI..." : "Tìm kiếm tài liệu"
            }
            className="w-full pl-10 pr-24 h-12 text-base bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isAISearch) {
                onSearch();
              }
            }}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAISearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8
                        transition-colors duration-200 
                        ${
                          isAISearch
                            ? "text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
            title={isAISearch ? "Đang dùng AI" : "Chuyển sang tìm kiếm AI"}
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          {isAISearch && (
            <Button
              size="sm"
              onClick={onSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 h-8"
            >
              Tìm
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={
            theme === "dark"
              ? "Chuyển sang giao diện sáng"
              : "Chuyển sang giao diện tối"
          }
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Button className="gap-2" onClick={() => router.push("/txt")}>
            <Notebook className="w-4 h-4" />
            Ghi chú
          </Button>
        </div>
      </div>
    </div>
  );
}
