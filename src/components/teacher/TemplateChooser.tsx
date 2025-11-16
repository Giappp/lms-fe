'use client';

import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {motion} from 'framer-motion';

type CourseTemplate = {
    id: number;
    title: string;
    description: string;
    icon: string;
}

const templates: CourseTemplate[] = [
    {
        id: 1,
        title: 'Blank Course',
        description: 'Start from scratch with a clean template',
        icon: '📝',
    },
    {
        id: 2,
        title: 'Video Course',
        description: 'Perfect for video-based learning content',
        icon: '🎥',
    },
    {
        id: 3,
        title: 'Programming Course',
        description: 'Structured for teaching programming with code examples',
        icon: '💻',
    },
    {
        id: 4,
        title: 'Interactive Course',
        description: 'Includes quizzes and interactive exercises',
        icon: '🎯',
    },
];

interface TemplateChooserProps {
    onSelect: (template: CourseTemplate) => void;
}

export default function TemplateChooser({onSelect}: TemplateChooserProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

    const handleSelect = (template: CourseTemplate) => {
        setSelectedTemplate(template.id);
        onSelect(template);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <motion.div
                        key={template.id}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <Card
                            className={`p-6 cursor-pointer hover:border-primary transition-colors ${
                                selectedTemplate === template.id ? 'border-2 border-primary' : ''
                            }`}
                            onClick={() => handleSelect(template)}
                            onDoubleClick={() => onSelect(template)}
                        >
                            <div className="text-4xl mb-4">{template.icon}</div>
                            <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <button
                                className="text-sm text-primary mt-4 hover:underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewTemplate(template.id);
                                }}
                            >
                                Preview Template
                            </button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Dialog open={previewTemplate !== null} onOpenChange={() => setPreviewTemplate(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {templates.find((t) => t.id === previewTemplate)?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            Template Preview Content
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
