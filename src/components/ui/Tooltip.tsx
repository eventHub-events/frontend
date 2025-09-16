"use client"
import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  message: string;
}

export const Tooltip = ({ children, message }: TooltipProps) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
        {message}
      </div>
    </div>
  );
};
