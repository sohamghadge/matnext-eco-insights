import { Table, Tag, Skeleton } from 'antd';
import { CheckCircle } from 'lucide-react';
import KPICard from '../KPICard';
import { materialTargets, modelRecycledContent, partRecycledContent } from '@/data/dashboardData';

interface MSILTabProps {
  isLoading: boolean;
}

const MSILTab = ({ isLoading }: MSILTabProps) => {
  const modelColumns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Recycled Content',
      dataIndex: 'recycledContent',
      key: 'recycledContent',
      render: (value: number) => `${(value * 100).toFixed(3)}%`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color="success"
          className="flex items-center gap-1 w-fit"
        >
          <CheckCircle className="w-3 h-3" />
          Within Norms
        </Tag>
      ),
    },
  ];

  const partColumns = [
    {
      title: 'Part Name',
      dataIndex: 'part',
      key: 'part',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Recycled Content',
      dataIndex: 'recycledContent',
      key: 'recycledContent',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${value * 100}%` }}
            />
          </div>
          <span className="text-sm">{value.toFixed(1)}%</span>
        </div>
      ),
    },
  ];

  const variants: Array<'green' | 'blue' | 'gold' | 'pink'> = ['green', 'blue', 'gold', 'pink'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">MSIL Performance Metrics</h2>
        <p className="text-sm text-muted-foreground">Corporate sustainability targets and achievements</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {materialTargets.map((item, index) => (
          <KPICard
            key={item.material}
            title={`${item.material} Recycled Content`}
            value={item.achieved}
            target={item.target}
            unit={item.unit}
            variant={variants[index]}
            isLoading={isLoading}
            showProgress
          />
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model-Wise Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Model-Wise Average Recycled Content</h3>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Table
              columns={modelColumns}
              dataSource={modelRecycledContent.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="middle"
              className="sustainability-table"
            />
          )}
        </div>

        {/* Part-Wise Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Part-Wise Average Recycled Content</h3>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Table
              columns={partColumns}
              dataSource={partRecycledContent.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="middle"
              className="sustainability-table"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MSILTab;
