import { axiosInstance } from "@/api/core/axiosInstance";
import { apiCall } from "@/api/core/apiCall";
import { Constants } from "@/constants";
import { CategoryRequest } from "@/types/request";
import { CategoryResponse, CategoryResponsePreview } from "@/types/response";
import { PaginatedResponse } from "@/types";

export const CategoryService = {

    getAllCategories: async () => {
        return await apiCall<CategoryResponsePreview[]>(() => 
            axiosInstance.get(Constants.CATEGORY_ROUTES.GET_ALL)
        );
    },

    createCategory: async (request: CategoryRequest) => {
        return await apiCall<CategoryResponse>(() => 
            axiosInstance.post(Constants.CATEGORY_ROUTES.CREATE, request)
        );
    },

    getCategoryById: async (id: number) => {
        return await apiCall<CategoryResponse>(() => 
            axiosInstance.get(`${Constants.CATEGORY_ROUTES.GET_BY_ID}/${id}`)
        );
    },

    updateCategory: async (id: number, request: CategoryRequest) => {
        return await apiCall<CategoryResponse>(() => 
            axiosInstance.put(`${Constants.CATEGORY_ROUTES.UPDATE}/${id}`, request)
        );
    },

    deleteCategory: async (id: number) => {
        return await apiCall<void>(() => 
            axiosInstance.delete(`${Constants.CATEGORY_ROUTES.DELETE}/${id}`)
        );
    },

    searchCategories: async (keyword: string, pageNumber: number = 1, pageSize: number = 20) => {
        return await apiCall<PaginatedResponse<CategoryResponse>>(() => 
            axiosInstance.get(Constants.CATEGORY_ROUTES.SEARCH, {
                params: { keyword, pageNumber, pageSize }
            })
        );
    }
};
