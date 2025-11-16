"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/shared/quiz/QuestionCard";
import { QuizTimer } from "@/components/shared/quiz/QuizTimer";
import { QuizProgress } from "@/components/shared/quiz/QuizProgress";
import { QuizResultCard } from "@/components/shared/quiz/QuizResultCard";
import { QuizDetailResponse, QuizSubmitResultResponse } from "@/types/response";
import { QuestionType, QuizType } from "@/types/enum";
import { ChevronLeft, ChevronRight, Save, Send, AlertTriangle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock quiz data
const mockQuiz: QuizDetailResponse = {
    id: 1,
    title: "Introduction to React Hooks",
    description: "Test your knowledge of React Hooks",
    quizType: QuizType.LESSON_QUIZ,
    courseId: 1,
    lessonId: 5,
    maxAttempts: 3,
    scoringMethod: "HIGHEST" as any,
    passingPercentage: 70,
    timeLimitMinutes: 30,
    isActive: true,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showResults: true,
    showCorrectAnswers: true,
    questionCount: 3,
    totalPoints: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
        {
            id: 1,
            type: QuestionType.SINGLE_CHOICE,
            questionText: "What is the purpose of useState hook in React?",
            orderIndex: 1,
            points: 10,
            explanation: "useState is a Hook that lets you add React state to function components.",
            answers: [
                { id: 1, answerText: "To add state management to functional components", isCorrect: true, orderIndex: 1 },
                { id: 2, answerText: "To handle side effects", isCorrect: false, orderIndex: 2 },
                { id: 3, answerText: "To create context providers", isCorrect: false, orderIndex: 3 },
                { id: 4, answerText: "To optimize performance", isCorrect: false, orderIndex: 4 }
            ]
        },
        {
            id: 2,
            type: QuestionType.SINGLE_CHOICE,
            questionText: "When does useEffect run by default?",
            orderIndex: 2,
            points: 10,
            explanation: "By default, useEffect runs after every render, including the first render.",
            answers: [
                { id: 5, answerText: "Only on component mount", isCorrect: false, orderIndex: 1 },
                { id: 6, answerText: "After every render", isCorrect: true, orderIndex: 2 },
                { id: 7, answerText: "Only when dependencies change", isCorrect: false, orderIndex: 3 },
                { id: 8, answerText: "Before every render", isCorrect: false, orderIndex: 4 }
            ]
        },
        {
            id: 3,
            type: QuestionType.SINGLE_CHOICE,
            questionText: "What does the dependency array in useEffect control?",
            orderIndex: 3,
            points: 10,
            explanation: "The dependency array determines when the effect should re-run based on value changes.",
            answers: [
                { id: 9, answerText: "When the effect should re-run", isCorrect: true, orderIndex: 1 },
                { id: 10, answerText: "Which props to pass down", isCorrect: false, orderIndex: 2 },
                { id: 11, answerText: "The render order", isCorrect: false, orderIndex: 3 },
                { id: 12, answerText: "The cleanup function", isCorrect: false, orderIndex: 4 }
            ]
        }
    ]
};

export default function TakeQuizPage() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<QuizSubmitResultResponse | null>(null);
    const [startedAt] = useState(new Date());

    const currentQuestion = mockQuiz.questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;

    const handleAnswerChange = (questionId: number, answerIds: number[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIds
        }));
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < mockQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleQuestionNavigation = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSaveProgress = () => {
        console.log("Progress saved:", answers);
        // TODO: Call API to save progress
    };

    const handleSubmit = () => {
        // Mock result calculation
        const correctAnswers = mockQuiz.questions.filter((q, idx) => {
            const userAnswer = answers[q.id];
            const correctAnswer = q.answers.find(a => a.isCorrect)?.id;
            return userAnswer && userAnswer[0] === correctAnswer;
        }).length;

        const mockResult: QuizSubmitResultResponse = {
            attemptId: 1,
            score: correctAnswers * 10,
            percentage: (correctAnswers / mockQuiz.questions.length) * 100,
            isPassed: (correctAnswers / mockQuiz.questions.length) * 100 >= mockQuiz.passingPercentage,
            totalQuestions: mockQuiz.questions.length,
            correctAnswers,
            incorrectAnswers: mockQuiz.questions.length - correctAnswers,
            unansweredQuestions: mockQuiz.questions.length - Object.keys(answers).length,
            timeSpentSeconds: Math.floor((new Date().getTime() - startedAt.getTime()) / 1000),
            submittedAt: new Date()
        };

        setResult(mockResult);
        setIsSubmitted(true);
        setShowSubmitDialog(false);
    };

    const handleTimeUp = () => {
        handleSubmit();
    };

    if (isSubmitted && result) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <QuizResultCard
                    result={result}
                    passingPercentage={mockQuiz.passingPercentage}
                    onViewDetails={() => router.push(`/student/quizzes/${mockQuiz.id}/attempt/${result.attemptId}`)}
                    onRetake={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{mockQuiz.title}</h1>
                <p className="text-muted-foreground">{mockQuiz.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Question Card */}
                    <QuestionCard
                        question={currentQuestion}
                        questionNumber={currentQuestionIndex + 1}
                        selectedAnswerIds={answers[currentQuestion.id] || []}
                        onAnswerChange={(answerIds) => handleAnswerChange(currentQuestion.id, answerIds)}
                        showCorrectAnswer={false}
                        showResult={false}
                        readOnly={false}
                    />

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleSaveProgress}
                                className="gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Save Progress
                            </Button>

                            {currentQuestionIndex === mockQuiz.questions.length - 1 ? (
                                <Button
                                    onClick={() => setShowSubmitDialog(true)}
                                    className="gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button onClick={handleNext} className="gap-2">
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <QuizTimer
                        timeLimitMinutes={mockQuiz.timeLimitMinutes}
                        startedAt={startedAt}
                        onTimeUp={handleTimeUp}
                    />
                    <QuizProgress
                        totalQuestions={mockQuiz.questions.length}
                        answeredQuestions={answeredCount}
                        currentQuestionIndex={currentQuestionIndex}
                        onQuestionClick={handleQuestionNavigation}
                    />
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Submit Quiz?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You have answered {answeredCount} out of {mockQuiz.questions.length} questions.
                            {answeredCount < mockQuiz.questions.length && (
                                <span className="block mt-2 text-orange-600 font-medium">
                                    Warning: You have {mockQuiz.questions.length - answeredCount} unanswered question(s).
                                </span>
                            )}
                            <span className="block mt-2">
                                Once submitted, you cannot change your answers. Are you sure you want to continue?
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Submit Quiz
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
