import React from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

const upcomingDeadlines = [
    {id: 1, title: "React Project Submission", course: "Adv. Web Dev", due: "Today, 11:59 PM", type: "urgent"},
    {id: 2, title: "Wireframe Prototype", course: "UI/UX Design", due: "Tomorrow", type: "warning"},
    {id: 3, title: "Graph Quiz", course: "Data Structures", due: "In 3 days", type: "normal"},
];

const recentActivity = [
    {id: 1, action: "Completed Quiz", item: "React Hooks", score: "95%", time: "2h ago"},
    {id: 2, action: "Posted in Forum", item: "Help with CSS Grid", score: null, time: "5h ago"},
    {id: 3, action: "Watched Lecture", item: "Intro to Figma", score: null, time: "1d ago"},
];

const UpcomingDeadline = () => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>You have 3 tasks pending</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {upcomingDeadlines.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                            <div className={cn(
                                "mt-1 h-2 w-2 rounded-full shrink-0",
                                item.type === 'urgent' ? "bg-red-500" : item.type === 'warning' ? "bg-orange-500" : "bg-blue-500"
                            )}/>
                            <div className="space-y-1 flex-1">
                                <p className="text-sm font-medium leading-none">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.course}</p>
                            </div>
                            <div className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium",
                                item.type === 'urgent' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                    "bg-secondary text-secondary-foreground"
                            )}>
                                {item.due}
                            </div>
                        </div>
                    ))}
                </CardContent>
                <div className="p-4 pt-0">
                    <Button variant="outline" className="w-full text-xs h-8">View Calendar</Button>
                </div>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                    {activity.action[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.item}</p>
                                <p className="text-[10px] text-muted-foreground pt-1">{activity.time}</p>
                            </div>
                            {activity.score && (
                                <div className="ml-auto font-bold text-sm text-emerald-500">{activity.score}</div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
export default UpcomingDeadline
