import React from 'react';
import { Tooltip, Progress } from 'antd';

interface StarRatingProps {
    value: number; // Score on a scale of 0-10, or percentage (0-100) if isPercentage is true
    max?: number; // Default 10 (scale of 10)
    size?: number; // Font size in px for the percentage text
    isPercentage?: boolean; // If true, treats value as 0-100 percentage directly
    showTooltip?: boolean;
}

export const getRatingColor = (percentage: number): string => {
    if (percentage >= 80) return '#16a34a'; // Green
    if (percentage >= 60) return '#eab308'; // Yellow
    if (percentage >= 40) return '#f97316'; // Orange
    return '#dc2626'; // Red
};

const StarRating: React.FC<StarRatingProps> = ({
    value,
    max = 10,
    size = 14,
    isPercentage = false,
    showTooltip = true,
}) => {
    // Convert to percentage
    const percentage = isPercentage ? value : (value / max) * 100;
    const clampedPct = Math.min(100, Math.max(0, percentage));
    const color = getRatingColor(clampedPct);

    const content = (
        <div className="flex items-center gap-2" style={{ minWidth: 80 }}>
            <Progress
                percent={clampedPct}
                size="small"
                strokeColor={color}
                trailColor="#e5e7eb"
                showInfo={false}
                style={{ width: 60, margin: 0 }}
            />
            <span
                style={{
                    fontSize: size,
                    fontWeight: 700,
                    color,
                    whiteSpace: 'nowrap',
                }}
            >
                {clampedPct.toFixed(0)}%
            </span>
        </div>
    );

    if (showTooltip) {
        const tooltipText = isPercentage
            ? `${clampedPct.toFixed(1)}% Achievement`
            : `Score: ${value.toFixed(1)} / ${max} (${clampedPct.toFixed(1)}%)`;
        return (
            <Tooltip title={tooltipText}>
                {content}
            </Tooltip>
        );
    }

    return content;
};

export default StarRating;
