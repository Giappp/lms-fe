"use client";

import { useState, useRef } from "react";
import { LessonType } from "@/types/enum";
import { PlayCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LessonVideoPlayerProps {
  type: LessonType;
  videoUrl?: string;
  title: string;
}

export function LessonVideoPlayer({ type, videoUrl, title }: LessonVideoPlayerProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!videoUrl || (type !== LessonType.VIDEO && type !== LessonType.YOUTUBE)) {
    return null;
  }

  const isYouTube = type === LessonType.YOUTUBE || 
                    videoUrl.includes('youtube.com') || 
                    videoUrl.includes('youtu.be');

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Không thể tải video. Vui lòng kiểm tra lại.
          <br />
          <span className="text-xs mt-2 block opacity-70">URL: {videoUrl}</span>
        </AlertDescription>
      </Alert>
    );
  }

  if (isYouTube) {
    const getYouTubeEmbedUrl = (url: string) => {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    return (
      <div className="mb-6 rounded-lg overflow-hidden bg-black shadow-2xl">
        <div className="aspect-video relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <PlayCircle className="h-16 w-16 text-white/50 mx-auto mb-2 animate-pulse" />
                <p className="text-white/70 text-sm">Đang tải video...</p>
              </div>
            </div>
          )}
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
            title={title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg overflow-hidden shadow-2xl">
      <div className="aspect-video relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center">
              <PlayCircle className="h-16 w-16 text-white/50 mx-auto mb-2 animate-pulse" />
              <p className="text-white/70 text-sm">Đang tải video...</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          controls
          controlsList="nodownload"
          crossOrigin="anonymous"
          playsInline
          preload="metadata"
          onLoadedData={() => {
            console.log("✅ Video loaded successfully:", videoUrl);
            setLoading(false);
          }}
          onError={(e) => {
            console.error("❌ Video error:", e, videoUrl);
            console.error("Error details:", videoRef.current?.error);
            setError(true);
          }}
          onCanPlay={() => {
            console.log("🎬 Video can play");
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Trình duyệt của bạn không hỗ trợ video tag.
        </video>
      </div>
    </div>
  );
}
