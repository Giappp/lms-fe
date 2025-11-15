/*
* All the api request model goes here
*/

export type SendMessageRequest = {
    conversationId: string;
    message: string;
}

export type CreateConversationRequest = {
    type: "DIRECT" | "GROUP";
    participantIds: number[];
}

import {CourseStatus, Difficulty} from "@/types/enum";

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