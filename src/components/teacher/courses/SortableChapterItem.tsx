"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChapterTableOfContents } from "@/types/response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash, Plus, BookOpen, Clock } from "lucide-react";
import { SortableLessonItem } from "./SortableLessonItem";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

interface SortableChapterItemProps {
  chapter: ChapterTableOfContents;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddLesson?: () => void;
  onEditLesson?: (lessonId: number) => void;
  onDeleteLesson?: (lessonId: number) => void;
  onLessonReorder?: (lessons: any[]) => void;
  readOnly?: boolean;
}

export function SortableChapterItem({
  chapter,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonReorder,
  readOnly = false,
}: SortableChapterItemProps) {
  const [lessons, setLessons] = useState(chapter.lessons);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `chapter-${chapter.id}`,
    disabled: readOnly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = parseInt(String(active.id).replace("lesson-", ""));
    const overId = parseInt(String(over.id).replace("lesson-", ""));

    const oldIndex = lessons.findIndex((l) => l.id === activeId);
    const newIndex = lessons.findIndex((l) => l.id === overId);

    const reordered = arrayMove(lessons, oldIndex, newIndex);
    setLessons(reordered);
    onLessonReorder?.(reordered);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {!readOnly && (
                <button
                  className="cursor-grab active:cursor-grabbing mt-1"
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{chapter.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{chapter.lessonCount} {chapter.lessonCount === 1 ? "lesson" : "lessons"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(chapter.totalDuration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
            <SortableContext
              items={lessons.map((l) => `lesson-${l.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {lessons.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={() => onEditLesson?.(lesson.id)}
                  onDelete={() => onDeleteLesson?.(lesson.id)}
                  readOnly={readOnly}
                />
              ))}
            </SortableContext>
          </DndContext>

          {!readOnly && (
            <Button variant="outline" size="sm" onClick={onAddLesson} className="w-full mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          )}

          {lessons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No lessons yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
