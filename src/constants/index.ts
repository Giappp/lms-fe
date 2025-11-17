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
        COURSE_ENROLLMENTS: "/api/enrollments/course",
        UPDATE_STATUS: "/api/enrollments",
        CANCEL: "/api/enrollments"
    };

    static readonly COURSES_ROUTES = {
        LIST: "/api/courses/search",
        TOP_RATED: "/api/courses/top-rated",
        MY_COURSES: "/api/courses/my-courses",
        DETAIL: "/api/courses",
        CREATE: "/api/courses",
        UPDATE: "/api/courses",
        DELETE: "/api/courses"
    };

    static readonly QUIZ_ROUTES = {
        LIST: "/api/quizzes",
        DETAIL: "/api/quizzes",
        CREATE: "/api/quizzes",
        UPDATE: "/api/quizzes",
        DELETE: "/api/quizzes",
        BY_COURSE: "/api/quizzes/course",
        BY_LESSON: "/api/quizzes/lesson",
        
        // Question management
        ADD_QUESTION: "/api/quizzes/questions",
        UPDATE_QUESTION: "/api/quizzes/questions",
        DELETE_QUESTION: "/api/quizzes/questions",
        REORDER_QUESTIONS: "/api/quizzes/questions/reorder",
        
        // Student actions
        START: "/api/quiz-attempts/start",
        SAVE_PROGRESS: "/api/quiz-attempts/save-progress",
        SUBMIT: "/api/quiz-attempts/submit",
        MY_ATTEMPTS: "/api/quiz-attempts/my-attempts",
        ATTEMPT_DETAIL: "/api/quiz-attempts",
        
        // Statistics & Analytics
        ANALYTICS: "/api/quizzes/analytics",
        COURSE_STATISTICS: "/api/quizzes/statistics/course",
        STUDENT_HISTORY: "/api/quiz-attempts/student/history",
        
        // Import/Export
        IMPORT: "/api/quizzes/import",
        EXPORT: "/api/quizzes/export"
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
