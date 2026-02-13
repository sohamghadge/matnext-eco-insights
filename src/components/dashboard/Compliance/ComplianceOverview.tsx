import { Card, Row, Col, Typography, Tag, Progress, Statistic, Table, Button, Modal, Select, Space, Input } from 'antd';
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

        return (
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">{stat.label}</Text>
                        <div className={`text - 2xl font - bold mt - 1 ${color} `}>{stat.value}</div>
                        {stat.subValue && <Text type="secondary" className="text-xs mt-1 block">{stat.subValue}</Text>}
                    </div>
                    <div className={`p - 2 rounded - lg ${bgColor} `}>
                        <Icon className={`w - 5 h - 5 ${color} `} />
                    </div>
                </div>
            </Card>
        );
    };

    // Regulations Table Columns
    const regulationColumns = [
        {
            title: 'Regulation',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Regulation) => (
                <div>
                    <div className="font-semibold text-gray-800">{text}</div>
                    <div className="text-xs text-gray-500">{record.description}</div>
                </div>
            ),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
        },
        {
            title: 'Impact',
            dataIndex: 'impact',
            key: 'impact',
            render: (impact: string) => (
                <Tag color={impact === 'High' ? 'red' : impact === 'Medium' ? 'orange' : 'blue'}>{impact}</Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'Compliant') color = 'success';
                if (status === 'Non-Compliant') color = 'error';
                if (status === 'In Progress') color = 'processing';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    // Vehicle Compliance Table Columns
    const modelColumns = [
        {
            title: 'Model',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: ModelComplianceData) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded shadow-sm bg-gray-100 overflow-hidden relative">
                        <img
                            src={record.image}
                            alt={text}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                const fallback = document.createElement('div');
                                fallback.innerHTML = '<span class="text-xs text-gray-500">N/A</span>';
                                e.currentTarget.parentElement?.appendChild(fallback);
                            }}
                        />
                    </div>
                    <div>
                        <div className="font-medium text-gray-700">{text}</div>
                        <Tag className="text-[10px] m-0">{record.type}</Tag>
                    </div>
                </div>
            ),
        },
        {
            title: 'Compliance Score',
            dataIndex: 'complianceScore',
            key: 'complianceScore',
            render: (score: number) => (
                <div className="w-24">
                    <Progress percent={score} size="small" strokeColor={score >= 90 ? '#10b981' : score >= 80 ? '#f59e0b' : '#ef4444'} />
                </div>
            ),
            sorter: (a: ModelComplianceData, b: ModelComplianceData) => a.complianceScore - b.complianceScore,
        },
        {
            title: 'Exports (EU)',
            key: 'exports',
            render: (_: any, record: ModelComplianceData) => (
                <div className="text-gray-600 font-medium">
                    {record.exportData ? record.exportData.totalExportUnits.toLocaleString() : '-'}
                </div>
            )
        },
        {
            title: 'CBAM Ready',
            key: 'cbamReady',
            render: (_: any, record: ModelComplianceData) => {
                if (!record.exportData) return <span className="text-gray-400">-</span>;
                const pct = record.exportData.compliantPercentage;
                return (
                    <Tag color={pct >= 90 ? 'success' : pct >= 70 ? 'warning' : 'error'}>
                        {pct}%
                    </Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
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
            render: (text: string) => <span className="font-medium text-gray-700">{text}</span>
        },
        {
            title: 'Material / Grade',
            key: 'material',
            render: (_: any, record: EPRPartData) => (
                <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">{record.material}</span>
                    <span className="text-xs text-gray-500">{record.grade}</span>
                </div>
            )
        },
        {
            title: type === 'Recovery' ? 'Recoverability Rate' : 'Recyclability Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (val: number, record: EPRPartData) => (
                <div>
                    <div className="font-semibold text-gray-800">{val}%</div>
                    <div className="text-[10px] text-gray-500">
                        Target: <span className="font-medium">{record.benchmark}%</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: EPRPartData) => {
                let color = 'default';
                if (status === 'Compliant') color = 'success';
                if (status === 'Non-Compliant') color = 'error';
                if (status === 'Warning') color = 'warning';

                return (
                    <div className="flex flex-col items-start gap-1">
                        <Tag color={color} className="mr-0">{status}</Tag>
                        {status === 'Non-Compliant' && (
                            <span className="text-[10px] text-red-600 font-medium">
                                {(record.benchmark - record.rate).toFixed(1)}% under target
                            </span>
                        )}
                        {status === 'Warning' && (
                            <span className="text-[10px] text-amber-600 font-medium">
                                Near limit
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: string) => <span className="text-xs text-gray-500">{text}</span>
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
            render: (text: string, record: PartComplianceData) => (
                <div>
                    <div className="font-medium text-gray-800">{text}</div>
                    <div className="text-[10px] text-gray-500">{record.supplier}</div>
                </div>
            ),
        },
        {
            title: 'Material / Grade',
            key: 'material',
            render: (_: any, record: PartComplianceData) => (
                <div>
                    <Tag className="mr-0 mb-1">{record.material}</Tag>
                    <div className="text-[10px] text-gray-500">{record.grade}</div>
                </div>
            )
        },
        {
            title: 'HS Code',
            dataIndex: 'hsCode',
            key: 'hsCode',
            render: (text: string) => <span className="font-mono text-xs">{text}</span>
        },
        {
            title: 'Emission Intensity',
            dataIndex: 'emissions',
            key: 'emissions',
            render: (val: number, record: PartComplianceData) => (
                <div>
                    <div className="font-semibold text-gray-800">{val} <span className="text-[10px] font-normal text-gray-400">tCO2e/t</span></div>
                    {/* Display Benchmark */}
                    <div className="text-[10px] text-gray-500">
                        Limit: <span className="font-medium">{record.benchmark}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: PartComplianceData) => {
                let color = 'default';
                if (status === 'Compliant') color = 'success';
                if (status === 'Non-Compliant') color = 'error';
                if (status === 'Warning') color = 'warning';

                return (
                    <div className="flex flex-col items-start gap-1">
                        <Tag color={color} className="mr-0">{status}</Tag>
                        {status === 'Non-Compliant' && (
                            <span className="text-[10px] text-red-600 font-medium">
                                +{((record.emissions - record.benchmark) / record.benchmark * 100).toFixed(0)}% over limit
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: string) => <span className="text-xs text-gray-600">{text}</span>
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

            {/* 3. CBAM Context & Education (Purple Box) */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">EU Carbon Border Adjustment Mechanism (CBAM) Compliance</h3>
                        <p className="text-purple-800 mb-4 leading-relaxed max-w-4xl">
                            The Carbon Border Adjustment Mechanism (CBAM) is the EU's tool to put a fair price on the carbon emitted during the production of carbon-intensive goods that are entering the EU, and to encourage cleaner industrial production in non-EU countries.
                            <br /><br />
                            <strong>Key Impact Areas for Automotive:</strong>
                            <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                <li><strong>Covered Materials:</strong> Iron, Steel, Aluminum, and downstream products (screws, bolts, structures).</li>
                                <li><strong>Reporting Obligations:</strong> Importers must report "embedded emissions" (Direct + Indirect) quarterly.</li>
                                <li><strong>Financial Impact (2026+):</strong> Purchase of CBAM certificates will be mandatory for emissions exceeding EU benchmarks.</li>
                            </ul>
                        </p>
                        <div className="flex gap-4 mt-4">
                            <Tag color="purple" className="px-3 py-1 text-sm">Phase: Transitional</Tag>
                            <Tag color="cyan" className="px-3 py-1 text-sm">Next Reporting: 31 Oct 2026</Tag>
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
                        <Table
                            dataSource={data.models}
                            columns={modelColumns}
                            pagination={false}
                            size="small"
                            rowKey="id"
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
                <Card className="bg-blue-50 border-blue-100 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2">
                                <Info className="w-5 h-5" /> Energy Recovery + Recycling
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Recoverability</strong> refers to the potential specifically to recover energy from waste (incineration with energy recovery) PLUS material recycling.
                            </p>
                            <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                                Under ELV Directive & AIS-129, vehicles must achieve a minimum <strong>95% Recoverability Rate</strong> by weight. This includes metal recycling and energy recovery from plastics/foams.
                            </p>
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
                    <Table
                        dataSource={data.models}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        columns={[
                            {
                                title: 'Vehicle',
                                dataIndex: 'name',
                                key: 'name',
                                render: (text: string) => <span className="font-medium">{text}</span>
                            },
                            {
                                title: 'Target Rate',
                                dataIndex: ['eprRecovery', 'target'],
                                key: 'target',
                                render: (val: number) => `${val}% `
                            },
                            {
                                title: 'Actual Rate',
                                dataIndex: ['eprRecovery', 'actual'],
                                key: 'actual',
                                render: (val: number) => <span className="font-bold">{val}%</span>
                            },
                            {
                                title: 'Status',
                                dataIndex: ['eprRecovery', 'status'],
                                key: 'status',
                                render: (status: string) => {
                                    let color = status === 'Compliant' ? 'success' : status === 'Non-Compliant' ? 'error' : 'warning';
                                    return <Tag color={color}>{status}</Tag>
                                }
                            }
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
                                <Option value="evitara">eVitara</Option>
                                <Option value="fronx">Fronx</Option>
                                <Option value="baleno">Baleno</Option>
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
                <Card className="bg-green-50 border-green-100 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-green-900 font-bold text-lg mb-2">
                                <Info className="w-5 h-5" /> Material Recycling Only
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Recyclability</strong> refers strictly to the reprocessing of waste materials into products, materials, or substances (excluding energy recovery).
                            </p>
                            <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                                The mandate requires a minimum <strong>85% Recyclability Rate</strong> by weight. This is harder to achieve for composite plastics and glass.
                            </p>
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
                    <Table
                        dataSource={data.models}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        columns={[
                            {
                                title: 'Vehicle',
                                dataIndex: 'name',
                                key: 'name',
                                render: (text: string) => <span className="font-medium">{text}</span>
                            },
                            {
                                title: 'Target Rate',
                                dataIndex: ['eprRecycling', 'target'],
                                key: 'target',
                                render: (val: number) => `${val}% `
                            },
                            {
                                title: 'Actual Rate',
                                dataIndex: ['eprRecycling', 'actual'],
                                key: 'actual',
                                render: (val: number) => <span className="font-bold">{val}%</span>
                            },
                            {
                                title: 'Status',
                                dataIndex: ['eprRecycling', 'status'],
                                key: 'status',
                                render: (status: string) => {
                                    let color = status === 'Compliant' ? 'success' : status === 'Non-Compliant' ? 'error' : 'warning';
                                    return <Tag color={color}>{status}</Tag>
                                }
                            }
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
                                <Option value="evitara">eVitara</Option>
                                <Option value="fronx">Fronx</Option>
                                <Option value="baleno">Baleno</Option>
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
