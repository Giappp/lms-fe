"use client";

import { CourseResponse } from "@/types/response";
import { DifficultyBadge } from "./DifficultyBadge";
import { StatusBadge } from "./StatusBadge";
import { PriceBadge } from "./PriceBadge";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Star } from "lucide-react";
import Image from "next/image";

interface CourseHeaderProps {
  course: CourseResponse;
  enrolledCount?: number;
  showStatus?: boolean;
  actions?: React.ReactNode;
}

export function CourseHeader({ course, enrolledCount, showStatus = false, actions }: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-background border-b">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* Left side - Course info */}
          <div className="space-y-4">
            {/* Categories */}
            {course.categories && course.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    style={{ backgroundColor: category.color + "20", color: category.color }}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground">
              {course.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{course.teacherName}</span>
              </div>

              <DifficultyBadge difficulty={course.difficulty} />

              {course.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating.toFixed(1)}</span>
                </div>
              )}

              {enrolledCount !== undefined && enrolledCount > 0 && (
                <Badge variant="secondary">
                  {enrolledCount} {enrolledCount === 1 ? "Student" : "Students"}
                </Badge>
              )}

              {showStatus && <StatusBadge status={course.status} />}

              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-2">
              <PriceBadge price={course.price} size="lg" />
            </div>

            {/* Actions */}
            {actions && <div className="pt-4">{actions}</div>}
          </div>

          {/* Right side - Thumbnail */}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border bg-muted">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-center">
                  <p className="text-muted-foreground">No thumbnail</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
