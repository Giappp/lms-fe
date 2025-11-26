import {ChapterResponse} from "@/types/response";
import {ChapterRequest, DeleteChapterRequest} from "@/types/request";
import {axiosInstance} from "@/api/core/axiosInstance";
import {apiCall} from "@/api/core/apiCall";
import {Constants} from "@/constants";

export const ChapterService = {
    // Create new chapter
    createChapter: async (request: ChapterRequest) => {
        return await apiCall<ChapterResponse>(() =>
            axiosInstance.post(`${Constants.CHAPTERS_ROUTES.CREATE}`, request)
        );
    },

    // Update chapter
    updateChapter: async (chapterId: number, request: ChapterRequest) => {
        return await apiCall<ChapterResponse>(() =>
            axiosInstance.put(`/api/chapters/${chapterId}`, request)
        );
    },

    // Delete chapter
    deleteChapter: async (request: DeleteChapterRequest) => {
        return await apiCall<void>(() =>
            axiosInstance.delete(`${Constants.CHAPTERS_ROUTES.DELETE}`, {data: request})
        );
    }
};
