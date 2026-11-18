import { Table } from 'antd';
import type { QuantitativeTarget } from '@/services/complianceApi';

export default function QuantitativeTargetTable({ value }: { value: QuantitativeTarget }) {
    let parsed: unknown = value;
    if (typeof value === 'string') {
        try {
            parsed = JSON.parse(value);
        } catch {
            return <span>{value || '-'}</span>;
        }
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return <span>{typeof value === 'string' ? value : '-'}</span>;
    }

    const { prediction } = parsed as { prediction?: unknown };
    const rows = prediction && typeof prediction === 'object' && !Array.isArray(prediction)
        ? Object.entries(prediction)
            .filter(([, target]) => typeof target === 'string')
            .map(([year, target]) => ({ year, target: target as string }))
        : [];

    return (
        <div className="space-y-2">
            <Table
                aria-label="Quantitative target predictions"
                className="overflow-hidden rounded-lg border border-[#dfe7d5] [&_.ant-table-thead>tr>th]:!bg-[#eff4e7] [&_.ant-table-thead>tr>th]:!text-[#466126] [&_.ant-table-cell]:!px-3 [&_.ant-table-cell]:!py-2 [&_.ant-table-cell]:!text-xs [&_.ant-table-cell]:!leading-5 [&_.ant-table-cell]:[overflow-wrap:anywhere]"
                columns={[
                    { title: 'Year', dataIndex: 'year', width: 120 },
                    { title: 'Target', dataIndex: 'target' },
                ]}
                dataSource={rows}
                rowKey="year"
                size="small"
                pagination={false}
                tableLayout="fixed"
                locale={{ emptyText: 'No year-wise targets available' }}
            />
        </div>
    );
}
