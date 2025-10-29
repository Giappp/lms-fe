import {CoursesFilterParams, CoursesPage} from "@/types";
import useSWR, {mutate} from "swr";
import {buildParamsFromOptions} from "@/api/core/utils";
import {axiosInstance} from "@/api/core/axiosInstance";
import axios from "axios";
import {Constants} from "@/constants";

const fetcher = async (url: string) => {
    try {
        const res = await axiosInstance.get(url).then(res => res.data);
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const errorMessage = err.response?.data?.message ?? "Unknown error";
            console.log(errorMessage);
        }
        throw new Error("Failed to fetch courses");
    }
};

export const useCourses = (filters: CoursesFilterParams) => {
    const queryString = buildParamsFromOptions(filters);
    console.log(queryString);
    const {
        data,
        isLoading
    } = useSWR<CoursesPage | null>(`${Constants.COURSES_ROUTES.LIST}?${queryString}`, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        fallbackData: {courses: [], total: 0, currentPage: 1, totalPages: 1}
    })

    const refreshCourses = async () => {
        await mutate(`/courses?${queryString}`)
    }

    return {
        courses: data?.courses || [],
        totalPages: data?.totalPages || 1,
        isLoading,
        refreshCourses
    }
}