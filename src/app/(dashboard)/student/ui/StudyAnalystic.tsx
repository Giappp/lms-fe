"use client"
import React from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {ChartConfig, ChartContainer} from "@/components/ui/chart";

const chartConfig = {
    hours: {
        label: "Study Hours",
        theme: {
            light: "#2563eb",
            dark: "#dc2626",
        },
    },
} satisfies ChartConfig

const StudyAnalystic = () => {
    const mockWeeklyStudyData = [
        {day: "Mon", hours: 2},
        {day: "Tue", hours: 3},
        {day: "Wed", hours: 1.5},
        {day: "Thu", hours: 4},
        {day: "Fri", hours: 2.5},
        {day: "Sat", hours: 3},
        {day: "Sun", hours: 0},
    ];
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-2xl">Study Time Analytics</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="min-h-[200px] w-full" config={chartConfig}>
                    <BarChart data={mockWeeklyStudyData}>
                        <CartesianGrid/>
                        <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false}/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="hours" fill="var(--color-hours)" radius={[6, 6, 0, 0]}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
export default StudyAnalystic
