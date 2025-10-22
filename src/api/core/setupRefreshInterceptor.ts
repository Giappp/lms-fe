import Axios from "axios";
import {Constants} from "@/constants";
import {axiosInstance} from "@/api/core/axiosInstance";

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

export const setupRefreshInterceptor = (mutateUser: () => void) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status !== 401 || originalRequest._retry) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            isRefreshing = true;

            try {
                const refreshToken =
                    typeof window !== "undefined"
                        ? sessionStorage.getItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
                        : null;

                if (!refreshToken) throw new Error("No refresh token available");

                const refreshResponse = await Axios.post(
                    `${Constants.BACKEND_URL}${Constants.AUTH_ROUTES.REFRESH}`,
                    {refreshToken},
                    {withCredentials: true}
                );

                const {accessToken, refreshToken: newRefreshToken} = refreshResponse.data;

                if (typeof window !== "undefined") {
                    sessionStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                    if (newRefreshToken) {
                        sessionStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                    }
                }

                axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                mutateUser(); // ✅ SWR re-fetches /me
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                if (typeof window !== "undefined") {
                    sessionStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
                    sessionStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

                    if (
                        !window.location.pathname.includes("/signin") &&
                        !window.location.pathname.includes("/signup")
                    ) {
                        window.location.href = "/signin";
                    }
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
};
