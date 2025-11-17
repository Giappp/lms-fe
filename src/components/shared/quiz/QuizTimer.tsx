"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
    timeLimitMinutes: number;
    startedAt: Date;
    onTimeUp?: () => void;
    mustSubmitBefore?: Date;
}

export function QuizTimer({ timeLimitMinutes, startedAt, onTimeUp, mustSubmitBefore }: QuizTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const started = new Date(startedAt).getTime();
            const deadline = mustSubmitBefore 
                ? new Date(mustSubmitBefore).getTime()
                : started + (timeLimitMinutes * 60 * 1000);
            
            const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
            return remaining;
        };

        const updateTimer = () => {
            const remaining = calculateTimeRemaining();
            setTimeRemaining(remaining);

            // Warning when 5 minutes or less remaining
            setIsWarning(remaining <= 300 && remaining > 0);

            // Time's up
            if (remaining === 0 && onTimeUp) {
                onTimeUp();
            }
        };

        // Initial update
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [timeLimitMinutes, startedAt, mustSubmitBefore, onTimeUp]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className={cn(
            "sticky top-4 transition-all duration-300",
            isWarning && "border-orange-500 shadow-lg shadow-orange-500/20",
            timeRemaining === 0 && "border-red-500 shadow-lg shadow-red-500/20"
        )}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-full",
                        !isWarning && "bg-primary/10",
                        isWarning && "bg-orange-500/10 animate-pulse",
                        timeRemaining === 0 && "bg-red-500/10"
                    )}>
                        {isWarning || timeRemaining === 0 ? (
                            <AlertTriangle className={cn(
                                "h-5 w-5",
                                isWarning && "text-orange-600",
                                timeRemaining === 0 && "text-red-600"
                            )} />
                        ) : (
                            <Clock className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                        <p className={cn(
                            "text-2xl font-bold font-mono tabular-nums",
                            !isWarning && "text-foreground",
                            isWarning && "text-orange-600",
                            timeRemaining === 0 && "text-red-600"
                        )}>
                            {formatTime(timeRemaining)}
                        </p>
                    </div>
                </div>

                {isWarning && timeRemaining > 0 && (
                    <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/30 rounded-md">
                        <p className="text-xs text-orange-800 dark:text-orange-200 text-center font-medium">
                            ⚠️ Less than 5 minutes remaining!
                        </p>
                    </div>
                )}

                {timeRemaining === 0 && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 rounded-md">
                        <p className="text-xs text-red-800 dark:text-red-200 text-center font-medium">
                            ⏰ Time's up! Please submit your quiz.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
