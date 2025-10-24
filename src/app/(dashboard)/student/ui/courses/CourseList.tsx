import React from 'react'
import CourseCard from "@/app/(dashboard)/student/ui/courses/CourseCard";
import {useCourses} from "@/hooks/useCourses";
import {Course} from "@/types";

const CourseList = ({
                        search,
                        category,
                        difficulty,
                        minRating,
                        currentPage,
                        setCurrentPage
                    }: {
    search: string;
    category: string;
    difficulty: string;
    minRating: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}) => {
    const {courses, totalPages, refreshCourses} = useCourses({
        search: search || undefined,
        category: category || undefined,
        difficulty: difficulty || undefined,
        minRating: minRating || undefined,
        page: currentPage,
        limit: 12,
    });

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
        await refreshCourses();
    };


    return (
        <>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                {courses.length > 0 ? (
                    courses.map((item: Course) => <CourseCard key={item.id} {...item} />)
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        No courses found
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === i + 1
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
export default CourseList
