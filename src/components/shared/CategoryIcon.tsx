import React from 'react';
import { 
    Code, 
    TrendingUp, 
    Smartphone, 
    Cloud, 
    Shield,
    BookOpen,
    Palette,
    Database,
    Cpu,
    Globe,
    Briefcase,
    Camera,
    Music,
    Heart,
    Zap
} from 'lucide-react';

interface CategoryIconProps {
    icon?: string;
    className?: string;
}

// Mapping from Font Awesome class names to Lucide React icons
const iconMap: Record<string, React.ElementType> = {
    'fa-code': Code,
    'fa-chart-line': TrendingUp,
    'fa-mobile-alt': Smartphone,
    'fa-cloud': Cloud,
    'fa-shield-alt': Shield,
    'fa-book-open': BookOpen,
    'fa-palette': Palette,
    'fa-database': Database,
    'fa-microchip': Cpu,
    'fa-globe': Globe,
    'fa-briefcase': Briefcase,
    'fa-camera': Camera,
    'fa-music': Music,
    'fa-heart': Heart,
    'fa-bolt': Zap,
};

export function CategoryIcon({ icon, className = "w-4 h-4" }: CategoryIconProps) {
    if (!icon) return null;

    // Check if it's a Font Awesome class name
    const IconComponent = iconMap[icon];
    
    if (IconComponent) {
        return <IconComponent className={className} />;
    }

    // Fallback: render as emoji if it's a single character
    if (icon.length <= 2) {
        return <span className={className}>{icon}</span>;
    }

    // Fallback: try to render as HTML entity or return null
    return <span className={className}>{icon}</span>;
}
