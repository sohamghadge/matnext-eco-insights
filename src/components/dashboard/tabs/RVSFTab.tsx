
import { useState, useMemo } from 'react';
import { DatePicker, Select, Button, Table, Tag, Skeleton, Divider, Radio, message, notification, Tooltip, Segmented } from 'antd';
import { RefreshCw, ExternalLink, MapPin, Link2, Settings, Eye, Leaf, AlertTriangle, FileText, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';
import EcoScoreBadge from '../EcoScoreBadge';
import EcoScoreModal from '../EcoScoreModal';
import StarRating from '../StarRating';
import ExpandableWidget from '../ExpandableWidget';
import { Info } from 'lucide-react';
import { SetTargetsModal, ViewTargetsModal } from '../TargetsModal';
import dayjs from 'dayjs';
import InteractiveIndiaMap from '../InteractiveIndiaMap';
import AIInsightsWidget from '../AIInsightsWidget';
import {
  FilterState,
  rvsfFilterOptions,
  getRVSFSummaryStats,
  getScrapDispatchDetails,
  getMSILComponentDispatchData,
  getMonthwiseCDData,
  getVehicleOriginLocations,
  msilTestVehiclesData, // Keep static or make dynamic if needed
  fixedTargets,
  rvsfAIInsights,
  steelEPRCreditsStatus,
  rvsfList,
  rvsfRankingKPIs,
  rvsfEntityScores,
  getProrationFactor,
} from '@/data/dashboardData';
import RankingTable from '../RankingTable';

interface RVSFTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const RVSFTab = ({ isLoading, filters }: RVSFTabProps) => {
  // Global filters
  const { dateFrom, dateTo } = filters;

  // Local filters specific to RVSF
  const [elvMake, setElvMake] = useState('Maruti Suzuki');
  const [makeYear, setMakeYear] = useState('2005-06');
  const [source, setSource] = useState('Collection Center');

  // Map view and AI feedback state
  const [mapViewMode, setMapViewMode] = useState<'origin' | 'collection' | 'rvsf'>('origin');
  const [rvsfFilter, setRvsfFilter] = useState('All'); // Changed default to 'All'
  const [selectedCollectionCenter, setSelectedCollectionCenter] = useState('All');
  const [codPeriod, setCodPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Dynamic Data Calculation
  const rvsfSummaryData = useMemo(() => getRVSFSummaryStats(filters), [filters]);
  const scrapDispatchData = useMemo(() => getScrapDispatchDetails(filters), [filters]);
  const componentDispatchData = useMemo(() => getMSILComponentDispatchData(filters), [filters]);
  const cdTrendData = useMemo(() => getMonthwiseCDData(filters), [filters]);
  const vehicleOriginData = useMemo(() => getVehicleOriginLocations(filters), [filters]);

  // Target State
  const [setTargetsOpen, setSetTargetsOpen] = useState(false);
  const [viewTargetsOpen, setViewTargetsOpen] = useState(false);
  const [ecoScoreModalOpen, setEcoScoreModalOpen] = useState(false);
  const [customTargets, setCustomTargets] = useState<any[]>([]);

  // Calculate dynamic targets
  const targetVehiclesScrapped = useMemo(() => {
    const customTarget = customTargets.find(t => t.metric === 'Vehicles Scrapped' && t.fy === `20${dateFrom.getFullYear().toString().slice(-2)} -${(dateFrom.getFullYear() + 1).toString().slice(-2)} `);
    const baseTarget = customTarget ? customTarget.target : 500; // Default 500 (Annual)
    // Prorate based on selected date range
    return Math.round(baseTarget * getProrationFactor(filters));
  }, [customTargets, dateFrom, filters]);

  const targetRecoveryRate = useMemo(() => {
    const customTarget = customTargets.find(t => t.metric === 'Recovery Rate' && t.fy === `20${dateFrom.getFullYear().toString().slice(-2)} -${(dateFrom.getFullYear() + 1).toString().slice(-2)} `);
    return customTarget ? customTarget.target : 85; // Default 85%
  }, [customTargets, dateFrom]);

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

  // RVSF options for dropdown
  const rvsfOptions = ['All', ...rvsfList].map(r => ({ value: r, label: r }));




  // Fixed Targets Table Columns
  const targetColumns = [
    {
      title: 'Target Year',
      dataIndex: 'targetYear',
      key: 'targetYear',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Target Vehicles Scrapped',
      dataIndex: 'targetVehiclesScrapped',
      key: 'targetVehiclesScrapped',
      render: (value: number) => <span className="font-semibold text-primary">{value.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Target Weight Scrapped',
      dataIndex: 'targetWeightScrapped',
      key: 'targetWeightScrapped',
      render: (text: string) => <span className="font-semibold text-accent">{text}</span>,
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
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter Bar */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <div className="flex flex-wrap items-end gap-4">

          {/* REMOVED LOCAL DATE PICKERS - Using Global Filters */}

          {/* ELV Make */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ELV Make</label>
            <Select
              value={elvMake}
              onChange={setElvMake}
              style={{ width: 140 }}
              options={rvsfFilterOptions.elvMakes.map(m => ({ value: m, label: m }))}
            />
          </div>

          {/* Make Year */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Make Year</label>
            <Select
              value={makeYear}
              onChange={setMakeYear}
              style={{ width: 100 }}
              options={rvsfFilterOptions.makeYears.map(y => ({ value: y, label: y }))}
            />
          </div>

          {/* RVSF Selection - New Searchable Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Select RVSF</label>
            <Select
              value={rvsfFilter}
              onChange={setRvsfFilter}
              style={{ width: 180 }}
              showSearch
              placeholder="Search RVSF"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={[
                { value: 'All', label: 'All RVSFs' },
                { value: 'MSTI Noida', label: 'MSTI Noida' },
                { value: 'MSTI Gujarat', label: 'MSTI Gujarat' },
                { value: 'MSTI South', label: 'MSTI South' },
                { value: 'MSTI West', label: 'MSTI West' },
              ]}
            />
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Source</label>
            <Select
              value={source}
              onChange={setSource}
              options={[
                { value: 'Collection Center', label: 'Collection Center' },
                { value: 'Dealer', label: 'Dealer' },
                { value: 'Individual', label: 'Individual' },
              ]}
              className="w-full"
            />
          </div>

          <Button icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>

          <div className="flex items-end gap-2 ml-auto">
            <Button icon={<Settings className="w-4 h-4" />} onClick={() => setSetTargetsOpen(true)}>Set Targets</Button>
            <Button icon={<Eye className="w-4 h-4" />} onClick={() => setViewTargetsOpen(true)}>View Targets</Button>
          </div>
          <Button
            type="primary"
            className="bg-[#4b6043] hover:bg-[#5a7350]"
            icon={<ExternalLink className="w-4 h-4" />}
            onClick={() => window.open('https://vscrap.parivahan.gov.in/vehiclescrap/vahan/welcome.xhtml', '_blank')}
          >
            ESG Reporting
          </Button>
        </div>
      </div>

      {/* RVSF Compliance Score Banner */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Leaf className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-cyan-900">RVSF Compliance Score</h3>
              <Button
                type="link"
                size="small"
                className="text-cyan-600 font-semibold p-0 flex items-center gap-1 hover:text-cyan-800"
                onClick={() => setEcoScoreModalOpen(true)}
              >
                View Details <Settings className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-cyan-700">Regulatory compliance rating based on vehicle scrappage execution and environmental safety.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 border-l border-cyan-200">
          <div className="text-right">
            <div className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Current Score</div>
            <div className="text-3xl font-bold text-cyan-800">{rvsfSummaryData.complianceScore}</div>
          </div>
          <EcoScoreBadge score={rvsfSummaryData.complianceScore} size="large" />
        </div>
      </div>

      {/* EcoScore Modal */}
      <EcoScoreModal
        isOpen={ecoScoreModalOpen}
        onClose={() => setEcoScoreModalOpen(false)}
        score={rvsfSummaryData.complianceScore}
        type="RVSF"
      />

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Card - Vehicle Stats */}
        <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of Vehicles Scrapped =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryData.vehiclesScrapped.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">Inventory (MT/kg/Nos.) =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryData.inventory.value.toLocaleString()} {rvsfSummaryData.inventory.unit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of COD generated =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryData.codGenerated.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of MSIL Test Vehicles Scrapped =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryData.msilTestVehiclesScrapped.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of collection centres (tab - state wise)</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryData.collectionCentres}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">Process Loss</span>
              <span className="font-bold text-red-600">3.2%</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
              <span className="text-sm font-semibold text-emerald-900">Performance Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-700">
                  {Math.round((rvsfSummaryData.vehiclesScrapped / targetVehiclesScrapped) * 100)}% of Target
                </span>
                <StarRating value={(rvsfSummaryData.vehiclesScrapped / targetVehiclesScrapped) * 100} isPercentage={true} size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* Center Card - Scrap Dispatch Details */}
        <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 underline mb-3">Scrap Dispatch Details:</h4>
          <div className="space-y-2">
            {scrapDispatchData.map((item) => (
              <div key={item.material} className="flex justify-between items-center">
                <span className="text-sm text-blue-800">{item.material} ({item.unit}) =</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700">{item.value.toLocaleString()}</span>
                  {(item as any).ecoScore && <EcoScoreBadge score={(item as any).ecoScore} size="small" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card - MSIL Components Dispatch Details */}
        <div className="bg-amber-50 border-2 border-amber-600 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 underline mb-3">MSIL Components Dispatch Details:</h4>
          <div className="space-y-2">
            {componentDispatchData.map((item) => (
              <div key={item.component} className="flex justify-between items-center">
                <span className="text-sm text-amber-800">{item.component} ({item.unit}) =</span>
                <span className="font-bold text-amber-700">{item.dispatchQuantity.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpandableWidget
          title="CD Generated from ELVs"
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
                    Engine recovery rates have improved by 15% in Q3. Gearbox recovery is lagging due to dismantling bottlenecks in Northern facilities.
                  </p>
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cdTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()}`, 'Certificates Issued']}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Certificates Issued" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Detailed CD Generation Data</h3>
                </div>
                <Table
                  columns={[
                    { title: 'Month', dataIndex: 'month', key: 'month' },
                    { title: 'Certificates Issued', dataIndex: 'value', key: 'value', render: (val: number) => val.toLocaleString() },
                    { title: 'Status', key: 'status', render: () => <Tag color="green">Processed</Tag> }
                  ]}
                  dataSource={cdTrendData.map((item, i) => ({ ...item, key: i }))}
                  pagination={{ pageSize: 12 }}
                  size="middle"
                />
              </div>
            </div>
          }
        >
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary underline">CD Generated from ELVs</h3>
              <Tag color="default">undefined</Tag>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cdTrendData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()}`, 'Certificates Issued']}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Certificates Issued" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableWidget>

        <ExpandableWidget
          title="MSIL Test Vehicles Scrapped"
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
                    Scrapping rate is consistent with R&D testing schedules. Peak in June aligns with the new model impact testing phase.
                  </p>
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={msilTestVehiclesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()} units`, 'Vehicles Scrapped']}
                    />
                    <Legend />
                    <ReferenceLine y={targetVehiclesScrapped} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${targetVehiclesScrapped} `, fill: 'red', fontSize: 10 }} />
                    <Bar dataKey="value" name="Vehicles Scrapped" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {msilTestVehiclesData.map((entry, index) => (
                        <Cell key={`cell - ${index} `} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Detailed Scrapping Data</h3>
                </div>
                <Table
                  columns={[
                    { title: 'Month', dataIndex: 'month', key: 'month' },
                    { title: 'Vehicles Scrapped', dataIndex: 'value', key: 'value' }
                  ]}
                  dataSource={msilTestVehiclesData.map((item, i) => ({ ...item, key: i }))}
                  pagination={{ pageSize: 12 }}
                  size="middle"
                />
              </div>
            </div>
          }
        >
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary underline">MSIL Test Vehicles Scrapped</h3>
              <Tag color="default">undefined</Tag>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={msilTestVehiclesData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    domain={[0, 900]}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} nos`, 'Vehicles Scrapped']}
                  />
                  <Legend />
                  <ReferenceLine y={targetVehiclesScrapped} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${targetVehiclesScrapped} `, fill: 'red', fontSize: 10 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {msilTestVehiclesData.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableWidget>
      </div>

      {/* MSIL Component Dispatch Visualization */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary underline">MSIL Component Dispatch Overview</h3>
          <Tag color="green">Active</Tag>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={componentDispatchData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="component"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <RechartsTooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number, _name: string, props: { payload: { unit: string } }) => [`${value.toLocaleString()} ${props.payload.unit} `, 'Dispatched']}
              />
              <Legend />
              <Bar dataKey="dispatchQuantity" name="Dispatch Volume" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scrap Material Dispatch Overview (Restored) */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary underline">Scrap Material Dispatch Overview</h3>
          <Tag color="blue">Material Wise</Tag>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scrapDispatchData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="material"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <RechartsTooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number, _name: string, props: { payload: { unit: string } }) => [`${value.toLocaleString()} ${props.payload.unit} `, 'Dispatched']}
              />
              <Legend />
              <Bar dataKey="value" name="Dispatch Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COD (Certificate of Destruction) Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Certificate of Destruction (COD)</h3>
          </div>
          <div className="flex items-center gap-3">
            <Segmented
              value={codPeriod}
              onChange={(val) => setCodPeriod(val as 'monthly' | 'yearly')}
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
              size="small"
            />
            <Button size="small" icon={<Download className="w-3 h-3" />}>Export CODs</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{rvsfSummaryData.codGenerated}</div>
            <div className="text-xs text-blue-600 mt-1">Total CODs Generated</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{Math.round(rvsfSummaryData.codGenerated * 0.92)}</div>
            <div className="text-xs text-green-600 mt-1">Verified</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-700">{Math.round(rvsfSummaryData.codGenerated * 0.06)}</div>
            <div className="text-xs text-amber-600 mt-1">Pending Verification</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-700">{Math.round(rvsfSummaryData.codGenerated * 0.02)}</div>
            <div className="text-xs text-red-600 mt-1">Rejected</div>
          </div>
        </div>
        <Table
          columns={[
            { title: codPeriod === 'monthly' ? 'Month' : 'Year', dataIndex: 'period', key: 'period', render: (t: string) => <span className="font-medium">{t}</span> },
            { title: 'CODs Issued', dataIndex: 'issued', key: 'issued', render: (v: number) => <span className="font-semibold text-blue-700">{v}</span> },
            { title: 'Verified', dataIndex: 'verified', key: 'verified', render: (v: number) => <Tag color="green">{v}</Tag> },
            { title: 'Pending', dataIndex: 'pending', key: 'pending', render: (v: number) => <Tag color="gold">{v}</Tag> },
            { title: 'Rejected', dataIndex: 'rejected', key: 'rejected', render: (v: number) => v > 0 ? <Tag color="red">{v}</Tag> : <span>0</span> },
          ]}
          dataSource={
            codPeriod === 'monthly'
              ? [
                { key: '1', period: 'Apr 2025', issued: 42, verified: 39, pending: 2, rejected: 1 },
                { key: '2', period: 'May 2025', issued: 38, verified: 35, pending: 3, rejected: 0 },
                { key: '3', period: 'Jun 2025', issued: 51, verified: 47, pending: 3, rejected: 1 },
                { key: '4', period: 'Jul 2025', issued: 45, verified: 42, pending: 2, rejected: 1 },
                { key: '5', period: 'Aug 2025', issued: 55, verified: 50, pending: 4, rejected: 1 },
                { key: '6', period: 'Sep 2025', issued: 48, verified: 45, pending: 2, rejected: 1 },
              ]
              : [
                { key: '1', period: 'FY 2023-24', issued: 410, verified: 380, pending: 20, rejected: 10 },
                { key: '2', period: 'FY 2024-25', issued: 520, verified: 478, pending: 30, rejected: 12 },
                { key: '3', period: 'FY 2025-26 (YTD)', issued: 279, verified: 258, pending: 16, rejected: 5 },
              ]
          }
          pagination={false}
          size="small"
          bordered
        />
      </div>

      <Divider />

      {/* Fixed Targets Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Fixed Targets</h3>
          <Tag color="blue">View Only</Tag>
        </div>
        <Table
          columns={targetColumns}
          dataSource={fixedTargets.map((item, i) => ({ ...item, key: i }))}
          pagination={false}
          size="middle"
          bordered
        />
      </div>

      {/* Interactive India Map Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">RVSF Dashboard - Interactive Map</h3>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Radio.Group
              value={mapViewMode}
              onChange={(e) => setMapViewMode(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="origin">RC Data</Radio.Button>
              <Radio.Button value="collection">Collection Centers</Radio.Button>
              <Radio.Button value="rvsf">RVSF Locations</Radio.Button>
            </Radio.Group>

            {/* Collection Center Filter - Only visible in Collection mode */}
            {mapViewMode === 'collection' && (
              <Select
                value={selectedCollectionCenter}
                onChange={setSelectedCollectionCenter}
                style={{ width: 160 }}
                options={[
                  { value: 'All', label: 'All Centers' },
                  { value: 'Manesar', label: 'Manesar' },
                  { value: 'Pune', label: 'Pune' },
                  { value: 'Chennai', label: 'Chennai' },
                  { value: 'Kolkata', label: 'Kolkata' },
                  { value: 'Bangalore', label: 'Bangalore' },
                ]}
              />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {mapViewMode === 'origin' && 'Showing density of vehicle origins based on RC data'}
          {mapViewMode === 'collection' && 'Showing Collection Center locations across India'}
          {mapViewMode === 'rvsf' && 'Showing Registered Vehicle Scrapping Facility locations'}
          . Pan and zoom to explore details.
        </p>
        <InteractiveIndiaMap
          viewMode={mapViewMode}
          rvsfFilter={rvsfFilter}
          collectionCenterFilter={selectedCollectionCenter}
          filters={filters}
        />
      </div>

      <Divider />

      {/* AI Insights Section */}
      <AIInsightsWidget insights={rvsfAIInsights} title="RVSF Operational Insights" />

      {/* Target Modals */}
      <SetTargetsModal
        open={setTargetsOpen}
        onClose={() => setSetTargetsOpen(false)}
        onSave={handleSaveTarget}
        targetType="rvsf"
      />
      <ViewTargetsModal
        open={viewTargetsOpen}
        onClose={() => setViewTargetsOpen(false)}
        customTargets={customTargets}
        targetType="rvsf"
      />

      {/* RVSF Ranking Table */}
      <Divider />
      <RankingTable
        title="Weighted RVSF Evaluation Matrix"
        kpis={rvsfRankingKPIs}
        entityScores={rvsfEntityScores}
      />
    </div >
  );
};

export default RVSFTab;
