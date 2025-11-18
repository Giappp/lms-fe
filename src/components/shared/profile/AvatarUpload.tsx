"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AvatarUploadProps {
    currentAvatar?: string;
    userName: string;
    onUpload: (file: File) => Promise<any>;
    onDelete?: () => Promise<boolean>;
    isUploading?: boolean;
}

export function AvatarUpload({
    currentAvatar,
    userName,
    onUpload,
    onDelete,
    isUploading = false,
}: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        const result = await onUpload(file);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        
        if (!result) {
            setError("Failed to upload avatar");
            setPreview(null);
        } else {
            // Clear preview after successful upload
            setTimeout(() => {
                setPreview(null);
            }, 500);
        }
    };

    const handleDelete = async () => {
        if (onDelete) {
            const success = await onDelete();
            if (success) {
                setPreview(null);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // Use preview first, then current avatar
    const displayAvatar = preview || currentAvatar;
    
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarImage src={displayAvatar} alt={userName} />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-primary/5">
                            {getInitials(userName)}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        onClick={handleClick}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center transition-colors"
                    >
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="h-4 w-4" />
                        )}
                    </button>
                </div>

                <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-medium">Profile Picture</h3>
                    <p className="text-xs text-muted-foreground">
                        Upload a new profile picture. JPG, PNG or GIF. Max size 5MB.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClick}
                            disabled={isUploading}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                        {displayAvatar && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isUploading}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
