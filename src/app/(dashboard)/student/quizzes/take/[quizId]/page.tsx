"use client"

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/shared/quiz/QuestionCard";
import { QuizTimer } from "@/components/shared/quiz/QuizTimer";
import { QuizProgress } from "@/components/shared/quiz/QuizProgress";
import { QuizResultCard } from "@/components/shared/quiz/QuizResultCard";
import { QuizSubmitResultResponse } from "@/types/response";
import { AnswerProgress } from "@/types/request";
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2, XCircle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAttemptDetail, useQuizDetail } from "@/hooks/useQuizzes";
import { useToast } from "@/hooks/use-toast";

type TakeQuizPageProps = {
    params: Promise<{ quizId: string }>;
};

export default function TakeQuizPage({ params }: TakeQuizPageProps) {
    const { quizId } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    
    // Get quiz details
    const { quiz, isLoading: quizLoading } = useQuizDetail(parseInt(quizId));
    
    // Get attemptId from session storage
    const [attemptId, setAttemptId] = useState<number | undefined>();
    const { attempt, isLoading: attemptLoading, error, saveProgress, submitQuiz } = useAttemptDetail(attemptId);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<QuizSubmitResultResponse | null>(null);
    const [isSavingProgress, setIsSavingProgress] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use refs to access latest values in event handlers without re-registering listeners
    const answersRef = useRef(answers);
    const isSubmittedRef = useRef(isSubmitted);
    const attemptIdRef = useRef(attemptId);
    const saveProgressRef = useRef(saveProgress);

    // Update refs whenever values change
    useEffect(() => {
        answersRef.current = answers;
        isSubmittedRef.current = isSubmitted;
        attemptIdRef.current = attemptId;
        saveProgressRef.current = saveProgress;
    }, [answers, isSubmitted, attemptId, saveProgress]);

    // Auto-save progress when user exits quiz (browser close, tab close, refresh, navigation)
    useEffect(() => {
        if (!attemptId || isSubmitted) return;

        let isSaving = false;

        const saveCurrentProgress = () => {
            // Use refs to get latest values
            const currentAttemptId = attemptIdRef.current;
            const currentAnswers = answersRef.current;
            const currentIsSubmitted = isSubmittedRef.current;
            const currentSaveProgress = saveProgressRef.current;

            // Prevent duplicate saves
            if (isSaving || Object.keys(currentAnswers).length === 0 || currentIsSubmitted || !currentAttemptId) return;
            
            isSaving = true;

            const answerProgress: AnswerProgress[] = [];
            
            Object.entries(currentAnswers).forEach(([questionId, selectedAnswerIds]) => {
                if (selectedAnswerIds.length > 0) {
                    selectedAnswerIds.forEach(answerId => {
                        answerProgress.push({
                            questionId: parseInt(questionId),
                            selectedAnswerId: answerId
                        });
                    });
                } else {
                    answerProgress.push({
                        questionId: parseInt(questionId),
                        selectedAnswerId: null
                    });
                }
            });

            // Use synchronous approach for reliable saving during page unload
            // We use the existing saveProgress function which uses axiosInstance
            currentSaveProgress({
                answers: answerProgress
            }).catch(() => {
                // Silently fail during unload
            });
        };

        // Handle page unload (browser/tab close, refresh)
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (Object.keys(answersRef.current).length > 0 && !isSubmittedRef.current) {
                saveCurrentProgress();
                // Show confirmation dialog for unsaved changes
                e.preventDefault();
                e.returnValue = '';
            }
        };

        // Handle visibility change (tab switch, minimize, mobile background)
        const handleVisibilityChange = () => {
            if (document.hidden && Object.keys(answersRef.current).length > 0 && !isSaving && !isSubmittedRef.current) {
                saveCurrentProgress();
            }
        };

        // Handle page hide (more reliable than beforeunload on mobile Safari/Chrome)
        const handlePageHide = (e: PageTransitionEvent) => {
            if (Object.keys(answersRef.current).length > 0 && !isSaving && !isSubmittedRef.current) {
                saveCurrentProgress();
            }
        };

        // Register event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);

        // Cleanup on component unmount (navigation within app)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
            
            // Save progress on unmount (navigation away within app)
            if (Object.keys(answersRef.current).length > 0 && !isSaving && !isSubmittedRef.current) {
                saveCurrentProgress();
            }
        };
    }, [attemptId, isSubmitted]); // Only re-run if attemptId or isSubmitted changes, not on every answer change

    // Get attemptId from session storage on mount
    useEffect(() => {
        const storedAttemptId = sessionStorage.getItem(`quiz_${quizId}_attempt`);
        if (storedAttemptId) {
            setAttemptId(parseInt(storedAttemptId));
        } else {
            toast({
                title: "No Active Attempt",
                description: "Please start the quiz from the quiz page",
                variant: "destructive"
            });
            router.push(`/student/quizzes/${quizId}`);
        }
    }, [quizId, router, toast]);

    // Initialize answers from existing attempt data
    useEffect(() => {
        if (attempt?.attemptAnswers) {
            const answerMap: Record<number, number[]> = {};
            
            // Group answers by questionId since backend sends one entry per selected answer
            attempt.attemptAnswers.forEach(ans => {
                if (!answerMap[ans.questionId]) {
                    answerMap[ans.questionId] = [];
                }
                if (ans.selectedAnswerId) {
                    answerMap[ans.questionId].push(ans.selectedAnswerId);
                }
            });
            
            setAnswers(answerMap);
        }
    }, [attempt]);

    const currentQuestion = quiz?.questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const isLoading = quizLoading || attemptLoading;

    const handleAnswerChange = (questionId: number, answerIds: number[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIds
        }));
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleQuestionNavigation = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSaveProgress = async () => {
        if (!attemptId) return;
        
        setIsSavingProgress(true);
        try {
            // Transform answers to match backend DTO - each answer gets its own entry
            const answerProgress: AnswerProgress[] = [];
            
            Object.entries(answers).forEach(([questionId, selectedAnswerIds]) => {
                if (selectedAnswerIds.length > 0) {
                    selectedAnswerIds.forEach(answerId => {
                        answerProgress.push({
                            questionId: parseInt(questionId),
                            selectedAnswerId: answerId
                        });
                    });
                } else {
                    answerProgress.push({
                        questionId: parseInt(questionId),
                        selectedAnswerId: null
                    });
                }
            });

            const result = await saveProgress({
                answers: answerProgress
            });

            if (result.success) {
                toast({
                    title: "Progress Saved",
                    description: "Your answers have been saved successfully"
                });
                // Exit quiz page after saving progress
                router.push(`/student/quizzes/${quizId}`);
            } else {
                const errorMsg = (result as any).error || "Failed to save progress";
                toast({
                    title: "Error",
                    description: errorMsg,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while saving progress",
                variant: "destructive"
            });
        } finally {
            setIsSavingProgress(false);
        }
    };

    const handleSubmit = async () => {
        if (!attemptId || !quiz) return;
        
        setIsSubmitting(true);
        try {
            // Transform answers to match backend DTO - flatten to individual answer entries
            const questionAnswers = Object.entries(answers).flatMap(([questionId, selectedAnswerIds]) => 
                selectedAnswerIds.map(answerId => ({
                    questionId: parseInt(questionId),
                    selectedAnswerId: answerId
                }))
            );

            const result = await submitQuiz({
                attemptId,
                answers: questionAnswers
            });

            if (result.success) {
                const responseData = (result as any).data;
                if (responseData) {
                    setResult(responseData);
                    setIsSubmitted(true);
                    setShowSubmitDialog(false);
                    sessionStorage.removeItem(`quiz_${quizId}_attempt`);
                    
                    toast({
                        title: "Quiz Submitted",
                        description: "Your quiz has been submitted successfully"
                    });
                }
            } else {
                const errorMsg = (result as any).error || "Failed to submit quiz";
                toast({
                    title: "Error",
                    description: errorMsg,
                    variant: "destructive"
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while submitting quiz",
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
    };

    const handleTimeUp = () => {
        toast({
            title: "Time's Up!",
            description: "Quiz time limit reached. Submitting your answers...",
            variant: "destructive"
        });
        handleSubmit();
    };

    if (isLoading || !attemptId) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Loading quiz...</h3>
                </div>
            </div>
        );
    }

    if (error || !quiz || !attempt) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <XCircle className="h-12 w-12 text-destructive mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load quiz</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {error?.message || 'Quiz attempt not found or has expired'}
                        </p>
                        <Button onClick={() => router.push(`/student/quizzes/${quizId}`)}>
                            Back to Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSubmitted && result && quiz) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <QuizResultCard
                    result={result}
                    passingPercentage={quiz.passingPercentage}
                    onViewDetails={() => router.push(`/student/quizzes/${quizId}/attempt/${result.attemptId}`)}
                    onRetake={() => router.push(`/student/quizzes/${quizId}`)}
                />
            </div>
        );
    }

    if (!currentQuestion) {
        return null;
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground">{quiz.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Question Card */}
                    <QuestionCard
                        question={currentQuestion}
                        questionNumber={currentQuestionIndex + 1}
                        selectedAnswerIds={answers[currentQuestion.id] || []}
                        onAnswerChange={(answerIds) => handleAnswerChange(currentQuestion.id, answerIds)}
                        showCorrectAnswer={false}
                        showResult={false}
                        readOnly={false}
                    />

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex gap-2">

                            {currentQuestionIndex === quiz.questions.length - 1 ? (
                                <Button
                                    onClick={() => setShowSubmitDialog(true)}
                                    disabled={isSubmitting}
                                    className="gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Submit Quiz
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button onClick={handleNext} className="gap-2">
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <QuizTimer
                        timeLimitMinutes={quiz.timeLimitMinutes}
                        startedAt={new Date(attempt.startedAt)}
                        timeSpentSeconds={attempt.timeSpentSeconds}
                        onTimeUp={handleTimeUp}
                    />
                    <QuizProgress
                        totalQuestions={quiz.questions.length}
                        answeredQuestions={answeredCount}
                        currentQuestionIndex={currentQuestionIndex}
                        onQuestionClick={handleQuestionNavigation}
                    />
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Submit Quiz?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You have answered {answeredCount} out of {quiz.questions.length} questions.
                            {answeredCount < quiz.questions.length && (
                                <span className="block mt-2 text-orange-600 font-medium">
                                    Warning: You have {quiz.questions.length - answeredCount} unanswered question(s).
                                </span>
                            )}
                            <span className="block mt-2">
                                Once submitted, you cannot change your answers. Are you sure you want to continue?
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
