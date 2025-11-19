import { axiosInstance } from "@/api/core/axiosInstance";
import { apiCall } from "@/api/core/apiCall";
import { Constants } from "@/constants";
import { UserResponse } from "@/types/response";
import { UpdateProfileRequest } from "@/types/request";

export class UserService {

    static async getProfile() {
        return await apiCall<UserResponse>(() =>
            axiosInstance.get(Constants.USER_ROUTES.PROFILE)
        );
    }

    static async updateProfile(request: UpdateProfileRequest) {
        return await apiCall<UserResponse>(() =>
            axiosInstance.put(Constants.USER_ROUTES.UPDATE_PROFILE, request)
        );
    }
}
