"use client";

import React, {useState} from 'react';
import LessonEditor from '@/components/teacher/LessonEditor';
import {Card} from '@/components/ui/card';

export default function Page() {
    const [saved, setSaved] = useState(false);
    const handleSave = (data: any) => {
        console.log('Saved curriculum:', data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="p-6">
            <Card className="p-6 max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Create Curriculum</h1>
                <p className="text-sm text-muted-foreground mb-6">Add chapters and lessons for your course. Changes are
                    kept locally; click Save Curriculum to emit the structure.</p>

                <LessonEditor onSaveAction={handleSave} initial={[]}/>

                <div className="mt-6 text-center">
                    {saved ? (
                        <div className="inline-block rounded bg-green-100 text-green-800 px-4 py-2">Curriculum saved
                            (see console)</div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Not saved</div>
                    )}
                </div>
            </Card>
        </div>
    );
}

