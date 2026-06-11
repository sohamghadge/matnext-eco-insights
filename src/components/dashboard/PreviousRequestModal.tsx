import { useCallback, useEffect, useState } from 'react';
import { Button, Modal, notification, Table, Tag, Tooltip } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import { FileSpreadsheet } from 'lucide-react';
import {
    getUserReportsApi,
    type previousHistoryInf,
    type UserReportRequest,
} from '@/services/dashboardApi';
import { downloadFileFromUrl } from '@/utils/customFunctions';

interface PreviousRequestModalProps {
    open: boolean;
    onClose: () => void;
}

const PreviousRequestModal = ({ open, onClose }: PreviousRequestModalProps) => {
    const [previousRequests, setPreviousRequests] = useState<previousHistoryInf>({});
    const [previousRequestsLoading, setPreviousRequestsLoading] = useState(false);
    const pageSize = 10

    const handleDownloadPreviousReport = (reportData: { fileName: string; fileUrl: string }) => {
        const downloadLink = reportData?.fileUrl;

        if (!downloadLink) {
            notification.error({
                message: 'Report download failed',
                description: 'Download link was not received.',
                placement: 'topRight',
            });
            return;
        }

        downloadFileFromUrl(downloadLink, reportData?.fileName);
    };

    const fetchPreviousRequests = useCallback(async (pageNo: number) => {
        setPreviousRequestsLoading(true);

        try {
            const response = await getUserReportsApi({
                params: {
                    sheetType: 'DASHBOARD_MATERIAL_TYPES_TILE_SHEET',
                },
                pageNo: pageNo || 1
            });
            if (response?.data) {
                setPreviousRequests(Array.isArray(response.data) ? { list: response.data } : response.data);
            } else {
                setPreviousRequests({});
            }

        } catch {
            setPreviousRequests({});
            notification.error({
                message: 'Previous requests failed to load',
                description: 'Please try again.',
                placement: 'topRight',
            });
        } finally {
            setPreviousRequestsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchPreviousRequests(1);
        }
    }, [fetchPreviousRequests, open]);

    const tableColumns: TableProps<UserReportRequest>['columns'] = [
        {
            title: 'Start Date',
            dataIndex: 'fromDate',
            render: (rowData?: string) => rowData || '-',
        },
        {
            title: 'End Date',
            dataIndex: 'toDate',
            render: (rowData?: string) => rowData || '-',
        },
        {
            title: 'Created Date',
            dataIndex: ['dmsDetails', 'modificationDate'],
            render: (rowData?: string) => rowData || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status?: string) => (
                <Tag color={status?.toUpperCase() === 'SUCCESS' ? 'success' : 'default'}>
                    {status || '-'}
                </Tag>
            ),
        },
        {
            title: 'Excel',
            key: 'excel',
            align: 'center' as const,
            dataIndex: 'dmsDetails',
            render: (rowData?: UserReportRequest['dmsDetails']) => (
                <Tooltip title="Download report">
                    <Button
                        type="text"
                        icon={<FileSpreadsheet className="w-7 h-7" />}
                        onClick={() => handleDownloadPreviousReport({ fileName: rowData?.fileName ?? '', fileUrl: rowData?.fileUrl ?? '' })}
                    />
                </Tooltip>
            ),
        },
    ]

    const handleTableChange: TableProps<UserReportRequest>['onChange'] = (
        pagination: TablePaginationConfig,
    ) => {
        fetchPreviousRequests(pagination.current ?? 1);
    };

    return (
        <Modal
            title="View Previous Request"
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
        >
            <Table
                rowKey={(record, index) => String(record.id ?? index)}
                dataSource={previousRequests.list ?? []}
                loading={previousRequestsLoading}
                pagination={{
                    pageSize,
                    current: previousRequests?.pageNo,
                    total: previousRequests?.fullCount ?? ((previousRequests?.lastPage ?? 0) * pageSize),
                    responsive: true,
                    hideOnSinglePage: true,
                }}
                columns={tableColumns}
                onChange={handleTableChange}
            />
        </Modal>
    );
};

export default PreviousRequestModal;
