import { useState, useMemo } from 'react';
import {
  Select, Table, Tag, Segmented, Button, Tooltip, Progress, Divider, Badge,
} from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, ComposedChart, Area, Line, Cell,
} from 'recharts';
import {
  AlertTriangle, TrendingUp, MapPin, Zap, Activity, Target, Download, Clock,
  ChevronRight, Building2, BarChart2, Layers, Info, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import ELVHotspotMap from '../ELVHotspotMap';
import AIInsightsWidget from '../AIInsightsWidget';
import {
  getELVHotspotStateData,
  getELVNationalKPIs,
  getELVTrendData,
  getELVStateRankings,
  getELVAgeProfile,
  getStateSalesHistory,
  getStateCollectionHistory,
  elvRvsfRegistry,
  elvAIInsights,
  elvFYOptions,
  elvBrandOptions,
  StateHotspotData,
  getELVLagFY,
} from '@/data/dashboardData';
import liveData from '@/data/liveData.json';

interface ELVHotspotTabProps {
  isLoading?: boolean;
}

// Compact number format: <1K as-is, <1M as K (max 3 digits), ≥1M as M
const fmtN = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString('en-IN');
};

const hotspotTagColor = (score: number) =>
  score > 66 ? 'red' : score > 33 ? 'orange' : 'green';

const hotspotLabel = (score: number) =>
  score > 66 ? 'Critical' : score > 33 ? 'Moderate' : 'Managed';

const coverageBg = (status: 'green' | 'amber' | 'red') => {
  if (status === 'green') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  if (status === 'amber') return 'bg-amber-50 border-amber-200 text-amber-700';
  return 'bg-red-50 border-red-200 text-red-700';
};

// Custom tooltip for trend chart
const TrendTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-bold text-slate-800 mb-2">FY {label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-semibold">{p.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

const ELVHotspotTab = ({ isLoading }: ELVHotspotTabProps) => {
  const [selectedFY, setSelectedFY] = useState('2024-25');
  const [elvLag, setElvLag] = useState<number>(15);
  const [mapLayer, setMapLayer] = useState<'sales' | 'rvsf' | 'hotspot'>('hotspot');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['All']);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateDetailTab, setStateDetailTab] = useState<'sales' | 'rvsf' | 'elv'>('sales');
  const [rankSortKey, setRankSortKey] = useState<string>('hotspotScore');

  const lagFY = useMemo(() => getELVLagFY(selectedFY, elvLag), [selectedFY, elvLag]);
  const hotspotData = useMemo(() => getELVHotspotStateData(selectedFY, elvLag, selectedBrands), [selectedFY, elvLag, selectedBrands]);
  const kpis = useMemo(() => getELVNationalKPIs(selectedFY, elvLag, selectedBrands), [selectedFY, elvLag, selectedBrands]);
  const trendData = useMemo(() => getELVTrendData(elvLag, selectedBrands), [elvLag, selectedBrands]);
  const rankingsData = useMemo(() => getELVStateRankings(selectedFY, elvLag, selectedBrands), [selectedFY, elvLag, selectedBrands]);
  const ageProfile = useMemo(() => getELVAgeProfile(selectedFY), [selectedFY]);

  const stateDetail = useMemo(() => {
    if (!selectedState) return null;
    const hs = hotspotData.find(d => d.state === selectedState);
    const salesHistory = getStateSalesHistory(selectedState, selectedBrands);
    const collectionHistory = getStateCollectionHistory(selectedState);
    const rvsfList = elvRvsfRegistry.filter(r => r.state === selectedState);
    const totalCapacity = rvsfList.filter(r => r.status === 'active').reduce((s, r) => s + r.capacityPerYear, 0);
    const utilization = totalCapacity > 0 && hs ? Math.round((hs.vehiclesCollected / totalCapacity) * 100) : 0;
    return { hs, salesHistory, collectionHistory, rvsfList, totalCapacity, utilization };
  }, [selectedState, hotspotData]);

  const rankColumns = [
    {
      title: '#',
      key: 'rank',
      width: 40,
      render: (_: any, __: any, i: number) => (
        <span className="text-slate-400 font-medium text-xs">{i + 1}</span>
      ),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (v: string, row: any) => (
        <button
          onClick={() => { setSelectedState(v); setStateDetailTab('sales'); }}
          className="font-semibold text-indigo-700 hover:text-indigo-900 transition-colors text-left"
        >
          {v}
          <Tag className="ml-1.5" color={hotspotTagColor(row.hotspotScore)} style={{ fontSize: 10 }}>
            {hotspotLabel(row.hotspotScore)}
          </Tag>
        </button>
      ),
    },
    {
      title: `Sales FY ${lagFY}`,
      dataIndex: 'salesLagYear',
      key: 'salesLagYear',
      sorter: (a: any, b: any) => a.salesLagYear - b.salesLagYear,
      render: (v: number) => <span className="font-medium">{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Active RVSFs',
      dataIndex: 'rvsfCount',
      key: 'rvsfCount',
      sorter: (a: any, b: any) => a.rvsfCount - b.rvsfCount,
      render: (v: number) => (
        <span className={`font-semibold ${v === 0 ? 'text-red-600' : v >= 3 ? 'text-green-600' : 'text-amber-600'}`}>{v}</span>
      ),
    },
    {
      title: 'Collected',
      dataIndex: 'vehiclesCollected',
      key: 'vehiclesCollected',
      sorter: (a: any, b: any) => a.vehiclesCollected - b.vehiclesCollected,
      render: (v: number) => <span className="font-medium text-emerald-700">{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'ELV Gap',
      dataIndex: 'collectionGap',
      key: 'collectionGap',
      sorter: (a: any, b: any) => a.collectionGap - b.collectionGap,
      render: (v: number, row: any) => (
        <div>
          <span className="font-medium text-red-600">{Math.max(0, v).toLocaleString('en-IN')}</span>
          <span className="text-xs text-slate-400 ml-1">({row.gapPercent}%)</span>
        </div>
      ),
    },
    {
      title: 'Hotspot Score',
      dataIndex: 'hotspotScore',
      key: 'hotspotScore',
      sorter: (a: any, b: any) => a.hotspotScore - b.hotspotScore,
      defaultSortOrder: 'descend' as const,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={v}
            size="small"
            strokeColor={v > 66 ? '#dc2626' : v > 33 ? '#d97706' : '#16a34a'}
            showInfo={false}
            style={{ width: 60 }}
          />
          <span className={`font-bold text-sm ${v > 66 ? 'text-red-600' : v > 33 ? 'text-amber-600' : 'text-green-600'}`}>
            {v}
          </span>
        </div>
      ),
    },
  ];

  const exportCSV = () => {
    const rows = rankingsData.map(d =>
      `${d.state},${d.salesLagYear},${d.rvsfCount},${d.vehiclesCollected},${Math.max(0, d.collectionGap)},${d.gapPercent},${d.hotspotScore}`
    );
    const csv = ['State,Sales (Lag Year),Active RVSFs,Collected,ELV Gap,Gap %,Hotspot Score', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ELV_Hotspot_${selectedFY}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── Hero Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #1a2e0a 0%, #2d4a14 40%, #1e3a0e 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 60%, #96ca38 0%, transparent 45%), radial-gradient(circle at 85% 15%, #5a7a32 0%, transparent 40%)' }} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl border" style={{ background: 'rgba(150,202,56,0.15)', borderColor: 'rgba(150,202,56,0.35)' }}>
                <Zap className="w-5 h-5" style={{ color: '#96ca38' }} />
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#96ca38' }}>Executive Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">ELV Hotspot Analysis</h1>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#b8d98a' }}>
              Overlays SIAM vehicle sales history with RVSF scrapping data to identify states where aging vehicles
              are outpacing scrapping infrastructure — revealing where India's ELV crisis is most acute.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {liveData.elvHotspot.lastUpdated && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm" style={{ background: 'rgba(150,202,56,0.18)', border: '1px solid rgba(150,202,56,0.5)' }}>
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#96ca38' }} />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold leading-none mb-0.5" style={{ color: '#96ca38' }}>Last Updated</div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {new Date(liveData.elvHotspot.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-4 flex-wrap justify-end">
              {[
                { label: 'Hotspot States', value: hotspotData.filter(d => d.coverageStatus === 'red').length, color: '#f87171', icon: AlertTriangle },
                { label: 'National Gap', value: `${kpis.gapPercent}%`, color: '#fb923c', icon: Activity },
                { label: 'Active RVSFs', value: kpis.totalActiveRVSFs, color: '#96ca38', icon: Building2 },
              ].map(item => (
                <div key={item.label} className="rounded-xl px-4 py-3 min-w-[110px] text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(150,202,56,0.2)' }}>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs mt-0.5 font-medium" style={{ color: '#8aad5a' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Financial Year</label>
            <Select
              value={selectedFY}
              onChange={setSelectedFY}
              style={{ width: 110 }}
              options={elvFYOptions.map(y => ({ value: y, label: `FY ${y}` }))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ELV Lag (years)</label>
            <Segmented
              value={elvLag}
              onChange={v => setElvLag(v as number)}
              options={[
                { label: '10 yrs', value: 10 },
                { label: '12 yrs', value: 12 },
                { label: '15 yrs', value: 15 },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Brand Filter</label>
            <Select
              mode="multiple"
              value={selectedBrands}
              onChange={(val) => {
                if (!val || val.length === 0) {
                  setSelectedBrands(['All']);
                } else if (val[val.length - 1] === 'All') {
                  setSelectedBrands(['All']);
                } else if (val.includes('All') && val.length > 1) {
                  setSelectedBrands(val.filter(v => v !== 'All'));
                } else {
                  setSelectedBrands(val);
                }
              }}
              style={{ minWidth: 160, maxWidth: 220 }}
              maxTagCount="responsive"
              options={elvBrandOptions.map(b => ({ value: b, label: b }))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Map Layer</label>
            <Segmented
              value={mapLayer}
              onChange={v => setMapLayer(v as 'sales' | 'rvsf' | 'hotspot')}
              options={[
                { label: 'Sales Heatmap', value: 'sales' },
                { label: 'RVSF Presence', value: 'rvsf' },
                { label: 'ELV Hotspot', value: 'hotspot' },
              ]}
            />
          </div>
          <div className="ml-auto flex items-end">
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="font-medium">Lag reference:</span> Sales from FY <span className="font-bold text-indigo-600">{lagFY}</span> are now ELV-age
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            icon: TrendingUp,
            label: `Total PV Sales (FY ${selectedFY})`,
            value: (kpis.salesSelected / 1000000).toFixed(1) + 'M',
            sub: 'vehicles sold nationally',
            gradient: 'from-blue-600 to-indigo-600',
            bg: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-700',
          },
          {
            icon: AlertTriangle,
            label: `Est. ELV-Age Vehicles`,
            value: fmtN(kpis.estimatedELV),
            sub: `Sold in FY ${lagFY}`,
            gradient: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-50 border-orange-200',
            textColor: 'text-orange-700',
          },
          {
            icon: Building2,
            label: 'Active RVSFs (National)',
            value: kpis.totalActiveRVSFs,
            sub: 'registered & operational',
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50 border-emerald-200',
            textColor: 'text-emerald-700',
          },
          {
            icon: Activity,
            label: `Vehicles Collected (FY ${selectedFY})`,
            value: fmtN(kpis.totalCollected),
            sub: 'across all RVSFs',
            gradient: 'from-teal-500 to-cyan-500',
            bg: 'bg-teal-50 border-teal-200',
            textColor: 'text-teal-700',
          },
          {
            icon: Target,
            label: 'National Collection Gap',
            value: `${kpis.gapPercent}%`,
            sub: `${fmtN(Math.max(0, kpis.estimatedELV - kpis.totalCollected))} vehicles unaccounted`,
            gradient: 'from-red-500 to-rose-600',
            bg: 'bg-red-50 border-red-200',
            textColor: 'text-red-700',
          },
        ].map(card => (
          <div key={card.label} className={`${card.bg} border rounded-xl p-4 flex flex-col gap-2`}>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
            <div>
              <div className="text-xs font-semibold text-slate-600 leading-tight">{card.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top 3 Hotspot States Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <span className="font-semibold text-red-800 text-sm">Top ELV Hotspot States</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {kpis.topHotspots.map((state, i) => (
            <button
              key={state}
              onClick={() => { setSelectedState(state); setStateDetailTab('elv'); }}
              className="flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors shadow-sm"
            >
              <span className="w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
              {state}
              <ChevronRight className="w-3 h-3" />
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-slate-500">
          Ranked by Hotspot Score (ELV lag: {elvLag} yrs)
        </div>
      </div>

      {/* ─── Map + State Detail ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Map Section */}
        <div className="xl:col-span-3 bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">ELV Hotspot Map — India</h3>
            </div>
            <div className="flex items-center gap-2">
              <Tag color={mapLayer === 'hotspot' ? 'purple' : mapLayer === 'sales' ? 'blue' : 'green'}>
                {mapLayer === 'hotspot' ? 'Hotspot Layer' : mapLayer === 'sales' ? 'Sales Layer' : 'RVSF Layer'}
              </Tag>
            </div>
          </div>
          <ELVHotspotMap
            viewMode={mapLayer}
            hotspotData={hotspotData}
            selectedFY={selectedFY}
            lagYears={elvLag}
            lagFY={lagFY}
            onStateClick={(state) => { setSelectedState(state); setStateDetailTab('sales'); }}
            selectedState={selectedState}
            rvsfRegistry={elvRvsfRegistry}
          />
        </div>

        {/* State Detail Panel */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border shadow-card flex flex-col">
          {selectedState && stateDetail ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-gradient-to-r from-indigo-50 to-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 text-base">{selectedState}</h3>
                  <button
                    onClick={() => setSelectedState(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                {stateDetail.hs && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag color={hotspotTagColor(stateDetail.hs.hotspotScore)}>
                      {hotspotLabel(stateDetail.hs.hotspotScore)} · Score {stateDetail.hs.hotspotScore}/100
                    </Tag>
                    <Tag color="blue">{stateDetail.hs.rvsfCount} Active RVSF{stateDetail.hs.rvsfCount !== 1 ? 's' : ''}</Tag>
                  </div>
                )}
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-border">
                {([
                  { key: 'sales', label: 'Sales History', icon: TrendingUp },
                  { key: 'rvsf', label: 'RVSF Intel', icon: Building2 },
                  { key: 'elv', label: 'ELV Analysis', icon: BarChart2 },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setStateDetailTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-semibold transition-colors border-b-2 ${
                      stateDetailTab === tab.key
                        ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Sales History Tab */}
                {stateDetailTab === 'sales' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          label: 'Peak Sales Year',
                          value: stateDetail.salesHistory.reduce((a, b) => a.units > b.units ? a : b).fy,
                          color: 'text-indigo-700',
                        },
                        {
                          label: `Current FY (${selectedFY})`,
                          value: (stateDetail.hs?.salesCurrentYear || 0).toLocaleString('en-IN'),
                          color: 'text-blue-700',
                        },
                        {
                          label: `ELV-Age Sales (${lagFY})`,
                          value: (stateDetail.hs?.salesLagYear || 0).toLocaleString('en-IN'),
                          color: 'text-orange-700',
                        },
                        {
                          label: 'Cumulative (All Years)',
                          value: (stateDetail.salesHistory.reduce((s, d) => s + d.units, 0) / 1000000).toFixed(1) + 'M',
                          color: 'text-emerald-700',
                        },
                      ].map(stat => (
                        <div key={stat.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                          <div className={`font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Year-wise PV Sales</p>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stateDetail.salesHistory.slice(-10)} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="fy" tick={{ fontSize: 9, fill: '#94a3b8' }} angle={-45} textAnchor="end" />
                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => fmtN(v)} />
                            <RechartsTooltip
                              contentStyle={{ fontSize: 11, borderRadius: 8 }}
                              formatter={(v: number) => [v.toLocaleString('en-IN'), 'Units Sold']}
                            />
                            <Bar dataKey="units" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}

                {/* RVSF Intelligence Tab */}
                {stateDetailTab === 'rvsf' && (
                  <>
                    {stateDetail.hs && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-slate-600">Capacity Utilization</span>
                          <span className="text-xs font-bold text-indigo-600">{stateDetail.utilization}%</span>
                        </div>
                        <Progress
                          percent={Math.min(stateDetail.utilization, 100)}
                          strokeColor={stateDetail.utilization > 80 ? '#dc2626' : stateDetail.utilization > 50 ? '#d97706' : '#16a34a'}
                          size="small"
                          showInfo={false}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                          <div>
                            <div className="text-slate-400">Total Capacity/yr</div>
                            <div className="font-semibold text-slate-700">{stateDetail.totalCapacity.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Collected</div>
                            <div className="font-semibold text-emerald-700">{stateDetail.hs.vehiclesCollected.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {stateDetail.rvsfList.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm">
                          <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No RVSFs registered in this state
                        </div>
                      ) : (
                        stateDetail.rvsfList.map(r => (
                          <div key={r.rvsfId} className={`border rounded-lg p-2.5 text-xs ${r.status === 'active' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-semibold text-slate-800 text-sm leading-tight">{r.name}</div>
                              <Badge status={r.status === 'active' ? 'success' : 'default'} text={r.status} className="whitespace-nowrap" />
                            </div>
                            <div className="text-slate-500 mt-1">{r.district} · Since {r.registrationDate.slice(0, 4)}</div>
                            <div className="flex gap-3 mt-1.5 text-slate-600">
                              <span>Capacity: <strong>{r.capacityPerYear.toLocaleString('en-IN')}/yr</strong></span>
                            </div>
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {r.vehicleTypes.map(vt => <Tag key={vt} style={{ fontSize: 9, margin: 0, padding: '0 4px' }}>{vt}</Tag>)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Collection Trend</p>
                      <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stateDetail.collectionHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="fy" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => fmtN(v)} />
                            <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [v.toLocaleString('en-IN'), 'Collected']} />
                            <Bar dataKey="collected" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}

                {/* ELV Analysis Tab */}
                {stateDetailTab === 'elv' && stateDetail.hs && (
                  <>
                    {/* Gap Card */}
                    <div className={`border rounded-xl p-4 ${stateDetail.hs.hotspotScore > 66 ? 'bg-red-50 border-red-200' : stateDetail.hs.hotspotScore > 33 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className={`w-4 h-4 ${stateDetail.hs.hotspotScore > 66 ? 'text-red-600' : stateDetail.hs.hotspotScore > 33 ? 'text-amber-600' : 'text-emerald-600'}`} />
                        <span className="font-semibold text-sm text-slate-700">ELV Coverage Gap Analysis</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-slate-500">ELV-Age Vehicles</div>
                          <div className="font-bold text-orange-700 text-lg">{stateDetail.hs.salesLagYear.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-slate-400">Sold FY {lagFY}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Actually Collected</div>
                          <div className="font-bold text-emerald-700 text-lg">{stateDetail.hs.vehiclesCollected.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-slate-400">FY {selectedFY}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Collection Coverage</span>
                          <span className="font-bold">
                            {stateDetail.hs.salesLagYear > 0
                              ? Math.round((stateDetail.hs.vehiclesCollected / stateDetail.hs.salesLagYear) * 100)
                              : 0}%
                          </span>
                        </div>
                        <Progress
                          percent={stateDetail.hs.salesLagYear > 0
                            ? Math.min(100, Math.round((stateDetail.hs.vehiclesCollected / stateDetail.hs.salesLagYear) * 100))
                            : 0}
                          strokeColor={stateDetail.hs.hotspotScore > 66 ? '#dc2626' : '#d97706'}
                          trailColor="#e2e8f0"
                          size="small"
                          showInfo={false}
                        />
                      </div>
                    </div>

                    {/* Key insight */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-800">
                      <strong>Gap:</strong> ~{Math.max(0, stateDetail.hs.salesLagYear - stateDetail.hs.vehiclesCollected).toLocaleString('en-IN')} vehicles
                      sold {elvLag} years ago in {selectedState} have no formal scrapping record —
                      {stateDetail.hs.rvsfCount === 0
                        ? ' with zero active RVSFs, these are being scrapped informally with zero environmental controls.'
                        : ` current RVSFs cover only ${stateDetail.totalCapacity.toLocaleString('en-IN')} vehicles/year capacity.`}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-indigo-400" />
              </div>
              <h4 className="font-semibold text-slate-700 mb-1">Select a State</h4>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Click any bubble on the map to view detailed sales history, RVSF intelligence, and ELV gap analysis for that state.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-xs">
                {hotspotData
                  .sort((a, b) => b.hotspotScore - a.hotspotScore)
                  .slice(0, 6)
                  .map(d => (
                    <button
                      key={d.state}
                      onClick={() => { setSelectedState(d.state); setStateDetailTab('elv'); }}
                      className={`text-xs rounded-lg px-2 py-1.5 border font-medium transition-colors ${coverageBg(d.coverageStatus)} hover:opacity-80`}
                    >
                      {d.state.split(' ')[0]}
                    </button>
                  ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Quick select by hotspot rank</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── AI Insights ─── */}
      <AIInsightsWidget
        insights={elvAIInsights}
        title="ELV Hotspot AI Intelligence"
      />

      <Divider />

      {/* ─── Trend Chart ─── */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">National Sales vs. Collection Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">Shaded gap = unaddressed ELV-age vehicles | Lag window: {elvLag} years</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-8 h-1 bg-indigo-500 rounded-full inline-block"></span>
              <span className="text-slate-500">PV Sales (Current)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-8 h-1 bg-orange-400 rounded-full inline-block"></span>
              <span className="text-slate-500">ELV-Age Pool</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-3 bg-emerald-500 rounded inline-block"></span>
              <span className="text-slate-500">Collected</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="fy" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis yAxisId="left" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={v => fmtN(v)} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <RechartsTooltip content={<TrendTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="estimatedELV"
                name="ELV-Age Pool"
                fill="#fed7aa"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={0.4}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                name="PV Sales"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4 }}
              />
              <Bar
                yAxisId="right"
                dataKey="collected"
                name="Collected"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-800">
            <strong>Key insight:</strong> The orange shaded area represents vehicles sold {elvLag} years ago that are now ELV-age.
            The green bars show how many are actually being collected. The gap between them represents the ELV crisis magnitude.
          </p>
        </div>
      </div>

      {/* ─── State Rankings Table ─── */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">State ELV Hotspot Rankings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sortable by any column · Color coded by hotspot severity · FY {selectedFY} · Lag {elvLag} yrs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></span>Critical
              <span className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-sm ml-1"></span>Moderate
              <span className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm ml-1"></span>Managed
            </div>
            <Button
              size="small"
              icon={<Download className="w-3 h-3" />}
              onClick={exportCSV}
            >
              Export CSV
            </Button>
          </div>
        </div>
        <Table
          columns={rankColumns}
          dataSource={rankingsData.map((d, i) => ({ ...d, key: i }))}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="small"
          rowClassName={(record) => {
            if (record.hotspotScore > 66) return 'bg-red-50/60 hover:bg-red-50';
            if (record.hotspotScore > 33) return 'bg-amber-50/40 hover:bg-amber-50';
            return 'bg-emerald-50/30 hover:bg-emerald-50';
          }}
          scroll={{ x: 700 }}
        />
      </div>

      {/* ─── ELV Age Profile ─── */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">ELV Age Profile — National</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Make-year distribution of vehicles currently being scrapped (FY {selectedFY})
            </p>
          </div>
          <Tooltip title="Shows which 'vintage' of vehicles are currently being scrapped at RVSFs. A left-skewed profile indicates older vehicles dominating. Use this to forecast future ELV waves.">
            <Info className="w-4 h-4 text-slate-400 cursor-help" />
          </Tooltip>
        </div>
        {ageProfile.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No age profile data available for FY {selectedFY}</div>
        ) : (
          <>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageProfile} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="makeYear" tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Make Year', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tickFormatter={v => fmtN(v)} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <RechartsTooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(v: number) => [v.toLocaleString('en-IN'), 'Vehicles Scrapped']}
                    labelFormatter={l => `Make Year: ${l}`}
                  />
                  <Bar dataKey="vehicleCount" name="Vehicles Scrapped" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {ageProfile.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={i < ageProfile.length / 3 ? '#dc2626' : i < (ageProfile.length * 2) / 3 ? '#d97706' : '#16a34a'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-600 inline-block"></span> Older vintage (highest urgency)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> Mid-vintage</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-600 inline-block"></span> Recent ELV-age</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ELVHotspotTab;
