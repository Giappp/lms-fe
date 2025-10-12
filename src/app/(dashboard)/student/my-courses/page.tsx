"use client"
import React, {useState} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"

const Page = () => {
    const [searchTerm, setSearchTerm] = useState("")

    // Giả lập dữ liệu - sau này sẽ thay bằng API call thực tế
    const enrolledCourses = [
        {
            id: 1,
            thumbnail: "/course-1.jpg",
            title: "Complete React Developer Course",
            description: "Learn React from scratch with hands-on projects",
            category: ["Programming", "Web Development"],
            instructor: "John Doe",
            duration: "20 hours",
            difficulty: "Intermediate",
            price: 1200000,
            rating: 4.5,
            status: "in-progress", // completed, not-started
            reviews: 120
        },
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground">
                        Manage and track your enrolled courses
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button variant="outline">
                        Search
                    </Button>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="not-started">Not Started</TabsTrigger>
                    </TabsList>

                    {/* In Progress Tab */}
                    <TabsContent value="in-progress" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        </div>
                    </TabsContent>

                    {/* Completed Tab */}
                    <TabsContent value="completed" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        </div>
                    </TabsContent>

                    {/* Not Started Tab */}
                    <TabsContent value="not-started" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Page