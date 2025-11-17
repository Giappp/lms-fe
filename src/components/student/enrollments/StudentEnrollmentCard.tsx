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
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                            <h3 className="font-semibold text-lg line-clamp-1">
                                {course.title}
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                        </p>
                    </div>
                    <Badge 
                        className={`${statusColors[status]} whitespace-nowrap flex-shrink-0`}
                        variant="outline"
                    >
                        {statusLabels[status]}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Course Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="truncate">{course.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                            {course.difficulty}
                        </Badge>
                    </div>
                </div>

                {/* Enrollment Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                        Requested {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="default"
                        className="flex-1"
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
                        >
                            {isCanceling ? "Canceling..." : "Cancel"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
