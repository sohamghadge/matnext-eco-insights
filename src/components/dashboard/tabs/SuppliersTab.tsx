import { Table, Tag, Progress, Skeleton, Statistic, Divider, Button, Space } from 'antd';
import { Star, Package, Download, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { componentData, supplierSummary, componentTrendData, FilterState, getFinancialYear } from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareComponentDataForExport } from '@/utils/exportUtils';
import { getProgressColor, getEcoScoreTag } from '../KPICard';

interface SuppliersTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const SuppliersTab = ({ isLoading, filters }: SuppliersTabProps) => {
  const financialYear = getFinancialYear(filters.dateFrom);

  const columns = [
    {
      title: 'Part Name',
      dataIndex: 'partName',
      key: 'partName',
      fixed: 'left' as const,
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
        const progressColor = getProgressColor(percent);
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: progressColor }}>{percent.toFixed(1)}%</span>
            </div>
            <Progress
              percent={percent}
              size="small"
              strokeColor={progressColor}
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
      render: (score: number) => {
        const { color, text } = getEcoScoreTag(score);
        return (
          <div className="flex items-center gap-2">
            <Tag color={color} className="m-0">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" />
                <span>{score.toFixed(1)}</span>
              </div>
            </Tag>
            <span className="text-xs text-muted-foreground">
              {text}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: unknown, record: { ecoScore: number }) => {
        const stars = record.ecoScore >= 5 ? 5 : record.ecoScore >= 4 ? 4 : record.ecoScore >= 3 ? 3 : record.ecoScore >= 2 ? 2 : 1;
        const color = stars >= 4 ? '#16a34a' : stars >= 3 ? '#eab308' : '#dc2626';
        return (
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-3.5 h-3.5" 
                fill={i < stars ? color : 'transparent'} 
                stroke={i < stars ? color : '#d1d5db'}
              />
            ))}
          </div>
        );
      },
    },
    {
      title: 'Target Market',
      dataIndex: 'targetMarket',
      key: 'targetMarket',
    },
    {
      title: 'Financial Year',
      dataIndex: 'financialYear',
      key: 'financialYear',
    },
    {
      title: 'Plant',
      dataIndex: 'plant',
      key: 'plant',
    },
    {
      title: 'Sourced from ELV',
      dataIndex: 'sourcedFromELV',
      key: 'sourcedFromELV',
      render: (value: string) => (
        <Tag color={value === 'Yes' ? 'green' : 'default'}>{value}</Tag>
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
  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
  const pieData = componentData.map((item, index) => ({
    name: item.partName,
    value: item.quantity,
    color: pieColors[index % pieColors.length],
  }));

  // Eco-score chart data
  const ecoScoreData = componentData.map(item => ({
    name: item.partName,
    score: item.ecoScore,
  }));

  // Export handlers
  const handleExportCSV = () => {
    const data = prepareComponentDataForExport(componentData);
    exportToCSV(data, 'Suppliers_Component_Tracking', filters);
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        { name: 'Component Tracking', data: prepareComponentDataForExport(componentData) },
        { name: 'Monthly Trend', data: componentTrendData.map(t => ({
          'Month': t.month,
          'Front Bumper': t.frontBumper,
          'Rear Bumper': t.rearBumper,
          'Interior Parts': t.interior,
          'Dashboard': t.dashboard,
        })) },
        { name: 'Summary', data: [{
          'Total Components': supplierSummary.totalComponents,
          'Recycled Material Weight (MT)': supplierSummary.recycledMaterialWeight,
          'Total Material Supplied (MT)': supplierSummary.totalMaterialSupplied,
          'Average Eco-Score': (componentData.reduce((sum, item) => sum + item.ecoScore, 0) / componentData.length).toFixed(1),
        }] },
      ],
      'Suppliers_Supply_Chain',
      filters
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title with Export Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Suppliers Overview - Supply Chain</h2>
          <p className="text-sm text-muted-foreground">
            Component tracking and sustainability scoring • FY {financialYear}
          </p>
        </div>
        <Space>
          <Button 
            icon={<Download className="w-4 h-4" />} 
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button 
            type="primary"
            icon={<FileSpreadsheet className="w-4 h-4" />} 
            onClick={handleExportExcel}
            className="bg-[#4b6043] hover:bg-[#5a7350]"
          >
            Export XLSX
          </Button>
        </Space>
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
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                    interval={0}
                  />
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
                    label={({ name, value }) => `${value}`}
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Full Data Table */}
        <Table
          columns={columns}
          dataSource={componentData.map((item, i) => ({ ...item, key: i }))}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} components` }}
          size="middle"
          scroll={{ x: 1400 }}
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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ecoScoreData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={90} />
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
          <h3 className="text-lg font-semibold mb-4">Monthly Component Volume Trend (FY {financialYear})</h3>
          <div className="h-[300px]">
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
                <Line type="monotone" dataKey="dashboard" name="Dashboard" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersTab;
