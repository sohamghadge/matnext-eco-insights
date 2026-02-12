import React, { useState, useMemo } from 'react';
import { Table, InputNumber, Button, Tooltip, Space, notification } from 'antd';
import { Edit2, RotateCcw, Save, Info } from 'lucide-react';
import { RankingKPI, EntityScore } from '@/data/dashboardData';

interface RankingTableProps {
    title: string;
    kpis: RankingKPI[];
    entityScores: EntityScore[];
}

const RankingTable: React.FC<RankingTableProps> = ({ title, kpis, entityScores }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [weights, setWeights] = useState<Record<string, number>>(
        () => Object.fromEntries(kpis.map(k => [k.id, k.defaultWeight]))
    );

    const handleWeightChange = (kpiId: string, value: number | null) => {
        setWeights(prev => ({ ...prev, [kpiId]: value ?? 0 }));
    };

    const handleReset = () => {
        setWeights(Object.fromEntries(kpis.map(k => [k.id, k.defaultWeight])));
        notification.info({ message: 'Weights reset to defaults.' });
    };

    const handleSave = () => {
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        if (totalWeight !== 100) {
            notification.warning({ message: `Total weight must be 100%. Currently: ${totalWeight}%` });
            return;
        }
        setIsEditing(false);
        notification.success({ message: 'Weights saved successfully.' });
    };

    // Calculate weighted scores
    const rankedEntities = useMemo(() => {
        return entityScores.map(entity => {
            let totalScore = 0;
            const kpiScores: Record<string, { raw: number; weighted: number }> = {};
            entity.scores.forEach(s => {
                const weight = weights[s.kpiId] || 0;
                const weightedScore = (s.rawScore * weight) / 100;
                kpiScores[s.kpiId] = { raw: s.rawScore, weighted: parseFloat(weightedScore.toFixed(2)) };
                totalScore += weightedScore;
            });
            return { name: entity.entityName, kpiScores, totalScore: parseFloat(totalScore.toFixed(2)) };
        }).sort((a, b) => b.totalScore - a.totalScore); // Sort by total score descending
    }, [entityScores, weights]);

    // Build table columns
    const columns: any[] = [
        {
            title: 'Evaluation Criteria',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 180,
            render: (text: string, record: any) => (
                <Tooltip title={record.description}>
                    <span className="font-medium cursor-help">{text} <Info className="inline w-3 h-3 ml-1 text-slate-400" /></span>
                </Tooltip>
            ),
        },
        {
            title: 'Weight (%)',
            dataIndex: 'weight',
            key: 'weight',
            width: 120,
            render: (_: any, record: any) => (
                isEditing ? (
                    <InputNumber
                        min={0}
                        max={100}
                        value={weights[record.id]}
                        onChange={(val) => handleWeightChange(record.id, val)}
                        className="w-20"
                        suffix="%"
                    />
                ) : (
                    <span className="font-semibold text-blue-600">{weights[record.id]}%</span>
                )
            ),
        },
        ...rankedEntities.map(entity => ({
            title: entity.name,
            key: entity.name,
            width: 140,
            align: 'center' as const,
            render: (_: any, record: any) => {
                const score = entity.kpiScores[record.id];
                if (!score) return '-';
                return (
                    <span>
                        {score.raw} <span className="text-xs text-slate-500">({score.weighted})</span>
                    </span>
                );
            },
        })),
    ];

    // Table data source = list of KPIs
    const dataSource = kpis.map(k => ({ key: k.id, id: k.id, name: k.name, description: k.description }));

    // Add a summary row for total scores
    const summaryRow = {
        key: 'total',
        id: 'total',
        name: 'TOTAL SCORE',
        description: 'Weighted sum of all KPI scores',
    };

    return (
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                <Space>
                    {isEditing ? (
                        <>
                            <Button icon={<RotateCcw className="w-4 h-4" />} onClick={handleReset}>Reset</Button>
                            <Button type="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>Save</Button>
                        </>
                    ) : (
                        <Button icon={<Edit2 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>Edit Weights</Button>
                    )}
                </Space>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: 'max-content' }}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row className="bg-amber-50 font-bold">
                            <Table.Summary.Cell index={0} className="font-bold text-amber-800">TOTAL SCORE</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} className="font-bold text-amber-800">100%</Table.Summary.Cell>
                            {rankedEntities.map((entity, idx) => (
                                <Table.Summary.Cell key={entity.name} index={idx + 2} align="center" className="font-bold text-lg text-amber-800">
                                    {entity.totalScore}
                                </Table.Summary.Cell>
                            ))}
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </div>
    );
};

export default RankingTable;
