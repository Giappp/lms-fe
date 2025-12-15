"use client";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {LessonResponse} from "@/types/response";
import {LessonType} from "@/types/enum";
import {Button} from "@/components/ui/button";
import {Clock, Edit, FileText, GripVertical, PlayCircle, Trash, Youtube} from "lucide-react";

interface SortableLessonItemProps {
    lesson: LessonResponse;
    onEdit?: () => void;
    onDelete?: () => void;
    readOnly?: boolean;
}

export function SortableLessonItem({
                                       lesson,
                                       onEdit,
                                       onDelete,
                                       readOnly = false,
                                   }: SortableLessonItemProps) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: `lesson-${lesson.id}`,
        disabled: readOnly,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getLessonIcon = (type: LessonType) => {
        switch (type) {
            case LessonType.VIDEO:
                return <PlayCircle className="h-4 w-4"/>;
            case LessonType.YOUTUBE:
                return <Youtube className="h-4 w-4"/>;
            case LessonType.MARKDOWN:
                return <FileText className="h-4 w-4"/>;
            default:
                return <FileText className="h-4 w-4"/>;
        }
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
        >
            {!readOnly && (
                <button
                    className="cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground"/>
                </button>
            )}

            <div className="text-muted-foreground">{getLessonIcon(lesson.type)}</div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{lesson.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3"/>
                    <span>{formatDuration(lesson.duration)}</span>
                </div>
            </div>

            {!readOnly && (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                        <Edit className="h-3 w-3"/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                        <Trash className="h-3 w-3 text-destructive"/>
                    </Button>
                </div>
            )}
        </div>
    );
}
