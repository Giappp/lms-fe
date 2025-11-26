"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LessonRequest } from "@/types/request";
import { LessonResponse } from "@/types/response";
import { LessonType } from "@/types/enum";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Upload, X, FileVideo, Youtube, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoUploader } from "@/components/shared/upload/VideoUploader";
import { MaterialsManager } from "@/components/shared/upload/MaterialsManager";

const lessonFormSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must not exceed 200 characters"),
    type: z.nativeEnum(LessonType, {
        message: "Please select a lesson type",
    }),
    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description must not exceed 1000 characters"),
    duration: z.number()
        .min(1, "Duration must be at least 1 minute")
        .max(600, "Duration cannot exceed 600 minutes"),
    content: z.string().optional(),
    videoUrl: z.string().max(500, "URL must not exceed 500 characters").optional(),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface LessonFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    chapterId: number;
    initialData?: LessonResponse;
    onSubmit: (data: LessonRequest, videoFile?: File) => Promise<void>;
    isLoading?: boolean;
}

export function LessonForm({
    open,
    onOpenChange,
    mode,
    chapterId,
    initialData,
    onSubmit,
    isLoading = false,
}: LessonFormProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoValue, setVideoValue] = useState<File | string | null>(
        initialData?.videoUrl || null
    );
    const [selectedType, setSelectedType] = useState<LessonType>(
        initialData?.type || LessonType.VIDEO
    );

    const form = useForm<LessonFormValues>({
        resolver: zodResolver(lessonFormSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            type: initialData?.type || LessonType.VIDEO,
            description: initialData?.description || "",
            duration: initialData?.duration || 10,
            content: initialData?.content || "",
            videoUrl: initialData?.videoUrl || "",
        },
    });

    const handleVideoFileChange = (file: File | null) => {
        setVideoFile(file);
        setVideoValue(file);
    };

    const handleFormSubmit = async (values: LessonFormValues) => {
        try {
            const data: LessonRequest = {
                title: values.title,
                type: values.type,
                description: values.description,
                duration: values.duration,
                content: values.type === LessonType.MARKDOWN ? values.content : undefined,
                videoUrl: values.type === LessonType.YOUTUBE ? values.videoUrl : undefined,
            };

            await onSubmit(data, videoFile || undefined);
            form.reset();
            setVideoFile(null);
            setVideoValue(null);
            onOpenChange(false);
        } catch (error) {
            // Error is already handled by parent component
            console.error("Failed to submit lesson:", error);
        }
    };

    const handleClose = () => {
        form.reset();
        setVideoFile(null);
        setVideoValue(null);
        onOpenChange(false);
    };

    const handleTypeChange = (type: LessonType) => {
        setSelectedType(type);
        form.setValue("type", type);
        // Clear type-specific fields
        form.setValue("content", "");
        form.setValue("videoUrl", "");
        setVideoFile(null);
        setVideoValue(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Add New Lesson" : "Edit Lesson"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new lesson for this chapter."
                            : "Update lesson information."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson Title *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Introduction to HTML"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Lesson Type */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson Type *</FormLabel>
                                    <Tabs 
                                        value={selectedType} 
                                        onValueChange={(value) => handleTypeChange(value as LessonType)}
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value={LessonType.VIDEO}>
                                                <FileVideo className="h-4 w-4 mr-2" />
                                                Video Upload
                                            </TabsTrigger>
                                            <TabsTrigger value={LessonType.YOUTUBE}>
                                                <Youtube className="h-4 w-4 mr-2" />
                                                YouTube
                                            </TabsTrigger>
                                            <TabsTrigger value={LessonType.MARKDOWN}>
                                                <FileText className="h-4 w-4 mr-2" />
                                                Markdown
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Duration */}
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (minutes) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="10"
                                            min="1"
                                            max="600"
                                            {...field}
                                            value={field.value as number}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Estimated time to complete this lesson
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what students will learn in this lesson..."
                                            className="min-h-24"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type-specific content */}
                        {selectedType === LessonType.VIDEO && (
                            <div className="space-y-2">
                                <FormLabel>Video File</FormLabel>
                                <VideoUploader
                                    value={videoValue}
                                    onChange={handleVideoFileChange}
                                    disabled={isLoading}
                                    maxSize={500}
                                />
                                <FormDescription>
                                    Upload a video file for this lesson (MP4, WebM, max 500MB)
                                </FormDescription>
                            </div>
                        )}

                        {selectedType === LessonType.YOUTUBE && (
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>YouTube URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Paste the full YouTube video URL
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {selectedType === LessonType.MARKDOWN && (
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Content (Markdown)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="# Lesson Content&#10;&#10;Write your lesson content in Markdown format..."
                                                className="min-h-48 font-mono text-sm"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Use Markdown syntax to format your lesson content
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Materials Section - Show for all lesson types */}
                        <div className="space-y-2 pt-4 border-t">
                            <FormLabel>Lesson Materials (Optional)</FormLabel>
                            <MaterialsManager
                                lessonId={initialData?.id}
                                initialMaterials={initialData?.materials?.map(m => ({
                                    id: parseInt(m.id) || 0,
                                    filename: m.name,
                                    url: m.url,
                                    size: m.size,
                                })) || []}
                                disabled={isLoading}
                                maxSize={50}
                            />
                            <FormDescription>
                                Upload supplementary materials (PDFs, documents, slides) for students
                            </FormDescription>
                        </div>

                        {/* Form Errors */}
                        {form.formState.errors.root && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Saving..."
                                    : mode === "create"
                                    ? "Create Lesson"
                                    : "Update Lesson"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
