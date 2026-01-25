import { Progress, Skeleton } from 'antd';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

type CardVariant = 'green' | 'blue' | 'gold' | 'pink';

interface KPICardProps {
  title: string;
  value: number | string;
  target?: number;
  unit?: string;
  variant: CardVariant;
  isLoading?: boolean;
  showProgress?: boolean;
  trend?: { value: number; isPositive: boolean };
  previousValue?: string;
}

const variantClasses: Record<CardVariant, string> = {
  green: 'kpi-card-green',
  blue: 'kpi-card-blue',
  gold: 'kpi-card-gold',
  pink: 'kpi-card-pink',
};

const progressColors: Record<CardVariant, string> = {
  green: '#166534',
  blue: '#1e40af',
  gold: '#92400e',
  pink: '#be123c',
};

const KPICard = ({
  title,
  value,
  target,
  unit = '',
  variant,
  isLoading = false,
  showProgress = false,
  trend,
  previousValue,
}: KPICardProps) => {
  const percentage = target ? Math.round((Number(value) / target) * 100) : 0;

  if (isLoading) {
    return (
      <div className={`${variantClasses[variant]} rounded-xl p-5 shadow-card card-hover relative overflow-hidden min-h-[140px]`}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    );
  }

  return (
    <div className={`${variantClasses[variant]} rounded-xl p-5 shadow-card card-hover relative overflow-hidden min-h-[140px] animate-fade-in`}>
      {/* External Link Icon */}
      <button className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity">
        <ExternalLink className="w-4 h-4" />
      </button>

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
                strokeColor={progressColors[variant]}
                strokeWidth={8}
                format={() => (
                  <span className="text-lg font-bold">{percentage}%</span>
                )}
                className="progress-glow"
              />
              <div>
                <p className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                  <span className="text-sm font-normal ml-1">{unit}</span>
                </p>
                <p className="text-xs opacity-70">
                  Target: {target.toLocaleString()} {unit}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
                <span className="text-base font-normal ml-1">{unit}</span>
              </p>
              
              {/* Trend indicator */}
              {trend && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
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
