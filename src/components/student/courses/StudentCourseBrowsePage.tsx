"use client";

import { useState } from "react";
import { useCourses } from "@/hooks/useCourses";
import { CourseCard } from "@/components/shared/course/CourseCard";
import { EnrollButton } from "@/components/student/courses/EnrollButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { Difficulty } from "@/types/enum";
import { CourseResponse } from "@/types/response";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentCourseBrowsePage() {
  const [keyword, setKeyword] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [pageNumber, setPageNumber] = useState(0);
  
  const debouncedKeyword = useDebounce(keyword, 500);

  const { courses, totalElements, totalPages, currentPage, isLoading } = useCourses({
    keyword: debouncedKeyword || undefined,
    difficulty: difficulty === "ALL" ? undefined : difficulty,
    status: "PUBLISHED" as any,
    page: pageNumber,
    size: 12,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Title */}
      <div className="container mx-auto px-4 pt-8">
          <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground mt-1">
            Discover your next learning adventure
          </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPageNumber(0);
              }}
              className="pl-9"
            />
          </div>

          <Select
            value={difficulty}
            onValueChange={(v) => {
              setDifficulty(v as Difficulty | "ALL");
              setPageNumber(0);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value={Difficulty.BEGINNER}>Beginner</SelectItem>
              <SelectItem value={Difficulty.INTERMEDIATE}>Intermediate</SelectItem>
              <SelectItem value={Difficulty.ADVANCED}>Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        {totalElements > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            {totalElements} {totalElements === 1 ? "course" : "courses"} found
          </div>
        )}

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course: CourseResponse) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  href={`/student/courses/${course.id}`}
                  actions={
                    <EnrollButton
                      courseId={course.id}
                      isEnrolled={course.isEnrolled}
                      variant="default"
                      size="sm"
                      className="w-full"
                    />
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {keyword || difficulty !== "ALL"
                ? "Try adjusting your filters"
                : "No courses available at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}