import React, {useState} from 'react'
import {
    closestCenter,
    defaultDropAnimation,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    MeasuringStrategy,
    Modifier,
    UniqueIdentifier
} from "@dnd-kit/core";
import {ChapterWithLessons, Lesson} from "@/types/types";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import {Button} from "@/components/ui/button";
import {Plus, Save} from "lucide-react";
import {ChapterList} from "@/components/teacher/ChapterList";

type Props = {
    collapsible?: boolean;
    defaultItems?: ChapterWithLessons[];
    indentationWidth?: number;
    indicator?: boolean;
    removable?: boolean;
    onSaveAction: (items: ChapterWithLessons[]) => void;
}

const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

// Use the default drop animation to avoid unused-property warnings from the checker
const dropAnimationConfig: DropAnimation = defaultDropAnimation as DropAnimation;

const adjustTranslate: Modifier = ({transform}) => {
    return {
        ...transform,
        y: transform.y - 25,
    };
};

const ChaptersTree = ({
                          defaultItems,
                          indicator = false,
                          onSaveAction
                      }: Props) => {
    const [chapters, setChapters] = useState<ChapterWithLessons[]>(defaultItems || [] as ChapterWithLessons[]);
    const [activeType, setActiveType] = useState<"chapter" | "lesson" | null>(null);
    const [activeItem, setActiveItem] = useState<any>(null);

    // Find an item (chapter or lesson) by a dnd-kit id like "chapter:1" or "lesson:2"
    const findItemById = (id: UniqueIdentifier) => {
        const idStr = id?.toString() || '';
        const [type, idPart] = idStr.split(":");
        const numericId = Number(idPart);
        if (type === 'chapter') {
            const chapter = chapters.find((c) => c.id === numericId);
            if (chapter) return {type: 'chapter', item: chapter};
            return null;
        }
        if (type === 'lesson') {
            for (const chapter of chapters) {
                const lesson = chapter.lessons.find((l) => l.id === numericId);
                if (lesson) return {type: 'lesson', item: lesson, parentChapterId: chapter.id};
            }
            return null;
        }
        return null;
    };

    const handleAddChapter = () => {
        const newChapter: ChapterWithLessons = {
            id: chapters.length + 1,
            title: "Untitled Chapter",
            lessons: []
        };
        setChapters(prev => [...prev, newChapter]);
    };

    const handleRemoveChapter = (idx: number) => {
        setChapters(prev => prev.filter((_, i) => i !== idx));
    };

    const handleUpdateChapter = (idx: number, updated: ChapterWithLessons) => {
        setChapters(prev => prev.map((c, i) => i === idx ? updated : c));
    };

    const handleUpdateLessons = (idx: number, lessons: Lesson[]) => {
        setChapters(prev => prev.map((c, i) => i === idx ? {...c, lessons} : c));
    };

    const handleSave = () => {
        onSaveAction?.(chapters as ChapterWithLessons[]);
    };
    return (
        <DndContext collisionDetection={closestCenter}
                    measuring={measuring}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}>
            {chapters.length === 0 && (
                <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                    No chapters yet. Click &quot;Add Chapter&quot; to start creating your curriculum.
                </div>
            )}
            <SortableContext items={chapters.map((c) => `chapter:${c.id}`)}
                             strategy={verticalListSortingStrategy}>
                {chapters.map((chapter, index) => (
                    <ChapterList key={chapter.id} id={`chapter:${chapter.id}`} chapter={chapter} index={index}
                                 onChangeAction={(updated) => handleUpdateChapter(index, updated)}
                                 onRemoveAction={() => handleRemoveChapter(index)}
                                 onUpdateLessonsAction={(lessons) => handleUpdateLessons(index, lessons)}/>
                ))}
                {createPortal(
                    <DragOverlay
                        dropAnimation={dropAnimationConfig}
                        modifiers={indicator ? [adjustTranslate] : undefined}
                    >
                        {activeItem ? (
                            activeType === "chapter" ? (
                                // When rendering the overlay for a chapter, pass the same id format used by SortableContext
                                <ChapterList chapter={activeItem} id={`chapter:${activeItem.id}`}/>
                            ) : (
                                <div className="p-2 rounded-lg bg-gray-100 shadow-md border border-gray-300">
                                    {activeItem.title}
                                </div>
                            )
                        ) : null}
                    </DragOverlay>,
                    document.body,
                )}
            </SortableContext>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <Button
                    variant="default"
                    onClick={handleAddChapter}
                    className="flex-1 md:flex-none"
                >
                    <Plus className="w-4 h-4"/> Add Chapter
                </Button>

                <div className="flex-1 md:flex md:justify-end">
                    <Button onClick={handleSave} className="w-full md:w-auto">
                        <Save className="w-4 h-4"/> Save Curriculum
                    </Button>
                </div>
            </div>
        </DndContext>
    );

    // Bắt đầu kéo -> Set item đang kéo
    function handleDragStart(event: DragStartEvent) {
        const {active} = event;
        const found = findItemById(active.id);
        if (found) {
            setActiveType(found.type as "chapter" | "lesson");
            setActiveItem(found.item);
        }
    }

    function handleDragEnd({active, over}: DragEndEvent) {
        resetState();
        if (!over || active.id === over.id) return;

        const [overTypeStr, overIdPart] = over.id.toString().split(':');
        const [activeTypeStr, activeIdPart] = active.id.toString().split(':');
        const overIdNum = Number(overIdPart);
        const activeIdNum = Number(activeIdPart);

        if (activeTypeStr === "chapter" && overTypeStr === "chapter") {
            const oldIndex = chapters.findIndex((c) => c.id === activeIdNum);
            const newIndex = chapters.findIndex((c) => c.id === overIdNum);
            if (oldIndex === -1 || newIndex === -1) return;
            setChapters((prev) => arrayMove(prev, oldIndex, newIndex));
            return;
        }

        if (activeTypeStr === "lesson" && overTypeStr === "lesson") {
            const chapter = chapters.find((c) =>
                c.lessons.some((l) => l.id === activeIdNum)
            );
            const overChapter = chapters.find((c) =>
                c.lessons.some((l) => l.id === overIdNum)
            );
            if (!chapter || !overChapter) return;

            const oldIndex = chapter.lessons.findIndex((l) => l.id === activeIdNum);
            const newIndex = overChapter.lessons.findIndex((l) => l.id === overIdNum);

            if (chapter.id === overChapter.id) {
                // Reorder lessons within same chapter
                const updated = chapters.map((c) =>
                    c.id === chapter.id
                        ? {
                            ...c,
                            lessons: arrayMove(c.lessons, oldIndex, newIndex),
                        }
                        : c
                );
                setChapters(updated);
            } else {
                // (Optional) Move lessons between chapters
                const movedLesson = chapter.lessons[oldIndex];
                if (!movedLesson) return;
                const updated = chapters.map((c) => {
                    if (c.id === chapter.id) {
                        return {
                            ...c,
                            lessons: c.lessons.filter((l) => l.id !== activeIdNum),
                        };
                    }
                    if (c.id === overChapter.id) {
                        const newLessons = [...c.lessons];
                        newLessons.splice(newIndex, 0, movedLesson);
                        return {...c, lessons: newLessons};
                    }
                    return c;
                });
                setChapters(updated);
            }
        }
    }

    function resetState() {
        setActiveItem(null);
        setActiveType(null);

        document.body.style.setProperty('cursor', '');
    }

    function handleDragCancel() {
        resetState();
    }
}
export default ChaptersTree
