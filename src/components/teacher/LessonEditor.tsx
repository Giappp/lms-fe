"use client";

import React from 'react';
import {Lesson} from '@/types/types';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {LessonType} from '@/types/enum';
import {File, FileText, Link as LinkIcon, LucideYoutube, Upload, Video, X, Youtube} from 'lucide-react';
import {Button} from '@/components/ui/button';

type Props = {
    lesson: Lesson;
    index?: number;
    onChangeAction: (updated: Lesson) => void;
};

export default function LessonEditor({lesson, index, onChangeAction}: Props) {
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
                return <LinkIcon className="w-4 h-4"/>;
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

    const needsFileUpload = lesson.type === LessonType.VIDEO;
    const acceptedFormats = lesson.type === 'VIDEO' ? 'video/mp4,video/webm,video/ogg' : 'application/pdf';
    const maxFiles = lesson.type === 'VIDEO' ? 1 : 10; // Limit videos to 1, PDFs to 10

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="p-2 bg-primary/10 rounded-lg">
                    {getLessonIcon(lesson.type)}
                </div>
                <div>
                    <h3 className="text-lg font-semibold">
                        {index !== undefined ? `Lesson ${index + 1}` : 'Lesson Details'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Configure your lesson content and settings
                    </p>
                </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
                <Label htmlFor="lesson-title" className="text-sm font-medium">
                    Lesson Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="lesson-title"
                    value={lesson.title}
                    onChange={(e) => onChangeAction({...lesson, title: e.target.value})}
                    placeholder="e.g., Introduction to React Hooks"
                    className="transition-all focus:ring-2"
                />
            </div>

            {/* Type and Duration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="lesson-type" className="text-sm font-medium">
                        Lesson Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={lesson.type}
                        onValueChange={(value: LessonType) =>
                            onChangeAction({...lesson, type: value, materials: []})
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
                                    Youtube Link
                                </div>
                            </SelectItem>
                            <SelectItem value="LINK">
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4"/>
                                    External Link
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lesson-duration" className="text-sm font-medium">
                        Duration (minutes) <span className="text-red-500">*</span>
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
                    Description
                </Label>
                <Textarea
                    id="lesson-description"
                    value={lesson.description}
                    onChange={(e) => onChangeAction({...lesson, description: e.target.value})}
                    placeholder="Provide a brief overview of what students will learn in this lesson..."
                    className="min-h-[100px] transition-all focus:ring-2 resize-none"
                    rows={4}
                />
                <p className="text-xs text-muted-foreground">
                    {lesson.description?.length || 0} characters
                </p>
            </div>

            {/* File Upload or Link Section */}
            {needsFileUpload ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                            {lesson.type === 'VIDEO' ? 'Video File' : 'PDF Documents'} <span
                            className="text-red-500">*</span>
                        </Label>
                        {lesson.materials && lesson.materials.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {lesson.materials.length} / {maxFiles} file{maxFiles > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* Upload Area */}
                    {(!lesson.materials || lesson.materials.length < maxFiles) && (
                        <div className="relative">
                            <input
                                type="file"
                                accept={acceptedFormats}
                                multiple={lesson.type === 'MARKDOWN'}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        if (lesson.type === 'VIDEO') {
                                            handleFileUpload(e.target.files[0]);
                                        } else {
                                            handleMultipleFilesUpload(e.target.files);
                                        }
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
                                    {lesson.type === 'VIDEO'
                                        ? 'MP4, WebM, or OGG (Max 1 file)'
                                        : `PDF files (Max ${maxFiles} files)`
                                    }
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
                                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border hover:border-primary/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="p-2 bg-background rounded">
                                            <File className="w-4 h-4 text-primary"/>
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

                    {lesson.materials && lesson.materials.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No files uploaded yet. Upload a {lesson.type === 'VIDEO' ? 'video' : 'PDF'} file to get
                            started.
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="lesson-content" className="text-sm font-medium">
                        External Link URL <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                        <Input
                            id="lesson-content"
                            value={lesson.content}
                            onChange={(e) => onChangeAction({...lesson, content: e.target.value})}
                            placeholder="https://example.com/resource"
                            className="pl-10 transition-all focus:ring-2"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Enter a valid URL to an external learning resource
                    </p>
                </div>
            )}
        </div>
    );
}