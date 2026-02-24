import { Card, Row, Col, Typography, Tag, Progress, Statistic, Table, Button, Modal, Select, Space, Input, notification } from 'antd';
import { Car, CheckCircle, AlertTriangle, Calendar, ChevronRight, Info, ImageOff, Globe, Filter, Search, Recycle, Settings } from 'lucide-react';
import { RegulatoryData, ComplianceStat, Regulation, ModelComplianceData, PartComplianceData, EPRPartData } from '@/data/regulatoryData';
import { useState, useMemo } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface ComplianceOverviewProps {
    data: RegulatoryData;
}

const ComplianceOverview = ({ data }: ComplianceOverviewProps) => {
    const [selectedModel, setSelectedModel] = useState<ModelComplianceData | null>(null);
    const [partFilterMaterial, setPartFilterMaterial] = useState<string | null>(null);
    const [partFilterModel, setPartFilterModel] = useState<string | null>(null);

    // Fleet Stats Cards
    const renderStatCard = (stat: ComplianceStat) => {
        let color = 'text-gray-500';
        let bgColor = 'bg-gray-50';
        let Icon = Car;

        switch (stat.status) {
            case 'success':
                color = 'text-emerald-600';
                bgColor = 'bg-emerald-50';
                Icon = CheckCircle;
                break;
            case 'warning':
                color = 'text-amber-600';
                bgColor = 'bg-amber-50';
                Icon = AlertTriangle;
                break;
            case 'error':
                color = 'text-red-600';
                bgColor = 'bg-red-50';
                Icon = AlertTriangle;
                break;
            case 'neutral':
                if (stat.icon === 'calendar') Icon = Calendar;
                color = 'text-blue-600';
                bgColor = 'bg-blue-50';
                break;
        }

        // Custom rendering for "Active Models" to show split
        if (stat.label === 'Active Models') {
            // Calculate split based on data.models
            const domestic = data.models.filter(m => m.targetMarket === 'Domestic').length;
            const exports = data.models.filter(m => m.targetMarket === 'Export').length;

            return (
                <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-start justify-between">
                        <div>
                            <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">{stat.label}</Text>
                            <div className={`text-2xl font-bold mt-1 ${color}`}>{stat.value}</div>
                            <div className="flex gap-3 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase">Domestic</span>
                                    <span className="text-sm font-semibold text-gray-700">{domestic}</span>
                                </div>
                                <div className="w-px bg-gray-200 h-8 self-center"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase">Export</span>
                                    <span className="text-sm font-semibold text-gray-700">{exports}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`p-2 rounded-lg ${bgColor}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                    </div>
                </Card>
            );
        }

        return (
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">{stat.label}</Text>
                        <div className={`text-2xl font-bold mt-1 ${color}`}>{stat.value}</div>
                        {stat.subValue && <Text type="secondary" className="text-xs mt-1 block">{stat.subValue}</Text>}
                    </div>
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
            </Card>
        );
    };

    // Regulations Table Columns
    const regulationColumns = [
        {
            title: 'Regulation',
            key: 'regulation',
            width: 280,
            render: (_: any, record: Regulation) => (
                <div>
                    <div className="font-semibold text-gray-800 text-xs">{record.formalName}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{record.description}</div>
                </div>
            ),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 80,
            render: (text: string) => <Tag color={text === 'EU' ? 'blue' : 'green'}>{text}</Tag>
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            width: 140,
            render: (text: string) => <span className="text-xs font-medium">{text}</span>
        },
        {
            title: 'Impact',
            dataIndex: 'impact',
            key: 'impact',
            width: 80,
            render: (impact: string) => (
                <Tag color={impact === 'High' ? 'red' : impact === 'Medium' ? 'orange' : 'blue'}>{impact}</Tag>
            ),
        },
        {
            title: 'Quantitative Target',
            dataIndex: 'quantitativeTarget',
            key: 'quantitativeTarget',
            width: 200,
            render: (text: string) => <span className="text-xs text-gray-700 font-medium">{text || '-'}</span>
        },
        {
            title: 'Achieved',
            dataIndex: 'quantitativeAchieved',
            key: 'quantitativeAchieved',
            width: 160,
            render: (text: string, record: Regulation) => (
                <span className={`text-xs font-semibold ${record.status === 'Compliant' ? 'text-emerald-600' : record.status === 'Non-Compliant' ? 'text-red-600' : 'text-amber-600'}`}>
                    {text || '-'}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                let color = 'default';
                if (status === 'Compliant') color = 'success';
                if (status === 'Non-Compliant') color = 'error';
                if (status === 'In Progress') color = 'processing';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    // Vehicle Compliance Table Columns (CBAM)
    const modelColumns = [
        {
            title: 'Model',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            fixed: 'left' as const,
            render: (text: string, record: ModelComplianceData) => (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-7 rounded shadow-sm bg-gray-100 overflow-hidden">
                        <img src={record.image} alt={text} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-700 text-xs">{text}</div>
                        <Tag className="text-[10px] m-0">{record.type}</Tag>
                    </div>
                </div>
            ),
        },
        {
            title: 'Total Parts',
            dataIndex: 'partCountTotal',
            key: 'partCountTotal',
            width: 80,
            render: (val: number) => <span className="font-semibold">{val}</span>
        },
        {
            title: 'Steel/Iron Parts',
            key: 'steelParts',
            width: 120,
            render: (_: any, record: ModelComplianceData) => (
                <div className="text-xs">
                    <Tag color="default">{record.compliantPartCountSteel}/{record.partCountSteel}</Tag>
                </div>
            )
        },
        {
            title: 'Al Parts',
            key: 'alParts',
            width: 100,
            render: (_: any, record: ModelComplianceData) => (
                <div className="text-xs">
                    <Tag color="default">{record.compliantPartCountAl}/{record.partCountAl}</Tag>
                </div>
            )
        },
        {
            title: 'Exp. Count',
            dataIndex: 'exportVehicleCount',
            key: 'exportVehicleCount',
            width: 90,
            render: (val: number) => <span className="font-semibold text-xs">{val?.toLocaleString()}</span>
        },
        {
            title: 'Volume Ratio (Steel)',
            key: 'volSteel',
            width: 140,
            render: (_: any, record: ModelComplianceData) => {
                const pct = (record.volumePartCompliantSteel / record.volumePartCountSteel * 100);
                return (
                    <div className="text-xs">
                        <div>{(record.volumePartCompliantSteel / 1000).toFixed(0)}k / {(record.volumePartCountSteel / 1000).toFixed(0)}k</div>
                        <Progress percent={pct} size="small" showInfo={false} strokeColor={pct >= 90 ? '#10b981' : '#f59e0b'} />
                    </div>
                );
            }
        },
        {
            title: 'Volume Ratio (Al)',
            key: 'volAl',
            width: 130,
            render: (_: any, record: ModelComplianceData) => {
                const pct = (record.volumePartCompliantAl / record.volumePartCountAl * 100);
                return (
                    <div className="text-xs">
                        <div>{(record.volumePartCompliantAl / 1000).toFixed(0)}k / {(record.volumePartCountAl / 1000).toFixed(0)}k</div>
                        <Progress percent={pct} size="small" showInfo={false} strokeColor={pct >= 90 ? '#10b981' : '#f59e0b'} />
                    </div>
                );
            }
        },
        {
            title: 'CBAM Readiness',
            dataIndex: 'cbamReadiness',
            key: 'cbamReadiness',
            width: 100,
            render: (val: number) => (
                <div className="w-16">
                    <Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} />
                    <div className="text-xs text-right mt-0.5">{val}%</div>
                </div>
            )
        },
        {
            title: 'Calculation',
            dataIndex: 'cbamCalculation',
            key: 'cbamCalculation',
            width: 120,
            render: (text: string) => <Tag color="blue" className="text-[10px]">{text}</Tag>
        },
        {
            title: 'CBAM Amount',
            dataIndex: 'cbamAmount',
            key: 'cbamAmount',
            width: 100,
            render: (val: number) => <span className="font-mono text-xs text-gray-700">€{val?.toLocaleString()}</span>
        },
        {
            title: 'Reduction (Data)',
            dataIndex: 'reductionDataMgmt',
            key: 'reductionDataMgmt',
            width: 100,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span>
        },
        {
            title: 'Reduction (Sust.)',
            dataIndex: 'reductionSustainable',
            key: 'reductionSustainable',
            width: 100,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span>
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right' as const,
            render: (_: any, record: ModelComplianceData) => (
                <Button size="small" type="link" onClick={() => setSelectedModel(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    // Part Wise Compliance Logic
    const filteredParts = useMemo(() => {
        return data.parts.filter(part => {
            const matchesMaterial = partFilterMaterial ? part.material === partFilterMaterial : true;
            const matchesModel = partFilterModel ? part.modelIds.includes(partFilterModel) : true;
            return matchesMaterial && matchesModel;
        });
    }, [data.parts, partFilterMaterial, partFilterModel]);
    const [cbamModelFilter, setCbamModelFilter] = useState<string>('All');

    // --- EPR Recovery Logic ---
    const [eprRecoveryMaterialFilter, setEprRecoveryMaterialFilter] = useState<string>('All');
    const [eprRecoveryModelFilter, setEprRecoveryModelFilter] = useState<string>('All');

    const filteredEprRecoveryParts = useMemo(() => {
        return data.eprRecoveryParts.filter(part => {
            const matchesMaterial = eprRecoveryMaterialFilter === 'All' || part.material === eprRecoveryMaterialFilter;
            const matchesModel = eprRecoveryModelFilter === 'All' || part.modelIds.includes(eprRecoveryModelFilter);
            return matchesMaterial && matchesModel;
        });
    }, [eprRecoveryMaterialFilter, eprRecoveryModelFilter, data.eprRecoveryParts]);

    const eprRecoveryStats = useMemo(() => {
        const total = filteredEprRecoveryParts.length;
        const compliant = filteredEprRecoveryParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredEprRecoveryParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredEprRecoveryParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredEprRecoveryParts]);


    // --- EPR Recycling Logic ---
    const [eprRecyclingMaterialFilter, setEprRecyclingMaterialFilter] = useState<string>('All');
    const [eprRecyclingModelFilter, setEprRecyclingModelFilter] = useState<string>('All');

    const filteredEprRecyclingParts = useMemo(() => {
        return data.eprRecyclingParts.filter(part => {
            const matchesMaterial = eprRecyclingMaterialFilter === 'All' || part.material === eprRecyclingMaterialFilter;
            const matchesModel = eprRecyclingModelFilter === 'All' || part.modelIds.includes(eprRecyclingModelFilter);
            return matchesMaterial && matchesModel;
        });
    }, [eprRecyclingMaterialFilter, eprRecyclingModelFilter, data.eprRecyclingParts]);

    const eprRecyclingStats = useMemo(() => {
        const total = filteredEprRecyclingParts.length;
        const compliant = filteredEprRecyclingParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredEprRecyclingParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredEprRecyclingParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredEprRecyclingParts]);

    // Common Render for EPR Parts
    const eprPartColumns = (type: 'Recovery' | 'Recycling') => [
        {
            title: 'Part Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (text: string) => <span className="font-medium text-gray-700 text-xs">{text}</span>
        },
        {
            title: 'Part ID',
            dataIndex: 'partId',
            key: 'partId',
            width: 100,
            render: (text: string) => <span className="font-mono text-[11px] text-gray-500">{text || 'N/A'}</span>
        },
        {
            title: 'Material / Grade',
            key: 'material',
            width: 130,
            render: (_: any, record: EPRPartData) => (
                <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-xs">{record.material}</span>
                    <span className="text-[10px] text-gray-500">{record.grade}</span>
                </div>
            )
        },
        {
            title: type === 'Recovery' ? 'Recovery Rate' : 'Recycling Rate',
            dataIndex: 'rate',
            key: 'rate',
            width: 120,
            render: (val: number, record: EPRPartData) => (
                <div>
                    <div className="font-semibold text-gray-800 text-xs">{val}%</div>
                    <div className="text-[10px] text-gray-500">
                        Target: <span className="font-medium">{record.benchmark}%</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Exp. Qty',
            dataIndex: 'exportQty',
            key: 'exportQty',
            width: 80,
            render: (val: number) => <span className="text-gray-700 text-xs">{val?.toLocaleString() || '-'}</span>
        },
        {
            title: 'Readiness',
            dataIndex: 'cbamReadiness',
            key: 'cbamReadiness',
            width: 90,
            render: (val: number) => (
                <div className="w-16">
                    <Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} />
                    <div className="text-[10px] text-right mt-0.5">{val ?? '-'}%</div>
                </div>
            )
        },
        {
            title: 'Calculation',
            dataIndex: 'cbamCalculation',
            key: 'cbamCalculation',
            width: 110,
            render: (text: string) => <Tag color="blue" className="text-[10px]">{text || '-'}</Tag>
        },
        {
            title: 'Amount',
            dataIndex: 'cbamAmount',
            key: 'cbamAmount',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-gray-700">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Red. (Data)',
            dataIndex: 'reductionDataMgmt',
            key: 'reductionDataMgmt',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Red. (Sust.)',
            dataIndex: 'reductionSustainable',
            key: 'reductionSustainable',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Action',
            key: 'action',
            width: 90,
            render: (_: any, record: EPRPartData) => (
                <Button type="text" size="small" className="text-blue-600" onClick={() => {
                    Modal.confirm({
                        title: 'Raise Issue Ticket',
                        content: (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Create an Issue Management ticket for <strong>{record.name}</strong> ({record.partId})?</p>
                                <p className="mt-1 text-xs text-gray-500">Material: {record.material} | Rate: {record.rate}% (Target: {record.benchmark}%)</p>
                            </div>
                        ),
                        okText: 'Create Ticket',
                        okButtonProps: { className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' },
                        onOk: () => { notification.success({ message: 'Issue Ticket Created', description: `Ticket raised for ${record.name} (${record.partId}).`, placement: 'topRight' }); },
                    });
                }}>
                    Raise Issue
                </Button>
            )
        }
    ];

    const cbamStats = useMemo(() => {
        const total = filteredParts.length;
        const compliant = filteredParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredParts]);

    const partStats = useMemo(() => {
        const total = filteredParts.length;
        const compliant = filteredParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredParts]);

    const partColumns = [
        {
            title: 'Part Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (text: string, record: PartComplianceData) => (
                <div>
                    <div className="font-medium text-gray-800 text-xs">{text}</div>
                    <div className="text-[10px] text-gray-500">{record.supplier}</div>
                </div>
            ),
        },
        {
            title: 'Part No.',
            dataIndex: 'partId',
            key: 'partId',
            width: 100,
            render: (text: string) => <span className="font-mono text-[11px] text-gray-500">{text || 'N/A'}</span>
        },
        {
            title: 'Total Count',
            dataIndex: 'exportQty',
            key: 'exportQty',
            width: 90,
            render: (val: number) => <span className="text-gray-700 text-xs font-semibold">{val?.toLocaleString() || '-'}</span>
        },
        {
            title: 'Material / Grade',
            key: 'material',
            width: 130,
            render: (_: any, record: PartComplianceData) => (
                <div>
                    <Tag className="mr-0 mb-1 text-[10px]">{record.material}</Tag>
                    <div className="text-[10px] text-gray-500">{record.grade}</div>
                </div>
            )
        },
        {
            title: 'CBAM Readiness',
            dataIndex: 'cbamReadiness',
            key: 'cbamReadiness',
            width: 100,
            render: (val: number) => {
                if (val === undefined) return <span className="text-gray-400">-</span>;
                return (
                    <div className="w-16">
                        <Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} />
                        <div className="text-[10px] text-right mt-0.5">{val}%</div>
                    </div>
                );
            }
        },
        {
            title: 'Calculation',
            dataIndex: 'cbamCalculation',
            key: 'cbamCalculation',
            width: 110,
            render: (val: string) => val ? <Tag color="blue" className="text-[10px]">{val}</Tag> : <span className="text-gray-400">-</span>
        },
        {
            title: 'CBAM Amount',
            dataIndex: 'cbamAmount',
            key: 'cbamAmount',
            width: 100,
            render: (val: number) => val ? <span className="font-mono text-xs">€{val.toLocaleString()}</span> : <span className="text-gray-400">-</span>
        },
        {
            title: 'Red. (Data)',
            dataIndex: 'reductionDataMgmt',
            key: 'reductionDataMgmt',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Red. (Sust.)',
            dataIndex: 'reductionSustainable',
            key: 'reductionSustainable',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Action',
            key: 'action',
            width: 90,
            render: (_: any, record: PartComplianceData) => (
                <Button type="text" size="small" className="text-blue-600" onClick={() => {
                    Modal.confirm({
                        title: 'Raise Issue Ticket',
                        content: (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Create an Issue Management ticket for <strong>{record.name}</strong> ({record.partId})?</p>
                                <p className="mt-1 text-xs text-gray-500">Material: {record.material} | Grade: {record.grade}</p>
                            </div>
                        ),
                        okText: 'Create Ticket',
                        okButtonProps: { className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' },
                        onOk: () => { notification.success({ message: 'Issue Ticket Created', description: `Ticket raised for ${record.name} (${record.partId}).`, placement: 'topRight' }); },
                    });
                }}>
                    Raise Issue
                </Button>
            )
        }
    ];


    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* 1. Fleet Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map((stat, idx) => (
                    <div key={idx}>{renderStatCard(stat)}</div>
                ))}
            </div>

            <Row gutter={[24, 24]}>
                {/* 2. Regulatory Landscape */}
                <Col xs={24} lg={24}>
                    <Card title="Regulatory Landscape" className="shadow-sm border-gray-200" headStyle={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Table
                            dataSource={data.regulations}
                            columns={regulationColumns}
                            pagination={false}
                            size="small"
                            rowKey="id"
                        />
                    </Card>
                </Col>
            </Row>

            {/* 3. CBAM Context & Education */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-900 mb-3">EU Carbon Border Adjustment Mechanism (CBAM)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                                <h4 className="text-sm font-bold text-purple-800 mb-2">Phase 1 — Transitional (Oct 2023 – Dec 2025)</h4>
                                <p className="text-xs text-purple-700 leading-relaxed">
                                    Reporting-only phase. EU importers must report embedded emissions quarterly for covered goods: <strong>Cement, Iron & Steel, Aluminium, Fertilisers, Electricity, Hydrogen</strong>. No financial obligations yet.
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                                <h4 className="text-sm font-bold text-purple-800 mb-2">Phase 2 — Financial (Jan 2026 – Dec 2027)</h4>
                                <p className="text-xs text-purple-700 leading-relaxed">
                                    EU importers must purchase <strong>CBAM certificates</strong> based on embedded emissions exceeding EU ETS benchmarks. Free allowances phase out gradually. Applies to raw materials and basic processed goods.
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                            <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Jan 2028 Onwards — Automotive Components
                            </h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                CBAM scope extends to <strong>downstream products including automotive components</strong> containing CBAM-covered materials (Steel, Aluminium, Iron). OEMs exporting vehicles with these parts to the EU must ensure complete emissions data traceability. By translation, <strong>any OEM using these parts in EU-bound vehicles becomes liable</strong> for CBAM certificate costs.
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                            <h4 className="text-sm font-bold text-purple-800 mb-2">Quantitative Targets (EU Benchmarks)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">≤ 1.9</div>
                                    <div className="text-[10px] text-purple-600">tCO2e/t — Steel</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">≤ 4.2</div>
                                    <div className="text-[10px] text-purple-600">tCO2e/t — Aluminium</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">≤ 1.5</div>
                                    <div className="text-[10px] text-purple-600">tCO2e/t — Iron</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">€93</div>
                                    <div className="text-[10px] text-purple-600">avg/tCO2e — ETS Price</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <Tag color="purple" className="px-3 py-1 text-sm">Current Phase: Transitional</Tag>
                            <Tag color="orange" className="px-3 py-1 text-sm">Financial Phase: Jan 2026</Tag>
                            <Tag color="red" className="px-3 py-1 text-sm">Auto Components: Jan 2028</Tag>
                        </div>
                    </div>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* 4. Vehicle Wise CBAM Compliance */}
                <Col xs={24} lg={24}>
                    <Card
                        title={<div className="flex items-center gap-2"><Car className="w-4 h-4" /> Vehicle Wise CBAM Compliance</div>}
                        className="shadow-sm border-gray-200"
                        headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                    >
                        {/* Vehicle Mini Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-semibold">Total Models</div>
                                <div className="text-xl font-bold text-gray-800">{data.models.length}</div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                <div className="text-xl font-bold text-emerald-700">{data.models.filter(m => m.cbamReadiness >= 90).length}</div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="text-xs text-amber-600 uppercase font-semibold">At Risk</div>
                                <div className="text-xl font-bold text-amber-700">{data.models.filter(m => m.cbamReadiness < 90).length}</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded border border-purple-100">
                                <div className="text-xs text-purple-600 uppercase font-semibold">Total CBAM Liability</div>
                                <div className="text-xl font-bold text-purple-700">€{data.models.reduce((s, m) => s + m.cbamAmount, 0).toLocaleString()}</div>
                            </div>
                        </div>
                        <Table
                            dataSource={data.models}
                            columns={modelColumns}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            scroll={{ x: 1800 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 5. Part Wise CBAM Compliance */}
            <Card
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pr-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Part Wise CBAM Compliance
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                placeholder="Filter by Material"
                                allowClear
                                style={{ width: 160 }}
                                onChange={(val) => setPartFilterMaterial(val || 'All')}
                            >
                                <Option value="All">All Materials</Option>
                                <Option value="Steel">Steel</Option>
                                <Option value="Aluminum">Aluminum</Option>
                                <Option value="Cast Iron">Cast Iron</Option>
                                <Option value="Plastic">Plastic</Option>
                            </Select>
                            <Select
                                placeholder="Filter by Model"
                                allowClear
                                style={{ width: 160 }}
                                onChange={(val) => setPartFilterModel(val || 'All')}
                            >
                                <Option value="All">All Models</Option>
                                <Option value="evitara">eVitara</Option>
                                <Option value="fronx">Fronx</Option>
                                <Option value="baleno">Baleno</Option>
                            </Select>
                        </div>
                    </div>
                }
                className="shadow-sm border-gray-200"
                headStyle={{ borderBottom: '1px solid #f0f0f0' }}
            >
                {/* Summary Stats for Parts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                        <div className="text-xs text-gray-500 uppercase font-semibold">Total Parts</div>
                        <div className="text-xl font-bold text-gray-800">{partStats.total}</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                        <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                        <div className="text-xl font-bold text-emerald-700">{partStats.compliant}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-100">
                        <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                        <div className="text-xl font-bold text-red-700">{partStats.nonCompliant}</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-100">
                        <div className="text-xs text-amber-600 uppercase font-semibold">Warnings</div>
                        <div className="text-xl font-bold text-amber-700">{partStats.warning}</div>
                    </div>
                </div>

                <Table
                    dataSource={filteredParts}
                    columns={partColumns}
                    pagination={{ pageSize: 8 }}
                    size="small"
                    rowKey="id"
                />
            </Card>

            {/* --- SECTION 3: EPR (RECOVERY) COMPLIANCE --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Recycle className="w-6 h-6 text-blue-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">EPR (Recovery) Compliance</h3>
                </div>

                {/* 3.1 Recovery Context */}
                <Card className="bg-blue-50 border-blue-100 shadow-sm rounded-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-3">
                                <Info className="w-5 h-5" /> EPR Recovery — Energy Recovery + Recycling
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Recoverability</strong> refers to the potential to recover energy from waste (incineration with energy recovery) PLUS material recycling. Under ELV Directive & AIS-129, vehicles must achieve a minimum <strong>95% Recoverability Rate</strong> by weight.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-800 mb-1">ELV Steel Recovery (EPR)</h5>
                                    <p className="text-[11px] text-blue-700">8% (2025-30) → 13% (2030-35) → 18% (2035+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-800 mb-1">Battery Waste Collection</h5>
                                    <p className="text-[11px] text-blue-700">Lead Acid: 90% (2026+) | Li-Ion: 70% (2029+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-800 mb-1">Plastic Waste Collection</h5>
                                    <p className="text-[11px] text-blue-700">Cat I: 80% (2027+) | Cat II/III: 60% (2027+)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3.2 Vehicle Wise Recovery */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-600" /> Vehicle Wise Recovery Status
                        </h4>
                    </div>

                    {/* Vehicle Mini Cards */}
                    {(() => {
                        const legacyModels = data.models.filter(m => m.generation === 'Legacy');
                        return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Models</div>
                                    <div className="text-xl font-bold text-gray-800">{legacyModels.length}</div>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                    <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                    <div className="text-xl font-bold text-emerald-700">{legacyModels.filter(m => m.eprRecovery?.status === 'Compliant').length}</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                    <div className="text-xs text-amber-600 uppercase font-semibold">Warning</div>
                                    <div className="text-xl font-bold text-amber-700">{legacyModels.filter(m => m.eprRecovery?.status === 'Warning').length}</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded border border-red-100">
                                    <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                    <div className="text-xl font-bold text-red-700">{legacyModels.filter(m => m.eprRecovery?.status === 'Non-Compliant').length}</div>
                                </div>
                            </div>
                        );
                    })()}

                    <Table
                        dataSource={data.models.filter(m => m.generation === 'Legacy')}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 1600 }}
                        columns={[
                            {
                                title: 'Model',
                                dataIndex: 'name',
                                key: 'name',
                                width: 200,
                                fixed: 'left' as const,
                                render: (text: string, record: ModelComplianceData) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-7 rounded shadow-sm bg-gray-100 overflow-hidden">
                                            <img src={record.image} alt={text} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-700 text-xs">{text}</div>
                                            <Tag className="text-[10px] m-0">{record.type}</Tag>
                                        </div>
                                    </div>
                                ),
                            },
                            { title: 'Total Parts', dataIndex: 'partCountTotal', key: 'partCountTotal', width: 80, render: (val: number) => <span className="font-semibold">{val}</span> },
                            { title: 'Steel/Iron', key: 'steelParts', width: 100, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountSteel}/{r.partCountSteel}</Tag> },
                            { title: 'Al Parts', key: 'alParts', width: 90, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountAl}/{r.partCountAl}</Tag> },
                            {
                                title: 'Recovery Rate',
                                key: 'recoveryRate',
                                width: 120,
                                render: (_: any, record: ModelComplianceData) => (
                                    <div>
                                        <div className="font-bold text-xs">{record.eprRecovery?.actual ?? '-'}%</div>
                                        <div className="text-[10px] text-gray-500">Target: {record.eprRecovery?.target ?? '-'}%</div>
                                    </div>
                                )
                            },
                            { title: 'Exp. Count', dataIndex: 'exportVehicleCount', key: 'exportVehicleCount', width: 90, render: (val: number) => <span className="font-semibold text-xs">{val?.toLocaleString()}</span> },
                            { title: 'CBAM Readiness', dataIndex: 'cbamReadiness', key: 'cbamReadiness', width: 100, render: (val: number) => (<div className="w-16"><Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} /><div className="text-[10px] text-right mt-0.5">{val}%</div></div>) },
                            { title: 'Calculation', dataIndex: 'cbamCalculation', key: 'cbamCalculation', width: 110, render: (text: string) => <Tag color="blue" className="text-[10px]">{text}</Tag> },
                            { title: 'Amount', dataIndex: 'cbamAmount', key: 'cbamAmount', width: 100, render: (val: number) => <span className="font-mono text-xs text-gray-700">€{val?.toLocaleString()}</span> },
                            { title: 'Red. (Data)', dataIndex: 'reductionDataMgmt', key: 'reductionDataMgmt', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                            { title: 'Red. (Sust.)', dataIndex: 'reductionSustainable', key: 'reductionSustainable', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                        ]}
                    />
                </div>

                {/* 3.3 Part Wise Recovery */}
                <div>
                    <div className="flex items-center justify-between mb-4 mt-8">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600" /> Part Wise Recoverability
                        </h4>
                    </div>

                    {/* Filters & Stats */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <Select
                                placeholder="Filter by Material"
                                allowClear
                                value={eprRecoveryMaterialFilter}
                                onChange={(val) => setEprRecoveryMaterialFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="Steel">Steel</Option>
                                <Option value="Aluminum">Aluminum</Option>
                                <Option value="Cast Iron">Cast Iron</Option>
                                <Option value="Plastic">Plastic</Option>
                            </Select>
                            <Select
                                placeholder="Filter by Model"
                                allowClear
                                value={eprRecoveryModelFilter}
                                onChange={(val) => setEprRecoveryModelFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="All">All Models</Option>
                                <Option value="alto">Alto K10</Option>
                                <Option value="wagonr">Wagon R</Option>
                                <Option value="swift">Swift</Option>
                                <Option value="swiftdzire">Swift Dzire</Option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-semibold">Total Parts</div>
                                <div className="text-xl font-bold text-gray-800">{eprRecoveryStats.total}</div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                <div className="text-xl font-bold text-emerald-700">{eprRecoveryStats.compliant}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded border border-red-100">
                                <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                <div className="text-xl font-bold text-red-700">{eprRecoveryStats.nonCompliant}</div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="text-xs text-amber-600 uppercase font-semibold">Warnings</div>
                                <div className="text-xl font-bold text-amber-700">{eprRecoveryStats.warning}</div>
                            </div>
                        </div>
                    </div>

                    <Table
                        dataSource={filteredEprRecoveryParts}
                        rowKey="id"
                        columns={eprPartColumns('Recovery')}
                        pagination={{ pageSize: 8 }}
                        size="small"
                        scroll={{ x: 1400 }}
                    />
                </div>
            </div>

            {/* --- SECTION 4: EPR (RECYCLING) COMPLIANCE --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Recycle className="w-6 h-6 text-green-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">EPR (Recycling) Compliance</h3>
                </div>

                {/* 4.1 Recycling Context */}
                <Card className="bg-green-50 border-green-100 shadow-sm rounded-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-green-900 font-bold text-lg mb-3">
                                <Info className="w-5 h-5" /> EPR Recycling — Recycled Content Mandates
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Recyclability</strong> refers strictly to reprocessing waste into new products/materials (excluding energy recovery). The mandate requires a minimum <strong>85% Recyclability Rate</strong> by weight. Additionally, recycled content targets apply to new vehicle manufacturing.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">ELV Steel Recycled Content</h5>
                                    <p className="text-[11px] text-green-700">5% (2027-28) → 10% → 15% → 20% (2030+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">Battery Recycled Content</h5>
                                    <p className="text-[11px] text-green-700">5% (2027-28) → 10% → 15% → 20% (2030+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">Plastic Recycled Content</h5>
                                    <p className="text-[11px] text-green-700">India: Upcoming | EU: 20% (15% from ELV) by 2030</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">EU Plastic (ELV Reg.)</h5>
                                    <p className="text-[11px] text-green-700">20% total, 15% from ELV sources by 2030</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 4.2 Vehicle Wise Recycling */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-600" /> Vehicle Wise Recycling Status
                        </h4>
                    </div>

                    {/* Vehicle Mini Cards */}
                    {(() => {
                        const newModels = data.models.filter(m => m.generation === 'New');
                        return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Models</div>
                                    <div className="text-xl font-bold text-gray-800">{newModels.length}</div>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                    <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                    <div className="text-xl font-bold text-emerald-700">{newModels.filter(m => m.eprRecycling?.status === 'Compliant').length}</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                    <div className="text-xs text-amber-600 uppercase font-semibold">Warning</div>
                                    <div className="text-xl font-bold text-amber-700">{newModels.filter(m => m.eprRecycling?.status === 'Warning').length}</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded border border-red-100">
                                    <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                    <div className="text-xl font-bold text-red-700">{newModels.filter(m => m.eprRecycling?.status === 'Non-Compliant').length}</div>
                                </div>
                            </div>
                        );
                    })()}

                    <Table
                        dataSource={data.models.filter(m => m.generation === 'New')}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 1600 }}
                        columns={[
                            {
                                title: 'Model',
                                dataIndex: 'name',
                                key: 'name',
                                width: 200,
                                fixed: 'left' as const,
                                render: (text: string, record: ModelComplianceData) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-7 rounded shadow-sm bg-gray-100 overflow-hidden">
                                            <img src={record.image} alt={text} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-700 text-xs">{text}</div>
                                            <Tag className="text-[10px] m-0">{record.type}</Tag>
                                        </div>
                                    </div>
                                ),
                            },
                            { title: 'Total Parts', dataIndex: 'partCountTotal', key: 'partCountTotal', width: 80, render: (val: number) => <span className="font-semibold">{val}</span> },
                            { title: 'Steel/Iron', key: 'steelParts', width: 100, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountSteel}/{r.partCountSteel}</Tag> },
                            { title: 'Al Parts', key: 'alParts', width: 90, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountAl}/{r.partCountAl}</Tag> },
                            {
                                title: 'Recycling Rate',
                                key: 'recyclingRate',
                                width: 120,
                                render: (_: any, record: ModelComplianceData) => (
                                    <div>
                                        <div className="font-bold text-xs">{record.eprRecycling?.actual ?? '-'}%</div>
                                        <div className="text-[10px] text-gray-500">Target: {record.eprRecycling?.target ?? '-'}%</div>
                                    </div>
                                )
                            },
                            { title: 'Exp. Count', dataIndex: 'exportVehicleCount', key: 'exportVehicleCount', width: 90, render: (val: number) => <span className="font-semibold text-xs">{val?.toLocaleString()}</span> },
                            { title: 'CBAM Readiness', dataIndex: 'cbamReadiness', key: 'cbamReadiness', width: 100, render: (val: number) => (<div className="w-16"><Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} /><div className="text-[10px] text-right mt-0.5">{val}%</div></div>) },
                            { title: 'Calculation', dataIndex: 'cbamCalculation', key: 'cbamCalculation', width: 110, render: (text: string) => <Tag color="blue" className="text-[10px]">{text}</Tag> },
                            { title: 'Amount', dataIndex: 'cbamAmount', key: 'cbamAmount', width: 100, render: (val: number) => <span className="font-mono text-xs text-gray-700">€{val?.toLocaleString()}</span> },
                            { title: 'Red. (Data)', dataIndex: 'reductionDataMgmt', key: 'reductionDataMgmt', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                            { title: 'Red. (Sust.)', dataIndex: 'reductionSustainable', key: 'reductionSustainable', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                        ]}
                    />
                </div>

                {/* 4.3 Part Wise Recycling */}
                <div>
                    <div className="flex items-center justify-between mb-4 mt-8">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600" /> Part Wise Recyclability
                        </h4>
                    </div>

                    {/* Filters & Stats */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <Select
                                placeholder="Filter by Material"
                                allowClear
                                value={eprRecyclingMaterialFilter}
                                onChange={(val) => setEprRecyclingMaterialFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="Steel">Steel</Option>
                                <Option value="Aluminum">Aluminum</Option>
                                <Option value="Cast Iron">Cast Iron</Option>
                                <Option value="Plastic">Plastic</Option>
                            </Select>
                            <Select
                                placeholder="Filter by Model"
                                allowClear
                                value={eprRecyclingModelFilter}
                                onChange={(val) => setEprRecyclingModelFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="All">All Models</Option>
                                <Option value="evitara">eVitara</Option>
                                <Option value="fronx">Fronx</Option>
                                <Option value="baleno">Baleno</Option>
                                <Option value="xl6">XL6</Option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-semibold">Total Parts</div>
                                <div className="text-xl font-bold text-gray-800">{eprRecyclingStats.total}</div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                <div className="text-xl font-bold text-emerald-700">{eprRecyclingStats.compliant}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded border border-red-100">
                                <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                <div className="text-xl font-bold text-red-700">{eprRecyclingStats.nonCompliant}</div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="text-xs text-amber-600 uppercase font-semibold">Warnings</div>
                                <div className="text-xl font-bold text-amber-700">{eprRecyclingStats.warning}</div>
                            </div>
                        </div>
                    </div>

                    <Table
                        dataSource={filteredEprRecyclingParts}
                        rowKey="id"
                        columns={eprPartColumns('Recycling')}
                        pagination={{ pageSize: 8 }}
                        size="small"
                        scroll={{ x: 1400 }}
                    />
                </div>
            </div>
            {/* Modal for detailed vehicle view */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-gray-700" />
                        <span className="text-lg font-semibold">{selectedModel?.name} - Export & CBAM Compliance</span>
                    </div>
                }
                open={!!selectedModel}
                onCancel={() => setSelectedModel(null)}
                footer={null}
                width={800}
                className="top-8"
            >
                {selectedModel && selectedModel.exportData && (
                    <div className="space-y-6 pt-2">
                        {/* 1. CBAM Context Header */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                                <Globe className="w-4 h-4" /> EU Carbon Border Adjustment Mechanism (CBAM)
                            </h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                The EU CBAM imposes a carbon price on imports of carbon-intensive products like <strong>Steel, Aluminum, and Iron</strong> used in vehicle manufacturing.
                                From 2026, importers must surrender CBAM certificates corresponding to embedded emissions. Non-compliant vehicles face penalties and export bans.
                            </p>
                        </div>

                        {/* 2. Export Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card size="small" className="bg-slate-50 border-slate-200 shadow-sm">
                                <Statistic
                                    title={<span className="text-gray-600 font-medium">Total Scheduled Exports (EU)</span>}
                                    value={selectedModel.exportData.totalExportUnits}
                                    suffix="units"
                                    valueStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                                />
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Compliance Rate</span>
                                        <span className={selectedModel.exportData.compliantPercentage >= 90 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                                            {selectedModel.exportData.compliantPercentage}%
                                        </span>
                                    </div>
                                    <Progress
                                        percent={selectedModel.exportData.compliantPercentage}
                                        strokeColor={selectedModel.exportData.compliantPercentage >= 90 ? '#10b981' : '#f59e0b'}
                                        showInfo={false}
                                        size="small"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        <strong>{selectedModel.exportData.cbamCompliantUnits.toLocaleString()}</strong> units are cleared for export.
                                    </p>
                                </div>
                            </Card>

                            <Card size="small" className="bg-white border-slate-200 shadow-sm">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Vehicle Carbon Intensity</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-gray-800">{selectedModel.type === 'EV' ? '14.2' : '28.5'}</span>
                                            <span className="text-xs text-gray-500 mb-1">tCO2e / vehicle</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Key Material Emissions</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Steel Body</span>
                                                <span className="font-mono text-gray-700">1.8 tCO2e/t</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span>Aluminum Parts</span>
                                                <span className="font-mono text-gray-700">4.2 tCO2e/t</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 3. Non-Compliance Analysis & Actions */}
                        {selectedModel.exportData.nonCompliantReasons.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Reasons */}
                                <div className="border border-red-100 bg-red-50 rounded-lg p-4">
                                    <h4 className="flex items-center gap-2 text-red-800 font-semibold mb-3">
                                        <AlertTriangle className="w-4 h-4" /> Non-Compliance Detected
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedModel.exportData.nonCompliantReasons.map((reason, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-red-700 items-start">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                                                <span className="leading-snug">{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="border border-emerald-100 bg-emerald-50 rounded-lg p-4">
                                    <h4 className="flex items-center gap-2 text-emerald-800 font-semibold mb-3">
                                        <CheckCircle className="w-4 h-4" /> Remedial Actions
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedModel.exportData.complianceActions.map((action, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-emerald-700 items-start">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                <span className="leading-snug">{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {!selectedModel.exportData && (
                            <div className="text-center py-8 text-gray-500">
                                No export data available for this model.
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ComplianceOverview;
