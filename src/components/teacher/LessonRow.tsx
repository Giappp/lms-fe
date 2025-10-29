"use client";

import React from 'react';
import {Draggable} from '@hello-pangea/dnd';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {LessonType} from '@/types/enum';

type Props = {
    lesson: any;
    chapterId?: string | number;
    chapterIndex: number;
    lessonIndex: number;
    onUpdateTitleAction: (chapterIndex: number, lessonIndex: number, value: string) => void;
    onUpdateTypeAction: (chapterIndex: number, lessonIndex: number, value: string) => void;
    onUpdateContentAction: (chapterIndex: number, lessonIndex: number, value: string) => void;
    onFileChangeAction: (e: React.ChangeEvent<HTMLInputElement>, chapterIndex: number, lessonIndex: number) => void;
    onRemoveAction: (chapterIndex: number, lessonIndex: number) => void;
};

export default function LessonRow({
                                      lesson,
                                      chapterId,
                                      chapterIndex,
                                      lessonIndex,
                                      onUpdateTitleAction,
                                      onUpdateTypeAction,
                                      onUpdateContentAction,
                                      onFileChangeAction,
                                      onRemoveAction
                                  }: Props) {
    return (
        <Draggable key={lesson.id ?? `${chapterIndex}-${lessonIndex}`}
                   draggableId={`lesson-${chapterId}-${lessonIndex}`} index={lessonIndex}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-muted p-3 rounded-md flex items-start justify-between"
                >
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <Input
                                value={lesson.title}
                                onChange={(e) => onUpdateTitleAction(chapterIndex, lessonIndex, e.target.value)}
                                className="w-full"
                                placeholder="Lesson Title"
                            />
                            <select
                                value={lesson.type}
                                onChange={(e) => onUpdateTypeAction(chapterIndex, lessonIndex, e.target.value)}
                                className="ml-2 p-2 rounded border"
                            >
                                {Object.values(LessonType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-3">
                            {lesson.type === LessonType.PDF && (
                                <div className="flex items-center space-x-2">
                                    <input type="file" accept="application/pdf,application/*"
                                           onChange={(e) => onFileChangeAction(e, chapterIndex, lessonIndex)}/>
                                    {lesson.pdfUrl && (
                                        <a href={lesson.pdfUrl} target="_blank" rel="noreferrer"
                                           className="text-sm text-blue-600 ml-2">View uploaded file</a>
                                    )}
                                </div>
                            )}

                            {lesson.type === LessonType.MARKDOWN && (
                                <div>
                                    <textarea
                                        value={lesson.content}
                                        onChange={(e) => onUpdateContentAction(chapterIndex, lessonIndex, e.target.value)}
                                        className="w-full h-28 p-2 border rounded"
                                        placeholder="Write markdown or text here"
                                    />
                                </div>
                            )}

                            {lesson.type === LessonType.VIDEO && (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        value={lesson.videoUrl}
                                        onChange={(e) => onUpdateContentAction(chapterIndex, lessonIndex, e.target.value)}
                                        placeholder="Video URL"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => onRemoveAction(chapterIndex, lessonIndex)}
                            aria-label="Remove lesson"
                        >
                            ✕
                        </Button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
