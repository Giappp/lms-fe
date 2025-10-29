import {CoursesFilterParams} from "@/types";
import {axiosInstance} from "@/api/core/axiosInstance";
import {buildParamsFromOptions} from "@/api/core/utils";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CourseService = {
    getCourses: async (options: CoursesFilterParams) => {
        const params = buildParamsFromOptions(options);
        await sleep(3000);
        const response = await axiosInstance.get(`/courses`, {params: params});
        return response.data;
    },
    // Create course API wrapper
    createCourse: async (coursePayload: any) => {
        const response = await axiosInstance.post('/courses', coursePayload);
        return response.data;
    }
};
