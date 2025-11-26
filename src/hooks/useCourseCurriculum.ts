import {Constants} from "@/constants";
import useSWR from "swr";
import {swrFetcher} from "@/lib/swrFetcher";
import {TableOfContentsResponse} from "@/types/response";
import {ReorderTableOfContentsRequest} from "@/types/request";
import {useCallback} from "react";
import {CourseService} from "@/api/services/course-service";

export function useCourseCurriculum(courseId: number | undefined) {
    const key = courseId ? `/api/courses/${courseId}/navigation/table-of-contents` : null;

    const {data, error, isLoading, isValidating, mutate} = useSWR<TableOfContentsResponse>(
        key,
        swrFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: true,
            errorRetryCount: 2,
            // Reduce deduping interval to allow immediate updates
            dedupingInterval: 2000,
        }
    );

    const reorderTableOfContents = useCallback(async (request: ReorderTableOfContentsRequest) => {
        if (!courseId) {
            throw new Error('Cannot reorder table of contents: courseId is null');
        }

        const result = await CourseService.reorderTableOfContents(courseId, request);

        if (result?.success) {
            await mutate();
        }

        return result;
    }, [courseId, mutate]);

    return {
        tableOfContents: data ?? null,
        course: data?.courseResponse ?? null,
        chapters: data?.chapters ?? [],
        enrolledCount: data?.enrolledCount ?? 0,
        isLoading,
        isValidating,
        isError: !!error,
        error,
        reorderTableOfContents,
        mutate,
        refresh: () => mutate(),
    };
}