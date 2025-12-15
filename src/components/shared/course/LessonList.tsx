"use client";

import {LessonResponse} from "@/types/response";
import {LessonType} from "@/types/enum";
import {Clock, FileText, PlayCircle, Youtube} from "lucide-react";
import {cn} from "@/lib/utils";

interface LessonListProps {
    lessons: LessonResponse[];
    currentLessonId?: number;
    onLessonClick?: (lessonId: number) => void;
    showDuration?: boolean;
    className?: string;
}

export function LessonList({
                               lessons,
                               currentLessonId,
                               onLessonClick,
                               showDuration = true,
                               className
                           }: LessonListProps) {
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
        <div className={cn("space-y-1", className)}>
            {lessons.map((lesson) => {
                const isActive = currentLessonId === lesson.id;

                return (
                    <div
                        key={lesson.id}
                        onClick={() => onLessonClick?.(lesson.id)}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors",
                            onLessonClick && "cursor-pointer hover:bg-accent",
                            isActive && "bg-primary/10 border border-primary/20"
                        )}
                    >
                        <div className={cn(
                            "flex-shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                            {getLessonIcon(lesson.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "text-sm font-medium truncate",
                                isActive && "text-primary"
                            )}>
                                {lesson.title}
                            </p>
                            {showDuration && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                    <Clock className="h-3 w-3"/>
                                    <span>{formatDuration(lesson.duration)}</span>
                                </div>
                            )}
                        </div>

                        {isActive && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"/>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
