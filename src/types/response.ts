/*
* All the api response model goes here
*/
import {CourseStatus, Difficulty} from "@/types/enum";

export type UserResponse = {
    id: number;
    email: string;
    enable: boolean;
    fullName: string;
    role: "STUDENT" | "TEACHER";
    avatar?: string;
    isVerified?: boolean;
}

export type AuthResponse = {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}

export type CoursesPage = {
    courses: Array<Course>;
    total: number;
    currentPage: number;
    totalPages: number;
}

export type Course = {
    id: number
    title: string
    description: string
    thumbnail: string
    teacherName: string
    teacherId: number
    difficulty: Difficulty
    price: number
    rating: number
    status: CourseStatus
    category: Category[]
}

export type Category = {
    name: string;
    description: string;
    icon: string;
    color: string;
}

export type CourseTableContent = {
    course: Course;
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