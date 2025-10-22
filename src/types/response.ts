/*
* All the api response model goes here
*/
export type UserResponse = {
    id: number;
    email: string;
    enable: boolean;
    fullName: string;
    role: "STUDENT" | "TEACHER";
    avatar?: string;
}

export type AuthResponse = {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}

export type CourseResponse = {
    courses: Array<Course>;
    total: number;
    currentPage: number;
    totalPages: number;
}

export type Course = {
    id: number
    thumbnail: string
    title: string
    description: string
    category: string[]
    instructor: string
    duration: string
    difficulty: string
    price: number
    rating: number
    status: string
    reviews: number
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