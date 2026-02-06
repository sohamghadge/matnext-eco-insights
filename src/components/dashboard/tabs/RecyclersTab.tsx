import { useMemo } from 'react';
import { Skeleton, Statistic, Progress, Table, Tag, Divider, Button, Space, Select } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Recycle, ArrowRight, TrendingUp, Download, FileSpreadsheet, Star } from 'lucide-react';
import { plasticBreakdown, recyclerStats, recyclerSummary, recyclerTrendData, FilterState, getFinancialYear } from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareRecyclerDataForExport } from '@/utils/exportUtils';
import { getProgressColor } from '../KPICard';

interface RecyclersTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const RecyclersTab = ({ isLoading, filters }: RecyclersTabProps) => {
  const financialYear = getFinancialYear(filters.dateFrom);

  // Date-based dynamic recycled material percentage calculation
  // Values change based on the selected date range to simulate real-time data
  const dynamicRecyclerData = useMemo(() => {
    const baseEfficiency = recyclerSummary.efficiency;
    const baseRecycledWeight = recyclerSummary.recycledWeight;
    const baseTotalSupplied = recyclerSummary.totalSupplied;

    // Calculate a date factor based on the month (simulates seasonal variation)
    const month = filters.dateFrom.getMonth();
    const dayOfMonth = filters.dateFrom.getDate();
    const dateFactor = 1 + ((month % 3) * 0.05) + (dayOfMonth / 100 * 0.1); // ±5-15% variation

    // Apply date factor to simulate dynamic values
    const adjustedRecycledWeight = Math.round(baseRecycledWeight * dateFactor * 10) / 10;
    const adjustedEfficiency = Math.min(100, Math.round(baseEfficiency * dateFactor * 10) / 10);

    return {
      recycledWeight: adjustedRecycledWeight,
      totalSupplied: baseTotalSupplied,
      efficiency: adjustedEfficiency,
    };
  }, [filters.dateFrom]);

  const pieData = plasticBreakdown.map(item => ({
    name: item.type,
    value: item.quantity,
    percentage: item.percentage,
    color: item.color,
  }));

  // Use dynamic efficiency for recycle ratio
  const recycleRatio = dynamicRecyclerData.efficiency;

  // Plastic Breakdown Table Columns with additional columns
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
  ];

  // Export handlers
  const handleExportCSV = () => {
    const data = prepareRecyclerDataForExport(plasticBreakdown);
    exportToCSV(data, 'Recyclers_Plastic_Breakdown', filters);
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        { name: 'Plastic Breakdown', data: prepareRecyclerDataForExport(plasticBreakdown) },
        {
          name: 'Recycler Statistics', data: recyclerStats.map(s => ({
            'Metric': s.metric,
            'Value': s.value,
            'Unit': s.unit,
            'Target Market': s.targetMarket,
            'Financial Year': s.financialYear,
            'Plant': s.plant,
          }))
        },
        {
          name: 'Monthly Trend', data: recyclerTrendData.map(t => ({
            'Month': t.month,
            'Input (MT)': t.input,
            'Output (MT)': t.output,
            'Efficiency %': ((t.output / t.input) * 100).toFixed(2) + '%',
          }))
        },
      ],
      'Recyclers_Material_Processing',
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
          <h2 className="text-xl font-semibold text-foreground mb-1">Recyclers Overview - Material Processing</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Plastic breakdown and yield percentage metrics • FY {financialYear}
            </p>
            <Select
              placeholder="Select Recycler"
              style={{ width: 220 }}
              allowClear
              options={[
                { value: 'Recycler A', label: 'Global Recyclers Ltd' },
                { value: 'Recycler B', label: 'EcoPlastic Solutions' },
                { value: 'Recycler C', label: 'Green Earth Polymers' },
              ]}
            />
          </div>
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
            title={<span className="text-muted-foreground">Yield Percentage</span>}
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
              scroll={{ x: 500 }}
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
                  <span className="text-2xl font-bold text-accent">{dynamicRecyclerData.recycledWeight}</span>
                </div>
                <p className="text-sm text-muted-foreground">Output (MT)</p>
              </div>
            </div>

            {/* Efficiency Bar with color coding */}
            <div className="w-full max-w-md p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Yield Percentage</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getProgressColor(recycleRatio) }}
                >
                  {recycleRatio}%
                </span>
              </div>
              <div className="relative pt-4">
                {/* Target Marker */}
                <div
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: '80%', transform: 'translateX(-50%)' }}
                >
                  <span className="text-[10px] font-bold text-gray-500 mb-0.5">Target</span>
                  <div className="h-3 w-0.5 bg-black"></div>
                </div>

                <Progress
                  percent={recycleRatio}
                  strokeColor={getProgressColor(recycleRatio)}
                  trailColor="hsl(var(--muted))"
                  showInfo={false}
                  strokeWidth={12}
                />
              </div>

              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-semibold text-black">Target: 80%</span>
                <span>100%</span>
              </div>
              {/* Star rating */}
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => {
                  const stars = recycleRatio >= 80 ? 5 : recycleRatio >= 60 ? 4 : recycleRatio >= 40 ? 3 : recycleRatio >= 20 ? 2 : 1;
                  const color = stars >= 4 ? '#16a34a' : stars >= 3 ? '#eab308' : '#dc2626';
                  return (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < stars ? color : 'transparent'}
                      stroke={i < stars ? color : '#d1d5db'}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats Table */}
          <div>
            <Table
              columns={statsColumns}
              dataSource={recyclerStats.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="middle"
              scroll={{ x: 500 }}
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Input vs Output Trend (FY {financialYear})</h3>
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
                formatter={(value: number, name: string) => [`${value.toLocaleString()} MT`, name]}
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
