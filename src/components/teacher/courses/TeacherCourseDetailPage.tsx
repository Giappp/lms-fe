"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCourseCurriculum } from "@/hooks/useCourseCurriculum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseHeader } from "@/components/shared/course/CourseHeader";
import { ChapterAccordion } from "@/components/shared/course/ChapterAccordion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle2,
  XCircle 
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TeacherCourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export function TeacherCourseDetailPage({ params }: TeacherCourseDetailPageProps) {
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id);
  const router = useRouter();

  const { tableOfContents, course, chapters, enrolledCount, isLoading } = useCourseCurriculum(courseId);

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
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Link href="/teacher/courses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate course statistics
  const totalLessons = chapters?.reduce((sum, ch) => sum + (ch.lessonCount || 0), 0) || 0;
  const totalDuration = chapters?.reduce((sum, ch) => sum + (ch.totalDuration || 0), 0) || 0;
  const totalChapters = chapters?.length || 0;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Actions */}
      <CourseHeader
        course={course}
        showStatus
        enrolledCount={enrolledCount}
        actions={
          <div className="flex gap-2">
            <Link href="/teacher/courses">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Link href={`/teacher/courses/${courseId}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            </Link>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrolledCount || 0}</p>
                <p className="text-sm text-muted-foreground">Enrolled Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalChapters}</p>
                <p className="text-sm text-muted-foreground">Chapters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                <p className="text-sm text-muted-foreground">Total Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    Complete table of contents for this course
                  </CardDescription>
                </div>
                <Link href={`/teacher/courses/${courseId}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Curriculum
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {chapters && chapters.length > 0 ? (
                <ChapterAccordion chapters={chapters} />
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No curriculum yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your course by adding chapters and lessons
                  </p>
                  <Link href={`/teacher/courses/${courseId}/edit`}>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Add Curriculum
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {course.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.categories && course.categories.length > 0 ? (
                      course.categories.map((cat) => (
                        <Badge key={cat.id} variant="outline">{cat.name}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No categories</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Difficulty</h4>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Price</h4>
                  <p className="text-lg font-semibold">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge 
                    variant={course.status === "PUBLISHED" ? "default" : "secondary"}
                  >
                    {course.status === "PUBLISHED" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {course.status}
                  </Badge>
                </div>
              </div>

              {course.thumbnailUrl && (
                <div>
                  <h4 className="font-semibold mb-2">Thumbnail</h4>
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="rounded-lg max-w-md border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>
                {enrolledCount || 0} student{enrolledCount !== 1 ? 's' : ''} enrolled in this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>Student management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
