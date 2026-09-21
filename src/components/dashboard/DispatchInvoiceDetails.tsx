import { useCallback, useEffect, useMemo, useState } from 'react';
import { message, notification } from 'antd';
import type { TableColumnsType } from 'antd';
import { FileExcelOutlined, HistoryOutlined } from '@ant-design/icons';
import { AppButton, AppModal, AppTable, AppTooltip } from '@/components/common/AntdControls';
import {
  getUserReportsApi,
  type PreviousHistoryInfo,
  type TagItem,
  type UserReportRequest,
} from '@/services/dashboardApi';
import {
  generateUserReport,
  getDispatchInvoiceDetails,
  type DispatchInvoiceDetailsItem,
  type DispatchInvoiceDetailsParams,
} from '@/utils/api';
import { downloadFileFromUrl } from '@/utils/customFunctions';
import { formatDateToDDMMYYYY } from '@/utils/dayjs';
import { materialTypesList } from './dashboard.description';

const PAGE_SIZE = 10;
const REPORT_HISTORY_PAGE_SIZE = 10;

interface DispatchInvoiceRow extends DispatchInvoiceDetailsItem {
  key: string;
}

interface DispatchInvoiceDetailsProps {
  materialOptions?: TagItem[];
  dateFrom: Date | null;
  dateTo: Date | null;
  scrapCategory?: string;
  refreshKey?: number;
}

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return 0;

  const parsedValue = Number.parseFloat(String(value).replace(/,/g, ''));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const columns: TableColumnsType<DispatchInvoiceRow> = [
  { title: 'Invoice No.', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (value: string | null) => value || '-' },
  { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate', render: (value: string | null) => value || '-' },
  {
    title: 'Material Description',
    dataIndex: 'materialDescription',
    key: 'materialDescription',
    render: (value: string | null | undefined) => value || '-',
  },
  {
    title: 'Scrap Item Category',
    dataIndex: 'scrapItemCategory',
    key: 'scrapItemCategory',
    render: (value: string | null | undefined) => value || '-',
  },
  { title: 'Qty (Kg)', dataIndex: 'quantity', key: 'quantity', align: 'right', render: (value) => value ? toNumber(value).toLocaleString('en-IN') : '-' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right', render: (value) => value != null ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
  // { title: 'Addnl Exp', dataIndex: 'taxableValue', key: 'additionalExpense', align: 'right', render: (value) => value != null ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
  // { title: 'Final Amount (INR)', dataIndex: 'totalValue', key: 'finalAmount', align: 'right', render: (value) => value != null ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
  { title: 'Rate Rs/ kg', dataIndex: 'ratePerKg', key: 'ratePerKg', align: 'right', render: (value) => value ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
];

const getReportDownloadUrl = (row: UserReportRequest) => (
  row.dmsDetails?.fileUrl || row.fileUrl || row.downloadUrl || row.reportUrl || row.excelUrl || row.link || row.url || ''
);

const reportHistoryColumns = (
  onDownloadExcel: (row: UserReportRequest) => void,
): TableColumnsType<UserReportRequest> => [
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (_value: string | undefined, row) => (
        row.createdDate || row.createdAt || row.dmsDetails?.modificationDate || '-'
      ),
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (_value: string | undefined) => _value || '-',
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      key: 'toDate',
      render: (_value: string | undefined) => _value || '-',
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (value: string) => value || '-' },
    {
      title: 'Excel',
      key: 'excel',
      align: 'center',
      render: (_value: unknown, row) => (
        <AppTooltip title="Download Excel">
          <AppButton
            type="text"
            icon={<FileExcelOutlined style={{ fontSize: 26 }} />}
            aria-label="Download Excel report"
            style={{ width: 35, height: 35 }}
            disabled={!getReportDownloadUrl(row)}
            onClick={() => onDownloadExcel(row)}
          />
        </AppTooltip>
      ),
    },
  ];

const DispatchInvoiceDetails = ({ materialOptions = [], dateFrom, dateTo, scrapCategory = '', refreshKey = 0 }: DispatchInvoiceDetailsProps) => {
  const [rows, setRows] = useState<DispatchInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Array<string | number>>([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [reportHistory, setReportHistory] = useState<PreviousHistoryInfo>({});
  const [reportHistoryLoading, setReportHistoryLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const formattedFromDate = formatDateToDDMMYYYY(dateFrom);
  const formattedToDate = formatDateToDDMMYYYY(dateTo);

  const params = useMemo<DispatchInvoiceDetailsParams | null>(() => {
    if (!formattedFromDate || !formattedToDate) return null;

    const materialType = [...new Set(
      materialOptions
        .filter((option) => option.id != null && selectedMaterialIds.includes(option.id))
        .map((option) => materialTypesList[option.name as keyof typeof materialTypesList] || 'OTHER'),
    )].join(',');

    return {
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      pageSize: PAGE_SIZE,
      recyclerInvoice: true,
      ...(scrapCategory.trim() ? { searchTag: 'SCRAP_ITEM_CATEGORY', search: scrapCategory.trim() } : {}),
      ...(materialType ? { materialType } : {}),
    };
  }, [formattedFromDate, formattedToDate, materialOptions, scrapCategory, selectedMaterialIds]);

  const loadPage = useCallback(async (pageNo: number) => {
    if (!params) return;

    setLoading(true);
    try {
      const result = await getDispatchInvoiceDetails(pageNo, params);
      if (!result) {
        setRows([]);
        setTotal(0);
        message.error('Failed to load dispatch invoice details');
        return;
      }

      setRows(result.list.map((item, index) => ({
        ...item,
        key: String(item.id ?? `${pageNo}-${item.invoiceNumber ?? 'invoice'}-${index}`),
      })));
      setPage(result.pageNo || pageNo);
      setTotal(result.fullCount || 0);
    } catch {
      setRows([]);
      setTotal(0);
      message.error('Failed to load dispatch invoice details');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!params) {
      setRows([]);
      setPage(1);
      setTotal(0);
      return;
    }

    void loadPage(1);
  }, [loadPage, params, refreshKey]);

  const loadReportHistory = useCallback(async (pageNo: number) => {
    setReportHistoryLoading(true);
    try {
      const response = await getUserReportsApi({
        params: { sheetType: 'INVOICE_DETAILS_SUMMARY' },
        pageNo: pageNo || 1,
      });

      if (response?.data) {
        setReportHistory(Array.isArray(response.data) ? { list: response.data } : response.data);
        return;
      }

      setReportHistory({});
    } catch {
      setReportHistory({});
      notification.error({ message: 'Report history failed to load' });
    } finally {
      setReportHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (historyModalOpen) {
      void loadReportHistory(1);
    }
  }, [historyModalOpen, loadReportHistory]);

  const handleGenerateReport = useCallback(async () => {
    if (!formattedFromDate || !formattedToDate || generatingReport) return;

    setGeneratingReport(true);
    try {
      const response = await generateUserReport({
        type: 'INVOICE_DETAILS_SUMMARY',
        from: formattedFromDate,
        to: formattedToDate,
        ...(scrapCategory ? {
          searchTag: 'SCRAP_ITEM_CATEGORY',
          search: scrapCategory.trim()
        } : {}),
      });
      notification.success({ message: response.data?.message || response.message || 'Report generated successfully' });
      if (historyModalOpen) {
        void loadReportHistory(1);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  }, [formattedFromDate, formattedToDate, generatingReport, historyModalOpen, loadReportHistory, scrapCategory]);

  const handleDownloadExcel = useCallback((row: UserReportRequest) => {
    const downloadUrl = getReportDownloadUrl(row);

    if (!downloadUrl) {
      notification.error({ message: 'Report download failed' });
      return;
    }

    downloadFileFromUrl(downloadUrl, row.dmsDetails?.fileName);
  }, []);

  const historyColumns = useMemo(
    () => reportHistoryColumns(handleDownloadExcel),
    [handleDownloadExcel],
  );

  return (
    <div className="bg-card rounded-xl p-5 shadow-card ">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="min-w-0 text-lg font-semibold text-foreground">Invoice summary</h3>
        <div className="flex shrink-0 items-center gap-2">
          <AppButton
            type="primary"
            loading={generatingReport}
            disabled={!formattedFromDate || !formattedToDate}
            onClick={() => void handleGenerateReport()}
          >
            Generate Report
          </AppButton>
          <AppTooltip title="Report History">
            <AppButton
              icon={<HistoryOutlined />}
              aria-label="Open report history"
              onClick={() => setHistoryModalOpen(true)}
            />
          </AppTooltip>
        </div>
        {/* <div className="flex shrink-0 items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Material Details
            </label>
            <Select
              mode="multiple"
              value={selectedMaterialIds}
              onChange={setSelectedMaterialIds}
              options={materialSelectOptions}
              placeholder="Select materials"
              maxTagCount="responsive"
              style={{ width: 220 }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Date From
            </label>
            <DatePicker
              value={dateFrom ? dayJs(dateFrom) : null}
              onChange={(date) => handleDateChange('from', date)}
              format={SECTION_DATE_FORMAT}
              style={{ width: 140, height: 35 }}
              allowClear={false}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Date To
            </label>
            <DatePicker
              value={dateTo ? dayJs(dateTo) : null}
              onChange={(date) => handleDateChange('to', date)}
              format={SECTION_DATE_FORMAT}
              style={{ width: 140, height: 35 }}
              allowClear={false}
            />
          </div>
        </div> */}
      </div>
      <AppTable<DispatchInvoiceRow>
        columns={columns}
        dataSource={rows}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          showTotal: (count) => `Total ${count} invoices`,
          onChange: (nextPage) => void loadPage(nextPage),
          hideOnSinglePage: true,
        }}
      />
      <AppModal
        title="Report History"
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        footer={null}
        width={720}
      >
        <AppTable<UserReportRequest>
          columns={historyColumns}
          dataSource={reportHistory.list ?? []}
          loading={reportHistoryLoading}
          pagination={{
            current: reportHistory.pageNo ?? 1,
            pageSize: REPORT_HISTORY_PAGE_SIZE,
            total: reportHistory.fullCount ?? ((reportHistory.lastPage ?? 0) * REPORT_HISTORY_PAGE_SIZE),
            responsive: true,
            hideOnSinglePage: true,
            showSizeChanger: false,
            onChange: (nextPage) => void loadReportHistory(nextPage),
          }}
          rowKey={(record, index) => String(record.id ?? index)}
        />
      </AppModal>
    </div>
  );
};

export default DispatchInvoiceDetails;
