import { useState, useMemo, useCallback } from 'react';
import { Select, Table, Tag, Switch, Button, Tooltip, DatePicker, Divider, Skeleton } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, AreaChart, Area, Cell, LineChart, Line,
} from 'recharts';
import {
  Download, Factory, MapPin, TrendingUp, TrendingDown, Clock,
  BarChart2, Layers, Info, Search, ChevronDown, ChevronUp, Lightbulb, DollarSign,
} from 'lucide-react';
import OEMCompetitorMap from '../OEMCompetitorMap';
import {
  oemList, rvsfMaster, oemRvsfMapping, rvsfStateOptions,
  getRVSFMonthlyCollection, getAggregatedMonthlyCollection,
  getPerRVSFMonthlyCollection, getAggregatedMaterialRecovery,
  getAggregatedRCOrigin, getPerRVSFMaterialSummary, formatKg,
  filterDataByMonths, materialMarketData, oemAIInsights,
} from '@/data/competitorData';
import liveData from '@/data/liveData.json';

const { RangePicker } = DatePicker;

interface OEMCompetitorTabProps { isLoading?: boolean; }

// ─── Utilities ───────────────────────────────────────────────────────────────

// Convert dayjs range → month label array like ['May 2025', 'Jun 2025', ...]
const dateRangeToMonths = (from: Dayjs, to: Dayjs): string[] => {
  const labels: string[] = [];
  let cur = from.startOf('month');
  const end = to.endOf('month');
  while (cur.isBefore(end) || cur.isSame(end, 'month')) {
    labels.push(cur.format('MMM YYYY'));
    cur = cur.add(1, 'month');
  }
  return labels;
};

// Compute bounding box from lat/lng points with padding
const computeBounds = (points: [number, number][]): [[number, number], [number, number]] | null => {
  if (points.length === 0) return null;
  const lats = points.map(p => p[0]);
  const lngs = points.map(p => p[1]);
  const pad = points.length === 1 ? 3 : 1.5;
  return [
    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
    [Math.max(...lats) + pad, Math.max(...lngs) + pad],
  ];
};

// ─── Mini Sparkline ──────────────────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[]; color: string }) => (
  <div className="h-10 w-28">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.map((v, i) => ({ v, i }))}>
        <defs>
          <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color.replace('#', '')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const CollectionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-sm min-w-[160px]">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill || p.stroke }} />
            <span className="text-slate-600 text-xs">{p.name}</span>
          </span>
          <span className="font-semibold">{(p.value as number)?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

const KPICard = ({
  icon: Icon, label, value, sub, trend, sparkData, color, bgColor,
}: {
  icon: any; label: string; value: string | number; sub: string;
  trend?: number; sparkData?: number[];
  color: string; bgColor: string; textColor?: string;
}) => (
  <div className={`${bgColor} border rounded-xl p-4 flex flex-col gap-2`} style={{ borderColor: color + '40' }}>
    <div className="flex items-start justify-between">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
    <div>
      <div className="text-xs font-semibold text-slate-600 leading-tight">{label}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
    </div>
    {sparkData && <Sparkline data={sparkData} color={color} />}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
      <Search className="w-10 h-10 text-emerald-400" />
    </div>
    <h3 className="font-semibold text-slate-700 text-lg mb-2">Select an RVSF or OEM to view data</h3>
    <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
      Use the filters above to choose an OEM (auto-loads all associated RVSFs) or select individual RVSFs
      to view collection trends, origin maps, and material recovery data.
    </p>
    <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
      {[
        { label: 'MSIL / MSTI', desc: '1 RVSF — Noida, UP', color: '#003087' },
        { label: 'Tata Re.Wi.Re', desc: '10 RVSFs across India', color: '#00388B' },
        { label: 'CERO (Mahindra)', desc: '14 locations pan-India', color: '#E31837' },
        { label: 'Honda Cars', desc: 'Via MSTI MoU', color: '#CC0000' },
      ].map(item => (
        <div key={item.label} className="bg-white border border-slate-100 rounded-xl p-3 text-left hover:border-emerald-200 transition-colors">
          <div className="w-2.5 h-2.5 rounded-full mb-1.5" style={{ background: item.color }} />
          <div className="text-xs font-semibold text-slate-700">{item.label}</div>
          <div className="text-[10px] text-slate-400">{item.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Bar chart colors ────────────────────────────────────────────────────────
const barColors = ['#5a7a32', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#a78bfa', '#f43f5e', '#0ea5e9', '#22c55e', '#eab308'];

// ─── Material config (12 MatNEXT materials) ──────────────────────────────────
const fmtMatVal = (val: number, unit: string): string => {
  if (unit === 'g') {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString('en-IN');
  }
  return formatKg(val);
};

const MAT_CONFIG: Array<{ key: string; label: string; unit: string; color: string; bg: string; always: boolean; inChart: boolean }> = [
  { key: 'steelKg', label: 'Steel', unit: 'KG', color: '#64748b', bg: 'bg-slate-50', always: true, inChart: true },
  { key: 'plasticKg', label: 'Plastic', unit: 'KG', color: '#d97706', bg: 'bg-amber-50', always: true, inChart: true },
  { key: 'aluminiumKg', label: 'Aluminium', unit: 'KG', color: '#7c3aed', bg: 'bg-violet-50', always: true, inChart: true },
  { key: 'castIronKg', label: 'Cast Iron', unit: 'KG', color: '#92400e', bg: 'bg-orange-50', always: false, inChart: true },
  { key: 'rubberKg', label: 'Rubber', unit: 'KG', color: '#065f46', bg: 'bg-emerald-50', always: false, inChart: true },
  { key: 'copperKg', label: 'Copper', unit: 'KG', color: '#b45309', bg: 'bg-yellow-50', always: false, inChart: true },
  { key: 'ewasteKg', label: 'E-waste', unit: 'KG', color: '#1d4ed8', bg: 'bg-blue-50', always: false, inChart: true },
  { key: 'liionKg', label: 'Li-ion', unit: 'KG', color: '#7e22ce', bg: 'bg-purple-50', always: false, inChart: true },
  { key: 'zincKg', label: 'Zinc', unit: 'KG', color: '#0891b2', bg: 'bg-cyan-50', always: false, inChart: true },
  { key: 'usedOilKg', label: 'Used Oil', unit: 'L', color: '#9f1239', bg: 'bg-rose-50', always: false, inChart: true },
  { key: 'freonKg', label: 'Freon', unit: 'KG', color: '#0e7490', bg: 'bg-teal-50', always: false, inChart: true },
  { key: 'platinumGrams', label: 'Platinum/Pd', unit: 'g', color: '#854d0e', bg: 'bg-stone-50', always: false, inChart: false },
];

const MATERIAL_COLORS: Record<string, string> = {
  steel: '#64748b', plastic: '#d97706', aluminium: '#7c3aed', cast_iron: '#92400e',
  rubber: '#065f46', copper: '#b45309', ewaste: '#1d4ed8', liion: '#7e22ce',
  zinc: '#0891b2', used_oil: '#9f1239', freon: '#0e7490', platinum: '#854d0e',
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  capacity: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Capacity' },
  material: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Material' },
  geography: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Geography' },
  compliance: { bg: 'bg-red-50', text: 'text-red-700', label: 'Compliance' },
  financial: { bg: 'bg-violet-50', text: 'text-violet-700', label: 'Financial' },
  strategic: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Strategic' },
};

// ─── RVSF View ───────────────────────────────────────────────────────────────
const RVSFView = ({
  selectedRVSFIds, activeMonths, dateLabel, viewByRVSF, setViewByRVSF, showRVSFPins, setShowRVSFPins,
}: {
  selectedRVSFIds: string[]; activeMonths: string[]; dateLabel: string;
  viewByRVSF: boolean; setViewByRVSF: (v: boolean) => void;
  showRVSFPins: boolean; setShowRVSFPins: (v: boolean) => void;
}) => {
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const selectedRVSFs = useMemo(() => rvsfMaster.filter(r => selectedRVSFIds.includes(r.id)), [selectedRVSFIds]);

  // All data filtered by active date range
  const collection = useMemo(
    () => filterDataByMonths(getAggregatedMonthlyCollection(selectedRVSFIds), activeMonths),
    [selectedRVSFIds, activeMonths],
  );
  const perRVSF = useMemo(() => {
    if (!viewByRVSF) return {};
    const raw = getPerRVSFMonthlyCollection(selectedRVSFIds);
    const out: Record<string, typeof collection> = {};
    for (const [id, data] of Object.entries(raw)) out[id] = filterDataByMonths(data, activeMonths);
    return out;
  }, [selectedRVSFIds, viewByRVSF, activeMonths]);
  const material = useMemo(
    () => filterDataByMonths(getAggregatedMaterialRecovery(selectedRVSFIds), activeMonths),
    [selectedRVSFIds, activeMonths],
  );
  const rcOriginData = useMemo(
    () => getAggregatedRCOrigin(selectedRVSFIds, activeMonths),
    [selectedRVSFIds, activeMonths],
  );
  const rvsfTotals = useMemo(() => {
    const t: Record<string, number> = {};
    for (const id of selectedRVSFIds) t[id] = filterDataByMonths(getRVSFMonthlyCollection(id), activeMonths).reduce((s, d) => s + d.count, 0);
    return t;
  }, [selectedRVSFIds, activeMonths]);

  // Map bounds — computed from RVSF locations + RC origin data points
  const mapBounds = useMemo(() => {
    const pts: [number, number][] = [];
    for (const r of selectedRVSFs) pts.push([r.lat, r.lng]);
    for (const d of rcOriginData) pts.push([d.lat, d.lng]);
    return computeBounds(pts);
  }, [selectedRVSFs, rcOriginData]);

  // KPIs — dynamic based on filtered data length
  const totalELVs = collection.reduce((s, d) => s + d.count, 0);
  const numMonths = collection.length || 1;
  const avgPerMonth = Math.round(totalELVs / numMonths);
  const last = collection[collection.length - 1]?.count ?? 0;
  const prev = collection[collection.length - 2]?.count ?? 1;
  const momChange = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  const lastLabel = collection[collection.length - 1]?.month ?? '';
  const prevLabel = collection[collection.length - 2]?.month ?? '';

  const matTotals = useMemo(() => {
    const t: Record<string, number> = {};
    for (const m of MAT_CONFIG) t[m.key] = material.reduce((s, d) => s + ((d as any)[m.key] ?? 0), 0);
    return t;
  }, [material]);

  const chartData = useMemo(() => {
    if (!viewByRVSF) return collection;
    return collection.map((d, i) => {
      const row: Record<string, any> = { month: d.month };
      for (const id of selectedRVSFIds) {
        const rvsf = rvsfMaster.find(r => r.id === id);
        row[rvsf?.name ?? id] = perRVSF[id]?.[i]?.count ?? 0;
      }
      return row;
    });
  }, [collection, viewByRVSF, perRVSF, selectedRVSFIds]);

  const exportCSV = useCallback(() => {
    const rows = collection.map(d => `${d.month},${d.count}`);
    const blob = new Blob([['Month,ELVs Collected', ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rvsf_collection.csv'; a.click();
  }, [collection]);

  const exportMatCSV = useCallback(() => {
    const header = 'Month,Steel (KG),Plastic (KG),Aluminium (KG),Cast Iron (KG),Rubber (KG),Copper (KG),E-waste (KG),Li-ion (KG),Zinc (KG),Used Oil (L),Freon (KG),Platinum (g),Total (KG)';
    const rows = material.map(d => `${d.month},${d.steelKg},${d.plasticKg},${d.aluminiumKg},${d.castIronKg},${d.rubberKg},${d.copperKg},${d.ewasteKg},${d.liionKg},${d.zincKg},${d.usedOilKg},${d.freonKg},${d.platinumGrams},${d.steelKg + d.plasticKg + d.aluminiumKg + d.castIronKg + d.rubberKg + d.copperKg + d.ewasteKg + d.liionKg + d.zincKg + d.usedOilKg + d.freonKg}`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rvsf_materials.csv'; a.click();
  }, [material]);

  return (
    <div className="space-y-6">
      {/* 4.1 Collection Chart */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />Month-wise ELV Collection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedRVSFs.length === 1 ? selectedRVSFs[0].name : `${selectedRVSFs.length} RVSFs combined`} &middot; {dateLabel}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {selectedRVSFIds.length > 1 && (
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <Switch size="small" checked={viewByRVSF} onChange={setViewByRVSF} />View by RVSF
              </label>
            )}
            <Button size="small" icon={<Download className="w-3 h-3" />} onClick={exportCSV}>CSV</Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: `Total ELVs (${numMonths} mo)`, value: totalELVs.toLocaleString('en-IN'), color: '#5a7a32', bg: 'bg-emerald-50' },
            { label: 'Avg / Month', value: avgPerMonth.toLocaleString('en-IN'), color: '#3b82f6', bg: 'bg-blue-50' },
            { label: `MoM (${lastLabel.split(' ')[0]} vs ${prevLabel.split(' ')[0]})`, value: `${momChange >= 0 ? '+' : ''}${momChange}%`, color: momChange >= 0 ? '#10b981' : '#ef4444', bg: momChange >= 0 ? 'bg-emerald-50' : 'bg-red-50' },
          ].map(kpi => (
            <div key={kpi.label} className={`${kpi.bg} rounded-lg p-3`} style={{ border: `1px solid ${kpi.color}22` }}>
              <div className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => v.toLocaleString('en-IN')} />
              <RechartsTooltip content={<CollectionTooltip />} />
              {!viewByRVSF ? (
                <Bar dataKey="count" name="ELVs Collected" fill="#5a7a32" radius={[4, 4, 0, 0]} maxBarSize={40} />
              ) : (
                selectedRVSFIds.map((id, idx) => {
                  const r = rvsfMaster.find(r => r.id === id);
                  return <Bar key={id} dataKey={r?.name ?? id} name={r?.name ?? id} stackId="s" fill={barColors[idx % barColors.length]} radius={idx === selectedRVSFIds.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} maxBarSize={40} />;
                })
              )}
              {viewByRVSF && <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4.2 India Map */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-slate-800">Origin of Collected Vehicles (RC Data)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Bubble = vehicles by RC registration state (not RVSF location) &middot; {dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <Switch size="small" checked={showRVSFPins} onChange={setShowRVSFPins} />Show RVSF pins
            </label>
            <Tooltip title="RVSF pins = facility location. Bubbles = where vehicles came from (RC state). Often different states.">
              <Info className="w-4 h-4 text-slate-400 cursor-help" />
            </Tooltip>
          </div>
        </div>
        <OEMCompetitorMap rvsfList={selectedRVSFs} rcOriginData={rcOriginData} showRVSFPins={showRVSFPins} rvsfCollectionTotals={rvsfTotals} focusBounds={mapBounds} />
        <div className="p-4 border-t border-border">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Top RC Origin States</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {rcOriginData.slice(0, 5).map((d, i) => (
              <div key={d.state} className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                <div className="text-xs text-slate-400 mb-1">#{i + 1}</div>
                <div className="font-semibold text-slate-700 text-sm leading-tight">{d.state}</div>
                <div className="text-emerald-700 font-bold">{d.count.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4.3 Material Recovery */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />Material Recovery — All 12 Materials
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Full dismantling plants only &middot; {dateLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAllMaterials(v => !v)} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 transition-colors">
              {showAllMaterials ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showAllMaterials ? 'Show less' : 'Show all 12 materials'}
            </button>
            <Button size="small" icon={<Download className="w-3 h-3" />} onClick={exportMatCSV}>CSV</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {MAT_CONFIG.filter(m => showAllMaterials || m.always).map((m, idx) => {
            const data = material.map(d => (d as any)[m.key] ?? 0);
            const last2 = data.slice(-2);
            const tr = last2.length === 2 && last2[0] > 0 ? Math.round(((last2[1] - last2[0]) / last2[0]) * 100) : 0;
            return (
              <KPICard key={m.key} icon={Factory} label={m.label} value={fmtMatVal(matTotals[m.key] ?? 0, m.unit)}
                sub={`${m.unit} total (period)`} sparkData={data} color={m.color} bgColor={m.bg} trend={tr} />
            );
          })}
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={material} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => formatKg(v)} />
              <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number, name: string) => [formatKg(v) + ' KG', name]} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              {MAT_CONFIG.filter(m => m.inChart && (showAllMaterials || m.always)).map((m, idx, arr) => (
                <Bar key={m.key} dataKey={m.key} name={m.label} stackId="m" fill={m.color}
                  radius={idx === arr.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4.4 Material Pricing */}
      <MaterialPricingSection />
    </div>
  );
};

// ─── Material Pricing Section ─────────────────────────────────────────────────
const MaterialPricingSection = () => {
  const [activeMat, setActiveMat] = useState('steel');
  const mat = materialMarketData.find(m => m.id === activeMat) ?? materialMarketData[0];

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />Material Pricing — Scrap vs Virgin
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Current scrap recovery price vs. virgin material market cost &middot; 12-month trend (click row to inspect)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 pb-2 pr-4">Material</th>
              <th className="text-right text-xs font-semibold text-slate-500 pb-2 pr-4">Scrap Price</th>
              <th className="text-right text-xs font-semibold text-slate-500 pb-2 pr-4">Virgin Price</th>
              <th className="text-right text-xs font-semibold text-slate-500 pb-2">Value Gap</th>
            </tr>
          </thead>
          <tbody>
            {materialMarketData.map(m => {
              const gapPct = Math.round((m.virginPrice - m.scrapPrice) / m.scrapPrice * 100);
              const color = MATERIAL_COLORS[m.id.replace(/_/g, '')] ?? '#64748b';
              const isActive = activeMat === m.id;
              return (
                <tr key={m.id} onClick={() => setActiveMat(m.id)}
                  className={`cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-colors ${isActive ? 'bg-emerald-50' : ''}`}>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="font-medium text-slate-700">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-right font-semibold text-emerald-700">₹{m.scrapPrice.toLocaleString('en-IN')}/{m.unit}</td>
                  <td className="py-2 pr-4 text-right text-slate-500">₹{m.virginPrice.toLocaleString('en-IN')}/{m.unit}</td>
                  <td className="py-2 text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gapPct > 500 ? 'bg-red-50 text-red-700' : gapPct > 100 ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                      +{gapPct}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">12-Month Price Trend — {mat.name}</p>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {materialMarketData.map(m => {
            const color = MATERIAL_COLORS[m.id.replace(/_/g, '')] ?? '#64748b';
            return (
              <button key={m.id} onClick={() => setActiveMat(m.id)}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors ${activeMat === m.id ? 'text-white border-transparent' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'}`}
                style={activeMat === m.id ? { background: color, borderColor: color } : {}}>
                {m.name}
              </button>
            );
          })}
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mat.trend} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `₹${v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v/1_000).toFixed(0)}K` : v}`} width={56} />
              <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: any, name: string) => [`₹${Number(v).toLocaleString('en-IN')}/${mat.unit}`, name === 'scrapPrice' ? 'Scrap Price' : 'Virgin Price']} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} formatter={(value) => value === 'scrapPrice' ? 'Scrap Price' : 'Virgin Price'} />
              <Line type="monotone" dataKey="scrapPrice" name="scrapPrice" stroke={MATERIAL_COLORS[activeMat.replace(/_/g, '')] ?? '#64748b'} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="virginPrice" name="virginPrice" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── AI Insights Section ──────────────────────────────────────────────────────
const AIInsightsSection = ({ oemId, oemName, oemColor }: { oemId: string; oemName: string; oemColor: string }) => {
  const insights = oemAIInsights[oemId] ?? [];
  if (!insights.length) return null;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600" />AI Insights — {oemName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Trend analysis and strategic observations based on RVSF performance data</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(CATEGORY_STYLES).map(([key, s]) => (
            <span key={key} className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map(ins => {
          const s = CATEGORY_STYLES[ins.category] ?? CATEGORY_STYLES.strategic;
          return (
            <div key={ins.id} className="border border-slate-100 rounded-xl p-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: oemColor + '22', color: oemColor }}>
                  {ins.id}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${s.bg} ${s.text}`}>{s.label}</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{ins.insight}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── OEM View ────────────────────────────────────────────────────────────────
const OEMView = ({
  selectedOEMId, selectedRVSFIds, activeMonths, dateLabel, showRVSFPins, setShowRVSFPins,
}: {
  selectedOEMId: string; selectedRVSFIds: string[]; activeMonths: string[]; dateLabel: string;
  showRVSFPins: boolean; setShowRVSFPins: (v: boolean) => void;
}) => {
  const [viewByRVSF, setViewByRVSF] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const oem = useMemo(() => oemList.find(o => o.id === selectedOEMId)!, [selectedOEMId]);
  const selectedRVSFs = useMemo(() => rvsfMaster.filter(r => selectedRVSFIds.includes(r.id)), [selectedRVSFIds]);
  const fullPlants = selectedRVSFs.filter(r => r.type === 'full_dismantling');

  const collection = useMemo(() => filterDataByMonths(getAggregatedMonthlyCollection(selectedRVSFIds), activeMonths), [selectedRVSFIds, activeMonths]);
  const perRVSF = useMemo(() => {
    if (!viewByRVSF) return {};
    const raw = getPerRVSFMonthlyCollection(selectedRVSFIds);
    const out: Record<string, typeof collection> = {};
    for (const [id, data] of Object.entries(raw)) out[id] = filterDataByMonths(data, activeMonths);
    return out;
  }, [selectedRVSFIds, viewByRVSF, activeMonths]);
  const material = useMemo(() => filterDataByMonths(getAggregatedMaterialRecovery(selectedRVSFIds), activeMonths), [selectedRVSFIds, activeMonths]);
  const rcOriginData = useMemo(() => getAggregatedRCOrigin(selectedRVSFIds, activeMonths), [selectedRVSFIds, activeMonths]);
  const materialSummary = useMemo(() => getPerRVSFMaterialSummary(selectedRVSFIds, activeMonths), [selectedRVSFIds, activeMonths]);
  const rvsfTotals = useMemo(() => {
    const t: Record<string, number> = {};
    for (const id of selectedRVSFIds) t[id] = filterDataByMonths(getRVSFMonthlyCollection(id), activeMonths).reduce((s, d) => s + d.count, 0);
    return t;
  }, [selectedRVSFIds, activeMonths]);

  const mapBounds = useMemo(() => {
    const pts: [number, number][] = [];
    for (const r of selectedRVSFs) pts.push([r.lat, r.lng]);
    for (const d of rcOriginData) pts.push([d.lat, d.lng]);
    return computeBounds(pts);
  }, [selectedRVSFs, rcOriginData]);

  const totalELVs = collection.reduce((s, d) => s + d.count, 0);
  const totalCapacity = selectedRVSFs.reduce((s, r) => s + r.capacityPerYear, 0);
  const numMonths = collection.length || 1;
  const matTotals = useMemo(() => {
    const t: Record<string, number> = {};
    for (const m of MAT_CONFIG) t[m.key] = material.reduce((s, d) => s + ((d as any)[m.key] ?? 0), 0);
    return t;
  }, [material]);

  const chartData = useMemo(() => {
    if (!viewByRVSF) return collection;
    return collection.map((d, i) => {
      const row: Record<string, any> = { month: d.month };
      for (const id of selectedRVSFIds) {
        const r = rvsfMaster.find(r => r.id === id);
        row[r?.name ?? id] = perRVSF[id]?.[i]?.count ?? 0;
      }
      return row;
    });
  }, [collection, viewByRVSF, perRVSF, selectedRVSFIds]);

  const exportCSV = useCallback(() => {
    const rows = collection.map(d => `${d.month},${d.count}`);
    const blob = new Blob([['Month,ELVs Collected', ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${oem.shortName}_collection.csv`; a.click();
  }, [collection, oem]);

  const exportMatCSV = useCallback(() => {
    const header = 'RVSF,City,Steel (KG),Plastic (KG),Aluminium (KG),Cast Iron (KG),Rubber (KG),Copper (KG),E-waste (KG),Li-ion (KG),Zinc (KG),Used Oil (L),Freon (KG),Platinum (g),Total (KG),Vehicles';
    const rows = materialSummary.map(r => `"${r.name}","${r.city}",${r.steelKg},${r.plasticKg},${r.aluminiumKg},${r.castIronKg},${r.rubberKg},${r.copperKg},${r.ewasteKg},${r.liionKg},${r.zincKg},${r.usedOilKg},${r.freonKg},${r.platinumGrams},${r.totalKg},${r.totalVehicles}`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${oem.shortName}_material_breakdown.csv`; a.click();
  }, [materialSummary, oem]);

  const matCols = [
    { title: 'RVSF', dataIndex: 'name', key: 'name', render: (v: string, row: any) => (<div><div className="font-semibold text-slate-700 text-sm">{v}</div><div className="text-xs text-slate-400">{row.city}, {row.state}</div><Tag color={row.type === 'full_dismantling' ? 'green' : 'gold'} style={{ fontSize: 9, marginTop: 2 }}>{row.type === 'full_dismantling' ? 'Full Plant' : 'Touchpoint'}</Tag></div>) },
    { title: 'Vehicles', dataIndex: 'totalVehicles', key: 'totalVehicles', sorter: (a: any, b: any) => a.totalVehicles - b.totalVehicles, render: (v: number) => <span className="font-semibold text-emerald-700">{v.toLocaleString('en-IN')}</span> },
    { title: 'Steel', dataIndex: 'steelKg', key: 'steelKg', sorter: (a: any, b: any) => a.steelKg - b.steelKg, render: (v: number, row: any) => row.type === 'collection_touchpoint' ? <span className="text-slate-300">—</span> : <span className="font-medium text-slate-600">{formatKg(v)}</span> },
    { title: 'Plastic', dataIndex: 'plasticKg', key: 'plasticKg', sorter: (a: any, b: any) => a.plasticKg - b.plasticKg, render: (v: number, row: any) => row.type === 'collection_touchpoint' ? <span className="text-slate-300">—</span> : <span className="font-medium text-amber-600">{formatKg(v)}</span> },
    { title: 'Aluminium', dataIndex: 'aluminiumKg', key: 'aluminiumKg', sorter: (a: any, b: any) => a.aluminiumKg - b.aluminiumKg, render: (v: number, row: any) => row.type === 'collection_touchpoint' ? <span className="text-slate-300">—</span> : <span className="font-medium text-violet-600">{formatKg(v)}</span> },
    { title: 'Copper', dataIndex: 'copperKg', key: 'copperKg', sorter: (a: any, b: any) => a.copperKg - b.copperKg, render: (v: number, row: any) => row.type === 'collection_touchpoint' ? <span className="text-slate-300">—</span> : <span className="font-medium text-yellow-700">{formatKg(v)}</span> },
    { title: 'Platinum (g)', dataIndex: 'platinumGrams', key: 'platinumGrams', sorter: (a: any, b: any) => a.platinumGrams - b.platinumGrams, render: (v: number, row: any) => row.type === 'collection_touchpoint' ? <span className="text-slate-300">—</span> : <span className="font-medium text-stone-700">{fmtMatVal(v, 'g')}</span> },
    { title: 'Total (KG)', dataIndex: 'totalKg', key: 'totalKg', sorter: (a: any, b: any) => a.totalKg - b.totalKg, defaultSortOrder: 'descend' as const, render: (v: number, row: any) => row.type === 'collection_touchpoint' ? <span className="text-slate-300">—</span> : <span className="font-bold text-slate-800">{formatKg(v)}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* 6.1 OEM Summary Strip */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #1a2e0a 0%, #2d4a14 40%, #1e3a0e 100%)' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #96ca38 0%, transparent 50%), radial-gradient(circle at 80% 20%, #5a7a32 0%, transparent 40%)' }} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl border-2" style={{ background: oem.color + '33', borderColor: oem.color + '80', color: '#fff' }}>
              {oem.shortName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#96ca38' }}>OEM Competitor Intelligence</div>
              <h2 className="text-xl font-bold text-white leading-tight">{oem.name}</h2>
              <p className="text-xs mt-1 max-w-lg" style={{ color: '#b8d98a' }}>{oem.description}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Associated RVSFs', value: selectedRVSFs.length, color: '#96ca38' },
              { label: 'Full Plants', value: fullPlants.length, color: '#60d394' },
              { label: 'Annual Capacity', value: totalCapacity.toLocaleString('en-IN'), color: '#fb923c' },
              { label: `ELVs (${numMonths} mo)`, value: totalELVs.toLocaleString('en-IN'), color: '#a5f3fc' },
            ].map(item => (
              <div key={item.label} className="rounded-xl px-4 py-3 min-w-[110px] text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(150,202,56,0.2)' }}>
                <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#8aad5a' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6.2 Collection Chart */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-emerald-600" />Month-wise ELV Collection — {oem.shortName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedRVSFs.length} RVSFs &middot; {dateLabel}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"><Switch size="small" checked={viewByRVSF} onChange={setViewByRVSF} />View by RVSF</label>
            <Button size="small" icon={<Download className="w-3 h-3" />} onClick={exportCSV}>CSV</Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: `Total ELVs (${numMonths} mo)`, value: totalELVs.toLocaleString('en-IN'), color: '#5a7a32', bg: 'bg-emerald-50' },
            { label: 'Avg / Month', value: Math.round(totalELVs / numMonths).toLocaleString('en-IN'), color: '#3b82f6', bg: 'bg-blue-50' },
            { label: 'Capacity Utilization', value: totalCapacity > 0 ? `${Math.round((totalELVs / totalCapacity) * 100)}%` : '—', color: '#7c3aed', bg: 'bg-violet-50' },
          ].map(kpi => (
            <div key={kpi.label} className={`${kpi.bg} rounded-lg p-3`} style={{ border: `1px solid ${kpi.color}22` }}>
              <div className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => v.toLocaleString('en-IN')} />
              <RechartsTooltip content={<CollectionTooltip />} />
              {!viewByRVSF ? (
                <Bar dataKey="count" name="ELVs Collected" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {collection.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                </Bar>
              ) : (
                selectedRVSFIds.map((id, idx) => {
                  const r = rvsfMaster.find(r => r.id === id);
                  return <Bar key={id} dataKey={r?.name ?? id} name={r?.name ?? id} stackId="s" fill={barColors[idx % barColors.length]} radius={idx === selectedRVSFIds.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} maxBarSize={40} />;
                })
              )}
              {viewByRVSF && <Legend wrapperStyle={{ fontSize: 9, paddingTop: 8 }} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6.3 India Map */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-slate-800">Vehicle Origin (RC Data) + RVSF Footprint</h3>
              <p className="text-xs text-slate-400 mt-0.5">Bubbles = RC origin state volume. Pins = {oem.shortName} RVSFs. &middot; {dateLabel}</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"><Switch size="small" checked={showRVSFPins} onChange={setShowRVSFPins} />Show RVSF pins</label>
        </div>
        <OEMCompetitorMap rvsfList={selectedRVSFs} rcOriginData={rcOriginData} showRVSFPins={showRVSFPins} rvsfCollectionTotals={rvsfTotals} focusBounds={mapBounds} />
        <div className="p-4 border-t border-border">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Top RC Origin States</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {rcOriginData.slice(0, 5).map((d, i) => (
              <div key={d.state} className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                <div className="text-xs text-slate-400 mb-1">#{i + 1}</div>
                <div className="font-semibold text-slate-700 text-sm leading-tight">{d.state}</div>
                <div className="text-emerald-700 font-bold">{d.count.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6.4 Material Recovery */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-600" />Material Recovery — {oem.shortName} (All 12 Materials)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Full dismantling plants only &middot; Touchpoints contribute to vehicle count only &middot; {dateLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAllMaterials(v => !v)} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 transition-colors">
              {showAllMaterials ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showAllMaterials ? 'Show less' : 'Show all 12 materials'}
            </button>
            <Button size="small" icon={<Download className="w-3 h-3" />} onClick={exportMatCSV}>CSV</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {MAT_CONFIG.filter(m => showAllMaterials || m.always).map(m => {
            const data = material.map(d => (d as any)[m.key] ?? 0);
            const last2 = data.slice(-2);
            const tr = last2.length === 2 && last2[0] > 0 ? Math.round(((last2[1] - last2[0]) / last2[0]) * 100) : 0;
            return <KPICard key={m.key} icon={Factory} label={m.label} value={fmtMatVal(matTotals[m.key] ?? 0, m.unit)} sub={`${m.unit} total (period)`} sparkData={data} color={m.color} bgColor={m.bg} trend={tr} />;
          })}
        </div>
        <div className="h-[220px] mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={material} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => formatKg(v)} />
              <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number, name: string) => [formatKg(v) + ' KG', name]} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              {MAT_CONFIG.filter(m => m.inChart && (showAllMaterials || m.always)).map((m, idx, arr) => (
                <Bar key={m.key} dataKey={m.key} name={m.label} stackId="m" fill={m.color}
                  radius={idx === arr.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Divider className="my-4" />
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-700 text-sm">Per-RVSF Material Breakdown</h4>
          <Tag color="blue">{fullPlants.length} Full Plants</Tag>
        </div>
        <Table columns={matCols} dataSource={materialSummary.map((r, i) => ({ ...r, key: i }))} pagination={false} size="small" scroll={{ x: 900 }} rowClassName={(row) => row.type === 'collection_touchpoint' ? 'opacity-60' : ''} />
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span><strong>Collection Touchpoints</strong> contribute to ELV counts but don't perform full dismantling — material KG data only for Full Plants.</span>
          </p>
        </div>
      </div>

      {/* 6.5 Material Pricing */}
      <MaterialPricingSection />

      {/* 6.6 AI Insights */}
      <AIInsightsSection oemId={selectedOEMId} oemName={oem.name} oemColor={oem.color} />
    </div>
  );
};

// ─── Main Tab ────────────────────────────────────────────────────────────────
const OEMCompetitorTab = ({ isLoading }: OEMCompetitorTabProps) => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs('2025-05-01'), dayjs('2026-04-30')]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedRVSFIds, setSelectedRVSFIds] = useState<string[]>([]);
  const [selectedOEMId, setSelectedOEMId] = useState<string | null>(null);
  const [showRVSFPins, setShowRVSFPins] = useState(true);
  const [viewByRVSFRvsf, setViewByRVSFRvsf] = useState(false);

  // Active months derived from date picker
  const activeMonths = useMemo(() => dateRangeToMonths(dateRange[0], dateRange[1]), [dateRange]);
  const dateLabel = `${dateRange[0].format('MMM YYYY')} – ${dateRange[1].format('MMM YYYY')}`;

  const rvsfOptions = useMemo(() => {
    const filtered = selectedStates.length > 0 ? rvsfMaster.filter(r => selectedStates.includes(r.state)) : rvsfMaster;
    return filtered.map(r => ({ value: r.id, label: `${r.name} — ${r.city}, ${r.state}` }));
  }, [selectedStates]);

  const handleOEMChange = useCallback((value: string | null) => {
    setSelectedOEMId(value);
    if (value && oemRvsfMapping[value]) setSelectedRVSFIds(oemRvsfMapping[value]);
    else if (!value) setSelectedRVSFIds([]);
  }, []);

  const viewMode: 'oem' | 'rvsf' | 'empty' = useMemo(() => {
    if (selectedOEMId) return 'oem';
    if (selectedRVSFIds.length > 0) return 'rvsf';
    return 'empty';
  }, [selectedOEMId, selectedRVSFIds]);

  const selectedOEMInfo = useMemo(() => selectedOEMId ? oemList.find(o => o.id === selectedOEMId) : null, [selectedOEMId]);

  if (isLoading) return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton active paragraph={{ rows: 3 }} />
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #0f2a05 0%, #1e4010 40%, #142e08 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 10% 70%, #7ab830 0%, transparent 45%), radial-gradient(circle at 88% 20%, #4a7a20 0%, transparent 40%)' }} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl border" style={{ background: 'rgba(150,202,56,0.12)', borderColor: 'rgba(150,202,56,0.30)' }}>
                <Factory className="w-5 h-5" style={{ color: '#96ca38' }} />
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#96ca38' }}>Competitive Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">OEM Competitor Analysis</h1>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#b8d98a' }}>
              Monitor and compare ELV collection and material recovery across RVSFs — individual or rolled-up by OEM.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {liveData.oemCompetitor.lastUpdated && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm" style={{ background: 'rgba(150,202,56,0.18)', border: '1px solid rgba(150,202,56,0.5)' }}>
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#96ca38' }} />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold leading-none mb-0.5" style={{ color: '#96ca38' }}>Last Updated</div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {new Date(liveData.oemCompetitor.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3 flex-wrap justify-end">
              {[
                { label: 'OEMs Tracked', value: oemList.filter(o => (oemRvsfMapping[o.id] || []).length > 0).length, color: '#96ca38' },
                { label: 'Total RVSFs', value: rvsfMaster.length, color: '#60d394' },
                { label: 'Full Plants', value: rvsfMaster.filter(r => r.type === 'full_dismantling').length, color: '#fb923c' },
              ].map(item => (
                <div key={item.label} className="rounded-xl px-4 py-3 min-w-[100px] text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(150,202,56,0.2)' }}>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#8aad5a' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Date Range</label>
            <RangePicker value={dateRange} onChange={(dates) => { if (dates?.[0] && dates?.[1]) setDateRange([dates[0] as Dayjs, dates[1] as Dayjs]); }} picker="month" format="MMM YYYY" style={{ width: 230 }} allowClear={false} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">RVSF State</label>
            <Select mode="multiple" placeholder="All states" value={selectedStates} onChange={setSelectedStates} style={{ minWidth: 180, maxWidth: 240 }} maxTagCount="responsive" showSearch options={rvsfStateOptions.map(s => ({ value: s, label: s }))} filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[240px] max-w-[380px]">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">RVSF <span className="ml-1 text-emerald-600 normal-case font-normal">(searchable)</span></label>
            <Select mode="multiple" placeholder="Search RVSF..." value={selectedRVSFIds} onChange={setSelectedRVSFIds} style={{ width: '100%' }} maxTagCount="responsive" showSearch optionFilterProp="label" options={rvsfOptions} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">OEM <span className="ml-1 text-blue-500 normal-case font-normal">(auto-loads RVSFs)</span></label>
            <Select allowClear placeholder="Select OEM..." value={selectedOEMId} onChange={handleOEMChange} style={{ width: 240 }} options={oemList.map(o => ({
              value: o.id,
              label: (<span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: o.color }} />{o.name}{(oemRvsfMapping[o.id] || []).length === 0 && <span className="text-[10px] text-slate-400">(no RVSF)</span>}</span>),
            }))} />
          </div>
          <div className="flex items-end gap-2 flex-wrap">
            {[{ id: 'msil', label: 'MSIL', color: '#003087' }, { id: 'tata', label: 'Tata', color: '#00388B' }, { id: 'mahindra', label: 'CERO', color: '#E31837' }].map(c => (
              <button key={c.id} onClick={() => handleOEMChange(selectedOEMId === c.id ? null : c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selectedOEMId === c.id ? 'text-white shadow-sm' : 'bg-white text-slate-600 hover:border-emerald-400'}`}
                style={selectedOEMId === c.id ? { background: c.color, borderColor: c.color } : { borderColor: '#e2e8f0' }}>
                {c.label}
              </button>
            ))}
          </div>
          {(selectedOEMId || selectedRVSFIds.length > 0 || selectedStates.length > 0) && (
            <button onClick={() => { setSelectedOEMId(null); setSelectedRVSFIds([]); setSelectedStates([]); }} className="ml-auto text-xs text-slate-400 hover:text-red-500 transition-colors underline pb-1">Reset filters</button>
          )}
        </div>
        {viewMode !== 'empty' && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-semibold">Active:</span>
            {viewMode === 'oem' && selectedOEMInfo && <Tag color="blue">{selectedOEMInfo.name}</Tag>}
            {selectedRVSFIds.slice(0, 5).map(id => { const r = rvsfMaster.find(r => r.id === id); return r ? <Tag key={id} color="green">{r.name}</Tag> : null; })}
            {selectedRVSFIds.length > 5 && <Tag>+{selectedRVSFIds.length - 5} more</Tag>}
            <span className="text-slate-400">&middot; {viewMode === 'oem' ? 'OEM View' : 'RVSF View'} &middot; {dateLabel} &middot; {activeMonths.length} months</span>
          </div>
        )}
      </div>

      {viewMode === 'empty' && <EmptyState />}
      {viewMode === 'rvsf' && <RVSFView selectedRVSFIds={selectedRVSFIds} activeMonths={activeMonths} dateLabel={dateLabel} viewByRVSF={viewByRVSFRvsf} setViewByRVSF={setViewByRVSFRvsf} showRVSFPins={showRVSFPins} setShowRVSFPins={setShowRVSFPins} />}
      {viewMode === 'oem' && selectedOEMId && <OEMView selectedOEMId={selectedOEMId} selectedRVSFIds={selectedRVSFIds} activeMonths={activeMonths} dateLabel={dateLabel} showRVSFPins={showRVSFPins} setShowRVSFPins={setShowRVSFPins} />}

    </div>
  );
};

export default OEMCompetitorTab;
