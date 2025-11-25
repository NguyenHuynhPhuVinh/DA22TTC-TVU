"use client";
import React, { useEffect, useState, useRef } from "react";

interface TypeWriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  className = "",
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "▋",
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayText("");
    indexRef.current = 0;
    setIsComplete(false);

    const startTyping = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTyping);
  }, [text, speed, delay, onComplete]);

  // Cursor blink
  useEffect(() => {
    if (!cursor) return;
    
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span
          className="inline-block ml-0.5"
          style={{ opacity: showCursor ? 1 : 0 }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TypeWriter;
