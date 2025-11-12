import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig,} from "axios";
import {Constants} from "@/constants";
import {RefreshTokenRequest} from "@/types";

// ----------------------------
// Type Declarations
// ----------------------------
export interface ApiResponse<T> {
    data?: T;
    message?: string;
    errorCode?: number;
    errors?: Record<string, string>;
    status: "SUCCESS" | "ERROR";
}

interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
}

// ----------------------------
// Token Refresh Queue
// ----------------------------
let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
};

// ----------------------------
// Axios Instance
// ----------------------------
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: Constants.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// ----------------------------
// Request Interceptor
// ----------------------------
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
});

// ----------------------------
// Response Interceptor
// ----------------------------
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        // Normalize backend responses
        if (response.data?.status === "ERROR") {
            return Promise.reject({
                message: response.data.message || "Unknown error",
                errorCode: response.data.errorCode,
                errors: response.data.errors,
            });
        }
        return response;
    },
    async (error: AxiosError<ApiResponse<any>>) => {
        const originalRequest: any = error.config;

        // Ignore if already retried or not unauthorized
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(normalizeAxiosError(error));
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            // Wait until refresh is done
            return new Promise((resolve, reject) => {
                failedQueue.push({resolve, reject});
            }).then((token) => {
                if (token && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return axiosInstance(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) throw new Error("No refresh token available");

            const refreshRequest: RefreshTokenRequest = {refreshToken};

            const refreshResponse = await axios.post<ApiResponse<TokenResponse>>(
                `${Constants.BACKEND_URL}${Constants.AUTH_ROUTES.REFRESH}`,
                refreshRequest,
                {withCredentials: true}
            );

            const tokens = refreshResponse.data.data;
            if (!tokens) throw new Error("Invalid token response");

            const {accessToken, refreshToken: newRefreshToken} = tokens;

            // ✅ Update local storage
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            if (newRefreshToken) {
                localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            }

            // ✅ Update axios default headers
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            processQueue(null, accessToken);
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            // Global logout event for frontend
            window.dispatchEvent(new Event("auth:logout"));
            return Promise.reject(normalizeAxiosError(refreshError));
        } finally {
            isRefreshing = false;
        }
    }
);

// ----------------------------
// Unified Error Normalizer
// ----------------------------
function normalizeAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const apiRes = error.response.data as ApiResponse<any>;
            return {
                message: apiRes?.message || `Server Error (${error.response.status})`,
                status: error.response.status,
                errors: apiRes?.errors,
                errorCode: apiRes?.errorCode,
            };
        } else if (error.request) {
            return {message: "Network error — please check your connection."};
        }
    }
    return {message: error?.message || "Unexpected error occurred"};
}
