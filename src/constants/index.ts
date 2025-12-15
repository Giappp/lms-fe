export class Constants {
    static readonly BACKEND_URL = 'http://localhost:8081';
    static readonly SOCKET_URL = "http://localhost:9092";

    static readonly ROLES = {
        STUDENT: "STUDENT",
        TEACHER: "TEACHER"
    };

    static readonly AUTH_ROUTES = {
        SIGN_IN: "/api/auth/signIn",
        SIGN_UP: "/api/auth/signUp",
        REFRESH: "/api/auth/refresh",
        LOGOUT: "/api/auth/logout",
        VERIFY_EMAIL: "/api/auth/verify-email",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
        CHANGE_PASSWORD: "/api/auth/change-password",
        OAUTH: {
            GOOGLE: "/api/auth/google",
            GITHUB: "/api/auth/github"
        }
    };

    static readonly ENROLLMENT_ROUTES = {
        REQUEST: "/api/enrollments",
        MY_ENROLLMENTS: "/api/enrollments/student",
        COURSE_ENROLLMENTS: "/api/enrollments",
        UPDATE_STATUS: "/api/enrollments",
        CANCEL: "/api/enrollments"
    };

    static readonly USER_ROUTES = {
        PROFILE: "/api/users/profile",
        UPDATE_PROFILE: "/api/users/profile"
    };

    static readonly FILE_ROUTES = {
        UPLOAD_AVATAR: "/api/file/avatar",
        DELETE_AVATAR: "/api/file/avatar",
        DOWNLOAD_AVATAR: "/api/file/avatar/download",
        PRESIGNED_URL: "/api/file/presigned-url"
    };

    static readonly CATEGORY_ROUTES = {
        GET_ALL: "/api/categories",
        CREATE: "/api/categories",
        GET_BY_ID: "/api/categories",
        UPDATE: "/api/categories",
        DELETE: "/api/categories",
        SEARCH: "/api/categories/search"
    };

    static readonly COURSES_ROUTES = {
        // Course management
        SEARCH: "/api/courses/search",
        MY_COURSES: "/api/courses/my-courses",
        MY_COURSES_DROPDOWN: "/api/courses/my-courses-dropdown",
        CREATE: "/api/courses",
        CREATE_WITH_CONTENT: "/api/courses/with-content",
        UPDATE: "/api/courses",
        DELETE: "/api/courses",
        DETAIL: "/api/course",
        REORDER_TOC: "/api/courses", // /{courseId}/reorder-toc
        
        // Navigation
        NAVIGATION: "/api/courses", // /{courseId}/navigation
        TABLE_OF_CONTENTS: "/api/courses", // /{courseId}/navigation/table-of-contents
        NEXT_LESSON: "/api/courses", // /{courseId}/navigation/lessons/{lessonId}/next
        PREVIOUS_LESSON: "/api/courses", // /{courseId}/navigation/lessons/{lessonId}/previous
    };

    static readonly CHAPTERS_ROUTES = {
        CREATE: "/api/chapters",
        UPDATE: "/api/chapters",
        DELETE: "/api/chapters/delete"
    };

    static readonly LESSONS_ROUTES = {
        CREATE: "/api/lessons", // /{chapterId}
        UPDATE: "/api/lessons",
        DELETE: "/api/lessons/delete",
        UPLOAD_MATERIAL: "/api/lessons", // /{lessonId}/materials
        GET_MATERIALS: "/api/lessons", // /{lessonId}/materials
        DELETE_MATERIAL: "/api/lessons", // /{lessonId}/materials/{fileId}
        DOWNLOAD_MATERIAL: "/api/lessons", // /{lessonId}/materials/{fileId}/download
        DELETE_VIDEO: "/api/lessons", // /{lessonId}/video
    };

    static readonly CATEGORIES_ROUTES = {
        LIST: "/api/categories",
        CREATE: "/api/categories",
        UPDATE: "/api/categories",
        DELETE: "/api/categories"
    };

    static readonly QUIZ_ROUTES = {
        LIST: "/api/quizzes",
        DETAIL: "/api/quizzes",
        CREATE: "/api/quizzes",
        UPDATE: "/api/quizzes",
        DELETE: "/api/quizzes",
        BY_COURSE: "/api/quizzes/course",
        BY_LESSON: "/api/quizzes/lesson",
        SEARCH: "/api/quizzes/search",
        
        // Question management
        ADD_QUESTION: "/api/quizzes",
        UPDATE_QUESTION: "/api/quizzes",
        DELETE_QUESTION: "/api/quizzes",
        REORDER_QUESTIONS: "/api/quizzes",
        
        // Quiz attempts
        START_QUIZ: "/api/quiz-attempts/quiz",
        SAVE_PROGRESS: "/api/quiz-attempts",
        SUBMIT: "/api/quiz-attempts",
        MY_ATTEMPTS: "/api/quiz-attempts/quiz",
        ATTEMPT_DETAIL: "/api/quiz-attempts",
        REVIEW_ATTEMPT: "/api/quiz-attempts",
        
        // Statistics & Analytics
        ANALYTICS: "/api/quizzes",
        COURSE_STATISTICS: "/api/quiz-statistics/course",
        STUDENT_RESULTS: "/api/quiz-statistics/course",
        STUDENT_HISTORY: "/api/quiz-statistics/student",
        
        // Import/Export
        IMPORT_EXCEL: "/api/quizzes/import",
        EXPORT_EXCEL: "/api/quizzes"
    };

    static readonly CONVERSATIONS_ROUTES = {
        MY_CONVERSATIONS: "/api/conversations/my-conversations",
        CREATE: "/api/conversations",
        SEARCH: "/api/conversations/search"
    };

    static readonly MESSAGES_ROUTES = {
        GET_MESSAGES: "/api/messages",
        SEND_MESSAGE: "/api/messages",
        LAST_MESSAGE: "/api/messages/last",
        SEARCH_MESSAGES: "/api/messages/search",
        MARK_AS_READ: "/api/messages/read"
    };

    static readonly WEBSOCKET_ROUTES = {
        ONLINE_STATUS: "/api/websocket/users"
    };

    static readonly APP_ROUTES = {
        STUDENT: {
            DASHBOARD: "/student/dashboard",
            COURSES: "/student/my-courses",
            QUIZZES: "/student/quizzes"
        },
        TEACHER: {
            DASHBOARD: "/teacher/dashboard",
            COURSES: "/teacher/my-courses",
            QUIZZES: "/teacher/quizzes"
        },
        AUTH: {
            SIGN_IN: {
                STUDENT: "/signin/student",
                TEACHER: "/signin/teacher"
            },
            SIGN_UP: {
                STUDENT: "/signup/student",
                TEACHER: "/signup/teacher"
            }
        }
    };

    static readonly LOCAL_STORAGE_KEYS = {
        ACCESS_TOKEN: "accessToken",
        REFRESH_TOKEN: "refreshToken"
    };
}
