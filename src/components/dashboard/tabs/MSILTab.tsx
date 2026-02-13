import { useState, useMemo } from 'react';
import { Table, Tag, Skeleton, Divider, Button, Space, Progress, Tooltip, Segmented } from 'antd';
import { CheckCircle, Download, FileSpreadsheet, Star, Leaf, Eye, Info, ChevronRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Area } from 'recharts';
import KPICard, { getProgressColor } from '../KPICard';
import AIInsightsWidget from '../AIInsightsWidget';
import ExpandableWidget from '../ExpandableWidget';
import EcoScoreBadge from '../EcoScoreBadge';
import EcoScoreModal from '../EcoScoreModal';
import {
  getMaterialTargets,
  getModelRecycledContent,
  getPartRecycledContent,
  getMSILComponentDispatchData,
  getMSILTestVehiclesData,
  FilterState,
  getFinancialYear,
  msilAIInsights,
  getMaterialTrendData,
  msilCorporateEcoScore
} from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareMaterialDataForExport, prepareModelDataForExport, preparePartDataForExport } from '@/utils/exportUtils';
import { useRegulatoryData } from '@/data/regulatoryData';
import ComplianceSubTab from '../Compliance/ComplianceSubTab';

interface MSILTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const MSILTab = ({ isLoading, filters }: MSILTabProps) => {
  const financialYear = getFinancialYear(filters.dateFrom);
  const [ecoScoreModalOpen, setEcoScoreModalOpen] = useState(false);
  const { data: regulatoryData, isLoading: isRegulatoryLoading } = useRegulatoryData();
  const [activeView, setActiveView] = useState<'Overview' | 'Compliance'>('Overview');

  // Dynamic Data Calculation
  const materialTargetsData = useMemo(() => getMaterialTargets(filters), [filters]);
  const modelRecycledContentData = useMemo(() => getModelRecycledContent(filters), [filters]);
  const partRecycledContentData = useMemo(() => getPartRecycledContent(filters), [filters]);
  const componentDispatchData = useMemo(() => getMSILComponentDispatchData(filters), [filters]);
  const monthlyTrendData = useMemo(() => getMaterialTrendData(filters), [filters]);

  // Filter material targets based on selected materials
  const filteredMaterials = filters.materials.length > 0
    ? materialTargetsData.filter(m => filters.materials.includes(m.material))
    : materialTargetsData;

  // Material Targets Table Columns with additional columns
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
      render: (value: number) => <span className="text-emerald-600 font-medium">{value.toLocaleString()}</span>,
    },
    {
      title: 'Achievement %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => {
        let color = 'red';
        if (value >= 100) color = 'green';
        else if (value >= 80) color = 'orange'; // Changed to orange for 80-99%
        else if (value >= 50) color = 'gold';

        return (
          <div className="flex items-center gap-2">
            <Progress percent={value} size="small" showInfo={false} strokeColor={color} />
            <span className="text-xs font-medium" style={{ color }}>{value.toFixed(1)}%</span>
          </div>
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
      title: 'Sourced ELV',
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
      render: (text: string) => <span className="font-medium text-primary">{text}</span>,
    },
    {
      title: 'Recycled Content',
      dataIndex: 'recycledContentPercent',
      key: 'recycledContentPercent',
      render: (val: number) => (
        <span className="font-bold text-emerald-600">{(val * 100).toFixed(1)}%</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'compliant' ? 'success' : status === 'warning' ? 'warning' : 'error';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
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
      title: 'EcoScore',
      dataIndex: 'ecoScore',
      key: 'ecoScore',
      render: (score: number) => <EcoScoreBadge score={score} size="small" />,
      sorter: (a: any, b: any) => a.ecoScore - b.ecoScore,
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
      render: (text: string) => <span className="font-medium text-primary">{text}</span>,
    },
    {
      title: 'Recycled Content',
      dataIndex: 'recycledContentPercent',
      key: 'recycledContentPercent',
      render: (val: number) => (
        <Progress
          percent={val * 100}
          steps={5}
          size="small"
          strokeColor="#10b981"
          format={(percent) => `${percent?.toFixed(0)}%`}
        />
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
      title: 'EcoScore',
      dataIndex: 'ecoScore',
      key: 'ecoScore',
      render: (score: number) => <EcoScoreBadge score={score} size="small" />,
      sorter: (a: any, b: any) => a.ecoScore - b.ecoScore,
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
  const handleExportMaterials = (type: 'csv' | 'excel') => {
    const data = prepareMaterialDataForExport(filteredMaterials);
    if (type === 'csv') exportToCSV(data, `MSIL_Material_Targets_${financialYear}`, filters);
    else exportToExcel([{ name: 'Material Targets', data }], `MSIL_Material_Targets_${financialYear}`, filters);
  };

  const handleExportModels = () => {
    const data = prepareModelDataForExport(modelRecycledContentData);
    exportToCSV(data, `MSIL_Model_Recycled_Content_${financialYear}`, filters);
  };

  const handleExportParts = () => {
    const data = preparePartDataForExport(partRecycledContentData);
    exportToCSV(data, `MSIL_Part_Recycled_Content_${financialYear}`, filters);
  };

  // Show first 4 materials as KPI cards
  const kpiMaterials = filteredMaterials.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Switcher */}
      <div className="flex justify-center mb-4">
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-xl border border-gray-200 inline-flex shadow-sm">
          <button
            onClick={() => setActiveView('Overview')}
            className={`transition-all duration-300 rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 ${activeView === 'Overview'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Corporate Overview
          </button>
          <button
            onClick={() => setActiveView('Compliance')}
            className={`transition-all duration-300 rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 ${activeView === 'Compliance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Regulatory Compliance
          </button>
        </div>
      </div>

      {activeView === 'Overview' ? (
        <>
          {/* Top Value Chain Stats - Now visible immediately */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiMaterials.map((item, index) => (
              <KPICard
                key={item.material}
                title={item.material}
                value={item.achieved}
                unit="MT"
                target={item.target}
                variant={variants[index % variants.length]}
                trend={{ value: 2.5, isPositive: true }}
                showProgress={true}
              />
            ))}
          </div>

          {/* Corporate EcoScore Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-emerald-900">Corporate Sustainability Score</h3>
                  <Button
                    type="link"
                    size="small"
                    className="text-emerald-600 font-semibold p-0 flex items-center gap-1 hover:text-emerald-800"
                    onClick={() => setEcoScoreModalOpen(true)}
                  >
                    View Details <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm text-emerald-700">Aggregated score based on material recovery, supplier performance, and recycled content integration.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 border-l border-emerald-200">
              <div className="text-right">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Current Score</div>
                <div className="text-3xl font-bold text-emerald-800">{msilCorporateEcoScore}</div>
              </div>
              <EcoScoreBadge score={msilCorporateEcoScore} size="large" />
            </div>
          </div>


          {/* EcoScore Modal */}
          <EcoScoreModal
            isOpen={ecoScoreModalOpen}
            onClose={() => setEcoScoreModalOpen(false)}
            score={msilCorporateEcoScore}
            type="MSIL"
          />

          <div className="grid grid-cols-1 gap-6">

            <ExpandableWidget
              title="Material Recovery Targets"
              expandedContent={
                <div className="flex flex-col gap-6">
                  {/* AI Analysis */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                    <div className="bg-purple-100 p-2 rounded-full h-fit">
                      <Leaf className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 text-sm">AI Analysis</h4>
                      <p className="text-sm text-purple-800 mt-1">
                        Steel and Aluminium recovery usage is on track. Plastic recovery is lagging by 15% due to sourcing constraints.
                      </p>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
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
                        <RechartsTooltip
                          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value: number, name: string) => {
                            if (name === 'Achievement %') return [`${value.toFixed(2)}%`, name];
                            return [`${value.toLocaleString()} MT`, name];
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                        <Bar yAxisId="left" dataKey="Achieved" name="Quantity Achieved (MT)" fill="#8dd1e1" radius={[4, 4, 0, 0]} maxBarSize={60} />
                        <Bar yAxisId="left" dataKey="Target" name="Target (MT)" fill="#ffc658" radius={[4, 4, 0, 0]} maxBarSize={60} />
                        <Line yAxisId="right" type="monotone" dataKey="Achievement %" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <Divider dashed />
                  <div className="bg-card rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Detailed Target Breakdown</h3>
                    </div>
                    <Table
                      columns={materialColumns}
                      dataSource={filteredMaterials.map((item, i) => ({ ...item, key: i }))}
                      pagination={{ pageSize: 15 }}
                      size="middle"
                      scroll={{ x: 1200 }}
                    />
                  </div>
                </div>
              }
            >
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Material Recovery Targets</h3>
                    <p className="text-sm text-muted-foreground">Target vs Achieved by Material Type</p>
                  </div>
                  <Space>
                    <Button icon={<Download className="w-4 h-4" />} onClick={() => handleExportMaterials('csv')}>CSV</Button>
                    <Button icon={<FileSpreadsheet className="w-4 h-4" />} onClick={() => handleExportMaterials('excel')}>Excel</Button>
                  </Space>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
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
                      <RechartsTooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'Achievement %') return [`${value.toFixed(2)}%`, name];
                          return [`${value.toLocaleString()} MT`, name];
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar yAxisId="left" dataKey="Achieved" name="Quantity Achieved (MT)" fill="#8dd1e1" radius={[4, 4, 0, 0]} maxBarSize={60} />
                      <Bar yAxisId="left" dataKey="Target" name="Target (MT)" fill="#ffc658" radius={[4, 4, 0, 0]} maxBarSize={60} />
                      <Line yAxisId="right" type="monotone" dataKey="Achievement %" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
                    </ComposedChart >
                  </ResponsiveContainer >
                </div>
              </div>
            </ExpandableWidget>

            {/* Material Targets Table */}
            < div className="bg-card rounded-xl p-6 shadow-card" >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Material-Wise Target vs Achievement (All {filteredMaterials.length} Materials)</h3>
              </div>

              {
                isLoading ? (
                  <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                  <Table
                    columns={materialColumns}
                    dataSource={filteredMaterials.map((item, i) => ({ ...item, key: i }))}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} materials` }}
                    size="middle"
                    scroll={{ x: 1200 }}
                  />
                )
              }
            </div >

            {/* Monthly Trend Chart */}
            <ExpandableWidget
              title="Monthly Achievement Trend"
              expandedContent={
                <div className="flex flex-col gap-6">
                  {/* AI Analysis */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                    <div className="bg-purple-100 p-2 rounded-full h-fit">
                      <Leaf className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 text-sm">AI Analysis</h4>
                      <p className="text-sm text-purple-800 mt-1">
                        Consistent growth in recovery rates observed across all materials. Q3 projection shows 12% increase if current trend continues.
                      </p>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number, name: string) => [`${value.toLocaleString()} MT`, name]}
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
                  <Divider dashed />
                  <div className="bg-card rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Detailed Monthly Data</h3>
                    </div>
                    <Table
                      columns={[
                        { title: 'Month', dataIndex: 'month', key: 'month', fixed: 'left' },
                        { title: 'Steel (MT)', dataIndex: 'steel', key: 'steel' },
                        { title: 'Aluminium (MT)', dataIndex: 'aluminium', key: 'aluminium' },
                        { title: 'Copper (MT)', dataIndex: 'copper', key: 'copper' },
                        { title: 'Plastic (MT)', dataIndex: 'plastic', key: 'plastic' },
                        { title: 'Cast Iron (MT)', dataIndex: 'castIron', key: 'castIron' },
                        { title: 'Glass (MT)', dataIndex: 'glass', key: 'glass' },
                        { title: 'Rubber (MT)', dataIndex: 'rubber', key: 'rubber' },
                      ]}
                      dataSource={monthlyTrendData.map((item, i) => ({ ...item, key: i }))}
                      pagination={{ pageSize: 12 }}
                      size="middle"
                      scroll={{ x: 1000 }}
                    />
                  </div>
                </div>
              }
            >
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">Monthly Achievement Trend (FY {financialYear})</h3>
                {
                  isLoading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number, name: string) => [`${value.toLocaleString()} MT`, name]}
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
                  )
                }
              </div>
            </ExpandableWidget>
          </div>

          <Divider />

          {/* Model & Part Analysis Section */}
          <div className="grid grid-cols-1 gap-6">
            {/* Model-Wise Table */}
            <ExpandableWidget
              title="Model-Wise Average Recycled Content"
              expandedContent={
                <Table
                  columns={modelColumns}
                  dataSource={modelRecycledContentData.map((item, i) => ({ ...item, key: i }))}
                  pagination={{ pageSize: 20 }}
                  size="middle"
                  scroll={{ x: 800 }}
                />
              }
            >
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">Model-Wise Average Recycled Content</h3>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 6 }} />
                ) : (
                  <Table
                    columns={modelColumns}
                    dataSource={modelRecycledContentData.map((item, i) => ({ ...item, key: i }))}
                    pagination={false}
                    size="small"
                    scroll={{ x: 600 }}
                  />
                )}
              </div>
            </ExpandableWidget>

            {/* Part-Wise Table */}
            <ExpandableWidget
              title="Part-Wise Average Recycled Content"
              expandedContent={
                <Table
                  columns={partColumns}
                  dataSource={partRecycledContentData.map((item, i) => ({ ...item, key: i }))}
                  pagination={{ pageSize: 20 }}
                  size="middle"
                  scroll={{ x: 800 }}
                />
              }
            >
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">Part-Wise Average Recycled Content</h3>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 6 }} />
                ) : (
                  <Table
                    columns={partColumns}
                    dataSource={partRecycledContentData.map((item, i) => ({ ...item, key: i }))}
                    pagination={false}
                    size="small"
                    scroll={{ x: 600 }}
                  />
                )}
              </div>
            </ExpandableWidget>
          </div>

          <Divider />

          {/* AI Insights Section */}
          <AIInsightsWidget insights={msilAIInsights} title="Strategic AI Insights (MSIL)" />
        </>
      ) : (
        <ComplianceSubTab regulatoryData={regulatoryData} isLoading={isRegulatoryLoading} />
      )}
    </div >
  );
};

export default MSILTab;
