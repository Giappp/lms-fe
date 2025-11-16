"use client";

import React, {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';

type Material = {
    id: string;
    name: string;
    type: 'video' | 'pdf' | 'link';
    url: string;
    description: string;
};

type MaterialsEditorProps = {
    materials: Material[];
    onSaveAction: (materials: Material[]) => void;
};

export default function MaterialsEditor({materials: initialMaterials, onSaveAction}: MaterialsEditorProps) {
    const [materials, setMaterials] = useState<Material[]>(initialMaterials || []);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newMaterial, setNewMaterial] = useState<Partial<Material>>({});
    const [draggedFile, setDraggedFile] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggedFile(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggedFile(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggedFile(false);

        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            // In a real implementation, this would upload to your storage service
            const newMaterial: Material = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type.includes('pdf') ? 'pdf' : 'video',
                url: URL.createObjectURL(file), // Temporary URL for preview
                description: ''
            };
            setMaterials(prev => [...prev, newMaterial]);
        });
    };

    const handleAddMaterial = () => {
        if (newMaterial.name && newMaterial.url) {
            setMaterials(prev => [...prev, {
                ...newMaterial,
                id: Math.random().toString(36).substr(2, 9)
            } as Material]);
            setNewMaterial({});
            setIsAddDialogOpen(false);
        }
    };

    const handleRemoveMaterial = (id: string) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Course Materials</h2>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add Material</Button>
            </div>

            <Card
                className={`p-8 border-2 border-dashed ${
                    draggedFile ? 'border-primary bg-primary/10' : 'border-muted'
                } transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <p className="text-muted-foreground">
                        Drag and drop files here, or click to select files
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Supports video files, PDFs, and external links
                    </p>
                </div>
            </Card>

            <div className="grid gap-4 mt-6">
                {materials.map((material) => (
                    <Card key={material.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl">
                                    {material.type === 'video' && '🎥'}
                                    {material.type === 'pdf' && '📄'}
                                    {material.type === 'link' && '🔗'}
                                </div>
                                <div>
                                    <h3 className="font-medium">{material.name}</h3>
                                    <p className="text-sm text-muted-foreground">{material.description}</p>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveMaterial(material.id)}
                            >
                                Remove
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Material</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newMaterial.name || ''}
                                onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                                placeholder="Enter material name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                className="w-full p-2 rounded border"
                                value={newMaterial.type || 'link'}
                                onChange={(e) => setNewMaterial({
                                    ...newMaterial,
                                    type: e.target.value as Material['type']
                                })}
                            >
                                <option value="video">Video</option>
                                <option value="pdf">PDF</option>
                                <option value="link">External Link</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={newMaterial.url || ''}
                                onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                                placeholder="Enter URL"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={newMaterial.description || ''}
                                onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                                placeholder="Enter description"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddMaterial}>Add Material</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex justify-end mt-6">
                <Button onClick={() => onSaveAction(materials)}>
                    Save & Continue
                </Button>
            </div>
        </div>
    );
}
