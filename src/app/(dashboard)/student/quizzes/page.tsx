"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import QuizzesStat from "@/components/student/quizzes/QuizzesStat";
import QuizBrowser from "@/components/student/quizzes/QuizBrowser";
import { QuizCard } from "@/components/shared/quiz";
import { QuizResponse } from "@/types/response";
import { QuizType } from "@/types/enum";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

// Mock quizzes
const mockQuizzes: QuizResponse[] = [
    {
        id: 1,
        title: "Introduction to React Hooks",
        description: "Test your knowledge of React Hooks",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 1,
        lessonId: 5,
        startTime: new Date("2024-02-01T00:00:00Z"),
        endTime: new Date("2024-12-31T23:59:59Z"),
        maxAttempts: 3,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 70,
        timeLimitMinutes: 30,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 3,
        totalPoints: 30,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20")
    },
    {
        id: 2,
        title: "JavaScript ES6 Features Final Exam",
        description: "Comprehensive test covering ES6+ features",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 1,
        maxAttempts: 2,
        scoringMethod: "LATEST" as any,
        passingPercentage: 80,
        timeLimitMinutes: 60,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 10,
        totalPoints: 100,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18")
    },
    {
        id: 3,
        title: "TypeScript Basics",
        description: "Understanding TypeScript fundamentals",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 2,
        lessonId: 3,
        startTime: new Date("2024-01-15T00:00:00Z"),
        endTime: new Date("2024-06-30T23:59:59Z"),
        maxAttempts: 5,
        scoringMethod: "AVERAGE" as any,
        passingPercentage: 65,
        timeLimitMinutes: 20,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 5,
        totalPoints: 50,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-19")
    },
    {
        id: 4,
        title: "Node.js Fundamentals",
        description: "Test your Node.js knowledge",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 3,
        lessonId: 1,
        startTime: new Date("2024-02-01T00:00:00Z"),
        endTime: new Date("2024-12-31T23:59:59Z"),
        maxAttempts: 3,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 70,
        timeLimitMinutes: 25,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 6,
        totalPoints: 60,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-22")
    },
    {
        id: 5,
        title: "Database Design Quiz",
        description: "Database normalization and design principles",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 4,
        maxAttempts: 2,
        scoringMethod: "LATEST" as any,
        passingPercentage: 75,
        timeLimitMinutes: 40,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 8,
        totalPoints: 80,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-21")
    },
    {
        id: 6,
        title: "Web Security Basics",
        description: "Understanding common security vulnerabilities",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 5,
        lessonId: 2,
        startTime: new Date("2024-01-20T00:00:00Z"),
        endTime: new Date("2024-07-31T23:59:59Z"),
        maxAttempts: 4,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 80,
        timeLimitMinutes: 35,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 7,
        totalPoints: 70,
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-19")
    },
    {
        id: 7,
        title: "API Design Patterns",
        description: "REST, GraphQL, and API best practices",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 3,
        maxAttempts: 3,
        scoringMethod: "AVERAGE" as any,
        passingPercentage: 70,
        timeLimitMinutes: 50,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 12,
        totalPoints: 120,
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-20")
    },
    {
        id: 8,
        title: "CSS Flexbox & Grid",
        description: "Modern CSS layout techniques",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 1,
        lessonId: 8,
        startTime: new Date("2024-02-05T00:00:00Z"),
        endTime: new Date("2024-12-31T23:59:59Z"),
        maxAttempts: 5,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 65,
        timeLimitMinutes: 30,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 5,
        totalPoints: 50,
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-23")
    }
];

// Mock courses for filter dropdown
const mockCourses = [
    { id: 1, name: "React Fundamentals" },
    { id: 2, name: "Advanced TypeScript" },
    { id: 3, name: "Node.js Backend Development" },
    { id: 4, name: "Database Design" },
    { id: 5, name: "Web Security" }
];

const ITEMS_PER_PAGE = 6;

const Page = () => {
    const router = useRouter();

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [selectedQuizType, setSelectedQuizType] = useState<string>("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filtered and paginated results
    const filteredQuizzes = useMemo(() => {
        let result = mockQuizzes;

        // Search by title
        if (searchTerm) {
            result = result.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by course
        if (selectedCourse !== "all") {
            result = result.filter(quiz => quiz.courseId === parseInt(selectedCourse));
        }

        // Filter by quiz type
        if (selectedQuizType !== "all") {
            result = result.filter(quiz => quiz.quizType === selectedQuizType);
        }

        // Filter by date range
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            result = result.filter(quiz => quiz.startTime && quiz.startTime >= fromDate);
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(quiz => quiz.endTime && quiz.endTime <= toDate);
        }

        return result;
    }, [searchTerm, selectedCourse, selectedQuizType, dateFrom, dateTo]);

    // Pagination
    const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
    const paginatedQuizzes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredQuizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredQuizzes, currentPage]);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCourse, selectedQuizType, dateFrom, dateTo]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCourse("all");
        setSelectedQuizType("all");
        setDateFrom("");
        setDateTo("");
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || selectedCourse !== "all" || selectedQuizType !== "all" || dateFrom || dateTo;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-row justify-between mb-6">
                {/*Header*/}
                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-2xl">Available Quizzes</h1>
                    <p className="text-muted-foreground">Browse and take quizzes from your enrolled courses</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Button variant={"outline"}>
                        <FontAwesomeIcon icon={faRefresh}/>
                        Refresh
                    </Button>
                    <Button onClick={() => router.push("/student/results")}>View History</Button>
                </div>
            </div>

            <QuizzesStat/>
            <div className="mt-8">
                <QuizBrowser/>
            </div>

            {/* Filter Area */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5"/>
                        Filter Quizzes
                    </CardTitle>
                    <CardDescription>
                        Use the filters below to find specific quizzes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search by Title</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="search"
                                    placeholder="Search quizzes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Course Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger id="course">
                                    <SelectValue placeholder="All Courses"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {mockCourses.map(course => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Quiz Type Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="quizType">Quiz Type</Label>
                            <Select value={selectedQuizType} onValueChange={setSelectedQuizType}>
                                <SelectTrigger id="quizType">
                                    <SelectValue placeholder="All Types"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value={QuizType.LESSON_QUIZ}>Lesson Quiz</SelectItem>
                                    <SelectItem value={QuizType.COURSE_QUIZ}>Course Quiz</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range - From */}
                        <div className="space-y-2">
                            <Label htmlFor="dateFrom">Start Date From</Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        {/* Date Range - To */}
                        <div className="space-y-2 md:col-span-2 lg:col-span-1">
                            <Label htmlFor="dateTo">End Date To</Label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>

                        {/* Clear Filters Button */}
                        <div className="space-y-2 flex items-end md:col-span-2 lg:col-span-3">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full md:w-auto"
                                >
                                    <X className="h-4 w-4 mr-2"/>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'Quiz' : 'Quizzes'} Found
                        </h2>
                        {hasActiveFilters && (
                            <Badge variant="secondary">Filtered</Badge>
                        )}
                    </div>
                </div>

                {paginatedQuizzes.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Filter className="h-12 w-12 text-muted-foreground mb-4"/>
                            <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Try adjusting your filters to see more results
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedQuizzes.map((quiz) => (
                                <QuizCard
                                    key={quiz.id}
                                    quiz={quiz}
                                    variant="student"
                                    onView={() => router.push(`/student/quizzes/${quiz.id}`)}
                                    onStart={() => router.push(`/student/quizzes/take/${quiz.id}`)}
                                    showActions={true}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(page)}
                                                    isActive={currentPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
export default Page
