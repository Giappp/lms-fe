import {CourseCreationRequest} from '@/types/request';
import {LessonType} from "@/types/enum";

export type Material = {
    id: string;
    name: string;
    type: 'video' | 'pdf' | 'link';
    url: string;
    description: string;
}

export type ChapterWithLessons = {
    id: string;
    title: string;
    lessons: Lesson[];
    collapsed?: boolean;
}

export type Lesson = {
    id: string;
    title: string;
    content: string;
    description: string;
    duration: number;
    orderIndex?: number;
    chapterId?: string;
    type: LessonType;
    materials?: File[];
}

export type CourseTemplate = {
    id: number;
    title: string;
    description: string;
    icon: string;
}

// Form data during creation
export type CourseFormData = {
    template: CourseTemplate | null;
    basicInfo: Partial<CourseCreationRequest> & { submitted: boolean } | null;
    courseId?: number;
    chapters: ChapterWithLessons[];
    materials: Material[];
}

// Final data for review
export type ReviewCourseData = {
    template: CourseTemplate | null;
    basicInfo: Partial<CourseCreationRequest> | null; // Changed to match CourseFormData
    chapters: ChapterWithLessons[];
    materials: Material[];
}

export interface LessonEditorProps {
    lessons: ChapterWithLessons[];
    onSave: (lessons: ChapterWithLessons[]) => void;
}

export interface MaterialsEditorProps {
    materials: Material[];
    onSaveAction: (materials: Material[]) => void;
}

export interface ReviewPublishProps {
    courseData: ReviewCourseData;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}