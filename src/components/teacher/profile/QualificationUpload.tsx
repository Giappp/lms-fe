"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    FileText,
    Upload,
    X,
    Download,
    Check,
    AlertCircle,
    Loader2,
    File,
} from "lucide-react";

interface Qualification {
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
}

interface QualificationUploadProps {
    qualifications?: Qualification[];
    onUpload: (file: File) => Promise<any>;
    onDelete?: (fileUrl: string) => Promise<boolean>;
    isUploading?: boolean;
}

export function QualificationUpload({
    qualifications = [],
    onUpload,
    onDelete,
    isUploading = false,
}: QualificationUploadProps) {
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            await handleFile(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleFile(file);
        }
    };

    const handleFile = async (file: File) => {
        // Note: Client-side validation only. Backend MUST validate file type, size, and content
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Please upload PDF, DOC, DOCX, or image files only");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setError(null);

        // Upload file
        const result = await onUpload(file);
        if (!result) {
            setError("Failed to upload qualification document");
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDelete = async (fileUrl: string) => {
        if (onDelete) {
            const success = await onDelete(fileUrl);
            if (!success) {
                setError("Failed to delete qualification document");
            }
        }
    };

    const handleDownload = async (url: string, name: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            setError("Failed to download qualification document");
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Professional Qualifications
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Upload certificates, degrees, or other credentials to verify your
                            professional qualifications
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="h-fit">
                        Teacher Only
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload qualification documents"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleClick();
                        }
                    }}
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Drag and drop your files here, or{" "}
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    disabled={isUploading}
                                    className="text-primary hover:underline disabled:opacity-50"
                                    aria-label="Browse files"
                                >
                                    browse
                                </button>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX, JPG, PNG up to 10MB
                            </p>
                        </div>
                        {isUploading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Uploaded Files List */}
                {qualifications.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            Uploaded Documents ({qualifications.length})
                        </h4>
                        <div className="space-y-2">
                            {qualifications.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <File className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)} • Uploaded{" "}
                                            {formatDate(file.uploadedAt)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownload(file.url, file.name)}
                                            aria-label={`Download ${file.name}`}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(file.url)}
                                            disabled={isUploading}
                                            aria-label={`Delete ${file.name}`}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </CardContent>
        </Card>
    );
}
