import Axios, {InternalAxiosRequestConfig} from "axios";
import {Constants} from "@/constants";

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