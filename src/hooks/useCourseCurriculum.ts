import {Constants} from "@/constants";
import useSWR from "swr";
import {swrFetcher} from "@/lib/swrFetcher";
import {ChapterWithLessons} from "@/types/types";
import {useCallback} from "react";
import {CourseService} from "@/api/services/course-service";

export function useCourseCurriculum(courseId: number | null) {
    const key = courseId ? `${Constants.COURSES_ROUTES.DETAIL}/${courseId}` : null;

    const {data, error, isLoading, isValidating, mutate} = useSWR<ChapterWithLessons[]>(
        key,
        swrFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: true,
            errorRetryCount: 2,
            // Cache curriculum for 5 minutes
            dedupingInterval: 300000,
        }
    );

    const updateCurriculum = useCallback(async (chapters: ChapterWithLessons[]) => {
        if (!courseId) {
            throw new Error('Cannot update curriculum: courseId is null');
        }

        try {
            const payload = {chapters};
            const result = await CourseService.updateCourseCurriculum(courseId, payload);

            if (result?.success) {
                // Optimistically update the cache with new data
                await mutate(chapters, {revalidate: false});
            }

            return result;
        } catch (error) {
            console.error('Failed to update curriculum:', error);
            throw error;
        }
    }, [courseId, mutate]);

    // const addChapter = useCallback(async (chapter: Omit<ChapterWithLessons, 'id'>) => {
    //     if (!courseId) {
    //         throw new Error('Cannot add chapter: courseId is null');
    //     }
    //
    //     try {
    //         const result = await CourseService.addChapter(courseId, chapter);
    //
    //         if (result?.success) {
    //             // Revalidate to get the updated list with server IDs
    //             await mutate();
    //         }
    //
    //         return result;
    //     } catch (error) {
    //         console.error('Failed to add chapter:', error);
    //         throw error;
    //     }
    // }, [courseId, mutate]);
    //
    // const deleteChapter = useCallback(async (chapterId: number) => {
    //     if (!courseId) {
    //         throw new Error('Cannot delete chapter: courseId is null');
    //     }
    //
    //     try {
    //         const result = await CourseService.deleteChapter(courseId, chapterId);
    //
    //         if (result?.success) {
    //             // Optimistic update: remove from local cache
    //             await mutate(
    //                 (currentData) => {
    //                     if (!currentData) return currentData;
    //                     return currentData.filter(chapter => chapter.id !== chapterId);
    //                 },
    //                 {revalidate: true}
    //             );
    //         }
    //
    //         return result;
    //     } catch (error) {
    //         console.error('Failed to delete chapter:', error);
    //         throw error;
    //     }
    // }, [courseId, mutate]);

    return {
        curriculum: data ?? [],
        isLoading,
        isValidating,
        isError: !!error,
        error,
        updateCurriculum,
        mutate,
        refresh: () => mutate(),
    };
}