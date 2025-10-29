import React, {useEffect, useRef, useState} from 'react'
import ImagePreview from "@/components/teacher/ImagePreview";
import UploadProgress from "@/components/teacher/UploadProgress";

const ImageUploader = ({onUploaded}: { onUploaded: (url: string) => void }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = useRef<AbortController | null>(null);
    const objectUrlRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            // cleanup any created object URL on unmount
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Cancel previous upload if exists
        if (abortController.current) abortController.current.abort();

        // Show preview instantly
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        if (abortController.current) abortController.current.abort();
    };

    return (
        <div className="flex w-full max-w-lg flex-col mx-auto p-2 space-y-3">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex w-full items-center justify-center">
                {previewUrl ? (
                    <div className="flex items-center space-x-4">
                        <ImagePreview previewUrl={previewUrl} onRemove={handleRemoveImage}/>
                    </div>
                ) : (<div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50"
                    >
                        <p className="text-gray-500">Click to upload image</p>
                    </div>
                )}
            </div>

            {uploading && <UploadProgress progress={progress} onCancel={() => abortController.current?.abort()}/>}
        </div>
    );
}
export default ImageUploader
