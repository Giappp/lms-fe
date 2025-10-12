import {axios} from "@/api/core/axios";
import useSWR, {mutate} from "swr";

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    console.log(res);
    return res.data;
};

export const useQuizzes = () => {
    const {data, error, isLoading} = useSWR<any, any, any>('/quizzes', fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
    });

    const refreshQuizzes = async () => {
        await mutate(`/quizzes`)
    }

    return {
        quizzes: data || [],
        isLoading,
        isError: !!error,
        refreshQuizzes
    }
}