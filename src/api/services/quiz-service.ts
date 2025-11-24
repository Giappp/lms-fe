import {
    QuizCreationRequest,
    QuizUpdateRequest,
    QuestionUpdateRequest,
    UpdateQuestionOrderRequest,
    SubmitQuizRequest,
    SaveProgressRequest,
    ReviewQuizAttemptRequest
} from "@/types/request";
import {
    QuizResponse,
    QuizDetailResponse,
    QuizAttemptResponse,
    QuizAttemptDetailResponse,
    StartQuizResponse,
    QuizSubmitResultResponse,
    StudentQuizHistoryResponse,
    QuizAnalyticsResponse,
    CourseQuizStatisticsResponse,
    StudentQuizResultResponse,
    ImportQuizResponse
} from "@/types/response";
import {apiCall} from "@/api/core/apiCall";
import {axiosInstance} from "@/api/core/axiosInstance";
import {Constants} from "@/constants";

export const QuizService = {
    // ==================== Quiz CRUD ====================
    
    createQuiz: async (quizPayload: QuizCreationRequest) => {
        return await apiCall<QuizResponse>(() => 
            axiosInstance.post(Constants.QUIZ_ROUTES.CREATE, quizPayload)
        );
    },

    getQuizById: async (quizId: number) => {
        return await apiCall<QuizDetailResponse>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.DETAIL}/${quizId}`)
        );
    },

    updateQuiz: async (quizId: number, payload: QuizUpdateRequest) => {
        return await apiCall<QuizResponse>(() => 
            axiosInstance.put(`${Constants.QUIZ_ROUTES.UPDATE}/${quizId}`, payload)
        );
    },

    deleteQuiz: async (quizId: number) => {
        return await apiCall<void>(() => 
            axiosInstance.delete(`${Constants.QUIZ_ROUTES.DELETE}/${quizId}`)
        );
    },

    getQuizzesByCourse: async (courseId: number) => {
        return await apiCall<QuizResponse[]>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.BY_COURSE}/${courseId}`)
        );
    },

    getQuizzesByLesson: async (lessonId: number) => {
        return await apiCall<QuizResponse[]>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.BY_LESSON}/${lessonId}`)
        );
    },

    searchQuizzes: async (params: {
        keyword?: string;
        courseId?: number;
        quizType?: string;
        isActive?: boolean;
        page?: number;
        size?: number;
    }) => {
        const queryParams = new URLSearchParams();
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.courseId) queryParams.append('courseId', params.courseId.toString());
        if (params.quizType) queryParams.append('quizType', params.quizType);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());

        return await apiCall<QuizResponse[]>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.SEARCH}?${queryParams.toString()}`)
        );
    },

    // ==================== Question Management ====================

    updateQuestion: async (quizId: number, questionId: number, payload: QuestionUpdateRequest) => {
        return await apiCall<void>(() => 
            axiosInstance.put(`${Constants.QUIZ_ROUTES.UPDATE_QUESTION}/${quizId}/${questionId}`, payload)
        );
    },

    deleteQuestion: async (quizId: number, questionId: number) => {
        return await apiCall<void>(() => 
            axiosInstance.delete(`${Constants.QUIZ_ROUTES.DELETE_QUESTION}/${quizId}/${questionId}`)
        );
    },

    reorderQuestions: async (quizId: number, payload: UpdateQuestionOrderRequest) => {
        return await apiCall<void>(() => 
            axiosInstance.put(`${Constants.QUIZ_ROUTES.REORDER_QUESTIONS}/${quizId}`, payload)
        );
    },

    // ==================== Quiz Attempts (Student) ====================

    startQuiz: async (quizId: number) => {
        return await apiCall<StartQuizResponse>(() => 
            axiosInstance.post(`${Constants.QUIZ_ROUTES.START_QUIZ}/${quizId}/start`)
        );
    },

    saveProgress: async (attemptId: number, payload: SaveProgressRequest) => {
        return await apiCall<void>(() => 
            axiosInstance.put(`${Constants.QUIZ_ROUTES.SAVE_PROGRESS}/${attemptId}/save-progress`, payload)
        );
    },

    submitQuiz: async (attemptId: number, payload: SubmitQuizRequest) => {
        return await apiCall<QuizSubmitResultResponse>(() => 
            axiosInstance.post(`${Constants.QUIZ_ROUTES.SUBMIT}/${attemptId}/submit`, payload)
        );
    },

    getMyAttempts: async (quizId?: number) => {
        const url = quizId 
            ? `${Constants.QUIZ_ROUTES.MY_ATTEMPTS}?quizId=${quizId}`
            : Constants.QUIZ_ROUTES.MY_ATTEMPTS;
        
        return await apiCall<QuizAttemptResponse[]>(() => 
            axiosInstance.get(url)
        );
    },

    getAttemptDetail: async (attemptId: number) => {
        return await apiCall<QuizAttemptDetailResponse>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.ATTEMPT_DETAIL}/${attemptId}`)
        );
    },

    // ==================== Statistics & Analytics (Teacher/Admin) ====================

    getQuizAnalytics: async (quizId: number) => {
        return await apiCall<QuizAnalyticsResponse>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.ANALYTICS}/${quizId}/analytics`)
        );
    },

    getCourseQuizStatistics: async (courseId: number) => {
        return await apiCall<CourseQuizStatisticsResponse>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.COURSE_STATISTICS}/${courseId}/overview`)
        );
    },

    getStudentQuizResults: async (courseId: number, quizId: number) => {
        return await apiCall<StudentQuizResultResponse[]>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.STUDENT_RESULTS}/${courseId}/quiz/${quizId}/students`)
        );
    },

    getStudentQuizHistory: async (courseId: number, studentId: number) => {
        return await apiCall<StudentQuizHistoryResponse>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.STUDENT_HISTORY}/${courseId}/student/${studentId}`)
        );
    },

    reviewAttempt: async (attemptId: number, payload: ReviewQuizAttemptRequest) => {
        return await apiCall<void>(() => 
            axiosInstance.put(`${Constants.QUIZ_ROUTES.REVIEW_ATTEMPT}/${attemptId}/review`, payload)
        );
    },

    // ==================== Import/Export ====================

    importQuizFromExcel: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return await apiCall<ImportQuizResponse>(() => 
            axiosInstance.post(Constants.QUIZ_ROUTES.IMPORT_EXCEL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        );
    },

    exportQuizToExcel: async (quizId: number) => {
        return await apiCall<Blob>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.EXPORT_EXCEL}/${quizId}/export/excel`, {
                responseType: 'blob',
            })
        );
    },
};