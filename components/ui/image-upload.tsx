"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { storageService } from "@/lib/storage";

interface ImageUploadProps {
  onImageUploaded: (url: string, path: string) => void;
  currentImage?: string;
  className?: string;
  multiple?: boolean;
}

export default function ImageUpload({
  onImageUploaded,
  currentImage,
  className,
  multiple = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      if (multiple) {
        // Handle multiple files
        const fileArray = Array.from(files);
        const results = await storageService.uploadMultipleImages(fileArray);

        results.forEach((result) => {
          onImageUploaded(result.url, result.path);
        });
      } else {
        // Handle single file
        const file = files[0];

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to Supabase
        const result = await storageService.uploadImage(file);

        if (result) {
          onImageUploaded(result.url, result.path);
          setPreview(result.url);
        } else {
          alert("Failed to upload image. Please try again.");
          setPreview(null);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading
            ? "Uploading..."
            : multiple
            ? "Upload Images"
            : "Upload Image"}
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          multiple={multiple}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {!preview && (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}
