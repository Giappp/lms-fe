import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnrollmentPreviewResponse } from "@/types/response";
import { Clock, Calendar, User, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StudentEnrollmentCardProps {
    enrollment: EnrollmentPreviewResponse;
    onCancel?: (enrollmentId: number) => void;
    onViewCourse?: (courseId: number) => void;
    isCanceling?: boolean;
}

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
    PENDING: "Pending Review",
    APPROVED: "Approved",
    REJECTED: "Rejected"
};

export function StudentEnrollmentCard({
    enrollment,
    onCancel,
    onViewCourse,
    isCanceling = false
}: StudentEnrollmentCardProps) {
    const { course, status, createdAt } = enrollment;

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="pb-3">
                {/* Use grid to prevent overflow */}
                <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                    {/* Left column - Course info */}
                    <div className="min-w-0 space-y-2">
                        <div className="flex items-start gap-2 min-w-0">
                            <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <h3 className="font-semibold text-lg leading-tight break-words overflow-hidden">
                                {course.title}
                            </h3>
                        </div>
                        {course.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {course.description}
                            </p>
                        )}
                    </div>
                    
                    {/* Right column - Status badge */}
                    <Badge 
                        className={`${statusColors[status]} whitespace-nowrap`}
                        variant="outline"
                    >
                        {statusLabels[status]}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Course Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{course.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <Badge variant="secondary" className="text-xs">
                            {course.difficulty}
                        </Badge>
                    </div>
                </div>

                {/* Enrollment Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                        Requested {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                        variant="default"
                        className="flex-1 min-w-[120px]"
                        onClick={() => onViewCourse?.(course.id)}
                        disabled={status === "REJECTED"}
                    >
                        View Course
                    </Button>
                    {status === "PENDING" && onCancel && (
                        <Button
                            variant="outline"
                            onClick={() => onCancel(enrollment.id)}
                            disabled={isCanceling}
                            className="min-w-[100px]"
                        >
                            {isCanceling ? "Canceling..." : "Cancel"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}