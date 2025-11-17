import { 
    mockStudentEnrollments, 
    mockTeacherEnrollments 
} from "@/api/services/enrollment-mock-data";
import { EnrollmentStatus } from "@/types/enum";
import { 
    EnrollmentPreviewResponse, 
    EnrollmentResponse, 
    PaginatedResponse 
} from "@/types/response";

/**
 * Mock API simulator for enrollment endpoints
 * Use this for testing when the backend is not available
 */

// Flag to enable/disable mock mode
export const USE_MOCK_DATA = true; // Set to false when backend is ready

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock: Get student enrollments
 * GET /api/enrollments/student
 */
export async function getMockStudentEnrollments(
    status?: EnrollmentStatus,
    pageNumber: number = 1,
    pageSize: number = 20
): Promise<PaginatedResponse<EnrollmentPreviewResponse>> {
    await delay();

    let filtered = [...mockStudentEnrollments.content];

    // Filter by status
    if (status) {
        filtered = filtered.filter(e => e.status === status);
    }

    // Pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContent = filtered.slice(startIndex, endIndex);

    return {
        content: paginatedContent,
        pageable: {
            pageNumber: pageNumber - 1,
            pageSize,
            sort: { sorted: true, unsorted: false, empty: false },
            offset: startIndex,
            paged: true,
            unpaged: false
        },
        totalPages: Math.ceil(filtered.length / pageSize),
        totalElements: filtered.length,
        last: endIndex >= filtered.length,
        first: pageNumber === 1,
        size: pageSize,
        number: pageNumber - 1,
        sort: { sorted: true, unsorted: false, empty: false },
        numberOfElements: paginatedContent.length,
        empty: paginatedContent.length === 0
    };
}

/**
 * Mock: Get course enrollments for teacher
 * GET /api/enrollments/course/{courseId}
 */
export async function getMockCourseEnrollments(
    courseId: number,
    status?: EnrollmentStatus,
    search?: string,
    page: number = 1,
    size: number = 20
): Promise<PaginatedResponse<EnrollmentResponse>> {
    await delay();

    let filtered = [...mockTeacherEnrollments.content];

    // Filter by course (already filtered in mock data, but keeping for completeness)
    filtered = filtered.filter(e => e.course.id === courseId);

    // Filter by status
    if (status) {
        filtered = filtered.filter(e => e.status === status);
    }

    // Search by student name or email
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(e => 
            e.student.fullName.toLowerCase().includes(searchLower) ||
            e.student.email.toLowerCase().includes(searchLower)
        );
    }

    // Sort: PENDING first, then by creation date
    filtered.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedContent = filtered.slice(startIndex, endIndex);

    return {
        content: paginatedContent,
        pageable: {
            pageNumber: page - 1,
            pageSize: size,
            sort: { sorted: true, unsorted: false, empty: false },
            offset: startIndex,
            paged: true,
            unpaged: false
        },
        totalPages: Math.ceil(filtered.length / size),
        totalElements: filtered.length,
        last: endIndex >= filtered.length,
        first: page === 1,
        size,
        number: page - 1,
        sort: { sorted: true, unsorted: false, empty: false },
        numberOfElements: paginatedContent.length,
        empty: paginatedContent.length === 0
    };
}

/**
 * Mock: Cancel enrollment
 * DELETE /api/enrollments/{enrollmentId}
 */
export async function mockCancelEnrollment(enrollmentId: number): Promise<void> {
    await delay(300);
    
    // Simulate cancellation
    const index = mockStudentEnrollments.content.findIndex(e => e.id === enrollmentId);
    if (index !== -1 && mockStudentEnrollments.content[index].status === "PENDING") {
        mockStudentEnrollments.content.splice(index, 1);
        mockStudentEnrollments.totalElements--;
        console.log(`✅ Mock: Cancelled enrollment #${enrollmentId}`);
    } else {
        throw new Error("Cannot cancel this enrollment");
    }
}

/**
 * Mock: Update enrollment status (Approve/Reject)
 * PUT /api/enrollments/{enrollmentId}/status
 */
export async function mockUpdateEnrollmentStatus(
    enrollmentId: number,
    status: "APPROVED" | "REJECTED",
    reason?: string
): Promise<void> {
    await delay(300);

    const enrollment = mockTeacherEnrollments.content.find(e => e.id === enrollmentId);
    if (enrollment) {
        enrollment.status = status;
        enrollment.updatedAt = new Date().toISOString();
        console.log(`✅ Mock: Updated enrollment #${enrollmentId} to ${status}`, reason ? `Reason: ${reason}` : "");
    } else {
        throw new Error("Enrollment not found");
    }
}
