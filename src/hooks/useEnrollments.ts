import useSWR from "swr";
import { EnrollmentService } from "@/api/services/enrollment-service";
import { Constants } from "@/constants";
import { EnrollmentStatus } from "@/types/enum";
import { useState } from "react";
import { 
    EnrollmentPreviewResponse, 
    EnrollmentResponse, 
    PaginatedResponse 
} from "@/types/response";
import { UpdateEnrollmentStatusRequest } from "@/types/request";
import { swrFetcher } from "@/lib/swrFetcher";

/**
 * Hook for student enrollments
 */
export function useMyEnrollments(
    status?: EnrollmentStatus,
    pageNumber: number = 1,
    pageSize: number = 20
) {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber.toString());
    params.append("pageSize", pageSize.toString());
    if (status) params.append("status", status);

    const key = `${Constants.ENROLLMENT_ROUTES.MY_ENROLLMENTS}?${params.toString()}`;

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<EnrollmentPreviewResponse> | null>(
        key,
        swrFetcher,
        { revalidateOnFocus: false }
    );

    const cancelEnrollment = async (enrollmentId: number) => {
        const response = await EnrollmentService.cancelEnrollment(enrollmentId);
        if (response.success) {
            await mutate();
            return { success: true };
        }
        return { 
            success: false, 
            error: response.message || "Failed to cancel enrollment" 
        };
    };

    return {
        enrollments: data,
        isLoading,
        error,
        mutate,
        cancelEnrollment
    };
}

/**
 * Hook for teacher course enrollments
 */
export function useCourseEnrollments(
    courseId: number,
    status?: EnrollmentStatus,
    search?: string,
    page: number = 1,
    size: number = 20
) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const key = courseId 
        ? `${Constants.ENROLLMENT_ROUTES.COURSE_ENROLLMENTS}/${courseId}?${params.toString()}`
        : null;

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<EnrollmentResponse> | null>(
        key,
        swrFetcher,
        { revalidateOnFocus: false }
    );

    const [isUpdating, setIsUpdating] = useState(false);

    const updateEnrollmentStatus = async (
        enrollmentId: number,
        request: UpdateEnrollmentStatusRequest
    ) => {
        setIsUpdating(true);
        const response = await EnrollmentService.updateEnrollmentStatus(enrollmentId, request);
        setIsUpdating(false);
        
        if (response.success) {
            await mutate();
            return { success: true };
        }
        return { 
            success: false, 
            error: response.message || "Failed to update enrollment status" 
        };
    };

    return {
        enrollments: data,
        isLoading,
        isUpdating,
        error,
        mutate,
        updateEnrollmentStatus
    };
}
