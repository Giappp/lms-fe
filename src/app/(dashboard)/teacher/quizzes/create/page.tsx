"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Save, X, GripVertical, Edit, Check, ChevronDown, ChevronRight } from "lucide-react";
import { QuizType, QuestionType, ScoringMethod } from "@/types/enum";
import { QuizCreationRequest, QuestionRequest, AnswerRequest } from "@/types/request";
import { ChapterWithLessons } from "@/types/types";
import { Badge } from "@/components/ui/badge";
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

// Mock courses data
const mockCourses = [
    { id: 1, title: "React Fundamentals" },
    { id: 2, title: "Advanced JavaScript" },
    { id: 3, title: "TypeScript Basics" },
    { id: 4, title: "Node.js Backend Development" },
    { id: 5, title: "Full Stack Web Development" }
];

// Mock course curriculum (chapters and lessons)
const mockCourseCurriculum: Record<number, ChapterWithLessons[]> = {
    1: [
        {
            _id: "ch1",
            id: 1,
            title: "Getting Started with React",
            orderIndex: 1,
            lessons: [
                { _id: "l1", id: 1, title: "Introduction to React", content: "", description: "", duration: 30, orderIndex: 1, type: "VIDEO" as any },
                { _id: "l2", id: 2, title: "Setting up Development Environment", content: "", description: "", duration: 45, orderIndex: 2, type: "VIDEO" as any },
                { _id: "l3", id: 3, title: "Your First React Component", content: "", description: "", duration: 60, orderIndex: 3, type: "VIDEO" as any }
            ]
        },
        {
            _id: "ch2",
            id: 2,
            title: "React Hooks Deep Dive",
            orderIndex: 2,
            lessons: [
                { _id: "l4", id: 4, title: "useState and useEffect", content: "", description: "", duration: 50, orderIndex: 1, type: "VIDEO" as any },
                { _id: "l5", id: 5, title: "useContext and useReducer", content: "", description: "", duration: 55, orderIndex: 2, type: "VIDEO" as any },
                { _id: "l6", id: 6, title: "Custom Hooks", content: "", description: "", duration: 40, orderIndex: 3, type: "VIDEO" as any }
            ]
        },
        {
            _id: "ch3",
            id: 3,
            title: "Advanced Patterns",
            orderIndex: 3,
            lessons: [
                { _id: "l7", id: 7, title: "Higher Order Components", content: "", description: "", duration: 45, orderIndex: 1, type: "VIDEO" as any },
                { _id: "l8", id: 8, title: "Render Props", content: "", description: "", duration: 35, orderIndex: 2, type: "VIDEO" as any }
            ]
        }
    ],
    2: [
        {
            _id: "ch4",
            id: 4,
            title: "ES6+ Features",
            orderIndex: 1,
            lessons: [
                { _id: "l9", id: 9, title: "Arrow Functions and Destructuring", content: "", description: "", duration: 40, orderIndex: 1, type: "VIDEO" as any },
                { _id: "l10", id: 10, title: "Promises and Async/Await", content: "", description: "", duration: 50, orderIndex: 2, type: "VIDEO" as any }
            ]
        }
    ],
    3: [
        {
            _id: "ch5",
            id: 5,
            title: "TypeScript Fundamentals",
            orderIndex: 1,
            lessons: [
                { _id: "l11", id: 11, title: "Type Annotations", content: "", description: "", duration: 30, orderIndex: 1, type: "VIDEO" as any },
                { _id: "l12", id: 12, title: "Interfaces and Types", content: "", description: "", duration: 35, orderIndex: 2, type: "VIDEO" as any }
            ]
        }
    ]
};

export default function CreateQuizPage() {
    const router = useRouter();
    const [quiz, setQuiz] = useState<QuizCreationRequest>({
        title: "",
        description: "",
        type: QuizType.LESSON_QUIZ,
        courseId: 0,
        lessonId: undefined,
        startTime: undefined,
        endTime: undefined,
        timeLimitMinutes: 30,
        maxAttempts: 3,
        passingPercentage: 70,
        scoringMethod: ScoringMethod.HIGHEST,
        shuffleQuestions: true,
        shuffleAnswers: true,
        showResults: true,
        showCorrectAnswers: true,
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState<QuestionRequest>({
        type: QuestionType.SINGLE_CHOICE,
        questionText: "",
        orderIndex: 0,
        points: 10,
        explanation: "",
        answers: [
            { answerText: "", isCorrect: false, orderIndex: 0 },
            { answerText: "", isCorrect: false, orderIndex: 1 },
            { answerText: "", isCorrect: false, orderIndex: 2 },
            { answerText: "", isCorrect: false, orderIndex: 3 }
        ]
    });

    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
    const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set());
    
    // Get curriculum for selected course
    const selectedCourseCurriculum = quiz.courseId ? mockCourseCurriculum[quiz.courseId] || [] : [];

    const toggleChapter = (chapterId: string) => {
        const newCollapsed = new Set(collapsedChapters);
        if (newCollapsed.has(chapterId)) {
            newCollapsed.delete(chapterId);
        } else {
            newCollapsed.add(chapterId);
        }
        setCollapsedChapters(newCollapsed);
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.questionText || currentQuestion.answers.some(a => !a.answerText)) {
            alert("Please fill in all question and answer fields");
            return;
        }
        if (!currentQuestion.answers.some(a => a.isCorrect)) {
            alert("Please mark at least one answer as correct");
            return;
        }

        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, { ...currentQuestion, orderIndex: prev.questions.length }]
        }));

        setCurrentQuestion({
            type: QuestionType.SINGLE_CHOICE,
            questionText: "",
            orderIndex: 0,
            points: 10,
            explanation: "",
            answers: [
                { answerText: "", isCorrect: false, orderIndex: 0 },
                { answerText: "", isCorrect: false, orderIndex: 1 },
                { answerText: "", isCorrect: false, orderIndex: 2 },
                { answerText: "", isCorrect: false, orderIndex: 3 }
            ]
        });
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestionToDelete(index);
        setShowDeleteDialog(true);
    };

    const confirmDeleteQuestion = () => {
        if (questionToDelete === null) return;
        
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== questionToDelete)
        }));
        
        setShowDeleteDialog(false);
        setQuestionToDelete(null);
        setEditingQuestionIndex(null);
        setExpandedQuestionIndex(null);
    };

    const handleEditQuestion = (index: number) => {
        setEditingQuestionIndex(index);
        setExpandedQuestionIndex(index);
    };

    const handleSaveEditedQuestion = (index: number) => {
        setEditingQuestionIndex(null);
        setExpandedQuestionIndex(null);
    };

    const handleCancelEdit = () => {
        setEditingQuestionIndex(null);
        setExpandedQuestionIndex(null);
    };

    const handleUpdateQuestion = (index: number, field: string, value: any) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === index ? { ...q, [field]: value } : q
            )
        }));
    };

    const handleUpdateAnswer = (questionIndex: number, answerIndex: number, field: string, value: any) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => {
                if (i === questionIndex) {
                    const newAnswers = [...q.answers];
                    if (field === 'isCorrect' && value === true) {
                        // For single choice, uncheck other answers
                        newAnswers.forEach((a, idx) => {
                            newAnswers[idx] = { ...a, isCorrect: idx === answerIndex };
                        });
                    } else {
                        newAnswers[answerIndex] = { ...newAnswers[answerIndex], [field]: value };
                    }
                    return { ...q, answers: newAnswers };
                }
                return q;
            })
        }));
    };

    const toggleQuestionExpanded = (index: number) => {
        if (editingQuestionIndex === index) return; // Don't collapse if editing
        setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
    };

    const handleSaveQuiz = () => {
        if (!quiz.courseId || quiz.courseId === 0) {
            alert("Please select a course");
            return;
        }
        if (!quiz.title) {
            alert("Please enter a quiz title");
            return;
        }
        if (quiz.type === QuizType.LESSON_QUIZ && !quiz.lessonId) {
            alert("Please select a lesson for this lesson quiz");
            return;
        }
        if (quiz.questions.length === 0) {
            alert("Please add at least one question");
            return;
        }

        console.log("Saving quiz:", quiz);
        console.log("QuizCreationRequest:", {
            ...quiz,
            startTime: quiz.startTime?.toISOString(),
            endTime: quiz.endTime?.toISOString()
        });
        // TODO: Call API to save quiz
        router.push("/teacher/quizzes");
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Create New Quiz</h1>
                    <p className="text-muted-foreground mt-1">
                        Set up your quiz and add questions
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSaveQuiz}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Quiz
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quiz Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>General details about your quiz</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="course">Course *</Label>
                                <Select
                                    value={quiz.courseId?.toString()}
                                    onValueChange={(value) => {
                                        setQuiz({ ...quiz, courseId: parseInt(value), lessonId: undefined });
                                    }}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockCourses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="title">Quiz Title *</Label>
                                <Input
                                    id="title"
                                    value={quiz.title}
                                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                                    placeholder="Enter quiz title"
                                    className="mt-1.5"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={quiz.description}
                                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                                    placeholder="Describe what this quiz covers"
                                    className="mt-1.5"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startTime">Start Date & Time</Label>
                                    <Input
                                        id="startTime"
                                        type="datetime-local"
                                        value={quiz.startTime ? new Date(quiz.startTime).toISOString().slice(0, 16) : ""}
                                        onChange={(e) => setQuiz({ ...quiz, startTime: e.target.value ? new Date(e.target.value) : undefined })}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endTime">End Date & Time</Label>
                                    <Input
                                        id="endTime"
                                        type="datetime-local"
                                        value={quiz.endTime ? new Date(quiz.endTime).toISOString().slice(0, 16) : ""}
                                        onChange={(e) => setQuiz({ ...quiz, endTime: e.target.value ? new Date(e.target.value) : undefined })}
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="type">Quiz Type *</Label>
                                    <Select
                                        value={quiz.type}
                                        onValueChange={(value: QuizType) => setQuiz({ ...quiz, type: value, lessonId: value === QuizType.COURSE_QUIZ ? undefined : quiz.lessonId })}
                                    >
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={QuizType.LESSON_QUIZ}>Lesson Quiz</SelectItem>
                                            <SelectItem value={QuizType.COURSE_QUIZ}>Course Quiz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="scoring">Scoring Method</Label>
                                    <Select
                                        value={quiz.scoringMethod}
                                        onValueChange={(value: ScoringMethod) => setQuiz({ ...quiz, scoringMethod: value })}
                                    >
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ScoringMethod.HIGHEST}>Highest Score</SelectItem>
                                            <SelectItem value={ScoringMethod.LATEST}>Latest Attempt</SelectItem>
                                            <SelectItem value={ScoringMethod.AVERAGE}>Average Score</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="timeLimit">Time Limit (min)</Label>
                                    <Input
                                        id="timeLimit"
                                        type="number"
                                        value={quiz.timeLimitMinutes}
                                        onChange={(e) => setQuiz({ ...quiz, timeLimitMinutes: parseInt(e.target.value) })}
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="maxAttempts">Max Attempts</Label>
                                    <Input
                                        id="maxAttempts"
                                        type="number"
                                        value={quiz.maxAttempts}
                                        onChange={(e) => setQuiz({ ...quiz, maxAttempts: parseInt(e.target.value) })}
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="passing">Passing %</Label>
                                    <Input
                                        id="passing"
                                        type="number"
                                        value={quiz.passingPercentage}
                                        onChange={(e) => setQuiz({ ...quiz, passingPercentage: parseFloat(e.target.value) })}
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>Options</Label>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Shuffle Questions</span>
                                    <Switch
                                        checked={quiz.shuffleQuestions}
                                        onCheckedChange={(checked) => setQuiz({ ...quiz, shuffleQuestions: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Shuffle Answers</span>
                                    <Switch
                                        checked={quiz.shuffleAnswers}
                                        onCheckedChange={(checked) => setQuiz({ ...quiz, shuffleAnswers: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Show Results After Submission</span>
                                    <Switch
                                        checked={quiz.showResults}
                                        onCheckedChange={(checked) => setQuiz({ ...quiz, showResults: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Show Correct Answers</span>
                                    <Switch
                                        checked={quiz.showCorrectAnswers}
                                        onCheckedChange={(checked) => setQuiz({ ...quiz, showCorrectAnswers: checked })}
                                    />
                                </div>
                            </div>

                            {/* Conditional Lesson Selection */}
                            {quiz.type === QuizType.LESSON_QUIZ && quiz.courseId > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        <Label>Select Lesson *</Label>
                                        <p className="text-xs text-muted-foreground">Choose which lesson this quiz belongs to</p>
                                        
                                        {selectedCourseCurriculum.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p className="text-sm">No curriculum available for this course</p>
                                            </div>
                                        ) : (
                                            <RadioGroup
                                                value={quiz.lessonId?.toString()}
                                                onValueChange={(value) => setQuiz({ ...quiz, lessonId: parseInt(value) })}
                                            >
                                                <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-lg p-3">
                                                    {selectedCourseCurriculum.map((chapter) => (
                                                        <div key={chapter._id} className="space-y-2">
                                                            {/* Chapter Header */}
                                                            <div
                                                                className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                                                                onClick={() => toggleChapter(chapter._id)}
                                                            >
                                                                {collapsedChapters.has(chapter._id) ? (
                                                                    <ChevronRight className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )}
                                                                <span className="font-semibold text-sm">
                                                                    {chapter.title}
                                                                </span>
                                                                <Badge variant="secondary" className="ml-auto">
                                                                    {chapter.lessons.length} lessons
                                                                </Badge>
                                                            </div>

                                                            {/* Lessons */}
                                                            {!collapsedChapters.has(chapter._id) && (
                                                                <div className="ml-6 space-y-1">
                                                                    {chapter.lessons.map((lesson) => (
                                                                        <div
                                                                            key={lesson._id}
                                                                            className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50"
                                                                        >
                                                                            <RadioGroupItem
                                                                                value={lesson.id?.toString() || ""}
                                                                                id={`lesson-${lesson.id}`}
                                                                            />
                                                                            <Label
                                                                                htmlFor={`lesson-${lesson.id}`}
                                                                                className="flex-1 cursor-pointer text-sm font-normal"
                                                                            >
                                                                                {lesson.title}
                                                                                <span className="text-xs text-muted-foreground ml-2">
                                                                                    ({lesson.duration} min)
                                                                                </span>
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Add Question Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Question</CardTitle>
                            <CardDescription>Create a new question for this quiz</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="questionText">Question Text *</Label>
                                <Textarea
                                    id="questionText"
                                    value={currentQuestion.questionText}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                    placeholder="Enter your question"
                                    className="mt-1.5"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="points">Points</Label>
                                    <Input
                                        id="points"
                                        type="number"
                                        value={currentQuestion.points}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseFloat(e.target.value) })}
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="explanation">Explanation (Optional)</Label>
                                <Textarea
                                    id="explanation"
                                    value={currentQuestion.explanation}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                                    placeholder="Explain the correct answer"
                                    className="mt-1.5"
                                    rows={2}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>Answer Options *</Label>
                                {currentQuestion.answers.map((answer, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <Input
                                            value={answer.answerText}
                                            onChange={(e) => {
                                                const newAnswers = [...currentQuestion.answers];
                                                newAnswers[index].answerText = e.target.value;
                                                setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
                                            }}
                                            placeholder={`Answer option ${index + 1}`}
                                            className="flex-1"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`correct-${index}`} className="text-sm whitespace-nowrap">
                                                Correct
                                            </Label>
                                            <Switch
                                                id={`correct-${index}`}
                                                checked={answer.isCorrect}
                                                onCheckedChange={(checked) => {
                                                    const newAnswers = currentQuestion.answers.map((a, i) => ({
                                                        ...a,
                                                        isCorrect: i === index ? checked : false // Single choice
                                                    }));
                                                    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleAddQuestion} className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                Add Question to Quiz
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {quiz.questions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quiz Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Questions</span>
                                    <span className="font-semibold">{quiz.questions.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Points</span>
                                    <span className="font-semibold">
                                        {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions ({quiz.questions.length})</CardTitle>
                            <CardDescription>Click to expand and edit questions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {quiz.questions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No questions added yet
                                </p>
                            ) : (
                                quiz.questions.map((question, index) => {
                                    const isExpanded = expandedQuestionIndex === index;
                                    const isEditing = editingQuestionIndex === index;

                                    return (
                                        <Card 
                                            key={index} 
                                            className={`border-2 transition-all ${isExpanded ? 'border-primary' : ''}`}
                                        >
                                            <CardContent className="p-4">
                                                {/* Question Header */}
                                                <div 
                                                    className="flex items-start gap-3 cursor-pointer"
                                                    onClick={() => !isEditing && toggleQuestionExpanded(index)}
                                                >
                                                    <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="secondary">Q{index + 1}</Badge>
                                                            <Badge variant="outline">{question.points} pts</Badge>
                                                        </div>
                                                        {!isEditing ? (
                                                            <>
                                                                <p className={`text-sm ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                                                    {question.questionText}
                                                                </p>
                                                                {!isExpanded && (
                                                                    <p className="text-xs text-muted-foreground mt-2">
                                                                        {question.answers.length} answers
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="space-y-3 mt-2" onClick={(e) => e.stopPropagation()}>
                                                                <div>
                                                                    <Label className="text-xs">Question Text</Label>
                                                                    <Textarea
                                                                        value={question.questionText}
                                                                        onChange={(e) => handleUpdateQuestion(index, 'questionText', e.target.value)}
                                                                        className="mt-1"
                                                                        rows={2}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs">Points</Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={question.points}
                                                                        onChange={(e) => handleUpdateQuestion(index, 'points', parseFloat(e.target.value))}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs">Explanation (Optional)</Label>
                                                                    <Textarea
                                                                        value={question.explanation}
                                                                        onChange={(e) => handleUpdateQuestion(index, 'explanation', e.target.value)}
                                                                        className="mt-1"
                                                                        rows={2}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 flex-shrink-0">
                                                        {!isEditing ? (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditQuestion(index);
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveQuestion(index);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSaveEditedQuestion(index);
                                                                    }}
                                                                >
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelEdit();
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expanded/Edit Answers Section */}
                                                {isExpanded && (
                                                    <div className="mt-4 ml-8 space-y-2" onClick={(e) => e.stopPropagation()}>
                                                        <Label className="text-xs font-semibold">Answers</Label>
                                                        {question.answers.map((answer, answerIndex) => (
                                                            <div key={answerIndex} className="flex items-center gap-2">
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                                                                    {String.fromCharCode(65 + answerIndex)}
                                                                </div>
                                                                {isEditing ? (
                                                                    <>
                                                                        <Input
                                                                            value={answer.answerText}
                                                                            onChange={(e) => handleUpdateAnswer(index, answerIndex, 'answerText', e.target.value)}
                                                                            className="flex-1 text-sm"
                                                                        />
                                                                        <div className="flex items-center gap-1">
                                                                            <Label className="text-xs">Correct</Label>
                                                                            <Switch
                                                                                checked={answer.isCorrect}
                                                                                onCheckedChange={(checked) => handleUpdateAnswer(index, answerIndex, 'isCorrect', checked)}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className={`flex-1 text-sm ${answer.isCorrect ? 'font-semibold text-green-600' : ''}`}>
                                                                            {answer.answerText}
                                                                        </span>
                                                                        {answer.isCorrect && (
                                                                            <Badge variant="default" className="bg-green-600">
                                                                                Correct
                                                                            </Badge>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                        
                                                        {question.explanation && !isEditing && (
                                                            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs">
                                                                <strong>Explanation:</strong> {question.explanation}
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
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteQuestion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
