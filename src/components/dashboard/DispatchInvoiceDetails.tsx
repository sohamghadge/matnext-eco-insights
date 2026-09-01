import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Select, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TagItem } from '@/services/dashboardApi';
import {
  getDispatchInvoiceDetails,
  type DispatchInvoiceDetailsItem,
  type DispatchInvoiceDetailsParams,
} from '@/utils/api';
import { dayJs, formatDateToDDMMYYYY } from '@/utils/dayjs';
import { materialTypesList } from './dashboard.description';

const PAGE_SIZE = 5;
const SECTION_DATE_FORMAT = 'YYYY/MM/DD';

interface DispatchInvoiceRow extends DispatchInvoiceDetailsItem {
  key: string;
}

interface DispatchInvoiceDetailsProps {
  materialOptions?: TagItem[];
  sourceData?: TagItem[];
}

const getDefaultDateRange = () => {
  const now = new Date();
  const fiscalStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

  return {
    dateFrom: new Date(fiscalStartYear, 3, 1),
    dateTo: new Date(fiscalStartYear + 1, 2, 31),
  };
};

const formatNumber = (value: number | string | null | undefined, currency = false) => {
  if (value == null || value === '') return '-';

  const number = typeof value === 'number' ? value : Number(value.replace(/,/g, ''));
  if (!Number.isFinite(number)) return '-';

  const formatted = number.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return currency ? `₹ ${formatted}` : formatted;
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
  { title: 'Qty (Kg)', dataIndex: 'quantity', key: 'quantity', align: 'right', render: (value) => formatNumber(value) },
  { title: 'Amount', dataIndex: 'grossAmount', key: 'amount', align: 'right', render: (value) => formatNumber(value, true) },
  { title: 'Addnl Exp', dataIndex: 'taxableValue', key: 'additionalExpense', align: 'right', render: (value) => formatNumber(value, true) },
  { title: 'Final Amount (INR)', dataIndex: 'totalTaxAmount', key: 'finalAmount', align: 'right', render: (value) => formatNumber(value, true) },
  { title: 'Rate Rs/ kg', dataIndex: 'ratePerKg', key: 'ratePerKg', align: 'right', render: (value) => formatNumber(value, true) },
];

const DispatchInvoiceDetails = ({ materialOptions = [], sourceData = [] }: DispatchInvoiceDetailsProps) => {
  const defaultDateRange = useMemo(getDefaultDateRange, []);
  const [rows, setRows] = useState<DispatchInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Array<string | number>>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(defaultDateRange.dateFrom);
  const [dateTo, setDateTo] = useState<Date | null>(defaultDateRange.dateTo);

  const materialSelectOptions = useMemo(() => materialOptions.flatMap((option) => {
    if (option.id == null || !option.name) return [];
    return [{ value: option.id, label: option.name }];
  }), [materialOptions]);

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

    // void loadPage(1);
  }, [loadPage, params]);

  const handleDateChange = (key: 'from' | 'to', value: Dayjs | null) => {
    const nextDate = value ? value.toDate() : null;
    if (key === 'from') {
      setDateFrom(nextDate);
      return;
    }
    setDateTo(nextDate);
  };

  return (
    <div className="mt-6 min-w-0">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="min-w-0 text-lg font-semibold text-foreground" > Invoice summary</h3 >
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
      </div >
      <div className="w-full overflow-x-auto">
        <Table<DispatchInvoiceRow>
          columns={columns}
          dataSource={sourceData}
          rowKey="key"
          loading={loading}
          // size="middle"
          scroll={{ x: 900 }}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            // onChange: (nextPage) => void loadPage(nextPage),
          }}
        />
      </div>
    </div >
  );
};

export default DispatchInvoiceDetails;
