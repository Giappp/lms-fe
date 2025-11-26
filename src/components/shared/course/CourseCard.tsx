"use client";

import { CourseResponse } from "@/types/response";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DifficultyBadge } from "./DifficultyBadge";
import { PriceBadge } from "./PriceBadge";
import { StatusBadge } from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: CourseResponse;
  href: string;
  showStatus?: boolean;
  actions?: React.ReactNode;
}

export function CourseCard({ course, href, showStatus = false, actions }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={href}>
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden bg-muted">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <BookOpen className="h-16 w-16 text-primary/20" />
              </div>
            )}
            {showStatus && (
              <div className="absolute top-2 right-2">
                <StatusBadge status={course.status} />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Categories */}
          {course.categories && course.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {course.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: category.color + "20", color: category.color }}
                >
                  {category.name}
                </Badge>
              ))}
              {course.categories.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{course.categories.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="truncate">{course.teacherName}</span>
            </div>
            <DifficultyBadge difficulty={course.difficulty} className="text-xs" />
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <PriceBadge price={course.price} size="lg" />
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
