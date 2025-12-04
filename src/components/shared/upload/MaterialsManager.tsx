"use client"

import { useState } from "react";
import { Upload, FileText, Download, ExternalLink, Loader2, File, FileCode, FileSpreadsheet, Presentation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Material {
    id?: number;
    filename: string;
    url?: string;
    size?: number;
    file?: File;
}

interface MaterialsManagerProps {
    lessonId?: number;
    initialMaterials?: Material[];
    onUpload?: (file: File) => Promise<void>;
    onDelete?: (materialId: number) => Promise<void>;
    onDownload?: (materialId: number, filename: string) => Promise<void>;
    onFilesChange?: (files: File[]) => void; // Callback to expose collected files
    disabled?: boolean;
    maxSize?: number; // in MB
}

export function MaterialsManager({
    lessonId,
    initialMaterials = [],
    onUpload,
    onDelete,
    onDownload,
    onFilesChange,
    disabled = false,
    maxSize = 50,
}: MaterialsManagerProps) {
    const [materials, setMaterials] = useState<Material[]>(initialMaterials);
    const [uploading, setUploading] = useState(false);
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
    const { toast } = useToast();

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return <FileText className="h-10 w-10 text-red-500" />;
            case 'doc':
            case 'docx':
                return <FileText className="h-10 w-10 text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
            case 'ppt':
            case 'pptx':
                return <Presentation className="h-10 w-10 text-orange-500" />;
            case 'txt':
                return <File className="h-10 w-10 text-gray-500" />;
            case 'html':
            case 'css':
            case 'js':
            case 'json':
                return <FileCode className="h-10 w-10 text-purple-500" />;
            default:
                return <File className="h-10 w-10 text-muted-foreground" />;
        }
    };

    const handleFileClick = (material: Material) => {
        if (material.url) {
            window.open(material.url, '_blank');
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        const maxBytes = maxSize * 1024 * 1024;
        if (file.size > maxBytes) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: `File size must not exceed ${maxSize}MB`,
            });
            return;
        }

        // If lessonId exists, upload to server
        if (lessonId && onUpload) {
            setUploading(true);
            try {
                await onUpload(file);
                toast({
                    title: "Success",
                    description: "Material uploaded successfully",
                });
                // Note: Parent component should refresh materials list
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Upload failed",
                    description: error instanceof Error ? error.message : "Failed to upload material",
                });
            } finally {
                setUploading(false);
            }
        } else {
            // For new lessons, just add to local state
            const newMaterial: Material = {
                filename: file.name,
                size: file.size,
                file,
            };
            const updatedMaterials = [...materials, newMaterial];
            setMaterials(updatedMaterials);
            
            // Notify parent component of file changes
            if (onFilesChange) {
                const files = updatedMaterials.filter(m => m.file).map(m => m.file!);
                onFilesChange(files);
            }
            
            toast({
                title: "File added",
                description: "Material will be uploaded when the lesson is created",
            });
        }

        // Reset input
        e.target.value = '';
    };

    const handleDelete = async (material: Material, index: number) => {
        if (material.id && lessonId && onDelete) {
            // Delete from server
            setDeletingIds(new Set(deletingIds).add(material.id));
            try {
                await onDelete(material.id);
                toast({
                    title: "Success",
                    description: "Material deleted successfully",
                });
                // Note: Parent component should refresh materials list
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Delete failed",
                    description: error instanceof Error ? error.message : "Failed to delete material",
                });
            } finally {
                setDeletingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(material.id!);
                    return next;
                });
            }
        } else {
            // Remove from local state
            const updatedMaterials = materials.filter((_, i) => i !== index);
            setMaterials(updatedMaterials);
            
            // Notify parent component of file changes
            if (onFilesChange) {
                const files = updatedMaterials.filter(m => m.file).map(m => m.file!);
                onFilesChange(files);
            }
            
            toast({
                title: "File removed",
                description: "Material removed from the list",
            });
        }
    };

    const handleDownload = async (material: Material) => {
        if (!material.id || !lessonId || !onDownload) return;

        try {
            await onDownload(material.id, material.filename);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Download failed",
                description: error instanceof Error ? error.message : "Failed to download material",
            });
        }
    };

    return (
        <div className="space-y-3">
            {/* Upload area */}
            <div className="relative">
                <input
                    type="file"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={disabled || uploading}
                    id="material-upload"
                />
                <label
                    htmlFor="material-upload"
                    className={`
                        flex flex-col items-center justify-center gap-2
                        border-2 border-dashed rounded-lg p-6
                        transition-colors cursor-pointer
                        ${disabled || uploading
                            ? 'border-muted bg-muted/50 cursor-not-allowed'
                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
                        }
                    `}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm text-center">
                                <span className="font-semibold text-primary">Click to upload</span>
                                {" "}or drag and drop
                            </div>
                            <p className="text-xs text-muted-foreground">
                                PDF, DOC, DOCX, PPT, PPTX up to {maxSize}MB
                            </p>
                        </>
                    )}
                </label>
            </div>

            {/* Materials list */}
            {materials.length > 0 && (
                <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">
                        Materials ({materials.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {materials.map((material, index) => {
                            const isDeleting = material.id && deletingIds.has(material.id);
                            const hasUrl = !!material.url;
                            
                            return (
                                <Card
                                    key={material.id || `temp-${index}`}
                                    className={`
                                        group relative overflow-hidden transition-all duration-200
                                        ${hasUrl 
                                            ? 'hover:shadow-md hover:border-primary/50 cursor-pointer' 
                                            : 'hover:shadow-sm'
                                        }
                                    `}
                                >
                                    {/* Delete button - top right corner */}
                                    {!disabled && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(material, index);
                                            }}
                                            disabled={!!isDeleting}
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                        </Button>
                                    )}

                                    <div 
                                        className="p-4 flex items-start gap-3"
                                        onClick={() => hasUrl && handleFileClick(material)}
                                    >
                                        {/* File Icon */}
                                        <div className="flex-shrink-0">
                                            {getFileIcon(material.filename)}
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                {material.filename}
                                            </h4>
                                            {material.size && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatFileSize(material.size)}
                                                </p>
                                            )}
                                            {hasUrl && (
                                                <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span>Click to open</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hover gradient overlay for clickable items */}
                                    {hasUrl && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
