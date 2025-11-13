"use client";

import React from "react";
import {ChapterWithLessons} from "@/types/types";
import ChaptersTree from "@/components/teacher/ChaptersTree";

type LessonEditorProps = {
    onSaveAction: (data: ChapterWithLessons[]) => void;
    initial?: ChapterWithLessons[];
    disabled?: boolean;
};

export default function LessonEditor({onSaveAction, initial, disabled}: LessonEditorProps) {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 p-4">
                <ChaptersTree defaultItems={initial} onSaveAction={onSaveAction}/>
            </div>
        </div>
    );
}
