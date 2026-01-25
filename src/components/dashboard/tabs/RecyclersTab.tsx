import { Skeleton, Statistic, Progress, Table, Tag, Divider } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { Recycle, ArrowRight, TrendingUp } from 'lucide-react';
import { plasticBreakdown, recyclerStats, recyclerSummary, recyclerTrendData } from '@/data/dashboardData';

interface RecyclersTabProps {
  isLoading: boolean;
}

const RecyclersTab = ({ isLoading }: RecyclersTabProps) => {
  const pieData = plasticBreakdown.map(item => ({
    name: item.type,
    value: item.quantity,
    percentage: item.percentage,
    color: item.color,
  }));

  const recycleRatio = recyclerSummary.efficiency;

  // Plastic Breakdown Table Columns
  const plasticColumns = [
    {
      title: 'Plastic Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string, record: typeof plasticBreakdown[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: record.color }} />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Quantity (MT)',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) => <span className="font-semibold">{value.toLocaleString()}</span>,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => (
        <Tag color="processing">{value}%</Tag>
      ),
    },
  ];

  // Recycler Stats Table Columns
  const statsColumns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: typeof recyclerStats[0]) => (
        <span className="text-accent font-bold text-lg">
          {value.toFixed(2)} {record.unit}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Material Processing (Recyclers)</h2>
        <p className="text-sm text-muted-foreground">Plastic breakdown and recycling efficiency metrics</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <Statistic
            title={<span className="text-muted-foreground">Recycled Material Weight</span>}
            value={recyclerSummary.recycledWeight}
            suffix="MT"
            valueStyle={{ color: 'hsl(var(--accent))', fontWeight: 700, fontSize: '2rem' }}
          />
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <Statistic
            title={<span className="text-muted-foreground">Total Material Supplied</span>}
            value={recyclerSummary.totalSupplied}
            suffix="MT"
            valueStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700, fontSize: '2rem' }}
          />
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <Statistic
            title={<span className="text-muted-foreground">Recycling Efficiency</span>}
            value={recyclerSummary.efficiency}
            suffix="%"
            valueStyle={{ color: 'hsl(var(--accent))', fontWeight: 700, fontSize: '2rem' }}
            prefix={<TrendingUp className="w-5 h-5 mr-1 inline" />}
          />
        </div>
      </div>

      {/* Plastic Breakdown - Chart + Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-6">Plastic Material Breakdown</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${value} MT`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} MT (${pieData.find(p => p.name === name)?.percentage}%)`, name]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div>
            <Table
              columns={plasticColumns}
              dataSource={plasticBreakdown.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="middle"
            />

            {/* Summary below table */}
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Plastic</span>
                <span className="font-bold text-lg">
                  {plasticBreakdown.reduce((sum, item) => sum + item.quantity, 0)} MT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input vs Output - Visual Flow + Stats Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-6">Total Input vs Recycled Output</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Flow */}
          <div className="flex flex-col items-center justify-center gap-6 py-4">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-2xl font-bold">{recyclerSummary.totalSupplied}</span>
                </div>
                <p className="text-sm text-muted-foreground">Input (MT)</p>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowRight className="w-8 h-8 text-accent" />
                <Recycle className="w-12 h-12 text-accent animate-spin" style={{ animationDuration: '8s' }} />
                <ArrowRight className="w-8 h-8 text-accent" />
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-2xl font-bold text-accent">{recyclerSummary.recycledWeight}</span>
                </div>
                <p className="text-sm text-muted-foreground">Output (MT)</p>
              </div>
            </div>

            {/* Efficiency Bar */}
            <div className="w-full max-w-md p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recycling Efficiency</span>
                <span className="text-lg font-bold text-accent">{recycleRatio}%</span>
              </div>
              <Progress
                percent={recycleRatio}
                strokeColor={{
                  '0%': '#10b981',
                  '100%': '#059669',
                }}
                trailColor="hsl(var(--muted))"
                showInfo={false}
                strokeWidth={12}
              />
            </div>
          </div>

          {/* Stats Table */}
          <div>
            <Table
              columns={statsColumns}
              dataSource={recyclerStats.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="middle"
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Input vs Output Trend</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recyclerTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Line type="monotone" dataKey="input" name="Total Input (MT)" stroke="#64748b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="output" name="Recycled Output (MT)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RecyclersTab;
