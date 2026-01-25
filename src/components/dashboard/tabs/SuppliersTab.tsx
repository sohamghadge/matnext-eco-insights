import { Table, Tag, Progress, Skeleton, Statistic, Divider } from 'antd';
import { Star, Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { componentData, supplierSummary, componentTrendData } from '@/data/dashboardData';

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
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number, record: typeof componentData[0]) => (
        <span className="font-semibold tabular-nums">{value.toLocaleString()} {record.unit}</span>
      ),
    },
    {
      title: 'Recycled Weight (MT)',
      dataIndex: 'recycledWeight',
      key: 'recycledWeight',
      render: (value: number) => (
        <span className="text-accent font-semibold">{value.toFixed(1)}</span>
      ),
    },
    {
      title: 'Total Weight (MT)',
      dataIndex: 'totalWeight',
      key: 'totalWeight',
      render: (value: number) => value.toFixed(1),
    },
    {
      title: 'Recycled %',
      dataIndex: 'recycledWeight',
      key: 'recycledPercent',
      render: (value: number, record: typeof componentData[0]) => {
        const percent = (value / record.totalWeight) * 100;
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">{percent.toFixed(1)}%</span>
            </div>
            <Progress
              percent={percent}
              size="small"
              strokeColor="hsl(var(--accent))"
              trailColor="hsl(var(--muted))"
              showInfo={false}
            />
          </div>
        );
      },
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

  // Bar chart data for component quantities
  const barChartData = componentData.map(item => ({
    name: item.partName,
    Quantity: item.quantity,
    'Recycled Weight': item.recycledWeight * 10, // Scale for visibility
  }));

  // Pie chart for distribution
  const pieData = componentData.map((item, index) => ({
    name: item.partName,
    value: item.quantity,
    color: ['#10b981', '#3b82f6', '#f59e0b'][index],
  }));

  // Eco-score chart data
  const ecoScoreData = componentData.map(item => ({
    name: item.partName,
    score: item.ecoScore,
  }));

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
        <h2 className="text-xl font-semibold text-foreground mb-1">Supply Chain (Suppliers)</h2>
        <p className="text-sm text-muted-foreground">Component tracking and sustainability scoring</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <Statistic
            title={<span className="text-muted-foreground">Recycled Material Weight</span>}
            value={supplierSummary.recycledMaterialWeight}
            suffix="MT"
            valueStyle={{ color: 'hsl(var(--accent))', fontWeight: 700, fontSize: '2rem' }}
          />
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <Statistic
            title={<span className="text-muted-foreground">Total Material Supplied</span>}
            value={supplierSummary.totalMaterialSupplied}
            suffix="MT"
            valueStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700, fontSize: '2rem' }}
          />
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <Statistic
            title={<span className="text-muted-foreground">Total Components</span>}
            value={supplierSummary.totalComponents}
            suffix="Nos."
            valueStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700, fontSize: '2rem' }}
            prefix={<Package className="w-5 h-5 mr-1 inline" />}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Star className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Eco-Score Calculation</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Eco-Score is calculated based on the 5MT recycled weight ratio. Components with scores ≥5 are excellent, ≥4 are good, and below 4 need improvement.
          </p>
        </div>
      </div>

      {/* Component Tracking - Charts + Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-6">Component Tracking</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Quantities */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Component Quantities</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Quantity" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Distribution */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Component Distribution</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} Nos.`, 'Quantity']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Full Data Table */}
        <Table
          columns={columns}
          dataSource={componentData.map((item, i) => ({ ...item, key: i }))}
          pagination={false}
          size="middle"
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

      <Divider />

      {/* Eco-Score Comparison + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eco-Score Comparison */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Eco-Score by Component</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ecoScoreData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="hsl(var(--accent))"
                  radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: 'hsl(var(--foreground))' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Monthly Component Volume Trend</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={componentTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <Line type="monotone" dataKey="frontBumper" name="Front Bumper" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="rearBumper" name="Rear Bumper" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="interior" name="Interior Parts" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersTab;
