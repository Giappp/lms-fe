import {QuizCreationRequest, QuizResponse} from "@/types";
import {apiCall} from "@/api/core/apiCall";
import {axiosInstance} from "@/api/core/axiosInstance";
import {Constants} from "@/constants";

export const QuizService = {
    saveQuiz: async (quizPayload: QuizCreationRequest) => {
        return await apiCall<QuizResponse>(() => axiosInstance.post(`${Constants.QUIZ_ROUTES.CREATE}`, quizPayload));
    }
}