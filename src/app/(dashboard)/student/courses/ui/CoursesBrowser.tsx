"use client"
import React, {useEffect, useState} from 'react'
import {useDebounce} from "use-debounce";
import {Course, CoursesFilterParams} from "@/types";
import {CourseService} from "@/api/services/course-service";
import CourseCard from "@/app/(dashboard)/student/courses/ui/CourseCard";


const CoursesBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [priceRange, setPriceRange] = useState({min: 0, max: 3000000});
    const [minRating, setMinRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search term to prevent excessive API calls
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    // Prepare filter params for API
    const getFilterParams = (): CoursesFilterParams => ({
        search: debouncedSearch || undefined,
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        minRating: minRating || undefined,
        page: currentPage,
        limit: 12, // items per page
    });

    // Fetch courses from API
    const fetchCourses = async (params: CoursesFilterParams) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await CourseService.getCourses(params);
            setCourses(response);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error(err);
            setError("Server Error");
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to fetch courses when filters change
    useEffect(() => {
        fetchCourses(getFilterParams());
    }, [debouncedSearch, selectedCategory, selectedDifficulty, priceRange.min, priceRange.max, minRating, currentPage]);
    return (
        <div className="space-y-6">
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
                        {/* Categories will come from API */}
                    </select>

                    {/* Difficulty filter */}
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="">All Difficulties</option>
                        {/* Difficulties will come from API */}
                    </select>

                    {/* Price range filter */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Min price"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({...prev, min: Number(e.target.value)}))}
                            className="p-2 border rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Max price"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({...prev, max: Number(e.target.value)}))}
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
            {/* Loading state */}
            {isLoading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {courses ? courses.map((item) => (
                        <CourseCard
                            key={item.id}
                            {...item}
                        />
                    )) : (<div>No Data</div>)}
                </div>
            )}

            {error ? (
                <div className="flex justify-center">
                    <p>{error}</p>
                </div>
            ) : (<></>)}

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-6">
                {Array.from({length: totalPages}, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded ${
                            currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}
export default CoursesBrowser
