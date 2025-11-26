"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, FileVideo, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoUploaderProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export function VideoUploader({
  value,
  onChange,
  disabled = false,
  maxSize = 500,
  className = "",
}: VideoUploaderProps) {
  const [preview, setPreview] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      // Extract filename from URL
      const filename = value.split("/").pop() || "video.mp4";
      setPreview({ name: filename, size: 0 });
    } else if (value instanceof File) {
      setPreview({ name: value.name, size: value.size });
    }
  }, [value]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(null);
      setError(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Video size must not exceed ${maxSize}MB`);
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
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border-2 border-border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded">
                <FileVideo className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{preview.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(preview.size)}
                </p>
              </div>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="ml-2 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
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
            accept="video/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Click to upload video or drag and drop
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                MP4, WebM, MOV up to {maxSize}MB
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
