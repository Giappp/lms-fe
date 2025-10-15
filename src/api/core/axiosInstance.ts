import Axios, { InternalAxiosRequestConfig } from "axios";
import { Constants } from "@/constants";

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
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
        const token = typeof window !== 'undefined'
            ? localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
            : null;
        
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject immediately
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = typeof window !== 'undefined'
                ? localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
                : null;

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            // Call refresh endpoint
            const refreshResponse = await Axios.post(
                `${Constants.BACKEND_URL}${Constants.AUTH_ROUTES.REFRESH}`,
                { refreshToken },
                { withCredentials: true }
            );

            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

            // Store new tokens
            if (typeof window !== 'undefined') {
                localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                if (newRefreshToken) {
                    localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                }
            }

            // Update default headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Process queued requests
            processQueue(null, accessToken);
            isRefreshing = false;

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Token refresh failed - clear storage and redirect
            processQueue(refreshError as Error, null);
            isRefreshing = false;

            if (typeof window !== 'undefined') {
                localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
                
                // Only redirect if not already on auth pages
                if (!window.location.pathname.includes('/signin') && 
                    !window.location.pathname.includes('/signup')) {
                    window.location.href = '/signin/student';
                }
            }

            return Promise.reject(refreshError);
        }
    }
);