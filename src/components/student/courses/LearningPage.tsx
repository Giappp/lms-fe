"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCourseCurriculum } from "@/hooks/useCourseCurriculum";
import { useQuizzesByLesson } from "@/hooks/useQuizzes";
import { CourseService } from "@/api/services/course-service";
import { LessonService } from "@/api/services/lesson-service";
import { LessonResponse } from "@/types/response";
import { LessonType } from "@/types/enum";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChapterAccordion } from "@/components/shared/course/ChapterAccordion";
import { LessonVideoPlayer } from "./LessonVideoPlayer";
import { LessonContent } from "./LessonContent";
import { LessonMaterials } from "./LessonMaterials";
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, X, Clock, FileQuestion } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface LearningPageProps {
  params: Promise<{ id: string }>;
}

export function LearningPage({ params }: LearningPageProps) {
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id);
  const searchParams = useSearchParams();
  const lessonId = searchParams?.get("lesson");
  const router = useRouter();
  const { toast } = useToast();

  const { tableOfContents: curriculum, isLoading: curriculumLoading } = useCourseCurriculum(courseId);
  const { quizzes: lessonQuizzes, isLoading: quizzesLoading } = useQuizzesByLesson(lessonId ? parseInt(lessonId) : undefined);
  const [currentLesson, setCurrentLesson] = useState<LessonResponse | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load lesson details when lessonId changes
  useEffect(() => {
    if (!lessonId || !courseId) return;

    const loadLesson = async () => {
      try {
        setLessonLoading(true);
        
        // Fetch full lesson details from API including materials
        const response = await LessonService.getLessonById(parseInt(lessonId));
        
        if (response?.success && response.data) {
          setCurrentLesson(response.data);
        } else {
          // Fallback to curriculum data if API fails
          const lesson = curriculum?.chapters
            .flatMap((ch: any) => ch.lessons)
            .find((l: any) => l.id === parseInt(lessonId));

          if (lesson) {
            setCurrentLesson(lesson as any);
          }
        }
      } catch (error: any) {
        console.error("Failed to load lesson from API, using curriculum data:", error);
        
        // Fallback to curriculum data
        const lesson = curriculum?.chapters
          .flatMap((ch: any) => ch.lessons)
          .find((l: any) => l.id === parseInt(lessonId));

        if (lesson) {
          setCurrentLesson(lesson as any);
        } else {
          toast({
            title: "Error",
            description: "Failed to load lesson",
            variant: "destructive",
          });
        }
      } finally {
        setLessonLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, courseId]);

  const handleLessonClick = (newLessonId: number) => {
    router.push(`/student/courses/${courseId}/learn?lesson=${newLessonId}`);
  };

  const handleNext = async () => {
    if (!lessonId) return;

    try {
      const response = await CourseService.getNextLesson(courseId, parseInt(lessonId));
      if (response?.success && response.data?.id) {
        router.push(`/student/courses/${courseId}/learn?lesson=${response.data.id}`);
      } else {
        toast({
          title: "End of Course",
          description: "You've completed all lessons!",
        });
      }
    } catch (error: any) {
      toast({
        title: "No next lesson",
        description: "You've reached the end of this course.",
      });
    }
  };

  const handlePrevious = async () => {
    if (!lessonId) return;

    try {
      const response = await CourseService.getPreviousLesson(courseId, parseInt(lessonId));
      if (response?.success && response.data?.id) {
        router.push(`/student/courses/${courseId}/learn?lesson=${response.data.id}`);
      }
    } catch (error: any) {
      toast({
        title: "No previous lesson",
        description: "This is the first lesson.",
      });
    }
  };

  if (curriculumLoading) {
    return (
      <div className="h-screen flex">
        <Skeleton className="flex-1" />
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <Link href="/student/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href={`/student/courses/${courseId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
            <div className="hidden md:block">
              <h1 className="font-semibold text-lg truncate max-w-md">
                {curriculum.courseResponse.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lesson Content */}
        <div className="flex-1 overflow-auto">
          {lessonLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading lesson...</p>
              </div>
            </div>
          ) : currentLesson ? (
            <div className="container max-w-5xl mx-auto px-4 py-8">
              {/* Lesson Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{currentLesson.duration} minutes</span>
                </div>
              </div>

              {/* Video Player for VIDEO and YOUTUBE types */}
              <LessonVideoPlayer
                type={currentLesson.type}
                videoUrl={currentLesson.videoUrl}
                title={currentLesson.title}
              />

              {/* Lesson Content for MARKDOWN or description */}
              {(currentLesson.type === LessonType.MARKDOWN || currentLesson.description) && (
                <LessonContent
                  content={currentLesson.type === LessonType.MARKDOWN ? currentLesson.content : ""}
                  description={currentLesson.description}
                />
              )}

              {/* Lesson Materials */}
              {currentLesson.materials && currentLesson.materials.length > 0 && (
                <div className="mt-6">
                  <LessonMaterials
                    materials={currentLesson.materials}
                    lessonId={currentLesson.id}
                  />
                </div>
              )}

              {/* Lesson Quizzes */}
              {lessonQuizzes && lessonQuizzes.length > 0 && (
                <div className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        Quizzes
                      </h3>
                      <div className="space-y-3">
                        {lessonQuizzes.map((quiz) => (
                          <Link
                            key={quiz.id}
                            href={`/student/quizzes/${quiz.id}`}
                            className="block"
                          >
                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <FileQuestion className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{quiz.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {quiz.questionCount} questions • {quiz.timeLimitMinutes} minutes
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {quizzesLoading && lessonId && (
                <div className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        Quizzes
                      </h3>
                      <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
                <Button onClick={handleNext}>
                  Next Lesson
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <ChevronRight className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Select a lesson to begin</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose a lesson from the course content on the right to start learning
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar - Curriculum */}
        <div
          className={`
            ${sidebarOpen ? "w-96" : "w-0"} 
            transition-all duration-300 
            border-l bg-card overflow-hidden
            fixed lg:relative right-0 top-[57px] h-[calc(100vh-57px)]
            lg:h-auto z-40
          `}
        >
          <div className="h-full overflow-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Course Content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChapterAccordion
              chapters={curriculum.chapters}
              currentLessonId={lessonId ? parseInt(lessonId) : undefined}
              onLessonClick={handleLessonClick}
              defaultOpenChapters={curriculum.chapters.map((ch) => `chapter-${ch.id}`)}
            />
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
