import useSWR from "swr";
import {CourseResponse, CourseSelectResponse, PaginatedResponse} from "@/types/response";
import {CourseCreationRequest, CoursesFilterParams, CourseUpdateRequest} from "@/types/request";
import {CourseService} from "@/api/services/course-service";
import {CourseStatus, Difficulty} from "@/types/enum";
import {useCallback} from "react";
import {swrFetcher} from "@/lib/swrFetcher";
import {Constants} from "@/constants";
import {defaultSWRConfig} from "@/lib/swrConfig";

export interface CourseFilter {
    page?: number;
    size?: number;
    teacherId?: number;
    difficulty?: Difficulty | "ALL";
    status?: CourseStatus | "ALL";
    categoryId?: number;
    keyword?: string;
}

// Explicit return type for the hook to ensure type safety in components
interface UseCoursesReturn {
    courses: CourseResponse[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    isValidating: boolean;
    isError: boolean;
    error: any;
    createCourse: (request: CourseCreationRequest, thumbnail?: File) => Promise<any>; // Replace 'any' with actual API response type if available
    updateCourse: (courseId: number, request: CourseUpdateRequest, thumbnail?: File) => Promise<any>;
    deleteCourse: (courseId: number) => Promise<any>;
    mutate: () => Promise<any>;
    refresh: () => Promise<any>;
}

export function useCourses(filters?: CourseFilter): UseCoursesReturn {
    const opts: CoursesFilterParams = {
        pageNumber: (filters?.page ?? 0) + 1, // Convert zero-based to one-based
        pageSize: filters?.size ?? 12,
        teacherId: filters?.teacherId,
        categoryId: filters?.categoryId,
        status: filters?.status === "ALL" ? undefined : filters?.status,
        difficulty: filters?.difficulty === "ALL" ? undefined : filters?.difficulty,
        keyword: filters?.keyword,
    };

    // Convert object to query string (filtering out null/undefined)
    const qs = new URLSearchParams();
    Object.entries(opts).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            qs.append(key, String(value));
        }
    });

    const queryString = qs.toString();
    const key = `${Constants.COURSES_ROUTES.SEARCH}?${queryString}`;

    const {data, error, isLoading, isValidating, mutate} = useSWR<PaginatedResponse<CourseResponse> | null>(
        key,
        swrFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: true,
            errorRetryCount: 3,
            dedupingInterval: 2000,
            keepPreviousData: true,
            suspense: false,
            fallbackData: null
        }
    );

    const createCourse = useCallback(async (request: CourseCreationRequest, thumbnail?: File) => {
        const result = await CourseService.createCourse(request, thumbnail);
        if (result?.success) {
            await mutate();
        }
        return result;
    }, [mutate]);

    const updateCourse = useCallback(async (courseId: number, request: CourseUpdateRequest, thumbnail?: File) => {
        const result = await CourseService.updateCourse(courseId, request, thumbnail);
        if (result?.success) {
            await mutate();
        }
        return result;
    }, [mutate]);

    const deleteCourse = useCallback(async (courseId: number) => {
        const result = await CourseService.deleteCourse(courseId);
        if (result?.success) {
            await mutate();
        }
        return result;
    }, [mutate]);

    return {
        courses: (data as any)?.items ?? data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
        totalPages: (data as any)?.totalPage ?? data?.totalPages ?? 0,
        currentPage: data?.number ?? (filters?.page ?? 0),
        isLoading: isLoading && !data,
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
 * Hook for fetching teacher's own courses or student's enrolled courses
 */
export function useMyCourses(pageNumber: number = 1, pageSize: number = 20) {
    const key = `${Constants.COURSES_ROUTES.MY_COURSES}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    const {data, error, isLoading, mutate} = useSWR<PaginatedResponse<CourseResponse>>(
        key,
        swrFetcher,
        defaultSWRConfig
    );

    return {
        courses: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.number ?? (pageNumber - 1),
        isLoading,
        isError: !!error,
        error,
        mutate,
        refresh: () => mutate(),
    };
}

/**
 * Hook for fetching compact course list for dropdown selection
 */
export function useMyCoursesDropdown() {
    const key = Constants.COURSES_ROUTES.MY_COURSES_DROPDOWN;

    const {data, error, isLoading, mutate} = useSWR<CourseSelectResponse[]>(
        key
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