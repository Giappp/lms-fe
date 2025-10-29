"use client";

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Chapter, Lesson} from '@/types/request';
import {LessonType} from '@/types/enum';
import {DragDropContext, Droppable} from '@hello-pangea/dnd';
import ChapterCard from './ChapterCard';

type LessonEditorProps = {
    onSaveAction: (data: any) => void;
};

type ChapterWithLessons = Chapter & {
    id?: string; // local id for react keys & dnd
    lessons: (Lesson & any)[];
};

export default function LessonEditor({onSaveAction}: LessonEditorProps) {
    const [chapters, setChapters] = useState<ChapterWithLessons[]>([]);

    const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const handleAddChapter = () => {
        const newChapter: ChapterWithLessons = {
            id: makeId(),
            title: `Chapter ${chapters.length + 1}`,
            courseId: 0, // This will be set when saving
            lessons: []
        };
        // prepend so the new chapter appears on top of the list (above the button)
        setChapters([newChapter, ...chapters]);
    };

    const handleRemoveChapter = (chapterIndex: number) => {
        const newChapters = [...chapters];
        newChapters.splice(chapterIndex, 1);
        setChapters(newChapters);
    };

    const handleAddLesson = (chapterIndex: number) => {
        const newChapters = [...chapters];
        const newLesson: Lesson & any = {
            title: `New Lesson`,
            type: LessonType.PDF,
            content: '',
            description: '',
            duration: 0,
            videoUrl: '',
            pdfUrl: '',
            chapterId: chapterIndex
        };
        newChapters[chapterIndex].lessons.push(newLesson);
        setChapters(newChapters);
    };

    const handleRemoveLesson = (chapterIndex: number, lessonIndex: number) => {
        const newChapters = [...chapters];
        newChapters[chapterIndex].lessons.splice(lessonIndex, 1);
        setChapters(newChapters);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, chapterIndex: number, lessonIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const newChapters = [...chapters];
        newChapters[chapterIndex].lessons[lessonIndex].pdfUrl = URL.createObjectURL(file);
        // keep original file for upload later
        newChapters[chapterIndex].lessons[lessonIndex].pdfFile = file;
        setChapters(newChapters);
    };

    // helper updaters for lesson and chapter properties
    const updateChapterTitle = (chapterIndex: number, value: string) => {
        const newChapters = [...chapters];
        newChapters[chapterIndex].title = value;
        setChapters(newChapters);
    };

    const updateLessonTitle = (chapterIndex: number, lessonIndex: number, value: string) => {
        const newChapters = [...chapters];
        newChapters[chapterIndex].lessons[lessonIndex].title = value;
        setChapters(newChapters);
    };

    const updateLessonType = (chapterIndex: number, lessonIndex: number, value: string) => {
        const newChapters = [...chapters];
        newChapters[chapterIndex].lessons[lessonIndex].type = value as LessonType;
        // reset content fields when type changes
        if (value === LessonType.MARKDOWN) {
            newChapters[chapterIndex].lessons[lessonIndex].content = '';
        } else if (value === LessonType.PDF) {
            newChapters[chapterIndex].lessons[lessonIndex].pdfUrl = '';
            newChapters[chapterIndex].lessons[lessonIndex].pdfFile = undefined;
        }
        setChapters(newChapters);
    };

    const updateLessonContent = (chapterIndex: number, lessonIndex: number, value: string) => {
        const newChapters = [...chapters];
        // for video and markdown we store in content / videoUrl depending on type
        if (newChapters[chapterIndex].lessons[lessonIndex].type === LessonType.VIDEO) {
            newChapters[chapterIndex].lessons[lessonIndex].videoUrl = value;
        } else {
            newChapters[chapterIndex].lessons[lessonIndex].content = value;
        }
        setChapters(newChapters);
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        // Distinguish between chapter drag (type === 'CHAPTER') and lesson drag
        if (result.type === 'CHAPTER') {
            const sourceIndex = result.source.index;
            const destIndex = result.destination.index;
            const newChapters = [...chapters];
            const [moved] = newChapters.splice(sourceIndex, 1);
            newChapters.splice(destIndex, 0, moved);
            setChapters(newChapters);
            return;
        }

        // lesson drag
        const sourceDroppable = result.source.droppableId; // format: lessons-<chapterId>
        const destDroppable = result.destination.droppableId;
        const sourceChapterIndex = chapters.findIndex(c => `lessons-${c.id}` === sourceDroppable);
        const destChapterIndex = chapters.findIndex(c => `lessons-${c.id}` === destDroppable);
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (sourceChapterIndex === -1 || destChapterIndex === -1) return;

        const newChapters = [...chapters];
        const [movedLesson] = newChapters[sourceChapterIndex].lessons.splice(sourceIndex, 1);
        newChapters[destChapterIndex].lessons.splice(destIndex, 0, movedLesson);

        setChapters(newChapters);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold">Course Structure</h2>
            </div>

            <div className="flex justify-start">
                <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full w-full h-10 flex items-center justify-center"
                    onClick={handleAddChapter}
                    aria-label="Add chapter"
                >
                    + <span>Add New Chapter</span>
                </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="chapters-droppable" type="CHAPTER">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                            {chapters.map((chapter, chapterIndex) => (
                                // ChapterCard contains its own Draggable and the lessons Droppable
                                <ChapterCard
                                    key={chapter.id ?? chapterIndex}
                                    chapter={chapter}
                                    index={chapterIndex}
                                    onChangeTitleAction={updateChapterTitle}
                                    onAddLessonAction={handleAddLesson}
                                    onRemoveChapterAction={handleRemoveChapter}
                                    onUpdateLessonTitleAction={updateLessonTitle}
                                    onUpdateLessonTypeAction={updateLessonType}
                                    onUpdateLessonContentAction={updateLessonContent}
                                    onFileChangeAction={handleFileChange}
                                    onRemoveLessonAction={handleRemoveLesson}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="flex justify-end mt-6">
                <Button onClick={() => onSaveAction(chapters)}>
                    Save & Continue
                </Button>
            </div>
        </div>
    );
}
