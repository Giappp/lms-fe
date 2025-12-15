import React from 'react'
import QuizCard from "@/components/student/quizzes/QuizCard";
import {Quiz} from "@/types/response";

interface QuizzesListProps {
    quizzes: Quiz[];
    isLoading: boolean;
    isError: boolean;
}

const QuizzesList = ({quizzes, isLoading, isError}: QuizzesListProps) => {
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
    )
}
export default QuizzesList
