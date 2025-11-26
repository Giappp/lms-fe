/*
* All the api response model goes here
*/
import {AttemptStatus, CourseStatus, Difficulty, LessonType, QuestionType, QuizType, ScoringMethod} from "@/types/enum";

export type UserResponse = {
    id: number;
    email: string;
    enable: boolean;
    fullName: string;
    role: "STUDENT" | "TEACHER";
    avatarUrl?: string;
    isVerified?: boolean;
    bio?: string;
    learningGoals?: string;
}

export type FileResponse = {
    id: string;
    name: string;
    contentType: string;
    size: number;
    checksum: string;
    path: string;
    url: string;
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

// ==================== Course Response Types ====================

export interface CategoryResponsePreview {
    id: number;
    name: string;
    icon: string;
    color: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
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
    rating: number;
    status: CourseStatus;
    categories: CategoryResponsePreview[];
    createdAt: Date;
    updatedAt: Date;
    isEnrolled?: boolean;
}

export interface ChapterResponse {
    id: number;
    title: string;
    orderIndex: number;
}

export interface LessonResponse {
    id: number;
    title: string;
    type: LessonType;
    content: string;
    videoUrl: string;
    description: string;
    duration: number;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
    materials?: FileResponse[];
}

export interface ChapterTableOfContents {
    id: number;
    title: string;
    orderIndex: number;
    lessonCount: number;
    totalDuration: number;
    lessons: LessonResponse[];
}

export interface TableOfContentsResponse {
    courseResponse: CourseResponse;
    enrolledCount: number;
    chapters: ChapterTableOfContents[];
}

export interface PublishResponse {
    id: number;
    courseStatus: CourseStatus;
    message: string;
    status: boolean;
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
