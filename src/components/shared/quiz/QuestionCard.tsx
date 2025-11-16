"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuestionResponse } from "@/types/response";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { AnswerOption } from "./index";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: QuestionResponse;
    questionNumber: number;
    selectedAnswerIds?: number[];
    onAnswerChange?: (answerIds: number[]) => void;
    showCorrectAnswer?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
    readOnly?: boolean;
}

export function QuestionCard({
    question,
    questionNumber,
    selectedAnswerIds = [],
    onAnswerChange,
    showCorrectAnswer = false,
    showResult = false,
    isCorrect,
    readOnly = false
}: QuestionCardProps) {
    
    const handleAnswerSelect = (answerId: number) => {
        if (readOnly || !onAnswerChange) return;

        if (question.type === "SINGLE_CHOICE") {
            // Single choice - replace selection
            onAnswerChange([answerId]);
        } else {
            // Multiple choice - toggle selection
            const newSelection = selectedAnswerIds.includes(answerId)
                ? selectedAnswerIds.filter(id => id !== answerId)
                : [...selectedAnswerIds, answerId];
            onAnswerChange(newSelection);
        }
    };

    return (
        <Card className={cn(
            "transition-all duration-300",
            showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
            showResult && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20"
        )}>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-sm">
                                Question {questionNumber}
                            </Badge>
                            <Badge variant="outline">
                                {question.type === "SINGLE_CHOICE" ? "Single Choice" : "Multiple Choice"}
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-auto">
                                {question.points} {question.points === 1 ? "point" : "points"}
                            </span>
                        </div>
                        <p className="text-base font-medium leading-relaxed">{question.questionText}</p>
                    </div>
                    {showResult && (
                        <div className="flex-shrink-0">
                            {isCorrect ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                                <XCircle className="h-6 w-6 text-red-600" />
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Answers */}
                <div className="space-y-2">
                    {question.answers.map((answer, index) => (
                        <AnswerOption
                            key={answer.id}
                            answer={answer}
                            answerLetter={String.fromCharCode(65 + index)}
                            isSelected={selectedAnswerIds.includes(answer.id)}
                            onSelect={() => handleAnswerSelect(answer.id)}
                            showCorrect={showCorrectAnswer}
                            readOnly={readOnly}
                        />
                    ))}
                </div>

                {/* Explanation */}
                {showCorrectAnswer && question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">Explanation</p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
