"use client"

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    AlertCircle,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    MessageSquare,
    Plus,
    TrendingUp,
    Users
} from 'lucide-react';
import {useAuth} from "@/hooks/useAuth";

const TeacherDashboard = () => {
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const stats = [
        {label: 'Active Courses', value: '6', icon: BookOpen, trend: '+2 this month', color: 'text-primary'},
        {label: 'Total Students', value: '243', icon: Users, trend: '+12 this week', color: 'text-chart-2'},
        {label: 'Pending Reviews', value: '18', icon: FileText, trend: '5 urgent', color: 'text-destructive'},
        {label: 'Avg. Completion', value: '87%', icon: TrendingUp, trend: '+5% from last month', color: 'text-chart-4'}
    ];

    const upcomingClasses = [
        {id: 1, course: 'Advanced Mathematics', time: '09:00 AM', date: 'Today', students: 32, room: 'Room 301'},
        {id: 2, course: 'Physics 101', time: '02:00 PM', date: 'Today', students: 28, room: 'Lab 2'},
        {id: 3, course: 'Calculus II', time: '10:00 AM', date: 'Tomorrow', students: 25, room: 'Room 405'},
        {id: 4, course: 'Statistics', time: '03:30 PM', date: 'Tomorrow', students: 30, room: 'Room 210'}
    ];

    const recentSubmissions = [
        {
            id: 1,
            student: 'Emily Chen',
            course: 'Advanced Mathematics',
            assignment: 'Chapter 5 Quiz',
            time: '2 hours ago',
            status: 'pending'
        },
        {
            id: 2,
            student: 'Marcus Rodriguez',
            course: 'Physics 101',
            assignment: 'Lab Report 3',
            time: '4 hours ago',
            status: 'pending'
        },
        {
            id: 3,
            student: 'Sarah Johnson',
            course: 'Calculus II',
            assignment: 'Problem Set 8',
            time: '5 hours ago',
            status: 'reviewed'
        },
        {
            id: 4,
            student: 'David Kim',
            course: 'Statistics',
            assignment: 'Data Analysis Project',
            time: '1 day ago',
            status: 'pending'
        }
    ];

    const recentMessages = [
        {
            id: 1,
            from: 'John Parker',
            message: 'Question about the final exam format...',
            time: '30 min ago',
            unread: true
        },
        {
            id: 2,
            from: 'Lisa Anderson',
            message: 'Thank you for the feedback on my essay!',
            time: '2 hours ago',
            unread: true
        },
        {
            id: 3,
            from: 'Admin Office',
            message: 'Reminder: Faculty meeting on Friday',
            time: '5 hours ago',
            unread: false
        }
    ];

    const coursePerformance = [
        {course: 'Advanced Mathematics', avgScore: 85, completion: 92, students: 32},
        {course: 'Physics 101', avgScore: 78, completion: 88, students: 28},
        {course: 'Calculus II', avgScore: 82, completion: 85, students: 25},
        {course: 'Statistics', avgScore: 88, completion: 95, students: 30}
    ];

    return (
        <div className="bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome back, Professor {user?.fullName}</h1>
                        <p className="text-muted-foreground mt-1">Here's what's happening with your classes today</p>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2"/>
                        New Assignment
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
                                    </div>
                                    <div className={`${stat.color} opacity-80`}>
                                        <stat.icon className="w-8 h-8"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="submissions">Submissions</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Upcoming Classes */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary"/>
                                        Upcoming Classes
                                    </CardTitle>
                                    <CardDescription>Your schedule for the next 2 days</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {upcomingClasses.map((cls) => (
                                            <div key={cls.id}
                                                 className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <BookOpen className="w-6 h-6 text-primary"/>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">{cls.course}</h4>
                                                            <div
                                                                className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3"/>{cls.time}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="w-3 h-3"/>
                                                                    {cls.students} students
                                                                </span>
                                                                <span>{cls.room}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant={cls.date === 'Today' ? 'default' : 'secondary'}>
                                                    {cls.date}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Messages */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary"/>
                                        Messages
                                    </CardTitle>
                                    <CardDescription>Recent conversations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentMessages.map((msg) => (
                                            <div key={msg.id}
                                                 className="flex gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>{msg.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-sm text-foreground">{msg.from}</p>
                                                        {msg.unread &&
                                                            <div className="w-2 h-2 rounded-full bg-primary"/>}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="ghost" className="w-full">
                                            View All Messages
                                            <ChevronRight className="w-4 h-4 ml-2"/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="submissions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary"/>
                                    Recent Submissions
                                </CardTitle>
                                <CardDescription>Student work awaiting your review</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentSubmissions.map((submission) => (
                                        <div key={submission.id}
                                             className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                                            <div className="flex items-center gap-4 flex-1">
                                                <Avatar>
                                                    <AvatarFallback>{submission.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-foreground">{submission.student}</h4>
                                                    <p className="text-sm text-muted-foreground">{submission.course}</p>
                                                    <p className="text-sm font-medium text-foreground mt-1">{submission.assignment}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{submission.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {submission.status === 'pending' ? (
                                                    <>
                                                        <Badge variant="outline"
                                                               className="text-destructive border-destructive">
                                                            <AlertCircle className="w-3 h-3 mr-1"/>
                                                            Pending
                                                        </Badge>
                                                        <Button size="sm">Review</Button>
                                                    </>
                                                ) : (
                                                    <Badge variant="outline" className="text-chart-4 border-chart-4">
                                                        <CheckCircle2 className="w-3 h-3 mr-1"/>
                                                        Reviewed
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary"/>
                                    Course Performance
                                </CardTitle>
                                <CardDescription>Student analytics across your courses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {coursePerformance.map((course, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{course.course}</h4>
                                                    <p className="text-sm text-muted-foreground">{course.students} students
                                                        enrolled</p>
                                                </div>
                                                <Button variant="outline" size="sm">View Details</Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Average Score</span>
                                                        <span
                                                            className="font-semibold text-foreground">{course.avgScore}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full transition-all"
                                                            style={{width: `${course.avgScore}%`}}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Completion Rate</span>
                                                        <span
                                                            className="font-semibold text-foreground">{course.completion}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-chart-4 rounded-full transition-all"
                                                            style={{width: `${course.completion}%`}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default TeacherDashboard;