import React from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock, Percent, Repeat, Settings, Target} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {QuizType, ScoringMethod} from "@/types/enum";
import {QuizCreationRequest} from "@/types";


const QuizSettings = ({
                          quiz,
                          onUpdate
                      }: {
    quiz: Partial<QuizCreationRequest>;
    onUpdate: (updated: Partial<QuizCreationRequest>) => void;
}) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary"/>
                        Quiz Configuration
                    </CardTitle>
                    <CardDescription>Configure quiz type and behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Quiz Type */}
                    <div className="space-y-2">
                        <Label htmlFor="quiz-type" className="text-sm font-medium">
                            Quiz Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={quiz.type}
                            onValueChange={(value: QuizType) => onUpdate({...quiz, type: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select quiz type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRACTICE">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Practice</span>
                                        <span className="text-xs text-muted-foreground">For student practice, no grade impact</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="GRADED">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Graded</span>
                                        <span className="text-xs text-muted-foreground">Counts toward final grade</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="SURVEY">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Survey</span>
                                        <span
                                            className="text-xs text-muted-foreground">Anonymous feedback collection</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Scoring Method */}
                    <div className="space-y-2">
                        <Label htmlFor="scoring-method" className="text-sm font-medium">
                            Scoring Method <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={quiz.scoringMethod}
                            onValueChange={(value: ScoringMethod) => onUpdate({...quiz, scoringMethod: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select scoring method"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HIGHEST">Highest Score</SelectItem>
                                <SelectItem value="AVERAGE">Average Score</SelectItem>
                                <SelectItem value="LATEST">Latest Attempt</SelectItem>
                                <SelectItem value="FIRST">First Attempt</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            How to calculate the final score when multiple attempts are allowed
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary"/>
                        Time & Attempts
                    </CardTitle>
                    <CardDescription>Set time limits and attempt restrictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="time-limit" className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground"/>
                                Time Limit (minutes) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="time-limit"
                                type="number"
                                min="0"
                                value={quiz.timeLimitMinutes || ''}
                                onChange={(e) => onUpdate({...quiz, timeLimitMinutes: parseInt(e.target.value) || 0})}
                                placeholder="60"
                            />
                            <p className="text-xs text-muted-foreground">Set to 0 for unlimited time</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max-attempts" className="flex items-center gap-2">
                                <Repeat className="w-4 h-4 text-muted-foreground"/>
                                Max Attempts <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="max-attempts"
                                type="number"
                                min="-1"
                                value={quiz.maxAttempts ?? ''}
                                onChange={(e) => onUpdate({...quiz, maxAttempts: parseInt(e.target.value) || -1})}
                                placeholder="-1"
                            />
                            <p className="text-xs text-muted-foreground">Set to -1 for unlimited attempts</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passing-percentage" className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground"/>
                            Passing Percentage <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="passing-percentage"
                                type="number"
                                min="0"
                                max="100"
                                value={quiz.passingPercentage || ''}
                                onChange={(e) => onUpdate({...quiz, passingPercentage: parseInt(e.target.value) || 0})}
                                placeholder="70"
                            />
                            <Percent className="w-4 h-4 text-muted-foreground"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-time" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground"/>
                                Start Time (Optional)
                            </Label>
                            <Input
                                id="start-time"
                                type="datetime-local"
                                value={quiz.startTime ? new Date(quiz.startTime).toISOString().slice(0, 16) : ''}
                                onChange={(e) => onUpdate({
                                    ...quiz,
                                    startTime: e.target.value ? new Date(e.target.value) : undefined
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end-time" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground"/>
                                End Time (Optional)
                            </Label>
                            <Input
                                id="end-time"
                                type="datetime-local"
                                value={quiz.endTime ? new Date(quiz.endTime).toISOString().slice(0, 16) : ''}
                                onChange={(e) => onUpdate({
                                    ...quiz,
                                    endTime: e.target.value ? new Date(e.target.value) : undefined
                                })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Display Options</CardTitle>
                    <CardDescription>Control what students see during and after the quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="space-y-0.5">
                            <Label htmlFor="shuffle-questions" className="font-medium cursor-pointer">
                                Shuffle Questions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Randomize question order for each student
                            </p>
                        </div>
                        <Switch
                            id="shuffle-questions"
                            checked={quiz.shuffleQuestions || false}
                            onCheckedChange={(checked) => onUpdate({...quiz, shuffleQuestions: checked})}
                        />
                    </div>

                    <div
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="space-y-0.5">
                            <Label htmlFor="shuffle-answers" className="font-medium cursor-pointer">
                                Shuffle Answers
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Randomize answer choices within questions
                            </p>
                        </div>
                        <Switch
                            id="shuffle-answers"
                            checked={quiz.shuffleAnswers || false}
                            onCheckedChange={(checked) => onUpdate({...quiz, shuffleAnswers: checked})}
                        />
                    </div>

                    <div
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-results" className="font-medium cursor-pointer">
                                Show Results
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Display score and feedback after submission
                            </p>
                        </div>
                        <Switch
                            id="show-results"
                            checked={quiz.showResults ?? true}
                            onCheckedChange={(checked) => onUpdate({...quiz, showResults: checked})}
                        />
                    </div>

                    <div
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-answers" className="font-medium cursor-pointer">
                                Show Correct Answers
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Reveal correct answers after submission
                            </p>
                        </div>
                        <Switch
                            id="show-answers"
                            checked={quiz.showCorrectAnswers ?? true}
                            onCheckedChange={(checked) => onUpdate({...quiz, showCorrectAnswers: checked})}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default QuizSettings
