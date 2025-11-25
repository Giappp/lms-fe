import {CourseCreationRequest} from '@/types/request';
import {LessonType} from "@/types/enum";

export type Material = {
    id: number;
    name: string;
    type: 'video' | 'pdf' | 'link';
    url: string;
    description: string;
}

export type ChapterWithLessons = {
    _id: string;
    id?: number;
    title: string;
    orderIndex?: number;
    lessons: Lesson[];
    collapsed?: boolean;
}

export type Lesson = {
    _id: string;
    id?: number;
    title: string;
    content: string;
    description: string;
    duration: number;
    orderIndex?: number;
    chapterId?: number;
    type: LessonType;
    materials?: File[];
}

export type CourseTemplate = {
    id: number;
    title: string;
    description: string;
    icon: string;
}

// Final data for review
export type ReviewCourseData = {
    template: CourseTemplate | null;
    basicInfo: Partial<CourseCreationRequest> | null; // Changed to match CourseFormData
    chapters: ChapterWithLessons[];
}

// Form data during creation
export type CourseFormData = {
    template: CourseTemplate | null;
    basicInfo: Partial<CourseCreationRequest> & { submitted: boolean } | null;
    courseId?: number;
    chapters: ChapterWithLessons[];
}


export interface PaginatedResponse<T> {
    items: T[];
    totalElements: number;
    totalPage: number;
    pageNumber: number;
    pageSize: number;
}