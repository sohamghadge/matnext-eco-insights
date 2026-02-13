import { Card, Progress, Button, Tooltip, Tag } from 'antd';
import { Info, ExternalLink, Leaf, AlertTriangle, CheckCircle, BatteryCharging } from 'lucide-react';
import { EPRComplianceItem } from '@/data/regulatoryData';

interface EPRComplianceSectionProps {
    data: EPRComplianceItem[];
    isLoading: boolean;
}

const EPRComplianceSection = ({ data, isLoading }: EPRComplianceSectionProps) => {
    const getIcon = (category: string) => {
        switch (category) {
            case 'Batteries': return <BatteryCharging className="w-5 h-5 text-emerald-600" />;
            case 'Plastics': return <Leaf className="w-5 h-5 text-emerald-600" />;
            default: return <CheckCircle className="w-5 h-5 text-emerald-600" />;
        }
    };

    const getStatusColor = (achieved: number, target: number) => {
        if (achieved >= target) return '#10b981'; // Green
        if (achieved >= target * 0.8) return '#f59e0b'; // Orange/Warning
        return '#ef4444'; // Red/Exception
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800">EPR Compliance Status (India)</h3>
                <Tooltip title="Extended Producer Responsibility (EPR) mandates for various waste streams under Indian Law.">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    // Skeleton loaders could be added here
                    <Card loading={true} className="shadow-sm border-gray-200" />
                ) : (
                    data.map((item) => (
                        <Card
                            key={item.id}
                            className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-300"
                            bodyStyle={{ padding: '16px' }}
                        >
                            <div className="flex flex-col h-full justify-between gap-4">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            {getIcon(item.category)}
                                        </div>
                                        <span className="font-semibold text-gray-700">{item.category}</span>
                                    </div>
                                    {item.link && (
                                        <Tooltip title={`Start Regulation: ${item.regulation}`}>
                                            <a href="#" className="text-gray-400 hover:text-emerald-600">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Tooltip>
                                    )}
                                </div>

                                {/* Metrics */}
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        {item.metric}
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {item.achieved}{item.unit.replace('Compliance', '')}
                                        </span>
                                        <span className="text-xs text-gray-500 mb-1">
                                            / {item.target}{item.unit.replace('Compliance', '')} Target
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div>
                                    <Progress
                                        percent={(item.achieved / item.target) * 100}
                                        strokeColor={getStatusColor(item.achieved, item.target)}
                                        showInfo={false}
                                        size="small"
                                        strokeWidth={6}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-gray-500">
                                            {(item.achieved / item.target * 100).toFixed(0)}% Achieved
                                        </span>
                                        {(item.achieved < item.target) && (
                                            <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                Gap: {(item.target - item.achieved).toFixed(1)}{item.unit.replace('Compliance', '')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Sub-categories for Batteries specifically */}
                                {item.subCategories && (
                                    <div className="bg-gray-50 rounded-md p-2 space-y-1">
                                        {item.subCategories.map((sub, idx) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span className="text-gray-600">{sub.name}</span>
                                                <span className="font-medium text-gray-800">{sub.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Action for Batteries */}
                                {item.category === 'Batteries' && (
                                    <Button
                                        type="primary"
                                        ghost
                                        size="small"
                                        className="w-full mt-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                    >
                                        Buy EPR Credits
                                    </Button>
                                )}

                                {/* Certificates for Steel */}
                                {item.category === 'Steel' && (
                                    <div className="mt-1">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Certificates Purchased</span>
                                            <span className="font-medium text-gray-700">12,450</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Obligation (MT)</span>
                                            <span className="font-medium text-gray-700">15,000</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default EPRComplianceSection;
