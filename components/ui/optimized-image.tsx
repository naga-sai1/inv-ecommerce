"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
  fill = false,
  priority = false,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to placeholder if image fails to load or src is invalid
  const imageSrc =
    imageError || !src || src.includes("placeholder")
      ? `/placeholder.svg?height=${height}&width=${width}`
      : src;

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={`object-cover ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300 rounded`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={priority}
      />
    </div>
  );
}
