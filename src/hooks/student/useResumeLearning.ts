import useSWR from 'swr';
import {ResumeLearningDTO} from '@/components/student/dashboard/ContinueLearning';
import {swrFetcher} from "@/lib/swrFetcher";

export const useResumeLearning = (studentId: number | undefined) => {
    const RESUME_LEARNING_ENDPOINT = studentId ? `/api/v1/dashboard/resume-learning/${studentId}` : null;
    const {data, error, isLoading, mutate} = useSWR<ResumeLearningDTO[], any>(
        RESUME_LEARNING_ENDPOINT,
        swrFetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    return {
        courses: data || [],
        isLoading,
        isError: !!error,
        error,
        refresh: mutate,
    };
};