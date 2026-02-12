import { useState, useMemo } from 'react';
import { Skeleton, Statistic, Progress, Table, Tag, Divider, Button, Space, Select, notification, Tooltip, List, Collapse } from 'antd';
import { Star, Package, Download, FileSpreadsheet, Settings, Eye, Leaf, Info } from 'lucide-react';
import StarRating from '../StarRating';
import ExpandableWidget from '../ExpandableWidget';
import EcoScoreBadge from '../EcoScoreBadge';
import EcoScoreModal from '../EcoScoreModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { SetTargetsModal, ViewTargetsModal } from '../TargetsModal';
import {
  getComponentData,
  getSupplierSummary,
  getComponentVolumeTrendData,
  getSupplierEcoScores,
  getSupplierCarbonData,
  getAvailableOptions,
  FilterState,
  getFinancialYear,
  supplierAIInsights
} from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareComponentDataForExport } from '@/utils/exportUtils';
import { getProgressColor, getEcoScoreTag } from '../KPICard';
import AIInsightsWidget from '../AIInsightsWidget';
import RankingTable from '../RankingTable';
import { supplierRankingKPIs, supplierEntityScores } from '@/data/dashboardData';

interface SuppliersTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const SuppliersTab = ({ isLoading, filters }: SuppliersTabProps) => {
  const [ecoScoreModalOpen, setEcoScoreModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedPart, setSelectedPart] = useState('All');
  const financialYear = getFinancialYear(filters.dateFrom);

  // Dynamic Options based on selections
  const { suppliers, materials, parts } = useMemo(() =>
    getAvailableOptions(selectedSupplier, selectedMaterial, selectedPart),
    [selectedSupplier, selectedMaterial, selectedPart]);

  const supplierOptions = ['All', ...suppliers].map(s => ({ value: s, label: s }));
  const materialOptions = ['All', ...materials].map(m => ({ value: m, label: m }));
  const partOptions = ['All', ...parts].map(p => ({ value: p, label: p }));

  // Dynamic Data Calculation
  const componentData = useMemo(() =>
    getComponentData(filters, selectedSupplier, selectedMaterial, selectedPart),
    [filters, selectedSupplier, selectedMaterial, selectedPart]);

  const supplierSummary = useMemo(() =>
    getSupplierSummary(filters, selectedSupplier, selectedMaterial, selectedPart),
    [filters, selectedSupplier, selectedMaterial, selectedPart]);

  const componentTrendData = useMemo(() =>
    getComponentVolumeTrendData(filters, selectedSupplier, selectedMaterial, selectedPart),
    [filters, selectedSupplier, selectedMaterial, selectedPart]);

  const supplierEcoScores = useMemo(() =>
    getSupplierEcoScores(filters, selectedSupplier, selectedMaterial, selectedPart),
    [filters, selectedSupplier, selectedMaterial, selectedPart]);

  const supplierCarbonData = useMemo(() =>
    getSupplierCarbonData(filters, selectedSupplier, selectedMaterial, selectedPart),
    [filters, selectedSupplier, selectedMaterial, selectedPart]);

  // Calculate average eco-score
  const averageEcoScore = useMemo(() =>
    componentData.length > 0
      ? (componentData.reduce((sum, item) => sum + item.ecoScore, 0) / componentData.length)
      : 0
    , [componentData]);

  // Target State
  const [setTargetsOpen, setSetTargetsOpen] = useState(false);
  const [viewTargetsOpen, setViewTargetsOpen] = useState(false);
  const [customTargets, setCustomTargets] = useState<any[]>([]);

  // Calculate dynamic targets
  const targetEcoScore = useMemo(() => {
    const customTarget = customTargets.find(t => t.metric === 'Green Score' && t.fy === `20${filters.dateFrom.getFullYear().toString().slice(-2)}-${(filters.dateFrom.getFullYear() + 1).toString().slice(-2)}`);
    return customTarget ? customTarget.target : 8.5; // Default 8.5/10
  }, [customTargets, filters.dateFrom]);

  const targetRecycledContent = useMemo(() => {
    const customTarget = customTargets.find(t => t.metric === 'Recycled Content' && t.fy === `20${filters.dateFrom.getFullYear().toString().slice(-2)}-${(filters.dateFrom.getFullYear() + 1).toString().slice(-2)}`);
    return customTarget ? customTarget.target : 30; // Default 30%
  }, [customTargets, filters.dateFrom]);

  const handleSaveTarget = (target: any) => {
    setCustomTargets(prev => [...prev, target]);
    notification.success({
      message: 'Target Set Successfully',
      description: `Target for ${target.metric} has been updated for ${target.fy}.`,
      placement: 'topRight',
      className: '!bg-emerald-50 !border-emerald-200',
      icon: <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center -ml-2"><Leaf className="w-4 h-4 text-emerald-600" /></div>,
      duration: 3,
    });
  };

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
      render: (score: number) => <EcoScoreBadge score={score} size="small" showLabel />,
      sorter: (a: any, b: any) => a.ecoScore - b.ecoScore,
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: unknown, record: { ecoScore: number }) => (
        <StarRating value={record.ecoScore} max={5} size={14} />
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
        {
          name: 'Monthly Trend', data: componentTrendData.map(t => ({
            'Month': t.month,
            'Total Units': t.quantity,
            'Recycled Units': t.recycled,
            'Recycled %': ((t.recycled / t.quantity) * 100).toFixed(1) + '%'
          }))
        },
        {
          name: 'Summary', data: [{
            'Total Components': supplierSummary.totalComponents,
            'Recycled Material Weight (MT)': supplierSummary.recycledMaterialWeight,
            'Total Material Supplied (MT)': supplierSummary.totalMaterialSupplied,
            'Average Eco-Score': (componentData.reduce((sum, item) => sum + item.ecoScore, 0) / componentData.length).toFixed(1),
          }]
        },
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
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Component tracking and sustainability scoring • FY {financialYear}
            </p>
            <Select
              placeholder="Select Supplier"
              style={{ width: 220 }}
              allowClear
              options={[
                { value: 'Satelite Forging Pvt Ltd', label: 'Satelite Forging' },
                { value: 'Sona Comstar', label: 'Sona Comstar' },
                { value: 'MS Moulders', label: 'MS Moulders' },
                { value: 'JTEKT India Pvt. Ltd.', label: 'JTEKT India' },
                { value: 'GKN Driveline India', label: 'GKN Driveline' },
              ]}
            />
          </div>
        </div>
        <Space>
          <Button icon={<Settings className="w-4 h-4" />} onClick={() => setSetTargetsOpen(true)}>Set Targets</Button>
          <Button icon={<Eye className="w-4 h-4" />} onClick={() => setViewTargetsOpen(true)}>View Targets</Button>
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



      {/* Filters & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Supplier Performance</h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Supplier:</span>
            <Select
              value={selectedSupplier}
              onChange={setSelectedSupplier}
              options={supplierOptions}
              className="w-40"
              showSearch
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Material:</span>
            <Select
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              options={materialOptions}
              className="w-32"
              showSearch
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Part:</span>
            <Select
              value={selectedPart}
              onChange={setSelectedPart}
              options={partOptions}
              className="w-40"
              showSearch
            />
          </div>

          <Button icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      {/* Corporate EcoScore Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Leaf className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-blue-900">Average Supplier Sustainability Score</h3>
              <Button
                type="link"
                size="small"
                className="text-blue-600 font-semibold p-0 flex items-center gap-1 hover:text-blue-800"
                onClick={() => setEcoScoreModalOpen(true)}
              >
                View Details <Settings className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-blue-700">Aggregate performance based on recycled content, logistics, and material circularity.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 border-l border-blue-200">
          <div className="text-right">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Avg Score</div>
            <div className="text-3xl font-bold text-blue-800">{averageEcoScore.toFixed(1)}</div>
          </div>
          <EcoScoreBadge score={averageEcoScore} size="large" />
        </div>
      </div>

      {/* EcoScore Modal */}
      <EcoScoreModal
        isOpen={ecoScoreModalOpen}
        onClose={() => setEcoScoreModalOpen(false)}
        score={averageEcoScore}
        type="SUPPLIER"
      />

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

      {/* Expanded Eco-Score Details */}
      <Collapse
        className="bg-card border-border mb-6"
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: (
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Star className="w-4 h-4 text-accent" />
                Eco-Score Calculation Parameters (Score out of 10)
              </div>
            ),
            children: (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Eco-Score is a composite metric derived from multiple sustainability factors. High scores enable green credits.
                </p>
                <List
                  size="small"
                  bordered
                  dataSource={[
                    'Recycled Content Percentage (40% Weightage)',
                    'Carbon Footprint in Logistics (30% Weightage)',
                    'Material Circularity Potential (20% Weightage)',
                    'Supplier Compliance Rating (10% Weightage)',
                  ]}
                  renderItem={(item) => <List.Item className="text-sm">{item}</List.Item>}
                />
                <div className="flex gap-4 mt-2">
                  <Tag color="green">Excellent (≥ 5.0)</Tag>
                  <Tag color="gold">Good (4.0 - 4.9)</Tag>
                  <Tag color="orange">Average (3.0 - 3.9)</Tag>
                  <Tag color="red">Poor (&lt; 3.0)</Tag>
                </div>
              </div>
            )
          }
        ]}
      />

      {/* Component Tracking - Charts + Table */}
      <h3 className="text-lg font-semibold mb-4 text-primary">Component Tracking Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Widget 1: Component Quantities (Bar Chart) */}
        <ExpandableWidget
          title="Component Quantities"
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
                    Door Trims and Bumpers constitute 65% of the total component volume. High intake of interior parts suggests increased dismantling efficiency.
                  </p>
                </div>
              </div>

              <div className="h-[400px]">
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
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [`${value.toLocaleString()} nos`, name]}
                    />
                    <Legend />
                    <Bar dataKey="Quantity" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Divider dashed />
              <div>
                <h4 className="text-lg font-semibold mb-4">Detailed Component List</h4>
                <Table
                  columns={columns}
                  dataSource={componentData.map((item, i) => ({ ...item, key: i }))}
                  pagination={{ pageSize: 15, showSizeChanger: true }}
                  size="middle"
                  scroll={{ x: 1400 }}
                />
              </div>
            </div>
          }
        >
          <div className="bg-card rounded-xl p-6 shadow-card h-full">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Component Quantities</h4>
            <div className="h-[400px]">
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
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [`${value.toLocaleString()} nos`, name]}
                  />
                  <Legend />
                  <Bar dataKey="Quantity" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableWidget>

        {/* Widget 2: Component Distribution (Pie Chart) */}
        <ExpandableWidget
          title="Component Distribution"
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
                    The diverse mix of components indicates a balanced sourcing strategy.
                  </p>
                </div>
              </div>

              <div className="h-[500px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={160}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => [`${value} Nos.`, 'Quantity']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          }
        >
          <div className="bg-card rounded-xl p-6 shadow-card h-full">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Component Distribution</h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 80, left: 10 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ value }) => `${value}`}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => [`${value} Nos.`, 'Quantity']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconSize={8}
                    fontSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableWidget>
      </div>

      {/* Full Data Table - Kept visible below charts */}
      <ExpandableWidget title="Component List Table" expandedContent={
        <Table
          columns={columns}
          dataSource={componentData.map((item, i) => ({ ...item, key: i }))}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          size="middle"
          scroll={{ x: 1400 }}
        />
      }>
        <Table
          columns={columns}
          dataSource={componentData.map((item, i) => ({ ...item, key: i }))}
          pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Total ${total} components` }}
          size="middle"
          scroll={{ x: 1400 }}
        />
      </ExpandableWidget>

      <Divider />

      {/* Eco-Score Comparison + Trend */}
      <div className="grid grid-cols-1 gap-6">
        {/* Eco-Score Comparison */}
        <ExpandableWidget
          title="Eco-Score by Component"
          expandedContent={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ecoScoreData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={90} />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)} pts`, 'Eco-Score']}
                    />
                    <Legend />
                    <ReferenceLine x={targetEcoScore} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${targetEcoScore}`, fill: 'red', fontSize: 10 }} />
                    <Bar
                      dataKey="score"
                      fill="hsl(var(--accent))"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={40}
                      label={{ position: 'right', fill: 'hsl(var(--foreground))' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Score Details</h4>
                <Table
                  columns={[
                    { title: 'Component', dataIndex: 'name', key: 'name' },
                    { title: 'Score', dataIndex: 'score', key: 'score', render: (v) => <Tag color={getEcoScoreTag(v).color}>{v.toFixed(1)}</Tag> },
                    { title: 'Rating', key: 'rating', render: (_, r) => <StarRating value={r.score} max={5} size={14} /> }
                  ]}
                  dataSource={ecoScoreData.map((item, i) => ({ ...item, key: i }))}
                  pagination={false}
                  size="middle"
                />
              </div>
            </div>
          }
        >
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Eco-Score by Component</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ecoScoreData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={90} />
                  <RechartsTooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)} pts`, 'Eco-Score']}
                  />
                  <Legend />
                  <ReferenceLine x={targetEcoScore} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${targetEcoScore}`, fill: 'red', fontSize: 10 }} />
                  <Bar
                    dataKey="score"
                    fill="hsl(var(--accent))"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={40}
                    label={{ position: 'right', fill: 'hsl(var(--foreground))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableWidget>

        {/* Monthly Trend */}
        <ExpandableWidget
          title="Monthly Component Volume Trend"
          expandedContent={
            <div className="flex flex-col gap-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={componentTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <RechartsTooltip
                      cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number, name: string) => [`${value.toLocaleString()} Units`, name]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="quantity" name="Total Units" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="recycled" name="Recycled Units" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          }
        >
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Monthly Component Volume Trend (FY {financialYear})</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={componentTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <RechartsTooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number, name: string) => [`${value.toLocaleString()} Units`, name]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="quantity" name="Total Units" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="recycled" name="Recycled Units" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableWidget>
      </div>

      <Divider />

      {/* AI Insights Section */}
      <AIInsightsWidget insights={supplierAIInsights} title="Supply Chain Sustainability Insights" />

      {/* Target Modals */}
      <SetTargetsModal
        open={setTargetsOpen}
        onClose={() => setSetTargetsOpen(false)}
        onSave={handleSaveTarget}
        targetType="supplier"
      />
      <ViewTargetsModal
        open={viewTargetsOpen}
        onClose={() => setViewTargetsOpen(false)}
        customTargets={customTargets}
        targetType="supplier"
      />

      {/* Supplier Ranking Table */}
      <Divider />
      <RankingTable
        title="Weighted Supplier Evaluation Matrix"
        kpis={supplierRankingKPIs}
        entityScores={supplierEntityScores}
      />
    </div >
  );
};

export default SuppliersTab;
