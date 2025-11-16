"use client"

import { AnswerResponse } from "@/types/response";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerOptionProps {
    answer: AnswerResponse;
    answerLetter: string;
    isSelected: boolean;
    onSelect: () => void;
    showCorrect?: boolean;
    readOnly?: boolean;
}

export function AnswerOption({
    answer,
    answerLetter,
    isSelected,
    onSelect,
    showCorrect = false,
    readOnly = false
}: AnswerOptionProps) {
    const isCorrectAnswer = showCorrect && answer.isCorrect;
    const isWrongSelection = showCorrect && isSelected && !answer.isCorrect;

    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={readOnly}
            className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:cursor-not-allowed",
                
                // Normal state
                !showCorrect && !isSelected && "border-border bg-card hover:border-primary/50",
                !showCorrect && isSelected && "border-primary bg-primary/5",
                
                // Show correct answer state
                isCorrectAnswer && "border-green-500 bg-green-50 dark:bg-green-950/30",
                isWrongSelection && "border-red-500 bg-red-50 dark:bg-red-950/30",
                showCorrect && !isCorrectAnswer && !isWrongSelection && "border-border bg-card opacity-60"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Letter Badge */}
                <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                    !showCorrect && !isSelected && "bg-muted text-muted-foreground",
                    !showCorrect && isSelected && "bg-primary text-primary-foreground",
                    isCorrectAnswer && "bg-green-600 text-white",
                    isWrongSelection && "bg-red-600 text-white"
                )}>
                    {answerLetter}
                </div>

                {/* Answer Text */}
                <div className="flex-1 pt-1">
                    <p className={cn(
                        "text-sm leading-relaxed",
                        isCorrectAnswer && "font-medium text-green-900 dark:text-green-100",
                        isWrongSelection && "text-red-900 dark:text-red-100"
                    )}>
                        {answer.answerText}
                    </p>
                </div>

                {/* Checkmark for selected/correct */}
                {(isSelected || isCorrectAnswer) && (
                    <div className="flex-shrink-0">
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center",
                            !showCorrect && isSelected && "bg-primary",
                            isCorrectAnswer && "bg-green-600",
                            isWrongSelection && "bg-red-600"
                        )}>
                            <Check className="h-4 w-4 text-white" />
                        </div>
                    </div>
                )}
            </div>
        </button>
    );
}
