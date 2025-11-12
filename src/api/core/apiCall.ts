export interface ApiResponse<T> {
    data?: T;
    message?: string;
    errorCode?: number;
    errors?: Record<string, string>;
    status: "SUCCESS" | "ERROR";
}

export interface ApiResult<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string>;
    errorCode?: number;
    status?: number; // HTTP status code
}

/**
 * A unified API call helper that unwraps ApiResponse<T> automatically
 * and ensures consistent error handling.
 */
export async function apiCall<T>(
    request: () => Promise<any>
): Promise<ApiResult<T>> {
    try {
        const res = await request();
        const apiRes = res.data as ApiResponse<T>;

        if (apiRes.status === "ERROR") {
            return {
                success: false,
                message: apiRes.message,
                errorCode: apiRes.errorCode,
                errors: apiRes.errors,
            };
        }

        return {
            success: true,
            data: apiRes.data,
            message: apiRes.message,
        };
    } catch (err: any) {
        const normalizedError = normalizeError(err);
        return {
            success: false,
            message: normalizedError.message,
            errors: normalizedError.errors,
            errorCode: normalizedError.errorCode,
            status: normalizedError.status,
        };
    }
}

function normalizeError(error: any) {
    if (error.response) {
        const res = error.response.data as ApiResponse<any>;
        return {
            message: res?.message || `Server Error (${error.response.status})`,
            errors: res?.errors,
            errorCode: res?.errorCode,
            status: error.response.status,
        };
    } else if (error.request) {
        return {message: "Network error — please check your connection."};
    } else {
        return {message: error.message || "Unexpected error occurred"};
    }
}
