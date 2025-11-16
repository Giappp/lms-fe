import React from 'react'
import {Button} from "@/components/ui/button";
import {BookOpen, GripVertical, Plus, Trash} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";


const ChapterHeader = () => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-grab active:cursor-grabbing shrink-0 mt-1"
                        title="Drag to reorder"
                    >
                        <GripVertical className="w-4 h-4 text-muted-foreground"/>
                    </Button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-blue-600"/>
                            <Label
                                className="text-base font-semibold text-gray-900">Chapter Dragged</Label>
                        </div>
                        <Input
                            placeholder="Enter chapter title"
                            className="font-medium text-base bg-white"/>
                        {/* Chapter Stats */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete chapter"
                        >
                            <Trash className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Button
                        variant="default"
                        size="sm"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Lesson
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default ChapterHeader
