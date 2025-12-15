import useSWR from 'swr';
import { CategoryService } from '@/api/services/category-service';
import { Constants } from '@/constants';
import { CategoryResponse, CategoryResponsePreview, PaginatedResponse } from '@/types/response';
import { CategoryRequest } from '@/types/request';

/**
 * Hook to search categories with pagination
 */
export function useCategories(keyword: string = '', pageNumber: number = 1, pageSize: number = 20) {
    const queryString = new URLSearchParams({
        keyword,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
    }).toString();

    const key = `${Constants.CATEGORY_ROUTES.SEARCH}?${queryString}`;

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<CategoryResponse> | null>(
        key,
        async () => {
            const result = await CategoryService.searchCategories(keyword, pageNumber, pageSize);
            return result.success && result.data ? result.data : null;
        },
        { revalidateOnFocus: false }
    );

    const createCategory = async (request: CategoryRequest) => {
        const result = await CategoryService.createCategory(request);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    const updateCategory = async (id: number, request: CategoryRequest) => {
        const result = await CategoryService.updateCategory(id, request);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    const deleteCategory = async (id: number) => {
        const result = await CategoryService.deleteCategory(id);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        categories: (data as any)?.items ?? (data as any)?.content ?? [],
        totalElements: (data as any)?.totalElements ?? 0,
        totalPages: (data as any)?.totalPage ?? (data as any)?.totalPages ?? 0,
        currentPage: (data as any)?.pageNumber ?? (data as any)?.number ?? pageNumber - 1,
        pageSize: (data as any)?.pageSize ?? (data as any)?.size ?? pageSize,
        isLoading,
        error,
        mutate,
        createCategory,
        updateCategory,
        deleteCategory
    };
}

/**
 * Hook to get a single category by ID
 */
export function useCategoryDetail(categoryId?: number) {
    const key = categoryId ? `${Constants.CATEGORY_ROUTES.GET_BY_ID}/${categoryId}` : null;

    const { data, error, isLoading, mutate } = useSWR<CategoryResponse | null>(
        key,
        async () => {
            if (!categoryId) return null;
            const result = await CategoryService.getCategoryById(categoryId);
            return result.success && result.data ? result.data : null;
        },
        { revalidateOnFocus: false }
    );

    const updateCategory = async (request: CategoryRequest) => {
        if (!categoryId) return { success: false, error: 'No category ID provided' };
        
        const result = await CategoryService.updateCategory(categoryId, request);
        if (result.success) {
            await mutate();
        }
        return result;
    };

    return {
        category: data,
        isLoading,
        error,
        mutate,
        updateCategory
    };
}

/**
 * Hook to get all active categories (for dropdowns/filters)
 * Returns CategoryResponsePreview[] from the backend
 */
export function useAllCategories() {
    const key = Constants.CATEGORY_ROUTES.GET_ALL;

    const { data, error, isLoading, mutate } = useSWR<CategoryResponsePreview[] | null>(
        key,
        async () => {
            const result = await CategoryService.getAllCategories();
            return result.success && result.data ? result.data : null;
        },
        { revalidateOnFocus: false }
    );

    return {
        categories: data || [],
        isLoading,
        error,
        mutate
    };
}
