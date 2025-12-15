"use client"
import React, {useState} from 'react'
import {useDebounce} from "use-debounce";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Filter, Search, SlidersHorizontal, Star, X} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";


const CoursesBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Check if any filters are active
    const hasActiveFilters = selectedCategory || selectedDifficulty || minRating > 0 || searchTerm;
    const activeFilterCount = [selectedCategory, selectedDifficulty, minRating > 0].filter(Boolean).length;

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedDifficulty("");
        setMinRating(0);
        setCurrentPage(1);
        setIsFilterOpen(false);
    };

    // Filter change handlers that reset to page 1
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value === "default" ? "" : value);
        setCurrentPage(1);
    };

    const handleDifficultyChange = (value: string) => {
        setSelectedDifficulty(value === "default" ? "" : value);
        setCurrentPage(1);
    };

    const handleRatingChange = (value: string) => {
        setMinRating(Number(value));
        setCurrentPage(1);
    };

    // Filters component (reusable for both desktop and mobile)
    const FilterControls = () => (
        <>
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select value={selectedCategory || "default"} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">All Categories</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Difficulty</label>
                <Select value={selectedDifficulty || "default"} onValueChange={handleDifficultyChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Difficulties"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">All Difficulties</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum Rating</label>
                <Select
                    value={minRating.toString()}
                    onValueChange={handleRatingChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Ratings"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">All Ratings</SelectItem>
                        <SelectItem value="3">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500"/>
                                <span>3+ Stars</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="4">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500"/>
                                <span>4+ Stars</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="4.5">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500"/>
                                <span>4.5+ Stars</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    );

    return (
        <div className="space-y-6">
            {/* Header with Title */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
                    <p className="text-muted-foreground mt-1">
                        Discover your next learning adventure
                    </p>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    <Input
                        type="text"
                        placeholder="Search by course title, instructor, or topic..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10 pr-10 h-12 text-base shadow-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setCurrentPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    )}
                </div>

                {/* Desktop Filters */}
                <div className="hidden lg:flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <SlidersHorizontal className="w-4 h-4"/>
                        <span>Filters:</span>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-1">
                        <Select value={selectedCategory || "default"} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Categories"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">All Categories</SelectItem>
                                <SelectItem value="programming">Programming</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="data-science">Data Science</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedDifficulty || "default"} onValueChange={handleDifficultyChange}>
                            <SelectTrigger className="w-[180px]">
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
                            onValueChange={handleRatingChange}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="All Ratings"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All Ratings</SelectItem>
                                <SelectItem value="3">3+ Stars</SelectItem>
                                <SelectItem value="4">4+ Stars</SelectItem>
                                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4 mr-1"/>
                            Clear all
                        </Button>
                    )}
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden flex items-center gap-3">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="relative flex-1 sm:flex-none">
                                <Filter className="w-4 h-4 mr-2"/>
                                Filters
                                {activeFilterCount > 0 && (
                                    <Badge
                                        variant="default"
                                        className="ml-2 px-1.5 py-0.5 text-xs h-5 min-w-5"
                                    >
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Filter Courses</SheetTitle>
                                <SheetDescription>
                                    Refine your search with these filters
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                                <FilterControls/>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleResetFilters}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => setIsFilterOpen(false)}
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-muted-foreground"
                        >
                            <X className="w-4 h-4 mr-1"/>
                            Clear
                        </Button>
                    )}
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        {searchTerm && (
                            <Badge variant="secondary" className="gap-1">
                                Search: {searchTerm}
                                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-foreground">
                                    <X className="w-3 h-3"/>
                                </button>
                            </Badge>
                        )}
                        {selectedCategory && (
                            <Badge variant="secondary" className="gap-1">
                                {selectedCategory}
                                <button onClick={() => handleCategoryChange("default")}
                                        className="ml-1 hover:text-foreground">
                                    <X className="w-3 h-3"/>
                                </button>
                            </Badge>
                        )}
                        {selectedDifficulty && (
                            <Badge variant="secondary" className="gap-1">
                                {selectedDifficulty}
                                <button onClick={() => handleDifficultyChange("default")}
                                        className="ml-1 hover:text-foreground">
                                    <X className="w-3 h-3"/>
                                </button>
                            </Badge>
                        )}
                        {minRating > 0 && (
                            <Badge variant="secondary" className="gap-1">
                                {minRating}+ stars
                                <button onClick={() => handleRatingChange("0")} className="ml-1 hover:text-foreground">
                                    <X className="w-3 h-3"/>
                                </button>
                            </Badge>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoursesBrowser