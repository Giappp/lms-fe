"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizAnalyticsResponse, QuestionAnalyticsItem } from "@/types/response";
import { Users, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, Target } from "lucide-react";

// Mock data
const mockAnalytics: QuizAnalyticsResponse = {
    quizId: 1,
    quizTitle: "Introduction to React Hooks",
    totalAttempts: 45,
    totalStudents: 28,
    completedAttempts: 42,
    inProgressAttempts: 3,
    averageScore: 78.5,
    highestScore: 98,
    lowestScore: 45,
    passRate: 82.5,
    averageTimeSpentMinutes: 23.5,
    questionAnalytics: [
        {
            questionId: 1,
            questionText: "What is the purpose of useState hook in React?",
            totalAttempts: 42,
            correctAttempts: 38,
            correctPercentage: 90.5,
            averageTimeSeconds: 45
        },
        {
            questionId: 2,
            questionText: "When does useEffect run by default?",
            totalAttempts: 42,
            correctAttempts: 28,
            correctPercentage: 66.7,
            averageTimeSeconds: 62
        },
        {
            questionId: 3,
            questionText: "What does the dependency array in useEffect control?",
            totalAttempts: 42,
            correctAttempts: 35,
            correctPercentage: 83.3,
            averageTimeSeconds: 52
        }
    ]
};

export default function QuizAnalyticsPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{mockAnalytics.quizTitle}</h1>
                <p className="text-muted-foreground mt-1">Quiz performance analytics and insights</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockAnalytics.totalStudents}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {mockAnalytics.totalAttempts} attempts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockAnalytics.averageScore.toFixed(1)}%</div>
                        <Progress value={mockAnalytics.averageScore} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                            <Target className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockAnalytics.passRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {Math.round((mockAnalytics.passRate / 100) * mockAnalytics.completedAttempts)} passed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                            <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockAnalytics.averageTimeSpentMinutes.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1">minutes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Score Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Score Distribution</CardTitle>
                            <CardDescription>Student performance breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-950/30">
                                    <div className="flex justify-center mb-2">
                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        {mockAnalytics.highestScore}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">Highest Score</p>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                                    <div className="flex justify-center mb-2">
                                        <Target className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                        {mockAnalytics.averageScore.toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">Average Score</p>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-orange-100 dark:bg-orange-950/30">
                                    <div className="flex justify-center mb-2">
                                        <TrendingDown className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                        {mockAnalytics.lowestScore}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">Lowest Score</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Pass Rate</span>
                                    <span className="text-sm font-bold">{mockAnalytics.passRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={mockAnalytics.passRate} className="h-3" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attempt Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attempt Status</CardTitle>
                            <CardDescription>Current quiz completion status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-100 dark:bg-green-950/30">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                            {mockAnalytics.completedAttempts}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Completed</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-100 dark:bg-orange-950/30">
                                    <Clock className="h-8 w-8 text-orange-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                            {mockAnalytics.inProgressAttempts}
                                        </p>
                                        <p className="text-xs text-muted-foreground">In Progress</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="questions" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Performance</CardTitle>
                            <CardDescription>Analyze how students performed on each question</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {mockAnalytics.questionAnalytics.map((question, index) => (
                                <div key={question.questionId} className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="secondary">Q{index + 1}</Badge>
                                                <Badge 
                                                    variant={question.correctPercentage >= 80 ? "default" : question.correctPercentage >= 60 ? "outline" : "destructive"}
                                                >
                                                    {question.correctPercentage.toFixed(1)}% correct
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium">{question.questionText}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span className="text-muted-foreground">Correct:</span>
                                            <span className="font-semibold">{question.correctAttempts}/{question.totalAttempts}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-600" />
                                            <span className="text-muted-foreground">Incorrect:</span>
                                            <span className="font-semibold">{question.totalAttempts - question.correctAttempts}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span className="text-muted-foreground">Avg Time:</span>
                                            <span className="font-semibold">{question.averageTimeSeconds}s</span>
                                        </div>
                                    </div>

                                    <Progress value={question.correctPercentage} className="h-2" />

                                    {index < mockAnalytics.questionAnalytics.length - 1 && (
                                        <div className="pt-4">
                                            <div className="border-t" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
