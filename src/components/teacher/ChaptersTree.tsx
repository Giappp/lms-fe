import React, {useState} from 'react'
import {
    closestCenter,
    defaultDropAnimation,
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    MeasuringStrategy,
    Modifier,
    UniqueIdentifier
} from "@dnd-kit/core";
import {ChapterWithLessons, Lesson} from "@/types/types";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {setProperty} from "@/lib/utils";
import {createPortal} from "react-dom";
import {CSS} from "@dnd-kit/utilities";
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

const dropAnimationConfig: DropAnimation = {
    keyframes({transform}) {
        return [
            {opacity: 1, transform: CSS.Transform.toString(transform.initial)},
            {
                opacity: 0,
                transform: CSS.Transform.toString({
                    ...transform.final,
                    x: transform.final.x + 5,
                    y: transform.final.y + 5,
                }),
            },
        ];
    },
    easing: 'ease-out',
    sideEffects({active}) {
        active.node.animate([{opacity: 0}, {opacity: 1}], {
            duration: defaultDropAnimation.duration,
            easing: defaultDropAnimation.easing,
        });
    },
};


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
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [currentPosition, setCurrentPosition] = useState<{
        overId: UniqueIdentifier;
    } | null>(null);

    const [activeType, setActiveType] = useState<"chapter" | "lesson" | null>(null);
    const [activeItem, setActiveItem] = useState<any>(null);

    const findItemById = (id: UniqueIdentifier) => {
        for (const chapter of chapters) {
            if (chapter.id === id) return {type: "chapter", item: chapter};
            const lesson = chapter.lessons.find((l) => l.id === id);
            if (lesson) return {type: "lesson", item: lesson};
        }
        return null;
    };

    const handleAddChapter = () => {
        const newChapter: ChapterWithLessons = {
            id: Math.random().toString(36).slice(2, 9),
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
                    onDragMove={handleDragMove}
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
                                <ChapterList chapter={activeItem} id={activeItem.id}/>
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
            setActiveId(active.id);
            setActiveType(found.type as "chapter" | "lesson");
            setActiveItem(found.item);
        }
    }

    function handleDragMove({delta}: DragMoveEvent) {
        setOffsetLeft(delta.x);
    }

    function handleDragEnd({active, over}: DragEndEvent) {
        resetState();
        if (!over || active.id === over.id) return;
        const [activeType, activeId] = active.id.toString().split(':');
        const [overType, overId] = over.id.toString().split(':');

        if (activeType === "chapter" && overType === "chapter") {
            const oldIndex = chapters.findIndex((c) => c.id === activeId);
            const newIndex = chapters.findIndex((c) => c.id === overId);
            setChapters(arrayMove(chapters, oldIndex, newIndex));
            return;
        }

        if (activeType === "lesson" && overType === "lesson") {
            const chapter = chapters.find((c) =>
                c.lessons.some((l) => l.id === activeId)
            );
            const overChapter = chapters.find((c) =>
                c.lessons.some((l) => l.id === overId)
            );
            if (!chapter || !overChapter) return;

            const oldIndex = chapter.lessons.findIndex((l) => l.id === activeId);
            const newIndex = overChapter.lessons.findIndex((l) => l.id === overId);

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
                const updated = chapters.map((c) => {
                    if (c.id === chapter.id) {
                        return {
                            ...c,
                            lessons: c.lessons.filter((l) => l.id !== activeId),
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
        setOverId(null);
        setActiveId(null);
        setOffsetLeft(0);
        setCurrentPosition(null);

        document.body.style.setProperty('cursor', '');
    }

    function handleDragCancel() {
        resetState();
    }

    function handleCollapse(id: UniqueIdentifier) {
        setChapters((items) =>
            setProperty(items, id, 'collapsed', (value) => {
                return !value;
            }),
        );
    }
}
export default ChaptersTree
