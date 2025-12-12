import React from 'react';
import {Calendar, CheckCircle2, Clock, FileText} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import Link from 'next/link';
import {useUpcomingDeadlines} from "@/hooks/student/useUpcomingDeadlines";

export interface UpcomingDeadlineDTO {
    id: number;
    title: string;
    courseTitle: string;
    deadline: string; // ISO LocalDateTime string
    type: 'QUIZ' | 'ASSIGNMENT';
    timeLimitMinutes?: number;
    daysRemaining: number;
    isOverdue: boolean;
}

const UpcomingDeadline = () => {
    const {deadlines, isLoading, isError} = useUpcomingDeadlines();

    if (isLoading) return <LoadingSkeleton/>;

    if (isError) {
        return (
            <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                    Unable to load deadlines.
                </CardContent>
            </Card>
        );
    }

    if (!deadlines || deadlines.length === 0) {
        return <EmptyState/>;
    }

    return (
        <Card className="h-full border-border shadow-sm flex flex-col">
            <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary"/>
                        Upcoming Deadlines
                    </CardTitle>
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                        {deadlines.length} Pending
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="space-y-3">
                    {deadlines.map((item) => (
                        <DeadlineItem key={`${item.type}-${item.id}`} data={item}/>
                    ))}
                </div>

                <Button variant="outline" className="w-full text-xs h-9 mt-4" asChild>
                    <Link href="/calendar">View Full Calendar</Link>
                </Button>
            </CardContent>
        </Card>
    );
};


const DeadlineItem = ({data}: { data: UpcomingDeadlineDTO }) => {
    const formattedDate = new Date(data.deadline).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    const isUrgent = data.daysRemaining <= 1 && !data.isOverdue;

    return (
        <div
            className="group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-accent/30 transition-all cursor-pointer">
            {/* Type Icon Box */}
            <div className={`mt-1 h-9 w-9 shrink-0 rounded-md flex items-center justify-center border ${
                data.type === 'QUIZ'
                    ? 'bg-blue-500/10 text-blue-600 border-blue-200/50 dark:border-blue-900'
                    : 'bg-orange-500/10 text-orange-600 border-orange-200/50 dark:border-orange-900'
            }`}>
                {data.type === 'QUIZ' ? <Clock className="h-4 w-4"/> : <FileText className="h-4 w-4"/>}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium leading-none truncate pr-2" title={data.title}>
                        {data.title}
                    </h4>

                    {/* Status Badges */}
                    {data.isOverdue ? (
                        <span
                            className="shrink-0 text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Overdue
                        </span>
                    ) : isUrgent ? (
                        <span
                            className="shrink-0 text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Soon
                        </span>
                    ) : (
                        <span className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">
                            {data.daysRemaining}d left
                        </span>
                    )}
                </div>

                <p className="text-xs text-muted-foreground truncate" title={data.courseTitle}>
                    {data.courseTitle}
                </p>

                <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center text-[11px] text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3"/>
                        {formattedDate}
                    </div>
                    {data.timeLimitMinutes && (
                        <div className="flex items-center text-[11px] text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3"/>
                            {data.timeLimitMinutes}m
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <Card className="h-full border-dashed shadow-none bg-accent/10">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600"/>
            </div>
            <div className="space-y-1">
                <p className="font-medium text-sm">All Caught Up!</p>
                <p className="text-xs text-muted-foreground">No upcoming deadlines.</p>
            </div>
        </CardContent>
    </Card>
);

const LoadingSkeleton = () => (
    <Card className="h-full border-border shadow-sm">
        <CardHeader className="pb-3">
            <Skeleton className="h-6 w-40"/>
        </CardHeader>
        <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                    <Skeleton className="h-9 w-9 rounded-md"/>
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4"/>
                        <Skeleton className="h-2 w-1/2"/>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);

export default UpcomingDeadline;