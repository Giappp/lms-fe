"use client";

import {ChapterTableOfContents} from "@/types/response";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {LessonList} from "./LessonList";
import {BookOpen, Clock} from "lucide-react";

interface ChapterAccordionProps {
    chapters: ChapterTableOfContents[];
    currentLessonId?: number;
    onLessonClick?: (lessonId: number) => void;
    defaultOpenChapters?: string[];
    className?: string;
}

export function ChapterAccordion({
                                     chapters,
                                     currentLessonId,
                                     onLessonClick,
                                     defaultOpenChapters,
                                     className
                                 }: ChapterAccordionProps) {
    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    // Find which chapter contains the current lesson
    const activeChapterId = chapters.find((chapter) =>
        chapter.lessons.some((lesson) => lesson.id === currentLessonId)
    )?.id;

    const defaultValue = defaultOpenChapters || (activeChapterId ? [`chapter-${activeChapterId}`] : []);

    return (
        <Accordion
            type="multiple"
            defaultValue={defaultValue}
            className={className}
        >
            {chapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                    <AccordionTrigger className="hover:no-underline group">
                        <div className="flex items-start justify-between w-full pr-4">
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                                    {chapter.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3"/>
                                        <span>{chapter.lessonCount} {chapter.lessonCount === 1 ? "lesson" : "lessons"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3"/>
                                        <span>{formatDuration(chapter.totalDuration)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <LessonList
                            lessons={chapter.lessons}
                            currentLessonId={currentLessonId}
                            onLessonClick={onLessonClick}
                            className="pt-2"
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
