import { useEffect, useState } from 'react';
import { Button, Card, Modal, Table, Typography } from 'antd';
import { ArrowUpRight, CircleCheck, Clock3, LoaderCircle, ShieldCheck, FileText, CalendarDays, History, BookOpen, Target, TrendingUp } from 'lucide-react';
import type { TableColumnsType } from 'antd';
import type { RegulatoryLandscapeRecord } from './ComplianceOverview';
import { getComplianceApi } from '@/services/complianceApi';

interface ManagedCompliance {
    id: number;
    formalName: string;
    sourceUrl?: string;
    country: string;
    regulationType: string;
    timeline: string;
    status: string;
    regulatoryDetails?: RegulatoryLandscapeRecord;
}

// Static record mapping retained for reference.
// const regulatoryKeys: Record<number, string> = { 1: 'eu-cbam-1', 2: '8', 4: '12', 5: '0', 8: '15' };

const statusDisplay: Record<string, { label: string; color: string }> = {
    Implemented: { label: 'Live', color: 'success' },
    'POC live (steel)': { label: 'Live', color: 'success' },
    Live: { label: 'Live', color: 'success' },
    Active: { label: 'Live', color: 'success' },
    Completed: { label: 'Completed', color: 'success' },
    Official: { label: 'In Progress', color: 'processing' },
    TBD: { label: 'In Progress', color: 'processing' },
    'Data Tracking': { label: 'In Progress', color: 'processing' },
    Proposed: { label: 'In Progress', color: 'warning' },
    'In Progress': { label: 'In Progress', color: 'warning' },
};

function renderStatus(status: string) {
    const display = statusDisplay[status];
    const isLive = display?.label === 'Live';
    const isInProgress = display?.label === 'In Progress';
    const Icon = display?.label === 'Completed' ? CircleCheck : isInProgress ? LoaderCircle : Clock3;
    const colors = display?.color === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
        : display?.color === 'warning'
            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100'
            : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100';
    return (
        <span title={status} className={`inline-flex max-w-full items-center gap-2 rounded-xl border px-2 py-1.5 text-xs font-semibold shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out hover:shadow-md motion-safe:hover:-translate-y-px motion-reduce:transition-none ${colors}`}>
            {isLive ? (
                <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden="true">
                    <span className="absolute h-2 w-2 rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping motion-safe:[animation-duration:2.5s]" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-600" />
                </span>
            ) : (
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isInProgress ? 'motion-safe:animate-spin motion-safe:[animation-duration:3s]' : ''}`} aria-hidden="true" />
            )}
            <span className="leading-5">{status}</span>
        </span>
    );
}

function renderCountry(country: string) {
    return <span className="inline-flex max-w-full rounded-md border border-[#d9e4c7] bg-[#eef4e3] px-2 py-1 text-xs font-semibold leading-5 text-[#466126]">{country}</span>;
}

/* Static data enrichment retained for reference.
export function getManagedComplianceData(regulatoryData: RegulatoryLandscapeRecord[]): ManagedCompliance[] {
    return complianceData.map(row => {
        const details = regulatoryData.find(record => record.key === regulatoryKeys[row.id]);
        if (!details) return row;

        return {
            ...row,
            formalName: details.formalName,
            sourceUrl: details.officialSourceURL,
            country: details.countryRegion === 'Europe / EU' ? 'EU' : details.countryRegion,
            timeline: details.effectiveDate,
            status: details.status,
            regulatoryDetails: details,
        };
    });
}

*/

const detailLabels: Record<keyof RegulatoryLandscapeRecord, string> = {
    key: 'Record ID',
    countryRegion: 'Country/Region',
    formalName: 'Formal Name of Compliance/Mandate',
    targetYear: 'Target Year',
    status: 'Regulatory Status',
    material: 'Material',
    quantitativeTarget: 'Quantitative Target',
    officialSourceTitle: 'Official Source',
    officialSourceURL: 'Official Source URL',
    issuingAuthority: 'Issuing Authority',
    dateOfIssue: 'Date of Issue / Publication',
    effectiveDate: 'Effective Date',
    amendmentVersionDate: 'Amendment / Version Date',
    summaryOfRequirement: 'Summary of Requirement',
    applicability: 'Applicability to Automobile Sector',
    relevance: 'OEM / Recycler / Producer / Importer / RVSF / Supplier Relevance',
    changeType: 'Change Type',
    previousValue: 'Previous Value',
    currentValue: 'Current Value',
    lastVerified: 'Last Verified',
};

const detailSections: { title: string; icon: typeof FileText; fields: (keyof RegulatoryLandscapeRecord)[] }[] = [
    { title: 'Requirements & obligations', icon: FileText, fields: ['summaryOfRequirement', 'quantitativeTarget', 'applicability'] },
    { title: 'Dates & milestones', icon: CalendarDays, fields: ['targetYear', 'dateOfIssue', 'effectiveDate', 'amendmentVersionDate', 'lastVerified'] },
    { title: 'Regulatory profile', icon: ShieldCheck, fields: ['key', 'countryRegion', 'status', 'material', 'relevance'] },
    { title: 'Changes & updates', icon: History, fields: ['changeType', 'previousValue', 'currentValue'] },
    { title: 'Authority & sources', icon: BookOpen, fields: ['issuingAuthority', 'officialSourceTitle', 'officialSourceURL'] },
];

/* Static data retained for reference; the table now loads from the compliance API.
// Transcribed from the supplied MSIL reference; source URLs were not included in the image.
const complianceData: ManagedCompliance[] = [
    {
        id: 1,
        formalName: 'Carbon Border Adjustment Mechanism: Regulation (EU) 2023/956, amended by Regulation (EU) 2025/2083',
        sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2023/956/oj',
        country: 'EU',
        regulationType: 'Environmental (carbon, trade)',
        timeline: 'Definitive period from 1 Jan 2026; certificates on sale from 1 Feb 2027; first annual declaration 30 Sep 2027',
        status: 'TBD',
    },
    {
        id: 2,
        formalName: 'End-of-Life Vehicles Regulation: Regulation (EU) 2026/1738',
        sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2026/1738/oj',
        country: 'EU',
        regulationType: 'Environmental (EPR, circularity)',
        timeline: 'In force 13 Aug 2026; most duties 1 Sep 2028; EPR 1 Sep 2029; 15% recycled plastic 1 Sep 2032, 25% 1 Sep 2036',
        status: 'TBD',
    },
    {
        id: 3,
        formalName: 'Ecodesign for Sustainable Products Regulation (Digital Product Passport): Regulation (EU) 2024/1781',
        sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2024/1781/oj',
        country: 'EU',
        regulationType: 'Product (ecodesign, digital data)',
        timeline: 'Iron and steel delegated act expected Q4 2026; duties follow at least 18 months later (not yet fixed)',
        status: 'TBD',
    },
    {
        id: 4,
        formalName: 'Batteries Regulation: Regulation (EU) 2023/1542',
        sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2023/1542/oj',
        country: 'EU',
        regulationType: 'Environmental and product (battery)',
        timeline: 'EV battery passport 18 Feb 2027; due diligence 18 Aug 2027; recycled content from Aug 2031',
        status: 'TBD',
    },
    {
        id: 5,
        formalName: 'Environment Protection (End-of-Life Vehicles) Rules, 2025',
        country: 'India',
        regulationType: 'Environmental (EPR)',
        timeline: 'In force 1 Apr 2025; steel target 8% to FY2029-30, 13% to FY2034-35, 18% after; return by 30 Jun',
        status: 'POC live (steel)',
    },
    {
        id: 6,
        formalName: 'Draft Rule 9A: recycled steel use in new vehicles (amendment to the ELV Rules, 2025)',
        country: 'India',
        regulationType: 'Environmental (recycled content)',
        timeline: 'Draft of 27 Mar 2026; compliance date and percentage not yet confirmed (NEED slide: 10% from FY2026-27)',
        status: 'POC live (steel)',
    },
    {
        id: 7,
        formalName: 'Act on the Promotion of Effective Utilization of Resources (as amended June 2025)',
        country: 'Japan',
        regulationType: 'Environmental (recycled content)',
        timeline: 'In force April 2026: recycled-material plans and periodic reports for certain automobiles; filing dates [to confirm]',
        status: 'TBD',
    },
    {
        id: 8,
        formalName: 'Act on Recycling, etc. of End-of-Life Vehicles (2002)',
        country: 'Japan',
        regulationType: 'Environmental (recycling)',
        timeline: 'In force since 2005; ongoing producer and recycler obligations',
        status: 'TBD',
    },
    {
        id: 9,
        formalName: 'GX Promotion Act: mandatory emissions trading scheme',
        country: 'Japan',
        regulationType: 'Climate (carbon pricing)',
        timeline: 'From FY2026 for emitters above 100,000 t CO2 a year',
        status: 'TBD',
    },
    {
        id: 10,
        formalName: 'Decree No. 110/2026/ND-CP: producer recycling responsibility (EPR)',
        country: 'Vietnam',
        regulationType: 'Environmental (EPR)',
        timeline: 'In force 25 May 2026; road vehicles from 1 Jan 2027',
        status: 'TBD',
    },
];

*/

export default function ComplianceLandscapeTable() {
    const [records, setRecords] = useState<ManagedCompliance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        const load = async () => {
            try {
                const response = await getComplianceApi(1);
                if (response.success === false || response.error) {
                    throw new Error(response.message || 'Unable to load compliance records.');
                }
                const list = Array.isArray(response.data) ? response.data : response.data?.list;
                if (!Array.isArray(list)) {
                    throw new Error('Unable to read compliance records.');
                }
                if (active) setRecords(list.map(record => ({
                    id: record.id,
                    formalName: record.formalName,
                    country: record.countryRegion,
                    regulationType: record.regulationType || '-',
                    timeline:  '-',
                    status: record.status,
                    sourceUrl: record.sourceUrl || undefined,
                    regulatoryDetails: {
                        key: String(record.id),
                        formalName: record.formalName,
                        countryRegion: record.countryRegion,
                        targetYear: record.targetYear || '-',
                        status: record.status,
                        material: record.material || '-',
                        quantitativeTarget: record.quantitativeTarget || '-',
                        officialSourceTitle: record.officialSource || '-',
                        officialSourceURL: record.sourceUrl || '',
                        issuingAuthority: record.issuingAuthority || '-',
                        dateOfIssue: record.dateOfIssue || '-',
                        effectiveDate: record.effectiveDate || '-',
                        amendmentVersionDate: record.amendmentVersionDate || '-',
                        summaryOfRequirement: record.summaryOfRequirement || '-',
                        applicability: record.applicabilityToAuto || '-',
                        relevance: record.stakeholderRelevance || '-',
                        changeType: record.changeType || '-',
                        previousValue: record.previousValue || '-',
                        currentValue: record.currentValue || '-',
                        lastVerified: record.lastVerified || '-',
                    },
                })));
            } catch (error) {
                if (active) console.error('Unable to load compliance records.', error);
            } finally {
                if (active) setLoading(false);
            }
        };
        void load();
        return () => { active = false; };
    }, []);
    const [selectedCompliance, setSelectedCompliance] = useState<ManagedCompliance | null>(null);
    const columns: TableColumnsType<ManagedCompliance> = [
        { title: '#', key: 'index', width: '3%', align: 'center', render: (_, __, index) => index + 1 },
        {
            title: 'Compliance Formal Name', dataIndex: 'formalName', width: '18%',
            render: (name: string) => <span className="text-xs font-medium text-gray-800">{name}</span>,
        },
        {
            title: 'Final Draft Link', key: 'source', width: '8%',
            render: (_, record) => record.sourceUrl
                ? <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{record.country === 'EU' ? 'EUR-Lex' : 'Source'}</a>
                : <Typography.Text type="secondary">-</Typography.Text>,
        },
        {
            title: 'Country/Region', dataIndex: 'country', width: '10%',
            render: renderCountry,
        },
        {
            title: 'Regulation Type', dataIndex: 'regulationType', width: '11%',
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Timeline / Deadline', dataIndex: 'timeline', width: '18%',
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Status in MSIL', dataIndex: 'status', width: '10%',
            render: renderStatus,
        },
        { title: 'Target', key: 'target', width: '6%', align: 'center', render: () => <Typography.Text type="secondary">0</Typography.Text> },
        { title: 'Achieved', key: 'achieved', width: '7%', align: 'center', render: () => <Typography.Text type="secondary">0</Typography.Text> },
        {
            title: 'Action', key: 'action', width: '9%',
            render: (_, record) => (
                <Button size="small" type="default" className="!h-auto max-w-full !gap-1 !rounded-md !border-[#d9e4c7] !bg-[#f5f8ef] !px-2 !py-1.5 !text-xs !font-semibold !text-[#466126] !shadow-none hover:!border-[#9bb57a] hover:!bg-[#e8efd9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a7a32]" onClick={() => setSelectedCompliance(record)}>
                    <span className="whitespace-normal text-left leading-4">View Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </Button>
            ),
        },
    ];
    return (
        <>
            <Card title="Compliance Landscape" className="shadow-sm border-gray-200" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
                <Table<ManagedCompliance>
                    className="[&_.ant-table-cell]:whitespace-normal [&_.ant-table-thead_.ant-table-cell]:[overflow-wrap:normal] [&_.ant-table-thead_.ant-table-cell]:[word-break:normal] [&_.ant-table-tbody_.ant-table-cell]:[overflow-wrap:anywhere]"
                    columns={columns}
                    dataSource={records}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                />
            </Card>
            <Modal
                title="Compliance details"
                open={selectedCompliance !== null}
                onCancel={() => setSelectedCompliance(null)}
                footer={<Button onClick={() => setSelectedCompliance(null)}>Close</Button>}
                width={1000}
                centered
                styles={{ body: { paddingTop: 12 }, footer: { borderTop: '1px solid #f0f0f0', paddingTop: 16 } }}
            >
                {selectedCompliance && (
                    <div className="space-y-5 overflow-y-auto pr-2 [overflow-wrap:anywhere]" style={{ maxHeight: '70vh' }}>
                        <section className="rounded-2xl border border-[#dfe7d5] bg-gradient-to-br from-[#f2f6eb] to-white p-5 sm:p-6">
                            <div className="mb-4 flex flex-wrap items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5a7a32] text-white">
                                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-widest text-[#5a7a32]">Compliance record #{selectedCompliance.id}</span>
                                {renderCountry(selectedCompliance.country)}
                            </div>
                            <h2 className="m-0 text-lg font-semibold leading-relaxed text-gray-900 sm:text-xl">{selectedCompliance.formalName}</h2>
                            <p className="mb-0 mt-3 text-sm text-gray-600">{selectedCompliance.regulationType}</p>
                        </section>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-gray-200 bg-white p-4">
                                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Status in MSIL</p>
                                {renderStatus(selectedCompliance.status)}
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-4">
                                <div className="mb-2 flex items-center justify-between text-gray-500"><span className="text-xs font-medium uppercase tracking-wide">Target</span><Target className="h-4 w-4" aria-hidden="true" /></div>
                                <p className="m-0 text-2xl font-semibold text-gray-900">0</p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                                <div className="mb-2 flex items-center justify-between text-emerald-700"><span className="text-xs font-medium uppercase tracking-wide">Achieved</span><TrendingUp className="h-4 w-4" aria-hidden="true" /></div>
                                <p className="m-0 text-2xl font-semibold text-emerald-800">0</p>
                            </div>
                        </div>

                        <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900"><CalendarDays className="h-4 w-4" aria-hidden="true" />Timeline / Deadline</h3>
                            <p className="m-0 text-sm leading-7 text-gray-700">{selectedCompliance.timeline}</p>
                        </section>

                        {selectedCompliance.regulatoryDetails && detailSections.map(({ title, icon: Icon, fields }) => (
                            <section key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                                <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <Icon className="h-4 w-4 text-[#5a7a32]" aria-hidden="true" />{title}
                                </h3>
                                <dl className={`m-0 grid gap-5 ${title === 'Dates & milestones' || title === 'Regulatory profile' ? 'sm:grid-cols-2' : ''}`}>
                                    {fields.map(key => (
                                        <div key={key} className="min-w-0">
                                            <dt className="mb-1.5 text-xs font-medium text-gray-500">{detailLabels[key]}</dt>
                                            <dd className="m-0 text-sm leading-7 text-gray-800">
                                                {key === 'officialSourceURL' && selectedCompliance.regulatoryDetails[key]
                                                    ? <a href={selectedCompliance.regulatoryDetails[key]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedCompliance.regulatoryDetails[key]}</a>
                                                    : selectedCompliance.regulatoryDetails[key] || '-'}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                        ))}
                        {!selectedCompliance.regulatoryDetails && (
                            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Source & additional details</h3>
                                {selectedCompliance.sourceUrl && <a href={selectedCompliance.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{selectedCompliance.sourceUrl}</a>}
                                <p className="mb-0 mt-3 text-sm text-gray-500">No additional Regulatory Landscape details are linked to this compliance.</p>
                            </section>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}
