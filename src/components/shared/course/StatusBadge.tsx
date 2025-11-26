import { CourseStatus } from "@/types/enum";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: CourseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<CourseStatus, { label: string; className: string }> = {
    [CourseStatus.DRAFT]: { label: "Draft", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
    [CourseStatus.PUBLISHED]: { label: "Published", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  };

  const { label, className: variantClass } = variants[status];

  return (
    <Badge className={`${variantClass} ${className || ""}`}>
      {label}
    </Badge>
  );
}
