"use client"
import React, {useState} from 'react'
import {AnswerRequest, QuestionRequest} from "@/types";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {CheckCircle2, ChevronDown, ChevronUp, Circle, Copy, GripVertical, Plus, Trash2, X} from "lucide-react";
import QuestionTypeBadge from "@/components/teacher/quizzes/QuizBadge";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {QuestionType} from "@/types/enum";

const QuestionCard = ({
                          question,
                          index,
                          onUpdate,
                          onDelete,
                          onDuplicate
                      }: {
    question: QuestionRequest;
    index: number;
    onUpdate: (index: number, updated: QuestionRequest) => void;
    onDelete: (index: number) => void;
    onDuplicate: (index: number) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const updateQuestion = (field: keyof QuestionRequest, value: any) => {
        onUpdate(index, {...question, [field]: value});
    };

    const updateAnswer = (answerIndex: number, field: keyof AnswerRequest, value: any) => {
        const newAnswers = [...question.answers];
        newAnswers[answerIndex] = {...newAnswers[answerIndex], [field]: value};
        updateQuestion('answers', newAnswers);
    };

    const addAnswer = () => {
        const newAnswer: AnswerRequest = {
            answerText: '',
            isCorrect: false,
            orderIndex: question.answers.length
        };
        updateQuestion('answers', [...question.answers, newAnswer]);
    };

    const removeAnswer = (answerIndex: number) => {
        const newAnswers = question.answers
            .filter((_, i) => i !== answerIndex)
            .map((ans, i) => ({...ans, orderIndex: i}));
        updateQuestion('answers', newAnswers);
    };

    const setCorrectAnswer = (answerIndex: number) => {
        const newAnswers = question.answers.map((ans, i) => ({
            ...ans,
            isCorrect: i === answerIndex
        }));
        updateQuestion('answers', newAnswers);
    };

    const needsAnswers = question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE';

    return (
        <Card className="relative group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-5 h-5 text-muted-foreground"/>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-foreground">Question {index + 1}</span>
                                <QuestionTypeBadge type={question.type}/>
                                <Badge variant="outline" className="text-xs">
                                    {question.points} {question.points === 1 ? 'point' : 'points'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-8 w-8 p-0"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDuplicate(index)}
                            className="h-8 w-8 p-0"
                        >
                            <Copy className="w-4 h-4"/>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Question Text <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            value={question.questionText}
                            onChange={(e) => updateQuestion('questionText', e.target.value)}
                            placeholder="Enter your question here..."
                            className="min-h-[80px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Points</Label>
                            <Input
                                type="number"
                                min="0"
                                value={question.points}
                                onChange={(e) => updateQuestion('points', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Question Type</Label>
                            <Select
                                value={question.type}
                                onValueChange={(value: QuestionType) => {
                                    const answers = value === 'TRUE_FALSE'
                                        ? [
                                            {answerText: 'True', isCorrect: false, orderIndex: 0},
                                            {answerText: 'False', isCorrect: false, orderIndex: 1}
                                        ]
                                        : value === 'MULTIPLE_CHOICE'
                                            ? [
                                                {answerText: '', isCorrect: false, orderIndex: 0},
                                                {answerText: '', isCorrect: false, orderIndex: 1}
                                            ]
                                            : [];
                                    onUpdate(index, {...question, type: value, answers});
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                                    <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                                    <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                                    <SelectItem value="ESSAY">Essay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {needsAnswers && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Answer Options <span className="text-destructive">*</span>
                            </Label>
                            <div className="space-y-2">
                                {question.answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="p-2 flex-shrink-0"
                                            onClick={() => setCorrectAnswer(answerIndex)}
                                        >
                                            {answer.isCorrect ? (
                                                <CheckCircle2 className="w-5 h-5 text-primary"/>
                                            ) : (
                                                <Circle className="w-5 h-5 text-muted-foreground"/>
                                            )}
                                        </Button>
                                        <Input
                                            value={answer.answerText}
                                            onChange={(e) => updateAnswer(answerIndex, 'answerText', e.target.value)}
                                            placeholder={`Option ${answerIndex + 1}`}
                                            className="flex-1"
                                            disabled={question.type === 'TRUE_FALSE'}
                                        />
                                        {question.type === 'MULTIPLE_CHOICE' && question.answers.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeAnswer(answerIndex)}
                                                className="p-2 flex-shrink-0 text-destructive hover:text-destructive"
                                            >
                                                <X className="w-4 h-4"/>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {question.type === 'MULTIPLE_CHOICE' && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addAnswer}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add Option
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Explanation (Optional)
                        </Label>
                        <Textarea
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion('explanation', e.target.value)}
                            placeholder="Provide an explanation for the correct answer..."
                            className="min-h-[60px] resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be shown to students after they submit their answer
                        </p>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};
export default QuestionCard
