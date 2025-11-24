import {QuestionRequest, QuizCreationRequest} from "@/types";
import React from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {AlertCircle, CheckCircle2, Circle, Clock, FileText, Percent, Repeat, Target} from "lucide-react";
import QuestionTypeBadge from "@/components/teacher/quizzes/QuizBadge";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Alert, AlertDescription} from "@/components/ui/alert";

const QuizPreview = ({
                         quiz,
                         questions
                     }: {
    quiz: Partial<QuizCreationRequest>;
    questions: QuestionRequest[];
}) => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{quiz.title || 'Untitled Quiz'}</CardTitle>
                                <CardDescription className="mt-2">
                                    {quiz.description || 'No description provided'}
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                {quiz.type || 'PRACTICE'}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <FileText className="w-3 h-3"/>
                                {questions.length} Question{questions.length !== 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Target className="w-3 h-3"/>
                                {totalPoints} Total Points
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="w-3 h-3"/>
                                {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : 'No limit'}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Repeat className="w-3 h-3"/>
                                {quiz.maxAttempts === -1 ? 'Unlimited' : `${quiz.maxAttempts} attempt${quiz.maxAttempts !== 1 ? 's' : ''}`}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Percent className="w-3 h-3"/>
                                {quiz.passingPercentage}% to pass
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {questions.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <FileText className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">No questions yet</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Add questions to see the preview
                            </p>
                        </div>
                    </div>
                </Card>
            ) : (
                questions.map((question, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold">Question {index + 1}</span>
                                        <QuestionTypeBadge type={question.type}/>
                                        <Badge variant="outline" className="text-xs">
                                            {question.points} pt{question.points !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                    <p className="text-foreground text-base">{question.questionText || 'No question text'}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') && (
                                <div className="space-y-2">
                                    {question.answers.map((answer, answerIndex) => (
                                        <div
                                            key={answerIndex}
                                            className={`p-3 rounded-lg border transition-colors ${
                                                answer.isCorrect
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:bg-accent/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0"/>
                                                <span
                                                    className="flex-1">{answer.answerText || `Option ${answerIndex + 1}`}</span>
                                                {answer.isCorrect && (
                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0"/>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {question.type === 'SHORT_ANSWER' && (
                                <Input
                                    placeholder="Student answer will appear here..."
                                    disabled
                                    className="bg-muted"
                                />
                            )}

                            {question.type === 'ESSAY' && (
                                <Textarea
                                    placeholder="Student essay response will appear here..."
                                    disabled
                                    className="min-h-[120px] bg-muted resize-none"
                                />
                            )}

                            {question.explanation && (
                                <Alert className="bg-accent/50">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertDescription>
                                        <span className="font-medium">Explanation: </span>
                                        {question.explanation}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};
export default QuizPreview
