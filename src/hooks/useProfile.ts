import useSWR from "swr";
import { UserResponse } from "@/types/response";
import { UpdateProfileRequest } from "@/types/request";
import { UserService } from "@/api/services/user-service";
import { FileService } from "@/api/services/file-service";
import { Constants } from "@/constants";

/**
 * Hook for managing user profile
 */
export function useProfile() {
    const {
        data: profile,
        error,
        mutate,
        isLoading,
    } = useSWR<UserResponse>(
        Constants.USER_ROUTES.PROFILE,
        async () => {
            const response = await UserService.getProfile();
            return response.data!;
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const updateProfile = async (request: UpdateProfileRequest) => {
        try {
            const response = await UserService.updateProfile(request);
            if (response.success) {
                await mutate(response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update profile:", error);
            return false;
        }
    };

    const uploadAvatar = async (file: File) => {
        try {
            const response = await FileService.uploadAvatar(file);
            if (response.success) {
                // Refresh profile to get updated avatar URL
                await mutate();
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Failed to upload avatar:", error);
            return null;
        }
    };

    const deleteAvatar = async (fileUrl: string) => {
        try {
            const response = await FileService.deleteAvatar(fileUrl);
            if (response.success) {
                await mutate();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to delete avatar:", error);
            return false;
        }
    };

    return {
        profile,
        isLoading,
        error,
        updateProfile,
        uploadAvatar,
        deleteAvatar,
        mutate,
    };
}
