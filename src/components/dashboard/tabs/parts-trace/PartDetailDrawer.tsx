import React, { useState } from 'react';
import {
  X, Copy, Share2, ShieldCheck, Factory, AlertCircle,
  CheckCircle, Clock, ArrowUpRight
} from 'lucide-react';
import { PartNode } from '../../../../data/partsTraceData';
import { Divider, notification } from 'antd';

interface PartDetailDrawerProps {
  node: PartNode | null;
  isOpen: boolean;
  onClose: () => void;
}

const PartDetailDrawer: React.FC<PartDetailDrawerProps> = ({ node, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (node) {
      navigator.clipboard.writeText(node.partNumber).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!isOpen || !node) return null;

  const statusColors: Record<string, string> = {
    'OK':           'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Flagged':      'bg-amber-100 text-amber-700 border-amber-200',
    'Recalled':     'bg-red-100 text-red-700 border-red-200',
    'Under Review': 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col max-h-[680px]">
      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-700 px-5 py-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Part Detail</p>
            <h3 className="font-bold text-lg text-white leading-tight truncate">{node.name}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <code className="text-xs text-slate-300 bg-white/10 px-2 py-0.5 rounded font-mono">{node.partNumber}</code>
              {node.status && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[node.status] ?? ''}`}>
                  {node.status}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? '✓ Copied!' : 'Copy Part ID'}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.href}?part=${node.partNumber}`);
              notification.success({ message: 'Share link copied to clipboard.' });
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Link
          </button>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
        <div className="p-5 space-y-6">

          {/* Traceability */}
          <section>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Traceability</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Batch / Lot</div>
                <div className="font-semibold text-slate-800 text-sm">{node.batchNumber}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Incorporated</div>
                <div className="font-semibold text-slate-800 text-sm">{node.incorporationDate}</div>
              </div>
            </div>

            {/* Supplier */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Factory className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{node.supplierName}</div>
                  {node.supplierAddress && (
                    <div className="text-xs text-slate-500 leading-tight mt-1">{node.supplierAddress}</div>
                  )}
                  {node.supplierCertification && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg mt-2 border border-emerald-200 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {node.supplierCertification}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Materials */}
          <section>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Material Composition</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-sm text-slate-700 mb-2">
              {node.materialComposition}
            </div>
            {node.recycledContentPercent !== undefined && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <div className="text-2xl font-bold text-emerald-600">{node.recycledContentPercent}%</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-emerald-700">Recycled Content</div>
                  <div className="w-full h-1.5 bg-emerald-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, (node.recycledContentPercent / 20) * 100)}%`,
                        background: node.recycledContentPercent >= 20 ? '#16a34a' : '#d97706'
                      }}
                    />
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">vs. 20% EPR mandate</div>
                </div>
              </div>
            )}
            {node.materialTraceability && (
              <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">MatNEXT Traceability Chain</div>
                <p className="text-xs text-indigo-800 leading-relaxed">{node.materialTraceability}</p>
              </div>
            )}
          </section>

          {/* QC Logs */}
          {node.qcLogs && node.qcLogs.length > 0 && (
            <section>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Inspection Log</h4>
              <div className="space-y-2">
                {node.qcLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-3 ${log.passed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-slate-800">{log.parameter}</span>
                      {log.passed
                        ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                        : <AlertCircle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/70 rounded-lg px-2 py-1.5">
                        <div className="text-slate-400 text-[10px]">Expected</div>
                        <div className="font-semibold text-slate-700">{log.expected}</div>
                      </div>
                      <div className={`rounded-lg px-2 py-1.5 ${!log.passed ? 'bg-red-100/80' : 'bg-white/70'}`}>
                        <div className="text-slate-400 text-[10px]">Actual</div>
                        <div className={`font-semibold ${!log.passed ? 'text-red-700' : 'text-slate-700'}`}>{log.actual}</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{log.date}</span>
                      <span>Inspector: {log.inspectorId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action Items */}
          {node.actionItems && node.actionItems.length > 0 && (
            <section>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Open Actions</h4>
              <div className="space-y-2">
                {node.actionItems.map((action, i) => (
                  <div key={i} className="flex gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    {action}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compliance */}
          {node.compliance && node.compliance.length > 0 && (
            <section>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Compliance Obligations</h4>
              {node.compliance.map((c, i) => (
                <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-800 px-3 py-2">
                    <div className="font-semibold text-white text-xs">{c.rule}</div>
                  </div>
                  <div className="p-3 space-y-2 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Current</span>
                      <span className="text-sm font-bold text-red-600">{c.current}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Required</span>
                      <span className="text-sm font-bold text-emerald-600">{c.required}</span>
                    </div>
                    <Divider style={{ margin: '6px 0' }} />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {c.deadline}</span>
                      <span>{c.responsibleParty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartDetailDrawer;
