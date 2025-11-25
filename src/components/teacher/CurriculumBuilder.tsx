"use client";

import React, {useCallback, useEffect, useState} from "react";
import {ChapterWithLessons, Lesson} from "@/types/types";
import ChaptersTree from "@/components/teacher/ChaptersTree";
import {CourseStats} from "@/components/teacher/CourseStats";
import {useCourseCurriculum} from "@/hooks/useCourseCurriculum";
import {Button} from "@/components/ui/button";
import {AlertCircle, Loader2, Plus, Save} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

type CurriculumBuilderProps = {
    onSaveAction?: (data: ChapterWithLessons[]) => void;
    courseId?: number;
    disabled?: boolean;
};

export default function CurriculumBuilder({onSaveAction, courseId, disabled}: CurriculumBuilderProps) {
    const {curriculum, saveCurriculum, isLoading, isError} = useCourseCurriculum(courseId);

    const [chapters, setChapters] = useState<ChapterWithLessons[]>([]);
    const [serverErrors, setServerErrors] = useState<Record<string, string> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (curriculum && curriculum.length > 0) {
            const needIds = curriculum.some(chapter => !chapter._id);
            if (needIds) {
                const curriculumWithIds = curriculum.map((chapter) => ({
                    ...chapter,
                    _id: chapter._id || (globalThis.crypto?.randomUUID() || Date.now().toString() + Math.random().toString(36).substring(2, 9)),
                }));
                setChapters(curriculumWithIds);
                return;
            }
            setChapters(curriculum);
        }
    }, [curriculum]);

    const handleAddChapter = useCallback(() => {
        const newChapter: ChapterWithLessons = {
            _id: globalThis.crypto?.randomUUID() || Date.now().toString() + Math.random().toString(36).substring(2, 9), // Fallback for safety
            title: 'Untitled Chapter',
            orderIndex: chapters.length,
            lessons: []
        };
        setChapters(prev => [...prev, newChapter]);
    }, [chapters.length]);

    const handleUpdateChapter = useCallback((idx: number, updated: ChapterWithLessons) => {
        setChapters(prev => prev.map((c, i) => i === idx ? updated : c));
    }, []);

    const handleRemoveChapter = useCallback((idx: number) => {
        if (window.confirm('Are you sure you want to delete this chapter? This cannot be undone.')) {
            setChapters(prev => prev.filter((_, i) => i !== idx));
        }
    }, []);

    const handleUpdateLessons = useCallback((idx: number, lessons: Lesson[]) => {
        console.log("Lessons: ", lessons);
        setChapters(prev => prev.map((c, i) => i === idx ? {...c, lessons} : c));
    }, []);

    const handleSaveCurriculum = async () => {
        if (!courseId) return;
        setServerErrors(null);
        setIsSaving(true);

        try {
            const result = await saveCurriculum(chapters);

            if (result?.success) {
                onSaveAction?.(chapters);
                // Optional: Add a Toast notification here "Saved Successfully"
            } else {
                // Handle structured validation errors from backend
                const errorMap = result?.errors as Record<string, string> || {
                    general: result?.message || 'Failed to save curriculum'
                };
                setServerErrors(errorMap);
            }
        } catch (error: any) {
            setServerErrors({
                general: error?.message || 'An unexpected network error occurred.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mr-2"/>
                <span>Loading curriculum...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Error Loading</AlertTitle>
                <AlertDescription>Could not load the course curriculum.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                                Curriculum Builder
                            </h1>
                            <p className="text-base text-gray-600 mt-1">
                                Create and organize your course content with video and PDF uploads
                            </p>
                        </div>

                        <CourseStats chapters={chapters}/>
                    </div>
                </div>

                {/* Global Error Display */}
                {serverErrors && (
                    <div className="mb-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error Saving Curriculum</AlertTitle>
                            <AlertDescription>
                                {serverErrors.general
                                    ? serverErrors.general
                                    : "Please fix the errors highlighted below before saving."}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                <ChaptersTree chapters={chapters}
                              errors={serverErrors}
                              setChapters={setChapters}
                              onRemoveChapterAction={handleRemoveChapter} onAddChapterAction={handleAddChapter}
                              onUpdateChapterAction={handleUpdateChapter} onUpdateLessonsAction={handleUpdateLessons}/>
            </div>
            {/* Action Buttons */}
            <div
                className="sticky bottom-4 mt-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 mx-auto max-w-5xl z-10">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <Button
                        onClick={handleAddChapter}
                        variant="outline"
                        disabled={disabled || isSaving}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Chapter
                    </Button>

                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={handleSaveCurriculum}
                            size="lg"
                            className="w-full sm:w-auto min-w-[150px]"
                            disabled={disabled || isSaving || chapters.length === 0}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2"/>
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
