"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
    totalQuestions: number;
    answeredQuestions: number;
    currentQuestionIndex?: number;
    onQuestionClick?: (index: number) => void;
}

export function QuizProgress({
    totalQuestions,
    answeredQuestions,
    currentQuestionIndex,
    onQuestionClick
}: QuizProgressProps) {
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    const unansweredCount = totalQuestions - answeredQuestions;

    return (
        <Card className="sticky top-4">
            <CardContent className="p-4 space-y-4">
                {/* Progress Header */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                            {answeredQuestions} / {totalQuestions}
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-950/30">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Answered</p>
                            <p className="text-lg font-bold">{answeredQuestions}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-950/30">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Remaining</p>
                            <p className="text-lg font-bold">{unansweredCount}</p>
                        </div>
                    </div>
                </div>

                {/* Question Navigator */}
                {onQuestionClick && (
                    <div className="pt-3 border-t">
                        <p className="text-xs font-medium mb-3">Questions</p>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: totalQuestions }).map((_, index) => {
                                const isAnswered = index < answeredQuestions;
                                const isCurrent = index === currentQuestionIndex;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => onQuestionClick(index)}
                                        className={cn(
                                            "aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all",
                                            "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                            !isAnswered && !isCurrent && "border-border bg-card text-muted-foreground hover:border-primary/50",
                                            isAnswered && !isCurrent && "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
                                            isCurrent && !isAnswered && "border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2",
                                            isCurrent && isAnswered && "border-green-500 bg-green-500 text-white ring-2 ring-green-500 ring-offset-2"
                                        )}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50 dark:bg-green-950/30" />
                        <span className="text-muted-foreground">Answered</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded border-2 border-border bg-card" />
                        <span className="text-muted-foreground">Not answered</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10" />
                        <span className="text-muted-foreground">Current question</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
