import React from 'react'
import WelcomeSection from "@/components/student/dashboard/WelcomeSection";
import StatsCards from "@/components/student/dashboard/StatsCard";
import {useAuth} from "@/hooks/useAuth";
import {Card} from "@/components/ui/card";
import {GraduationCap} from "lucide-react";
import ContinueLearning from "@/components/student/dashboard/ContinueLearning";
import UpcomingDeadline from "@/components/student/dashboard/UpcomingDeadline";

const StudentDashboardPage = () => {
    const {user} = useAuth();
    const fullName = user?.fullName || '';
    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="mx-auto space-y-8">

                <WelcomeSection fullName={fullName} upcomingAssignments={3}/>
                <StatsCards userId={user?.id}/>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Courses) */}
                    <div className="lg:col-span-2 space-y-8">
                        <ContinueLearning/>

                        {/* New Course List (Simple Grid) */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold tracking-tight">Recommended For You</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['Machine Learning Basics', 'Advanced CSS Animations', 'Database Design'].map((item, i) => (
                                    <Card key={i}
                                          className="flex items-center p-4 gap-4 hover:bg-accent/50 cursor-pointer transition-colors">
                                        <div
                                            className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                                            <GraduationCap className="h-6 w-6 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm">{item}</h3>
                                            <p className="text-xs text-muted-foreground">8 Weeks • Intermediate</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar Widgets) */}
                    <div className="lg:col-span-1">
                        <UpcomingDeadline/>
                    </div>
                </div>

            </div>
        </main>
    )
}
export default StudentDashboardPage
