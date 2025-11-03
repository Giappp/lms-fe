"use client"
import {ChapterWithLessons, Lesson} from "@/types/types";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import LessonItem from "@/components/teacher/LessonItem";
import {Plus, Trash} from 'lucide-react';
import React, {useState} from 'react';
import {LessonType} from "@/types/enum";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";

type Props = {
    chapter: ChapterWithLessons;
    index?: number;
    onChangeAction?: (updated: ChapterWithLessons) => void;
    onRemoveAction?: () => void;
    onAddLessonAction?: () => void;
    onUpdateLessonsAction?: (lessons: Lesson[]) => void;
};

export default function ChapterItem({
                                        chapter,
                                        index: _index,
                                        onChangeAction,
                                        onRemoveAction,
                                        onAddLessonAction,
                                        onUpdateLessonsAction
                                    }: Props) {
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = {...chapter, title: e.target.value};
        onChangeAction?.(updated);
    };

    const handleAddLesson = () => {
        const newLesson: Lesson = {
            id: Math.random().toString(36).slice(2, 9),
            title: '',
            type: LessonType.VIDEO,
            content: '',
            description: '',
            duration: 0
        };
        const newLessons = [...chapter.lessons, newLesson];
        onUpdateLessonsAction?.(newLessons);
        onAddLessonAction?.();
    };

    const handleUpdateLesson = (idx: number, updatedLesson: Lesson) => {
        const newLessons = chapter.lessons.map((l, i) => i === idx ? updatedLesson : l);
        onUpdateLessonsAction?.(newLessons);
    };

    const handleRemoveLesson = (idx: number) => {
        const confirmDelete = window.confirm('Delete this lesson? This action cannot be undone.');
        if (!confirmDelete) return;
        const newLessons = chapter.lessons.filter((_, i) => i !== idx);
        onUpdateLessonsAction?.(newLessons);
        // If the removed lesson is currently being edited, clear editor
        if (editingIdx === idx) {
            setOpen(false);
            setEditingLesson(null);
            setEditingIdx(null);
        }
    };

    const saveEdit = () => {
        if (editingIdx === null || !editingLesson) return;
        handleUpdateLesson(editingIdx, editingLesson);
        setOpen(false);
        setEditingLesson(null);
        setEditingIdx(null);
    };

    const prepareEdit = (idx: number) => {
        setEditingIdx(idx);
        // clone so modal edits are not live until Save
        setEditingLesson({...chapter.lessons[idx]});
        setOpen(true);
    }

    const renderTypeIcon = (type: LessonType) => {
        if (type === LessonType.VIDEO) return <span className="text-xs font-medium">Video</span>;
        if (type === LessonType.PDF) return <span className="text-xs font-medium">PDF</span>;
        return <span className="text-xs font-medium">Link</span>;
    };

    return (
        <div className="w-full">
            {/* Chapter container */}
            <div
                className="w-full rounded-lg bg-gray-50/60 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                        <Label
                            htmlFor={`chapter-title-${chapter.id}`}>Chapter {typeof _index === 'number' ? _index + 1 : ''} Title</Label>
                        <Input
                            id={`chapter-title-${chapter.id}`}
                            value={chapter.title}
                            onChange={handleTitleChange}
                            placeholder="Enter chapter title"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2 md:pt-0">
                        <Button variant="default" size="sm" onClick={handleAddLesson} title="Add lesson">
                            <Plus className="w-4 h-4"/> Add Lesson
                        </Button>
                        <Button variant="destructive" size="sm" onClick={onRemoveAction} title="Remove chapter">
                            <Trash className="w-4 h-4"/> Remove
                        </Button>
                    </div>
                </div>

                <div className="mt-4">
                    {chapter.lessons.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No lessons yet. Add one to get started.</div>
                    ) : (
                        // Lessons panel: lighter background to contrast with chapter container
                        <div
                            className="flex flex-col overflow-auto max-h-[400px] bg-white dark:bg-[#0b1220] rounded-md p-2">
                            {chapter.lessons.map((lesson, idx) => (
                                <div
                                    key={lesson.id}
                                    className={`${idx !== 0 ? 'pt-4 border-t border-gray-200/50 dark:border-gray-700/40' : ''}`}>
                                    {/* compact lesson row */}
                                    <div className="rounded-md bg-white dark:bg-[#071123] p-2 flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className="text-sm font-medium truncate">{lesson.title || 'Untitled lesson'}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                                                <span
                                                    className="inline-flex items-center gap-2">{renderTypeIcon(lesson.type)}</span>
                                                <span>{lesson.duration ?? 0} min</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="edit" size="sm"
                                                    onClick={() => prepareEdit(idx)}>Edit</Button>
                                            <Button variant="destructive" size="sm"
                                                    onClick={() => handleRemoveLesson(idx)}>Remove</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Edit dialog (shadcn Dialog) */}
                            <Dialog open={open} onOpenChange={setOpen}>
                                {editingLesson && (
                                    <DialogContent className="sm:max-w-[720px]">
                                        <DialogHeader>
                                            <DialogTitle>Currently edit lesson: <span
                                                className="font-bold">{editingLesson.title || 'Untitled'}</span></DialogTitle>
                                        </DialogHeader>

                                        <div className="pt-2">
                                            <LessonItem
                                                lesson={editingLesson}
                                                onChangeAction={(updated) => setEditingLesson(updated)}
                                            />
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={saveEdit}>Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                )}
                            </Dialog>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}