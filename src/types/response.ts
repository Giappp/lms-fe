/*
* All the api response model goes here
*/
export type UserResponse = {
    fullName: string,
    email: string,
    accessToken: string,
    refreshToken: string,
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