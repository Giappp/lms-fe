"use client"
import React, {useMemo, useState} from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths
} from 'date-fns';
import {Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, FileText} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {UpcomingDeadlineDTO} from "@/components/student/dashboard/UpcomingDeadline";
import {cn} from "@/lib/utils";
import {useUpcomingDeadlines} from "@/hooks/student/useUpcomingDeadlines";

const StudentCalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const {deadlines, isLoading} = useUpcomingDeadlines();

    // 2. Calendar Logic
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        return eachDayOfInterval({start: startDate, end: endDate});
    }, [currentDate]);

    const getDeadlinesForDate = (date: Date) => {
        if (!deadlines) return [];
        return deadlines.filter(d => isSameDay(new Date(d.deadline), date));
    };

    const selectedDayEvents = getDeadlinesForDate(selectedDate);

    // Navigation Handlers
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const jumpToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    return (
        <main className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-6 p-6 overflow-hidden">

            {/* LEFT COLUMN: Main Calendar Grid */}
            <div className="flex-1 flex flex-col gap-4 h-full">

                {/* Header Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {format(currentDate, 'MMMM yyyy')}
                        </h1>
                        <div className="flex items-center rounded-md border bg-card">
                            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>
                            <div className="w-px h-4 bg-border"/>
                            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                    <Button variant="outline" onClick={jumpToToday} className="hidden sm:flex">
                        Today
                    </Button>
                </div>

                {/* Days of Week Header */}
                <div
                    className="grid grid-cols-7 gap-px rounded-t-lg bg-muted border-b border-border text-center text-sm font-medium text-muted-foreground py-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div
                    className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-border rounded-b-lg overflow-hidden border border-t-0">
                    {calendarDays.map((day, dayIdx) => {
                        const dayEvents = getDeadlinesForDate(day);
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "relative bg-card p-2 transition-colors hover:bg-accent/50 cursor-pointer flex flex-col gap-1 min-h-[80px]",
                                    !isCurrentMonth && "bg-card/40 text-muted-foreground",
                                    isSelected && "ring-2 ring-inset ring-primary z-10"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={cn(
                                            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                                            isToday(day)
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground"
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </span>
                                    {/* Mobile Dot Indicator */}
                                    {dayEvents.length > 0 && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary lg:hidden"/>
                                    )}
                                </div>

                                {/* Desktop Event Bars */}
                                <div className="hidden lg:flex flex-col gap-1 mt-1">
                                    {dayEvents.slice(0, 3).map((event) => (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                "truncate px-1.5 py-0.5 text-[10px] font-medium rounded border",
                                                event.type === 'QUIZ'
                                                    ? "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-900"
                                                    : "bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-300 dark:border-orange-900"
                                            )}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <span className="text-[10px] text-muted-foreground pl-1">
                                            + {dayEvents.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT COLUMN: Selected Date Details */}
            <Card className="w-full lg:w-80 h-full border-l shadow-none rounded-none lg:rounded-xl flex flex-col">
                <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground"/>
                        {isToday(selectedDate) ? "Today's Schedule" : format(selectedDate, 'MMM do, yyyy')}
                    </CardTitle>
                </CardHeader>

                <ScrollArea className="flex-1 p-4">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map(i => <div key={i} className="h-20 bg-muted rounded-md animate-pulse"/>)}
                        </div>
                    ) : selectedDayEvents.length > 0 ? (
                        <div className="space-y-3">
                            {selectedDayEvents.map((event) => (
                                <EventDetailCard key={event.id} event={event}/>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                <CalendarIcon className="h-6 w-6 opacity-20"/>
                            </div>
                            <p className="text-sm">No deadlines for this day.</p>
                            <Button variant="link" onClick={() => setSelectedDate(new Date())} className="text-xs mt-2">
                                Back to Today
                            </Button>
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t bg-muted/10 text-xs text-muted-foreground text-center">
                    <div className="flex justify-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-blue-500"/> Quiz
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-orange-500"/> Assignment
                        </span>
                    </div>
                </div>
            </Card>
        </main>
    );
};

// -----------------------------------------------------------
// Sub-Component: Detail Card for Sidebar
// -----------------------------------------------------------

const EventDetailCard = ({event}: { event: UpcomingDeadlineDTO }) => {
    const isQuiz = event.type === 'QUIZ';
    const dueTime = format(new Date(event.deadline), 'h:mm a');

    return (
        <div
            className="group relative rounded-lg border bg-card p-3 transition-all hover:shadow-md hover:border-primary/50">
            <div className="flex items-start gap-3">
                {/* Icon Box */}
                <div
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
                        isQuiz
                            ? "bg-blue-500/10 text-blue-600 border-blue-200/50"
                            : "bg-orange-500/10 text-orange-600 border-orange-200/50"
                    )}
                >
                    {isQuiz ? <Clock className="h-4 w-4"/> : <FileText className="h-4 w-4"/>}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {event.type}
                        </span>
                        {event.isOverdue && (
                            <Badge variant="destructive" className="h-4 px-1 text-[10px]">Overdue</Badge>
                        )}
                    </div>

                    <h4 className="text-sm font-medium leading-tight line-clamp-2">
                        {event.title}
                    </h4>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {event.courseTitle}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-foreground/80">
                        <Clock className="h-3 w-3"/>
                        <span>Due at {dueTime}</span>
                    </div>
                </div>
            </div>

            {/* Action Button (Visible on Hover) */}
            <div className="mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" className="w-full h-7 text-xs">
                    {isQuiz ? "Start Quiz" : "View Assignment"}
                </Button>
            </div>
        </div>
    );
};

export default StudentCalendarPage;