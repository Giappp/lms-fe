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

    static readonly COURSES_ROUTES = {
        LIST: "/api/courses/search",
        TOP_RATED: "/api/courses/top-rated",
        MY_COURSES: "/api/courses/my-courses",
        DETAIL: "/api/courses",
        CREATE: "/api/courses",
        UPDATE: "/api/courses",
        DELETE: "/api/courses"
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
