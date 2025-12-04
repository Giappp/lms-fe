/*
* All the api request model goes here
*/

import {CourseStatus, Difficulty, LessonType, QuestionType, QuizType, ScoringMethod} from "@/types/enum";

export type SendMessageRequest = {
    conversationId: string;
    message: string;
}

export type CreateConversationRequest = {
    type: "DIRECT" | "GROUP";
    participantIds: number[];
}

export type EnrollmentRequest = {
    courseId: number;
    studentId: number;
}

export type UpdateEnrollmentStatusRequest = {
    status: "APPROVED" | "REJECTED";
    reason?: string;
}

export type CoursesFilterParams = {
    keyword?: string;
    status?: CourseStatus;
    difficulty?: Difficulty;
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

export type UpdateProfileRequest = {
    id: number;
    firstName: string;
    lastName: string;
    bio?: string;
    learningGoals?: string;
    dateOfBirth?: Date;
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

// ==================== Course Request Types ====================

export interface CourseCreationRequest {
    title: string;
    description: string;
    difficulty: Difficulty;
    price: number;
    teacherId: number;
    teacherName: string;
    status: CourseStatus;
    categoryIds?: number[];
}

export interface CourseUpdateRequest {
    title: string;
    description: string;
    difficulty: Difficulty;
    price: number;
    status: CourseStatus;
    categoryIds?: number[];
}

export interface CategoryRequest {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive?: boolean;
}

export interface ChapterRequest {
    title: string;
    courseId: number;
}

export interface LessonRequest {
    id?: number;
    title: string;
    type: LessonType;
    content?: string;
    description: string;
    duration: number;
    videoUrl?: string;
    orderIndex?: number;
}

export interface DeleteChapterRequest {
    chapterId: number;
    courseId: number;
}

export interface DeleteLessonRequest {
    lessonId: number;
    chapterId: number;
}

export interface ReorderTableOfContentsRequest {
    chapters: ChapterOrder[];
}

export interface ChapterOrder {
    chapterId: number;
    orderIndex: number;
    lessons?: LessonOrder[];
}

export interface LessonOrder {
    lessonId: number;
    orderIndex: number;
}

export interface ChapterWithLessonsRequest {
    title: string;
    orderIndex?: number;
    lessons?: LessonRequest[];
}

export interface CourseWithContentRequest {
    course: CourseCreationRequest;
    chapters?: ChapterWithLessonsRequest[];
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
    selectedAnswerId: number;
}

export interface AnswerProgress {
    questionId: number;
    selectedAnswerId: number | null; // Single answer ID - for multiple choice, send multiple AnswerProgress entries
}

export interface SaveProgressRequest {
    answers: AnswerProgress[];
}

export interface SubmitQuizRequest {
    attemptId: number;
    answers: QuizAttemptAnswerRequest[];
}

export interface ReviewQuizAttemptRequest {
    teacherFeedback?: string;
}

export interface ImportQuizRequest {
    quizId: number;
    file: File;
}