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
    type: LessonType;
    content: string;
    description: string;
    duration: number;
    videoUrl?: string;
    pdfUrl?: string;
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
    basicInfo: Partial<CourseCreationRequest> | null;
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
