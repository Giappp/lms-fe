import Axios from "axios";
import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import {Constants} from "@/constants";

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(p => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve(token);
        }
    });
    failedQueue = [];
};

export const axiosInstance = Axios.create({
    baseURL: Constants.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor - attach access token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken && config.headers) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // ❌ Not a 401 or already retried → reject immediately
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // ⏳ If already refreshing → Queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({resolve, reject});
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) throw new Error("No refresh token available");

            const refreshResponse = await axios.post(
                `${Constants.BACKEND_URL}${Constants.AUTH_ROUTES.REFRESH}`,
                {refreshToken},
                {withCredentials: true}
            );

            const {accessToken, refreshToken: newRefreshToken} = refreshResponse.data;

            // ✅ Save new tokens
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            if (newRefreshToken) {
                localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            }

            // ✅ Set new token as default
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // ✅ Retry queued requests now that token is refreshed
            processQueue(null, accessToken);

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

            // Optional: redirect to login on failure
            if (typeof window !== "undefined" && !window.location.pathname.includes("/signin")) {
                window.location.href = "/signin";
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
