import { Table, Tag, Progress, Skeleton } from 'antd';
import { Star, Package } from 'lucide-react';
import { componentData } from '@/data/dashboardData';

interface SuppliersTabProps {
  isLoading: boolean;
}

const SuppliersTab = ({ isLoading }: SuppliersTabProps) => {
  const getEcoScoreColor = (score: number) => {
    if (score >= 5) return 'success';
    if (score >= 4) return 'warning';
    return 'error';
  };

  const getEcoScoreLabel = (score: number) => {
    if (score >= 5) return 'Excellent';
    if (score >= 4) return 'Good';
    return 'Needs Improvement';
  };

  const columns = [
    {
      title: 'Part Name',
      dataIndex: 'partName',
      key: 'partName',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Quantity (Units)',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) => (
        <span className="font-semibold tabular-nums">{value.toLocaleString()}</span>
      ),
    },
    {
      title: 'Recycled Weight',
      dataIndex: 'recycledWeight',
      key: 'recycledWeight',
      render: (value: number, record: typeof componentData[0]) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm">{value} / {record.totalWeight} MT</span>
            <span className="text-xs text-muted-foreground">
              {((value / record.totalWeight) * 100).toFixed(1)}%
            </span>
          </div>
          <Progress
            percent={(value / record.totalWeight) * 100}
            size="small"
            strokeColor="hsl(var(--accent))"
            trailColor="hsl(var(--muted))"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Eco-Score',
      dataIndex: 'ecoScore',
      key: 'ecoScore',
      render: (score: number) => (
        <div className="flex items-center gap-2">
          <Tag color={getEcoScoreColor(score)} className="m-0">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{score.toFixed(1)}</span>
            </div>
          </Tag>
          <span className="text-xs text-muted-foreground">
            {getEcoScoreLabel(score)}
          </span>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Supply Chain (Suppliers)</h2>
        <p className="text-sm text-muted-foreground">Component tracking and sustainability scoring</p>
      </div>

      {/* Info Banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Star className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Eco-Score Calculation</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Eco-Score is calculated based on the 5MT recycled weight ratio. A higher score indicates better sustainability practices.
            Components with scores ≥5 are considered excellent, ≥4 are good, and below 4 need improvement.
          </p>
        </div>
      </div>

      {/* Component Tracking Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Component Tracking</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {componentData.length} components tracked
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={componentData.map((item, i) => ({ ...item, key: i }))}
          pagination={false}
          size="middle"
          className="sustainability-table"
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {componentData.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {componentData.reduce((sum, item) => sum + item.recycledWeight, 0).toFixed(1)} MT
            </p>
            <p className="text-xs text-muted-foreground">Total Recycled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {(componentData.reduce((sum, item) => sum + item.ecoScore, 0) / componentData.length).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Avg. Eco-Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersTab;
