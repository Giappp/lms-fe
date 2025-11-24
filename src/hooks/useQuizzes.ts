import useSWR from 'swr';
import {swrFetcher} from '@/lib/swrFetcher';
import {QuizService} from '@/api/services/quiz-service';
import {
    QuizResponse,
    QuizDetailResponse,
    QuizAttemptResponse,
    QuizAttemptDetailResponse,
    StartQuizResponse,
    QuizSubmitResultResponse,
    QuizAnalyticsResponse,
    CourseQuizStatisticsResponse,
    StudentQuizResultResponse,
    StudentQuizHistoryResponse
} from '@/types/response';
import {
    QuizCreationRequest,
    QuizUpdateRequest,
    SubmitQuizRequest,
    SaveProgressRequest,
    ReviewQuizAttemptRequest
} from '@/types/request';
import {Constants} from '@/constants';

// ==================== Quiz CRUD Hooks ====================

export const useQuizzesByCourse = (courseId: number | undefined) => {
    const key = courseId ? `${Constants.QUIZ_ROUTES.BY_COURSE}/${courseId}` : null;
    const {data, error, mutate, isLoading} = useSWR<QuizResponse[] | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    const createQuiz = async (payload: QuizCreationRequest) => {
        const result = await QuizService.createQuiz(payload);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    const updateQuiz = async (quizId: number, payload: QuizUpdateRequest) => {
        const result = await QuizService.updateQuiz(quizId, payload);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    const deleteQuiz = async (quizId: number) => {
        const result = await QuizService.deleteQuiz(quizId);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        quizzes: data || null,
        isLoading,
        error,
        mutate,
        createQuiz,
        updateQuiz,
        deleteQuiz
    };
};

export const useQuizzesByLesson = (lessonId: number | undefined) => {
    const key = lessonId ? `${Constants.QUIZ_ROUTES.BY_LESSON}/${lessonId}` : null;
    const {data, error, mutate, isLoading} = useSWR<QuizResponse[] | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    return {
        quizzes: data || null,
        isLoading,
        error,
        mutate
    };
};

export const useQuizDetail = (quizId: number | undefined) => {
    const key = quizId ? `${Constants.QUIZ_ROUTES.DETAIL}/${quizId}` : null;
    const {data, error, mutate, isLoading} = useSWR<QuizDetailResponse | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    const updateQuiz = async (payload: QuizUpdateRequest) => {
        if (!quizId) return {success: false, error: 'Quiz ID is required'};
        const result = await QuizService.updateQuiz(quizId, payload);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        quiz: data || null,
        isLoading,
        error,
        mutate,
        updateQuiz
    };
};

// ==================== Quiz Attempt Hooks (Student) ====================

export const useMyAttempts = (quizId?: number) => {
    const key = quizId 
        ? `${Constants.QUIZ_ROUTES.MY_ATTEMPTS}?quizId=${quizId}`
        : Constants.QUIZ_ROUTES.MY_ATTEMPTS;
    
    const {data, error, mutate, isLoading} = useSWR<QuizAttemptResponse[] | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    const startQuiz = async (targetQuizId: number) => {
        const result = await QuizService.startQuiz(targetQuizId);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        attempts: data || null,
        isLoading,
        error,
        mutate,
        startQuiz
    };
};

export const useAttemptDetail = (attemptId: number | undefined) => {
    const key = attemptId ? `${Constants.QUIZ_ROUTES.ATTEMPT_DETAIL}/${attemptId}` : null;
    const {data, error, mutate, isLoading} = useSWR<QuizAttemptDetailResponse | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    const saveProgress = async (payload: SaveProgressRequest) => {
        if (!attemptId) return {success: false, error: 'Attempt ID is required'};
        const result = await QuizService.saveProgress(attemptId, payload);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    const submitQuiz = async (payload: SubmitQuizRequest) => {
        if (!attemptId) return {success: false, error: 'Attempt ID is required'};
        const result = await QuizService.submitQuiz(attemptId, payload);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        attempt: data || null,
        isLoading,
        error,
        mutate,
        saveProgress,
        submitQuiz
    };
};

// ==================== Analytics & Statistics Hooks (Teacher/Admin) ====================

export const useQuizAnalytics = (quizId: number | undefined) => {
    const key = quizId ? `${Constants.QUIZ_ROUTES.ANALYTICS}/${quizId}/analytics` : null;
    const {data, error, mutate, isLoading} = useSWR<QuizAnalyticsResponse | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    return {
        analytics: data || null,
        isLoading,
        error,
        mutate
    };
};

export const useCourseQuizStatistics = (courseId: number | undefined) => {
    const key = courseId ? `${Constants.QUIZ_ROUTES.COURSE_STATISTICS}/${courseId}/overview` : null;
    const {data, error, mutate, isLoading} = useSWR<CourseQuizStatisticsResponse | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    return {
        statistics: data || null,
        isLoading,
        error,
        mutate
    };
};

export const useStudentQuizResults = (courseId: number | undefined, quizId: number | undefined) => {
    const key = (courseId && quizId) 
        ? `${Constants.QUIZ_ROUTES.STUDENT_RESULTS}/${courseId}/quiz/${quizId}/students`
        : null;
    
    const {data, error, mutate, isLoading} = useSWR<StudentQuizResultResponse[] | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    return {
        results: data || null,
        isLoading,
        error,
        mutate
    };
};

export const useStudentQuizHistory = (courseId: number | undefined, studentId: number | undefined) => {
    const key = (courseId && studentId)
        ? `${Constants.QUIZ_ROUTES.STUDENT_HISTORY}/${courseId}/student/${studentId}`
        : null;
    
    const {data, error, mutate, isLoading} = useSWR<StudentQuizHistoryResponse | null>(
        key,
        swrFetcher,
        {revalidateOnFocus: false}
    );

    const reviewAttempt = async (attemptId: number, payload: ReviewQuizAttemptRequest) => {
        const result = await QuizService.reviewAttempt(attemptId, payload);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        history: data || null,
        isLoading,
        error,
        mutate,
        reviewAttempt
    };
};