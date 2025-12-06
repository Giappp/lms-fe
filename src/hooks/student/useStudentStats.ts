import useSWR from "swr";
import {StudentDashboardStats} from "@/types";
import {swrFetcher} from "@/lib/swrFetcher";

export const useStudentStats = (studentId: number | undefined) => {
    const key = studentId ? `/api/v1/dashboard/stats/${studentId}` : null;
    const {data, error, isLoading, mutate} = useSWR<StudentDashboardStats>(key, swrFetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: true,
        errorRetryCount: 2,
        dedupingInterval: 2000,
    });
    return {
        stats: data,
        isStatsLoading: isLoading,
        isStatsError: error,
        refreshStats: mutate, // Expose mutate to allow manual reload
    };
};