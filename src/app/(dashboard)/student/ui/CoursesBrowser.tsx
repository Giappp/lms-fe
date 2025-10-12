"use client"
import React, {Suspense, useState} from 'react'
import {useDebounce} from "use-debounce";
import CourseList from "@/app/(dashboard)/student/ui/CourseList";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import CoursesBrowserSkeleton from "@/app/(dashboard)/student/ui/CoursesBrowserSkeleton";


const CoursesBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-[480px]"
                />

                <div className="flex flex-row gap-4">
                    <Select onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Categories"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"default"}>All Categories</SelectItem>
                            {/* Add categories here */}
                        </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Difficulties"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">All Difficulties</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={minRating.toString()}
                        onValueChange={(value) => setMinRating(Number(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Ratings"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Ratings</SelectItem>
                            <SelectItem value="4">4+ Stars</SelectItem>
                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Suspense fallback={<CoursesBrowserSkeleton/>}>
                <CourseList
                    search={debouncedSearch}
                    category={selectedCategory}
                    difficulty={selectedDifficulty}
                    minRating={minRating}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Suspense>
        </div>
    );
}
export default CoursesBrowser
