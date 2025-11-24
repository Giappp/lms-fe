import useSWR from "swr";
import {PaginatedResponse} from "@/types/types";
import {CourseResponse} from "@/types";
import {CourseService} from "@/api/services/course-service";
import {CourseStatus, Difficulty} from "@/types/enum";
import {useCallback} from "react";
import {swrFetcher} from "@/lib/swrFetcher";

export interface CourseFilter {
    page?: number;
    size?: number;
    teacherId?: number;
    difficulty?: Difficulty | "ALL";
    status?: CourseStatus | "ALL";
    categoryId?: number;
    keyword?: string;
}

export function useCourses(filters?: CourseFilter) {
    const opts = {
        pageNumber: filters?.page ?? 1, // Backend: pageNumber
        pageSize: filters?.size ?? 12,  // Backend: pageSize
        teacherId: filters?.teacherId,
        categoryId: filters?.categoryId,
        status: filters?.status === "ALL" ? undefined : filters?.status,
        difficulty: filters?.difficulty === "ALL" ? undefined : filters?.difficulty,
        keyword: filters?.keyword, // Backend: keyword
    };

    // Convert object to query string (filtering out null/undefined)
    const qs = new URLSearchParams();
    Object.entries(opts).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            qs.append(key, String(value));
        }
    });

    const queryString = qs.toString();
    // Adjust your route constant here
    const key = `/api/courses/search?${queryString}`;

    const {data, error, isLoading, isValidating, mutate} = useSWR<PaginatedResponse<CourseResponse> | null>(
        key,
        swrFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: true,
            errorRetryCount: 3,
            dedupingInterval: 2000,
        }
    );

    const createCourse = useCallback(async (courseData: FormData) => {
        try {
            const result = await CourseService.createCourseWithBasicInfo(courseData);

            if (result?.success) {
                await mutate();
            }

            return result;
        } catch (error) {
            console.error('Failed to create course:', error);
            throw error;
        }
    }, [mutate]);

    const updateCourse = useCallback(async (courseId: number, courseData: FormData) => {
        try {
            const result = await CourseService.updateCourseBasicInfo(courseId, courseData);

            if (result?.success) {
                // Optimistically update the cache
                await mutate();
            }

            return result;
        } catch (error) {
            console.error('Failed to update course:', error);
            throw error;
        }
    }, [mutate]);

    const deleteCourse = useCallback(async (courseId: number) => {
        try {
            const result = await CourseService.deleteCourse(courseId);

            if (result?.success) {
                // Optimistic update: remove from local cache
                await mutate(
                    (currentData) => {
                        if (!currentData) return currentData;
                        return {
                            ...currentData,
                            items: currentData.items.filter(course => course.id !== courseId),
                            total: currentData.totalPage - 1,
                        };
                    },
                    {revalidate: true}
                );
            }

            return result;
        } catch (error) {
            console.error('Failed to delete course:', error);
            throw error;
        }
    }, [mutate]);

    return {
        courses: data?.items ?? [], // Adjust based on your actual API wrap (ApiResponse vs PageResponse)
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPage ?? 0,
        currentPage: data?.pageNumber ?? opts.pageNumber,
        isLoading,
        isValidating,
        isError: !!error,
        error,
        createCourse,
        updateCourse,
        deleteCourse,
        mutate,
        refresh: () => mutate(),
    };
}

/**
 * Hook for fetching teacher's own courses
 */
export function useMyCourses() {
    const { data, error, isLoading, mutate } = useSWR<CourseResponse[]>(
        Constants.COURSES_ROUTES.MY_COURSES,
        swrFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    return {
        courses: data ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
        refresh: () => mutate(),
    };
}