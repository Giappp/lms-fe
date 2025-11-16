import React from 'react'
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import CurrentCourseCard from "@/components/student/courses/CurrentCourseCard";
import Link from "next/link";

const CurrentCourses = () => {
    const currentCourses = [
        {
            imageUrl: "/js_logo.png",
            name: "Introduction to JavaScript",
            instructor: "John Doe",
            lesson: "Functions and Scope",
            progress: 75
        },
        {
            imageUrl: "/react.webp",
            name: "Advanced React Development",
            instructor: "Jane Smith",
            lesson: "State Management",
            progress: 40
        },
        {
            imageUrl: "/Python-01_2_1.webp",
            name: "Python for Data Science",
            instructor: "Dr. Brown",
            lesson: "Final Project ",
            progress: 90
        },
    ]
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-2xl">Current Courses</CardTitle>
                <CardAction>
                    <Link href="/public" className="underline">View All</Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                {currentCourses && (
                    currentCourses.map((course) => (
                        <CurrentCourseCard key={course.name}
                                           imageUrl={course.imageUrl} name={course.name}
                                           lesson={course.lesson} progress={course.progress}
                                           instructor={course.instructor}/>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
export default CurrentCourses
