import { axios } from "@/api/core/axios";
import useSWR, { mutate } from "swr";
import { Quiz } from "@/types";
import { isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';

interface QuizzesFilters {
    searchTerm?: string;
    dateFilter?: string;
    statusFilter?: string;
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export const useQuizzes = (filters?: QuizzesFilters) => {
    const { data, error, isLoading } = useSWR<Quiz[]>('/quizzes', fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
    });

    const filterQuizzes = (quizzes: Quiz[]): Quiz[] => {
        if (!filters) return quizzes;
        
        const { searchTerm, dateFilter, statusFilter } = filters;
        
        return quizzes.filter(quiz => {
            // Search filter
            const matchesSearch = !searchTerm ? true : (
                quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Status filter
            const matchesStatus = !statusFilter || statusFilter === 'all' ? true : 
                statusFilter === quiz.status.toLowerCase();

            // Date filter
            let matchesDate = true;
            if (dateFilter && dateFilter !== 'all') {
                const dueDate = new Date(quiz.dueTo);
                
                switch (dateFilter) {
                    case 'today':
                        matchesDate = isToday(dueDate);
                        break;
                    case 'tomorrow':
                        matchesDate = isTomorrow(dueDate);
                        break;
                    case 'thisWeek':
                        matchesDate = isThisWeek(dueDate);
                        break;
                    case 'thisMonth':
                        matchesDate = isThisMonth(dueDate);
                        break;
                }
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    };

    const refreshQuizzes = async () => {
        await mutate('/quizzes');
    };

    const filteredQuizzes = data ? filterQuizzes(data) : [];

    return {
        quizzes: filteredQuizzes,
        totalQuizzes: data?.length || 0,
        filteredCount: filteredQuizzes.length,
        isLoading,
        isError: !!error,
        refreshQuizzes
    };
};