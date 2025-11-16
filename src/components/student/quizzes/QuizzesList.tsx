import React from 'react'
import {useQuizzes} from "@/hooks/useQuizzes";
import QuizCard from "@/components/student/quizzes/QuizCard";

interface QuizzesListProps {
    searchTerm: string;
    dateFilter: string;
    statusFilter: string;
}

const QuizzesList = ({searchTerm, dateFilter, statusFilter}: QuizzesListProps) => {
    const {quizzes, isError, isLoading, filteredCount, totalQuizzes} = useQuizzes({
        searchTerm,
        dateFilter,
        statusFilter
    });

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-6">
                Failed to load quizzes.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center text-muted-foreground py-12">
                Loading quizzes...
            </div>
        );
    }

    return (
        <>
            {filteredCount < totalQuizzes && (
                <p className="text-sm text-muted-foreground mb-4">
                    Showing {filteredCount} of {totalQuizzes} quizzes
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <QuizCard key={quiz.id} {...quiz} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        No quizzes found matching your criteria
                    </div>
                )}
            </div>
        </>
    )
}
export default QuizzesList
