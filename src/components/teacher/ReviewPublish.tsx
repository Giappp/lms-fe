"use client";

import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, CheckCircle2} from "lucide-react";
import {CourseStatus, Difficulty, LessonType} from "@/types/enum";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {ChapterWithLessons, Material, ReviewPublishProps} from "@/app/(dashboard)/teacher/courses/new/types";

export default function ReviewPublish({courseData}: ReviewPublishProps) {
    const [publishing, setPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState<
        "idle" | "success" | "error"
    >("idle");

    const handlePublish = async () => {
        if (!courseData.basicInfo?.title || !courseData.basicInfo?.description) {
            setPublishStatus("error");
            return;
        }

        setPublishing(true);
        try {
            // Here you would make an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setPublishStatus("success");
        } catch (error) {
            console.error("Failed to publish course:", error);
            setPublishStatus("error");
        } finally {
            setPublishing(false);
        }
    };

    const renderAlert = () => {
        if (publishStatus === "success") {
            return (
                <Alert className="mb-6 border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-500"/>
                    <AlertDescription className="text-green-500">
                        Course published successfully!
                    </AlertDescription>
                </Alert>
            );
        }
        if (publishStatus === "error") {
            return (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertDescription>
                        Failed to publish course. Please try again.
                    </AlertDescription>
                </Alert>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Review Your Course
                    </h2>
                    <p className="text-muted-foreground">
                        Review all details before publishing
                    </p>
                </div>
                <Badge
                    variant={
                        courseData.basicInfo?.status === CourseStatus.PUBLISHED
                            ? "default"
                            : "secondary"
                    }
                >
                    {courseData.basicInfo?.status || CourseStatus.DRAFT}
                </Badge>
            </div>

            {renderAlert()}

            <Card className="p-6">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <Separator className="my-4"/>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Title</p>
                        <p className="font-medium">{courseData.basicInfo?.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Difficulty</p>
                        <Badge variant="outline" className="mt-1">
                            {courseData.basicInfo?.difficulty || Difficulty.BEGINNER}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">${courseData.basicInfo?.price}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{courseData.basicInfo?.duration}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="mt-1">{courseData.basicInfo?.description}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-medium">Course Structure</h3>
                <Separator className="my-4"/>
                <Accordion type="single" collapsible className="w-full">
                    {courseData.lessons.map((chapter: ChapterWithLessons, index) => (
                        <AccordionItem key={index} value={`chapter-${index}`}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center">
                                    <span className="font-medium">{chapter.title}</span>
                                    <Badge variant="outline" className="ml-2">
                                        {chapter.lessons.length} lessons
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pl-4">
                                    {chapter.lessons.map((lesson, lessonIndex: number) => (
                                        <div key={lessonIndex} className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="h-6">
                                                {lesson.type === LessonType.VIDEO
                                                    ? "🎥"
                                                    : lesson.type === LessonType.PDF
                                                        ? "📄"
                                                        : "📝"}
                                            </Badge>
                                            <span>{lesson.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-medium">Course Materials</h3>
                <Separator className="my-4"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseData.materials.map((material: Material, index: number) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
              <span className="text-2xl mr-3">
                {material.type === "video" && "🎥"}
                  {material.type === "pdf" && "📄"}
                  {material.type === "link" && "🔗"}
              </span>
                            <div className="flex-1">
                                <p className="font-medium">{material.name}</p>
                                {material.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {material.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex items-center justify-between mt-8 pb-8">
                <div className="text-sm text-muted-foreground max-w-md">
                    Once published, your course will be available to students. You can still
                    make changes after publishing.
                </div>
                <div className="space-x-4">
                    <Button variant="outline" disabled={publishing}>
                        Save as Draft
                    </Button>
                    <Button onClick={handlePublish} disabled={publishing}>
                        {publishing ? "Publishing..." : "Publish Course"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
