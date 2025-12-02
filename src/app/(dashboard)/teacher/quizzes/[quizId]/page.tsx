"use client"

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuizDetail } from "@/hooks/useQuizzes";
import { QuizType } from "@/types/enum";
import { 
    Clock, 
    FileQuestion, 
    Trophy, 
    Users,
    Edit,
    BarChart3,
    Eye,
    EyeOff,
    PlayCircle,
    Check,
    X as XIcon,
    BookOpen,
    Calendar,
    Loader2,
    Settings
} from "lucide-react";
import { QuestionType } from "@/types/enum";
import { useState } from "react";

export default function TeacherQuizDetailPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const router = useRouter();
    const { quiz, isLoading, error } = useQuizDetail(parseInt(quizId));
    const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

    const toggleQuestion = (questionId: number) => {
        setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
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
        }).format(new Date(date));
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Loading quiz details...</h3>
                </div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <XIcon className="h-12 w-12 text-destructive mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load quiz</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {error?.message || 'Quiz not found'}
                        </p>
                        <Button onClick={() => router.push("/teacher/quizzes")}>
                            Back to Quizzes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push("/teacher/quizzes")}
                    className="mb-4"
                >
                    ← Back to Quizzes
                </Button>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{quiz.title}</h1>
                            {quiz.isActive ? (
                                <Badge className="bg-green-500">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">{quiz.description}</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <Button onClick={() => router.push(`/teacher/quizzes/${quizId}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Quiz
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => router.push(`/teacher/quizzes/analytics/${quizId}`)}
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => router.push(`/student/quizzes/take/${quizId}`)}
                >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Preview Quiz
                </Button>
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

                    {/* Questions List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Questions ({quiz.questions.length})</CardTitle>
                                    <CardDescription>Click on a question to view details</CardDescription>
                                </div>
                                <Button 
                                    size="sm"
                                    onClick={() => router.push(`/teacher/quizzes/${quizId}/edit`)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Questions
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {quiz.questions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileQuestion className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="mb-4">No questions added yet</p>
                                    <Button 
                                        variant="outline"
                                        onClick={() => router.push(`/teacher/quizzes/${quizId}/edit`)}
                                    >
                                        Add Questions
                                    </Button>
                                </div>
                            ) : (
                                quiz.questions.map((question, index) => {
                                    const isExpanded = expandedQuestionId === question.id;
                                    
                                    return (
                                        <Card 
                                            key={question.id}
                                            className={`cursor-pointer transition-all hover:border-primary/50 ${
                                                isExpanded ? 'border-primary' : ''
                                            }`}
                                            onClick={() => toggleQuestion(question.id)}
                                        >
                                            <CardContent className="p-4">
                                                {/* Question Header */}
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="secondary">Q{index + 1}</Badge>
                                                            <Badge variant="outline">{question.points} pts</Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {question.type === QuestionType.SINGLE_CHOICE ? 'Single Choice' : 'Multiple Choice'}
                                                            </Badge>
                                                        </div>
                                                        <p className={`text-sm font-medium ${
                                                            !isExpanded ? 'line-clamp-2' : ''
                                                        }`}>
                                                            {question.questionText}
                                                        </p>
                                                        {!isExpanded && (
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                {question.answers.length} answers • Click to expand
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expanded Question Details */}
                                                {isExpanded && (
                                                    <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                                                        <Separator />
                                                        <div>
                                                            <Label className="text-xs font-semibold mb-2 block">Answer Options:</Label>
                                                            <div className="space-y-2">
                                                                {question.answers.map((answer, answerIndex) => (
                                                                    <div 
                                                                        key={answer.id}
                                                                        className={`flex items-center gap-3 p-2 rounded-lg border ${
                                                                            answer.isCorrect 
                                                                                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900' 
                                                                                : 'bg-muted/30'
                                                                        }`}
                                                                    >
                                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background border-2 flex items-center justify-center font-semibold text-sm">
                                                                            {String.fromCharCode(65 + answerIndex)}
                                                                        </div>
                                                                        <span className={`flex-1 text-sm ${
                                                                            answer.isCorrect ? 'font-semibold' : ''
                                                                        }`}>
                                                                            {answer.answerText}
                                                                        </span>
                                                                        {answer.isCorrect ? (
                                                                            <Badge className="bg-green-600 hover:bg-green-700">
                                                                                <Check className="h-3 w-3 mr-1" />
                                                                                Correct
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="secondary" className="text-muted-foreground">
                                                                                <XIcon className="h-3 w-3 mr-1" />
                                                                                Incorrect
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        {question.explanation && (
                                                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                                                                <Label className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1 block">
                                                                    Explanation:
                                                                </Label>
                                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                                    {question.explanation}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Quiz Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Active Status</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Make quiz available to students
                                    </p>
                                </div>
                                <Switch checked={quiz.isActive} />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Shuffle Questions</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Randomize question order
                                    </p>
                                </div>
                                <Switch checked={quiz.shuffleQuestions} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Shuffle Answers</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Randomize answer choices
                                    </p>
                                </div>
                                <Switch checked={quiz.shuffleAnswers} />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex items-center gap-2">
                                    {quiz.showResults ? (
                                        <Eye className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <div>
                                        <Label>Show Results</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display scores after submission
                                        </p>
                                    </div>
                                </div>
                                <Switch checked={quiz.showResults} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex items-center gap-2">
                                    {quiz.showCorrectAnswers ? (
                                        <Eye className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <div>
                                        <Label>Show Correct Answers</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Reveal correct answers after
                                        </p>
                                    </div>
                                </div>
                                <Switch checked={quiz.showCorrectAnswers} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Students Attempted</span>
                                <span className="font-semibold">28</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Average Score</span>
                                <span className="font-semibold">82.5%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Pass Rate</span>
                                <span className="font-semibold text-green-600">85.7%</span>
                            </div>
                            <Separator />
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => router.push(`/teacher/quizzes/analytics/${quizId}`)}
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Full Analytics
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
