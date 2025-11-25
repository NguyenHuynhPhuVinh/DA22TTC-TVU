"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "loading" | "warning" | "error";
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className,
  size = "md",
  pulse = true,
}) => {
  const statusColors = {
    online: "#00ff88",
    offline: "#666666",
    loading: "#ffaa00",
    warning: "#ffaa00",
    error: "#ff4444",
  };

  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const color = statusColors[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(sizeClasses[size])}
          style={{ backgroundColor: color }}
        />
        {pulse && status === "online" && (
          <div
            className={cn("absolute inset-0 animate-ping", sizeClasses[size])}
            style={{ backgroundColor: color, opacity: 0.5 }}
          />
        )}
        {status === "loading" && (
          <div
            className={cn("absolute inset-0 animate-pulse", sizeClasses[size])}
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      {label && (
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
