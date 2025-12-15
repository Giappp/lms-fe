import {LessonResponse, FileResponse} from "@/types/response";
import {LessonRequest, DeleteLessonRequest} from "@/types/request";
import {axiosInstance} from "@/api/core/axiosInstance";
import {apiCall} from "@/api/core/apiCall";
import {Constants} from "@/constants";

export const LessonService = {
    // Get lesson by ID with full details including materials
    getLessonById: async (lessonId: number) => {
        return await apiCall<LessonResponse>(() =>
            axiosInstance.get(`/api/lessons/${lessonId}`)
        );
    },

    // Create new lesson
    createLesson: async (chapterId: number, request: LessonRequest, videoFile?: File, materialFiles?: File[]) => {
        const formData = new FormData();
        
        // Append all lesson fields
        Object.entries(request).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        
        if (videoFile) {
            formData.append('videoFile', videoFile);
        }
        
        // Append material files
        if (materialFiles && materialFiles.length > 0) {
            materialFiles.forEach((file) => {
                formData.append('materialFiles', file);
            });
        }
        
        return await apiCall<LessonResponse>(() =>
            axiosInstance.post(`/api/lessons/${chapterId}`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },

    // Update lesson
    updateLesson: async (lessonId: number, request: LessonRequest, videoFile?: File, materialFiles?: File[]) => {
        const formData = new FormData();
        
        // Append all lesson fields
        Object.entries(request).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        
        if (videoFile) {
            formData.append('videoFile', videoFile);
        }
        
        // Append material files
        if (materialFiles && materialFiles.length > 0) {
            materialFiles.forEach((file) => {
                formData.append('materialFiles', file);
            });
        }
        
        return await apiCall<LessonResponse>(() =>
            axiosInstance.put(`/api/lessons/${lessonId}`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },

    // Delete lesson
    deleteLesson: async (request: DeleteLessonRequest) => {
        return await apiCall<void>(() =>
            axiosInstance.delete(`${Constants.LESSONS_ROUTES.DELETE}`, {data: request})
        );
    },

    // Upload lesson material
    uploadMaterial: async (lessonId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return await apiCall<FileResponse>(() =>
            axiosInstance.post(`/api/lessons/${lessonId}/materials`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
        );
    },

    // Get lesson materials
    getMaterials: async (lessonId: number) => {
        return await apiCall<FileResponse[]>(() =>
            axiosInstance.get(`/api/lessons/${lessonId}/materials`)
        );
    },

    // Delete lesson material
    deleteMaterial: async (lessonId: number, fileId: string) => {
        return await apiCall<void>(() =>
            axiosInstance.delete(`/api/lessons/${lessonId}/materials/${fileId}`)
        );
    },

    // Download lesson material
    downloadMaterial: async (lessonId: number, fileId: string) => {
        return await apiCall<Blob>(() =>
            axiosInstance.get(`/api/lessons/${lessonId}/materials/${fileId}/download`, {
                responseType: 'blob'
            })
        );
    },

    // Delete lesson video
    deleteVideo: async (lessonId: number) => {
        return await apiCall<void>(() =>
            axiosInstance.delete(`/api/lessons/${lessonId}/video`)
        );
    }
};
