"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface LessonContentProps {
  content: string;
  description?: string;
}

export function LessonContent({ content, description }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About this lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </CardContent>
        </Card>
      )}

      {content && (
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
