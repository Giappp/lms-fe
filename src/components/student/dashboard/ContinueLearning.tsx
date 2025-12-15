import React from 'react';
import {BookOpen, ChevronRight, Clock, Play, Search} from 'lucide-react';
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import {useResumeLearning} from "@/hooks/student/useResumeLearning";
import {useAuth} from "@/hooks/useAuth"; // Assuming Next.js, or use 'react-router-dom'

// DTO Interface
export interface ResumeLearningDTO {
    courseId: number;
    courseTitle: string;
    courseThumbnail: string;
    lessonId: number;
    lessonTitle: string;
    chapterId: number;
    chapterTitle: string;
    progressPercentage: number;
    lastAccessedAt: string;
}

const ContinueLearning = () => {
    const {user} = useAuth();
    const {courses, isLoading, isError} = useResumeLearning(user?.id);

    if (isError) {
        return (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
                Unable to load learning progress. Please check your connection.
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSkeleton/>;
    }

    if (!courses || courses.length === 0) {
        return <EmptyStateCTA/>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Continue Learning
                </h2>
                <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary">
                    View History
                </Button>
            </div>

            <div className="grid gap-4">
                {courses.map((item) => (
                    <ResumeCourseCard key={item.courseId} data={item}/>
                ))}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

const EmptyStateCTA = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Continue Learning
            </h2>
            <Card
                className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 bg-card/50 shadow-none">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary"/>
                </div>
                <h3 className="text-lg font-medium text-foreground">
                    Start Your First Course
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                    You haven&#39;t enrolled in any courses yet. Browse our catalog to find the perfect skill to master
                    next.
                </p>
                <Link href="/student/courses">
                    <Button className="gap-2">
                        <Search className="h-4 w-4"/>
                        Browse Catalog
                    </Button>
                </Link>
            </Card>
        </div>
    );
};

const ResumeCourseCard = ({data}: { data: ResumeLearningDTO }) => {
    return (
        <Card
            className="group relative overflow-hidden border-border bg-card text-card-foreground transition-all hover:shadow-md hover:border-primary/50">
            <div className="flex flex-col sm:flex-row gap-4 p-4">

                {/* Thumbnail */}
                <div
                    className="relative shrink-0 overflow-hidden rounded-md sm:w-48 w-full aspect-video sm:aspect-[4/3]">
                    <img
                        src={data.courseThumbnail}
                        alt={data.courseTitle}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                            <Play className="h-5 w-5 fill-current ml-0.5"/>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between space-y-3">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-accent-foreground">
                                {data.chapterTitle}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3"/>
                                {new Date(data.lastAccessedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                            {data.courseTitle}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            Next: <span className="text-foreground">{data.lessonTitle}</span>
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-muted-foreground">Progress</span>
                            <span className="font-bold text-primary">{Math.round(data.progressPercentage)}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                                style={{width: `${data.progressPercentage}%`}}
                            />
                        </div>
                    </div>

                    {/* Mobile CTA */}
                    <div className="sm:hidden pt-2">
                        <Button className="w-full">Resume Lesson</Button>
                    </div>
                </div>

                {/* Desktop Arrow */}
                <div className="hidden sm:flex items-center justify-center pl-2">
                    <Button size="icon" variant="secondary"
                            className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ChevronRight className="h-5 w-5"/>
                    </Button>
                </div>
            </div>

            <Link
                href={`/course/${data.courseId}/learn/${data.lessonId}`}
                className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl"
            >
                <span className="sr-only">Resume {data.courseTitle}</span>
            </Link>
        </Card>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-40"/>
            <Skeleton className="h-8 w-24"/>
        </div>
        <div className="grid gap-4">
            {[1, 2].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl">
                    <Skeleton className="sm:w-48 w-full aspect-video rounded-md"/>
                    <div className="flex-1 space-y-3 py-1">
                        <Skeleton className="h-4 w-1/3"/>
                        <Skeleton className="h-6 w-3/4"/>
                        <Skeleton className="h-4 w-1/2"/>
                        <div className="pt-2">
                            <Skeleton className="h-2 w-full rounded-full"/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ContinueLearning;