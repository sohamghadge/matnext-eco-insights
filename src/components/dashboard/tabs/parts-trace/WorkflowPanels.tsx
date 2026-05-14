import React, { useState } from 'react';
import { VehicleTrace, PartNode, PartsAIInsight } from '../../../../data/partsTraceData';
import {
  ShieldAlert, AlertTriangle, AlertCircle, FileText,
  CheckCircle, Clock, RotateCcw, TrendingUp, Eye, EyeOff,
  Sparkles, X, ArrowUpRight
} from 'lucide-react';
import { Button, Tag, Input, Progress, notification, Divider } from 'antd';

// ─── 5.1 Quality Check ────────────────────────────────────────────────────────

export const QualityCheckPanel: React.FC<{ vehicle: VehicleTrace }> = ({ vehicle }) => {
  // Flatten all nodes and count QC status
  const allNodes: PartNode[] = [];
  const flatten = (n: PartNode) => { allNodes.push(n); n.children?.forEach(flatten); };
  flatten(vehicle.rootPart);

  const withLogs = allNodes.filter(n => n.qcLogs && n.qcLogs.length > 0);
  const withIssues = withLogs.filter(n => n.qcLogs!.some(l => !l.passed));
  const passed = withLogs.length - withIssues.length;
  const passRate = withLogs.length > 0 ? Math.round((passed / withLogs.length) * 100) : 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Quality Assurance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Inspection data across all parts</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary banner */}
        <div className={`rounded-xl p-4 border ${withIssues.length > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-slate-700">
              <span className="text-emerald-600 font-bold">{passed}</span> of{' '}
              <span className="font-bold">{withLogs.length}</span> parts passed.{' '}
              {withIssues.length > 0 && <span className="text-red-600 font-bold">{withIssues.length} with issues.</span>}
            </span>
          </div>
          <Progress
            percent={passRate}
            strokeColor={passRate >= 90 ? '#16a34a' : passRate >= 70 ? '#d97706' : '#dc2626'}
            showInfo
            format={p => <span className="text-xs font-bold">{p}%</span>}
            size="small"
          />
        </div>

        {/* Issue parts */}
        {withIssues.map(n => (
          <div key={n.id} className="rounded-xl bg-red-50 border border-red-200 p-3">
            <div className="font-semibold text-sm text-red-800 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {n.name}
            </div>
            <div className="text-xs text-red-600 font-mono mb-2">{n.partNumber}</div>
            {n.qcLogs?.filter(l => !l.passed).map((log, i) => (
              <div key={i} className="text-xs bg-white/60 rounded-lg p-2 border border-red-100 mb-1">
                <span className="font-medium">{log.parameter}:</span> Got <strong>{log.actual}</strong>, expected <strong>{log.expected}</strong>
              </div>
            ))}
          </div>
        ))}

        <Button
          icon={<FileText className="w-4 h-4" />}
          onClick={() => notification.info({ message: 'Export', description: 'Quality report download started.' })}
          className="w-full mt-2 border-[#96ca38] text-[#5a7a32] hover:bg-[#f8ffe8]"
        >
          Export Quality Report (PDF)
        </Button>
      </div>
    </div>
  );
};

// ─── 5.2 Vehicle Recall ───────────────────────────────────────────────────────

export const VehicleRecallPanel: React.FC<{ vehicle: VehicleTrace }> = ({ vehicle }) => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [note, setNote] = useState('');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Vehicle Recall</h3>
            <p className="text-xs text-slate-500 mt-0.5">{vehicle.activeRecalls.length} active · {vehicle.pastRecalls.length} historical</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {vehicle.activeRecalls.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            No active recalls for this vehicle.
          </div>
        ) : (
          vehicle.activeRecalls.map(recall => (
            <div key={recall.id} className="rounded-xl border border-red-200 overflow-hidden">
              <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
                <span className="font-bold text-white">{recall.id}</span>
                <Tag color={completed.includes(recall.id) ? 'green' : 'red'}>
                  {completed.includes(recall.id) ? 'Completed' : recall.status}
                </Tag>
              </div>
              <div className="bg-red-50 p-4 space-y-3">
                <p className="text-sm text-red-800">{recall.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-red-600">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recall.date}</span>
                  <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {recall.authority}</span>
                </div>
                {!completed.includes(recall.id) && (
                  <div className="space-y-2 mt-2">
                    <Input
                      placeholder="Resolution notes..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      className="text-sm"
                    />
                    <Button
                      danger
                      type="primary"
                      className="w-full"
                      onClick={() => {
                        setCompleted(prev => [...prev, recall.id]);
                        notification.success({ message: `Recall ${recall.id} marked complete.` });
                      }}
                    >
                      Mark Recall as Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Past recalls */}
        {vehicle.pastRecalls.length > 0 && (
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 hover:text-slate-600">
              <span className="flex-1">Past Recalls ({vehicle.pastRecalls.length})</span>
              <span className="text-xs text-slate-400 group-open:hidden">Show</span>
              <span className="text-xs text-slate-400 hidden group-open:block">Hide</span>
            </summary>
            {vehicle.pastRecalls.map(r => (
              <div key={r.id} className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
                <div className="font-semibold text-slate-600">{r.id}</div>
                <p className="text-xs text-slate-500 mt-1">{r.description}</p>
                <div className="text-xs text-emerald-600 mt-1">✓ Completed {r.completionDate}</div>
              </div>
            ))}
          </details>
        )}
      </div>
    </div>
  );
};

// ─── 5.3 Part Recall ──────────────────────────────────────────────────────────

export const PartRecallPanel: React.FC<{ selectedPart: PartNode | null }> = ({ selectedPart }) => {
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  if (!selectedPart) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <AlertCircle className="w-10 h-10 text-orange-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">Select a part from the tree to check batch-level recall impact.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Part Recall</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedPart.partNumber} · Batch {selectedPart.batchNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-orange-800 mb-1">Fleet Impact Estimate</div>
          <div className="text-3xl font-bold text-orange-600">1,420 <span className="text-lg">vehicles</span></div>
          <p className="text-xs text-orange-700 mt-1">
            Containing {selectedPart.partNumber} from batch {selectedPart.batchNumber}
          </p>
          <div className="flex gap-3 mt-3 text-xs text-orange-600">
            <span>• 840 In Production</span>
            <span>• 420 Dispatched</span>
            <span>• 160 Delivered</span>
          </div>
        </div>

        {!done ? (
          <div className="space-y-3">
            <Input.TextArea
              placeholder="Enter recall reason and scope..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
            />
            {!confirming ? (
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 border-none text-white"
                disabled={!reason}
                onClick={() => setConfirming(true)}
              >
                Initiate Bulk Recall
              </Button>
            ) : (
              <div className="rounded-xl bg-orange-50 border border-orange-300 p-3 space-y-2">
                <p className="text-sm font-semibold text-orange-800">Confirm recall for 1,420 vehicles?</p>
                <div className="flex gap-2">
                  <Button danger type="primary" className="flex-1" onClick={() => {
                    setDone(true);
                    notification.success({ message: 'Bulk recall initiated', description: 'All stakeholders notified.' });
                  }}>
                    Confirm
                  </Button>
                  <Button className="flex-1" onClick={() => setConfirming(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 font-medium">
            ✓ Bulk recall initiated. Stakeholders notified.
          </div>
        )}
      </div>
    </div>
  );
};

// ─── 5.4 Compliance ───────────────────────────────────────────────────────────

export const CompliancePanel: React.FC<{ vehicle: VehicleTrace }> = ({ vehicle }) => {
  const allNodes: PartNode[] = [];
  const flatten = (n: PartNode) => { allNodes.push(n); n.children?.forEach(flatten); };
  flatten(vehicle.rootPart);

  const nonCompliant = allNodes.filter(n => n.compliance && n.compliance.length > 0);
  const totalNodes = allNodes.length;
  const score = Math.round(((totalNodes - nonCompliant.length) / totalNodes) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Compliance</h3>
            <p className="text-xs text-slate-500 mt-0.5">EPR · ELV Rules · Supplier Certification</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className={`text-3xl font-bold ${score >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{score}%</div>
            <div className="text-xs text-slate-500 mt-1">Compliance Score</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-3xl font-bold text-red-600">{nonCompliant.length}</div>
            <div className="text-xs text-slate-500 mt-1">Open Gaps</div>
          </div>
        </div>

        {nonCompliant.map(n => (
          <div key={n.id} className="rounded-xl border border-blue-200 overflow-hidden">
            <div className="bg-blue-600 px-3 py-2 text-xs font-bold text-white">{n.name}</div>
            {n.compliance?.map((c, i) => (
              <div key={i} className="bg-blue-50 p-3">
                <div className="text-xs font-semibold text-blue-800 mb-2">{c.rule}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Current: <strong className="text-red-600">{c.current}</strong></div>
                  <div>Required: <strong className="text-emerald-600">{c.required}</strong></div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2">Deadline: {c.deadline} · {c.responsibleParty}</div>
              </div>
            ))}
          </div>
        ))}

        <Button
          icon={<FileText className="w-4 h-4" />}
          onClick={() => notification.info({ message: 'Export', description: 'Compliance report download started.' })}
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Export Compliance Report (PDF)
        </Button>
      </div>
    </div>
  );
};

// ─── 6. AI Insights Panel ─────────────────────────────────────────────────────

export const PartsTraceAIPanel: React.FC<{ insights: PartsAIInsight[] }> = ({ insights }) => {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [open, setOpen] = useState(true);

  const CONF_COLORS = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const CAT_ICONS: Record<string, React.ReactNode> = {
    Anomaly: <AlertTriangle className="w-4 h-4" />,
    Risk: <AlertCircle className="w-4 h-4" />,
    Predictive: <TrendingUp className="w-4 h-4" />,
    Compliance: <FileText className="w-4 h-4" />,
    Recall: <ShieldAlert className="w-4 h-4" />,
  };

  const visible = insights.filter(i => !dismissed.includes(i.id));

  return (
    <div className="mt-6 rounded-2xl border border-indigo-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="px-5 py-4 cursor-pointer flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 40%, #1e1b4b 100%)' }}
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="font-bold text-white">MANJU AI AGENT</h3>
            <p className="text-xs text-indigo-300 mt-0.5">MANJU AI · {visible.length} insights generated</p>
          </div>
        </div>
        <button className="text-indigo-300 hover:text-white transition-colors">
          {open ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Body */}
      <div style={{ display: open ? 'block' : 'none' }}>
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 space-y-3">
          {visible.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">All insights dismissed.</div>
          ) : (
            visible.map(insight => (
              <div
                key={insight.id}
                className="bg-white rounded-xl border border-indigo-100 p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.confidence === 'High' ? 'bg-red-100 text-red-600' :
                      insight.confidence === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {CAT_ICONS[insight.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-800">{insight.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CONF_COLORS[insight.confidence]}`}>
                        {insight.confidence} Confidence
                      </span>
                      <Tag color="geekblue" className="text-[10px] m-0">{insight.category}</Tag>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{insight.explanation}</p>

                    {expanded.includes(insight.id) && (
                      <div className="mt-2 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Data Basis</div>
                        <p className="text-[11px] text-slate-600 italic">{insight.dataBasis}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setExpanded(prev =>
                          prev.includes(insight.id) ? prev.filter(x => x !== insight.id) : [...prev, insight.id]
                        )}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        {expanded.includes(insight.id) ? 'Hide' : 'Show'} data basis
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => {
                          notification.success({ message: 'Action created', description: `Insight escalated: ${insight.title}` });
                        }}
                        className="text-[11px] text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
                      >
                        <ArrowUpRight className="w-3 h-3" /> Escalate
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setDismissed(prev => [...prev, insight.id])}
                    className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {dismissed.length > 0 && (
            <button
              onClick={() => setDismissed([])}
              className="w-full flex items-center justify-center gap-2 text-xs text-indigo-500 hover:text-indigo-700 py-2 border border-dashed border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Regenerate / Restore {dismissed.length} dismissed insights
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
