"use client"
import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {RadialBar, RadialBarChart, ResponsiveContainer} from "recharts";

const OverAllProgress = () => {
    const data = [{name: "Progress", value: 70, fill: "#2563EB"}];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-40 h-40 relative">
                    <ResponsiveContainer>
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="70%"
                            outerRadius="100%"
                            barSize={10}
                            data={data}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={5} background/>
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold">
                        {data[0].value}%
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default OverAllProgress
