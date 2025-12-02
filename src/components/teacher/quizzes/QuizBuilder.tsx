"use client"
import React, {useState} from 'react'
import {useRouter} from 'next/navigation';
import {QuestionType} from "@/types/enum"; // Use the imported enum
import {Button} from "@/components/ui/button";
import {AlertCircle, Eye, FileText, Loader2, Plus, Save, Target} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";

// Sub-components
import QuestionCard from "@/components/teacher/quizzes/QuestionCard";
import QuizSettings from "@/components/teacher/quizzes/QuizSettings";
import QuizPreview from "@/components/teacher/quizzes/QuizPreview";
import {useQuizBuilder} from "@/hooks/useQuizBuilder";
import {useMyCoursesDropdown} from "@/hooks/useCourses";

// Configuration for Add Buttons
const ADD_BUTTONS = [
    {
        type: QuestionType.MULTIPLE_CHOICE,
        label: 'Multiple Choice',
        colorClass: 'hover:bg-primary/5 hover:border-primary'
    },
    {type: QuestionType.TRUE_FALSE, label: 'True/False', colorClass: 'hover:bg-blue-500/5 hover:border-blue-500'},
    {
        type: QuestionType.SINGLE_CHOICE,
        label: 'Single Choice',
        colorClass: 'hover:bg-purple-500/5 hover:border-purple-500'
    }
];

const QuizBuilder = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('build');
    const { courses, isLoading: isLoadingCourses } = useMyCoursesDropdown();

    const {
        quiz,
        setQuiz,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        saveQuiz,
        isSaving,
        stats
    } = useQuizBuilder();

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Quiz Builder</h1>
                        <p className="text-sm text-muted-foreground mt-1">Create and customize your quiz assessment</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => setActiveTab('preview')}>
                            <Eye className="w-4 h-4"/>
                            Preview
                        </Button>
                        <Button
                            className="gap-2"
                            onClick={async () => {
                                const result = await saveQuiz();
                                if (result.success) {
                                    const quizId = (result as any).data?.id;
                                    if (quizId) {
                                        router.push(`/teacher/quizzes/${quizId}/edit`);
                                    } else {
                                        router.push('/teacher/quizzes');
                                    }
                                }
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            {isSaving ? 'Saving...' : 'Save Quiz'}
                        </Button>
                    </div>
                </div>

                {/* Quiz Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Details</CardTitle>
                        <CardDescription>Configure the basic information for this assessment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quiz-title">
                                    Quiz Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="quiz-title"
                                    value={quiz.title}
                                    onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                                    placeholder="e.g., Mid-Term Assessment"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quiz-course">
                                    Course <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={quiz.courseId?.toString()}
                                    onValueChange={(value) => setQuiz({...quiz, courseId: parseInt(value)})}
                                    disabled={isLoadingCourses}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select a course"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map(course => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quiz-description">Description</Label>
                            <Textarea
                                id="quiz-description"
                                value={quiz.description}
                                onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                                placeholder="Provide instructions, context, or objectives..."
                                className="min-h-[80px] resize-none"
                            />
                        </div>

                        {/* Stats Footer */}
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t mt-4">
                            <Badge variant="secondary" className="gap-1">
                                <FileText className="w-3 h-3"/>
                                {stats.totalQuestions} Questions
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <Target className="w-3 h-3"/>
                                {stats.totalPoints} Points
                            </Badge>
                            {stats.hasErrors && (
                                <Badge variant="destructive" className="gap-1">
                                    <AlertCircle className="w-3 h-3"/>
                                    Incomplete Items
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="build">Build</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="build" className="space-y-6 mt-6">
                        {/* Questions List */}
                        <div className="space-y-4">
                            {questions.length === 0 && (
                                <div
                                    className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                                    <p>No questions added yet. Start by adding one below.</p>
                                </div>
                            )}

                            {questions.map((question, index) => (
                                <QuestionCard
                                    key={`${question.type}-${index}`} // Better key strategy might be needed if you implement DnD
                                    question={question}
                                    index={index}
                                    onUpdate={updateQuestion}
                                    onDelete={deleteQuestion}
                                    onDuplicate={duplicateQuestion}
                                />
                            ))}
                        </div>

                        {/* Add Question Area */}
                        <Card className="border-dashed border-2 bg-muted/30">
                            <CardContent className="pt-6">
                                <div className="text-center mb-4">
                                    <h3 className="font-semibold text-foreground">Add New Question</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {ADD_BUTTONS.map((btn) => (
                                        <Button
                                            key={btn.type}
                                            variant="outline"
                                            onClick={() => addQuestion(btn.type)}
                                            className={`flex-col h-auto py-4 transition-all ${btn.colorClass}`}
                                        >
                                            <Plus className="w-5 h-5 mb-2"/>
                                            <span className="text-xs font-medium">{btn.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <QuizSettings quiz={quiz} onUpdate={setQuiz}/>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-6">
                        <QuizPreview quiz={quiz} questions={questions}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default QuizBuilder;