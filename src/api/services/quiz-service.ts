import {
    QuizCreationRequest,
    QuizUpdateRequest,
    QuestionRequest,
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
    ImportQuizResponse,
    PaginatedResponse,
    QuestionResponse
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

    /**
     * Search quizzes with role-based filtering
     * - STUDENT: auto-filtered by enrolled courses and active quizzes only
     * - TEACHER/ADMIN: can filter by all criteria including status
     */
    searchQuizzes: async (params: {
        courseId?: number;
        title?: string;
        quizType?: string;
        isActive?: boolean;
        startDate?: string;
        endDate?: string;
        page?: number;
        size?: number;
    }) => {
        const queryParams = new URLSearchParams();
        if (params.courseId) queryParams.append('courseId', params.courseId.toString());
        if (params.title) queryParams.append('title', params.title);
        if (params.quizType) queryParams.append('quizType', params.quizType);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());

        return await apiCall<PaginatedResponse<QuizResponse>>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.SEARCH}?${queryParams.toString()}`)
        );
    },

    // ==================== Question Management ====================

    addQuestion: async (quizId: number, payload: QuestionRequest) => {
        return await apiCall<QuestionResponse>(() => 
            axiosInstance.post(`${Constants.QUIZ_ROUTES.ADD_QUESTION}/${quizId}/questions`, payload)
        );
    },

    updateQuestion: async (quizId: number, questionId: number, payload: QuestionUpdateRequest) => {
        return await apiCall<QuestionResponse>(() => 
            axiosInstance.put(`${Constants.QUIZ_ROUTES.UPDATE_QUESTION}/${quizId}/questions/${questionId}`, payload)
        );
    },

    deleteQuestion: async (quizId: number, questionId: number) => {
        return await apiCall<void>(() => 
            axiosInstance.delete(`${Constants.QUIZ_ROUTES.DELETE_QUESTION}/${quizId}/questions/${questionId}`)
        );
    },

    reorderQuestions: async (quizId: number, payload: UpdateQuestionOrderRequest) => {
        return await apiCall<void>(() => 
            axiosInstance.patch(`${Constants.QUIZ_ROUTES.REORDER_QUESTIONS}/${quizId}/questions/reorder`, payload)
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
            axiosInstance.post(`${Constants.QUIZ_ROUTES.SAVE_PROGRESS}/${attemptId}/save-progress`, payload)
        );
    },

    submitQuiz: async (payload: SubmitQuizRequest) => {
        return await apiCall<QuizSubmitResultResponse>(() => 
            axiosInstance.post(`${Constants.QUIZ_ROUTES.SUBMIT}/submit`, payload)
        );
    },

    getAttemptHistory: async (quizId?: number) => {
        if (!quizId) return Promise.resolve(null); 

        const url = `${Constants.QUIZ_ROUTES.MY_ATTEMPTS}/${quizId}/history`;

        return await apiCall<QuizAttemptResponse[]>(() => 
            axiosInstance.get(url)
        );
    },

    getAttemptDetail: async (attemptId: number) => {
        return await apiCall<QuizAttemptDetailResponse>(() => 
            axiosInstance.get(`${Constants.QUIZ_ROUTES.ATTEMPT_DETAIL}/${attemptId}/detail`)
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