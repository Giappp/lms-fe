import useSWR from 'swr';
import {swrFetcher} from "@/lib/swrFetcher";
import {UpcomingDeadlineDTO} from "@/components/student/dashboard/UpcomingDeadline";
import {useAuth} from "@/hooks/useAuth";

export const useUpcomingDeadlines = () => {
    const {user} = useAuth();

    const ENDPOINT = user?.id
        ? `/api/v1/dashboard/deadlines/${user.id}`
        : null;

    const {data, error, isLoading, mutate} = useSWR<UpcomingDeadlineDTO[]>(
        ENDPOINT,
        swrFetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 300000,
        }
    );

    return {
        deadlines: data || [],
        isLoading,
        isError: !!error,
        refresh: mutate
    };
};