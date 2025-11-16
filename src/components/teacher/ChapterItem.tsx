"use client"
import {ChapterWithLessons, Lesson} from "@/types/types";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {BookOpen, ChevronDown, ChevronRight, GripVertical, Plus, Save, Trash} from 'lucide-react';
import React, {forwardRef, HTMLAttributes, useState} from 'react';
import {LessonType} from "@/types/enum";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {LessonCard} from "@/components/teacher/LessonCard";
import LessonEditor from "@/components/teacher/LessonEditor";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
    chapter: ChapterWithLessons;
    index: number;
    ghost?: boolean;
    handleProps?: any;
    disableInteraction?: boolean;
    onChangeAction: (updated: ChapterWithLessons) => void;
    onRemoveAction?: () => void;
    onAddLessonAction?: () => void;
    onUpdateLessonsAction?: (lessons: Lesson[]) => void;

    wrapperRef?(node: HTMLDivElement): void;
}

export const ChapterItem = forwardRef<HTMLDivElement, Props>(({
                                                                  chapter,
                                                                  index,
                                                                  ghost,
                                                                  wrapperRef,
                                                                  disableInteraction,
                                                                  style,
                                                                  onChangeAction,
                                                                  onRemoveAction,
                                                                  handleProps,
                                                                  onAddLessonAction,
                                                                  onUpdateLessonsAction,
                                                              }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const setIdForlesson = () => {
        chapter.lessons.forEach((lesson, idx) => {
            lesson._id = crypto.randomUUID();
            lesson.orderIndex = idx;
        });
    }
    setIdForlesson();

    const handleAddLesson = () => {
        const newLesson: Lesson = {
            _id: crypto.randomUUID(),
            title: 'Untitled Lesson',
            type: LessonType.VIDEO,
            orderIndex: chapter.lessons.length,
            chapterId: chapter.id,
            content: '',
            description: '',
            duration: 0
        };
        onUpdateLessonsAction?.([...chapter.lessons, newLesson]);
        onAddLessonAction?.();
    };

    const handleRemoveLesson = (idx: number) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            const updatedLessons = chapter.lessons.filter((_, i) => i !== idx);
            onUpdateLessonsAction?.(updatedLessons);
        }
    };

    const handleSaveLesson = () => {
        if (editingIdx !== null && editingLesson) {
            const updatedLessons = chapter.lessons.map((l, i) =>
                i === editingIdx ? editingLesson : l
            );
            onUpdateLessonsAction?.(updatedLessons);
            setIsDialogOpen(false);
            setEditingLesson(null);
            setEditingIdx(null);
        }
    };

    const handleEditLesson = (idx: number) => {
        setEditingIdx(idx);
        setEditingLesson({...chapter.lessons[idx]});
        setIsDialogOpen(true);
    };

    const totalDuration = chapter.lessons.reduce((sum, l) => sum + l.duration, 0);
    const lessonCount = chapter.lessons.length;

    return (
        <div
            className={`mb-4 ${ghost ? 'opacity-50' : ''} ${disableInteraction ? 'pointer-events-none' : ''}`}
            ref={wrapperRef}>
            <div ref={ref}
                 style={style}
                 className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                {...handleProps}
                                className="cursor-grab active:cursor-grabbing shrink-0 mt-1"
                                title="Drag to reorder"
                            >
                                <GripVertical className="w-4 h-4 text-muted-foreground"/>
                            </Button>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-5 h-5 text-blue-600"/>
                                    <Label
                                        className="text-base font-semibold text-gray-900">Chapter {index + 1}</Label>
                                </div>
                                <Input
                                    value={chapter.title}
                                    onChange={(e) => onChangeAction({...chapter, title: e.target.value})}
                                    placeholder="Enter chapter title"
                                    className="font-medium text-base bg-white"/>
                                {/* Chapter Stats */}
                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>{totalDuration} min total</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    title={isExpanded ? 'Collapse' : 'Expand'}
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5"/>
                                    ) : (
                                        <ChevronRight className="w-5 h-5"/>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onRemoveAction}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Delete chapter"
                                >
                                    <Trash className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleAddLesson}
                            >
                                <Plus className="w-4 h-4"/>
                                Add Lesson
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Lessons List */}
                {isExpanded && (
                    <div className="p-4 max-h-[400px] overflow-y-auto transition-max-height duration-300">
                        {chapter.lessons.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                                <p className="text-sm">No lessons yet. Click &#34;Add Lesson&#34; to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {chapter.lessons.map((lesson, idx) => (
                                    <LessonCard
                                        key={lesson._id}
                                        lesson={lesson}
                                        index={idx}
                                        chapterIndex={index}
                                        onEdit={() => handleEditLesson(idx)}
                                        onRemove={() => handleRemoveLesson(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Edit Lesson Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Lesson: <span className="text-blue-600">{editingLesson?.title || 'Untitled'}</span>
                        </DialogTitle>
                    </DialogHeader>

                    {editingLesson && (
                        <LessonEditor
                            lesson={editingLesson}
                            onChangeAction={setEditingLesson}
                        />
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveLesson}>
                            <Save className="w-4 h-4"/>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
});