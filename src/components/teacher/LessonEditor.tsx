"use client";

import React, {useState} from 'react';
import {Lesson} from '@/types/types';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {LessonType} from '@/types/enum';
import {
    AlertCircle,
    Code,
    Eye,
    File,
    FileText,
    Link as LinkIcon,
    LucideYoutube,
    Upload,
    Video,
    X,
    Youtube
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription} from '@/components/ui/alert';
import dynamic from 'next/dynamic';

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="border rounded-lg p-8 flex items-center justify-center bg-muted/50">
            <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"/>
                <p className="text-sm text-muted-foreground">Loading editor...</p>
            </div>
        </div>
    )
});

type Props = {
    lesson: Lesson;
    index?: number;
    onChangeAction: (updated: Lesson) => void;
};

export default function LessonEditor({lesson, index, onChangeAction}: Props) {
    const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

    const handleFileUpload = (file: File) => {
        const currentMaterials = lesson.materials || [];
        onChangeAction({
            ...lesson,
            materials: [...currentMaterials, file],
        });
    };

    const handleFileRemove = (indexToRemove: number) => {
        const currentMaterials = lesson.materials || [];
        onChangeAction({
            ...lesson,
            materials: currentMaterials.filter((_, idx) => idx !== indexToRemove),
        });
    };

    const handleMultipleFilesUpload = (files: FileList) => {
        const currentMaterials = lesson.materials || [];
        const newFiles = Array.from(files);
        onChangeAction({
            ...lesson,
            materials: [...currentMaterials, ...newFiles],
        });
    };

    const getLessonIcon = (type: LessonType) => {
        switch (type) {
            case 'VIDEO':
                return <Video className="w-4 h-4"/>;
            case 'YOUTUBE':
                return <LucideYoutube className="w-4 h-4"/>;
            case 'MARKDOWN':
                return <FileText className="w-4 h-4"/>;
            default:
                return <FileText className="w-4 h-4"/>;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getLessonTypeInfo = (type: LessonType) => {
        switch (type) {
            case 'VIDEO':
                return {
                    title: 'Video Lesson',
                    description: 'Upload a video file to create a video-based lesson',
                    color: 'bg-chart-2/10 text-chart-2 border-chart-2/20'
                };
            case 'YOUTUBE':
                return {
                    title: 'YouTube Lesson',
                    description: 'Link to a YouTube video for this lesson',
                    color: 'bg-destructive/10 text-destructive border-destructive/20'
                };
            case 'MARKDOWN':
                return {
                    title: 'Rich Text Lesson',
                    description: 'Create interactive content with rich text editor and attachments',
                    color: 'bg-primary/10 text-primary border-primary/20'
                };
            default:
                return {
                    title: 'Lesson',
                    description: 'Configure your lesson',
                    color: 'bg-muted text-muted-foreground'
                };
        }
    };

    const needsFileUpload = lesson.type === LessonType.VIDEO;
    const showRichTextEditor = lesson.type === LessonType.MARKDOWN;
    const showExternalLink = lesson.type === LessonType.YOUTUBE;
    const acceptedFormats = lesson.type === 'VIDEO' ? 'video/mp4,video/webm,video/ogg' : 'application/pdf';
    const maxFiles = lesson.type === 'VIDEO' ? 1 : 10;

    const typeInfo = getLessonTypeInfo(lesson.type);

    return (
        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto p-6 bg-background rounded-lg shadow-lg">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${typeInfo.color} border`}>
                        {getLessonIcon(lesson.type)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {index !== undefined ? `Lesson ${index + 1}` : 'Lesson Details'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {typeInfo.description}
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className={typeInfo.color}>
                    {typeInfo.title}
                </Badge>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
                <Label htmlFor="lesson-title" className="text-sm font-medium flex items-center gap-2">
                    Lesson Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="lesson-title"
                    value={lesson.title}
                    onChange={(e) => onChangeAction({...lesson, title: e.target.value})}
                    placeholder="e.g., Introduction to React Hooks"
                    className="transition-all focus:ring-2"
                />
                {!lesson.title && (
                    <p className="text-xs text-muted-foreground">
                        Give your lesson a clear, descriptive title
                    </p>
                )}
            </div>

            {/* Type and Duration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="lesson-type" className="text-sm font-medium flex items-center gap-2">
                        Lesson Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={lesson.type}
                        onValueChange={(value: LessonType) =>
                            onChangeAction({...lesson, type: value, materials: [], content: ''})
                        }
                    >
                        <SelectTrigger className="transition-all focus:ring-2">
                            <SelectValue placeholder="Select lesson type"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VIDEO">
                                <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4"/>
                                    Video Lesson
                                </div>
                            </SelectItem>
                            <SelectItem value="YOUTUBE">
                                <div className="flex items-center gap-2">
                                    <Youtube className="w-4 h-4"/>
                                    YouTube Link
                                </div>
                            </SelectItem>
                            <SelectItem value="MARKDOWN">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4"/>
                                    Rich Text Lesson
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lesson-duration" className="text-sm font-medium flex items-center gap-2">
                        Duration (minutes) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="lesson-duration"
                        type="number"
                        min="0"
                        step="1"
                        value={lesson.duration}
                        onChange={(e) => onChangeAction({...lesson, duration: parseInt(e.target.value) || 0})}
                        placeholder="30"
                        className="transition-all focus:ring-2"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="lesson-description" className="text-sm font-medium">
                    Short Description
                </Label>
                <Textarea
                    id="lesson-description"
                    value={lesson.description}
                    onChange={(e) => onChangeAction({...lesson, description: e.target.value})}
                    placeholder="Provide a brief overview of what students will learn in this lesson..."
                    className="min-h-[100px] transition-all focus:ring-2 resize-none"
                    rows={4}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Brief summary for lesson preview</span>
                    <span>{lesson.description?.length || 0} / 500 characters</span>
                </div>
            </div>

            {/* Content Section Based on Type */}
            <div className="space-y-4">
                {/* Video File Upload */}
                {needsFileUpload && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                Video File <span className="text-destructive">*</span>
                            </Label>
                            {lesson.materials && lesson.materials.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {lesson.materials.length} / {maxFiles} file
                                </span>
                            )}
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription className="text-xs">
                                Supported formats: MP4, WebM, OGG. Maximum file size: 500MB
                            </AlertDescription>
                        </Alert>

                        {/* Upload Area */}
                        {(!lesson.materials || lesson.materials.length < maxFiles) && (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept={acceptedFormats}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            handleFileUpload(e.target.files[0]);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    id="file-upload-input"
                                />
                                <div
                                    className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer">
                                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground"/>
                                    <p className="text-sm font-medium mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        MP4, WebM, or OGG (Max 1 file, up to 500MB)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Uploaded Files List */}
                        {lesson.materials && lesson.materials.length > 0 && (
                            <div className="space-y-2">
                                {lesson.materials.map((material, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border hover:border-primary/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="p-2 bg-background rounded">
                                                <Video className="w-5 h-5 text-primary"/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {material.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(material.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFileRemove(idx)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Rich Text Editor for Markdown */}
                {showRichTextEditor && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                Lesson Content <span className="text-destructive">*</span>
                            </Label>
                            <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as any)}>
                                <TabsList className="h-8">
                                    <TabsTrigger value="edit" className="text-xs gap-1 h-7">
                                        <Code className="w-3 h-3"/>
                                        Edit
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="text-xs gap-1 h-7">
                                        <Eye className="w-3 h-3"/>
                                        Preview
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {editorMode === 'edit' ? (
                            <RichTextEditor
                                content={lesson.content || ''}
                                onChange={(content) => onChangeAction({...lesson, content})}
                            />
                        ) : (
                            <div
                                className="border rounded-lg p-6 min-h-[400px] bg-background prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{__html: lesson.content || '<p class="text-muted-foreground">No content to preview</p>'}}
                            />
                        )}

                        {/* Additional Materials/Attachments for Markdown */}
                        <div className="pt-4 border-t space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Attachments (Optional)
                                </Label>
                                {lesson.materials && lesson.materials.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                        {lesson.materials.length} / {maxFiles} files
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upload supplementary materials like PDFs, documents, or resources for students
                            </p>

                            {/* Upload Area for Attachments */}
                            {(!lesson.materials || lesson.materials.length < maxFiles) && (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt,.zip"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                handleMultipleFilesUpload(e.target.files);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer">
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground"/>
                                        <p className="text-sm font-medium mb-1">
                                            Click to upload attachments
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PDF, DOC, DOCX, TXT, ZIP (Max {maxFiles} files)
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Uploaded Attachments List */}
                            {lesson.materials && lesson.materials.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {lesson.materials.map((material, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border hover:border-primary/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="p-1.5 bg-background rounded">
                                                    <File className="w-4 h-4 text-primary"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">
                                                        {material.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(material.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFileRemove(idx)}
                                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* YouTube Link */}
                {showExternalLink && (
                    <div className="space-y-3">
                        <Label htmlFor="lesson-content" className="text-sm font-medium flex items-center gap-2">
                            YouTube Video URL <span className="text-destructive">*</span>
                        </Label>
                        <Alert>
                            <Youtube className="h-4 w-4"/>
                            <AlertDescription className="text-xs">
                                Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=...)
                            </AlertDescription>
                        </Alert>
                        <div className="relative">
                            <LinkIcon
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <Input
                                id="lesson-content"
                                value={lesson.content}
                                onChange={(e) => onChangeAction({...lesson, content: e.target.value})}
                                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                className="pl-10 transition-all focus:ring-2"
                            />
                        </div>
                        {lesson.content && (
                            <div className="p-4 bg-accent/50 rounded-lg border">
                                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                                <div className="aspect-video bg-muted rounded overflow-hidden">
                                    {/* YouTube Embed Preview */}
                                    {lesson.content.includes('youtube.com') || lesson.content.includes('youtu.be') ? (
                                        <iframe
                                            src={lesson.content.replace('watch?v=', 'embed/').split('&')[0]}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div
                                            className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            Invalid YouTube URL
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}