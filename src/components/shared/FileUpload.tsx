import React from 'react'
import {LessonType} from "@/types/enum";
import {Files, FileText, Upload, Video, X} from "lucide-react";
import {Button} from "@/components/ui/button";

type Props = {
    accept: string;
    onChange: (file: File) => void;
    currentFile?: File | string;
    onRemove: () => void;
    lessonType: LessonType;
}

const FileUpload = ({accept, onChange, currentFile, onRemove, lessonType}: Props) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    const getFileIcon = () => {
        if (lessonType === 'VIDEO') return <Video className="w-5 h-5 text-blue-600"/>;
        if (lessonType === 'PDF') return <FileText className="w-5 h-5 text-red-600"/>;
        return <Files className="w-5 h-5 text-gray-600"/>;
    };

    const fileName = currentFile instanceof File ? currentFile.name : currentFile;

    return (
        <div className="space-y-2">
            {!currentFile ? (
                <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400"/>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                            {lessonType === 'VIDEO' && 'MP4, WebM, or Ogg (MAX. 100MB)'}
                            {lessonType === 'PDF' && 'PDF files (MAX. 10MB)'}
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon()}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                            <p className="text-xs text-gray-500">
                                {currentFile instanceof File && `${(currentFile.size / 1024 / 1024).toFixed(2)} MB`}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="w-4 h-4"/>
                    </Button>
                </div>
            )}
        </div>
    );
};
export default FileUpload
