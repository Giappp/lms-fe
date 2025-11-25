export class ApiError extends Error {
    info: any;
    status: number;

    constructor(message: string, info: any, status: number) {
        super(message);
        this.info = info;
        this.status = status;
    }
}

export const fetcher = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({}));
        throw new ApiError(
            'An error occurred while fetching the data.',
            errorInfo,
            res.status
        );
    }

    return res.json();
};