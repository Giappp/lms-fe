"use client";

import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, BookOpen, CheckCircle2, Clock, DollarSign, FileText, FileType, Layers, Video} from "lucide-react";
import {CourseStatus, Difficulty, LessonType} from "@/types/enum";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {ChapterWithLessons, CourseFormData} from "@/types/types";
import {CourseService} from "@/api/services/course-service";
import {AxiosError} from "axios";

type Props = {
    courseData: CourseFormData;
};

export default function ReviewPublish({courseData}: Props) {
    const [publishing, setPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [serverError, setServerError] = useState<string>();

    const handlePublish = async () => {
        setPublishing(true);
        setPublishStatus("idle");

        try {
            const result = await CourseService.publishCourse(courseData.courseId!);
            if (result.success && result.data?.status) {
                setPublishStatus("success");
            } else if (result.success && !result.data?.status) {
                setServerError(result.data!.message);
                setPublishStatus("error");
            }
        } catch (error) {
            setPublishStatus("error");
            if (error instanceof AxiosError) {
                console.error("Failed to publish course:", error.response?.data.message);
                setServerError(error.response?.data.message || "Unknown error");
            } else {
                setServerError("An unexpected error occurred while publishing the course.");
            }
        } finally {
            setPublishing(false);
        }
    };

    const handleSaveDraft = async () => {
        console.log("Saving as draft...");
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case Difficulty.BEGINNER:
                return "bg-green-100 text-green-800 border-green-200";
            case Difficulty.INTERMEDIATE:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case Difficulty.ADVANCED:
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getLessonIcon = (type: LessonType) => {
        switch (type) {
            case LessonType.VIDEO:
                return <Video className="h-4 w-4"/>;
            case LessonType.MARKDOWN:
                return <FileType className="h-4 w-4"/>;
            default:
                return <FileText className="h-4 w-4"/>;
        }
    };

    const getTotalLessons = () => {
        return courseData.chapters.reduce(
            (total, chapter) => total + chapter.lessons.length,
            0
        );
    };

    const getTotalDuration = () => {
        const minutes = courseData.chapters.reduce(
            (total, chapter) =>
                total +
                chapter.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
            0
        );
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const renderAlert = () => {
        if (publishStatus === "success") {
            return (
                <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600"/>
                    <AlertTitle className="text-green-800">Success!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Your course has been published successfully and is now available to students.
                    </AlertDescription>
                </Alert>
            );
        }
        if (publishStatus === "error" && serverError) {
            return (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {serverError}
                    </AlertDescription>
                </Alert>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Review Your Course</h1>
                        <p className="text-muted-foreground mt-1">
                            Review all details before publishing your course
                        </p>
                    </div>
                    <Badge
                        variant={
                            courseData.basicInfo?.status === CourseStatus.PUBLISHED
                                ? "default"
                                : "secondary"
                        }
                        className="text-sm px-3 py-1"
                    >
                        {courseData.basicInfo?.status || CourseStatus.DRAFT}
                    </Badge>
                </div>

                {/* Course Stats */}
                <div className="flex gap-6 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Layers className="h-4 w-4"/>
                        <span>{courseData.chapters.length} Chapters</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4"/>
                        <span>{getTotalLessons()} Lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4"/>
                        <span>{getTotalDuration()} Total</span>
                    </div>
                </div>
            </div>

            {renderAlert()}

            {/* Basic Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5"/>
                        Basic Information
                    </CardTitle>
                    <CardDescription>Course details and description</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Course Title</p>
                            <p className="text-lg font-semibold">{courseData.basicInfo?.title || "Untitled Course"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Difficulty Level</p>
                            <Badge
                                variant="outline"
                                className={`mt-1 ${getDifficultyColor(courseData.basicInfo?.difficulty)}`}
                            >
                                {courseData.basicInfo?.difficulty || Difficulty.BEGINNER}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Price</p>
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-5 w-5 text-green-600"/>
                                <p className="text-lg font-semibold">{courseData.basicInfo?.price || "0"}</p>
                            </div>
                        </div>

                        {courseData.template && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Template</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl">{courseData.template.icon}</span>
                                    <p className="font-medium">{courseData.template.title}</p>
                                </div>
                            </div>
                        )}

                        <div className="col-span-full space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                            <p className="text-sm leading-relaxed text-gray-700">
                                {courseData.basicInfo?.description || "No description provided"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Course Structure Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5"/>
                        Course Structure
                    </CardTitle>
                    <CardDescription>Chapters and lessons overview</CardDescription>
                </CardHeader>
                <CardContent>
                    {courseData.chapters.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                            <p>No chapters added yet</p>
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {courseData.chapters.map((chapter: ChapterWithLessons, index) => (
                                <AccordionItem key={chapter.id || index} value={`chapter-${index}`}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                                                    {index + 1}
                                                </Badge>
                                                <span className="font-medium text-left">{chapter.title}</span>
                                            </div>
                                            <Badge variant="secondary" className="ml-2">
                                                {chapter.lessons.length} {chapter.lessons.length === 1 ? "lesson" : "lessons"}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {chapter.lessons.length === 0 ? (
                                            <p className="text-sm text-muted-foreground pl-4 py-2">
                                                No lessons in this chapter
                                            </p>
                                        ) : (
                                            <div className="space-y-2 pl-4 pt-2">
                                                {chapter.lessons.map((lesson, lessonIndex: number) => (
                                                    <div
                                                        key={lesson.id || lessonIndex}
                                                        className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-white border">
                                                                {getLessonIcon(lesson.type)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{lesson.title}</p>
                                                                {lesson.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                                        {lesson.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {lesson.duration > 0 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Clock className="h-3 w-3 mr-1"/>
                                                                {lesson.duration}m
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>

            {/* Action Section */}
            <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-md">
                            <p className="font-medium">Ready to publish?</p>
                            <p className="text-sm text-muted-foreground">
                                Once published, your course will be available to students. You can still make changes
                                after publishing.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                disabled={publishing}
                                onClick={handleSaveDraft}
                                className="min-w-[120px]"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                onClick={handlePublish}
                                disabled={publishing || courseData.chapters.length === 0}
                                className="min-w-[140px]"
                            >
                                {publishing ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2"/>
                                        Publish Course
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}