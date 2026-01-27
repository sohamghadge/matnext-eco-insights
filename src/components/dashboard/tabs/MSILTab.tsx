import { Table, Tag, Skeleton, Divider, Button, Space, Progress } from 'antd';
import { CheckCircle, Download, FileSpreadsheet, Star } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from 'recharts';
import KPICard, { getProgressColor } from '../KPICard';
import { materialTargets, modelRecycledContent, partRecycledContent, materialTrendData, FilterState, getFinancialYear } from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareMaterialDataForExport, prepareModelDataForExport, preparePartDataForExport } from '@/utils/exportUtils';

interface MSILTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const MSILTab = ({ isLoading, filters }: MSILTabProps) => {
  const financialYear = getFinancialYear(filters.dateFrom);
  
  // Filter material targets based on selected materials
  const filteredMaterials = filters.materials.length > 0 
    ? materialTargets.filter(m => filters.materials.includes(m.material))
    : materialTargets;

  // Material Targets Table Columns with additional columns
  const materialColumns = [
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: (text: string) => <span className="font-semibold">{text}</span>,
      fixed: 'left' as const,
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
      render: (value: number) => {
        const color = value >= 10 ? 'green' : value >= 5 ? 'gold' : 'red';
        return (
          <Tag color={color} className="font-semibold">
            {value.toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: unknown, record: { percentage: number }) => {
        const normalizedPercent = Math.min(record.percentage * 10, 100);
        const progressColor = getProgressColor(normalizedPercent);
        return (
          <Progress 
            percent={normalizedPercent} 
            size="small" 
            strokeColor={progressColor}
            format={() => `${record.percentage.toFixed(1)}%`}
          />
        );
      },
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: unknown, record: { percentage: number }) => {
        const stars = record.percentage >= 10 ? 5 : record.percentage >= 7.5 ? 4 : record.percentage >= 5 ? 3 : record.percentage >= 2.5 ? 2 : 1;
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

  const variants: Array<'green' | 'blue' | 'gold' | 'pink'> = ['green', 'blue', 'gold', 'pink'];

  // Chart data for material targets - Combined Bar + Line chart
  const barChartData = filteredMaterials.map(item => ({
    name: item.material,
    Target: item.target,
    Achieved: item.achieved,
    'Achievement %': item.percentage,
  }));

  // Export handlers
  const handleExportCSV = () => {
    const data = prepareMaterialDataForExport(filteredMaterials);
    exportToCSV(data, 'MSIL_Material_Targets', filters);
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        { name: 'Material Targets', data: prepareMaterialDataForExport(filteredMaterials) },
        { name: 'Model Recycled Content', data: prepareModelDataForExport(modelRecycledContent) },
        { name: 'Part Recycled Content', data: preparePartDataForExport(partRecycledContent) },
      ],
      'MSIL_Performance_Metrics',
      filters
    );
  };

  // Show first 4 materials as KPI cards
  const kpiMaterials = filteredMaterials.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title with Export Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">OEM Overview - MSIL Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">
            Corporate sustainability targets and achievements • FY {financialYear}
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

      {/* KPI Cards Grid - Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiMaterials.map((item, index) => (
          <KPICard
            key={item.material}
            title={`${item.material} Recycled Content`}
            value={item.achieved}
            target={item.target}
            unit={item.unit}
            variant={variants[index % variants.length]}
            isLoading={isLoading}
            showProgress
          />
        ))}
      </div>

      {/* Material Achievement Chart - Combined Bar + Line */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Material Achievement Chart</h3>
        <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8dd1e1]"></div>
            <span>Quantity Achieved (MT)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffc658]"></div>
            <span>Target (MT)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span>% Achieved</span>
          </div>
        </div>
        
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={barChartData} margin={{ top: 20, right: 60, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  label={{ value: 'Quantity (MT)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: '% Achieved', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Achievement %') return [`${value.toFixed(2)}%`, name];
                    return [value.toLocaleString(), name];
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                <Bar yAxisId="left" dataKey="Achieved" name="Quantity Achieved (MT)" fill="#8dd1e1" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="Target" name="Target (MT)" fill="#ffc658" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="Achievement %" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Material Targets Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Material-Wise Target vs Achievement (All {filteredMaterials.length} Materials)</h3>
        </div>
        
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table
            columns={materialColumns}
            dataSource={filteredMaterials.map((item, i) => ({ ...item, key: i }))}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} materials` }}
            size="middle"
            scroll={{ x: 1200 }}
          />
        )}
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Achievement Trend (FY {financialYear})</h3>
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
                <Line type="monotone" dataKey="aluminium" name="Aluminium" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="copper" name="Copper" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="plastic" name="Plastic" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="castIron" name="Cast Iron" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="glass" name="Glass" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rubber" name="Rubber" stroke="#84cc16" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <Divider />

      {/* Model & Part Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model-Wise Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Model-Wise Average Recycled Content</h3>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <Table
              columns={modelColumns}
              dataSource={modelRecycledContent.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          )}
        </div>

        {/* Part-Wise Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Part-Wise Average Recycled Content</h3>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <Table
              columns={partColumns}
              dataSource={partRecycledContent.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MSILTab;
