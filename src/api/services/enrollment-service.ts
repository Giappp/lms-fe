import { axiosInstance } from "@/api/core/axiosInstance";
import { Constants } from "@/constants";
import { 
    EnrollmentRequest, 
    UpdateEnrollmentStatusRequest 
} from "@/types/request";
import {
    EnrollmentPreviewResponse,
    EnrollmentResponse,
    PaginatedResponse
} from "@/types/response";
import { EnrollmentStatus } from "@/types/enum";
import {
    USE_MOCK_DATA,
    getMockStudentEnrollments,
    getMockCourseEnrollments,
    mockCancelEnrollment,
    mockUpdateEnrollmentStatus
} from "./enrollment-mock-api";

export class EnrollmentService {
    /**
     * Request enrollment in a course (Student)
     */
    static async requestEnrollment(request: EnrollmentRequest) {
        return await axiosInstance.post(
            Constants.ENROLLMENT_ROUTES.REQUEST,
            request
        );
    }

    /**
     * Cancel enrollment (Student/Admin)
     */
    static async cancelEnrollment(enrollmentId: number) {
        if (USE_MOCK_DATA) {
            await mockCancelEnrollment(enrollmentId);
            return { data: null };
        }
        
        return await axiosInstance.delete(
            `${Constants.ENROLLMENT_ROUTES.CANCEL}/${enrollmentId}`
        );
    }

    /**
     * Get student's enrollments with optional status filter
     */
    static async getMyEnrollments(
        status?: EnrollmentStatus,
        pageNumber: number = 1,
        pageSize: number = 20
    ) {
        if (USE_MOCK_DATA) {
            const data = await getMockStudentEnrollments(status, pageNumber, pageSize);
            return { data };
        }

        const params: any = { pageNumber, pageSize };
        if (status) params.status = status;

        return await axiosInstance.get<PaginatedResponse<EnrollmentPreviewResponse>>(
            Constants.ENROLLMENT_ROUTES.MY_ENROLLMENTS,
            { params }
        );
    }

    /**
     * Get course enrollments for teacher with search and filters
     */
    static async getCourseEnrollments(
        courseId: number,
        status?: EnrollmentStatus,
        search?: string,
        page: number = 1,
        size: number = 20
    ) {
        if (USE_MOCK_DATA) {
            const data = await getMockCourseEnrollments(courseId, status, search, page, size);
            return { data };
        }

        const params: any = { page, size };
        if (status) params.status = status;
        if (search) params.search = search;

        return await axiosInstance.get<PaginatedResponse<EnrollmentResponse>>(
            `${Constants.ENROLLMENT_ROUTES.COURSE_ENROLLMENTS}/${courseId}`,
            { params }
        );
    }

    /**
     * Update enrollment status (Approve/Reject) - Teacher/Admin
     */
    static async updateEnrollmentStatus(
        enrollmentId: number,
        request: UpdateEnrollmentStatusRequest
    ) {
        if (USE_MOCK_DATA) {
            await mockUpdateEnrollmentStatus(enrollmentId, request.status, request.reason);
            return { data: null };
        }

        return await axiosInstance.put(
            `${Constants.ENROLLMENT_ROUTES.UPDATE_STATUS}/${enrollmentId}/status`,
            request
        );
    }
}
