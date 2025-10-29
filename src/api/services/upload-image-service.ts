import {axiosInstance} from "@/api/core/axiosInstance";
import {AxiosProgressEvent} from "axios";

export const uploadImageToS3 = async (
    file: File,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
    cancelToken: AbortController
) => {
    const presignedRes = await axiosInstance.get("/api/upload/presigned-url", {
        params: {filename: file.name, filetype: file.type},
    });

    const {url, key} = presignedRes.data;

    await axiosInstance.put(url, file, {
        headers: {"Content-Type": file.type},
        onUploadProgress,
        signal: cancelToken.signal
    });

    return key; // S3 key for saving in DB later
}