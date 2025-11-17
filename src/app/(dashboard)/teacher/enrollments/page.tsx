"use client"

import React, { useState, useMemo } from "react";
import { useCourseEnrollments } from "@/hooks/useEnrollments";
import { TeacherEnrollmentCard } from "@/components/teacher/enrollments/TeacherEnrollmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { EnrollmentStatus } from "@/types/enum";
import { Search, Filter, RefreshCw, Users, X, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PAGE_SIZE = 10;

// Mock courses for demo - replace with actual course list
const mockCourses = [
    { id: 1, name: "React Fundamentals" },
    { id: 2, name: "Advanced TypeScript" },
    { id: 3, name: "Node.js Backend Development" },
    { id: 4, name: "Database Design" },
    { id: 5, name: "Web Security" }
];

export default function TeacherEnrollmentsPage() {
    const { toast } = useToast();
    const [selectedCourseId, setSelectedCourseId] = useState<number>(mockCourses[0].id);
    const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { enrollments, isLoading, isUpdating, mutate, updateEnrollmentStatus } = useCourseEnrollments(
        selectedCourseId,
        statusFilter,
        searchTerm,
        currentPage,
        PAGE_SIZE
    );

    const handleCourseChange = (value: string) => {
        setSelectedCourseId(parseInt(value));
        setCurrentPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value === "all" ? undefined : value as EnrollmentStatus);
        setCurrentPage(1);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setStatusFilter(undefined);
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleApprove = async (enrollmentId: number) => {
        const result = await updateEnrollmentStatus(enrollmentId, { status: "APPROVED" });
        
        if (result.success) {
            toast({
                title: "Success",
                description: "Enrollment approved successfully",
            });
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to approve enrollment",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (enrollmentId: number, reason?: string) => {
        const result = await updateEnrollmentStatus(enrollmentId, { 
            status: "REJECTED",
            reason 
        });
        
        if (result.success) {
            toast({
                title: "Success",
                description: "Enrollment rejected successfully",
            });
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to reject enrollment",
                variant: "destructive",
            });
        }
    };

    // Sort enrollments to prioritize PENDING status
    const sortedEnrollments = useMemo(() => {
        if (!enrollments?.content) return [];
        
        return [...enrollments.content].sort((a, b) => {
            // PENDING first
            if (a.status === "PENDING" && b.status !== "PENDING") return -1;
            if (a.status !== "PENDING" && b.status === "PENDING") return 1;
            
            // Then by creation date (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [enrollments]);

    const totalPages = enrollments?.totalPages || 0;
    const totalElements = enrollments?.totalElements || 0;
    const pendingCount = enrollments?.content.filter(e => e.status === "PENDING").length || 0;

    const hasActiveFilters = statusFilter || searchTerm;

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Course Enrollments</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage student enrollment requests for your courses
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => mutate()}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{totalElements}</div>
                                <p className="text-xs text-muted-foreground">Total Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                                <p className="text-xs text-muted-foreground">Pending Review</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {enrollments?.content.filter(e => e.status === "APPROVED").length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">Approved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {enrollments?.content.filter(e => e.status === "REJECTED").length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">Rejected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        You have <strong>{pendingCount}</strong> pending enrollment {pendingCount === 1 ? "request" : "requests"} awaiting your review.
                    </AlertDescription>
                </Alert>
            )}

            {/* Filter Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5"/>
                        Filter Students
                    </CardTitle>
                    <CardDescription>
                        Search and filter enrollment requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <Select 
                                value={selectedCourseId.toString()} 
                                onValueChange={handleCourseChange}
                            >
                                <SelectTrigger id="course">
                                    <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockCourses.map(course => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Student</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="search"
                                    placeholder="Name or email..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                                value={statusFilter || "all"} 
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value={EnrollmentStatus.PENDING}>Pending</SelectItem>
                                    <SelectItem value={EnrollmentStatus.APPROVED}>Approved</SelectItem>
                                    <SelectItem value={EnrollmentStatus.REJECTED}>Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Clear Filters */}
                        <div className="space-y-2 flex items-end">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full gap-2"
                                >
                                    <X className="h-4 w-4"/>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {totalElements} {totalElements === 1 ? 'Student' : 'Students'}
                        </h2>
                        {hasActiveFilters && (
                            <Badge variant="secondary">Filtered</Badge>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-1/3" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-8 w-32" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && sortedEnrollments.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No students found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {hasActiveFilters 
                                    ? "No students match your current filters" 
                                    : "No enrollment requests for this course yet"}
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Enrollments List */}
                {!isLoading && sortedEnrollments.length > 0 && (
                    <>
                        <div className="space-y-4">
                            {sortedEnrollments.map((enrollment) => (
                                <TeacherEnrollmentCard
                                    key={enrollment.id}
                                    enrollment={enrollment}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    isUpdating={isUpdating}
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

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        </div>
    );
}
