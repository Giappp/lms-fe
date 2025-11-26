import {CourseResponse, CoursesFilterParams, PublishResponse} from "@/types";
import {axiosInstance} from "@/api/core/axiosInstance";
import {buildParamsFromOptions} from "@/api/core/utils";
import {apiCall} from "@/api/core/apiCall";
import {Constants} from "@/constants";
import {ChapterWithLessons} from "@/types/types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CourseService = {
    getCourses: async (options: CoursesFilterParams) => {
        const params = buildParamsFromOptions(options);
        await sleep(3000);
        const response = await axiosInstance.get(`/courses`, {params: params});
        return response.data;
    },
    // fetch single course detail
    getCourseById: async (courseId: number) => {
        return await apiCall<CourseResponse>(() =>
            axiosInstance.get(`${Constants.COURSES_ROUTES.DETAIL}/${courseId}/details`)
        );
    },
    // Create course API wrapper
    createCourseWithBasicInfo: async (courseData: FormData) => {
        return await apiCall<CourseResponse>(() =>
            axiosInstance.post(Constants.COURSES_ROUTES.CREATE, courseData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },
    updateCourseBasicInfo: async (courseId: number, courseData: FormData) => {
        return await apiCall<CourseResponse>(() =>
            axiosInstance.put(`${Constants.COURSES_ROUTES.UPDATE}/${courseId}`, courseData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        )
    },

    saveCurriculum: async (courseId: number, curriculumPayload: any) => {
        return await apiCall<ChapterWithLessons[]>(() =>
            axiosInstance.put(`${Constants.COURSES_ROUTES.UPDATE}/${courseId}/curriculum`, curriculumPayload)
        );
    },

    publishCourse: async (courseId: number) => {
        return await apiCall<PublishResponse>(() => axiosInstance.put(`${Constants.COURSES_ROUTES.PUBLISHED}/${courseId}`));
    },

    getChaptersWithLessons: async (courseId: number) => {
        return await apiCall<ChapterWithLessons[]>(() => axiosInstance.get(`${Constants.COURSES_ROUTES.DETAIL}/${courseId}/details`));
    },
    deleteCourse: async (courseId: number) => {
        return await apiCall(() => axiosInstance.delete(`${Constants.COURSES_ROUTES.DELETE}/${courseId}`));
    },
    getMyCourses: async () => {
        return await apiCall<CourseResponse[]>(() =>
            axiosInstance.get(Constants.COURSES_ROUTES.MY_COURSES)
        );
    }
};
