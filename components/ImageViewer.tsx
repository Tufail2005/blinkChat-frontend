"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null; // The high-res URL
  altName: string; // Name to show if image fails or for caption
}

export function ImageViewer({
  isOpen,
  onClose,
  imageUrl,
  altName,
}: ImageViewerProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  // Generate High-Res URL if it's an ImageKit URL
  // If it's already a full URL, use it as is.
  const fullSrc = imageUrl?.includes("imagekit.io")
    ? imageUrl.split("?")[0]
    : imageUrl;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
          <span className="text-white font-medium text-lg ml-2">{altName}</span>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* The Image Container */}
        <div
          className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()} // Clicking image shouldn't close it
        >
          {imageUrl ? (
            <img
              src={fullSrc || ""}
              alt={altName}
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
            />
          ) : (
            // Fallback if no image exists
            <div className="w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700">
              <span className="text-6xl font-bold text-gray-500">
                {altName.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
