import {Constants} from "@/constants";
import {AuthResponse, UserResponse} from "@/types/response";
import {axiosInstance} from "@/api/core/axiosInstance";
import {SignInData, SignUpData} from "@/types";


export const AuthService = {
    signIn: async (data: SignInData): Promise<AuthResponse> => {
        const response = await axiosInstance.post(Constants.AUTH_ROUTES.SIGN_IN, data);
        return response.data;
    },

    signUp: async (data: SignUpData): Promise<AuthResponse> => {
        const response = await axiosInstance.post(Constants.AUTH_ROUTES.SIGN_UP, data);
        return response.data;
    },

    verifyToken: async (token: string): Promise<UserResponse> => {
        const response = await axiosInstance.get(Constants.AUTH_ROUTES.VERIFY_EMAIL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await axiosInstance.post(Constants.AUTH_ROUTES.REFRESH, {
            refreshToken,
        });
        return response.data;
    },

    logout: async (refreshToken: string): Promise<void> => {
        await axiosInstance.post(Constants.AUTH_ROUTES.LOGOUT, {
            refreshToken,
        });
    },

    oauthSignIn: async (provider: "google" | "github", role: "STUDENT" | "TEACHER") => {
        const providerRoute = provider === "google"
            ? Constants.AUTH_ROUTES.OAUTH.GOOGLE
            : Constants.AUTH_ROUTES.OAUTH.GITHUB;
        window.location.href = `${providerRoute}?role=${role}`;
    },
};