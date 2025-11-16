"use client"
import React from 'react'
import {Quiz} from "@/types"
import {Badge} from "@/components/ui/badge"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faCalendar,
    faChartLine,
    faClock,
    faInfo,
    faPlay,
    faQuestionCircle,
    faRotateLeft,
    faTrophy
} from "@fortawesome/free-solid-svg-icons"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {cn} from "@/lib/utils"

const QuizCard = ({
                      name,
                      description,
                      instructor,
                      courseName,
                      lessonName,
                      status,
                      dueTo,
                      totalQuestions,
                      difficulty,
                      timeLimit,
                      maxAttempts,
                      attempts,
                      lastScore,
                      averageScore,
                      bestScore
                  }: Quiz) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'text-green-500'
            case 'medium':
                return 'text-yellow-500'
            case 'hard':
                return 'text-red-500'
            default:
                return 'text-gray-500'
        }
    }

    return (
        <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-4 gap-4">
                <div>
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground text-wrap">{courseName} • {lessonName}</p>
                </div>
                <Badge
                    variant={status === "Available" ? "success" : "secondary"}
                    className="capitalize end-0 px-4 py-2"
                >
                    {status}
                </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-6">{description}</p>

            {/* Quiz Preview */}
            <div className="bg-muted rounded-lg p-6 mb-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <FontAwesomeIcon icon={faQuestionCircle} className="mb-2"/>
                        <p className="text-sm font-medium">{totalQuestions}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faTrophy}
                            className={cn("mb-2", getDifficultyColor(difficulty))}
                        />
                        <p className="text-sm font-medium">{difficulty}</p>
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faClock} className="mb-2"/>
                        <p className="text-sm font-medium">{timeLimit} mins</p>
                        <p className="text-xs text-muted-foreground">Time Limit</p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faRotateLeft} className="mb-2"/>
                        <p className="text-sm font-medium">{attempts}/{maxAttempts}</p>
                        <p className="text-xs text-muted-foreground">Attempts</p>
                    </div>
                </div>
            </div>

            {/* Quiz Results and Empty Space */}
            <div className="flex-grow mb-6">
                {lastScore !== undefined ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Latest Score</span>
                                <span className="font-medium">{lastScore}%</span>
                            </div>
                            <Progress value={lastScore}/>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartLine}/>
                                <span>Average: {averageScore}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrophy}/>
                                <span>Best: {bestScore}%</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[88px]"></div>
                )}
            </div>

            {/* Quiz Info */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faCalendar}/>
                    <p>Due: {new Date(dueTo).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-muted-foreground">By {instructor}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                    <FontAwesomeIcon icon={faInfo}/>
                    Details
                </Button>
                <Button
                    className="flex-1 gap-2"
                    disabled={status !== "Available" || attempts >= maxAttempts}
                >
                    <FontAwesomeIcon icon={faPlay}/>
                    Start Quiz
                </Button>
            </div>
        </div>
    )
}

export default QuizCard
