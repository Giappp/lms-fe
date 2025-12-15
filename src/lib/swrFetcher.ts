import {ApiResponse} from "@/api/core/apiCall";
import {axiosInstance} from "@/api/core/axiosInstance";
import {ApiError} from "@/api/core/ApiError";

export async function swrFetcher<T>(url: string): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url);

    if (response.data.status === "ERROR") {
        throw new ApiError(
            response.data.message || "API Logic Error",
            response.data.errors,
            response.data.errorCode || 500
        );
    }

    return response.data.data as T;
}
