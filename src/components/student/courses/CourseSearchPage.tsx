"use client";

import React, {useEffect, useState} from "react";
import {BookOpen, Search} from "lucide-react";
import {CourseStatus, Difficulty} from "@/types/enum";
import {useCourses} from "@/hooks/useCourses";
import {useDebounce} from "@/hooks/useDebounce";
import CourseCard from "@/components/student/courses/CourseCard";

export default function CourseSearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500); // Wait 500ms before searching

    const [filters, setFilters] = useState({
        status: CourseStatus.PUBLISHED as CourseStatus,
        difficulty: "ALL" as Difficulty | "ALL",
        categoryId: undefined as number | undefined,
        page: 1,
        size: 12,
    });

    // 2. Data Fetching
    const {courses, totalPages, isLoading, isError, totalElements} = useCourses({
        keyword: debouncedSearch,
        status: filters.status,
        difficulty: filters.difficulty,
        categoryId: filters.categoryId,
        page: filters.page,
        size: filters.size,
    });

    useEffect(() => {
        setFilters((prev) => ({...prev, page: 1}));
    }, [debouncedSearch, filters.status, filters.difficulty, filters.categoryId]);

    // 3. Handlers
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters((prev) => ({...prev, page: newPage}));
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
            {/* Header & Title */}
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Browse Courses</h1>
                    <p className="text-muted-foreground mt-1">
                        Explore our collection of {isLoading ? "..." : totalElements} courses
                    </p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div
                className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">

                {/* Search Input */}
                <div className="md:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <input
                        type="text"
                        placeholder="Search by title or keyword..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Difficulty Filter */}
                <div className="md:col-span-3">
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filters.difficulty}
                        onChange={(e) => setFilters({...filters, difficulty: e.target.value as Difficulty | "ALL"})}
                    >
                        <option value="ALL">All Levels</option>
                        <option value={Difficulty.BEGINNER}>Beginner</option>
                        <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                        <option value={Difficulty.ADVANCED}>Advanced</option>
                    </select>
                </div>
            </div>

            {/* Content Grid */}
            <div className="min-h-[400px]">
                {isError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-destructive">
                        <p>Failed to load courses. Please try again later.</p>
                    </div>
                ) : isLoading ? (
                    <CourseGridSkeleton/>
                ) : courses.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
                        <BookOpen className="h-12 w-12 mb-4 opacity-50"/>
                        <p className="text-lg font-medium">No courses found</p>
                        <p className="text-sm">Try adjusting your search filters</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilters(p => ({...p, difficulty: 'ALL'}));
                            }}
                            className="mt-4 text-primary hover:underline text-sm font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course}/>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && courses.length > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="text-sm text-muted-foreground">
                        Page {filters.page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page <= 1}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page >= totalPages}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Loading Skeleton ---
function CourseGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="h-[160px] w-full animate-pulse rounded-lg bg-muted"/>
                    <div className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted"/>
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted"/>
                    </div>
                    <div className="mt-4 h-8 w-full animate-pulse rounded bg-muted"/>
                </div>
            ))}
        </div>
    );
}