import {CourseResponse, CoursesFilterParams} from "@/types";
import useSWR, {mutate} from "swr";
import {buildParamsFromOptions} from "@/api/core/utils";
import {axios} from "@/api/core/axios";

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export const useCourses = (filters: CoursesFilterParams) => {
    const queryString = buildParamsFromOptions(filters);
    const {data, error, isLoading} = useSWR<CourseResponse, any, any>(`/courses?${queryString}`, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
    })

    const refreshCourses = async () => {
        await mutate(`/courses?${queryString}`)
    }

    return {
        courses: data?.courses || [],
        totalPages: data?.totalPages || 1,
        isLoading,
        isError: !!error,
        refreshCourses
    }
}