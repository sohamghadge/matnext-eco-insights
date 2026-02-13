import { Card, Table, Tag, Tooltip } from 'antd';
import { Info, HelpCircle, Euro, AlertCircle, Clock } from 'lucide-react';
import { CBAMItem } from '@/data/regulatoryData';

interface CBAMReadinessSectionProps {
    data: {
        status: 'Transitional' | 'Definitive';
        nextPhaseDate: Date;
        items: CBAMItem[];
    };
    isLoading: boolean;
}

const CBAMReadinessSection = ({ data, isLoading }: CBAMReadinessSectionProps) => {
    const columns = [
        {
            title: 'HS Code',
            dataIndex: 'hsCode',
            key: 'hsCode',
            render: (text: string, record: CBAMItem) => (
                <div>
                    <span className="font-mono font-bold text-gray-800">{text}</span>
                    <div className="text-xs text-gray-500">{record.description}</div>
                </div>
            ),
        },
        {
            title: 'Export Qty (EU)',
            dataIndex: 'exportQuantity',
            key: 'exportQuantity',
            render: (val: number) => <span className="font-medium">{val.toLocaleString()} T</span>,
        },
        {
            title: (
                <Tooltip title="Embedded Emissions in tCO2e per tonne of product">
                    <span className="flex items-center gap-1 cursor-help">
                        Specific Emissions <HelpCircle className="w-3 h-3" />
                    </span>
                </Tooltip>
            ),
            dataIndex: 'embeddedEmissions',
            key: 'embeddedEmissions',
            render: (val: number) => {
                let color = 'default';
                if (val < 1.8) color = 'success';
                else if (val > 2.2) color = 'error';
                else color = 'warning';

                return (
                    <Tag color={color} className="font-medium">
                        {val.toFixed(2)} tCO2e/t
                    </Tag>
                );
            },
        },
        {
            title: 'Carbon Price Paid (India)',
            dataIndex: 'carbonPricePaid',
            key: 'carbonPricePaid',
            render: (val: number) => (
                <span className="text-gray-600">€{val.toFixed(2)} /unit</span>
            ),
        },
        {
            title: (
                <Tooltip title="Projected cost obligation in 2026 based on €85/tonne carbon price">
                    <span className="flex items-center gap-1 cursor-help font-bold text-indigo-700">
                        Proj. CBAM Cost (2026) <Info className="w-3 h-3" />
                    </span>
                </Tooltip>
            ),
            key: 'projectedCost',
            render: (_: unknown, record: CBAMItem) => {
                // Calculation: (Emissions - Free Allowance) * Carbon Price (Mock €85)
                const taxableEmissions = Math.max(0, record.embeddedEmissions - record.freeAllowance);
                const projectedCost = taxableEmissions * 85 * record.exportQuantity;

                return (
                    <span className="font-bold text-indigo-700">
                        €{(projectedCost / 1000).toFixed(1)}k
                    </span>
                );
            },
        },
    ];

    return (
        <Card className="shadow-sm border-gray-200" bodyStyle={{ padding: '20px' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Euro className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-800">EU CBAM Readiness (Regulation 2023/956)</h3>
                            <Tooltip title="Carbon Border Adjustment Mechanism: Reporting obligation active. Financial levy begins Jan 2026.">
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Tag color="processing" className="m-0">
                                {data?.status} Phase
                            </Tag>
                            <span className="text-xs text-gray-500">Taxation Phase starts Jan 1, 2026</span>
                        </div>
                    </div>
                </div>

                {/* Countdown / Status Widget */}
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Values Valid Until</span>
                        <span className="text-sm font-bold text-gray-800">31-Mar-2026</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-600">Reporting Due: 15 Days</span>
                    </div>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={data?.items}
                pagination={false}
                loading={isLoading}
                rowKey="hsCode"
                size="middle"
                className="border border-gray-100 rounded-lg overflow-hidden"
            />

            <div className="mt-4 flex gap-2 items-start text-xs text-gray-500 bg-indigo-50/50 p-3 rounded-md border border-indigo-100">
                <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Compliance Note:</strong> Detailed quarterly reports must be submitted to the CBAM Transitional Registry.
                    Ensure "embedded emissions" calculations follow the EU methodology to avoid penalties.
                    Projected costs are estimates based on current carbon prices (€85/t).
                </p>
            </div>
        </Card>
    );
};

export default CBAMReadinessSection;
