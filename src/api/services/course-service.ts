import {
    CourseResponse,
    PublishResponse,
    TableOfContentsResponse,
    PaginatedResponse,
    LessonResponse
} from "@/types/response";
import {
    CourseCreationRequest,
    CourseUpdateRequest,
    CourseWithContentRequest,
    ReorderTableOfContentsRequest,
    CoursesFilterParams
} from "@/types/request";
import {axiosInstance} from "@/api/core/axiosInstance";
import {buildParamsFromOptions} from "@/api/core/utils";
import {apiCall} from "@/api/core/apiCall";
import {Constants} from "@/constants";

export const CourseService = {
    // Search courses with filters and pagination
    searchCourses: async (options: CoursesFilterParams) => {
        const params = buildParamsFromOptions(options);
        return await apiCall<PaginatedResponse<CourseResponse>>(() =>
            axiosInstance.get(`${Constants.COURSES_ROUTES.SEARCH}`, {params})
        );
    },

    // Get my courses (teacher's courses or student's enrolled courses)
    getMyCourses: async (pageNumber: number = 1, pageSize: number = 20) => {
        return await apiCall<PaginatedResponse<CourseResponse>>(() =>
            axiosInstance.get(`${Constants.COURSES_ROUTES.MY_COURSES}`, {
                params: {pageNumber, pageSize}
            })
        );
    },

    // Create course with basic info
    createCourse: async (request: CourseCreationRequest, thumbnail?: File) => {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }
        return await apiCall<CourseResponse>(() =>
            axiosInstance.post(`${Constants.COURSES_ROUTES.CREATE}`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },

    // Create course with complete content (chapters and lessons)
    createCourseWithContent: async (request: CourseWithContentRequest, thumbnail?: File) => {
        const formData = new FormData();
        formData.append('course', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }
        return await apiCall<TableOfContentsResponse>(() =>
            axiosInstance.post(`${Constants.COURSES_ROUTES.CREATE_WITH_CONTENT}`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },

    // Update course basic info
    updateCourse: async (courseId: number, request: CourseUpdateRequest, thumbnail?: File) => {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }
        return await apiCall<CourseResponse>(() =>
            axiosInstance.put(`${Constants.COURSES_ROUTES.UPDATE}/${courseId}`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },

    // Delete course
    deleteCourse: async (courseId: number) => {
        return await apiCall<void>(() =>
            axiosInstance.delete(`${Constants.COURSES_ROUTES.DELETE}/${courseId}`)
        );
    },

    // Reorder table of contents (chapters and lessons)
    reorderTableOfContents: async (courseId: number, request: ReorderTableOfContentsRequest) => {
        return await apiCall<void>(() =>
            axiosInstance.put(`/api/courses/${courseId}/reorder-toc`, request)
        );
    },

    // Get course table of contents
    getTableOfContents: async (courseId: number) => {
        return await apiCall<TableOfContentsResponse>(() =>
            axiosInstance.get(`/api/courses/${courseId}/navigation/table-of-contents`)
        );
    },

    // Get next lesson in course
    getNextLesson: async (courseId: number, lessonId: number) => {
        return await apiCall<LessonResponse | null>(() =>
            axiosInstance.get(`/api/courses/${courseId}/navigation/lessons/${lessonId}/next`)
        );
    },

    // Get previous lesson in course
    getPreviousLesson: async (courseId: number, lessonId: number) => {
        return await apiCall<LessonResponse | null>(() =>
            axiosInstance.get(`/api/courses/${courseId}/navigation/lessons/${lessonId}/previous`)
        );
    }
};
