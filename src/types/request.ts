/*
* All the api request model goes here
*/

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