import {apiCall, ApiResult} from "@/api/core/apiCall";
import {axiosInstance} from "@/api/core/axiosInstance";
import {ApiError} from "@/api/core/ApiError";

export async function swrFetcher<T>(url: string): Promise<T> {
    const result: ApiResult<T> = await apiCall<T>(() => axiosInstance.get(url));

    if (!result.success) {
        // SWR treats thrown errors as failed requests → triggers error state
        const errorInfo = result.errors;
        throw new ApiError(
            'An error occurred while fetching the data.',
            errorInfo,
            result.status || 500
        );
    }

    return result.data as T;
}
