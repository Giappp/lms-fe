import {LessonType} from "@/types/enum";
import {Lesson} from "@/types/types";
import {Edit, Files, Link2, Trash, Video, YoutubeIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export const LessonCard = ({
                               lesson,
                               index,
                               chapterIndex,
                               onEdit,
                               onRemove
                           }: {
    lesson: Lesson;
    index: number;
    chapterIndex: number;
    onEdit: () => void;
    onRemove: () => void;
}) => {
    const getLessonIcon = (type: LessonType) => {
        switch (type) {
            case 'VIDEO':
                return <Video className="w-4 h-4 text-blue-600"/>;
            case 'YOUTUBE':
                return <YoutubeIcon className="w-4 h-4 text-red-600"/>;
            case 'MARKDOWN':
                return <Link2 className="w-4 h-4 text-green-600"/>;
        }
    };

    const getLessonTypeName = (type: LessonType) => {
        switch (type) {
            case 'VIDEO':
                return 'Video';
            case 'YOUTUBE':
                return 'PDF';
            case 'MARKDOWN':
                return 'Link';
        }
    };

    return (
        <div className="group bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-1">
                    {getLessonIcon(lesson.type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                                {chapterIndex + 1}.{index + 1} {lesson.title}
                            </h4>
                            {lesson.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {lesson.description}
                                </p>
                            )}
                            {lesson.materials && (
                                lesson.materials.length > 0 &&
                                lesson.materials.map((material, idx) => (
                                    <p key={idx} className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Files className="w-3 h-3"/>
                                        {material.name}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        <span
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200">
                            {getLessonIcon(lesson.type)}
                            {getLessonTypeName(lesson.type)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {lesson.duration} min
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                        <Edit className="w-4 h-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
};