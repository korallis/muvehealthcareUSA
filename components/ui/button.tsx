"use client";

import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, onClick, className = "" }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        backgroundColor: "#19cece", // Custom hover color
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-1/2 min-w-[160px] flex items-center justify-center 
        px-6 py-3 bg-[#20E3D8] text-[#1F2A44] font-bold text-lg 
        rounded-full shadow-md transition-all duration-300 ${className}
      `}
    >
      {children}
    </motion.button>
  );
};
