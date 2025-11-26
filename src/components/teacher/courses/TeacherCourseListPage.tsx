"use client";

import { useState } from "react";
import { useCourses } from "@/hooks/useCourses";
import { CourseCard } from "@/components/shared/course/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { CourseStatus, Difficulty } from "@/types/enum";
import { CourseResponse } from "@/types/response";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

export function TeacherCourseListPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<CourseStatus | "ALL">("ALL");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  
  const debouncedKeyword = useDebounce(keyword, 500);

  const { courses, totalElements, totalPages, currentPage, isLoading } = useCourses({
    keyword: debouncedKeyword || undefined,
    status: status === "ALL" ? undefined : status,
    difficulty: difficulty === "ALL" ? undefined : difficulty,
    size: 20,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and create your courses
          </p>
        </div>
        <Link href="/teacher/courses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v as CourseStatus | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value={CourseStatus.DRAFT}>Draft</SelectItem>
            <SelectItem value={CourseStatus.PUBLISHED}>Published</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty | "ALL")}>
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

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      ) : courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: CourseResponse) => (
            <CourseCard
              key={course.id}
              course={course}
              href={`/teacher/courses/${course.id}`}
              showStatus
              actions={
                <Link href={`/teacher/courses/${course.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            {keyword || status !== "ALL" || difficulty !== "ALL"
              ? "Try adjusting your filters"
              : "Create your first course to get started"}
          </p>
          {!keyword && status === "ALL" && difficulty === "ALL" && (
            <Link href="/teacher/courses/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 0}
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
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
