"use client"

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/shared/quiz";
import { AttemptStatus } from "@/types/enum";
import { Clock, Trophy, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAttemptDetail } from "@/hooks/useQuizzes";

type AttemptDetailPageProps = {
    params: Promise<{ quizId: string; attemptId: string }>;
};

export default function AttemptDetailPage({ params }: AttemptDetailPageProps) {
    const { quizId, attemptId } = use(params);
    const router = useRouter();
    const { attempt, isLoading, error } = useAttemptDetail(parseInt(attemptId));

    // Check if this is an in-progress attempt (view mode for reviewing saved answers)
    const isInProgress = attempt?.status === AttemptStatus.IN_PROGRESS;

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Loading attempt details...</h3>
                </div>
            </div>
        );
    }

    if (error || !attempt) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load attempt</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {error?.message || 'Attempt not found or you do not have access'}
                        </p>
                        <Button onClick={() => router.push(`/student/quizzes/${quizId}`)}>
                            Back to Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const correctCount = attempt.attemptAnswers?.filter(a => a.isCorrect).length || 0;
    const incorrectCount = attempt.attemptAnswers?.filter(a => !a.isCorrect).length || 0;
    const totalQuestions = attempt.attemptAnswers?.length || 0;

    // Group answers by questionId since backend sends one entry per selected answer
    const groupedAnswers = attempt.attemptAnswers?.reduce((acc, ans) => {
        const existing = acc.find(a => a.questionId === ans.questionId);
        if (existing) {
            existing.selectedAnswerIds.push(ans.selectedAnswerId);
        } else {
            acc.push({
                ...ans,
                selectedAnswerIds: [ans.selectedAnswerId]
            });
        }
        return acc;
    }, [] as Array<typeof attempt.attemptAnswers[0] & { selectedAnswerIds: number[] }>);

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push(`/student/quizzes/${quizId}`)}
                    className="mb-4"
                >
                    ← Back to Quiz
                </Button>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{attempt.quizTitle}</h1>
                        <p className="text-muted-foreground">
                            Attempt #{attempt.attemptNumber} • {isInProgress 
                                ? `Started ${formatDistanceToNow(new Date(attempt.startedAt), { addSuffix: true })}`
                                : `Submitted ${attempt.submittedAt && formatDistanceToNow(new Date(attempt.submittedAt), { addSuffix: true })}`
                            }
                        </p>
                    </div>
                    {isInProgress ? (
                        <Badge className="bg-blue-500 text-white">In Progress</Badge>
                    ) : attempt.isPassed ? (
                        <Badge className="bg-green-500 text-white">Passed</Badge>
                    ) : (
                        <Badge className="bg-red-500 text-white">Failed</Badge>
                    )}
                </div>
            </div>

            {/* Results Summary - Only show for completed attempts */}
            {!isInProgress && (
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
            )}

            {/* Progress Summary - Only show for in-progress attempts */}
            {isInProgress && (
                <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                                <p className="text-sm text-muted-foreground">Total Questions</p>
                            </div>

                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                <p className="text-2xl font-bold text-purple-600">{totalQuestions}</p>
                                <p className="text-sm text-muted-foreground">Answered</p>
                            </div>

                            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                                <p className="text-2xl font-bold text-orange-600">
                                    {Math.floor(attempt.timeSpentSeconds / 60)}m
                                </p>
                                <p className="text-sm text-muted-foreground">Time Spent</p>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                                        Review Your Answers
                                    </p>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        This is your saved progress. You can continue this quiz from where you left off.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Questions Review */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold">{isInProgress ? 'Your Answers' : 'Answer Review'}</h2>
                {groupedAnswers?.map((answer, index) => (
                    <QuestionCard
                        key={answer.questionId}
                        question={{
                            id: answer.questionId,
                            type: answer.questionType,
                            questionText: answer.questionText,
                            orderIndex: index + 1,
                            points: answer.points,
                            explanation: answer.explanation,
                            answers: answer.answers
                        }}
                        questionNumber={index + 1}
                        selectedAnswerIds={answer.selectedAnswerIds}
                        showCorrectAnswer={!isInProgress}
                        showResult={!isInProgress}
                        isCorrect={answer.isCorrect}
                        readOnly={true}
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 justify-center">
                {isInProgress ? (
                    <>
                        <Button 
                            onClick={() => router.push(`/student/quizzes/take/${quizId}`)}
                        >
                            Continue Quiz
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => router.push(`/student/quizzes/${quizId}`)}
                        >
                            Back to Quiz Details
                        </Button>
                    </>
                ) : (
                    <>
                        <Button 
                            variant="outline" 
                            onClick={() => router.push(`/student/quizzes/${quizId}`)}
                        >
                            View Quiz Details
                        </Button>
                        <Button onClick={() => router.push("/student/quizzes")}>
                            Back to Quizzes
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
