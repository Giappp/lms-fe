import { 
    EnrollmentPreviewResponse, 
    EnrollmentResponse, 
    PaginatedResponse,
    CourseResponse,
    UserResponse
} from "@/types/response";
import { EnrollmentStatus, CourseStatus, Difficulty } from "@/types/enum";

// Mock Courses
export const mockCourses: CourseResponse[] = [
    {
        id: 1,
        title: "React Fundamentals",
        description: "Learn the basics of React including components, props, state, and hooks",
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
        teacherName: "John Doe",
        teacherId: 101,
        difficulty: Difficulty.BEGINNER,
        price: 49.99,
        status: CourseStatus.PUBLISHED,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        enrolledCount: 156
    },
    {
        id: 2,
        title: "Advanced TypeScript",
        description: "Master TypeScript with advanced types, generics, decorators, and more",
        thumbnailUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
        teacherName: "Jane Smith",
        teacherId: 101,
        difficulty: Difficulty.ADVANCED,
        price: 79.99,
        status: CourseStatus.PUBLISHED,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-15"),
        enrolledCount: 89
    },
    {
        id: 3,
        title: "Node.js Backend Development",
        description: "Build scalable backend applications with Node.js, Express, and MongoDB",
        thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
        teacherName: "Mike Johnson",
        teacherId: 101,
        difficulty: Difficulty.INTERMEDIATE,
        price: 59.99,
        status: CourseStatus.PUBLISHED,
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-10"),
        enrolledCount: 124
    },
    {
        id: 4,
        title: "Database Design",
        description: "Learn database design principles, SQL, and NoSQL databases",
        thumbnailUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
        teacherName: "Sarah Williams",
        teacherId: 101,
        difficulty: Difficulty.INTERMEDIATE,
        price: 54.99,
        status: CourseStatus.PUBLISHED,
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2024-04-05"),
        enrolledCount: 98
    },
    {
        id: 5,
        title: "Web Security",
        description: "Understand web security fundamentals, authentication, and best practices",
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
        teacherName: "David Brown",
        teacherId: 101,
        difficulty: Difficulty.ADVANCED,
        price: 69.99,
        status: CourseStatus.PUBLISHED,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-05"),
        enrolledCount: 67
    }
];

// Mock Students
export const mockStudents: UserResponse[] = [
    {
        id: 1,
        email: "alice.johnson@example.com",
        enable: true,
        fullName: "Alice Johnson",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        isVerified: true
    },
    {
        id: 2,
        email: "bob.smith@example.com",
        enable: true,
        fullName: "Bob Smith",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        isVerified: true
    },
    {
        id: 3,
        email: "charlie.brown@example.com",
        enable: true,
        fullName: "Charlie Brown",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
        isVerified: true
    },
    {
        id: 4,
        email: "diana.prince@example.com",
        enable: true,
        fullName: "Diana Prince",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
        isVerified: true
    },
    {
        id: 5,
        email: "edward.norton@example.com",
        enable: true,
        fullName: "Edward Norton",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Edward",
        isVerified: true
    },
    {
        id: 6,
        email: "fiona.gallagher@example.com",
        enable: true,
        fullName: "Fiona Gallagher",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
        isVerified: true
    },
    {
        id: 7,
        email: "george.wilson@example.com",
        enable: true,
        fullName: "George Wilson",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=George",
        isVerified: true
    },
    {
        id: 8,
        email: "hannah.montana@example.com",
        enable: true,
        fullName: "Hannah Montana",
        role: "STUDENT",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah",
        isVerified: true
    }
];

// Mock Student Enrollments
export const mockStudentEnrollments: PaginatedResponse<EnrollmentPreviewResponse> = {
    content: [
        {
            id: 1,
            status: "APPROVED",
            createdAt: "2024-11-01T10:00:00Z",
            updatedAt: "2024-11-02T14:30:00Z",
            course: mockCourses[0]
        },
        {
            id: 2,
            status: "PENDING",
            createdAt: "2024-11-10T15:20:00Z",
            updatedAt: "2024-11-10T15:20:00Z",
            course: mockCourses[1]
        },
        {
            id: 3,
            status: "APPROVED",
            createdAt: "2024-10-15T09:00:00Z",
            updatedAt: "2024-10-16T11:00:00Z",
            course: mockCourses[2]
        },
        {
            id: 4,
            status: "REJECTED",
            createdAt: "2024-10-20T14:30:00Z",
            updatedAt: "2024-10-21T10:00:00Z",
            course: mockCourses[3]
        },
        {
            id: 5,
            status: "PENDING",
            createdAt: "2024-11-15T16:00:00Z",
            updatedAt: "2024-11-15T16:00:00Z",
            course: mockCourses[4]
        },
        {
            id: 6,
            status: "APPROVED",
            createdAt: "2024-09-01T08:00:00Z",
            updatedAt: "2024-09-02T09:00:00Z",
            course: mockCourses[0]
        }
    ],
    pageable: {
        pageNumber: 0,
        pageSize: 12,
        sort: {
            sorted: true,
            unsorted: false,
            empty: false
        },
        offset: 0,
        paged: true,
        unpaged: false
    },
    totalPages: 1,
    totalElements: 6,
    last: true,
    first: true,
    size: 12,
    number: 0,
    sort: {
        sorted: true,
        unsorted: false,
        empty: false
    },
    numberOfElements: 6,
    empty: false
};

// Mock Teacher Course Enrollments
export const mockTeacherEnrollments: PaginatedResponse<EnrollmentResponse> = {
    content: [
        {
            id: 11,
            status: "PENDING",
            createdAt: "2024-11-16T10:30:00Z",
            updatedAt: "2024-11-16T10:30:00Z",
            course: mockCourses[0],
            student: mockStudents[0]
        },
        {
            id: 12,
            status: "PENDING",
            createdAt: "2024-11-16T14:20:00Z",
            updatedAt: "2024-11-16T14:20:00Z",
            course: mockCourses[0],
            student: mockStudents[1]
        },
        {
            id: 13,
            status: "PENDING",
            createdAt: "2024-11-17T09:15:00Z",
            updatedAt: "2024-11-17T09:15:00Z",
            course: mockCourses[0],
            student: mockStudents[2]
        },
        {
            id: 14,
            status: "APPROVED",
            createdAt: "2024-11-10T11:00:00Z",
            updatedAt: "2024-11-11T10:00:00Z",
            course: mockCourses[0],
            student: mockStudents[3]
        },
        {
            id: 15,
            status: "APPROVED",
            createdAt: "2024-11-08T15:30:00Z",
            updatedAt: "2024-11-09T09:00:00Z",
            course: mockCourses[0],
            student: mockStudents[4]
        },
        {
            id: 16,
            status: "APPROVED",
            createdAt: "2024-11-05T08:00:00Z",
            updatedAt: "2024-11-06T14:00:00Z",
            course: mockCourses[0],
            student: mockStudents[5]
        },
        {
            id: 17,
            status: "REJECTED",
            createdAt: "2024-11-01T16:00:00Z",
            updatedAt: "2024-11-02T10:00:00Z",
            course: mockCourses[0],
            student: mockStudents[6]
        },
        {
            id: 18,
            status: "APPROVED",
            createdAt: "2024-10-28T12:00:00Z",
            updatedAt: "2024-10-29T11:00:00Z",
            course: mockCourses[0],
            student: mockStudents[7]
        }
    ],
    pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
            sorted: true,
            unsorted: false,
            empty: false
        },
        offset: 0,
        paged: true,
        unpaged: false
    },
    totalPages: 1,
    totalElements: 8,
    last: true,
    first: true,
    size: 10,
    number: 0,
    sort: {
        sorted: true,
        unsorted: false,
        empty: false
    },
    numberOfElements: 8,
    empty: false
};
