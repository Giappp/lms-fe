"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizSubmitResultResponse } from "@/types/response";
import { CheckCircle2, XCircle, Clock, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuizResultCardProps {
    result: QuizSubmitResultResponse;
    passingPercentage: number;
    onViewDetails?: () => void;
    onRetake?: () => void;
}

export function QuizResultCard({ result, passingPercentage, onViewDetails, onRetake }: QuizResultCardProps) {
    const isPassed = result.isPassed;

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    return (
        <Card className={cn(
            "border-2",
            isPassed ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : "border-red-500 bg-red-50/50 dark:bg-red-950/20"
        )}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl mb-2">
                            {isPassed ? "Congratulations! 🎉" : "Keep Trying! 💪"}
                        </CardTitle>
                        <CardDescription>
                            {isPassed 
                                ? "You have successfully passed this quiz!" 
                                : "Don't give up! You can retake this quiz to improve your score."}
                        </CardDescription>
                    </div>
                    <Badge 
                        variant={isPassed ? "default" : "destructive"}
                        className="text-lg px-4 py-2"
                    >
                        {isPassed ? "Passed" : "Failed"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center py-6 border-y">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4"
                         style={{
                             borderColor: isPassed ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                             background: isPassed 
                                 ? 'linear-gradient(135deg, rgb(220, 252, 231) 0%, rgb(187, 247, 208) 100%)'
                                 : 'linear-gradient(135deg, rgb(254, 226, 226) 0%, rgb(252, 165, 165) 100%)'
                         }}>
                        <div>
                            <p className={cn(
                                "text-4xl font-bold",
                                isPassed ? "text-green-700" : "text-red-700"
                            )}>
                                {result.percentage.toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {result.score} / {result.totalQuestions}
                            </p>
                        </div>
                    </div>
                    <Progress 
                        value={result.percentage} 
                        className="h-3 mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                        Passing score: {passingPercentage}%
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-950/30">
                        <div className="flex justify-center mb-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                            {result.correctAnswers}
                        </p>
                        <p className="text-xs text-muted-foreground">Correct</p>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-950/30">
                        <div className="flex justify-center mb-2">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                            {result.incorrectAnswers}
                        </p>
                        <p className="text-xs text-muted-foreground">Incorrect</p>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-orange-100 dark:bg-orange-950/30">
                        <div className="flex justify-center mb-2">
                            <Award className="h-6 w-6 text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                            {result.unansweredQuestions}
                        </p>
                        <p className="text-xs text-muted-foreground">Skipped</p>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                        <div className="flex justify-center mb-2">
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {formatTime(result.timeSpentSeconds)}
                        </p>
                        <p className="text-xs text-muted-foreground">Time Spent</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    {onViewDetails && (
                        <button
                            onClick={onViewDetails}
                            className="flex-1 px-4 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
                        >
                            View Detailed Results
                        </button>
                    )}
                    {onRetake && !isPassed && (
                        <button
                            onClick={onRetake}
                            className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Retake Quiz
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
