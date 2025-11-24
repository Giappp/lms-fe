export enum CourseStatus {PUBLISHED = "PUBLISHED", DRAFT = "DRAFT"}

export enum Difficulty {BEGINNER = "BEGINNER", INTERMEDIATE = "INTERMEDIATE", ADVANCED = "ADVANCED"}

export enum LessonType { VIDEO = "VIDEO", YOUTUBE = "YOUTUBE", MARKDOWN = "MARKDOWN"}

export enum QuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    TRUE_FALSE = 'TRUE_FALSE',
    SHORT_ANSWER = 'SHORT_ANSWER',
    SINGLE_CHOICE = 'SINGLE_CHOICE'
}

export enum QuizType {
    LESSON_QUIZ = "LESSON_QUIZ",
    COURSE_QUIZ = "COURSE_QUIZ"
}

export type ScoringMethod = 'HIGHEST' | 'AVERAGE' | 'LATEST' | 'FIRST';

export enum AttemptStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    COMPLETED = "COMPLETED",
    EXPIRED = "EXPIRED"
}

export enum EnrollmentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}