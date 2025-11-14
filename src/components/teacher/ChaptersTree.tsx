import React, {useState} from 'react'
import {
    closestCenter,
    defaultDropAnimation,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DropAnimation,
    MeasuringStrategy,
    Modifier,
    UniqueIdentifier
} from "@dnd-kit/core";
import {ChapterWithLessons, Lesson} from "@/types/types";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {Button} from "@/components/ui/button";
import {BookOpen, Plus, Save} from "lucide-react";
import {ChapterSortableRef} from "@/components/teacher/ChapterSortableRef";
import {restrictToFirstScrollableAncestor, restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";

type Props = {
    collapsible?: boolean;
    chapters: ChapterWithLessons[];
    setChapters: React.Dispatch<React.SetStateAction<ChapterWithLessons[]>>;
    indentationWidth?: number;
    indicator?: boolean;
    removable?: boolean;
    onSaveAction: () => void;
    onAddChapterAction: () => void;
    onUpdateChapterAction: (index: number, item: ChapterWithLessons,) => void;
    onRemoveChapterAction: (index: number) => void;
    onUpdateLessonsAction: (idx: number, lessons: Lesson[]) => void;
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
                          chapters,
                          setChapters,
                          indicator = false,
                          onSaveAction,
                          onAddChapterAction,
                          onUpdateChapterAction,
                          onRemoveChapterAction,
                          onUpdateLessonsAction
                      }: Props) => {
    const [activeType, setActiveType] = useState<"chapter" | "lesson" | null>(null);
    const [activeItem, setActiveItem] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Find an item (chapter or lesson) by a dnd-kit id like "chapter:1" or "lesson:2"
    const findItemById = (id: UniqueIdentifier) => {
        const idStr = id?.toString() || '';
        const [type, idPart] = idStr.split(":");
        const numericId = Number(idPart);
        if (type === 'chapter') {
            const chapter = chapters.find((c) => c.id === numericId);
            const index = chapters.findIndex((c) => c.id === numericId);
            if (chapter) return {type: 'chapter', item: chapter, index: index};
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
    return (
        <DndContext collisionDetection={closestCenter}
                    measuring={measuring}
                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToFirstScrollableAncestor]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}>
            <div className="mb-6">
                {chapters.length === 0 && (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No chapters yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start building your curriculum by adding your first chapter
                        </p>
                        <Button onClick={onAddChapterAction} size="lg">
                            <Plus className="w-5 h-5"/>
                            Add Your First Chapter
                        </Button>
                    </div>
                )}
                <SortableContext items={chapters.map((c) => `chapter:${c.id}`)}
                                 strategy={verticalListSortingStrategy}>
                    {chapters.map((chapter, index) => (
                        <ChapterSortableRef key={chapter.id} id={`chapter:${chapter.id}`} chapter={chapter}
                                            index={index}
                                            onChangeAction={(updated) => onUpdateChapterAction(index, updated)}
                                            onRemoveAction={() => onRemoveChapterAction(index)}
                                            onUpdateLessonsAction={(lessons) => onUpdateLessonsAction(index, lessons)}/>
                    ))}
                    {/*{createPortal(*/}
                    {/*    <DragOverlay*/}
                    {/*        dropAnimation={dropAnimationConfig}*/}
                    {/*        modifiers={indicator ? [adjustTranslate] : undefined}*/}
                    {/*    >*/}
                    {/*        {activeItem && activeIndex ? (*/}
                    {/*            activeType === "chapter" ? (*/}
                    {/*                // When rendering the overlay for a chapter, pass the same id format used by SortableContext*/}
                    {/*                <ChapterHeader/>*/}
                    {/*            ) : (*/}
                    {/*                <div className="p-2 rounded-lg bg-gray-100 shadow-md border border-gray-300">*/}
                    {/*                    {activeItem.title}*/}
                    {/*                </div>*/}
                    {/*            )*/}
                    {/*        ) : null}*/}
                    {/*    </DragOverlay>,*/}
                    {/*    document.body,*/}
                    {/*)}*/}
                </SortableContext>
                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={onAddChapterAction}
                            variant="outline"
                            className="flex-1 sm:flex-none"
                        >
                            <Plus className="w-4 h-4"/>
                            Add Chapter
                        </Button>

                        <div className="flex-1 sm:flex sm:justify-end">
                            <Button
                                onClick={onSaveAction}
                                size="lg"
                                className="w-full sm:w-auto"
                                disabled={chapters.length === 0}
                            >
                                <Save className="w-4 h-4"/>
                                Save Curriculum
                            </Button>
                        </div>
                    </div>
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
            setActiveIndex(found.index as number);
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
        setActiveIndex(null);
        document.body.style.setProperty('cursor', '');
    }

    function handleDragCancel() {
        resetState();
    }
}
export default ChaptersTree
