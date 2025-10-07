"use client"
import React, {useState} from 'react'
import {useDebounce} from "use-debounce";
import CourseCard from "@/app/(dashboard)/student/courses/ui/CourseCard";
import {useCourses} from "@/hooks/useCourses";


const CoursesBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [priceRange, setPriceRange] = useState({min: 0, max: 3000000});
    const [minRating, setMinRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search term to prevent excessive API calls
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    const {courses, totalPages, isLoading, isError} = useCourses({
        search: debouncedSearch || undefined,
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        minRating: minRating || undefined,
        page: currentPage,
        limit: 12, // items per page
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="space-y-4">
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="">All Categories</option>
                        {/* TODO: Map categories from API later */}
                    </select>

                    {/* Difficulty filter */}
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="">All Difficulties</option>
                        {/* TODO: Map difficulties from API later */}
                    </select>

                    {/* Price range filter */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Min price"
                            value={priceRange.min}
                            onChange={(e) =>
                                setPriceRange((prev) => ({
                                    ...prev,
                                    min: Number(e.target.value),
                                }))
                            }
                            className="p-2 border rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Max price"
                            value={priceRange.max}
                            onChange={(e) =>
                                setPriceRange((prev) => ({
                                    ...prev,
                                    max: Number(e.target.value),
                                }))
                            }
                            className="p-2 border rounded-lg w-full"
                        />
                    </div>

                    {/* Rating filter */}
                    <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="p-2 border rounded-lg"
                    >
                        <option value={0}>All Ratings</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                    </select>
                </div>
            </div>

            {/* Courses list */}
            {isLoading ? (
                <div className="mt-4 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">
                        Loading courses...
                    </p>
                </div>
            ) : isError ? (
                <div className="text-center text-red-500 mt-6">
                    Failed to load courses.
                </div>
            ) : (
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {courses.length > 0 ? (
                        courses.map((item) => <CourseCard key={item.id} {...item} />)
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No courses found
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
export default CoursesBrowser
