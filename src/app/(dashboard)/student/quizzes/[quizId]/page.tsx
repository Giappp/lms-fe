"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuizDetailResponse, QuizAttemptResponse } from "@/types/response";
import { QuizType, AttemptStatus } from "@/types/enum";
import { 
    Clock, 
    FileQuestion, 
    Trophy, 
    AlertCircle, 
    PlayCircle, 
    History,
    CheckCircle2,
    BookOpen,
    Users,
    Calendar
} from "lucide-react";
import { AttemptHistoryCard } from "@/components/shared/quiz";

// Mock quiz detail
const mockQuizDetail: QuizDetailResponse = {
    id: 1,
    title: "Introduction to React Hooks",
    description: "Test your knowledge of React Hooks including useState, useEffect, useContext, and custom hooks. This quiz covers fundamental concepts and best practices.",
    quizType: QuizType.LESSON_QUIZ,
    courseId: 1,
    courseName: "React for Beginners",
    lessonId: 5,
    lessonTitle: "React Hooks Deep Dive",
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
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    questions: []
};

// Mock attempts
const mockAttempts: QuizAttemptResponse[] = [
    {
        id: 1,
        quizId: 1,
        quizTitle: "Introduction to React Hooks",
        studentId: 1,
        studentName: "John Doe",
        attemptNumber: 1,
        score: 20,
        percentage: 66.67,
        isPassed: false,
        status: AttemptStatus.SUBMITTED,
        startedAt: new Date("2024-01-20T10:00:00"),
        submittedAt: new Date("2024-01-20T10:25:00"),
        timeSpentSeconds: 1500,
        totalQuestions: 3,
        correctAnswers: 2,
        incorrectAnswers: 1,
        unansweredQuestions: 0,
        isReviewed: false
    },
    {
        id: 2,
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
        teacherFeedback: "Great improvement!"
    }
];

export default function QuizDetailPage({ params }: { params: { quizId: string } }) {
    const router = useRouter();
    const quiz = mockQuizDetail;
    const attempts = mockAttempts;
    const attemptsUsed = attempts.length;
    const attemptsRemaining = quiz.maxAttempts - attemptsUsed;
    const canTakeQuiz = attemptsRemaining > 0 && quiz.isActive;
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;

    const handleStartQuiz = () => {
        router.push(`/student/quizzes/take/${params.quizId}`);
    };
    const formatDateTime = (date?: Date) => {
        if (!date) return 'Not set';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push("/student/quizzes")}
                    className="mb-4"
                >
                    ← Back to Quizzes
                </Button>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                        <p className="text-muted-foreground">{quiz.description}</p>
                    </div>
                    {quiz.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                    ) : (
                        <Badge variant="secondary">Inactive</Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course and Lesson Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Information</CardTitle>
                            <CardDescription>Course and lesson details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-950 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Course</p>
                                    <p className="font-semibold">{quiz.courseName || 'N/A'}</p>
                                </div>
                            </div>

                            {quiz.lessonTitle && quiz.quizType === QuizType.LESSON_QUIZ && (
                                <>
                                    <Separator />
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-cyan-100 dark:bg-cyan-950 rounded-lg">
                                            <FileQuestion className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Lesson</p>
                                            <p className="font-semibold">{quiz.lessonTitle}</p>
                                            <Badge variant="secondary" className="mt-1 text-xs">Lesson Quiz</Badge>
                                        </div>
                                    </div>
                                </>
                            )}

                            {quiz.quizType === QuizType.COURSE_QUIZ && (
                                <>
                                    <Separator />
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            Course Quiz - Covers all lessons
                                        </Badge>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    {/* Quiz Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Details</CardTitle>
                            <CardDescription>Core settings and configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                                        <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Questions</p>
                                        <p className="font-semibold">{quiz.questionCount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                                        <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Points</p>
                                        <p className="font-semibold">{quiz.totalPoints}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                                        <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time Limit</p>
                                        <p className="font-semibold">{quiz.timeLimitMinutes} minutes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                                        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Max Attempts</p>
                                        <p className="font-semibold">{quiz.maxAttempts}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-lg">
                                        <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Start Time</p>
                                        <p className="font-semibold text-sm">{formatDateTime(quiz.startTime)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-950 rounded-lg">
                                        <Calendar className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">End Time</p>
                                        <p className="font-semibold text-sm">{formatDateTime(quiz.endTime)}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Quiz Type</span>
                                    <Badge variant="outline">
                                        {quiz.quizType === QuizType.LESSON_QUIZ ? "Lesson Quiz" : "Course Quiz"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Passing Percentage</span>
                                    <Badge variant="outline">{quiz.passingPercentage}%</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Scoring Method</span>
                                    <Badge variant="outline">{quiz.scoringMethod}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attempt History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Your Attempts ({attempts.length})
                            </CardTitle>
                            <CardDescription>
                                Review your previous attempts and track your progress
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {attempts.length > 0 ? (
                                <div className="space-y-3">
                                    {attempts.map((attempt) => (
                                        <AttemptHistoryCard
                                            key={attempt.id}
                                            attempt={attempt}
                                            onView={() => router.push(`/student/quizzes/${quiz.id}/attempt/${attempt.id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileQuestion className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>You haven't attempted this quiz yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Start Quiz Card */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Ready to Start?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {canTakeQuiz ? (
                                <>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                            Attempts Remaining
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {attemptsRemaining} / {quiz.maxAttempts}
                                        </p>
                                    </div>

                                    {attempts.length > 0 && (
                                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                                Your Best Score
                                            </p>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {bestScore.toFixed(1)}%
                                            </p>
                                        </div>
                                    )}

                                    <Button 
                                        className="w-full gap-2" 
                                        size="lg"
                                        onClick={handleStartQuiz}
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        {attempts.length > 0 ? "Take Quiz Again" : "Start Quiz"}
                                    </Button>

                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <p>
                                            Make sure you have enough time to complete the quiz. 
                                            You can save progress but must submit before time runs out.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    {!quiz.isActive ? (
                                        <>
                                            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-orange-600" />
                                            <p className="font-medium mb-2">Quiz Inactive</p>
                                            <p className="text-sm text-muted-foreground">
                                                This quiz is currently not available
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-600" />
                                            <p className="font-medium mb-2">No Attempts Remaining</p>
                                            <p className="text-sm text-muted-foreground">
                                                You've used all {quiz.maxAttempts} attempts for this quiz
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tips for Success</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                                    <span>Read each question carefully before answering</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                                    <span>Use the save progress feature if you need a break</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                                    <span>Review your answers before submitting</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                                    <span>Keep an eye on the timer</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
