"use client";

import React from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Draggable, Droppable} from '@hello-pangea/dnd';
import LessonRow from './LessonRow';
import {Chapter, Lesson} from '@/types/request';

type ChapterWithLessons = Chapter & {
    id?: string;
    lessons: (Lesson & any)[];
};

type Props = {
    chapter: ChapterWithLessons;
    index: number;
    onChangeTitleAction: (index: number, value: string) => void;
    onAddLessonAction: (index: number) => void;
    onRemoveChapterAction: (index: number) => void;
    onUpdateLessonTitleAction: (chapterIndex: number, lessonIndex: number, value: string) => void;
    onUpdateLessonTypeAction: (chapterIndex: number, lessonIndex: number, value: string) => void;
    onUpdateLessonContentAction: (chapterIndex: number, lessonIndex: number, value: string) => void;
    onFileChangeAction: (e: React.ChangeEvent<HTMLInputElement>, chapterIndex: number, lessonIndex: number) => void;
    onRemoveLessonAction: (chapterIndex: number, lessonIndex: number) => void;
};

export default function ChapterCard({
                                        chapter,
                                        index,
                                        onChangeTitleAction,
                                        onAddLessonAction,
                                        onRemoveChapterAction,
                                        onUpdateLessonTitleAction,
                                        onUpdateLessonTypeAction,
                                        onUpdateLessonContentAction,
                                        onFileChangeAction,
                                        onRemoveLessonAction
                                    }: Props) {
    return (
        <Draggable key={chapter.id ?? index} draggableId={`chapter-${chapter.id ?? index}`} index={index}>
            {(provided) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="p-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 flex-1">
                            <div {...provided.dragHandleProps} className="cursor-move px-2">
                                ≡
                            </div>
                            <Input
                                value={chapter.title}
                                onChange={(e) => onChangeTitleAction(index, e.target.value)}
                                placeholder="Chapter Title"
                                className="flex-1"
                            />
                        </div>

                        <div className="ml-4 flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => onAddLessonAction(index)}
                            >
                                Add Lesson
                            </Button>

                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => onRemoveChapterAction(index)}
                                aria-label="Remove chapter"
                            >
                                ✕
                            </Button>
                        </div>
                    </div>

                    <Droppable droppableId={`lessons-${chapter.id}`} type={`LESSON`}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2 pl-8"
                            >
                                {chapter.lessons.map((lesson: any, idx: number) => (
                                    <LessonRow
                                        key={lesson.id ?? `${index}-${idx}`}
                                        lesson={lesson}
                                        chapterId={chapter.id}
                                        chapterIndex={index}
                                        lessonIndex={idx}
                                        onUpdateTitleAction={onUpdateLessonTitleAction}
                                        onUpdateTypeAction={onUpdateLessonTypeAction}
                                        onUpdateContentAction={onUpdateLessonContentAction}
                                        onFileChangeAction={onFileChangeAction}
                                        onRemoveAction={onRemoveLessonAction}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Card>
            )}
        </Draggable>
    );
}
