import { Table, Tag, Skeleton, Divider } from 'antd';
import { CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import KPICard from '../KPICard';
import { materialTargets, modelRecycledContent, partRecycledContent, materialTrendData } from '@/data/dashboardData';

interface MSILTabProps {
  isLoading: boolean;
}

const MSILTab = ({ isLoading }: MSILTabProps) => {
  // Material Targets Table Columns
  const materialColumns = [
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Target (MT)',
      dataIndex: 'target',
      key: 'target',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Achieved (MT)',
      dataIndex: 'achieved',
      key: 'achieved',
      render: (value: number) => <span className="text-accent font-semibold">{value.toLocaleString()}</span>,
    },
    {
      title: 'Achievement %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => (
        <Tag color={value >= 10 ? 'success' : value >= 5 ? 'warning' : 'error'}>
          {value.toFixed(2)}%
        </Tag>
      ),
    },
  ];

  const modelColumns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Recycled Content %',
      dataIndex: 'recycledContentPercent',
      key: 'recycledContentPercent',
      render: (value: number) => `${value.toFixed(3)}%`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <Tag color="success" className="flex items-center gap-1 w-fit">
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
      title: 'Recycled Content %',
      dataIndex: 'recycledContentPercent',
      key: 'recycledContentPercent',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.min(value * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value.toFixed(2)}%</span>
        </div>
      ),
    },
  ];

  const variants: Array<'green' | 'blue' | 'gold' | 'pink'> = ['green', 'blue', 'gold', 'pink'];

  // Chart data for material targets
  const barChartData = materialTargets.map(item => ({
    name: item.material,
    Target: item.target,
    Achieved: item.achieved,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">MSIL Performance Metrics</h2>
        <p className="text-sm text-muted-foreground">Corporate sustainability targets and achievements</p>
      </div>

      {/* KPI Cards Grid - Visual */}
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

      {/* Material Targets - Chart + Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Material-Wise Target vs Achievement</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-[300px]">
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Target" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Achieved" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Table */}
          <div>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <Table
                columns={materialColumns}
                dataSource={materialTargets.map((item, i) => ({ ...item, key: i }))}
                pagination={false}
                size="middle"
              />
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Achievement Trend (FY 2025-26)</h3>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={materialTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="steel" name="Steel" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="plastic" name="Plastic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="castIron" name="Cast Iron" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="liion" name="Li-ion" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <Divider />

      {/* Model & Part Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model-Wise - Chart + Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Model-Wise Average Recycled Content</h3>
          
          {/* Horizontal Bar Chart */}
          <div className="h-[180px] mb-4">
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelRecycledContent.map(m => ({ name: m.model, value: m.recycledContentPercent }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(3)}%`} />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Table
              columns={modelColumns}
              dataSource={modelRecycledContent.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
            />
          )}
        </div>

        {/* Part-Wise - Chart + Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Part-Wise Average Recycled Content</h3>
          
          {/* Horizontal Bar Chart */}
          <div className="h-[180px] mb-4">
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={partRecycledContent.map(p => ({ name: p.part, value: p.recycledContentPercent }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Table
              columns={partColumns}
              dataSource={partRecycledContent.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MSILTab;
