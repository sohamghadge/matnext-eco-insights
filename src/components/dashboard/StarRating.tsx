import React from 'react';
import { Star } from 'lucide-react';
import { Tooltip } from 'antd';

interface StarRatingProps {
    value: number; // 0 to 5 or percentage (0-100) if isPercentage is true
    max?: number; // Default 5
    size?: number; // Icon size in px
    isPercentage?: boolean; // If true, treats value as 0-100 and converts to 1-5 scale
    showTooltip?: boolean;
}

export const getRatingFromPercentage = (percentage: number): number => {
    if (percentage >= 100) return 5;
    if (percentage >= 90) return 4;
    if (percentage >= 75) return 3;
    if (percentage >= 50) return 2;
    return 1;
};

export const getRatingColor = (rating: number): string => {
    if (rating >= 4) return '#16a34a'; // Green
    if (rating >= 3) return '#eab308'; // Yellow
    if (rating >= 2) return '#f97316'; // Orange
    return '#dc2626'; // Red
};

const StarRating: React.FC<StarRatingProps> = ({
    value,
    max = 5,
    size = 14,
    isPercentage = false,
    showTooltip = true,
}) => {
    const rating = isPercentage ? getRatingFromPercentage(value) : value;
    const color = getRatingColor(rating);

    const stars = [...Array(max)].map((_, i) => {
        const filled = i < rating;
        return (
            <Star
                key={i}
                size={size}
                fill={filled ? color : 'transparent'}
                stroke={filled ? color : '#d1d5db'} // Gray stroke for empty stars
                className="transition-colors duration-300"
            />
        );
    });

    const content = (
        <div className="flex items-center gap-0.5">
            {stars}
        </div>
    );

    if (showTooltip && isPercentage) {
        return (
            <Tooltip title={`${value.toFixed(1)}% Achievement - ${rating} Stars`}>
                {content}
            </Tooltip>
        );
    }

    return content;
};

export default StarRating;
