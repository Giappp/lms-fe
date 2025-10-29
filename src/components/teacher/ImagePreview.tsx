import React from "react";

interface Props {
    previewUrl: string | null;
    onRemove: () => void;
}

export default function ImagePreview({previewUrl, onRemove}: Props) {
    if (!previewUrl) return null;

    return (
        <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            <img
                src={previewUrl}
                className="h-full w-full object-cover"
                alt="preview"
            />
            {onRemove && (
                <button
                    onClick={onRemove}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            )}
        </div>
    );
}
