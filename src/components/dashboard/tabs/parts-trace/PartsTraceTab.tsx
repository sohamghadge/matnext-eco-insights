import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Search, History, GitBranch, Truck, MapPin, ChevronRight,
  Maximize2, Minimize2, RotateCcw, AlertTriangle, Clock, Layers,
  CalendarDays, Package, BarChart3, ListTree, ShieldAlert, CheckCircle2, Recycle
} from 'lucide-react';
import { Input, Button, Segmented, notification, Tooltip, Progress } from 'antd';

import {
  mockVehicles,
  partsAIInsights,
  detectIdentifierType,
  searchIndex,
  findVehicle,
  computeAlertPaths,
  countNodes,
  VehicleTrace,
  PartNode,
} from '../../../../data/partsTraceData';

import CarLoader from './CarLoader';
import TreeNode from './TreeNode';
import PartDetailDrawer from './PartDetailDrawer';
import {
  QualityCheckPanel,
  VehicleRecallPanel,
  PartRecallPanel,
  CompliancePanel,
  PartsTraceAIPanel,
} from './WorkflowPanels';

type WorkflowMode = 'none' | 'quality' | 'vehicle_recall' | 'part_recall' | 'compliance';

const MODES: { value: WorkflowMode; label: string }[] = [
  { value: 'none', label: '🔍 Viewer' },
  { value: 'quality', label: '✅ Quality Check' },
  { value: 'vehicle_recall', label: '🚨 Vehicle Recall' },
  { value: 'part_recall', label: '⚠️ Part Recall' },
  { value: 'compliance', label: '📋 Compliance' },
];

const PartsTraceTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [identType, setIdentType] = useState<'Engine Number' | 'Chassis Number' | 'Unknown'>('Unknown');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleTrace | null>(null);
  const [history, setHistory] = useState<string[]>(['K15C-1093847', 'MA3EA11S2N1093847']);
  const [treeSearch, setTreeSearch] = useState('');
  const [forceExpanded, setForceExpanded] = useState<boolean | null>(null);
  const [selectedNode, setSelectedNode] = useState<PartNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<WorkflowMode>('none');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);

  // Compute live suggestions on every keystroke
  const suggestions = useMemo(() => {
    if (!query) return searchIndex.slice(0, 10);
    const q = query.toUpperCase();
    return searchIndex.filter(s => s.value.toUpperCase().includes(q) || s.modelName.toUpperCase().includes(q)).slice(0, 10);
  }, [query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setDropdownOpen(true);
    setIdentType(val.length >= 3 ? detectIdentifierType(val) : 'Unknown');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pickSuggestion = (val: string) => {
    setQuery(val);
    setDropdownOpen(false);
    setIdentType(detectIdentifierType(val));
    executeSearch(val);
  };

  const executeSearch = useCallback((searchVal: string) => {
    const q = (searchVal || query).trim();
    if (!q || q.length < 4) {
      notification.warning({ message: 'Enter at least 4 characters to search.' });
      return;
    }

    // Reset state
    setVehicle(null);
    setSelectedNode(null);
    setDrawerOpen(false);
    setMode('none');
    setForceExpanded(null);
    setTimedOut(false);
    setSearching(true);

    setHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 5));

    // Timeout guard
    timeoutRef.current = setTimeout(() => {
      setSearching(false);
      setTimedOut(true);
    }, 8000);

    // Simulate 2.5s fetch
    setTimeout(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const found = findVehicle(q);
      if (found) {
        setVehicle(found);
      } else {
        notification.error({
          message: 'Vehicle Not Found',
          description: `No traceability record found for identifier "${q}". Please verify and try again.`,
        });
      }
      setSearching(false);
    }, 2500);
  }, [query]);

  // Clean up timeout on unmount
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  // Memoized alert paths (ancestor highlighting for flagged/recalled nodes)
  const alertPaths = useMemo(
    () => vehicle ? computeAlertPaths(vehicle.rootPart) : new Set<string>(),
    [vehicle]
  );

  const nodeCount = useMemo(() => vehicle ? countNodes(vehicle.rootPart) : 0, [vehicle]);

  const handleNodeClick = (node: PartNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };



  const vehicleStatusColor = {
    'In Production': 'bg-blue-100 text-blue-700 border-blue-200',
    'Dispatched': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Recalled': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6 pb-12">

      {/* ── Hero Banner ───────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2e0a 40%, #1e1b4b 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #96ca38 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', animation: 'pulse 3s ease-in-out infinite reverse' }} />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl border" style={{ background: 'rgba(150,202,56,0.15)', borderColor: 'rgba(150,202,56,0.35)' }}>
                <GitBranch className="w-5 h-5" style={{ color: '#96ca38' }} />
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#96ca38' }}>MatNEXT · Parts Traceability</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Vehicle Parts Trace</h1>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#b8d98a' }}>
              Look up any MSIL vehicle by Engine or Chassis Number to retrieve its complete parts hierarchy —
              with quality audits, recall status, compliance tracking, and AI-powered diagnostic insights from MANJU AI's A-16 agent.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Vehicles Traced', value: '6,420', color: '#96ca38' },
              { label: 'Parts Indexed', value: '38,200', color: '#c4b5fd' },
              { label: 'Active Recalls', value: '3', color: '#f87171' },
            ].map(kpi => (
              <div key={kpi.label}
                className="rounded-xl px-4 py-3 min-w-[110px] text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8 Vehicle Model Cards ─────────────────────────────────────────────── */}
      {(() => {
        const VEHICLE_CARDS = [
          { q: 'K15C-1093847', label: 'Grand Vitara', engine: 'K15C', mfgDate: '2025-11-15', batch: 'B-GV-251115', batchCount: 3, partCount: 18, recalls: 1, compliance: 89, recycled: 16.2, status: '⚠️ Flagged',  color: 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 hover:border-amber-400' },
          { q: 'K12M-2039121', label: 'Swift',        engine: 'K12M', mfgDate: '2025-11-20', batch: 'B-SW-251120', batchCount: 5, partCount: 22, recalls: 0, compliance: 95, recycled: 18.4, status: '✅ OK',        color: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400' },
          { q: 'K12N-3812099', label: 'Baleno',       engine: 'K12N', mfgDate: '2025-11-22', batch: 'B-BL-251122', batchCount: 4, partCount: 20, recalls: 0, compliance: 93, recycled: 17.9, status: '✅ OK',        color: 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400' },
          { q: 'K15B-4421332', label: 'Brezza',       engine: 'K15B', mfgDate: '2025-10-30', batch: 'B-BR-251030', batchCount: 2, partCount: 16, recalls: 2, compliance: 78, recycled: 14.1, status: '🚨 Recalled',  color: 'border-red-300 text-red-800 bg-red-50 hover:bg-red-100 hover:border-red-400' },
          { q: 'Z12E-5590012', label: 'Fronx',        engine: 'Z12E', mfgDate: '2025-12-01', batch: 'B-FX-251201', batchCount: 1, partCount: 4,  recalls: 0, compliance: 97, recycled: 20.1, status: '✅ OK',        color: 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:border-purple-400' },
          { q: 'K15C-6671208', label: 'Ertiga',       engine: 'K15C', mfgDate: '2025-11-18', batch: 'B-ER-251118', batchCount: 3, partCount: 21, recalls: 1, compliance: 91, recycled: 17.5, status: '⚠️ Flagged',  color: 'border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 hover:border-teal-400' },
          { q: 'K12N-7823401', label: 'Dzire',        engine: 'K12N', mfgDate: '2025-11-25', batch: 'B-DZ-251125', batchCount: 4, partCount: 19, recalls: 0, compliance: 94, recycled: 18.8, status: '✅ OK',        color: 'border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400' },
          { q: 'K10C-8839021', label: 'WagonR',       engine: 'K10C', mfgDate: '2025-11-28', batch: 'B-WR-251128', batchCount: 2, partCount: 14, recalls: 1, compliance: 88, recycled: 15.9, status: '⚠️ Flagged',  color: 'border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 hover:border-pink-400' },
        ];
        const active = VEHICLE_CARDS.find(c => c.label === selectedModel);
        return (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Fleet — All Models</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Click a model to view its production stats — then open individual vehicle traces from within</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">{VEHICLE_CARDS.length} models</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VEHICLE_CARDS.map(({ q, label, engine, status, color }) => (
                  <button
                    key={q}
                    onClick={() => setSelectedModel(prev => prev === label ? null : label)}
                    className={`rounded-xl border-2 px-3 py-3 transition-all text-left hover:shadow-md active:scale-95 ${color} ${
                      selectedModel === label ? 'ring-2 ring-offset-2 ring-[#5a7a32] shadow-md' : ''
                    }`}
                  >
                    <div className="font-bold text-sm mb-0.5">{label}</div>
                    <div className="text-[11px] opacity-80">{status}</div>
                    <div className="font-mono text-[10px] opacity-50 truncate mt-1.5 pt-1.5 border-t border-current/10">{engine}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model KPI Panel — appears when a card is selected */}
            {active && (
              <div className="bg-white rounded-2xl border border-[#96ca38] shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f0f8e8] flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[#5a7a32]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{active.label} — Model Overview</h3>
                      <p className="text-xs text-slate-500">Production & quality stats for this model</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedModel(null)} className="text-slate-400 hover:text-slate-700 text-xs border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50">Close ×</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Last Manufacturing */}
                  <div className="bg-[#f8ffe8] rounded-xl border border-[#d4edab] p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CalendarDays className="w-3.5 h-3.5 text-[#5a7a32]" />
                      <span className="text-[10px] font-bold text-[#5a7a32] uppercase tracking-wider">Last Manufacturing</span>
                    </div>
                    <div className="text-base font-bold text-slate-800">{active.label}</div>
                    <div className="text-sm text-slate-600 mt-0.5">{active.mfgDate}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Line-2B (Gurgaon)</div>
                  </div>
                  {/* Last Batch */}
                  <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Package className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Last Batch</span>
                    </div>
                    <div className="text-base font-bold text-slate-800 font-mono">{active.batch}</div>
                    <div className="text-sm text-slate-600 mt-0.5">{active.batchCount} vehicle{active.batchCount > 1 ? 's' : ''} in batch</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">In Production</div>
                  </div>
                  {/* Parts in Batch */}
                  <div className="bg-purple-50 rounded-xl border border-purple-100 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Parts in Batch</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{active.partCount}</div>
                    <div className="text-[11px] text-slate-400 mt-1">components indexed</div>
                  </div>
                  {/* Material Mix */}
                  <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Material Mix</span>
                    </div>
                    {[{ mat: 'Aluminium', pct: 32 }, { mat: 'Steel', pct: 28 }, { mat: 'Polymer', pct: 18 }].map(m => (
                      <div key={m.mat} className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-500 w-14 shrink-0">{m.mat}</span>
                        <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${m.pct}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">{m.pct}%</span>
                      </div>
                    ))}
                  </div>
                  {/* Active Recalls */}
                  <div className="bg-red-50 rounded-xl border border-red-100 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Active Recalls</span>
                    </div>
                    <div className={`text-3xl font-bold ${active.recalls > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{active.recalls}</div>
                    <div className="text-[11px] text-slate-400 mt-1">open recall{active.recalls !== 1 ? 's' : ''}</div>
                    {active.recalls > 0 && <div className="text-[10px] text-red-500 mt-0.5 font-medium animate-pulse">Action required</div>}
                  </div>
                  {/* Compliance */}
                  <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Compliance</span>
                    </div>
                    <div className={`text-3xl font-bold ${active.compliance >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{active.compliance}%</div>
                    <Progress percent={active.compliance} strokeColor={active.compliance >= 90 ? '#16a34a' : '#d97706'} showInfo={false} size="small" className="mt-2" />
                    <div className="text-[11px] text-slate-400 mt-1">EPR FY2025-26</div>
                  </div>
                  {/* Recycled */}
                  <div className="bg-green-50 rounded-xl border border-green-100 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Recycle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Avg Recycled</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{active.recycled}%</div>
                    <div className="text-[11px] text-slate-400 mt-1">recycled content</div>
                    <div className={`text-[10px] font-medium mt-0.5 ${active.recycled >= 20 ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {active.recycled >= 20 ? '✅ Target met' : 'Target: 20%'}
                    </div>
                  </div>
                  {/* Vehicle List */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ListTree className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Vehicle List</span>
                    </div>
                    <div className="space-y-1.5">
                      {[active.q, active.q.replace(/-\d+$/, '-' + (parseInt(active.q.split('-').pop()!) + 1)), active.q.replace(/-\d+$/, '-' + (parseInt(active.q.split('-').pop()!) + 2))]
                        .slice(0, active.batchCount).map((eng, idx) => (
                          <button key={eng} onClick={() => { setQuery(eng); executeSearch(eng); setSelectedModel(null); }}
                            className="w-full text-left flex items-center justify-between hover:bg-white rounded-lg px-2 py-1 transition-colors group border border-transparent hover:border-[#d4edab]">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-700 group-hover:text-[#5a7a32]">{active.label} #{idx + 1}</div>
                              <div className="font-mono text-[9px] text-slate-400">{eng}</div>
                            </div>
                            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#5a7a32]" />
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* ── Search Bar ───────────────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800">Vehicle Look-up</h2>
            <p className="text-sm text-slate-500 mt-1">Enter an Engine Number (e.g. K15C-1093847) or Chassis Number (17-char VIN)</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex-1 relative" ref={inputWrapRef}>
              <Input
                size="large"
                placeholder="Engine No. or Chassis No. — type to search…"
                prefix={<Search className="w-5 h-5 text-slate-400 mr-2" />}
                value={query}
                onChange={handleQueryChange}
                onFocus={() => setDropdownOpen(true)}
                onPressEnter={() => { setDropdownOpen(false); executeSearch(query); }}
                className="rounded-xl !text-base"
                allowClear
                onClear={() => { setQuery(''); setDropdownOpen(false); }}
                style={{ paddingTop: '6px', paddingBottom: '6px' }}
              />
              {dropdownOpen && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">
                      {query ? `${suggestions.length} results for "${query}"` : 'All available vehicles'}
                    </span>
                  </div>
                  {suggestions.map((s) => (
                    <button key={s.value} onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s.value); }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f8ffe8] transition-colors border-b border-slate-50 last:border-0 text-left group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${s.type === 'Engine Number' ? 'bg-[#5a7a32]' : 'bg-indigo-600'}`}>
                          {s.type === 'Engine Number' ? 'E' : 'C'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-sm text-slate-800 truncate">
                            {query ? s.value.split(new RegExp(`(${query})`, 'i')).map((part, pi) =>
                              part.toLowerCase() === query.toLowerCase()
                                ? <mark key={pi} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
                                : part
                            ) : s.value}
                          </div>
                          <div className="text-[11px] text-slate-400">{s.modelName} · {s.type}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#5a7a32] transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {identType !== 'Unknown' && (
                <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${identType === 'Engine Number' ? 'bg-[#96ca38]' : 'bg-indigo-500'}`} />
                  <span className="text-slate-500 font-medium">Detected: {identType}</span>
                </div>
              )}
            </div>
            <Button type="primary" size="large" loading={searching}
              onClick={() => { setDropdownOpen(false); executeSearch(query); }}
              className="!rounded-xl !px-8 !font-bold flex-shrink-0"
              style={{ background: '#5a7a32', border: 'none', height: '46px' }}>
              {searching ? 'Tracing...' : 'Trace Vehicle'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Search History (separate card) ───────────────────────────────────── */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                <History className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-sm font-bold text-slate-700">Search History</span>
            </div>
            <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Clear all</button>
          </div>
          <div className="space-y-1">
            {history.map((h, i) => {
              const match = mockVehicles.find(v => v.engineNumber === h || v.chassisNumber === h);
              const isEngine = detectIdentifierType(h) === 'Engine Number';
              return (
                <button key={h} onClick={() => { setQuery(h); executeSearch(h); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8ffe8] transition-colors group border border-transparent hover:border-[#d4edab] text-left">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${isEngine ? 'bg-[#5a7a32]' : 'bg-indigo-600'}`}>
                    {isEngine ? 'E' : 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-slate-700 group-hover:text-[#5a7a32] truncate">{h}</div>
                    {match && <div className="text-[11px] text-slate-400">{match.modelName} · {match.status}</div>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#5a7a32] flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Loader ───────────────────────────────────────────────────────────── */}
      {searching && (
        <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200 min-h-[400px] flex items-center justify-center">
          <CarLoader />
        </div>
      )}

      {/* ── Timeout error ────────────────────────────────────────────────────── */}
      {timedOut && !searching && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-bold text-red-800 text-lg">Request Timed Out</h3>
          <p className="text-red-600 text-sm mt-1">The traceability service did not respond within 8 seconds.</p>
          <Button
            danger
            className="mt-4"
            onClick={() => { setTimedOut(false); executeSearch(query); }}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────────────── */}
      {vehicle && !searching && (
        <div
          className="animate-in fade-in slide-in-from-bottom-6 duration-700"
          style={{ animationFillMode: 'both' }}
        >
          {/* Vehicle root card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center border"
                  style={{ background: 'linear-gradient(135deg, #f0f8e8, #d9efc0)', borderColor: '#96ca38' }}>
                  <Truck className="w-7 h-7 text-[#5a7a32]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-slate-800">{vehicle.modelName}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${vehicleStatusColor[vehicle.status]}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="font-mono">Engine: <strong className="text-slate-800">{vehicle.engineNumber}</strong></span>
                    <span className="font-mono">Chassis: <strong className="text-slate-800">{vehicle.chassisNumber}</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{vehicle.assemblyLineId}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Mfg: {vehicle.manufacturingDate}</span>
                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{nodeCount} parts indexed</span>
              </div>
            </div>

            {/* Active recall warning */}
            {vehicle.activeRecalls.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-red-700">
                    {vehicle.activeRecalls.length} active recall{vehicle.activeRecalls.length > 1 ? 's' : ''} affecting this vehicle.
                  </span>
                  <span className="text-xs text-red-500 ml-2">{vehicle.activeRecalls[0].id}: {vehicle.activeRecalls[0].description.slice(0, 60)}...</span>
                </div>
                <button
                  onClick={() => setMode('vehicle_recall')}
                  className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1"
                >
                  View <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Main content area */}
          <div className="flex gap-5">

            {/* Tree panel */}
            <div className={`flex-1 min-w-0 transition-all duration-500 ease-out`}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col" style={{ height: '680px' }}>

                {/* Tree header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#5a7a32]" />
                    <span className="font-bold text-slate-700 text-sm">Parts Hierarchy</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{nodeCount} nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Tree search */}
                    <Input
                      size="small"
                      placeholder="Filter tree..."
                      prefix={<Search className="w-3 h-3 text-slate-400" />}
                      value={treeSearch}
                      onChange={e => setTreeSearch(e.target.value)}
                      className="w-36 !rounded-lg"
                      allowClear
                    />
                    <Tooltip title="Expand All">
                      <button
                        onClick={() => setForceExpanded(true)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Collapse All">
                      <button
                        onClick={() => setForceExpanded(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Reset Tree">
                      <button
                        onClick={() => { setForceExpanded(null); setTreeSearch(''); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Alert legend */}
                {alertPaths.size > 0 && (
                  <div className="flex items-center gap-3 px-5 py-2 bg-amber-50/70 border-b border-amber-100 flex-shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">
                      Highlighted branches contain flagged or recalled parts. Ancestor nodes are also highlighted.
                    </span>
                  </div>
                )}

                {/* Tree body */}
                <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                  <TreeNode
                    node={vehicle.rootPart}
                    level={0}
                    delayIndex={0}
                    searchQuery={treeSearch}
                    onNodeClick={handleNodeClick}
                    forceExpanded={forceExpanded}
                    alertPaths={alertPaths}
                    selectedNodeId={selectedNode?.id ?? null}
                  />
                </div>

                {/* Workflow selector */}
                <div className="flex-shrink-0 border-t border-slate-100 px-5 py-3.5 bg-slate-50/60">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Operational Mode</span>
                    <div className="overflow-x-auto">
                      <Segmented
                        value={mode}
                        onChange={val => setMode(val as WorkflowMode)}
                        size="small"
                        options={MODES.map(m => ({ value: m.value, label: m.label }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights (below tree) */}
              <PartsTraceAIPanel insights={partsAIInsights} />
            </div>

            {/* Side panel: Workflow + Detail Drawer (stacked) */}
            <div className="w-[420px] flex-shrink-0 space-y-4">
              {/* Workflow panel */}
              {mode === 'quality' && <QualityCheckPanel vehicle={vehicle} />}
              {mode === 'vehicle_recall' && <VehicleRecallPanel vehicle={vehicle} />}
              {mode === 'part_recall' && <PartRecallPanel selectedPart={selectedNode} />}
              {mode === 'compliance' && <CompliancePanel vehicle={vehicle} />}

              {/* Detail drawer (inline beside tree on wide screens) */}
              {drawerOpen && selectedNode && (
                <div className="sticky top-4">
                  <PartDetailDrawer
                    node={selectedNode}
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────────── */}
      {/* {!vehicle && !searching && !timedOut && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f0f8e8, #d9efc0)', border: '1px solid #96ca38' }}>
            <GitBranch className="w-10 h-10 text-[#5a7a32]" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Enter a vehicle identifier to begin</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            The parts traceability tree provides a complete view of every component, material, supplier, and quality log for any MSIL vehicle.
            <br /><span className="text-[#5a7a32] font-semibold">Type anything in the search box above for live suggestions.</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { q: 'K15C-1093847', label: 'Grand Vitara', sub: 'Engine K15C', status: '⚠️ Flagged', color: 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100' },
              { q: 'K12M-2039121', label: 'Swift', sub: 'Engine K12M', status: '✅ OK', color: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
              { q: 'K12N-3812099', label: 'Baleno', sub: 'Engine K12N', status: '✅ OK', color: 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100' },
              { q: 'K15B-4421332', label: 'Brezza', sub: 'Engine K15B', status: '🚨 Recalled', color: 'border-red-300 text-red-800 bg-red-50 hover:bg-red-100' },
              { q: 'Z12E-5590012', label: 'Fronx', sub: 'Engine Z12E', status: '✅ OK', color: 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100' },
              { q: 'K15C-6671208', label: 'Ertiga', sub: 'Engine K15C', status: '⚠️ Flagged', color: 'border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100' },
              { q: 'K12N-7823401', label: 'Dzire', sub: 'Engine K12N', status: '✅ OK', color: 'border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100' },
              { q: 'K10C-8839021', label: 'WagonR', sub: 'Engine K10C', status: '⚠️ Flagged', color: 'border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100' },
            ].map(({ q, label, sub, status, color }) => (
              <button
                key={q}
                onClick={() => { setQuery(q); executeSearch(q); }}
                className={`rounded-xl border px-3 py-3 transition-all text-left hover:shadow-sm ${color}`}
              >
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{status}</div>
                <div className="font-mono text-[10px] opacity-50 truncate mt-1">{q}</div>
              </button>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PartsTraceTab;
