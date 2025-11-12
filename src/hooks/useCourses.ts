import useSWR from "swr";
import {Constants} from "@/constants";
import {PaginatedResponse} from "@/types/types";
import {CourseResponse} from "@/types";
import {CourseService} from "@/api/services/course-service";
import {CourseStatus} from "@/types/enum";
import {buildParamsFromOptions} from '@/api/core/utils';

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
    const key = `${Constants.COURSES_ROUTES.LIST}?${queryString}`;

    const {data, error, isLoading, mutate} = useSWR<PaginatedResponse<CourseResponse> | null>(
        key,
        {
            revalidateOnFocus: false,
            fallbackData: {items: [], total: 0, page: opts.page, size: opts.size},
        }
    );

    const createCourse = async (courseData: FormData) => {
        const result = await CourseService.createCourseWithBasicInfo(courseData);
        if ((result as any)?.success) await mutate();
        return result;
    };

    const updateCourse = async (courseId: number, courseData: FormData) => {
        const result = await CourseService.updateCourseBasicInfo(courseId, courseData);
        if ((result as any)?.success) await mutate();
        return result;
    };

    return {
        courses: data?.items ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? opts.page,
        size: data?.size ?? opts.size,
        isLoading,
        isError: !!error,
        createCourse,
        updateCourse,
        mutate,
    };
}