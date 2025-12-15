"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizResponse } from "@/types/response";
import { Clock, BookOpen, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface QuizCardProps {
    quiz: QuizResponse;
    onStart?: () => void;
    onView?: () => void;
    onEdit?: () => void;
    showActions?: boolean;
    variant?: "student" | "teacher";
}

export function QuizCard({ quiz, onStart, onView, onEdit, showActions = true, variant = "student" }: QuizCardProps) {
    const isAvailable = quiz.isActive && (!quiz.startTime || new Date(quiz.startTime) <= new Date()) && (!quiz.endTime || new Date(quiz.endTime) >= new Date());
    const isUpcoming = quiz.startTime && new Date(quiz.startTime) > new Date();
    const isExpired = quiz.endTime && new Date(quiz.endTime) < new Date();

    return (
        <Card className={cn(
            "hover:shadow-lg transition-all duration-300 border-2",
            isAvailable && "border-primary/20 hover:border-primary/40",
            isExpired && "opacity-75 border-muted"
        )}>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge variant={quiz.isActive ? "default" : "secondary"} className="w-fit">
                            {quiz.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="w-fit">
                            {quiz.quizType === "LESSON_QUIZ" ? "Lesson Quiz" : "Course Quiz"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Status Badge */}
                {isUpcoming && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <span>Starts {formatDistanceToNow(new Date(quiz.startTime!), { addSuffix: true })}</span>
                    </div>
                )}
                {isExpired && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                        <XCircle className="h-4 w-4" />
                        <span>Expired {formatDistanceToNow(new Date(quiz.endTime!), { addSuffix: true })}</span>
                    </div>
                )}
                {isAvailable && !isUpcoming && !isExpired && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Available now</span>
                    </div>
                )}

                {/* Quiz Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{quiz.questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{quiz.timeLimitMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Pass: {quiz.passingPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {quiz.maxAttempts === -1 ? "Unlimited" : `${quiz.maxAttempts} attempts`}
                        </span>
                    </div>
                </div>

                {/* Start and End Time */}
                {(quiz.startTime || quiz.endTime) && (
                    <div className="space-y-2 pt-2 border-t">
                        {quiz.startTime && (
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                                <span className="text-muted-foreground">Start:</span>
                                <span className="font-medium">
                                    {new Date(quiz.startTime).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                        {quiz.endTime && (
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar className="h-3.5 w-3.5 text-rose-600 dark:text-rose-500" />
                                <span className="text-muted-foreground">End:</span>
                                <span className="font-medium">
                                    {new Date(quiz.endTime).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Additional Info */}
                <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Total Points: {quiz.totalPoints}</span>
                        <span>Scoring: {quiz.scoringMethod.toLowerCase()}</span>
                    </div>
                </div>
            </CardContent>

            {showActions && (
                <CardFooter className="gap-2">
                    {variant === "student" && (
                        <>
                            {onView && (
                                <Button variant="outline" className="flex-1" onClick={onView}>
                                    View Details
                                </Button>
                            )}
                            {onStart && isAvailable && (
                                <Button className="flex-1" onClick={onStart}>
                                    Start Quiz
                                </Button>
                            )}
                        </>
                    )}
                    {variant === "teacher" && (
                        <>
                            {onView && (
                                <Button variant="outline" className="flex-1" onClick={onView}>
                                    View
                                </Button>
                            )}
                            {onEdit && (
                                <Button className="flex-1" onClick={onEdit}>
                                    Edit
                                </Button>
                            )}
                        </>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
