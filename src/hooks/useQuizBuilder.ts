import {useCallback, useState} from 'react';
import {QuestionRequest, QuizCreationRequest} from "@/types";
import {QuestionType, QuizType, ScoringMethod} from "@/types/enum";
import {toast} from "sonner";
import {QuizService} from "@/api/services/quiz-service";

const QUESTION_TEMPLATES: Record<QuestionType, Partial<QuestionRequest>> = {
    [QuestionType.MULTIPLE_CHOICE]: {
        answers: [
            {answerText: '', isCorrect: false, orderIndex: 0},
            {answerText: '', isCorrect: false, orderIndex: 1},
            {answerText: '', isCorrect: false, orderIndex: 2},
            {answerText: '', isCorrect: false, orderIndex: 3}
        ]
    },
    [QuestionType.TRUE_FALSE]: {
        answers: [
            {answerText: 'True', isCorrect: false, orderIndex: 0},
            {answerText: 'False', isCorrect: false, orderIndex: 1}
        ]
    },
    [QuestionType.SINGLE_CHOICE]: {
        answers: Array.from({length: 4}, (_, i) => ({
            answerText: '',
            isCorrect: false,
            orderIndex: i
        }))
    }
};

export const useQuizBuilder = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [quiz, setQuiz] = useState<Partial<QuizCreationRequest>>({
        title: '',
        description: '',
        type: QuizType.COURSE_QUIZ,
        timeLimitMinutes: 60,
        maxAttempts: 3,
        passingPercentage: 70,
        scoringMethod: ScoringMethod.HIGHEST,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showResults: true,
        showCorrectAnswers: true,
    });

    const [questions, setQuestions] = useState<QuestionRequest[]>([
        {
            type: QuestionType.SINGLE_CHOICE,
            questionText: '',
            orderIndex: 0,
            points: 1,
            explanation: '',
            answers: QUESTION_TEMPLATES[QuestionType.SINGLE_CHOICE]?.answers || []
        }
    ]);

    const addQuestion = (type: QuestionType) => {
        const newQuestion: QuestionRequest = {
            type,
            questionText: '',
            orderIndex: questions.length,
            points: 1,
            explanation: '',
            answers: [], // Default
            ...QUESTION_TEMPLATES[type] // Merge specific template
        };
        setQuestions(prev => [...prev, newQuestion]);
    };

    const updateQuestion = useCallback((index: number, updatedQuestion: QuestionRequest) => {
        setQuestions(prev => {
            const newQuestions = [...prev];
            newQuestions[index] = {...updatedQuestion, orderIndex: index};
            return newQuestions;
        });
    }, []);

    const deleteQuestion = useCallback((index: number) => {
        setQuestions(prev => prev
            .filter((_, i) => i !== index)
            .map((q, i) => ({...q, orderIndex: i}))
        );
    }, []);

    const duplicateQuestion = useCallback((index: number) => {
        setQuestions(prev => {
            const duplicated = {...prev[index], orderIndex: prev.length};
            return [...prev, duplicated];
        });
    }, []);

    const validateQuiz = (): boolean => {
        if (!quiz.title) {
            toast.error("Title required", {description: "Please enter a quiz title."});
            return false;
        }
        if (!quiz.courseId) {
            toast.error("Course required", {description: "Please select a course."});
            return false;
        }
        if (questions.length === 0) {
            toast.error("Questions required", {description: "Please add at least one question."});
            return false;
        }

        const invalidQuestions = questions.filter(q => {
            const isTextMissing = !q.questionText.trim();
            // Check answers for types that require them
            const needsAnswers = [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.SINGLE_CHOICE].includes(q.type as QuestionType);
            const hasCorrectAnswer = q.answers.some(a => a.isCorrect);

            return isTextMissing || (needsAnswers && !hasCorrectAnswer);
        });

        if (invalidQuestions.length > 0) {
            toast.error("Incomplete Questions", {
                description: `Please complete question #${invalidQuestions[0].orderIndex + 1} and ensure a correct answer is selected.`
            });
            return false;
        }

        return true;
    };

    const saveQuiz = async () => {
        if (!validateQuiz()) return {success: false, error: 'Validation failed'};

        setIsSaving(true);
        const quizData: QuizCreationRequest = {
            ...(quiz as QuizCreationRequest),
            questions
        };

        const result = await QuizService.createQuiz(quizData);
        setIsSaving(false);

        if (result.success) {
            toast.success("Success", {description: "Quiz saved successfully!"});
        } else {
            toast.error("Error", {description: result.errors?.[0] || "Failed to save quiz."});
        }

        return result;
    };

    const stats = {
        totalQuestions: questions.length,
        totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
        hasErrors: questions.some(q => !q.questionText) // Simple check for UI badge
    };

    return {
        quiz,
        setQuiz,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        saveQuiz,
        isSaving,
        stats
    };
};