import {apiCall, ApiResult} from "@/api/core/apiCall";
import {axiosInstance} from "@/api/core/axiosInstance";

export async function swrFetcher<T>(url: string): Promise<T> {
    const result: ApiResult<T> = await apiCall<T>(() => axiosInstance.get(url));

    if (!result.success) {
        // SWR treats thrown errors as failed requests → triggers error state
        const err = new Error(result.message);
        (err as any).details = result;
        throw err;
    }

    return result.data as T;
}
