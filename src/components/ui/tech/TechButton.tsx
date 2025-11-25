"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export const TechButton: React.FC<TechButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const borderRef = useRef<SVGRectElement>(null);

  const handleMouseEnter = () => {
    if (borderRef.current) {
      gsap.to(borderRef.current, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (borderRef.current) {
      gsap.to(borderRef.current, {
        strokeDashoffset: 200,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.97,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
    onClick?.(e);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-foreground text-background hover:bg-foreground/90",
    secondary: "bg-transparent text-foreground border border-foreground/30 hover:border-foreground",
    ghost: "bg-transparent text-foreground hover:bg-foreground/10",
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "disabled:opacity-50 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Animated border for secondary variant */}
      {variant === "secondary" && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={borderRef}
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="200"
            strokeDashoffset="200"
            opacity="0.5"
          />
        </svg>
      )}

      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
};

export default TechButton;
