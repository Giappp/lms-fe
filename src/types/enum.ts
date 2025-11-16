export enum CourseStatus {PUBLISHED = "PUBLISHED", DRAFT = "DRAFT"}

export enum Difficulty {BEGINNER = "BEGINNER", INTERMEDIATE = "INTERMEDIATE", ADVANCED = "ADVANCED"}

export enum LessonType { VIDEO = "VIDEO", YOUTUBE = "YOUTUBE", MARKDOWN = "MARKDOWN"}

export enum QuestionType {
    SINGLE_CHOICE = "SINGLE_CHOICE"
}

export enum QuizType {
    LESSON_QUIZ = "LESSON_QUIZ",
    COURSE_QUIZ = "COURSE_QUIZ"
}

export enum ScoringMethod {
    HIGHEST = "HIGHEST",
    LATEST = "LATEST",
    AVERAGE = "AVERAGE"
}

export enum AttemptStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    COMPLETED = "COMPLETED",
    EXPIRED = "EXPIRED"
}