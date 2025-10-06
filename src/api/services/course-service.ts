import {CoursesFilterParams} from "@/types";
import {axios} from "@/api/core/axios";
import {buildParamsFromOptions} from "@/api/core/utils";

export const CourseService = {
    getCourses: async (options: CoursesFilterParams): Promise<any> => {
        const params = buildParamsFromOptions(options);
        const response = await axios.get(`/courses`, {params: params});
        console.log(response);
        return response.data;
    }
}