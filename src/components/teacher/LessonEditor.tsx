"use client";

import React, {useState} from "react";
import {ChapterWithLessons, Lesson} from "@/types/types";
import {Button} from "@/components/ui/button";
import ChapterItem from "@/components/teacher/ChapterItem";
import {Plus, Save} from 'lucide-react';

type LessonEditorProps = {
    onSaveAction: (data: ChapterWithLessons[]) => void;
    initial?: ChapterWithLessons[];
};

export default function LessonEditor({onSaveAction, initial = []}: LessonEditorProps) {
    const [chapters, setChapters] = useState<ChapterWithLessons[]>(initial);


    const handleAddChapter = () => {
        const newChapter: ChapterWithLessons = {
            id: Math.random().toString(36).slice(2, 9),
            title: "",
            lessons: []
        };
        setChapters(prev => [...prev, newChapter]);
    };

    const handleRemoveChapter = (idx: number) => {
        setChapters(prev => prev.filter((_, i) => i !== idx));
    };

    const handleUpdateChapter = (idx: number, updated: ChapterWithLessons) => {
        setChapters(prev => prev.map((c, i) => i === idx ? updated : c));
    };

    const handleUpdateLessons = (idx: number, lessons: Lesson[]) => {
        setChapters(prev => prev.map((c, i) => i === idx ? {...c, lessons} : c));
    };

    const handleSave = () => {
        onSaveAction(chapters);
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 p-4">
                {chapters.length === 0 && (
                    <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                        No chapters yet. Click &quot;Add Chapter&quot; to start creating your curriculum.
                    </div>
                )}

                <div className="space-y-4">
                    {chapters.map((chapter, idx) => (
                        <div key={chapter.id} className="">
                            <ChapterItem
                                chapter={chapter}
                                index={idx}
                                onChangeAction={(updated) => handleUpdateChapter(idx, updated)}
                                onRemoveAction={() => handleRemoveChapter(idx)}
                                onUpdateLessonsAction={(lessons) => handleUpdateLessons(idx, lessons)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <Button
                    variant="default"
                    onClick={handleAddChapter}
                    className="flex-1 md:flex-none"
                >
                    <Plus className="w-4 h-4"/> Add Chapter
                </Button>

                <div className="flex-1 md:flex md:justify-end">
                    <Button onClick={handleSave} className="w-full md:w-auto">
                        <Save className="w-4 h-4"/> Save Curriculum
                    </Button>
                </div>
            </div>
        </div>
    );
}
