/*
* All the api response model goes here
*/
import {CourseStatus, Difficulty, QuestionType, QuizType, ScoringMethod, AttemptStatus} from "@/types/enum";

export type UserResponse = {
    id: number;
    email: string;
    enable: boolean;
    fullName: string;
    role: "STUDENT" | "TEACHER";
    avatar?: string;
    isVerified?: boolean;
}

export type EnrollmentPreviewResponse = {
    id: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    course: CourseResponse;
}

export type EnrollmentResponse = {
    id: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    course: CourseResponse;
    student: UserResponse;
}

export type AuthResponse = {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}

export type Category = {
    name: string;
    description: string;
    icon: string;
    color: string;
}

export type CourseTableContent = {
    course: CourseResponse;
    enrolledCount: number;
}

export type Quiz = {
    id: number
    name: string
    description: string
    instructor: string
    courseName: string
    lessonName: string
    questions: Array<Question>
    status: string
    dueTo: Date
    totalQuestions: number
    difficulty: 'Easy' | 'Medium' | 'Hard'
    timeLimit: number // in minutes
    maxAttempts: number
    attempts: number
    lastScore?: number
    averageScore?: number
    bestScore?: number
}

export type Question = {
    id: number
    type: string
    description: string
    options: string[]
    answer: string[]
}

export interface CourseResponse {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    teacherName: string;
    teacherId: number;
    difficulty: Difficulty;
    price: number;
    status: CourseStatus;
    categories?: Category[];
    createdAt: Date;
    updatedAt: Date;
    enrolledCount: number;
}

// ==================== Quiz Response Types ====================

export interface AnswerResponse {
    id: number;
    answerText: string;
    isCorrect?: boolean; // Only for ADMIN/TEACHER
    orderIndex: number;
}

export interface QuestionResponse {
    id: number;
    type: QuestionType;
    questionText: string;
    orderIndex: number;
    points: number;
    explanation?: string; // Only for ADMIN/TEACHER or after submission
    answers: AnswerResponse[];
}

export interface QuizResponse {
    id: number;
    title: string;
    description: string;
    quizType: QuizType;
    courseId: number;
    lessonId?: number;
    
    startTime?: Date;
    endTime?: Date;
    maxAttempts: number;
    scoringMethod: ScoringMethod;
    passingPercentage: number;
    timeLimitMinutes: number;
    
    isActive: boolean;
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    showResults: boolean;
    showCorrectAnswers: boolean;
    
    questionCount: number;
    totalPoints: number;
    
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizDetailResponse extends QuizResponse {
    courseName: string;
    lessonTitle?: string;
    questions: QuestionResponse[];
}

export interface QuizAttemptResponse {
    id: number;
    quizId: number;
    quizTitle: string;
    studentId: number;
    studentName: string;
    attemptNumber: number;
    
    startedAt: Date;
    submittedAt?: Date;
    completedAt?: Date;
    
    status: AttemptStatus;
    
    score: number;
    percentage: number;
    isPassed: boolean;
    
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    
    timeSpentSeconds: number;
    
    // Review information
    isReviewed: boolean;
    teacherFeedback?: string;
    reviewedBy?: number;
    reviewerName?: string;
}

export interface QuizAttemptDetailResponse {
    id: number;
    quizId: number;
    quizTitle: string;
    studentId: number;
    studentName: string;
    attemptNumber: number;
    
    startedAt: Date;
    submittedAt?: Date;
    completedAt?: Date;
    
    status: AttemptStatus;
    
    score: number;
    percentage: number;
    isPassed: boolean;
    
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    
    timeSpentSeconds: number;
    
    isReviewed: boolean;
    teacherFeedback?: string;
    reviewedBy?: number;
    reviewerName?: string;
    
    answers: QuizAttemptAnswerDetailResponse[];
}

export interface QuizAttemptAnswerDetailResponse {
    id: number;
    questionId: number;
    questionText: string;
    questionType: QuestionType;
    questionPoints: number;
    
    selectedAnswerIds: number[];
    correctAnswerIds: number[];
    
    isCorrect: boolean;
    pointsEarned: number;
    
    answers: AnswerResponse[];
    explanation?: string;
}

export interface StartQuizResponse {
    attemptId: number;
    quizId: number;
    quizTitle: string;
    timeLimitMinutes: number;
    startedAt: Date;
    mustSubmitBefore?: Date;
}

export interface QuizSubmitResultResponse {
    attemptId: number;
    score: number;
    percentage: number;
    isPassed: boolean;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    timeSpentSeconds: number;
    submittedAt: Date;
}

export interface StudentQuizResultResponse {
    quizId: number;
    quizTitle: string;
    attempts: QuizAttemptResponse[];
    bestScore?: number;
    latestScore?: number;
    averageScore?: number;
    finalScore: number; // Based on scoring method
    isPassed: boolean;
}

export interface StudentQuizHistoryResponse {
    studentId: number;
    studentName: string;
    quizzes: StudentQuizResultResponse[];
}

export interface QuizAnalyticsResponse {
    quizId: number;
    quizTitle: string;
    
    totalAttempts: number;
    totalStudents: number;
    completedAttempts: number;
    inProgressAttempts: number;
    
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    passRate: number;
    
    averageTimeSpentMinutes: number;
    
    questionAnalytics: QuestionAnalyticsItem[];
}

export interface QuestionAnalyticsItem {
    questionId: number;
    questionText: string;
    totalAttempts: number;
    correctAttempts: number;
    correctPercentage: number;
    averageTimeSeconds: number;
}

export interface CourseQuizStatisticsResponse {
    courseId: number;
    courseTitle: string;
    totalQuizzes: number;
    totalAttempts: number;
    averagePassRate: number;
    quizStatistics: QuizAnalyticsResponse[];
}

export interface ImportQuizResponse {
    quizId: number;
    questionsImported: number;
    errors: string[];
}
export type PaginatedResponse<T> = {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}

export type ParticipantInfo = {
    userId: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
}

export type MessageResponse = {
    id: string;
    conversationId: string;
    me: boolean;
    message: string;
    sender: ParticipantInfo;
    status: "SENT" | "DELIVERED" | "READ";
    createdDate: string;
}

export type ConversationType = "DIRECT" | "GROUP";

export type ConversationResponse = {
    id: string;
    type: ConversationType;
    participantsHash: string;
    conversationAvatar?: string;
    conversationName: string;
    participants: ParticipantInfo[];
    createdDate: string;
    modifiedDate: string;
}
