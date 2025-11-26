"use client"

import { useState } from "react";
import { Upload, FileText, Download, Trash2, Loader2 } from "lucide-react";
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
    disabled?: boolean;
    maxSize?: number; // in MB
}

export function MaterialsManager({
    lessonId,
    initialMaterials = [],
    onUpload,
    onDelete,
    onDownload,
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
            setMaterials([...materials, newMaterial]);
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
            setMaterials(materials.filter((_, i) => i !== index));
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
                <div className="space-y-2">
                    <p className="text-sm font-medium">Materials ({materials.length})</p>
                    <div className="space-y-2">
                        {materials.map((material, index) => {
                            const isDeleting = material.id && deletingIds.has(material.id);
                            
                            return (
                                <Card
                                    key={material.id || `temp-${index}`}
                                    className="p-3 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">
                                                {material.filename}
                                            </p>
                                            {material.size && (
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(material.size)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {material.id && onDownload && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownload(material)}
                                                disabled={disabled}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(material, index)}
                                            disabled={disabled || !!isDeleting}
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
