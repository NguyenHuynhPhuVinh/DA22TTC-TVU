"use client";
import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const FolderTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M6 12H18" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M6 15H14" stroke={color} strokeWidth="1" opacity="0.5" />
    <circle cx="19" cy="17" r="1" fill={color} opacity="0.8" />
  </svg>
);

export const FileTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M14 2V8H20" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M8 13H16" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M8 16H12" stroke={color} strokeWidth="1" opacity="0.5" />
    <circle cx="17" cy="19" r="1" fill={color} opacity="0.8" />
  </svg>
);

export const UploadTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16V4M12 4L8 8M12 4L16 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="4" r="1.5" fill={color} opacity="0.5" />
  </svg>
);

export const DownloadTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4V16M12 16L8 12M12 16L16 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1.5" fill={color} opacity="0.5" />
  </svg>
);

export const SearchTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.5" />
    <path d="M14.5 14.5L20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="2" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M10 7V8" stroke={color} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
  </svg>
);

export const StorageTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4" width="18" height="6" rx="1" stroke={color} strokeWidth="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1" stroke={color} strokeWidth="1.5" />
    <circle cx="17" cy="7" r="1" fill={color} />
    <circle cx="17" cy="17" r="1" fill={color} />
    <path d="M6 7H12" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M6 17H12" stroke={color} strokeWidth="1" opacity="0.5" />
  </svg>
);

export const NoteTechIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4H20V16L16 20H4V4Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M16 16V20L20 16H16Z" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M7 8H17" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M7 11H14" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M7 14H11" stroke={color} strokeWidth="1" opacity="0.5" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M6 9L9 12L6 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="6" r="0.5" fill={color} />
    <circle cx="7" cy="6" r="0.5" fill={color} />
    <circle cx="9" cy="6" r="0.5" fill={color} />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 6L3 12L8 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 6L21 12L16 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4L10 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ChipIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="6" width="12" height="12" rx="1" stroke={color} strokeWidth="1.5" />
    <rect x="9" y="9" width="6" height="6" stroke={color} strokeWidth="1" opacity="0.5" />
    {/* Top pins */}
    <path d="M9 6V3" stroke={color} strokeWidth="1.5" />
    <path d="M12 6V3" stroke={color} strokeWidth="1.5" />
    <path d="M15 6V3" stroke={color} strokeWidth="1.5" />
    {/* Bottom pins */}
    <path d="M9 18V21" stroke={color} strokeWidth="1.5" />
    <path d="M12 18V21" stroke={color} strokeWidth="1.5" />
    <path d="M15 18V21" stroke={color} strokeWidth="1.5" />
    {/* Left pins */}
    <path d="M6 9H3" stroke={color} strokeWidth="1.5" />
    <path d="M6 12H3" stroke={color} strokeWidth="1.5" />
    <path d="M6 15H3" stroke={color} strokeWidth="1.5" />
    {/* Right pins */}
    <path d="M18 9H21" stroke={color} strokeWidth="1.5" />
    <path d="M18 12H21" stroke={color} strokeWidth="1.5" />
    <path d="M18 15H21" stroke={color} strokeWidth="1.5" />
  </svg>
);
