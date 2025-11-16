"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { QuizCard } from "@/components/shared/quiz/QuizCard";
import { QuizResponse } from "@/types/response";
import { QuizType } from "@/types/enum";

// Mock data for demonstration
const mockQuizzes: QuizResponse[] = [
    {
        id: 1,
        title: "Introduction to React Hooks",
        description: "Test your knowledge of React Hooks including useState, useEffect, and custom hooks",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 1,
        courseName: "React Fundamentals",
        lessonId: 5,
        lessonTitle: "React Hooks Deep Dive",
        startTime: new Date("2025-01-01"),
        endTime: new Date("2025-12-31"),
        maxAttempts: 3,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 70,
        timeLimitMinutes: 30,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 15,
        totalPoints: 100,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-15")
    },
    {
        id: 2,
        title: "JavaScript Fundamentals - Midterm Exam",
        description: "Comprehensive assessment covering variables, functions, arrays, objects, and ES6 features",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 1,
        courseName: "React Fundamentals",
        startTime: new Date("2025-01-10"),
        endTime: new Date("2025-03-31"),
        maxAttempts: 2,
        scoringMethod: "LATEST" as any,
        passingPercentage: 75,
        timeLimitMinutes: 60,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 30,
        totalPoints: 200,
        createdAt: new Date("2025-01-05"),
        updatedAt: new Date("2025-01-20")
    },
    {
        id: 3,
        title: "TypeScript Advanced Concepts",
        description: "Deep dive into TypeScript generics, decorators, and advanced types",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 2,
        courseName: "Advanced TypeScript",
        lessonId: 8,
        lessonTitle: "Advanced Type Systems",
        startTime: new Date("2025-02-01"),
        endTime: new Date("2025-06-30"),
        maxAttempts: 3,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 80,
        timeLimitMinutes: 45,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 20,
        totalPoints: 150,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-25")
    },
    {
        id: 4,
        title: "Node.js Backend Development Final",
        description: "Complete assessment on REST APIs, Express, and database integration",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 3,
        courseName: "Node.js Backend Development",
        startTime: new Date("2025-03-01"),
        endTime: new Date("2025-05-31"),
        maxAttempts: 1,
        scoringMethod: "LATEST" as any,
        passingPercentage: 85,
        timeLimitMinutes: 90,
        isActive: false,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: false,
        showCorrectAnswers: false,
        questionCount: 40,
        totalPoints: 250,
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-18")
    },
    {
        id: 5,
        title: "Database Design Principles",
        description: "Test on normalization, indexing, and query optimization",
        quizType: QuizType.LESSON_QUIZ,
        courseId: 4,
        courseName: "Database Design",
        lessonId: 12,
        lessonTitle: "Advanced Database Concepts",
        startTime: new Date("2025-01-15"),
        endTime: new Date("2025-12-31"),
        maxAttempts: 2,
        scoringMethod: "AVERAGE" as any,
        passingPercentage: 70,
        timeLimitMinutes: 40,
        isActive: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResults: true,
        showCorrectAnswers: true,
        questionCount: 18,
        totalPoints: 120,
        createdAt: new Date("2025-01-12"),
        updatedAt: new Date("2025-01-22")
    },
    {
        id: 6,
        title: "Web Security Best Practices",
        description: "Assessment covering XSS, CSRF, authentication, and authorization",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 5,
        courseName: "Web Security",
        startTime: new Date("2025-02-15"),
        endTime: new Date("2025-04-30"),
        maxAttempts: 2,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 90,
        timeLimitMinutes: 50,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 25,
        totalPoints: 180,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-02-01")
    },
    {
        id: 6,
        title: "Web Security Best Practices",
        description: "Assessment covering XSS, CSRF, authentication, and authorization",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 5,
        courseName: "Web Security",
        startTime: new Date("2025-02-15"),
        endTime: new Date("2025-04-30"),
        maxAttempts: 2,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 90,
        timeLimitMinutes: 50,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 25,
        totalPoints: 180,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-02-01")
    },
    {
        id: 6,
        title: "Web Security Best Practices",
        description: "Assessment covering XSS, CSRF, authentication, and authorization",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 5,
        courseName: "Web Security",
        startTime: new Date("2025-02-15"),
        endTime: new Date("2025-04-30"),
        maxAttempts: 2,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 90,
        timeLimitMinutes: 50,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 25,
        totalPoints: 180,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-02-01")
    },
    {
        id: 6,
        title: "Web Security Best Practices",
        description: "Assessment covering XSS, CSRF, authentication, and authorization",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 5,
        courseName: "Web Security",
        startTime: new Date("2025-02-15"),
        endTime: new Date("2025-04-30"),
        maxAttempts: 2,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 90,
        timeLimitMinutes: 50,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 25,
        totalPoints: 180,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-02-01")
    },
    {
        id: 6,
        title: "Web Security Best Practices",
        description: "Assessment covering XSS, CSRF, authentication, and authorization",
        quizType: QuizType.COURSE_QUIZ,
        courseId: 5,
        courseName: "Web Security",
        startTime: new Date("2025-02-15"),
        endTime: new Date("2025-04-30"),
        maxAttempts: 2,
        scoringMethod: "HIGHEST" as any,
        passingPercentage: 90,
        timeLimitMinutes: 50,
        isActive: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: false,
        questionCount: 25,
        totalPoints: 180,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-02-01")
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

export default function TeacherQuizManagementPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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
        if (filterType !== "all") {
            result = result.filter(quiz => quiz.quizType === filterType);
        }

        // Filter by status
        if (filterStatus !== "all") {
            result = result.filter(quiz =>
                (filterStatus === "active" && quiz.isActive) ||
                (filterStatus === "inactive" && !quiz.isActive)
            );
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
    }, [searchTerm, selectedCourse, filterType, filterStatus, dateFrom, dateTo]);

    // Pagination
    const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
    const paginatedQuizzes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredQuizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredQuizzes, currentPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCourse, filterType, filterStatus, dateFrom, dateTo]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCourse("all");
        setFilterType("all");
        setFilterStatus("all");
        setDateFrom("");
        setDateTo("");
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || selectedCourse !== "all" || filterType !== "all" || filterStatus !== "all" || dateFrom || dateTo;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quiz Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage quizzes for your courses
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => router.push("/teacher/quizzes/analytics/1")}
                    >
                        <TrendingUp className="h-4 w-4" />
                        View Analytics
                    </Button>
                    <Button 
                        className="gap-2"
                        onClick={() => router.push("/teacher/quizzes/create")}
                    >
                        <Plus className="h-4 w-4" />
                        Create Quiz
                    </Button>
                </div>
            </div>

            {/* Filter Area */}
            <Card>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <Select value={filterType} onValueChange={setFilterType}>
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

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="All Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
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
                        <div className="space-y-2">
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
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div>
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
                                {hasActiveFilters 
                                    ? "Try adjusting your filters to see more results" 
                                    : "Create your first quiz to get started"}
                            </p>
                            {hasActiveFilters ? (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            ) : (
                                <Button 
                                    className="gap-2"
                                    onClick={() => router.push("/teacher/quizzes/create")}
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Your First Quiz
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
                                    variant="teacher"
                                    onView={() => router.push(`/teacher/quizzes/${quiz.id}`)}
                                    onEdit={() => router.push(`/teacher/quizzes/${quiz.id}/edit`)}
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
    );
}
