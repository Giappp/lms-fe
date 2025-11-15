"use client";

import React, {useCallback, useEffect, useState} from "react";
import {ChapterWithLessons, Lesson} from "@/types/types";
import ChaptersTree from "@/components/teacher/ChaptersTree";
import {CourseStats} from "@/components/teacher/CourseStats";
import {useCourseCurriculum} from "@/hooks/useCourseCurriculum";
import {Button} from "@/components/ui/button";
import {Plus, Save} from "lucide-react";

type CurriculumBuilderProps = {
    onSaveAction?: (data: ChapterWithLessons[]) => void;
    courseId?: number;
    disabled?: boolean;
};

export default function CurriculumBuilder({onSaveAction, courseId, disabled}: CurriculumBuilderProps) {
    if (courseId === undefined) throw new Error("Course ID is required for CurriculumBuilder.")
    const {curriculum, saveCurriculum} = useCourseCurriculum(courseId)
    const [chapters, setChapters] = useState<ChapterWithLessons[]>(curriculum);

    const [serverErrors, setServerErrors] = useState<Record<string, string> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        console.log("Server Errors:", serverErrors);
    })

    const handleAddChapter = () => {
        const newChapter: ChapterWithLessons = {
            id: Date.now(),
            title: 'Untitled Chapter',
            lessons: []
        };
        setChapters([...chapters, newChapter]);
    };

    const handleUpdateChapter = (idx: number, updated: ChapterWithLessons) => {
        setChapters(chapters.map((c, i) => i === idx ? updated : c));
    };

    const handleRemoveChapter = (idx: number) => {
        if (window.confirm('Are you sure you want to delete this chapter?')) {
            setChapters(chapters.filter((_, i) => i !== idx));
        }
    };

    const handleUpdateLessons = (idx: number, lessons: Lesson[]) => {
        setChapters(chapters.map((c, i) => i === idx ? {...c, lessons} : c));
    };

    const handleApiError = useCallback((error: any, defaultMessage: string) => {
        const payload = error?.response?.data;

        if (payload?.errors) {
            const errorsMap: Record<string, string> = {};
            Object.entries(payload.errors).forEach(([key, value]: [string, any]) => {
                errorsMap[key] = Array.isArray(value) ? value.join(' ') : String(value);
            });
            setServerErrors(errorsMap);
        } else if (payload?.message) {
            setServerErrors({general: payload.message});
        } else if (error?.message) {
            setServerErrors({general: error.message});
        } else {
            setServerErrors({general: defaultMessage});
        }
    }, []);

    // Save curriculum using the hook
    const handleSaveCurriculum = useCallback(async (items: ChapterWithLessons[]) => {
        if (!courseId) return;
        console.log('Saving curriculum:', items);
        setServerErrors(null);
        setSaving(true);

        try {
            const result = await saveCurriculum(items);

            if (result?.success) {
                onSaveAction?.(items);
            } else {
                const errorMsg = result?.message || 'Failed to save curriculum';
                setServerErrors(result?.errors as Record<string, string> || {general: errorMsg});
            }
        } catch (error) {
            handleApiError(error, 'Failed to save curriculum');
        } finally {
            setSaving(false);
        }
    }, [courseId, saveCurriculum, onSaveAction, handleApiError]);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Curriculum Builder
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Create and organize your course content with video and PDF uploads
                            </p>
                        </div>

                        <CourseStats chapters={chapters}/>
                    </div>
                </div>
                <ChaptersTree chapters={chapters}
                              setChapters={setChapters}
                              onRemoveChapterAction={handleRemoveChapter} onAddChapterAction={handleAddChapter}
                              onUpdateChapterAction={handleUpdateChapter} onUpdateLessonsAction={handleUpdateLessons}/>
            </div>
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleAddChapter}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Chapter
                    </Button>

                    <div className="flex-1 sm:flex sm:justify-end">
                        <Button
                            onClick={() => handleSaveCurriculum(chapters)}
                            size="lg"
                            className="w-full sm:w-auto"
                            disabled={chapters.length === 0}
                        >
                            <Save className="w-4 h-4"/>
                            Save Curriculum
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
