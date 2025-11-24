"use client"

import {ChapterWithLessons, Lesson} from "@/types/types";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {BookOpen, ChevronDown, ChevronRight, GripVertical, Plus, Save, Trash} from 'lucide-react';
import React, {forwardRef, HTMLAttributes, useState} from 'react';
import {LessonType} from "@/types/enum";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import LessonEditor from "@/components/teacher/LessonEditor";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {LessonSortableItem} from "./LessonSortableItem";

// Safe ID generator fallback
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
    chapter: ChapterWithLessons;
    index: number;
    ghost?: boolean;
    handleProps?: any;
    disableInteraction?: boolean;
    onChangeAction: (updated: ChapterWithLessons) => void;
    onRemoveAction?: () => void;
    onUpdateLessonsAction?: (lessons: Lesson[]) => void;
    error?: string;
}

export const ChapterItem = forwardRef<HTMLDivElement, Props>(({
                                                                  chapter,
                                                                  index,
                                                                  error,
                                                                  ghost,
                                                                  disableInteraction,
                                                                  style,
                                                                  onChangeAction,
                                                                  onRemoveAction,
                                                                  handleProps,
                                                                  onUpdateLessonsAction,
                                                                  ...props
                                                              }, ref) => { // This ref now comes from setNodeRef
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddLesson = () => {
        const newLesson: Lesson = {
            _id: generateId(),
            title: 'Untitled Lesson',
            type: LessonType.VIDEO,
            orderIndex: chapter.lessons.length,
            chapterId: chapter.id,
            content: '',
            description: '',
            duration: 0
        };

        // Sanitize existing lessons to ensure they have IDs (fixes your Key error source)
        const updatedLessons = chapter.lessons.map((lesson, idx) => ({
            ...lesson,
            _id: lesson._id || generateId(),
            orderIndex: idx
        }));

        onUpdateLessonsAction?.([...updatedLessons, newLesson]);
    };

    const handleRemoveLesson = (idx: number) => {
        // Use a custom dialog in production, window.confirm is blocking
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            const updatedLessons = chapter.lessons
                .filter((_, i) => i !== idx)
                .map((lesson, i) => ({
                    ...lesson,
                    orderIndex: i
                }));
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
        // Break reference to avoid mutating state directly
        setEditingLesson({...chapter.lessons[idx]});
        setIsDialogOpen(true);
    };

    const totalDuration = chapter.lessons.reduce((sum, l) => sum + l.duration, 0);
    const lessonCount = chapter.lessons.length;
    const lessonIds = chapter.lessons.map(l => `lesson:${l._id}`);
    return (
        <div
            ref={ref}
            style={style}
            className={`mb-4 transition-all duration-200 ease-in-out outline-none ${ghost ? 'opacity-40' : ''}`}
            {...props}
        >
            <div
                className={`bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md ${error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}>

                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <div className="p-4">
                        <div className="flex items-start gap-3">

                            {/* DRAG HANDLE: Changed from <Button> to <div>
                                We apply handleProps (listeners) here.
                                Because this is just a div, it won't steal focus or trigger 'submit'.
                            */}
                            <div
                                {...handleProps}
                                className="mt-2 p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded transition-colors touch-none"
                                title="Drag to reorder"
                            >
                                <GripVertical className="w-5 h-5"/>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-5 h-5 text-blue-600"/>
                                    <Label className="text-base font-semibold text-gray-900">
                                        Chapter {index + 1}
                                    </Label>
                                </div>
                                <Input
                                    value={chapter.title}
                                    onChange={(e) => onChangeAction({...chapter, title: e.target.value})}
                                    placeholder="Enter chapter title"
                                    className="font-medium text-base bg-white focus-visible:ring-blue-500"
                                    // Prevent typing from triggering drag events if focus is lost
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    disabled={disableInteraction}
                                />

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

                                {error && (
                                    <p className="text-xs text-red-500 mt-1 font-medium animate-pulse">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-start gap-1 shrink-0">
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

                        <div className="flex gap-2 mt-3 pl-9"> {/* Added padding-left to align with content */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddLesson}
                                className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300"
                            >
                                <Plus className="w-4 h-4 mr-1"/>
                                Add Lesson
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Lessons List */}
                {isExpanded && (
                    <div className="bg-gray-50/50 p-4 max-h-[500px] overflow-y-auto">
                        {chapter.lessons.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                                <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-300"/>
                                <p className="text-sm text-gray-500">No lessons yet.</p>
                            </div>
                        ) : (
                            <SortableContext items={lessonIds} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {chapter.lessons.map((lesson, idx) => (
                                        <LessonSortableItem
                                            key={lesson._id} // Ensure this is unique!
                                            id={`lesson:${lesson._id}`}
                                            lesson={lesson}
                                            index={idx}
                                            chapterIndex={index}
                                            onEdit={() => handleEditLesson(idx)}
                                            onRemove={() => handleRemoveLesson(idx)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Lesson Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Lesson
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
                            <Save className="w-4 h-4 mr-2"/>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
});

ChapterItem.displayName = 'ChapterItem';