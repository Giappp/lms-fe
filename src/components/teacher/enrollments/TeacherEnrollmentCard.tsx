import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EnrollmentResponse } from "@/types/response";
import { Calendar, Mail, User, Check, X, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TeacherEnrollmentCardProps {
    enrollment: EnrollmentResponse;
    onApprove?: (enrollmentId: number) => void;
    onReject?: (enrollmentId: number, reason?: string) => void;
    isUpdating?: boolean;
}

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected"
};

export function TeacherEnrollmentCard({
    enrollment,
    onApprove,
    onReject,
    isUpdating = false
}: TeacherEnrollmentCardProps) {
    const { student, status, createdAt } = enrollment;
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const handleApprove = () => {
        onApprove?.(enrollment.id);
    };

    const handleRejectConfirm = () => {
        onReject?.(enrollment.id, rejectReason);
        setShowRejectDialog(false);
        setRejectReason("");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Card className={`
                hover:shadow-md transition-all duration-300
                ${status === "PENDING" ? "border-l-4 border-l-yellow-500" : ""}
            `}>
                <CardContent className="pl-5">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage src={student.avatar} alt={student.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(student.fullName)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base truncate">
                                        {student.fullName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="truncate">{student.email}</span>
                                    </div>
                                </div>
                                <Badge 
                                    className={`${statusColors[status]} whitespace-nowrap flex-shrink-0`}
                                    variant="outline"
                                >
                                    {statusLabels[status]}
                                </Badge>
                            </div>

                            {/* Request Time */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                    Requested {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {/* Actions */}
                            {status === "PENDING" && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleApprove}
                                        disabled={isUpdating}
                                        className="gap-1.5"
                                    >
                                        <Check className="h-4 w-4" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowRejectDialog(true)}
                                        disabled={isUpdating}
                                        className="gap-1.5 text-red-600 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            )}

                            {status === "APPROVED" && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Check className="h-4 w-4" />
                                    <span>Enrollment approved</span>
                                </div>
                            )}

                            {status === "REJECTED" && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <X className="h-4 w-4" />
                                    <span>Enrollment rejected</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Enrollment Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject the enrollment request from{" "}
                            <strong>{student.fullName}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-4">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            placeholder="Provide a reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Reject Request
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
