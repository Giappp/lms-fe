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
