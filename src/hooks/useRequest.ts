import useSWR from "swr";
import {ApiError} from "@/api/core/ApiError";
import {swrFetcher} from "@/lib/swrFetcher";

export function useRequest<Data = any, ErrorType = ApiError>(url: string | null) {
    const {data, error, isLoading, isValidating, mutate} = useSWR<Data, ErrorType>(url, swrFetcher<Data>, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false, // Prevent automatic retries
    });

    const isError = !isLoading && !!error;

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        isError
    };
}