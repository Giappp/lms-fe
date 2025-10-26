/*
* All the api request model goes here
*/

import {CourseStatus, Difficulty, LessonType} from "@/types/enum";

export type CoursesFilterParams = {
    keyword?: string;
    courseStatus?: string;
    difficulty?: string;
    teacherId?: number;
    categoryId?: number;
    pageNumber?: number;
    pageSize?: number;
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
    instructorId: number;
    instructorName: string;
    categoryId: number[];
    status: CourseStatus
    thumbnail: string;
    duration: string;
    rating: number;
}

export type Chapter = {
    title: string;
    courseId: number;
}

export type Lesson = {
    title: string;
    type: LessonType;
    content: string;
    description: string;
    duration: number;
    videoUrl: string;
    pdfUrl: string;
    chapterId: number;
}