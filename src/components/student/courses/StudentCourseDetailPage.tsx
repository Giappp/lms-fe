"use client";

import { use } from "react";
import { useCourseCurriculum } from "@/hooks/useCourseCurriculum";
import { useMyEnrollments } from "@/hooks/useEnrollments";
import { useAuth } from "@/hooks/useAuth";
import { CourseHeader } from "@/components/shared/course/CourseHeader";
import { ChapterAccordion } from "@/components/shared/course/ChapterAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, BookOpen, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { EnrollmentService } from "@/api/services/enrollment-service";
import Link from "next/link";
import { EnrollmentStatus } from "@/types/enum";

interface StudentCourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export function StudentCourseDetailPage({ params }: StudentCourseDetailPageProps) {
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const { tableOfContents, course, chapters, isLoading, mutate } = useCourseCurriculum(courseId);
 
  
  const enrollmentStatus = course?.enrollmentStatus;
  const isApproved = enrollmentStatus === EnrollmentStatus.APPROVED;
  const isPending = enrollmentStatus === EnrollmentStatus.PENDING;
  const isRejected = enrollmentStatus === EnrollmentStatus.REJECTED;

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/signin/student?redirect=/student/courses/${courseId}`);
      return;
    }

    try {
      await EnrollmentService.requestEnrollment({
        courseId,
        studentId: user.id,
      });

      toast({
        title: "Enrollment Requested",
        description: "Your enrollment request has been submitted. Please wait for approval.",
      });

      mutate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll",
        variant: "destructive",
      });
    }
  };

  const handleStartLearning = () => {
    if (chapters && chapters.length > 0 && chapters[0].lessons.length > 0) {
      const firstLesson = chapters[0].lessons[0];
      router.push(`/student/courses/${courseId}/learn?lesson=${firstLesson.id}`);
    }
  };

  const totalLessons = chapters?.reduce((acc: number, ch: any) => acc + ch.lessonCount, 0) || 0;
  const totalDuration = chapters?.reduce((acc: number, ch: any) => acc + ch.totalDuration, 0) || 0;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-64" />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/student/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <CourseHeader
        course={course}
        enrolledCount={tableOfContents?.enrolledCount || 0}
        actions={
          isApproved ? (
            <Button size="lg" onClick={handleStartLearning}>
              Start Learning
            </Button>
          ) : isPending ? (
            <Button size="lg" disabled variant="secondary">
              Enrollment Pending
            </Button>
          ) : isRejected ? (
            <Button size="lg" onClick={handleEnroll}>
              Enroll Again
            </Button>
          ) : (
            <Button size="lg" onClick={handleEnroll}>
              Enroll Now
            </Button>
          )
        }
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{totalLessons}</span>
                    <span className="text-muted-foreground">
                      {totalLessons === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDuration(totalDuration)}</span>
                    <span className="text-muted-foreground">total</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                {chapters && chapters.length > 0 ? (
                  <ChapterAccordion
                    chapters={chapters}
                    onLessonClick={
                      isApproved
                        ? (lessonId) => router.push(`/student/courses/${courseId}/learn?lesson=${lessonId}`)
                        : undefined
                    }
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No curriculum available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                  <p className="font-medium">{course.teacherName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Students Enrolled</p>
                  <p className="font-medium">{tableOfContents?.enrolledCount || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {course.categories && course.categories.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {course.categories.map((category: any) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: category.color + "20",
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What You'll Learn (if enrolled) */}
            {isApproved && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {chapters && chapters.slice(0, 5).map((chapter: any) => (
                      <li key={chapter.id} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{chapter.title}</span>
                      </li>
                    ))}
                    {chapters && chapters.length > 5 && (
                      <li className="text-xs text-muted-foreground pl-6">
                        +{chapters.length - 5} more chapters
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Enrollment Status Card */}
            {isPending && (
              <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-900 dark:text-yellow-100">
                    Enrollment Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your enrollment request is being reviewed by the instructor. You'll be notified once it's approved.
                  </p>
                </CardContent>
              </Card>
            )}

            {isRejected && (
              <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900 dark:text-red-100">
                    Enrollment Rejected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Your enrollment request was not approved. You can try enrolling again or contact the instructor.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Enroll CTA (mobile) */}
            {!isApproved && !isPending && (
              <Card className="lg:hidden">
                <CardContent className="pt-6">
                  <Button 
                    size="lg" 
                    onClick={handleEnroll} 
                    className="w-full"
                  >
                    {isRejected ? "Enroll Again" : "Enroll Now"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
