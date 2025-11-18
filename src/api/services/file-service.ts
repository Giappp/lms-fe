import { axiosInstance } from "@/api/core/axiosInstance";
import { apiCall } from "@/api/core/apiCall";
import { Constants } from "@/constants";
import { FileResponse } from "@/types/response";

export class FileService {

    static async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return await apiCall<FileResponse>(() =>
            axiosInstance.post(Constants.FILE_ROUTES.UPLOAD_AVATAR, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        );
    }

    static async deleteAvatar(fileUrl: string) {
        return await apiCall(() =>
            axiosInstance.delete(Constants.FILE_ROUTES.DELETE_AVATAR, {
                params: { fileUrl },
            })
        );
    }

    static async downloadAvatar(fileUrl: string) {
        return await apiCall<Blob>(() =>
            axiosInstance.get(Constants.FILE_ROUTES.DOWNLOAD_AVATAR, {
                params: { fileUrl },
                responseType: "blob",
            })
        );
    }
}
