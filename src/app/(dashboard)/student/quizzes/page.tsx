"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import QuizzesStat from "@/components/student/quizzes/QuizzesStat";
import QuizBrowser from "@/components/student/quizzes/QuizBrowser";
import { QuizCard } from "@/components/shared/quiz";
import { QuizType } from "@/types/enum";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useMyCoursesDropdown } from "@/hooks/useCourses";
import { useQuizSearch } from "@/hooks/useQuizzes";
import { useDebounce } from "@/hooks/useDebounce";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 6;

const Page = () => {
    const router = useRouter();
    const { courses } = useMyCoursesDropdown();

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [selectedQuizType, setSelectedQuizType] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search term to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Format date for API (ISO format)
    const formatDateForApi = (date: string) => {
        if (!date) return undefined;
        return new Date(date).toISOString();
    };

    // Fetch quizzes using the search hook
    // Note: For students, the API automatically filters by enrolled courses and active quizzes only
    const { 
        quizzes, 
        totalElements, 
        totalPages, 
        isLoading, 
        refresh 
    } = useQuizSearch({
        title: debouncedSearchTerm || undefined,
        courseId: selectedCourse !== "all" ? parseInt(selectedCourse) : null,
        quizType: selectedQuizType !== "all" ? selectedQuizType : null,
        // isActive is auto-filtered for students on backend
        startDate: formatDateForApi(startDate),
        endDate: formatDateForApi(endDate),
        page: currentPage,
        size: ITEMS_PER_PAGE,
    });

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, selectedCourse, selectedQuizType, startDate, endDate]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCourse("all");
        setSelectedQuizType("all");
        setStartDate("");
        setEndDate("");
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || selectedCourse !== "all" || selectedQuizType !== "all" || startDate || endDate;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-row justify-between mb-6">
                {/*Header*/}
                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-2xl">Available Quizzes</h1>
                    <p className="text-muted-foreground">Browse and take quizzes from your enrolled courses</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Button variant={"outline"} onClick={refresh} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/>
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
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                            {course.title}
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
                            <Label htmlFor="startDate">Start Date From</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* Date Range - To */}
                        <div className="space-y-2 md:col-span-2 lg:col-span-1">
                            <Label htmlFor="endDate">End Date To</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
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
                            {isLoading ? 'Loading...' : `${totalElements} ${totalElements === 1 ? 'Quiz' : 'Quizzes'} Found`}
                        </h2>
                        {hasActiveFilters && (
                            <Badge variant="secondary">Filtered</Badge>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <h3 className="text-lg font-semibold mb-2">Loading quizzes...</h3>
                        </CardContent>
                    </Card>
                ) : quizzes.length === 0 ? (
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
                            {quizzes.map((quiz) => (
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
