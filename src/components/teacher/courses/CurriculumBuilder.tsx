"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableChapterItem } from "./SortableChapterItem";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { ChapterTableOfContents } from "@/types/response";
import { ChapterOrder, LessonOrder } from "@/types/request";
import { useToast } from "@/hooks/use-toast";

interface CurriculumBuilderProps {
  courseId: number;
  chapters: ChapterTableOfContents[];
  onSave?: (reordered: ChapterTableOfContents[]) => void;
  onAddChapter?: () => void;
  onEditChapter?: (chapterId: number) => void;
  onDeleteChapter?: (chapterId: number) => void;
  onAddLesson?: (chapterId: number) => void;
  onEditLesson?: (chapterId: number, lessonId: number) => void;
  onDeleteLesson?: (chapterId: number, lessonId: number) => void;
  readOnly?: boolean;
}

export function CurriculumBuilder({
  courseId,
  chapters: initialChapters,
  onSave,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  readOnly = false,
}: CurriculumBuilderProps) {
  const [chapters, setChapters] = useState(initialChapters);
  const { toast } = useToast();

  // Sync local state when initialChapters changes (after API updates)
  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Check if dragging chapters
    if (activeId.startsWith("chapter-") && overId.startsWith("chapter-")) {
      const oldIndex = chapters.findIndex((c) => `chapter-${c.id}` === activeId);
      const newIndex = chapters.findIndex((c) => `chapter-${c.id}` === overId);

      const reordered = arrayMove(chapters, oldIndex, newIndex).map((chapter, idx) => ({
        ...chapter,
        orderIndex: idx,
      }));

      setChapters(reordered);
      return;
    }

    // Check if dragging lessons within the same chapter
    if (activeId.startsWith("lesson-") && overId.startsWith("lesson-")) {
      const activeLessonId = parseInt(activeId.replace("lesson-", ""));
      const overLessonId = parseInt(overId.replace("lesson-", ""));

      const chapterIndex = chapters.findIndex((c) =>
        c.lessons.some((l) => l.id === activeLessonId)
      );

      if (chapterIndex === -1) return;

      const chapter = chapters[chapterIndex];
      const oldLessonIndex = chapter.lessons.findIndex((l) => l.id === activeLessonId);
      const newLessonIndex = chapter.lessons.findIndex((l) => l.id === overLessonId);

      const reorderedLessons = arrayMove(chapter.lessons, oldLessonIndex, newLessonIndex).map(
        (lesson, idx) => ({ ...lesson, orderIndex: idx })
      );

      const updatedChapters = [...chapters];
      updatedChapters[chapterIndex] = {
        ...chapter,
        lessons: reorderedLessons,
      };

      setChapters(updatedChapters);
    }
  };

  const handleSave = () => {
    onSave?.(chapters);
  };

  const handleLessonReorder = (chapterId: number, lessons: any[]) => {
    const updatedChapters = chapters.map((chapter) => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: lessons.map((lesson, idx) => ({ ...lesson, orderIndex: idx })),
        };
      }
      return chapter;
    });
    setChapters(updatedChapters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Curriculum</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder chapters and lessons
          </p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Button onClick={onAddChapter} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Order
            </Button>
          </div>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={chapters.map((c) => `chapter-${c.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <SortableChapterItem
                key={chapter.id}
                chapter={chapter}
                onEdit={() => onEditChapter?.(chapter.id)}
                onDelete={() => onDeleteChapter?.(chapter.id)}
                onAddLesson={() => onAddLesson?.(chapter.id)}
                onEditLesson={(lessonId: number) => onEditLesson?.(chapter.id, lessonId)}
                onDeleteLesson={(lessonId: number) => onDeleteLesson?.(chapter.id, lessonId)}
                onLessonReorder={(lessons: any) => handleLessonReorder(chapter.id, lessons)}
                readOnly={readOnly}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {chapters.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No chapters yet</p>
          {!readOnly && (
            <Button onClick={onAddChapter} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Chapter
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
