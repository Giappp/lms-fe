export class Constants {
    static readonly BACKEND_URL = 'http://localhost:8081';

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
        DETAIL: "/api/courses/:id",
        CREATE: "/api/courses",
        UPDATE: "/api/courses/:id",
        DELETE: "/api/courses/:id"
    };

    static readonly APP_ROUTES = {
        STUDENT: {
            DASHBOARD: "/student/dashboard",
            COURSES: "/student/courses",
            QUIZZES: "/student/quizzes"
        },
        TEACHER: {
            DASHBOARD: "/teacher/dashboard",
            COURSES: "/teacher/courses",
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
