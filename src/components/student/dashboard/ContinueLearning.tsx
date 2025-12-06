import React from 'react'
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BookOpen, ChevronRight, PlayCircle} from "lucide-react";
import {Progress} from "@/components/ui/progress";

/**
 * MOCK DATA
 */
const activeCourses = [
    {
        id: 1,
        title: "Advanced Web Development",
        instructor: "Sarah Connors",
        progress: 75,
        nextLesson: "Server Actions in Next.js",
        totalLessons: 24,
        completedLessons: 18,
        image: "/api/placeholder/400/200",
        color: "bg-blue-500"
    },
    {
        id: 2,
        title: "UI/UX Design Principles",
        instructor: "Marcus Chen",
        progress: 45,
        nextLesson: "Color Theory & Accessibility",
        totalLessons: 12,
        completedLessons: 5,
        image: "/api/placeholder/400/200",
        color: "bg-purple-500"
    },
    {
        id: 3,
        title: "Data Structures & Algo",
        instructor: "Dr. Emily Watson",
        progress: 90,
        nextLesson: "Graph Traversal",
        totalLessons: 40,
        completedLessons: 36,
        image: "/api/placeholder/400/200",
        color: "bg-emerald-500"
    }
];

const ContinueLearning = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Continue Learning</h2>
                <Button variant="ghost" className="text-sm h-8">View All</Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                        <div className={`h-24 ${course.color} relative p-6 flex items-end`}>
                            <div
                                className="absolute top-4 right-4 bg-background/20 backdrop-blur rounded-full p-1.5 text-white">
                                <BookOpen size={16}/>
                            </div>
                        </div>
                        <CardHeader className="pb-3 pt-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                    <CardDescription className="mt-1">{course.instructor}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-1.5"/>
                            </div>

                            <div className="rounded-lg bg-secondary/50 p-3 flex items-center gap-3">
                                <div
                                    className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0 text-primary">
                                    <PlayCircle size={16} fill="currentColor" className="opacity-20"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground truncate">Next Lesson</p>
                                    <p className="text-sm font-medium truncate">{course.nextLesson}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                    <ChevronRight size={16}/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
export default ContinueLearning
