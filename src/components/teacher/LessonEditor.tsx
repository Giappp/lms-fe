"use client";

import React from "react";
import {ChapterWithLessons} from "@/types/types";
import SortableTree from "@/components/teacher/SortableTree";

type LessonEditorProps = {
    onSaveAction: (data: ChapterWithLessons[]) => void;
    initial?: ChapterWithLessons[];
};

export default function LessonEditor({onSaveAction, initial = []}: LessonEditorProps) {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 p-4">
                <SortableTree defaultItems={initial} onSaveAction={onSaveAction}/>
            </div>
        </div>
    );
}
