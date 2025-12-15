import React, {CSSProperties} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Lesson} from "@/types/types";
import {LessonCard} from "@/components/teacher/LessonCard";
import {GripVertical} from "lucide-react";

interface Props {
    id: string;
    lesson: Lesson;
    index: number;
    chapterIndex: number;
    onEdit: () => void;
    onRemove: () => void;
}

export const LessonSortableItem = ({id, lesson, index, chapterIndex, onEdit, onRemove}: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id});

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 mb-2">
            {/* Drag Handle for the Lesson */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
            >
                <GripVertical className="w-4 h-4"/>
            </div>

            {/* The actual Lesson Card - assumes it takes full width */}
            <div className="flex-1">
                <LessonCard
                    lesson={lesson}
                    index={index}
                    chapterIndex={chapterIndex}
                    onEdit={onEdit}
                    onRemove={onRemove}/>
            </div>
        </div>
    );
};