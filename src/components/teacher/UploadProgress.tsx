import React from 'react'
import {Progress} from "@/components/ui/progress";

interface Props {
    progress: number;
    onCancel: () => void;
}

const UploadProgress = ({progress}: Props) => {
    if (progress === 0 || progress === 100) return null;
    return (
        <Progress value={progress} className="w-full mt-2"/>
    )
}
export default UploadProgress
