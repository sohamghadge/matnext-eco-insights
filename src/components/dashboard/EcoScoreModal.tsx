import { Modal, Progress, Table, Tag, Divider } from 'antd';
import { Leaf, Info, CheckCircle, Target, TrendingUp, AlertCircle } from 'lucide-react';
import EcoScoreBadge from './EcoScoreBadge';

interface EcoScoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
    type: 'MSIL' | 'SUPPLIER' | 'RECYCLER' | 'RVSF';
}

const EcoScoreModal = ({ isOpen, onClose, score, type }: EcoScoreModalProps) => {
    const getModalContent = () => {
        switch (type) {
            case 'MSIL':
                return {
                    title: 'Corporate Sustainability Score',
                    definition: "An aggregated metric reflecting the overall environmental performance of MSIL's operations, supply chain integration, and material circularity.",
                    params: [
                        { param: 'Recycled Content Integration', weight: '40%', value: '8.5/10', status: 'Excellent', details: 'High adoption in new models' },
                        { param: 'Supplier Eco-Network Score', weight: '30%', value: '7.8/10', status: 'Good', details: '85% partners are compliant' },
                        { param: 'Process Efficiency', weight: '30%', value: '9.2/10', status: 'Excellent', details: 'Zero-waste to landfill achieved' },
                    ],
                    impact: "Directly influences MSIL's ESG rating and compliance with upcoming ELV regulations."
                };
            case 'SUPPLIER':
                return {
                    title: 'Supplier Sustainability Score',
                    definition: "A comprehensive evaluation of a supplier's environmental impact, focusing on carbon footprint reduction and green material adoption.",
                    params: [
                        { param: 'CO2 Reduction Performance', weight: '40%', value: '7.2/10', status: 'Good', details: 'Meeting annual reduction targets' },
                        { param: 'Green Material Usage', weight: '40%', value: '6.5/10', status: 'Average', details: 'Increasing recycled plastic use' },
                        { param: 'Logistics Efficiency', weight: '20%', value: '8.0/10', status: 'Good', details: 'Route optimization implemented' },
                    ],
                    impact: "Determines preferred supplier status and eligibility for green financing programs."
                };
            case 'RECYCLER':
                return {
                    title: 'Facility Efficiency Score',
                    definition: "An operational rating assessing a recycling facility's ability to recover high-quality materials with minimal energy consumption and waste.",
                    params: [
                        { param: 'Material Purity & Yield', weight: '50%', value: '8.8/10', status: 'Excellent', details: '98% purity in output material' },
                        { param: 'Energy Efficiency', weight: '30%', value: '7.5/10', status: 'Good', details: 'Solar integration in progress' },
                        { param: 'Safety & Compliance', weight: '20%', value: '9.0/10', status: 'Excellent', details: 'ISO 14001 Certified' },
                    ],
                    impact: "Higher scores lead to increased allocation of ELVs and better material pricing."
                };
            case 'RVSF':
                return {
                    title: 'RVSF Compliance Score',
                    definition: "A regulatory adherence score measuring the safe and eco-friendly deregistration and dismantling of End-of-Life Vehicles.",
                    params: [
                        { param: 'Regulatory Compliance', weight: '60%', value: '9.5/10', status: 'Excellent', details: 'Full adherence to CPCB norms' },
                        { param: 'Scrapping Volume vs Target', weight: '40%', value: '8.2/10', status: 'Good', details: 'Exceeded quarterly targets' },
                    ],
                    impact: "Critical for maintaining licensure and authorization to operate as a registered facility."
                };
            default:
                return { title: 'EcoScore', definition: '', params: [], impact: '' };
        }
    };

    const content = getModalContent();

    const columns = [
        { title: 'Parameter', dataIndex: 'param', key: 'param', render: (text: string) => <span className="font-medium">{text}</span> },
        { title: 'Weight', dataIndex: 'weight', key: 'weight' },
        { title: 'Current Score', dataIndex: 'value', key: 'value', render: (val: string) => <span className="font-bold">{val}</span> },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Excellent' ? 'green' : status === 'Good' ? 'blue' : status === 'Average' ? 'gold' : 'red'}>
                    {status}
                </Tag>
            )
        },
        { title: 'Details', dataIndex: 'details', key: 'details', className: 'text-xs text-muted-foreground' },
    ];

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
            title={
                <div className="flex items-center gap-2 text-xl font-bold text-emerald-900">
                    <Leaf className="w-5 h-5" />
                    {content.title}
                </div>
            }
            centered
        >
            <div className="space-y-6 py-4">
                {/* Header Section with Score Gauge */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-emerald-800">What is this score?</h4>
                                <p className="text-sm text-emerald-700 leading-relaxed">
                                    {content.definition}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-emerald-100 min-w-[150px]">
                        <Progress
                            type="dashboard"
                            percent={score * 10}
                            format={() => <span className="text-2xl font-bold text-emerald-700">{score.toFixed(1)}</span>}
                            strokeColor={score >= 9 ? '#10b981' : score >= 7 ? '#3b82f6' : score >= 5 ? '#eab308' : '#ef4444'}
                            size={120}
                            gapDegree={60}
                        />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-[-20px]">out of 10</span>
                    </div>
                </div>

                {/* Breakdown Table */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold">Calculation Breakdown</h4>
                    </div>
                    <Table
                        dataSource={content.params}
                        columns={columns}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey="param"
                    />
                </div>

                <Divider />

                {/* Scale Legend */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-semibold">Grading Scale</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                            <span className="block text-emerald-700 font-bold text-lg">9.0 - 10.0</span>
                            <span className="text-xs font-semibold text-emerald-600 uppercase">Excellent</span>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <span className="block text-blue-700 font-bold text-lg">7.0 - 8.9</span>
                            <span className="text-xs font-semibold text-blue-600 uppercase">Good</span>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                            <span className="block text-yellow-700 font-bold text-lg">5.0 - 6.9</span>
                            <span className="text-xs font-semibold text-yellow-600 uppercase">Average</span>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                            <span className="block text-red-700 font-bold text-lg">&lt; 5.0</span>
                            <span className="text-xs font-semibold text-red-600 uppercase">Poor</span>
                        </div>
                    </div>
                </div>

                {/* Impact Section */}
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-orange-800 text-sm">Why does this matter?</h4>
                        <p className="text-sm text-orange-700">{content.impact}</p>
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default EcoScoreModal;
