"use client";

import { FileResponse } from "@/types/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonMaterialsProps {
  materials?: FileResponse[];
  lessonId: number;
}

export function LessonMaterials({ materials, lessonId }: LessonMaterialsProps) {
  const { toast } = useToast();

  if (!materials || materials.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const handleDownload = async (material: FileResponse) => {
    try {
      // Open in new tab for direct download
      window.open(material.url, '_blank');
      toast({
        title: "Download started",
        description: `Downloading ${material.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download the material",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Lesson Materials ({materials.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {materials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(material.contentType)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {material.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(material.size)} • {material.contentType.split('/')[1]?.toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(material)}
                className="flex-shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
