"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface TechRubikCubeProps {
  size?: number;
  color?: string;
  className?: string;
}

export const TechRubikCube: React.FC<TechRubikCubeProps> = ({
  size = 60,
  color = "#00ff88",
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cubeSize = size / 3;
  const gap = 2;

  // Generate 3x3x3 cube positions with random scatter positions
  const cubes: { x: number; y: number; z: number; scatterX: number; scatterY: number; scatterZ: number; delay: number }[] = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (x === 1 && y === 1 && z === 1) continue;
        // Random scatter positions (far away initially)
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        cubes.push({
          x: (x - 1) * (cubeSize + gap),
          y: (y - 1) * (cubeSize + gap),
          z: (z - 1) * (cubeSize + gap),
          scatterX: Math.cos(angle) * distance,
          scatterY: (Math.random() - 0.5) * distance,
          scatterZ: Math.sin(angle) * distance,
          delay: Math.random() * 0.3,
        });
      }
    }
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "500px" }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl"
        style={{ backgroundColor: color }}
        animate={{
          opacity: isHovered ? 0.5 : 0.15,
          scale: isHovered ? 1.8 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Main cube container */}
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: -25,
          rotateY: isHovered ? 45 : 45,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        {cubes.map((cube, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              width: cubeSize,
              height: cubeSize,
              transformStyle: "preserve-3d",
              left: "50%",
              top: "50%",
            }}
            initial={{
              x: cube.scatterX - cubeSize / 2,
              y: cube.scatterY - cubeSize / 2,
              z: cube.scatterZ,
              opacity: 0,
              rotateX: Math.random() * 360,
              rotateY: Math.random() * 360,
            }}
            animate={{
              x: isHovered ? cube.x - cubeSize / 2 : cube.scatterX - cubeSize / 2,
              y: isHovered ? cube.y - cubeSize / 2 : cube.scatterY - cubeSize / 2,
              z: isHovered ? cube.z : cube.scatterZ,
              opacity: 1,
              rotateX: isHovered ? 0 : Math.random() * 180,
              rotateY: isHovered ? 0 : Math.random() * 180,
            }}
            transition={{
              duration: 0.6,
              delay: isHovered ? cube.delay : cube.delay * 0.5,
              ease: isHovered ? [0.34, 1.56, 0.64, 1] : "easeOut",
            }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 border"
              style={{
                backgroundColor: `${color}15`,
                borderColor: color,
                transform: `translateZ(${cubeSize / 2}px)`,
                boxShadow: `inset 0 0 ${cubeSize / 4}px ${color}40`,
              }}
            />
            {/* Back face */}
            <div
              className="absolute inset-0 border"
              style={{
                backgroundColor: `${color}10`,
                borderColor: `${color}80`,
                transform: `translateZ(-${cubeSize / 2}px) rotateY(180deg)`,
              }}
            />
            {/* Left face */}
            <div
              className="absolute inset-0 border"
              style={{
                backgroundColor: `${color}12`,
                borderColor: `${color}90`,
                transform: `translateX(-${cubeSize / 2}px) rotateY(-90deg)`,
              }}
            />
            {/* Right face */}
            <div
              className="absolute inset-0 border"
              style={{
                backgroundColor: `${color}12`,
                borderColor: `${color}90`,
                transform: `translateX(${cubeSize / 2}px) rotateY(90deg)`,
              }}
            />
            {/* Top face */}
            <div
              className="absolute inset-0 border"
              style={{
                backgroundColor: `${color}18`,
                borderColor: color,
                transform: `translateY(-${cubeSize / 2}px) rotateX(90deg)`,
                boxShadow: `inset 0 0 ${cubeSize / 3}px ${color}50`,
              }}
            />
            {/* Bottom face */}
            <div
              className="absolute inset-0 border"
              style={{
                backgroundColor: `${color}08`,
                borderColor: `${color}60`,
                transform: `translateY(${cubeSize / 2}px) rotateX(-90deg)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
        animate={{
          top: isHovered ? ["0%", "100%", "0%"] : "50%",
          opacity: isHovered ? [0.8, 0.8, 0.8] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: "linear",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute -inset-2 pointer-events-none">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: color }} />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: color }} />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: color }} />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: color }} />
      </div>

      {/* Label */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
        animate={{ opacity: isHovered ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-[8px] font-mono tracking-wider" style={{ color }}>
          {isHovered ? "ASSEMBLING..." : "HOVER_ME"}
        </span>
      </motion.div>
    </div>
  );
};

export default TechRubikCube;
