"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ThumbnailUploaderProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export function ThumbnailUploader({
  value,
  onChange,
  disabled = false,
  maxSize = 5,
  className = "",
}: ThumbnailUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(null);
      setError(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Image size must not exceed ${maxSize}MB`);
      return;
    }

    setError(null);
    onChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !preview) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-border bg-muted">
            <Image
              src={preview}
              alt="Thumbnail preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
