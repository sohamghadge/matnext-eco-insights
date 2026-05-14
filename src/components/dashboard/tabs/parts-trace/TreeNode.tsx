import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, ChevronDown, AlertTriangle, CheckCircle,
  Info, Clock, Package, X
} from 'lucide-react';
import { PartNode, PartStatus, computeAlertPaths } from '../../../../data/partsTraceData';

interface TreeNodeProps {
  node: PartNode;
  level: number;
  delayIndex: number;
  searchQuery: string;
  onNodeClick: (node: PartNode) => void;
  forceExpanded: boolean | null; // null = user-controlled, true = all expand, false = all collapse
  alertPaths: Set<string>;
  selectedNodeId: string | null;
}

const STATUS_CONFIG: Record<PartStatus, { bg: string; border: string; text: string; dot: string; icon: React.ReactNode }> = {
  'OK':           { bg: 'bg-emerald-50',  border: 'border-emerald-200', text: 'text-emerald-700',  dot: 'bg-emerald-500', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  'Flagged':      { bg: 'bg-amber-50',    border: 'border-amber-200',   text: 'text-amber-700',    dot: 'bg-amber-500',   icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  'Recalled':     { bg: 'bg-red-50',      border: 'border-red-200',     text: 'text-red-700',      dot: 'bg-red-500',     icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  'Under Review': { bg: 'bg-blue-50',     border: 'border-blue-200',    text: 'text-blue-700',     dot: 'bg-blue-400',    icon: <Info className="w-3.5 h-3.5" /> },
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node, level, delayIndex, searchQuery, onNodeClick,
  forceExpanded, alertPaths, selectedNodeId
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delayIndex * 45);
    return () => clearTimeout(t);
  }, [delayIndex]);

  useEffect(() => {
    if (forceExpanded === true)  setIsExpanded(true);
    if (forceExpanded === false) setIsExpanded(false);
  }, [forceExpanded]);

  const hasChildren = (node.children?.length ?? 0) > 0;
  const sc = STATUS_CONFIG[node.status];
  const isAlert = alertPaths.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isMatch = searchQuery.length >= 2 && (
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const INDENT = 28;

  return (
    <div
      className="select-none"
      style={{
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? 'none' : `translateX(-12px)`,
        transition: `opacity 0.35s ease ${delayIndex * 40}ms, transform 0.35s ease ${delayIndex * 40}ms`,
      }}
    >
      <div className="flex items-start gap-0 relative">
        {/* Indent + connector lines */}
        <div style={{ width: level * INDENT }} className="relative flex-shrink-0 self-stretch">
          {level > 0 && Array.from({ length: level }).map((_, li) => (
            <div
              key={li}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: li * INDENT + 12,
                background: li < level - 1 ? 'rgba(148,163,184,0.3)' : 'transparent'
              }}
            />
          ))}
          {level > 0 && (
            <>
              <div
                className="absolute w-px"
                style={{ left: (level - 1) * INDENT + 12, top: 0, bottom: '50%', background: 'rgba(148,163,184,0.4)' }}
              />
              <div
                className="absolute h-px"
                style={{ left: (level - 1) * INDENT + 12, width: INDENT - 4, top: '50%', background: 'rgba(148,163,184,0.4)' }}
              />
            </>
          )}
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 w-5 flex items-center justify-center self-center z-10">
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(v => !v); }}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors bg-white border border-slate-200"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded
                ? <ChevronDown className="w-3 h-3" />
                : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full bg-slate-200 mx-auto" />
          )}
        </div>

        {/* Node Card */}
        <div
          onClick={() => onNodeClick(node)}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNodeClick(node); }}
          role="button"
          aria-expanded={hasChildren ? isExpanded : undefined}
          className={[
            'flex-1 ml-2 my-1 rounded-xl border cursor-pointer transition-all duration-200 group',
            'focus:outline-none focus:ring-2 focus:ring-[#96ca38] focus:ring-offset-1',
            isSelected
              ? 'ring-2 ring-[#96ca38] ring-offset-1 shadow-md bg-[#f8fff0] border-[#96ca38]'
              : isMatch
                ? 'ring-2 ring-yellow-300 bg-yellow-50/60 border-yellow-300 shadow-sm'
                : isAlert && (node.status === 'Recalled')
                  ? 'border-red-200 bg-red-50/40 hover:shadow-md hover:border-red-300'
                  : isAlert && (node.status === 'Flagged')
                    ? 'border-amber-200 bg-amber-50/30 hover:shadow-md hover:border-amber-300'
                    : 'border-slate-200 bg-white hover:shadow-sm hover:border-slate-300'
          ].join(' ')}
        >
          <div className="px-3 py-2.5 flex items-center gap-3">
            {/* Status dot */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot} ${node.status !== 'OK' ? 'animate-pulse' : ''}`} />

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800 text-sm leading-tight">{node.name}</span>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                  {node.partNumber}
                </span>
                {/* Jira-style material badge */}
                {node.material && (() => {
                  const MAT_COLORS: Record<string, string> = {
                    STEEL:      'bg-blue-100 text-blue-700 border-blue-200',
                    PLASTIC:    'bg-orange-100 text-orange-700 border-orange-200',
                    RUBBER:     'bg-yellow-100 text-yellow-700 border-yellow-200',
                    BATTERY:    'bg-green-100 text-green-700 border-green-200',
                    GLASS:      'bg-cyan-100 text-cyan-700 border-cyan-200',
                    ALUMINIUM:  'bg-purple-100 text-purple-700 border-purple-200',
                    COMPOSITE:  'bg-slate-100 text-slate-600 border-slate-200',
                    ELECTRONIC: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                    COPPER:     'bg-amber-100 text-amber-700 border-amber-200',
                    FOAM:       'bg-pink-100 text-pink-700 border-pink-200',
                  };
                  return (
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${MAT_COLORS[node.material] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {node.material}
                    </span>
                  );
                })()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {node.supplierName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Batch {node.batchNumber}
                </span>
                {node.materialProducer && (
                  <><span className="text-slate-300">•</span><span className="text-violet-600 font-medium">🏭 {node.materialProducer}</span></>
                )}
                {node.elvBatch && (
                  <><span className="text-slate-300">•</span><span className="text-teal-600 font-mono text-[10px]">ELV: {node.elvBatch}</span></>
                )}
                {node.recycledContentPercent !== undefined && node.recycledContentPercent > 0 && (
                  <><span className="text-slate-300">•</span><span className="text-emerald-600 font-medium">♻ {node.recycledContentPercent}% recycled</span></>
                )}
              </div>
            </div>

            {/* Status badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold shrink-0 ${sc.bg} ${sc.border} ${sc.text}`}>
              {sc.icon}
              {node.status}
            </div>
          </div>

          {/* QC log mini-summary if has issues */}
          {node.qcLogs && node.qcLogs.some(l => !l.passed) && (
            <div className="px-3 pb-2 flex gap-1 flex-wrap">
              {node.qcLogs.filter(l => !l.passed).map((log, i) => (
                <span key={i} className="text-[10px] bg-red-100 text-red-700 rounded px-2 py-0.5 border border-red-200 font-medium">
                  ⚠ {log.parameter}: {log.actual}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isExpanded ? '9999px' : 0,
          opacity:   isExpanded ? 1 : 0,
          transition: `max-height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease`
        }}
      >
        {node.children?.map((child, idx) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            delayIndex={delayIndex + idx + 1}
            searchQuery={searchQuery}
            onNodeClick={onNodeClick}
            forceExpanded={forceExpanded}
            alertPaths={alertPaths}
            selectedNodeId={selectedNodeId}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeNode;
