import { axiosInstance } from "@/api/core/axiosInstance";
import { Constants } from "@/constants";
import { 
    EnrollmentRequest, 
    UpdateEnrollmentStatusRequest 
} from "@/types/request";
import { apiCall } from "@/api/core/apiCall";

export class EnrollmentService {
    /**
     * Request enrollment in a course (Student)
     */
    static async requestEnrollment(request: EnrollmentRequest) {
        return apiCall(() =>
            axiosInstance.post(
                Constants.ENROLLMENT_ROUTES.REQUEST,
                request
            )
        );
    }

    /**
     * Cancel enrollment (Student/Admin)
     */
    static async cancelEnrollment(enrollmentId: number) {
        return apiCall(() =>
            axiosInstance.delete(
                `${Constants.ENROLLMENT_ROUTES.CANCEL}/${enrollmentId}`
            )
        );
    }

    /**
     * Get student's enrollments with optional status filter
     */
    static async getMyEnrollments(
        status?: string,
        pageNumber: number = 1,
        pageSize: number = 20
    ) {
        const params: any = { pageNumber, pageSize };
        if (status) params.status = status;

        return apiCall(() =>
            axiosInstance.get(
                Constants.ENROLLMENT_ROUTES.MY_ENROLLMENTS,
                { params }
            )
        );
    }

    /**
     * Get course enrollments for teacher with search and filters
     */
    static async getCourseEnrollments(
        courseId: number,
        status?: string,
        search?: string,
        page: number = 1,
        size: number = 20
    ) {
        const params: any = { page, size };
        if (status) params.status = status;
        if (search) params.search = search;

        return apiCall(() =>
            axiosInstance.get(
                `${Constants.ENROLLMENT_ROUTES.COURSE_ENROLLMENTS}/${courseId}`,
                { params }
            )
        );
    }

    /**
     * Update enrollment status (Approve/Reject) - Teacher/Admin
     */
    static async updateEnrollmentStatus(
        enrollmentId: number,
        request: UpdateEnrollmentStatusRequest
    ) {
        return apiCall(() =>
            axiosInstance.put(
                `${Constants.ENROLLMENT_ROUTES.UPDATE_STATUS}/${enrollmentId}/status`,
                request
            )
        );
    }
}
