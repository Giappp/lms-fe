"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizAttemptResponse } from "@/types/response";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface AttemptHistoryCardProps {
    attempt: QuizAttemptResponse;
    onView?: () => void;
}

export function AttemptHistoryCard({ attempt, onView }: AttemptHistoryCardProps) {
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    return (
        <Card className={cn(
            "hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4",
            attempt.isPassed ? "border-l-green-500" : "border-l-red-500"
        )} onClick={onView}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg mb-1">Attempt #{attempt.attemptNumber}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(attempt.startedAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                    <Badge variant={attempt.isPassed ? "default" : "destructive"}>
                        {attempt.isPassed ? "Passed" : "Failed"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Score */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                        <Award className={cn(
                            "h-5 w-5",
                            attempt.isPassed ? "text-green-600" : "text-red-600"
                        )} />
                        <span className="text-sm font-medium">Score</span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{attempt.percentage.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">{attempt.score} points</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-green-100 dark:bg-green-950/30">
                        <p className="text-lg font-bold text-green-700 dark:text-green-300">
                            {attempt.correctAnswers}
                        </p>
                        <p className="text-xs text-muted-foreground">Correct</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-red-100 dark:bg-red-950/30">
                        <p className="text-lg font-bold text-red-700 dark:text-red-300">
                            {attempt.incorrectAnswers}
                        </p>
                        <p className="text-xs text-muted-foreground">Wrong</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-orange-100 dark:bg-orange-950/30">
                        <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                            {attempt.unansweredQuestions}
                        </p>
                        <p className="text-xs text-muted-foreground">Skipped</p>
                    </div>
                </div>

                {/* Time Spent */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Time spent</span>
                    </div>
                    <span className="font-semibold">{formatTime(attempt.timeSpentSeconds)}</span>
                </div>

                {/* Review Status */}
                {attempt.isReviewed && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                Reviewed by {attempt.reviewerName}
                            </span>
                        </div>
                        {attempt.teacherFeedback && (
                            <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                                {attempt.teacherFeedback}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
