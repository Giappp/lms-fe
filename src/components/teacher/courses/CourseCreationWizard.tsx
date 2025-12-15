"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseForm } from "./CourseForm";
import { ChapterForm } from "./ChapterForm";
import { LessonForm } from "./LessonForm";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, ArrowRight, Save, Eye } from "lucide-react";
import { CourseService } from "@/api/services/course-service";
import { ChapterService } from "@/api/services/chapter-service";
import { LessonService } from "@/api/services/lesson-service";
import { useToast } from "@/hooks/use-toast";
import { useCourseCurriculum } from "@/hooks/useCourseCurriculum";
import { CourseResponse, ChapterTableOfContents } from "@/types/response";
import { CourseHeader } from "@/components/shared/course/CourseHeader";
import { ChapterAccordion } from "@/components/shared/course/ChapterAccordion";
import { useAuth } from "@/hooks/useAuth";

const STEPS = ["Basic Information", "Curriculum", "Preview"];

export function CourseCreationWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<CourseResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog states
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Editing states
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [deletingChapterId, setDeletingChapterId] = useState<number | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  // Fetch curriculum data when courseId is set
  const { chapters, mutate } = useCourseCurriculum(courseId || 0);

  const handleCourseSubmit = async (data: any, thumbnail?: File) => {
    try {
      setIsSubmitting(true);
      const response = await CourseService.createCourse(data, thumbnail);
      if (response.success && response.data) {
        setCourseId(response.data.id);
        setCourseData(response.data);
        toast({ title: "Course created successfully" });
        setCurrentStep(1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (!courseId) return;

    try {
      setIsSubmitting(true);
      // Update course status to PUBLISHED
      await CourseService.updateCourse(courseId, {
        ...courseData!,
        status: "PUBLISHED" as any,
      });

      toast({
        title: "Course Published!",
        description: "Your course is now live and visible to students.",
      });

      router.push(`/teacher/courses/${courseId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish course",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your course has been saved as a draft.",
    });
    router.push("/teacher/courses");
  };

  // Chapter handlers
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

  // Lesson handlers
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

  // Submit handlers
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

  const confirmDelete = async () => {
    try {
      if (deletingLessonId && deletingChapterId) {
        await LessonService.deleteLesson({ lessonId: deletingLessonId, chapterId: deletingChapterId });
        toast({ title: "Lesson deleted successfully" });
      } else if (deletingChapterId && courseId) {
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

  const handleSaveOrder = async (reorderedChapters: any[]) => {
    if (!courseId) return;

    try {
      const chapterOrders = reorderedChapters.map((chapter, idx) => ({
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-muted"
                  }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`text-sm mt-2 ${
                    index <= currentStep ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Basic Information</CardTitle>
              <CardDescription>
                Fill in the basic details about your course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseForm
                mode="create"
                teacherId={user?.id || 0}
                teacherName={user?.fullName || ""}
                onSubmit={handleCourseSubmit}
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && courseId && (
          <Card>
            <CardHeader>
              <CardTitle>Build Your Curriculum</CardTitle>
              <CardDescription>
                Add chapters and lessons to structure your course content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurriculumBuilder
                courseId={courseId}
                chapters={chapters || []}
                onSave={handleSaveOrder}
                onAddChapter={handleAddChapter}
                onEditChapter={handleEditChapter}
                onDeleteChapter={handleDeleteChapter}
                onAddLesson={handleAddLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
              />

              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext}>
                  Continue to Preview
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && courseData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview Your Course</CardTitle>
                <CardDescription>
                  Review how your course will appear to students
                </CardDescription>
              </CardHeader>
            </Card>

            <CourseHeader
              course={courseData}
              showStatus
              actions={
                <div className="flex gap-2">
                  <Button onClick={handleSaveDraft} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button onClick={handlePublish} disabled={isSubmitting}>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish Course
                  </Button>
                </div>
              }
            />

            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <ChapterAccordion chapters={chapters || []} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep < STEPS.length - 1 && currentStep > 0 && (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Chapter Dialog */}
      {courseId && (
        <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingChapterId ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
              <DialogDescription>
                {editingChapterId ? "Update chapter information" : "Create a new chapter"}
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
      )}

      {/* Lesson Dialog */}
      {courseId && (
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
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deletingLessonId ? "lesson" : "chapter"}?
              {!deletingLessonId && " All lessons in this chapter will also be deleted."}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
