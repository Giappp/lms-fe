"use client"

import React, {useMemo, useState} from 'react'
import {
    closestCenter,
    defaultDropAnimation,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {ChapterWithLessons, Lesson} from "@/types/types";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {Button} from "@/components/ui/button";
import {BookOpen, Plus} from "lucide-react";
import {ChapterSortableRef} from "@/components/teacher/ChapterSortableRef";
import {ChapterItem} from "@/components/teacher/ChapterItem"; // Import the pure UI component
import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {createPortal} from "react-dom";

type Props = {
    chapters: ChapterWithLessons[];
    setChapters: React.Dispatch<React.SetStateAction<ChapterWithLessons[]>>;
    onAddChapterAction: () => void;
    onUpdateChapterAction: (index: number, item: ChapterWithLessons,) => void;
    onRemoveChapterAction: (index: number) => void;
    onUpdateLessonsAction: (idx: number, lessons: Lesson[]) => void;
    errors?: Record<string, string> | null;
}

// Optimized measuring strategy for variable height lists
const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

const dropAnimationConfig: DropAnimation = {
    ...defaultDropAnimation,
};

export default function ChaptersTree({
                                         chapters,
                                         setChapters,
                                         errors,
                                         onUpdateChapterAction,
                                         onAddChapterAction,
                                         onRemoveChapterAction,
                                         onUpdateLessonsAction,
                                         ...props
                                     }: Props) {

    // 1. Sensors: Prevent accidental drags when clicking inputs/buttons
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // User must move mouse 5px before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 2. State for the Drag Overlay (The visual "floating" item)
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeChapter, setActiveChapter] = useState<ChapterWithLessons | null>(null);

    // Memoize the IDs to prevent unnecessary re-calculations
    const chapterIds = useMemo(() => chapters.map((c) => `chapter:${c._id}`), [chapters]);

    function handleDragStart(event: DragStartEvent) {
        const {active} = event;
        setActiveId(active.id as string);

        // Find the chapter being dragged to render in the Overlay
        if (active.id.toString().startsWith('chapter:')) {
            const chapter = chapters.find(c => `chapter:${c._id}` === active.id);
            if (chapter) setActiveChapter(chapter);
        }
    }

    function handleDragCancel() {
        setActiveId(null);
        setActiveChapter(null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveId(null);
        setActiveChapter(null);

        if (!over) return;

        const activeIdStr = active.id.toString();
        const overIdStr = over.id.toString();

        if (activeIdStr === overIdStr) return;

        // --- Scenario 1: Reordering Chapters ---
        const isChapterDrag = activeIdStr.startsWith('chapter:') && overIdStr.startsWith('chapter:');

        if (isChapterDrag) {
            const oldIndex = chapters.findIndex((c) => `chapter:${c._id}` === activeIdStr);
            const newIndex = chapters.findIndex((c) => `chapter:${c._id}` === overIdStr);

            if (oldIndex !== -1 && newIndex !== -1) {
                setChapters((prev) => {
                    const reordered = arrayMove(prev, oldIndex, newIndex);
                    // Update orderIndex immediately for UI consistency
                    return reordered.map((c, index) => ({...c, orderIndex: index}));
                });
            }
        } else {
            const activeLessonId = activeIdStr.replace('lesson:', '');
            const overLessonId = overIdStr.replace('lesson:', '');

            const chapterIndex = chapters.findIndex(c =>
                c.lessons.some(l => l._id === activeLessonId)
            );

            if (chapterIndex !== -1) {
                const chapter = chapters[chapterIndex];
                const oldLessonIndex = chapter.lessons.findIndex(l => l._id === activeLessonId);
                const newLessonIndex = chapter.lessons.findIndex(l => l._id === overLessonId);

                if (oldLessonIndex !== -1 && newLessonIndex !== -1) {
                    const newLessons = arrayMove(chapter.lessons, oldLessonIndex, newLessonIndex)
                        .map((l, idx) => ({...l, orderIndex: idx})); // Re-index

                    // Use the prop callback to update parent state
                    onUpdateLessonsAction(chapterIndex, newLessons);
                }
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={measuring}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]} // removed ScrollableAncestor as it often clips overlays
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="mb-6 min-h-[200px]">
                {chapters.length === 0 ? (
                    <EmptyState onAdd={onAddChapterAction}/>
                ) : (
                    <SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4"> {/* Adds gap between items */}
                            {chapters.map((chapter, index) => {
                                const errorKey = `chapters[${index}].title`;
                                return (
                                    <ChapterSortableRef
                                        key={chapter._id}
                                        id={`chapter:${chapter._id}`}
                                        chapter={chapter}
                                        index={index}
                                        error={errors?.[errorKey]}
                                        onChangeAction={(updated) => onUpdateChapterAction(index, updated)}
                                        onRemoveAction={() => onRemoveChapterAction(index)}
                                        onUpdateLessonsAction={(lessons) => onUpdateLessonsAction(index, lessons)}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                )}
            </div>

            {/* 3. The Drag Overlay 
              This creates a portal, rendering a "clone" of the item under your cursor.
              It prevents the UI from looking broken while dragging.
            */}
            {typeof window !== 'undefined' && createPortal(
                <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeChapter ? (
                        // Render a Pure UI version (no dnd logic inside) for the overlay
                        <ChapterItem
                            chapter={activeChapter}
                            index={chapters.findIndex(c => c._id === activeChapter._id)}
                            onChangeAction={() => {
                            }} // Read only in overlay
                            onRemoveAction={() => {
                            }} // Read only
                            ghost // Optional: Add a specific style for the floating item
                            disableInteraction // Important: disable inputs in the overlay
                        />
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}

// Cleaned up Empty State Sub-component
function EmptyState({onAdd}: { onAdd: () => void }) {
    return (
        <div
            className="bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center hover:bg-gray-50 transition-colors">
            <div
                className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-500"/>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                Curriculum is Empty
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start building your course by adding chapters. You can drag and drop them later to rearrange.
            </p>
            <Button onClick={onAdd} size="lg" className="shadow-md hover:shadow-lg transition-all">
                <Plus className="w-5 h-5 mr-2"/>
                Add First Chapter
            </Button>
        </div>
    );
}