import {CourseCreationRequest, Lesson} from '@/types/request';

export type Material = {
    id: string;
    name: string;
    type: 'video' | 'pdf' | 'link';
    url: string;
    description: string;
}

export type ChapterWithLessons = {
    title: string;
    courseId: number;
    lessons: Lesson[];
}

type CourseTemplate = {
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
