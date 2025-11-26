import { DollarSign } from "lucide-react";

interface PriceBadgeProps {
  price: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceBadge({ price, className = "", size = "md" }: PriceBadgeProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold"
  };

  return (
    <div className={`flex items-center gap-1 text-primary ${sizeClasses[size]} ${className}`}>
      <DollarSign className={size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} />
      <span>{price.toFixed(2)}</span>
    </div>
  );
}
