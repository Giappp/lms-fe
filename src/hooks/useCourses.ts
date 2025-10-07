import {CourseResponse, CoursesFilterParams} from "@/types";
import useSWR from "swr";
import {CourseService} from "@/api/services/course-service";


export const useCourses = (filters: CoursesFilterParams) => {
    const key = ['courses', filters];
    const {data, error, isLoading, mutate} = useSWR<CourseResponse, any, any>(key, async () => {
        await CourseService.getCourses(filters);
    })

    return {courses: data?.courses || [], totalPages: data?.totalPages || 1, isLoading, isError: !!error, mutate}
}