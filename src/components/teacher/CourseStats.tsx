import {ChapterWithLessons} from "@/types/types";
import {BookOpen, Video} from "lucide-react";

type Props = { chapters: ChapterWithLessons[] };

export const CourseStats = ({chapters}: Props) => {
    const totalLessons = chapters.reduce((sum, c) => sum + c.lessons.length, 0);
    const totalDuration = chapters.reduce((sum, c) =>
        sum + c.lessons.reduce((lSum, l) => lSum + l.duration, 0), 0
    );

    return (
        <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-4 h-4 text-blue-600"/>
                <span
                    className="font-medium text-gray-700">{chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <Video className="w-4 h-4 text-green-600"/>
                <span
                    className="font-medium text-gray-700">{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">
                    {totalDuration} min
                </span>
            </div>
        </div>
    );
};