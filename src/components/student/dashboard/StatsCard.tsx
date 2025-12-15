import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BookOpen, CheckCircle2, Clock, Trophy} from "lucide-react";
import {useStudentStats} from "@/hooks/student/useStudentStats";

interface StatsCardProps {
    userId: number | undefined;
}

const StatsCards = ({userId}: StatsCardProps) => {
    const {stats, isStatsLoading, isStatsError} = useStudentStats(userId);
    if (isStatsLoading) return <div className="text-center">Loading...</div>;
    if (isStatsError || stats === undefined) return <div className="text-center">Error loading stats</div>;
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Courses
                    </CardTitle>
                    <BookOpen className={"h-4 w-4"}/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeCourses}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-gray-400 font-medium">0%</span> from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg. Grade
                    </CardTitle>
                    <Trophy className={"h-4 w-4 text-yellow-500"}/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.averageScore}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-gray-400 font-medium">0%</span> from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Completed!
                    </CardTitle>
                    <CheckCircle2 className={"h-4 w-4 text-emerald-500"}/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.completedCourses}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-gray-400 font-medium">0%</span> from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Hours Spent
                    </CardTitle>
                    <Clock className={"h-4 w-4 text-blue-500"}/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLearningHours}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-gray-400 font-medium">0%</span> from last month
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
export default StatsCards
