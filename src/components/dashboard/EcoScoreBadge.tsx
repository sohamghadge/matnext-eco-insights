import { Tag } from 'antd';
import { Star } from 'lucide-react';

interface EcoScoreBadgeProps {
    score: number; // 0-10
    size?: 'small' | 'default' | 'large';
    showLabel?: boolean;
}

const EcoScoreBadge = ({ score, size = 'default', showLabel = false }: EcoScoreBadgeProps) => {
    let color = 'red';
    let bgColor = 'bg-red-50';
    let textColor = 'text-red-700';
    let borderColor = 'border-red-200';

    if (score >= 9.0) {
        color = 'green';
        bgColor = 'bg-emerald-50';
        textColor = 'text-emerald-700';
        borderColor = 'border-emerald-200';
    } else if (score >= 7.0) {
        color = 'blue';
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-700';
        borderColor = 'border-blue-200';
    } else if (score >= 5.0) {
        color = 'gold';
        bgColor = 'bg-yellow-50';
        textColor = 'text-yellow-700';
        borderColor = 'border-yellow-200';
    }

    const sizeClasses = size === 'small' ? 'px-1.5 py-0.5 text-xs' : size === 'large' ? 'px-3 py-1 text-base' : 'px-2 py-0.5 text-sm';

    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border ${bgColor} ${borderColor} ${sizeClasses}`}>
            <Star className={`w-3.5 h-3.5 ${textColor} fill-current`} />
            <span className={`font-semibold ${textColor}`}>
                {score.toFixed(1)}
                {showLabel && <span className="opacity-75 font-normal ml-1">/ 10</span>}
            </span>
        </div>
    );
};

export default EcoScoreBadge;
