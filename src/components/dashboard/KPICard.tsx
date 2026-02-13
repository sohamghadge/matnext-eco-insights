import { Progress, Skeleton } from 'antd';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

type CardVariant = 'green' | 'blue' | 'gold' | 'pink';

interface KPICardProps {
  title: string;
  value: number | string;
  target?: number;
  targetLabel?: string;
  unit?: string;
  variant: CardVariant;
  isLoading?: boolean;
  showProgress?: boolean;
  trend?: { value: number; isPositive: boolean };
  previousValue?: string;
  action?: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  green: 'kpi-card-green',
  blue: 'kpi-card-blue',
  gold: 'kpi-card-gold',
  pink: 'kpi-card-pink',
};

// Get color based on percentage thresholds (Red/Yellow/Green)
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return '#16a34a'; // Green - met
  if (percentage >= 80) return '#eab308'; // Yellow - close
  return '#dc2626'; // Red - danger
};

export const getStatusClass = (percentage: number): string => {
  if (percentage >= 100) return 'status-success';
  if (percentage >= 80) return 'status-warning';
  return 'status-danger';
};

export const getEcoScoreColor = (score: number): string => {
  if (score >= 5) return '#16a34a'; // Green - good
  if (score >= 3.5) return '#eab308'; // Yellow - warning
  return '#dc2626'; // Red - danger
};

export const getEcoScoreTag = (score: number): { color: string; text: string } => {
  if (score >= 5) return { color: 'green', text: 'Excellent' };
  if (score >= 4) return { color: 'gold', text: 'Good' };
  if (score >= 3) return { color: 'orange', text: 'Average' };
  return { color: 'red', text: 'Poor' };
};

const KPICard = ({
  title,
  value,
  target,
  targetLabel = 'Target:',
  unit = '',
  variant,
  isLoading = false,
  showProgress = false,
  trend,
  previousValue,
  action
}: KPICardProps) => {
  const percentage = target ? Math.round((Number(value) / target) * 100) : 0;
  const progressColor = getProgressColor(percentage);

  if (isLoading) {
    return (
      <div className={`${variantClasses[variant]} rounded-xl p-5 shadow-card card-hover relative overflow-hidden min-h-[140px]`}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    );
  }

  return (
    <div className={`${variantClasses[variant]} rounded-xl p-5 shadow-card card-hover relative overflow-hidden min-h-[140px] animate-fade-in`}>
      {/* External Link Icon or Action */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {action}
        {!action && (
          <button className="opacity-50 hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium mb-3 pr-6">{title}</h3>

      {/* Content */}
      <div className="flex items-end justify-between">
        <div className="flex-1">
          {showProgress && target ? (
            <div className="flex items-center gap-4">
              <Progress
                type="dashboard"
                percent={percentage}
                size={80}
                strokeColor={progressColor}
                strokeWidth={8}
                format={() => (
                  <span className="text-lg font-bold" style={{ color: progressColor }}>{percentage}%</span>
                )}
                className="progress-glow"
              />
              <div>
                <p className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                  <span className="text-sm font-normal ml-1">{unit}</span>
                </p>
                <p className="text-xs opacity-70">
                  {targetLabel} {target.toLocaleString()} {unit}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
                <span className="text-base font-normal ml-1">{unit}</span>
              </p>

              {/* Trend indicator with color coding */}
              {trend && (
                <div
                  className="flex items-center gap-1 mt-2 text-sm font-medium"
                  style={{ color: trend.isPositive ? '#16a34a' : '#dc2626' }}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                </div>
              )}

              {previousValue && (
                <p className="text-xs opacity-70 mt-1">Previous: {previousValue}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
