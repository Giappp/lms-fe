"use client";

import React, {useState} from "react";
import {ChapterWithLessons, Lesson} from "@/types/types";
import ChaptersTree from "@/components/teacher/ChaptersTree";
import {CourseStats} from "@/components/teacher/CourseStats";

type LessonEditorProps = {
    onSaveAction: (data: ChapterWithLessons[]) => void;
    initial: ChapterWithLessons[];
    disabled?: boolean;
};

export default function CurriculumBuilder({onSaveAction, initial, disabled}: LessonEditorProps) {
    const [chapters, setChapters] = useState<ChapterWithLessons[]>(initial);

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

    const handleSave = () => {
        onSaveAction?.(chapters);
    };

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
                <ChaptersTree chapters={chapters} onSaveAction={handleSave}
                              setChapters={setChapters}
                              onRemoveChapterAction={handleRemoveChapter} onAddChapterAction={handleAddChapter}
                              onUpdateChapterAction={handleUpdateChapter} onUpdateLessonsAction={handleUpdateLessons}/>
            </div>
        </div>
    );
}
