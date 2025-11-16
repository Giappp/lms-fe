"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { 
    QuizUpdateRequest, 
    QuestionRequest, 
    QuestionUpdateRequest, 
    UpdateQuestionOrderRequest,
    AnswerRequest 
} from "@/types/request";
import { QuizDetailResponse, QuestionResponse } from "@/types/response";
import { QuestionType, QuizType, ScoringMethod } from "@/types/enum";
import { 
    Save, 
    Plus, 
    Edit, 
    Trash2, 
    GripVertical, 
    ChevronUp, 
    ChevronDown,
    Check,
    X
} from "lucide-react";

// Mock quiz data
const mockQuizData: QuizDetailResponse = {
    id: 1,
    title: "Introduction to React Hooks",
    description: "Test your knowledge of React Hooks including useState, useEffect, useContext, and custom hooks.",
    quizType: QuizType.LESSON_QUIZ,
    courseId: 1,
    lessonId: 5,
    maxAttempts: 3,
    scoringMethod: "HIGHEST" as any,
    passingPercentage: 70,
    timeLimitMinutes: 30,
    isActive: true,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showResults: true,
    showCorrectAnswers: true,
    questionCount: 3,
    totalPoints: 30,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    questions: [
        {
            id: 1,
            type: QuestionType.SINGLE_CHOICE,
            questionText: "What is the purpose of useState hook in React?",
            orderIndex: 1,
            points: 10,
            explanation: "useState is a Hook that lets you add React state to function components.",
            answers: [
                { id: 1, answerText: "To add state management to functional components", isCorrect: true, orderIndex: 1 },
                { id: 2, answerText: "To handle side effects", isCorrect: false, orderIndex: 2 },
                { id: 3, answerText: "To create context providers", isCorrect: false, orderIndex: 3 },
                { id: 4, answerText: "To optimize performance", isCorrect: false, orderIndex: 4 }
            ]
        },
        {
            id: 2,
            type: QuestionType.SINGLE_CHOICE,
            questionText: "When does useEffect run by default?",
            orderIndex: 2,
            points: 10,
            explanation: "By default, useEffect runs after every render, including the first render.",
            answers: [
                { id: 5, answerText: "Only on component mount", isCorrect: false, orderIndex: 1 },
                { id: 6, answerText: "After every render", isCorrect: true, orderIndex: 2 },
                { id: 7, answerText: "Only when dependencies change", isCorrect: false, orderIndex: 3 },
                { id: 8, answerText: "Before every render", isCorrect: false, orderIndex: 4 }
            ]
        },
        {
            id: 3,
            type: QuestionType.SINGLE_CHOICE,
            questionText: "What does the dependency array in useEffect control?",
            orderIndex: 3,
            points: 10,
            explanation: "The dependency array determines when the effect should re-run based on value changes.",
            answers: [
                { id: 9, answerText: "When the effect should re-run", isCorrect: true, orderIndex: 1 },
                { id: 10, answerText: "Which props to pass down", isCorrect: false, orderIndex: 2 },
                { id: 11, answerText: "The render order", isCorrect: false, orderIndex: 3 },
                { id: 12, answerText: "The cleanup function", isCorrect: false, orderIndex: 4 }
            ]
        }
    ]
};

export default function EditQuizPage({ params }: { params: { quizId: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<QuizDetailResponse>(mockQuizData);
    const [questions, setQuestions] = useState<QuestionResponse[]>(mockQuizData.questions);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

    // Quiz update form state
    const [quizUpdateForm, setQuizUpdateForm] = useState<QuizUpdateRequest>({
        title: quiz.title,
        description: quiz.description,
        timeLimitMinutes: quiz.timeLimitMinutes,
        maxAttempts: quiz.maxAttempts,
        passingPercentage: quiz.passingPercentage,
        scoringMethod: quiz.scoringMethod,
        shuffleQuestions: quiz.shuffleQuestions,
        shuffleAnswers: quiz.shuffleAnswers,
        showResults: quiz.showResults,
        showCorrectAnswers: quiz.showCorrectAnswers,
        isActive: quiz.isActive
    });

    // New question form state
    const [newQuestion, setNewQuestion] = useState<QuestionRequest>({
        type: QuestionType.SINGLE_CHOICE,
        questionText: "",
        orderIndex: questions.length + 1,
        points: 10,
        explanation: "",
        answers: [
            { answerText: "", isCorrect: false, orderIndex: 1 },
            { answerText: "", isCorrect: false, orderIndex: 2 },
            { answerText: "", isCorrect: false, orderIndex: 3 },
            { answerText: "", isCorrect: false, orderIndex: 4 }
        ]
    });

    // Handle quiz update
    const handleQuizUpdate = () => {
        console.log("QuizUpdateRequest:", quizUpdateForm);
        // TODO: Call API to update quiz
        alert("Quiz updated successfully! (Check console for QuizUpdateRequest)");
    };

    // Handle question reorder - move up
    const handleMoveQuestionUp = (index: number) => {
        if (index === 0) return;
        const newQuestions = [...questions];
        [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
        
        // Update orderIndex
        const updateOrderRequest: UpdateQuestionOrderRequest = {
            questionOrders: newQuestions.map((q, idx) => ({
                questionId: q.id,
                orderIndex: idx + 1
            }))
        };
        
        console.log("UpdateQuestionOrderRequest:", updateOrderRequest);
        setQuestions(newQuestions);
    };

    // Handle question reorder - move down
    const handleMoveQuestionDown = (index: number) => {
        if (index === questions.length - 1) return;
        const newQuestions = [...questions];
        [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
        
        // Update orderIndex
        const updateOrderRequest: UpdateQuestionOrderRequest = {
            questionOrders: newQuestions.map((q, idx) => ({
                questionId: q.id,
                orderIndex: idx + 1
            }))
        };
        
        console.log("UpdateQuestionOrderRequest:", updateOrderRequest);
        setQuestions(newQuestions);
    };

    // Handle question update
    const handleUpdateQuestion = (questionId: number, updates: Partial<QuestionResponse>) => {
        const questionUpdateRequest: QuestionUpdateRequest = {
            type: updates.type,
            questionText: updates.questionText,
            orderIndex: updates.orderIndex,
            points: updates.points,
            explanation: updates.explanation,
            answers: updates.answers?.map(a => ({
                answerText: a.answerText,
                isCorrect: a.isCorrect ?? false,
                orderIndex: a.orderIndex
            })) || []
        };
        
        console.log("QuestionUpdateRequest:", questionUpdateRequest);
        
        setQuestions(questions.map(q => 
            q.id === questionId ? { ...q, ...updates } : q
        ));
        setEditingQuestionId(null);
        alert("Question updated! (Check console for QuestionUpdateRequest)");
    };

    // Handle add new question
    const handleAddQuestion = () => {
        // Validate
        if (!newQuestion.questionText.trim()) {
            alert("Please enter a question text");
            return;
        }
        
        const validAnswers = newQuestion.answers.filter(a => a.answerText.trim());
        if (validAnswers.length < 2) {
            alert("Please provide at least 2 answers");
            return;
        }
        
        if (!validAnswers.some(a => a.isCorrect)) {
            alert("Please mark at least one answer as correct");
            return;
        }

        console.log("QuestionRequest (Add New):", {
            ...newQuestion,
            answers: validAnswers
        });

        // Add question
        const newQuestionData: QuestionResponse = {
            id: Math.max(...questions.map(q => q.id)) + 1,
            type: newQuestion.type,
            questionText: newQuestion.questionText,
            orderIndex: questions.length + 1,
            points: newQuestion.points,
            explanation: newQuestion.explanation,
            answers: validAnswers.map((a, idx) => ({
                id: Date.now() + idx,
                answerText: a.answerText,
                isCorrect: a.isCorrect,
                orderIndex: idx + 1
            }))
        };

        setQuestions([...questions, newQuestionData]);
        setIsAddingQuestion(false);
        
        // Reset form
        setNewQuestion({
            type: QuestionType.SINGLE_CHOICE,
            questionText: "",
            orderIndex: questions.length + 2,
            points: 10,
            explanation: "",
            answers: [
                { answerText: "", isCorrect: false, orderIndex: 1 },
                { answerText: "", isCorrect: false, orderIndex: 2 },
                { answerText: "", isCorrect: false, orderIndex: 3 },
                { answerText: "", isCorrect: false, orderIndex: 4 }
            ]
        });
        
        alert("Question added! (Check console for QuestionRequest)");
    };

    // Handle delete question
    const handleDeleteQuestion = () => {
        if (questionToDelete === null) return;
        
        console.log("Delete question ID:", questionToDelete);
        setQuestions(questions.filter(q => q.id !== questionToDelete));
        setShowDeleteDialog(false);
        setQuestionToDelete(null);
        alert("Question deleted!");
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <Button 
                variant="ghost" 
                onClick={() => router.push(`/teacher/quizzes/${params.quizId}`)}
                className="mb-4"
            >
                ← Back to Quiz
            </Button>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Quiz</h1>
                    <p className="text-muted-foreground mt-1">
                        Update quiz details, questions, and settings
                    </p>
                </div>
                <Button onClick={handleQuizUpdate} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Quiz Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Quiz title and description</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title *</Label>
                                <Input
                                    id="title"
                                    value={quizUpdateForm.title}
                                    onChange={(e) => setQuizUpdateForm({ ...quizUpdateForm, title: e.target.value })}
                                    placeholder="Enter quiz title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={quizUpdateForm.description}
                                    onChange={(e) => setQuizUpdateForm({ ...quizUpdateForm, description: e.target.value })}
                                    placeholder="Enter quiz description"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quiz Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Settings</CardTitle>
                            <CardDescription>Configure quiz behavior and scoring</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                                    <Input
                                        id="timeLimit"
                                        type="number"
                                        value={quizUpdateForm.timeLimitMinutes}
                                        onChange={(e) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            timeLimitMinutes: parseInt(e.target.value) 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxAttempts">Max Attempts</Label>
                                    <Input
                                        id="maxAttempts"
                                        type="number"
                                        value={quizUpdateForm.maxAttempts}
                                        onChange={(e) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            maxAttempts: parseInt(e.target.value) 
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="passing">Passing Percentage</Label>
                                    <Input
                                        id="passing"
                                        type="number"
                                        value={quizUpdateForm.passingPercentage}
                                        onChange={(e) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            passingPercentage: parseInt(e.target.value) 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="scoring">Scoring Method</Label>
                                    <Select
                                        value={quizUpdateForm.scoringMethod}
                                        onValueChange={(value: any) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            scoringMethod: value 
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HIGHEST">Highest Score</SelectItem>
                                            <SelectItem value="LATEST">Latest Score</SelectItem>
                                            <SelectItem value="AVERAGE">Average Score</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Shuffle Questions</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Randomize question order for each attempt
                                        </p>
                                    </div>
                                    <Switch
                                        checked={quizUpdateForm.shuffleQuestions}
                                        onCheckedChange={(checked) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            shuffleQuestions: checked 
                                        })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Shuffle Answers</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Randomize answer choices within questions
                                        </p>
                                    </div>
                                    <Switch
                                        checked={quizUpdateForm.shuffleAnswers}
                                        onCheckedChange={(checked) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            shuffleAnswers: checked 
                                        })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show Results</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display score immediately after submission
                                        </p>
                                    </div>
                                    <Switch
                                        checked={quizUpdateForm.showResults}
                                        onCheckedChange={(checked) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            showResults: checked 
                                        })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show Correct Answers</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Reveal correct answers after submission
                                        </p>
                                    </div>
                                    <Switch
                                        checked={quizUpdateForm.showCorrectAnswers}
                                        onCheckedChange={(checked) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            showCorrectAnswers: checked 
                                        })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Active Status</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Make quiz available to students
                                        </p>
                                    </div>
                                    <Switch
                                        checked={quizUpdateForm.isActive}
                                        onCheckedChange={(checked) => setQuizUpdateForm({ 
                                            ...quizUpdateForm, 
                                            isActive: checked 
                                        })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions Management */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Questions ({questions.length})</CardTitle>
                                    <CardDescription>Manage quiz questions and answers</CardDescription>
                                </div>
                                <Button 
                                    onClick={() => setIsAddingQuestion(true)}
                                    disabled={isAddingQuestion}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Question
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* New Question Form */}
                            {isAddingQuestion && (
                                <Card className="border-2 border-primary">
                                    <CardHeader>
                                        <CardTitle className="text-lg">New Question</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Question Type</Label>
                                                <Select
                                                    value={newQuestion.type}
                                                    onValueChange={(value: QuestionType) => 
                                                        setNewQuestion({ ...newQuestion, type: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={QuestionType.SINGLE_CHOICE}>Single Choice</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Points</Label>
                                                <Input
                                                    type="number"
                                                    value={newQuestion.points}
                                                    onChange={(e) => setNewQuestion({ 
                                                        ...newQuestion, 
                                                        points: parseInt(e.target.value) 
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Question Text *</Label>
                                            <Textarea
                                                value={newQuestion.questionText}
                                                onChange={(e) => setNewQuestion({ 
                                                    ...newQuestion, 
                                                    questionText: e.target.value 
                                                })}
                                                placeholder="Enter your question"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Answers (at least 2 required) *</Label>
                                            {newQuestion.answers.map((answer, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                                                        {String.fromCharCode(65 + idx)}
                                                    </Badge>
                                                    <Input
                                                        value={answer.answerText}
                                                        onChange={(e) => {
                                                            const newAnswers = [...newQuestion.answers];
                                                            newAnswers[idx].answerText = e.target.value;
                                                            setNewQuestion({ ...newQuestion, answers: newAnswers });
                                                        }}
                                                        placeholder={`Answer ${idx + 1}`}
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant={answer.isCorrect ? "default" : "outline"}
                                                        onClick={() => {
                                                            const newAnswers = [...newQuestion.answers];
                                                            newAnswers[idx].isCorrect = !newAnswers[idx].isCorrect;
                                                            setNewQuestion({ ...newQuestion, answers: newAnswers });
                                                        }}
                                                    >
                                                        {answer.isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Explanation (optional)</Label>
                                            <Textarea
                                                value={newQuestion.explanation}
                                                onChange={(e) => setNewQuestion({ 
                                                    ...newQuestion, 
                                                    explanation: e.target.value 
                                                })}
                                                placeholder="Explain the correct answer"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={handleAddQuestion}>
                                                Add Question
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setIsAddingQuestion(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Existing Questions */}
                            {questions.map((question, index) => (
                                <Card key={question.id} className="border-2">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6"
                                                        onClick={() => handleMoveQuestionUp(index)}
                                                        disabled={index === 0}
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6"
                                                        onClick={() => handleMoveQuestionDown(index)}
                                                        disabled={index === questions.length - 1}
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="secondary">Q{index + 1}</Badge>
                                                        <Badge variant="outline">{question.type}</Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {question.points} points
                                                        </span>
                                                    </div>
                                                    <p className="font-medium">{question.questionText}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => setEditingQuestionId(
                                                        editingQuestionId === question.id ? null : question.id
                                                    )}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setQuestionToDelete(question.id);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {editingQuestionId === question.id ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Question Text</Label>
                                                    <Textarea
                                                        value={question.questionText}
                                                        onChange={(e) => {
                                                            const updated = questions.map(q => 
                                                                q.id === question.id 
                                                                    ? { ...q, questionText: e.target.value }
                                                                    : q
                                                            );
                                                            setQuestions(updated);
                                                        }}
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Answers</Label>
                                                    {question.answers.map((answer, idx) => (
                                                        <div key={answer.id} className="flex items-center gap-2">
                                                            <Badge variant="outline">
                                                                {String.fromCharCode(65 + idx)}
                                                            </Badge>
                                                            <Input
                                                                value={answer.answerText}
                                                                onChange={(e) => {
                                                                    const updated = questions.map(q => {
                                                                        if (q.id === question.id) {
                                                                            const newAnswers = [...q.answers];
                                                                            newAnswers[idx] = {
                                                                                ...newAnswers[idx],
                                                                                answerText: e.target.value
                                                                            };
                                                                            return { ...q, answers: newAnswers };
                                                                        }
                                                                        return q;
                                                                    });
                                                                    setQuestions(updated);
                                                                }}
                                                            />
                                                            <Button
                                                                size="icon"
                                                                variant={answer.isCorrect ? "default" : "outline"}
                                                                onClick={() => {
                                                                    const updated = questions.map(q => {
                                                                        if (q.id === question.id) {
                                                                            const newAnswers = q.answers.map((a, i) => ({
                                                                                ...a,
                                                                                isCorrect: i === idx ? !a.isCorrect : a.isCorrect
                                                                            }));
                                                                            return { ...q, answers: newAnswers };
                                                                        }
                                                                        return q;
                                                                    });
                                                                    setQuestions(updated);
                                                                }}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdateQuestion(question.id, question)}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setQuestions(mockQuizData.questions);
                                                            setEditingQuestionId(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {question.answers.map((answer, idx) => (
                                                    <div 
                                                        key={answer.id} 
                                                        className={`flex items-center gap-2 p-2 rounded ${
                                                            answer.isCorrect 
                                                                ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' 
                                                                : 'bg-muted'
                                                        }`}
                                                    >
                                                        <Badge variant="outline">
                                                            {String.fromCharCode(65 + idx)}
                                                        </Badge>
                                                        <span className="flex-1">{answer.answerText}</span>
                                                        {answer.isCorrect && (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        )}
                                                    </div>
                                                ))}
                                                {question.explanation && (
                                                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded text-sm">
                                                        <strong>Explanation:</strong> {question.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quiz Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Questions</span>
                                <Badge>{questions.length}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Points</span>
                                <Badge>{questions.reduce((sum, q) => sum + q.points, 0)}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={quizUpdateForm.isActive ? "default" : "secondary"}>
                                    {quizUpdateForm.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>• Changes are saved automatically</p>
                                <p>• Question order can be changed</p>
                                <p>• Click Save to apply all changes</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Request DTOs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            <div className="p-2 bg-muted rounded">
                                <strong>QuizUpdateRequest</strong>
                                <p className="text-muted-foreground">Main quiz settings</p>
                            </div>
                            <div className="p-2 bg-muted rounded">
                                <strong>QuestionRequest</strong>
                                <p className="text-muted-foreground">Add new question</p>
                            </div>
                            <div className="p-2 bg-muted rounded">
                                <strong>QuestionUpdateRequest</strong>
                                <p className="text-muted-foreground">Edit existing question</p>
                            </div>
                            <div className="p-2 bg-muted rounded">
                                <strong>UpdateQuestionOrderRequest</strong>
                                <p className="text-muted-foreground">Reorder questions</p>
                            </div>
                            <p className="text-muted-foreground pt-2">
                                Check browser console to see the DTOs when performing actions
                            </p>
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
                        <AlertDialogAction onClick={handleDeleteQuestion}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
