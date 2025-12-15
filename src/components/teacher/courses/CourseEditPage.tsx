"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useCourseCurriculum } from "@/hooks/useCourseCurriculum";
import { CourseForm } from "./CourseForm";
import { ChapterForm } from "./ChapterForm";
import { LessonForm } from "./LessonForm";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Eye, Save, Trash } from "lucide-react";
import { CourseService } from "@/api/services/course-service";
import { ChapterService } from "@/api/services/chapter-service";
import { LessonService } from "@/api/services/lesson-service";
import { useToast } from "@/hooks/use-toast";
import { CourseHeader } from "@/components/shared/course/CourseHeader";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface CourseEditPageProps {
  params: Promise<{ id: string }>;
}

export function CourseEditPage({ params }: CourseEditPageProps) {
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id);
  const router = useRouter();
  const { toast } = useToast();

  const { tableOfContents, course, chapters, enrolledCount, isLoading, mutate } = useCourseCurriculum(courseId);

  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [deletingChapterId, setDeletingChapterId] = useState<number | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const handleAddChapter = () => {
    setEditingChapterId(null);
    setChapterDialogOpen(true);
  };

  const handleEditChapter = (chapterId: number) => {
    setEditingChapterId(chapterId);
    setChapterDialogOpen(true);
  };

  const handleDeleteChapter = (chapterId: number) => {
    setDeletingChapterId(chapterId);
    setDeletingLessonId(null);
    setDeleteDialogOpen(true);
  };

  const handleAddLesson = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setEditingLessonId(null);
    setLessonDialogOpen(true);
  };

  const handleEditLesson = (chapterId: number, lessonId: number) => {
    setSelectedChapterId(chapterId);
    setEditingLessonId(lessonId);
    setLessonDialogOpen(true);
  };

  const handleDeleteLesson = (chapterId: number, lessonId: number) => {
    setDeletingChapterId(chapterId);
    setDeletingLessonId(lessonId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (deletingLessonId && deletingChapterId) {
        await LessonService.deleteLesson({ lessonId: deletingLessonId, chapterId: deletingChapterId });
        toast({ title: "Lesson deleted successfully" });
      } else if (deletingChapterId) {
        await ChapterService.deleteChapter({ chapterId: deletingChapterId, courseId });
        toast({ title: "Chapter deleted successfully" });
      }
      // Force revalidation to update UI immediately
      await mutate(undefined, { revalidate: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingChapterId(null);
      setDeletingLessonId(null);
    }
  };

  const handleSaveOrder = async (chapters: any[]) => {
    try {
      const chapterOrders = chapters.map((chapter, idx) => ({
        chapterId: chapter.id,
        orderIndex: idx,
        lessons: chapter.lessons.map((lesson: any, lessonIdx: number) => ({
          lessonId: lesson.id,
          orderIndex: lessonIdx,
        })),
      }));

      await CourseService.reorderTableOfContents(courseId, { chapters: chapterOrders });
      toast({ title: "Order saved successfully" });
      mutate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save order",
        variant: "destructive",
      });
    }
  };

  const handleCourseSubmit = async (data: any, thumbnail?: File) => {
    try {
      setIsSubmitting(true);
      // Thumbnail upload is handled within updateCourse API
      await CourseService.updateCourse(courseId, data);
      toast({ title: "Course updated successfully" });
      mutate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChapterSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (editingChapterId) {
        await ChapterService.updateChapter(editingChapterId, data);
        toast({ title: "Chapter updated successfully" });
      } else {
        await ChapterService.createChapter(data);
        toast({ title: "Chapter created successfully" });
      }
      // Force revalidation to update UI immediately
      await mutate(undefined, { revalidate: true });
      setChapterDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save chapter",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLessonSubmit = async (data: any, videoFile?: File, materialFiles?: File[]) => {
    try {
      setIsSubmitting(true);
      if (editingLessonId) {
        await LessonService.updateLesson(editingLessonId, data, videoFile, materialFiles);
        toast({ title: "Lesson updated successfully" });
      } else if (selectedChapterId) {
        await LessonService.createLesson(selectedChapterId, data, videoFile, materialFiles);
        toast({ title: "Lesson created successfully" });
      }
      // Force revalidation to update UI immediately
      await mutate(undefined, { revalidate: true });
      setLessonDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save lesson",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;

    try {
      await CourseService.updateCourse(courseId, {
        ...course,
        status: "PUBLISHED" as any,
      });
      toast({ title: "Course published successfully" });
      mutate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish course",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/teacher/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <CourseHeader
        course={course}
        enrolledCount={enrolledCount}
        showStatus
        actions={
          <div className="flex gap-2">
            <Link href="/teacher/courses">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Link href={`/teacher/courses/${courseId}/preview`}>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            {course.status !== "PUBLISHED" && (
              <Button onClick={handlePublish}>
                Publish Course
              </Button>
            )}
          </div>
        }
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="details">Course Details</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <Card>
              <CardContent className="pt-6">
                <CurriculumBuilder
                  courseId={courseId}
                  chapters={chapters}
                  onSave={handleSaveOrder}
                  onAddChapter={handleAddChapter}
                  onEditChapter={handleEditChapter}
                  onDeleteChapter={handleDeleteChapter}
                  onAddLesson={handleAddLesson}
                  onEditLesson={handleEditLesson}
                  onDeleteLesson={handleDeleteLesson}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>Update your course information</CardDescription>
              </CardHeader>
              <CardContent>
                <CourseForm
                  mode="edit"
                  initialData={course}
                  teacherId={course?.teacherId || 0}
                  teacherName={course?.teacherName || ""}
                  onSubmit={handleCourseSubmit}
                  isLoading={isSubmitting}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chapter Dialog */}
      <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChapterId ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
            <DialogDescription>
              {editingChapterId ? "Update chapter information" : "Create a new chapter for your course"}
            </DialogDescription>
          </DialogHeader>
          <ChapterForm
            open={chapterDialogOpen}
            onOpenChange={setChapterDialogOpen}
            mode={editingChapterId ? "edit" : "create"}
            courseId={courseId}
            initialData={editingChapterId ? chapters?.find(c => c.id === editingChapterId) : undefined}
            onSubmit={handleChapterSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLessonId ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
            <DialogDescription>
              {editingLessonId ? "Update lesson information" : "Create a new lesson"}
            </DialogDescription>
          </DialogHeader>
          <LessonForm
            open={lessonDialogOpen}
            onOpenChange={setLessonDialogOpen}
            mode={editingLessonId ? "edit" : "create"}
            chapterId={selectedChapterId || 0}
            initialData={
              editingLessonId && selectedChapterId
                ? chapters?.find(c => c.id === selectedChapterId)?.lessons?.find(l => l.id === editingLessonId) as any
                : undefined
            }
            onSubmit={handleLessonSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {deletingLessonId ? "lesson" : "chapter and all its lessons"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
