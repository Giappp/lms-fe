import {CoursesFilterParams} from "@/types";
import useSWR, {mutate} from "swr";
import {buildParamsFromOptions} from "@/api/core/utils";
import {axiosInstance} from "@/api/core/axiosInstance";

const fetcher = async (url: string) => {
    const res = await axiosInstance.get(url);
    return res.data;
};

export const useCourses = (filters: CoursesFilterParams) => {
    const queryString = buildParamsFromOptions(filters);
    const {data, error, isLoading} = useSWR<any, any, any>(`/courses?${queryString}`, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        fallbackData: {courses: [], total: 0, currentPage: 1, totalPages: 1}
    })

    const refreshCourses = async () => {
        await mutate(`/courses?${queryString}`)
    }

    return {
        courses: data || [],
        totalPages: data?.totalPages || 1,
        isLoading,
        isError: !!error,
        refreshCourses
    }
}