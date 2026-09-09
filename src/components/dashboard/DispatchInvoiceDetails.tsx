import { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TagItem } from '@/services/dashboardApi';
import {
  getDispatchInvoiceDetails,
  type DispatchInvoiceDetailsItem,
  type DispatchInvoiceDetailsParams,
} from '@/utils/api';
import { formatDateToDDMMYYYY } from '@/utils/dayjs';
import { materialTypesList } from './dashboard.description';

const PAGE_SIZE = 5;

interface DispatchInvoiceRow extends DispatchInvoiceDetailsItem {
  key: string;
}

interface DispatchInvoiceDetailsProps {
  materialOptions?: TagItem[];
  dateFrom: Date | null;
  dateTo: Date | null;
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
  { title: 'Qty (Kg)', dataIndex: 'quantity', key: 'quantity', align: 'right', render: (value) => value ? toNumber(value).toLocaleString('en-IN') : '-' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right', render: (value) => value != null ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
  { title: 'Addnl Exp', dataIndex: 'taxableValue', key: 'additionalExpense', align: 'right', render: (value) => value != null ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
  { title: 'Final Amount (INR)', dataIndex: 'totalValue', key: 'finalAmount', align: 'right', render: (value) => value != null ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
  { title: 'Rate Rs/ kg', dataIndex: 'ratePerKg', key: 'ratePerKg', align: 'right', render: (value) => value ? `₹ ${toNumber(value).toLocaleString('en-IN')}` : '-' },
];

const DispatchInvoiceDetails = ({ materialOptions = [], dateFrom, dateTo, refreshKey = 0 }: DispatchInvoiceDetailsProps) => {
  const [rows, setRows] = useState<DispatchInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Array<string | number>>([]);

  const params = useMemo<DispatchInvoiceDetailsParams | null>(() => {
    const formattedFromDate = formatDateToDDMMYYYY(dateFrom);
    const formattedToDate = formatDateToDDMMYYYY(dateTo);
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
      recyclerInvoice: false,
      ...(materialType ? { materialType } : {}),
    };
  }, [dateFrom, dateTo, materialOptions, selectedMaterialIds]);

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

  return (
    <div className="bg-card rounded-xl p-5 shadow-card ">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="min-w-0 text-lg font-semibold text-foreground">Invoice summary</h3>
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
      <Table<DispatchInvoiceRow>
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
    </div>
  );
};

export default DispatchInvoiceDetails;
