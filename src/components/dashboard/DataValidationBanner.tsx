import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { Tag, Button, Tooltip } from 'antd';

interface ValidationItem {
    field: string;
    expected: number;
    actual: number;
    deviation: number; // percentage deviation
    severity: 'warning' | 'critical';
}

interface DataValidationBannerProps {
    items?: ValidationItem[];
    threshold?: number; // default 5 (%)
    className?: string;
}

const defaultItems: ValidationItem[] = [
    { field: 'Steel Recovery (MT)', expected: 1000, actual: 1082, deviation: 8.2, severity: 'critical' },
    { field: 'Battery Collection Target', expected: 180, actual: 168, deviation: -6.7, severity: 'critical' },
    { field: 'Plastic Recycled %', expected: 30, actual: 27.5, deviation: -8.3, severity: 'critical' },
    { field: 'Copper Achieved (MT)', expected: 28, actual: 26.2, deviation: -6.4, severity: 'warning' },
];

const DataValidationBanner: React.FC<DataValidationBannerProps> = ({
    items = defaultItems,
    threshold = 5,
    className = '',
}) => {
    const [expanded, setExpanded] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || items.length === 0) return null;

    const criticalCount = items.filter(i => Math.abs(i.deviation) > threshold * 2).length;
    const warningCount = items.length - criticalCount;

    return (
        <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl shadow-sm overflow-hidden ${className}`}>
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-amber-100/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-amber-900">
                            Data Validation Alert — {items.length} item{items.length > 1 ? 's' : ''} outside ±{threshold}% threshold
                        </h4>
                        <p className="text-xs text-amber-700 mt-0.5">
                            {criticalCount > 0 && <Tag color="red" className="text-[10px] mr-1">{criticalCount} Critical</Tag>}
                            {warningCount > 0 && <Tag color="gold" className="text-[10px]">{warningCount} Warning</Tag>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="small"
                        type="link"
                        className="text-amber-700 font-medium text-xs"
                        onClick={(e) => { e.stopPropagation(); /* Link to issue management */ }}
                        icon={<ExternalLink className="w-3 h-3" />}
                    >
                        Raise Issue
                    </Button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                        className="p-1 rounded hover:bg-amber-200 text-amber-600 transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    {expanded ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
                </div>
            </div>

            {/* Expanded Detail */}
            {expanded && (
                <div className="px-4 pb-3 border-t border-amber-200">
                    <table className="w-full text-sm mt-2">
                        <thead>
                            <tr className="text-xs text-amber-700 uppercase tracking-wider">
                                <th className="text-left py-1.5 font-semibold">Field</th>
                                <th className="text-right py-1.5 font-semibold">Expected</th>
                                <th className="text-right py-1.5 font-semibold">Actual</th>
                                <th className="text-right py-1.5 font-semibold">Deviation</th>
                                <th className="text-center py-1.5 font-semibold">Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-t border-amber-100">
                                    <td className="py-2 font-medium text-gray-800">{item.field}</td>
                                    <td className="py-2 text-right text-gray-600">{item.expected.toLocaleString()}</td>
                                    <td className="py-2 text-right font-semibold text-gray-800">{item.actual.toLocaleString()}</td>
                                    <td className="py-2 text-right">
                                        <span className={`font-bold ${item.deviation > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            {item.deviation > 0 ? '+' : ''}{item.deviation.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="py-2 text-center">
                                        <Tag color={Math.abs(item.deviation) > threshold * 2 ? 'red' : 'gold'} className="text-[10px]">
                                            {Math.abs(item.deviation) > threshold * 2 ? 'Critical' : 'Warning'}
                                        </Tag>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between">
                        <p className="text-xs text-amber-700">
                            Items with deviation beyond ±{threshold}% require review. Click "Raise Issue" to create an action item.
                        </p>
                        <Tooltip title="Connect to issue management system">
                            <Button size="small" type="primary" className="bg-amber-600 hover:bg-amber-700 text-xs">
                                View All Issues
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataValidationBanner;
