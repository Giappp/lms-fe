"use client";

import React, {useEffect, useRef, useState} from 'react';
import {Lesson} from '@/types/types';
// Card removed - replaced with plain div wrapper
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {LessonType} from '@/types/enum';
import {FileText, Link as LinkIcon, Video} from 'lucide-react';

type Props = {
    lesson: Lesson;
    index?: number;
    onChangeAction?: (updated: Lesson) => void;
};

export default function LessonItem({lesson, index, onChangeAction}: Props) {
    const [uploadedLabel, setUploadedLabel] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const lastObjectUrlRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (lastObjectUrlRef.current) {
                try {
                    URL.revokeObjectURL(lastObjectUrlRef.current);
                } catch {
                }
                lastObjectUrlRef.current = null;
            }
        };
    }, []);

    const handleChange = (field: keyof Lesson, value: any) => {
        onChangeAction?.({...lesson, [field]: value});
    };

    const handleFilePick = (file: File | null, type: 'video' | 'pdf') => {
        if (!file) return;
        // revoke previous object url if any
        if (lastObjectUrlRef.current) {
            try {
                URL.revokeObjectURL(lastObjectUrlRef.current);
            } catch {
            }
            lastObjectUrlRef.current = null;
        }
        const url = URL.createObjectURL(file);
        lastObjectUrlRef.current = url;
        if (type === 'video') {
            handleChange('videoUrl', url);
            handleChange('pdfUrl', undefined as any);
        } else {
            handleChange('pdfUrl', url);
            handleChange('videoUrl', undefined as any);
        }
        setUploadedLabel(file.name);
    };

    const handleClearUpload = (type: 'video' | 'pdf') => {
        if (lastObjectUrlRef.current) {
            try {
                URL.revokeObjectURL(lastObjectUrlRef.current);
            } catch {
            }
            lastObjectUrlRef.current = null;
        }
        if (type === 'video') {
            handleChange('videoUrl', undefined as any);
        } else {
            handleChange('pdfUrl', undefined as any);
        }
        setUploadedLabel(null);
    };

    const renderTypeUtility = () => {
        const t = String(lesson.type);
        if (t === String(LessonType.VIDEO)) {
            return (
                <div className="mt-3 space-y-2">
                    <Label htmlFor={`lesson-video-${lesson.id}`}>Video URL or Upload</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            id={`lesson-video-${lesson.id}`}
                            value={lesson.videoUrl || ''}
                            onChange={(e) => handleChange('videoUrl', e.target.value)}
                            placeholder="https://... (YouTube / Vimeo / hosted)"
                        />

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleFilePick(e.target.files ? e.target.files[0] : null, 'video')}
                        />

                        <Button variant="outline" size="sm"
                                onClick={() => fileInputRef.current?.click()}>Upload</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Paste a video URL or upload a file to attach a video to
                        this lesson.</p>

                    {uploadedLabel ? (
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">Selected: {uploadedLabel}</div>
                            <Button variant="ghost" size="sm" onClick={() => handleClearUpload('video')}>Clear</Button>
                        </div>
                    ) : null}

                    {/* Inline preview for video */}
                    {lesson.videoUrl ? (
                        <div className="mt-3">
                            <video src={lesson.videoUrl} controls className="w-full max-h-60 rounded-md bg-black"/>
                        </div>
                    ) : null}
                </div>
            );
        }

        if (t === String(LessonType.PDF)) {
            return (
                <div className="mt-3 space-y-2">
                    <Label htmlFor={`lesson-pdf-${lesson.id}`}>PDF URL or Upload</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            id={`lesson-pdf-${lesson.id}`}
                            value={lesson.pdfUrl || ''}
                            onChange={(e) => handleChange('pdfUrl', e.target.value)}
                            placeholder="https://... (or upload)"
                        />

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => handleFilePick(e.target.files ? e.target.files[0] : null, 'pdf')}
                        />

                        <Button variant="outline" size="sm"
                                onClick={() => fileInputRef.current?.click()}>Upload</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Attach a PDF or provide a link to materials for this
                        lesson.</p>

                    {uploadedLabel ? (
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">Selected: {uploadedLabel}</div>
                            <Button variant="ghost" size="sm" onClick={() => handleClearUpload('pdf')}>Clear</Button>
                        </div>
                    ) : null}

                    {/* Inline preview for PDF */}
                    {lesson.pdfUrl ? (
                        <div className="mt-3">
                            <iframe src={lesson.pdfUrl} className="w-full h-64 border rounded-md"/>
                        </div>
                    ) : null}
                </div>
            );
        }

        // default: LINK or ARTICLE or other
        return (
            <div className="mt-3">
                <Label htmlFor={`lesson-content-${lesson.id}`}>Content / Notes or Link</Label>
                <Textarea
                    id={`lesson-content-${lesson.id}`}
                    value={lesson.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Lesson content, external links, or notes"
                    rows={3}
                />
            </div>
        );
    };

    return (
        <div className="w-full bg-transparent p-3 md:p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex gap-3 items-start md:items-center">
                        <div className="flex-1 min-w-0">
                            <Label className="text-sm">Lesson title</Label>
                            <Input
                                value={lesson.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder={typeof index === 'number' ? `Lesson ${index + 1} title` : 'Lesson title'}
                                className="w-full"
                            />
                            <div className="mt-2 flex gap-3 items-center flex-wrap">
                                <div className="w-40">
                                    <Label className="text-xs">Type</Label>
                                    <Select value={String(lesson.type)}
                                            onValueChange={(v) => handleChange('type', v as any)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(LessonType).map((t) => (
                                                <SelectItem key={String(t)} value={String(t)}>
                                                    <div className="flex items-center gap-2">
                                                        {String(t) === String(LessonType.VIDEO) ?
                                                            <Video className="w-4 h-4"/> : null}
                                                        {String(t) === String(LessonType.PDF) ?
                                                            <FileText className="w-4 h-4"/> : null}
                                                        {String(t) !== String(LessonType.VIDEO) && String(t) !== String(LessonType.PDF) ?
                                                            <LinkIcon className="w-4 h-4"/> : null}
                                                        <span>{String(t)}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-28">
                                    <Label className="text-xs">Duration (min)</Label>
                                    <Input
                                        type="number"
                                        value={String(lesson.duration || 0)}
                                        onChange={(e) => handleChange('duration', Number(e.target.value || 0))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 border-t pt-3">
                        <div>
                            <Label htmlFor={`lesson-desc-${lesson.id}`}>Short description</Label>
                            <Textarea
                                id={`lesson-desc-${lesson.id}`}
                                value={lesson.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Short summary for learners"
                                rows={2}
                            />
                        </div>

                        {renderTypeUtility()}
                    </div>
                </div>
            </div>
        </div>
    );
}
