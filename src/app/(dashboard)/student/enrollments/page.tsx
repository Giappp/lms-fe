"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useMyEnrollments} from "@/hooks/useEnrollments";
import {StudentEnrollmentCard} from "@/components/student/enrollments/StudentEnrollmentCard";
import {getSocket, onEnrollmentStatusUpdate} from "@/lib/socket";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {EnrollmentStatus} from "@/types/enum";
import {BookOpen, RefreshCw} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {useToast} from "@/hooks/use-toast";

const PAGE_SIZE = 12;

export default function StudentEnrollmentsPage() {
    const router = useRouter();
    const {toast} = useToast();
    const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [cancelingId, setCancelingId] = useState<number | null>(null);

    const {enrollments, isLoading, mutate, cancelEnrollment} = useMyEnrollments(
        statusFilter,
        currentPage,
        PAGE_SIZE
    );

    // Subscribe to real-time enrollment status updates
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleStatusUpdate = (enrollment: any) => {
            console.log("🎓 Enrollment status updated:", enrollment);

            // Show notification based on status
            if (enrollment.status === 'APPROVED') {
                toast({
                    title: "✅ Enrollment Approved!",
                    description: `You have been accepted into "${enrollment.courseName}"`,
                    duration: 5000,
                });
            } else if (enrollment.status === 'REJECTED') {
                toast({
                    title: "❌ Enrollment Rejected",
                    description: `Your request for "${enrollment.courseName}" was rejected${enrollment.reason ? `: ${enrollment.reason}` : ''}`,
                    variant: "destructive",
                    duration: 5000,
                });
            }

            // Refresh enrollment list to show updated status
            mutate();
        };

        onEnrollmentStatusUpdate(handleStatusUpdate);

        // Cleanup: Remove listener when component unmounts
        return () => {
            socket.off("enrollment_status_update", handleStatusUpdate);
        };
    }, [mutate, toast]);

    const handleStatusChange = (value: string) => {
        setStatusFilter(value === "all" ? undefined : value as EnrollmentStatus);
        setCurrentPage(1);
    };

    const handleCancel = async (enrollmentId: number) => {
        setCancelingId(enrollmentId);
        const result = await cancelEnrollment(enrollmentId);
        setCancelingId(null);

        if (result.success) {
            toast({
                title: "Success",
                description: "Enrollment cancelled successfully",
            });
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to cancel enrollment",
                variant: "destructive",
            });
        }
    };

    const handleRefresh = () => {
        mutate();
    };

    const totalPages = enrollments?.totalPages || 0;
    const totalElements = enrollments?.totalElements || 0;

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Enrollments</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your course enrollment requests and status
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}/>
                        Refresh
                    </Button>
                    <Button onClick={() => router.push("/student/courses")} className="gap-2">
                        <BookOpen className="h-4 w-4"/>
                        Browse Courses
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{totalElements}</div>
                        <p className="text-xs text-muted-foreground">Total Enrollments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-600">
                            {enrollments?.content.filter(e => e.status === "PENDING").length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">
                            {enrollments?.content.filter(e => e.status === "APPROVED").length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Approved</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-600">
                            {enrollments?.content.filter(e => e.status === "REJECTED").length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <Card>
                <CardContent className="pt-0">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Filter by Status</Label>
                                <Select
                                    value={statusFilter || "all"}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="All Statuses"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value={EnrollmentStatus.PENDING}>Pending</SelectItem>
                                        <SelectItem value={EnrollmentStatus.APPROVED}>Approved</SelectItem>
                                        <SelectItem value={EnrollmentStatus.REJECTED}>Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6 space-y-4">
                                <Skeleton className="h-6 w-3/4"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-10 w-full"/>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && enrollments && enrollments.content.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-16 w-16 text-muted-foreground mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">No enrollments found</h3>
                        <p className="text-muted-foreground text-center mb-6">
                            {statusFilter
                                ? `You don't have any ${statusFilter.toLowerCase()} enrollments`
                                : "You haven't enrolled in any courses yet"}
                        </p>
                        <Button onClick={() => router.push("/student/courses")}>
                            Browse Available Courses
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Enrollments Grid */}
            {!isLoading && enrollments && enrollments.content.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.content.map((enrollment) => (
                            <StudentEnrollmentCard
                                key={enrollment.id}
                                enrollment={enrollment}
                                onCancel={handleCancel}
                                onViewCourse={(courseId) => router.push(`/student/courses/${courseId}`)}
                                isCanceling={cancelingId === enrollment.id}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            className={
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>

                                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(page)}
                                                isActive={currentPage === page}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            className={
                                                currentPage === totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
