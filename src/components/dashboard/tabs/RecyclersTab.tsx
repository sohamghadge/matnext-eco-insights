import { useState, useMemo } from 'react';
import { Skeleton, Statistic, Progress, Table, Tag, Divider, Button, Space, Select, notification, Tooltip } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, RadialBarChart, RadialBar, PolarAngleAxis, AreaChart, Area } from 'recharts';
import { Recycle, ArrowRight, TrendingUp, Download, FileSpreadsheet, Star, Package, Scale, Settings, Eye, Leaf, Info, Folder } from 'lucide-react';
import StarRating from '../StarRating';
import ExpandableWidget from '../ExpandableWidget';
import EcoScoreBadge from '../EcoScoreBadge';
import EcoScoreModal from '../EcoScoreModal';
import { SetTargetsModal, ViewTargetsModal } from '../TargetsModal';
import {
  getPlasticBreakdown,
  getRecyclerTrends,
  recyclerStats, // Static summary base
  recyclerSummary,
  FilterState,
  getFinancialYear,
  recyclerAIInsights,
  getRecyclerAvailableOptions,
  getProrationFactor,
} from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareRecyclerDataForExport } from '@/utils/exportUtils';
import { getProgressColor } from '../KPICard';
import AIInsightsWidget from '../AIInsightsWidget';
import RankingTable from '../RankingTable';
import { recyclerRankingKPIs, recyclerEntityScores } from '@/data/dashboardData';
import COAViewerModal from '../COAViewerModal';

interface RecyclersTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const RecyclersTab = ({ isLoading, filters }: RecyclersTabProps) => {
  const financialYear = getFinancialYear(filters.dateFrom);

  // Filter State
  const [selectedRecycler, setSelectedRecycler] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedShape, setSelectedShape] = useState('All');

  // Dynamic Options
  const { recyclers, materials, grades, shapes } = useMemo(() =>
    getRecyclerAvailableOptions(selectedRecycler, selectedMaterial, selectedGrade, selectedShape),
    [selectedRecycler, selectedMaterial, selectedGrade, selectedShape]);

  const recyclerOptions = ['All', ...recyclers].map(r => ({ value: r, label: r }));
  const materialOptions = ['All', ...materials].map(m => ({ value: m, label: m }));
  const gradeOptions = ['All', ...grades].map(g => ({ value: g, label: g }));
  const shapeOptions = ['All', ...shapes].map(s => ({ value: s, label: s }));

  // Dynamic Data Calculation
  const plasticBreakdownData = useMemo(() => getPlasticBreakdown(filters), [filters]);
  const recyclerTrendsData = useMemo(() =>
    getRecyclerTrends(filters, selectedRecycler, selectedMaterial, selectedGrade, selectedShape),
    [filters, selectedRecycler, selectedMaterial, selectedGrade, selectedShape]);

  // Target State
  const [setTargetsOpen, setSetTargetsOpen] = useState(false);
  const [viewTargetsOpen, setViewTargetsOpen] = useState(false);
  const [ecoScoreModalOpen, setEcoScoreModalOpen] = useState(false);
  const [coaViewerOpen, setCoaViewerOpen] = useState(false);
  const [customTargets, setCustomTargets] = useState<any[]>([]);

  // Calculate dynamic target for Recycled Percentage
  const targetRecycledPercentage = useMemo(() => {
    const year = filters.dateFrom.getFullYear();
    const start = year.toString().slice(-2);
    const end = (year + 1).toString().slice(-2);
    const fyString = `20${start} -${end} `;

    const customTarget = customTargets.find(t => t.metric === 'Recycling Efficiency' && t.fy === fyString);
    return customTarget ? customTarget.target : 80; // Default 80%
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

  // Date-based dynamic recycled material percentage calculation
  const dynamicRecyclerSummary = useMemo(() => {
    const prorationFactor = getProrationFactor(filters);

    const baseEfficiency = recyclerSummary.efficiency;
    const efficiencyFluctuation = 1 + (Math.random() * 0.1 - 0.05); // +/- 5%
    const adjustedEfficiency = Math.min(100, Math.round(baseEfficiency * efficiencyFluctuation * 10) / 10);

    return {
      recycledWeight: Math.round(recyclerSummary.recycledWeight * prorationFactor * 100) / 100,
      totalSupplied: Math.round(recyclerSummary.totalSupplied * prorationFactor * 100) / 100,
      efficiency: adjustedEfficiency,
    };
  }, [filters]);

  const recycleRatio = dynamicRecyclerSummary.efficiency;

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
    const data = prepareRecyclerDataForExport(plasticBreakdownData);
    exportToCSV(data, 'Recyclers_Plastic_Breakdown', filters);
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        { name: 'Plastic Breakdown', data: prepareRecyclerDataForExport(plasticBreakdownData) },
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
          name: 'Monthly Trend', data: recyclerTrendsData.map(t => ({
            'Month': t.month,
            'Plastic (MT)': t.plastic,
            'Metal (MT)': t.metal,
            'Battery (MT)': t.battery,
            'Total (MT)': t.plastic + t.metal + t.battery,
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
                { value: 'Peeco Polytech, Sonipat', label: 'Peeco Polytech, Sonipat' },
                { value: 'Peeco Polytech, Panipat', label: 'Peeco Polytech, Panipat' },
                { value: 'Kingfa Science and Technology Ltd.', label: 'Kingfa Science' },
                { value: 'Mitsui Prime ACI', label: 'Mitsui Prime ACI' },
                { value: 'Vardhaman Special Steels Limited', label: 'Vardhaman Special Steels' },
                { value: 'Sunflag Steel India', label: 'Sunflag Steel' },
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

      {/* Facility EcoScore Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Leaf className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-amber-900">Facility Efficiency Score</h3>
              <Button
                type="link"
                size="small"
                className="text-amber-600 font-semibold p-0 flex items-center gap-1 hover:text-amber-800"
                onClick={() => setEcoScoreModalOpen(true)}
              >
                View Details <Settings className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-amber-700">Operational rating based on energy efficiency, purity of output, and safety compliance.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 border-l border-amber-200">
          <div className="text-right">
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Current Score</div>
            <div className="text-3xl font-bold text-amber-800">{recyclerSummary.facilityEcoScore}</div>
          </div>
          <EcoScoreBadge score={recyclerSummary.facilityEcoScore} size="large" />
        </div>
      </div>

      {/* EcoScore Modal */}
      <EcoScoreModal
        isOpen={ecoScoreModalOpen}
        onClose={() => setEcoScoreModalOpen(false)}
        score={recyclerSummary.facilityEcoScore}
        type="RECYCLER"
      />

      {/* Summary Stats Cards - Modern EU Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Recycled Material Weight */}
        <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-blue-500 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recycled Material Weight</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-foreground">{dynamicRecyclerSummary.recycledWeight.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground ml-1">MT</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/20 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% YoY</span>
          </div>
        </div>

        {/* Card 2: Total Material Supplied */}
        <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-emerald-500 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Material Supplied</h3>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-foreground">{dynamicRecyclerSummary.totalSupplied.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground ml-1">MT</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>On track for targets</span>
          </div>
        </div>

        {/* Card 3: Recycled Percentage */}
        <div className="relative group">
          <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-amber-500 relative overflow-hidden group-hover:shadow-lg transition-all h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recycled Percentage</h3>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Recycle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-bold text-foreground">{recycleRatio}</span>
              <span className="text-sm font-medium text-muted-foreground ml-1">%</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/20 w-fit px-2 py-1 rounded-full mb-3">
              <Star className="w-3 h-3 fill-amber-600" />
              <span>Target: {targetRecycledPercentage}%</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-xs text-muted-foreground font-medium">Efficiency Rating:</span>
              <StarRating value={recycleRatio} isPercentage={true} size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Input vs Output - Visual Flow + Stats Table */}
      <ExpandableWidget
        title="Total Input vs Recycled Output"
        expandedContent={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Analysis */}
            <div className="md:col-span-2 bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-full h-fit">
                <Leaf className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 text-sm">AI Analysis</h4>
                <p className="text-sm text-purple-800 mt-1">
                  Recycling efficiency is matching targets. Output volume is stable relative to input variability.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 py-8 bg-secondary/10 rounded-xl">
              <div className="flex items-center justify-center gap-6 scale-110">
                <div className="text-center">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <span className="text-2xl font-bold">{dynamicRecyclerSummary.totalSupplied}</span>
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
                    <span className="text-2xl font-bold text-accent">{dynamicRecyclerSummary.recycledWeight}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Output (MT)</p>
                </div>
              </div>
              <div className="w-full max-w-md p-6 bg-secondary/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Overall Efficiency</span>
                  <span className="text-2xl font-bold text-emerald-600">{recycleRatio}%</span>
                </div>
                <Progress percent={recycleRatio} strokeColor={getProgressColor(recycleRatio)} trailColor="hsl(var(--muted))" />
                <div className="mt-4 flex justify-between text-sm">
                  <span>Target: {targetRecycledPercentage}%</span>
                  <StarRating value={recycleRatio} isPercentage={true} size={14} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Detailed Recycler Statistics</h4>
              <Table
                columns={statsColumns}
                dataSource={recyclerStats.map((item, i) => ({ ...item, key: i }))}
                pagination={false}
                size="middle"
              />
            </div>
          </div>
        }
      >
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-6">Total Input vs Recycled Output</h3>
          <div className="grid grid-cols-1 gap-6">
            {/* Visual Flow */}
            <div className="flex flex-col items-center justify-center gap-6 py-4">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <span className="text-2xl font-bold">{dynamicRecyclerSummary.totalSupplied}</span>
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
                    <span className="text-2xl font-bold text-accent">{dynamicRecyclerSummary.recycledWeight}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Output (MT)</p>
                </div>
              </div>

              {/* Efficiency Bar with color coding */}
              <div className="w-full max-w-md p-4 bg-secondary/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Recycled Percentage</span>
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
                    style={{ left: `${Math.min(targetRecycledPercentage, 100)}% `, transform: 'translateX(-50%)' }}
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
                  <span className="font-semibold text-black">Target: {targetRecycledPercentage}%</span>
                  <span>100%</span>
                </div>

                {/* Star rating */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-dashed border-border">
                  <span className="text-xs font-semibold text-muted-foreground">Efficiency Rating:</span>
                  <StarRating value={recycleRatio} isPercentage={true} size={12} />
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
      </ExpandableWidget>

      <Divider />

      {/* Monthly Trend */}
      <ExpandableWidget
        title="Monthly Input vs Output Trend"
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
                  Upward trend in recycled output despite fluctuating input levels suggests improved process efficiency.
                </p>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recyclerTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                    formatter={(value: number, name: string) => [`${value.toLocaleString()} MT`, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="plastic" stackId="1" name="Plastic (MT)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInput)" />
                  <Area type="monotone" dataKey="metal" stackId="1" name="Metal (MT)" stroke="#64748b" fillOpacity={1} fill="url(#colorOutput)" />
                  <Area type="monotone" dataKey="battery" stackId="1" name="Battery (MT)" stroke="#f59e0b" fillOpacity={1} fill="#fcd34d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detailed Trend Data</h3>
              </div>
              <Table
                columns={[
                  { title: 'Month', dataIndex: 'month', key: 'month' },
                  { title: 'Plastic (MT)', dataIndex: 'plastic', key: 'plastic' },
                  { title: 'Metal (MT)', dataIndex: 'metal', key: 'metal' },
                  { title: 'Battery (MT)', dataIndex: 'battery', key: 'battery' },
                  { title: 'Total (MT)', key: 'total', render: (_, r: any) => (r.plastic + r.metal + r.battery).toLocaleString() }
                ]}
                dataSource={recyclerTrendsData.map((item, i) => ({ ...item, key: i }))}
                pagination={false}
                size="middle"
              />
            </div>
          </div>
        }
      >
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Monthly Input vs Output Trend (FY {financialYear})</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recyclerTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                  formatter={(value: number, name: string) => [`${value.toLocaleString()} MT`, name]}
                />
                <Legend />
                <Area type="monotone" dataKey="plastic" stackId="1" name="Plastic (MT)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInput)" />
                <Area type="monotone" dataKey="metal" stackId="1" name="Metal (MT)" stroke="#64748b" fillOpacity={1} fill="url(#colorOutput)" />
                <Area type="monotone" dataKey="battery" stackId="1" name="Battery (MT)" stroke="#f59e0b" fillOpacity={1} fill="#fcd34d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ExpandableWidget>

      <Divider />

      <ExpandableWidget
        title="Plastic Waste Breakdown"
        expandedContent={
          <Table
            columns={[
              { title: 'Plastic Type', dataIndex: 'type', key: 'type', render: (text, record: any) => <span style={{ color: record.color }} className="font-semibold">{text}</span> },
              { title: 'Quantity (MT)', dataIndex: 'quantity', key: 'quantity', sorter: (a: any, b: any) => a.quantity - b.quantity },
              { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: (val) => `${val}%` },
              { title: 'Processing EcoScore', dataIndex: 'ecoScore', key: 'ecoScore', render: (score) => <EcoScoreBadge score={score} size="small" />, sorter: (a: any, b: any) => a.ecoScore - b.ecoScore },
              { title: 'Target Market', dataIndex: 'targetMarket', key: 'targetMarket' },
              { title: 'Plant', dataIndex: 'plant', key: 'plant' },
            ]}
            dataSource={plasticBreakdownData.map((item, i) => ({ ...item, key: i }))}
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        }
      >
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Plastic Waste Processing Breakdown</h3>
          <Table
            columns={[
              { title: 'Plastic Type', dataIndex: 'type', key: 'type', render: (text, record: any) => <span style={{ color: record.color }} className="font-semibold">{text}</span> },
              { title: 'Quantity (MT)', dataIndex: 'quantity', key: 'quantity' },
              { title: 'EcoScore', dataIndex: 'ecoScore', key: 'ecoScore', render: (score) => <EcoScoreBadge score={score} size="small" /> },
            ]}
            dataSource={plasticBreakdownData.map((item, i) => ({ ...item, key: i }))}
            pagination={false}
            size="small"
          />
        </div>
      </ExpandableWidget>

      <Divider />

      {/* COA Documents Section */}
      <div className="bg-card rounded-xl p-6 shadow-card flex items-center justify-between mb-8 border-l-4 border-accent">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-5 h-5 text-accent" />
            Certificates of Analysis (COA)
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Access the latest material purity and compliance reports uploaded to the FE directory.
          </p>
        </div>
        <Button
          type="primary"
          icon={<Folder className="w-4 h-4" />}
          size="large"
          className="bg-accent hover:bg-accent/90"
          onClick={() => setCoaViewerOpen(true)}
        >
          View COA
        </Button>
      </div>

      <COAViewerModal
        isOpen={coaViewerOpen}
        onClose={() => setCoaViewerOpen(false)}
      />

      {/* AI Insights Section */}
      <AIInsightsWidget insights={recyclerAIInsights} title="Recycler Efficiency Insights" />

      {/* Target Modals */}
      <SetTargetsModal
        open={setTargetsOpen}
        onClose={() => setSetTargetsOpen(false)}
        onSave={handleSaveTarget}
        targetType="recycler"
      />
      <ViewTargetsModal
        open={viewTargetsOpen}
        onClose={() => setViewTargetsOpen(false)}
        customTargets={customTargets}
        targetType="recycler"
      />

      {/* Recycler Ranking Table */}
      <Divider />
      <RankingTable
        title="Weighted Recycler Evaluation Matrix"
        kpis={recyclerRankingKPIs}
        entityScores={recyclerEntityScores}
      />
    </div >
  );
};

export default RecyclersTab;
