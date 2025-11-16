import useSWR from "swr";
import {Constants} from "@/constants";
import {PaginatedResponse} from "@/types/types";
import {CourseResponse} from "@/types";
import {CourseService} from "@/api/services/course-service";
import {CourseStatus} from "@/types/enum";
import {buildParamsFromOptions} from '@/api/core/utils';
import {useCallback} from "react";
import {swrFetcher} from "@/lib/swrFetcher";

export interface CourseFilter {
    page?: number;
    size?: number;
    teacherId?: number;
    status?: CourseStatus;
    q?: string;
}

function toQueryString(paramsObj: Record<string, any> = {}) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(paramsObj)) {
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) {
            v.forEach((item) => qs.append(k, String(item)));
        } else {
            qs.append(k, String(v));
        }
    }
    return qs.toString();
}

export function useCourses(filters?: CourseFilter) {
    const opts = {
        page: filters?.page ?? 1,
        size: filters?.size ?? 20,
        teacherId: filters?.teacherId,
        status: filters?.status,
        q: filters?.q,
    } as any;

    const params = buildParamsFromOptions(opts);
    const queryString = toQueryString(params);
    const key = queryString ? `${Constants.COURSES_ROUTES.LIST}?${queryString}` : Constants.COURSES_ROUTES.LIST;

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
                // Optimistically update the cache
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
                            total: currentData.total - 1,
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
        courses: data?.items ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? opts.page,
        size: data?.size ?? opts.size,
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