/*
* All the api request model goes here
*/

import {CourseStatus, Difficulty, QuestionType, QuizType, ScoringMethod} from "@/types/enum";

export type CoursesFilterParams = {
    keyword?: string;
    courseStatus?: string;
    difficulty?: string;
    teacherId?: number;
    categoryId?: number;
    pageNumber?: number;
    pageSize?: number;
}

export type RefreshTokenRequest = {
    refreshToken: string;
}

export type SignInData = {
    email: string;
    password: string;
    role: string;
}

export type SignUpData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}


export type TeacherSignUp = {
    fullName: string;
    dob: Date;
    email: string;
    password: string;
    confirmPassword: string;
}

export type UserSignIn = {
    email: string;
    password: string;
}

export type CourseCreationRequest = {
    title: string;
    description: string;
    difficulty: Difficulty
    price: number;
    teacherId: number;
    teacherName: string;
    categoryId: number[];
    status: CourseStatus
    thumbnail?: File;
    thumbnailUrl?: string;
}

export type CourseUpdateRequest = {
    title: string;
    description: string;
    difficulty: Difficulty
    price: number;
    status: CourseStatus
    categoryId: number[];
    thumbnail?: File;
}

export type Chapter = {
    title: string;
    courseId: number;
}

// ==================== Quiz Request Types ====================

export interface AnswerRequest {
    answerText: string;
    isCorrect: boolean;
    orderIndex: number;
}

export interface QuestionRequest {
    type: QuestionType;
    questionText: string;
    orderIndex: number;
    points: number;
    explanation?: string;
    answers: AnswerRequest[];
}

export interface QuizCreationRequest {
    title: string;
    description?: string;
    type: QuizType;
    courseId: number;
    lessonId?: number;
    
    startTime?: Date;
    endTime?: Date;
    timeLimitMinutes: number;
    maxAttempts: number; // -1 for unlimited
    passingPercentage: number;
    scoringMethod: ScoringMethod;
    
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    showResults: boolean;
    showCorrectAnswers: boolean;
    
    questions: QuestionRequest[];
}

export interface QuizUpdateRequest {
    title?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    timeLimitMinutes?: number;
    maxAttempts?: number;
    passingPercentage?: number;
    scoringMethod?: ScoringMethod;
    shuffleQuestions?: boolean;
    shuffleAnswers?: boolean;
    showResults?: boolean;
    showCorrectAnswers?: boolean;
    isActive?: boolean;
}

export interface QuestionUpdateRequest {
    type?: QuestionType;
    questionText?: string;
    orderIndex?: number;
    points?: number;
    explanation?: string;
    answers: AnswerRequest[];
}

export interface UpdateQuestionOrderRequest {
    questionOrders: Array<{
        questionId: number;
        orderIndex: number;
    }>;
}

export interface QuizAttemptAnswerRequest {
    questionId: number;
    selectedAnswerIds: number[];
}

export interface SaveProgressRequest {
    answers: QuizAttemptAnswerRequest[];
}

export interface SubmitQuizRequest {
    answers: QuizAttemptAnswerRequest[];
}

export interface ReviewQuizAttemptRequest {
    teacherFeedback?: string;
}

export interface ImportQuizRequest {
    quizId: number;
    file: File;
}