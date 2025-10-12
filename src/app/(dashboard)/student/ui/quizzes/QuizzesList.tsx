import React from 'react'
import {useQuizzes} from "@/hooks/useQuizzes";
import {Quiz} from "@/types";
import QuizCard from "@/app/(dashboard)/student/ui/quizzes/QuizCard";

const QuizzesList = () => {

    const {quizzes, isError, isLoading} = useQuizzes();

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-6">
                Failed to load quizzes.
            </div>
        );
    }
    return (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {quizzes.length > 0 ? (
                quizzes.map((item: Quiz) => <QuizCard key={item.id} {...item} />)
            ) : (
                <div className="col-span-full text-center text-gray-500">
                    No Quizzes found
                </div>
            )}
        </div>
    )
}
export default QuizzesList
