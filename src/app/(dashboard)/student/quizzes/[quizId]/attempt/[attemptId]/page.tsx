"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/shared/quiz";
import { QuizAttemptDetailResponse } from "@/types/response";
import { QuestionType, AttemptStatus } from "@/types/enum";
import { Clock, Trophy, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Mock attempt detail
const mockAttemptDetail: QuizAttemptDetailResponse = {
    id: 1,
    quizId: 1,
    quizTitle: "Introduction to React Hooks",
    studentId: 1,
    studentName: "John Doe",
    attemptNumber: 2,
    score: 30,
    percentage: 100,
    isPassed: true,
    status: AttemptStatus.COMPLETED,
    startedAt: new Date("2024-01-21T14:00:00"),
    submittedAt: new Date("2024-01-21T14:28:00"),
    timeSpentSeconds: 1680,
    totalQuestions: 3,
    correctAnswers: 3,
    incorrectAnswers: 0,
    unansweredQuestions: 0,
    isReviewed: true,
    teacherFeedback: "Excellent work! You've demonstrated a strong understanding of React Hooks.",
    answers: [
        {
            id: 1,
            questionId: 1,
            questionText: "What is the purpose of useState hook in React?",
            questionType: QuestionType.SINGLE_CHOICE,
            questionPoints: 10,
            selectedAnswerIds: [1],
            correctAnswerIds: [1],
            isCorrect: true,
            pointsEarned: 10,
            answers: [
                { id: 1, answerText: "To add state management to functional components", isCorrect: true, orderIndex: 1 },
                { id: 2, answerText: "To handle side effects", isCorrect: false, orderIndex: 2 },
                { id: 3, answerText: "To create context providers", isCorrect: false, orderIndex: 3 },
                { id: 4, answerText: "To optimize performance", isCorrect: false, orderIndex: 4 }
            ],
            explanation: "useState is a Hook that lets you add React state to function components."
        },
        {
            id: 2,
            questionId: 2,
            questionText: "When does useEffect run by default?",
            questionType: QuestionType.SINGLE_CHOICE,
            questionPoints: 10,
            selectedAnswerIds: [6],
            correctAnswerIds: [6],
            isCorrect: true,
            pointsEarned: 10,
            answers: [
                { id: 5, answerText: "Only on component mount", isCorrect: false, orderIndex: 1 },
                { id: 6, answerText: "After every render", isCorrect: true, orderIndex: 2 },
                { id: 7, answerText: "Only when dependencies change", isCorrect: false, orderIndex: 3 },
                { id: 8, answerText: "Before every render", isCorrect: false, orderIndex: 4 }
            ],
            explanation: "By default, useEffect runs after every render, including the first render."
        },
        {
            id: 3,
            questionId: 3,
            questionText: "What does the dependency array in useEffect control?",
            questionType: QuestionType.SINGLE_CHOICE,
            questionPoints: 10,
            selectedAnswerIds: [9],
            correctAnswerIds: [9],
            isCorrect: true,
            pointsEarned: 10,
            answers: [
                { id: 9, answerText: "When the effect should re-run", isCorrect: true, orderIndex: 1 },
                { id: 10, answerText: "Which props to pass down", isCorrect: false, orderIndex: 2 },
                { id: 11, answerText: "The render order", isCorrect: false, orderIndex: 3 },
                { id: 12, answerText: "The cleanup function", isCorrect: false, orderIndex: 4 }
            ],
            explanation: "The dependency array determines when the effect should re-run based on value changes."
        }
    ]
};

export default function AttemptDetailPage({ 
    params 
}: { 
    params: { quizId: string; attemptId: string } 
}) {
    const router = useRouter();
    const attempt = mockAttemptDetail;
    const correctCount = attempt.answers.filter(a => a.isCorrect).length;
    const incorrectCount = attempt.answers.filter(a => !a.isCorrect).length;
    const totalQuestions = attempt.answers.length;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push(`/student/quizzes/${params.quizId}`)}
                    className="mb-4"
                >
                    ← Back to Quiz
                </Button>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{attempt.quizTitle}</h1>
                        <p className="text-muted-foreground">
                            Attempt #{attempt.attemptNumber} • Submitted {attempt.submittedAt && formatDistanceToNow(attempt.submittedAt, { addSuffix: true })}
                        </p>
                    </div>
                    {attempt.isPassed ? (
                        <Badge className="bg-green-500 text-white">Passed</Badge>
                    ) : (
                        <Badge className="bg-red-500 text-white">Failed</Badge>
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <Card className="mb-6 border-2">
                <CardHeader>
                    <CardTitle>Your Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">{attempt.percentage.toFixed(1)}%</p>
                            <p className="text-sm text-muted-foreground">Score</p>
                        </div>

                        <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                            <p className="text-sm text-muted-foreground">Correct</p>
                        </div>

                        <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                            <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                            <p className="text-sm text-muted-foreground">Incorrect</p>
                        </div>

                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-2xl font-bold text-blue-600">
                                {Math.floor(attempt.timeSpentSeconds / 60)}m
                            </p>
                            <p className="text-sm text-muted-foreground">Time Spent</p>
                        </div>
                    </div>

                    {attempt.teacherFeedback && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                                        Teacher Feedback
                                    </p>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        {attempt.teacherFeedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Questions Review */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Answer Review</h2>
                {attempt.answers.map((answer, index) => (
                    <QuestionCard
                        key={answer.questionId}
                        question={{
                            id: answer.questionId,
                            type: answer.questionType,
                            questionText: answer.questionText,
                            orderIndex: index + 1,
                            points: answer.questionPoints,
                            explanation: answer.explanation,
                            answers: answer.answers
                        }}
                        questionNumber={index + 1}
                        selectedAnswerIds={answer.selectedAnswerIds}
                        showCorrectAnswer={true}
                        showResult={true}
                        isCorrect={answer.isCorrect}
                        readOnly={true}
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 justify-center">
                <Button 
                    variant="outline" 
                    onClick={() => router.push(`/student/quizzes/${params.quizId}`)}
                >
                    View Quiz Details
                </Button>
                <Button onClick={() => router.push("/student/quizzes")}>
                    Back to Quizzes
                </Button>
            </div>
        </div>
    );
}
