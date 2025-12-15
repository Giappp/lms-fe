"use client"

import React, {forwardRef, HTMLAttributes, memo, useState} from 'react';
import {ChapterWithLessons, Lesson} from "@/types/types";
import {LessonType} from "@/types/enum";

// UI Components
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {BookOpen, ChevronDown, ChevronRight, Clock, GripVertical, Plus, Save, Trash, Video} from 'lucide-react';

// DND & Custom Components
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {LessonSortableItem} from "./LessonSortableItem";
import LessonEditor from "@/components/teacher/LessonEditor";
import {cn} from "@/lib/utils"; // Assuming you have a clsx/tailwind-merge util

// Utility: Safe ID generator
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `temp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2)}`;
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

const ChapterItemComponent = forwardRef<HTMLDivElement, Props>(({
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
                                                                    className,
                                                                    ...props
                                                                }, ref) => {
    // State
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);

    // Dialog States
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [lessonToDeleteIndex, setLessonToDeleteIndex] = useState<number | null>(null);

    // --- Handlers ---

    const handleAddLesson = () => {
        const newId = generateId();
        const newLesson: Lesson = {
            _id: newId,
            title: 'Untitled Lesson',
            type: LessonType.VIDEO,
            orderIndex: chapter.lessons.length,
            chapterId: chapter.id,
            content: '',
            description: '',
            duration: 0,
        };

        // 1. Update Parent State
        const updatedLessons = [...chapter.lessons, newLesson];
        onUpdateLessonsAction?.(updatedLessons);

        // 2. UX: Automatically open the editor for the new lesson
        // We set the index to the last item (length of old array)
        setEditingIdx(chapter.lessons.length);
        setEditingLesson(newLesson);
        setIsEditorOpen(true);
    };

    const confirmDeleteLesson = () => {
        if (lessonToDeleteIndex === null) return;

        const updatedLessons = chapter.lessons
            .filter((_, i) => i !== lessonToDeleteIndex)
            .map((lesson, i) => ({
                ...lesson,
                orderIndex: i
            }));

        onUpdateLessonsAction?.(updatedLessons);
        setLessonToDeleteIndex(null);
    };

    const handleEditClick = (idx: number) => {
        setEditingIdx(idx);
        // structuredClone is safer than spread for deep objects, but spread is fine if flat
        setEditingLesson(structuredClone(chapter.lessons[idx]));
        setIsEditorOpen(true);
    };

    const handleSaveLesson = () => {
        if (editingIdx !== null && editingLesson) {
            const updatedLessons = chapter.lessons.map((l, i) =>
                i === editingIdx ? editingLesson : l
            );
            onUpdateLessonsAction?.(updatedLessons);
            setIsEditorOpen(false);
            setEditingLesson(null);
            setEditingIdx(null);
        }
    };

    // --- Derived Values ---
    const totalDuration = chapter.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
    const lessonCount = chapter.lessons.length;
    // Create stable IDs for DND
    const dndLessonIds = chapter.lessons.map(l => `lesson:${l._id}`);

    return (
        <div
            ref={ref}
            style={style}
            className={cn(
                "mb-4 transition-all duration-200 ease-in-out outline-none group",
                ghost && "opacity-40",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "bg-white rounded-lg border shadow-sm overflow-hidden",
                    "hover:shadow-md transition-shadow duration-200",
                    error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                )}
            >

                {/* --- Chapter Header --- */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            {/* Drag Handle */}
                            <div
                                {...handleProps}
                                className="mt-2 p-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors touch-none"
                                aria-label="Reorder chapter"
                            >
                                <GripVertical className="w-5 h-5"/>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-blue-100 p-1 rounded text-blue-600">
                                        <BookOpen className="w-4 h-4"/>
                                    </div>
                                    <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                        Chapter {index + 1}
                                    </Label>
                                </div>

                                <Input
                                    value={chapter.title}
                                    onChange={(e) => onChangeAction({...chapter, title: e.target.value})}
                                    placeholder="Enter chapter title..."
                                    className="font-medium text-base bg-transparent border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 transition-all px-2 -ml-2 h-9"
                                    // Stop drag propagation on inputs
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    disabled={disableInteraction}
                                />

                                {/* Chapter Metadata Badges */}
                                <div
                                    className="flex flex-wrap items-center gap-3 mt-3 text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full">
                                        <Video className="w-3 h-3"/>
                                        <span>{lessonCount} {lessonCount === 1 ? 'Lesson' : 'Lessons'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full">
                                        <Clock className="w-3 h-3"/>
                                        <span>{Math.round(totalDuration)} min</span>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1 animate-in slide-in-from-left-2">
                                        <span>⚠️</span> {error}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-start gap-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="h-8 w-8 p-0 text-gray-500"
                                >
                                    {isExpanded ? <ChevronDown className="w-5 h-5"/> :
                                        <ChevronRight className="w-5 h-5"/>}
                                </Button>

                                {onRemoveAction && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onRemoveAction}
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash className="w-4 h-4"/>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Add Lesson Button (Only visible when expanded or has no lessons) */}
                        {(isExpanded || lessonCount === 0) && (
                            <div className="flex gap-2 mt-4 pl-10">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddLesson}
                                    className="text-xs font-medium border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1.5"/>
                                    Add Lesson
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Lessons List (Collapsible) --- */}
                {isExpanded && (
                    <div className="bg-white p-2">
                        {chapter.lessons.length === 0 ? (
                            <div
                                className="text-center py-8 px-4 border border-dashed border-gray-200 rounded-md m-2 bg-gray-50">
                                <div className="bg-white p-2 rounded-full inline-block mb-2 shadow-sm">
                                    <BookOpen className="w-6 h-6 text-gray-300"/>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">This chapter is empty</p>
                                <p className="text-xs text-gray-400 mt-1">Add a lesson to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-2 p-2">
                                <SortableContext items={dndLessonIds} strategy={verticalListSortingStrategy}>
                                    {chapter.lessons.map((lesson, idx) => (
                                        <LessonSortableItem
                                            key={lesson._id || `temp-${idx}`}
                                            id={`lesson:${lesson._id}`}
                                            lesson={lesson}
                                            index={idx}
                                            chapterIndex={index}
                                            onEdit={() => handleEditClick(idx)}
                                            onRemove={() => setLessonToDeleteIndex(idx)} // Open Alert Dialog
                                        />
                                    ))}
                                </SortableContext>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- Edit Lesson Dialog --- */}
            <Dialog open={isEditorOpen} onOpenChange={(open) => !open && setIsEditorOpen(false)}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Lesson Details</DialogTitle>
                    </DialogHeader>

                    {editingLesson && (
                        <LessonEditor
                            lesson={editingLesson}
                            onChangeAction={setEditingLesson}
                        />
                    )}

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveLesson} disabled={!editingLesson}>
                            <Save className="w-4 h-4 mr-2"/>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- Delete Confirmation Alert --- */}
            <AlertDialog open={lessonToDeleteIndex !== null} onOpenChange={() => setLessonToDeleteIndex(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the lesson. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteLesson}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete Lesson
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
});

ChapterItemComponent.displayName = 'ChapterItem';

// Wrap in React.memo to prevent re-renders of all chapters when dragging one item
export const ChapterItem = memo(ChapterItemComponent);