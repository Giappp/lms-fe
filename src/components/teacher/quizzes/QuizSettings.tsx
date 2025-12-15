import React, {useState, useEffect} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronDown, ChevronRight, Clock, Percent, Repeat, Settings, Target} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {QuizType, ScoringMethod} from "@/types/enum";
import {QuizCreationRequest} from "@/types";
import {Separator} from '@/components/ui/separator';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Badge} from '@/components/ui/badge';
import {useCourseCurriculum} from '@/hooks/useCourseCurriculum';


const QuizSettings = ({
                          quiz,
                          onUpdate
                      }: {
    quiz: Partial<QuizCreationRequest>;
    onUpdate: (updated: Partial<QuizCreationRequest>) => void;
}) => {
    const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set());

    const shouldFetchCurriculum = quiz.type === QuizType.LESSON_QUIZ && !!quiz.courseId;
    const {chapters, isLoading: isCurriculumLoading} = useCourseCurriculum(
        shouldFetchCurriculum ? quiz.courseId : undefined
    );

    const toggleChapter = (chapterId: string) => {
        setCollapsedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        if (quiz.type === QuizType.COURSE_QUIZ && quiz.lessonId) {
            onUpdate({...quiz, lessonId: undefined});
        }
    }, [quiz.type]);
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
                                <SelectItem value="LESSON_QUIZ">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Lesson Quiz</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="COURSE_QUIZ">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Course Quiz</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Conditional Lesson Selection */}
                    {quiz.type === QuizType.LESSON_QUIZ && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <Label>Select Lesson *</Label>
                                <p className="text-xs text-muted-foreground">Choose which lesson this quiz belongs to</p>
                                
                                {!quiz.courseId ? (
                                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                        <p className="text-sm">Please select a course first</p>
                                    </div>
                                ) : isCurriculumLoading ? (
                                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                        <p className="text-sm">Loading curriculum...</p>
                                    </div>
                                ) : !chapters || chapters.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                        <p className="text-sm">No curriculum available for this course</p>
                                    </div>
                                ) : (
                                    <RadioGroup
                                        value={quiz.lessonId?.toString()}
                                        onValueChange={(value) => onUpdate({ ...quiz, lessonId: parseInt(value) })}
                                    >
                                        <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-lg p-3">
                                            {chapters.map((chapter) => (
                                                <div key={chapter.id} className="space-y-2">
                                                    {/* Chapter Header */}
                                                    <div
                                                        className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                                                        onClick={() => toggleChapter(chapter.id.toString())}
                                                    >
                                                        {collapsedChapters.has(chapter.id.toString()) ? (
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
                                                    {!collapsedChapters.has(chapter.id.toString()) && (
                                                        <div className="ml-6 space-y-1">
                                                            {chapter.lessons.map((lesson) => (
                                                                <div
                                                                    key={lesson.id}
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
