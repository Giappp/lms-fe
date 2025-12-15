import { Difficulty } from "@/types/enum";
import { Badge } from "@/components/ui/badge";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const variants: Record<Difficulty, { label: string; className: string }> = {
    [Difficulty.BEGINNER]: { label: "Beginner", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    [Difficulty.INTERMEDIATE]: { label: "Intermediate", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    [Difficulty.ADVANCED]: { label: "Advanced", className: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
  };

  const { label, className: variantClass } = variants[difficulty];

  return (
    <Badge className={`${variantClass} ${className || ""}`}>
      {label}
    </Badge>
  );
}
