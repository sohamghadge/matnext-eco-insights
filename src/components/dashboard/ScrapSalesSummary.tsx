import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Upload, Table, Button, Modal, Divider, Tag, message, DatePicker } from 'antd';
import type { TableColumnsType } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { InboxOutlined, EyeOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  uploadFile,
  getOcrData,
  getInvoiceDetailsList,
  getScrapSalesAverageRate,
  getScrapSalesCategoryDistribution,
  getScrapSalesTotalQuantity,
  getScrapSalesTotalValue,
  getScrapSalesTopBuyers,
  type InvoiceDetailsListParams,
  type ScrapSalesMetricsParams,
  type InvoiceDetailsListItem,
} from '@/utils/api';
import { dayJs, formatDateToDDMMYYYY } from '@/utils/dayjs';
import type { FilterState } from '@/data/dashboardData';
import type { TagItem } from '@/services/dashboardApi';
import { categoryDistributionColors, materialTypesList, numberFormatting } from './dashboard.description';
import DispatchInvoiceDetails from './DispatchInvoiceDetails';

const { Dragger } = Upload;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_PAGE_SIZE = 5;
const SCRAP_RATE_LINE_COLOR = '#20A35A';
const SECTION_DATE_FORMAT = 'YYYY/MM/DD';

interface InvoiceHistoryRow extends InvoiceDetailsListItem {
  key: string;
}

interface TopBuyer {
  buyerName: string;
  quantityPurchased: number;
  totalPurchaseValue: number;
}

interface ScrapSalesSummaryProps {
  filters: FilterState;
  materialOptions?: TagItem[];
}

type MonthlyMetricPoint = {
  monthYear?: string;
  value?: number;
};

type AverageRateGraphData = {
  averageScrapSaleRate?: number;
  monthlyTrend?: MonthlyMetricPoint[];
};

type TotalQuantityGraphData = {
  totalScrapSaleQuantity?: number;
  quantitySoldOverTime?: number;
};

type TotalValueGraphData = {
  totalScrapSalesValue?: number;
  monthlyTrend?: MonthlyMetricPoint[];
};

type CategoryDistributionItem = {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
};

type TopBuyersGraphData = {
  list: TopBuyer[];
  pageNo: number;
  fullCount: number;
  lastPage: number;
  hasMore: boolean;
  requestToken?: symbol;
};

type CategoryDistributionApiItem = {
  category?: string;
  quantity?: number | string | null;
  percentage?: number;
};

type CategoryDistributionApiResponse = {
  list?: CategoryDistributionApiItem[];
};

type TopBuyersApiResponse = {
  list?: TopBuyer[];
  pageNo?: number;
  fullCount?: number;
  lastPage?: number;
  hasMore?: boolean;
};

type ScrapSalesGraphData = {
  averageRate: AverageRateGraphData;
  totalQuantity: TotalQuantityGraphData;
  totalValue: TotalValueGraphData;
  categoryDistribution: CategoryDistributionItem[];
  topBuyers: TopBuyersGraphData;
};

const INITIAL_GRAPH_DATA: ScrapSalesGraphData = {
  averageRate: {},
  totalQuantity: {},
  totalValue: {},
  categoryDistribution: [],
  topBuyers: {
    list: [],
    pageNo: 1,
    fullCount: 0,
    lastPage: 0,
    hasMore: false,
  },
};

const INITIAL_TOP_BUYERS_DATA: TopBuyersGraphData = {
  list: [],
  pageNo: 1,
  fullCount: 0,
  lastPage: 0,
  hasMore: false,
};

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return 0;

  const parsedValue = Number.parseFloat(String(value).replace(/,/g, ''));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const getField = <T,>(
  camelCaseValue: T | null | undefined,
  snakeCaseValue: T | null | undefined,
  fallback: T,
): T => {
  if (camelCaseValue !== null && camelCaseValue !== undefined) return camelCaseValue;
  if (snakeCaseValue !== null && snakeCaseValue !== undefined) return snakeCaseValue;
  return fallback;
};

const buildScrapSalesMetricsPayload = (
  filters: FilterState,
  dateFrom: Date | null,
  dateTo: Date | null,
  materialOptions: TagItem[],
): ScrapSalesMetricsParams => {
  const selectedMaterials = materialOptions?.filter(v => filters?.materials?.includes(v?.id))?.map(v => v?.name)?.map(v => materialTypesList?.[v] || 'OTHER');
  const materialTypes = [...new Set(selectedMaterials)];
  return {
    fromDate: formatDateToDDMMYYYY(dateFrom) ?? '',
    toDate: formatDateToDDMMYYYY(dateTo) ?? '',
    materialType: materialTypes.join(','),
  };
};

const ScrapSalesSummary = ({ filters, materialOptions = [] }: ScrapSalesSummaryProps) => {
  const [invoices, setInvoices] = useState<InvoiceHistoryRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshingDashboard, setRefreshingDashboard] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceHistoryRow | null>(null);
  const [invoicePage, setInvoicePage] = useState(1);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [graphData, setGraphData] = useState<ScrapSalesGraphData>(INITIAL_GRAPH_DATA);
  const [topBuyersData, setTopBuyersData] = useState<TopBuyersGraphData>(INITIAL_TOP_BUYERS_DATA);
  const topBuyersLoading = Boolean(topBuyersData.requestToken);
  const [invoiceDateFrom, setInvoiceDateFrom] = useState<Date | null>(filters.dateFrom);
  const [invoiceDateTo, setInvoiceDateTo] = useState<Date | null>(filters.dateTo);
  const uploadBatchInProgress = useRef(false);
  // const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setInvoiceDateFrom(filters.dateFrom);
  }, [filters.dateFrom]);

  useEffect(() => {
    setInvoiceDateTo(filters.dateTo);
  }, [filters.dateTo]);

  const invoiceParams = useMemo<InvoiceDetailsListParams | null>(() => {
    const fromDate = formatDateToDDMMYYYY(invoiceDateFrom);
    const toDate = formatDateToDDMMYYYY(invoiceDateTo);

    if (!fromDate || !toDate) return null;

    return {
      fromDate,
      toDate,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, [invoiceDateFrom, invoiceDateTo]);

  const scrapSalesMetricsPayload = useMemo<ScrapSalesMetricsParams | null>(() => {
    const payload = buildScrapSalesMetricsPayload(
      filters,
      invoiceDateFrom,
      invoiceDateTo,
      materialOptions,
    );

    if (!payload.fromDate || !payload.toDate) return null;

    return payload;
  }, [filters, invoiceDateFrom, invoiceDateTo, materialOptions]);

  const loadInvoiceHistory = useCallback(async (pageNo: number) => {
    if (!invoiceParams) return false;

    setInvoiceLoading(true);
    try {
      const invoiceDetails = await getInvoiceDetailsList(pageNo, invoiceParams);
      if (!invoiceDetails) {
        message.error('Failed to load invoice history');
        return false;
      }

      setInvoices(invoiceDetails.list.map((item, index) => ({
        ...item,
        key: String(item.id ?? `${pageNo}-${getField(item.invoiceNumber, item.invoice_number, 'invoice')}-${index}`),
      })));
      setInvoicePage(invoiceDetails.pageNo || pageNo);
      setPaginationTotal(invoiceDetails.fullCount || 0);

      return true;
    } catch {
      message.error('Failed to load invoice history');
      return false;
    } finally {
      setInvoiceLoading(false);
    }
  }, [invoiceParams]);

  useEffect(() => {
    if (!invoiceParams) {
      setInvoices([]);
      setInvoicePage(1);
      setPaginationTotal(0);
      return;
    }

    void loadInvoiceHistory(1);
  }, [invoiceParams, loadInvoiceHistory]);

  const loadTopBuyers = useCallback(async (pageNo: number) => {
    const requestToken = Symbol('topBuyersRequest');

    if (!scrapSalesMetricsPayload || !filters.materials.length) {
      setTopBuyersData(INITIAL_TOP_BUYERS_DATA);
      return false;
    }

    setTopBuyersData({ ...INITIAL_TOP_BUYERS_DATA, pageNo, requestToken });
    try {
      const topBuyers = await getScrapSalesTopBuyers<TopBuyersApiResponse>(pageNo, { ...scrapSalesMetricsPayload, pageSize: 5 });
      const nextTopBuyersData: TopBuyersGraphData = {
        list: topBuyers?.list ?? [],
        pageNo: topBuyers?.pageNo ?? pageNo,
        fullCount: topBuyers?.fullCount ?? 0,
        lastPage: topBuyers?.lastPage ?? 0,
        hasMore: topBuyers?.hasMore ?? false,
      };

      setTopBuyersData(currentData => (
        currentData.requestToken === requestToken ? nextTopBuyersData : currentData
      ));

      return true;
    } catch (error) {
      console.error('Top Buyers API error:', error);
      setTopBuyersData(currentData => (
        currentData.requestToken === requestToken ? INITIAL_TOP_BUYERS_DATA : currentData
      ));
      return false;
    }
  }, [filters.materials.length, scrapSalesMetricsPayload]);

  const loadScrapSalesMetrics = useCallback(async () => {
    if (!scrapSalesMetricsPayload || !filters.materials.length) {
      setGraphData(INITIAL_GRAPH_DATA);
      setTopBuyersData(INITIAL_TOP_BUYERS_DATA);
      return false;
    }

    try {
      const [
        averageRate,
        totalQuantity,
        totalValue,
        categoryDistribution,
      ] = await Promise.all([
        getScrapSalesAverageRate(scrapSalesMetricsPayload),
        getScrapSalesTotalQuantity(scrapSalesMetricsPayload),
        getScrapSalesTotalValue(scrapSalesMetricsPayload),
        getScrapSalesCategoryDistribution<CategoryDistributionApiResponse>(scrapSalesMetricsPayload),
        loadTopBuyers(1),
      ]);

      const categoryDistributionList: CategoryDistributionItem[] = categoryDistribution?.list?.map(v => ({
        name: v?.category,
        value: toNumber(v?.quantity),
        percentage: v?.percentage,
        color: categoryDistributionColors?.[v?.category],
      })) ?? [];

      setGraphData((prev) => ({
        ...prev,
        averageRate: averageRate ?? {},
        totalQuantity: totalQuantity ?? {},
        totalValue: totalValue ?? {},
        categoryDistribution: categoryDistributionList,
      }));

      return true;
    } catch (error) {
      console.error('Scrap Sales metrics API error:', error);
      return false;
    }
  }, [filters.materials.length, loadTopBuyers, scrapSalesMetricsPayload]);

  useEffect(() => {
    void loadScrapSalesMetrics();
  }, [loadScrapSalesMetrics]);

  useEffect(() => {
    if (!scrapSalesMetricsPayload || !filters.materials.length) {
      setTopBuyersData(INITIAL_TOP_BUYERS_DATA);
    }
  }, [filters.materials.length, scrapSalesMetricsPayload]);

  useEffect(() => {
    if (!selectedInvoice) return;

    const nextSelectedInvoice = invoices.find((invoice) => invoice.key === selectedInvoice.key);
    if (nextSelectedInvoice) {
      setSelectedInvoice(nextSelectedInvoice);
      return;
    }

    setSelectedInvoice(null);
    // setModalOpen(false);
  }, [invoices, selectedInvoice]);

  const processInvoice = useCallback(async (file: File) => {
    const dmsId = await uploadFile(file);
    if (!dmsId) {
      throw new Error('File upload failed');
    }

    const ocrData = await getOcrData({
      jobType: 'RECOVERY',
      source: 'SCRAP_INVOICE',
      dmsId,
    });
    if (!ocrData) {
      throw new Error('Failed to process invoice');
    }

    return ocrData;
  }, []);

  const processInvoiceBatch = useCallback(async (files: RcFile[]) => {
    uploadBatchInProgress.current = true;
    setUploading(true);

    try {
      const results = await Promise.allSettled(files.map(processInvoice));
      const failures = results.filter((result) => result.status === 'rejected');

      if (failures.length > 0) {
        failures.forEach((failure) => {
          const errorMessage = failure.reason instanceof Error
            ? failure.reason.message
            : 'Failed to process invoice';
          message.error(errorMessage);
        });
        return;
      }

      message.success(files.length === 1
        ? 'Invoice processed successfully'
        : `${files.length} invoices processed successfully`);

      setUploading(false);
      setRefreshingDashboard(true);
      await Promise.all([
        loadInvoiceHistory(1),
        loadScrapSalesMetrics(),
      ]);
    } catch {
      message.error('Failed to process invoice');
    } finally {
      setUploading(false);
      setRefreshingDashboard(false);
      uploadBatchInProgress.current = false;
    }
  }, [loadInvoiceHistory, loadScrapSalesMetrics, processInvoice]);

  const handleBeforeUpload = useCallback((file: RcFile, fileList: RcFile[]) => {
    // Ant Design invokes beforeUpload once per file. The first invocation owns
    // the complete selection and coordinates it as one batch.
    if (file.uid !== fileList[0]?.uid || uploadBatchInProgress.current) {
      return Upload.LIST_IGNORE;
    }

    const validFiles = fileList.filter((invoice) => {
      if (invoice.size <= MAX_FILE_SIZE) return true;

      message.warning(`${invoice.name}: File size must be less than 5MB`);
      return false;
    });

    if (validFiles.length > 0) {
      void processInvoiceBatch(validFiles);
    }

    return Upload.LIST_IGNORE;
  }, [processInvoiceBatch]);

  const invoiceColumns: TableColumnsType<InvoiceHistoryRow> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (t: number | null) => t ?? '-' },
    { title: 'Creation Date', dataIndex: 'creationDate', key: 'creationDate', render: (t: number | null) => formatDateToDDMMYYYY(t) ?? '-' },
    { title: 'Modification Date', dataIndex: 'modificationDate', key: 'modificationDate', render: (t: number | null) => formatDateToDDMMYYYY(t) ?? '-' },
    { title: 'OCR Management ID', dataIndex: 'ocrManagementId', key: 'ocrManagementId', render: (t: number | null) => t ?? '-' },
    { title: 'Scrap ID', dataIndex: 'scrapId', key: 'scrapId', render: (t: number | null) => t ?? '-' },
    { title: 'User ID', dataIndex: 'userId', key: 'userId', render: (t: number | null) => t ?? '-' },
    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (t: string) => t || '-' },
    { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate', render: (t: string) => t || '-' },
    { title: 'Delivery Note', dataIndex: 'deliveryNote', key: 'deliveryNote', render: (t: string) => t || '-' },
    { title: 'e-Way Bill Number', dataIndex: 'ewayBillNumber', key: 'ewayBillNumber', render: (t: string) => t || '-' },
    { title: 'Buyers Order Number', dataIndex: 'buyersOrderNumber', key: 'buyersOrderNumber', render: (t: string) => t || '-' },
    {
      title: 'Ship To',
      dataIndex: 'shipTo',
      key: 'shipTo',
      width: 400,
      render: (t: string) => (
        <div className="max-w-[400px] whitespace-normal break-words">
          {t || '-'}
        </div>
      ),
    },
    {
      title: 'Bill To',
      dataIndex: 'billTo',
      key: 'billTo',
      width: 400,
      render: (t: string) => (
        <div className="max-w-[400px] whitespace-normal break-words">
          {t || '-'}
        </div>
      ),
    },
    { title: 'Dispatched Through', dataIndex: 'dispatchedThrough', key: 'dispatchedThrough', render: (t: string) => t || '-' },
    { title: 'Scrap Item Category', dataIndex: 'scrapItemCategory', key: 'scrapItemCategory', render: (t: string) => t || '-' },
    { title: 'Material Description', dataIndex: 'materialDescription', key: 'materialDescription', render: (t: string) => t || '-' },
    { title: 'HSN/SAC', dataIndex: 'hsnSac', key: 'hsnSac', render: (t: string) => t || '-' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: (t: number | string | null | undefined) => t ? toNumber(t).toLocaleString('en-IN') : '-' },
    { title: 'Unit Of Measurement', dataIndex: 'unitOfMeasurement', key: 'unitOfMeasurement', render: (t: string) => t || '-' },
    { title: 'Rate Per Kg', dataIndex: 'ratePerKg', key: 'ratePerKg', render: (t: number | string | null | undefined) => t ? `₹ ${toNumber(t).toLocaleString('en-IN')}` : '-' },
    { title: 'Gross Amount', dataIndex: 'grossAmount', key: 'grossAmount', render: (t: number | string | null | undefined) => t ? `₹ ${toNumber(t).toLocaleString('en-IN')}` : '-' },
    { title: 'Taxable Value', dataIndex: 'taxableValue', key: 'taxableValue', render: (t: number | string | null | undefined) => t ? `₹ ${toNumber(t).toLocaleString('en-IN')}` : '-' },
    { title: 'IGST Rate Amount', dataIndex: 'igstRateAmount', key: 'igstRateAmount', render: (t: number | string | null | undefined) => t ? `₹ ${toNumber(t).toLocaleString('en-IN')}` : '-' },
    { title: 'Total Tax Amount', dataIndex: 'totalTaxAmount', key: 'totalTaxAmount', render: (t: number | string | null | undefined) => t ? `₹ ${toNumber(t).toLocaleString('en-IN')}` : '-' },
    { title: 'Total Amount', dataIndex: 'totalValue', key: 'totalValue', render: (t: number | string | null | undefined) => t != null ? `₹ ${toNumber(t).toLocaleString('en-IN')}` : '-' },
    { title: 'Company PAN', dataIndex: 'companyPan', key: 'companyPan', render: (t: string) => t || '-' },
    { title: 'Vehicle Number', dataIndex: 'vehicleNumber', key: 'vehicleNumber', render: (t: string) => t || '-' },
    { title: 'GST Number', dataIndex: 'gstNumber', key: 'gstNumber', render: (t: string) => t || '-' },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   align: 'center',
    //   fixed: 'right',
    //   width: 80,
    //   render: (_: unknown, record: InvoiceHistoryRow) => (
    //     <div>
    //       <Button
    //         type="link"
    //         icon={<EyeOutlined />}
    //         onClick={() => { setSelectedInvoice(record); setModalOpen(true); }}
    //       />
    //     </div>
    //   ),
    // },
  ];

  // const lineItemColumns: TableColumnsType<InvoiceHistoryRow> = [
  //   { title: 'Category', dataIndex: 'scrapItemCategory', key: 'scrapItemCategory' },
  //   { title: 'Description', dataIndex: 'materialDescription', key: 'materialDescription' },
  //   { title: 'HSN/SAC', dataIndex: 'hsnSac', key: 'hsnSac' },
  //   { title: 'Qty', dataIndex: 'quantity', key: 'quantity', render: (v: number | string | null | undefined) => v ? toNumber(v).toLocaleString('en-IN') : '-' },
  //   { title: 'UOM', dataIndex: 'unitOfMeasurement', key: 'unitOfMeasurement' },
  //   { title: 'Rate/Kg', dataIndex: 'ratePerKg', key: 'ratePerKg', render: (v: number | string | null | undefined) => v ? `₹ ${toNumber(v).toLocaleString('en-IN')}` : '-' },
  //   { title: 'Amount', dataIndex: 'grossAmount', key: 'grossAmount', render: (v: number | string | null | undefined) => v ? `₹ ${toNumber(v).toLocaleString('en-IN')}` : '-' },
  // ];

  const buyerColumns: TableColumnsType<TopBuyer> = [
    { title: 'Buyer Name', dataIndex: 'buyerName', key: 'name' },
    { title: 'Quantity Purchased', dataIndex: 'quantityPurchased', key: 'quantity', render: (v: number) => numberFormatting(v) },
    { title: 'Total Purchased Value', dataIndex: 'totalPurchaseValue', key: 'value', render: (v: number) => numberFormatting(v) },
  ];

  const isSingleCategoryDistribution = graphData?.categoryDistribution?.length === 1;
  const handleInvoiceDateChange = (key: 'from' | 'to', value: Dayjs | null) => {
    const nextDate = value ? value.toDate() : null;

    if (key === 'from') {
      setInvoiceDateFrom(nextDate);
      return;
    }

    setInvoiceDateTo(nextDate);
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Upload Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border overflow-hidden">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="min-w-0 text-lg font-semibold text-foreground">Scrap Sales Summary - Invoice Upload</h3>
          <div className="flex shrink-0 items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
                Date From
              </label>
              <DatePicker
                value={invoiceDateFrom ? dayJs(invoiceDateFrom) : null}
                onChange={(date) => handleInvoiceDateChange('from', date)}
                format={SECTION_DATE_FORMAT}
                style={{ width: 140 }}
                allowClear={false}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
                Date To
              </label>
              <DatePicker
                value={invoiceDateTo ? dayJs(invoiceDateTo) : null}
                onChange={(date) => handleInvoiceDateChange('to', date)}
                format={SECTION_DATE_FORMAT}
                style={{ width: 140 }}
                allowClear={false}
              />
            </div>
          </div>
        </div>
        <Dragger
          name="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          disabled={uploading || refreshingDashboard}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">
            {uploading
              ? 'Processing invoices...'
              : refreshingDashboard
                ? 'Refreshing dashboard...'
                : 'Click or drag scrap sales invoices (PDF, JPG, PNG)'}
          </p>
        </Dragger>

        <DispatchInvoiceDetails materialOptions={materialOptions} sourceData={invoices.length ? invoices?.slice(0, 3) : []} />

        <div className="mt-6 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invoice History</h3>
          <div className="w-full overflow-x-auto">
            <Table
              columns={invoiceColumns}
              dataSource={invoices.length ? invoices : []}
              rowKey="key"
              loading={invoiceLoading}
              size="middle"
              bordered
              scroll={{ x: 'max-content' }}
              pagination={{
                current: invoicePage,
                total: paginationTotal,
                pageSize: DEFAULT_PAGE_SIZE,
                hideOnSinglePage: true,
                showSizeChanger: false,
                onChange: (page) => {
                  void loadInvoiceHistory(page);
                },
              }}
            />
          </div>
        </div>

      </div>

      {/* KPI Section */}
      {/* {kpi && ( */}
      <>
        {/* KPI Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-800">Avg Scrap Sale Rate</p>
              <p className="text-2xl font-bold text-blue-700">₹ {kpi?.avgRate?.toFixed(2)} /Kg</p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">Avg Monthly Quantity</p>
              <p className="text-2xl font-bold text-amber-700">{kpi?.avgMonthlyQty?.toFixed(2)} Kg</p>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-800">Total Scrap Sales Value</p>
              <p className="text-2xl font-bold text-emerald-700">₹ {kpi?.totalValue?.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-500 rounded-xl p-4 text-center">
              <p className="text-sm text-purple-800">Total Invoices</p>
              <p className="text-2xl font-bold text-purple-700">{paginationTotal}</p>
            </div>
          </div> */}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Scrap Sale Rate */}
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Average Scrap Sale Rate</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData?.averageRate ? graphData?.averageRate?.monthlyTrend?.map(v => ({ month: v?.monthYear, rate: v?.value })) : []} margin={{ top: 12, right: 16, left: -24, bottom: 0 }}>
                  <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#8B95A7' }}
                    dy={10}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    cursor={{ stroke: SCRAP_RATE_LINE_COLOR, strokeOpacity: 0.14, strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #DDF4E6',
                      boxShadow: '0 12px 30px rgba(32, 163, 90, 0.10)',
                    }}
                    formatter={(v: number) => [`₹ ${v}`, 'Average Rate/Kg']}
                  />
                  <Line
                    type="natural"
                    dataKey="rate"
                    name="Average Rate/Kg"
                    stroke={SCRAP_RATE_LINE_COLOR}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    activeDot={{
                      r: 5,
                      fill: SCRAP_RATE_LINE_COLOR,
                      stroke: '#E9F8EF',
                      strokeWidth: 3,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5">
              <p className="text-sm font-medium text-emerald-900">Average Scrap Sale Rate</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-700">
                ₹ {numberFormatting(graphData?.averageRate?.averageScrapSaleRate)}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Total Scrap Sales Value</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData?.totalValue?.monthlyTrend?.map(v => ({ month: v?.monthYear, tax: v?.value }))} margin={{ top: 12, right: 16, left: -24, bottom: 0 }}>
                  <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#8B95A7' }}
                    dy={10}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    cursor={{ stroke: SCRAP_RATE_LINE_COLOR, strokeOpacity: 0.14, strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #DDF4E6',
                      boxShadow: '0 12px 30px rgba(32, 163, 90, 0.10)',
                    }}
                    formatter={(v: number) => [`₹ ${numberFormatting(v)}`, 'Total Tax Amount']}
                  />
                  <Line
                    type="natural"
                    dataKey="tax"
                    name="Total Tax Amount"
                    stroke={SCRAP_RATE_LINE_COLOR}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    activeDot={{
                      r: 5,
                      fill: SCRAP_RATE_LINE_COLOR,
                      stroke: '#E9F8EF',
                      strokeWidth: 3,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5">
              <p className="text-sm font-medium text-emerald-900">Total Tax Amount</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-700">
                ₹ {numberFormatting(graphData?.totalValue?.totalScrapSalesValue || 0)}
              </p>
            </div>
          </div>

          {/* Rate/Kg Analysis */}
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Total Scrap Sale Quantity</h3>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5">
              <p className="text-sm font-medium text-emerald-900">Total Scrap Sale Quantity (KG)</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-700">
                {numberFormatting(graphData?.totalQuantity?.totalScrapSaleQuantity || 0)}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card border border-border flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Scrap Category Distribution (KG)</h3>
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-[420px] space-y-4">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={graphData?.categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={72}
                        outerRadius={108}
                        paddingAngle={isSingleCategoryDistribution ? 0 : 1.5}
                        cornerRadius={isSingleCategoryDistribution ? 0 : 6}
                        startAngle={90}
                        endAngle={-270}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        labelLine={false}
                      >
                        {graphData?.categoryDistribution?.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [`${numberFormatting(value)} KG`, 'Quantity']}
                      />
                      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-[18px] font-semibold">
                        {numberFormatting(graphData?.categoryDistribution?.reduce((sum, item) => sum + item.value, 0) || 0)}
                      </text>
                      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[11px] font-medium">
                        KG
                      </text>
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        layout="horizontal"
                        iconType="circle"
                        formatter={(value) => {
                          const item = graphData?.categoryDistribution?.find((category) => category.name === value);
                          return `${value.replace(' Scrap', '')} ${item ? `${item.percentage}%` : ''}`;
                        }}
                        wrapperStyle={{
                          paddingTop: '12px',
                          fontSize: '12px',
                          color: '#475569',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Top Buyers */}
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Buyers</h3>
            <Table
              columns={buyerColumns}
              dataSource={topBuyersData.list}
              rowKey="buyerName"
              size="small"
              loading={topBuyersLoading}
              pagination={{
                current: topBuyersData.pageNo,
                total: topBuyersData.fullCount,
                pageSize: DEFAULT_PAGE_SIZE,
                hideOnSinglePage: true,
                showSizeChanger: false,
                onChange: (page) => {
                  void loadTopBuyers(page);
                },
              }}
              bordered
            />
          </div>

          {/* <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Benchmarking</h3>

          </div> */}
        </div>
      </>
      {/* )} */}

      {/* Invoice Detail Modal */}
      {/* <Modal
        title={
          'Invoice: ' + (selectedInvoice?.invoiceNumber || '-')
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><strong>Invoice Number:</strong> {selectedInvoice.invoiceNumber || '-'}</div>
              <div><strong>Date:</strong> {selectedInvoice.invoiceDate || '-'}</div>
              <div><strong>Delivery Note:</strong> {selectedInvoice.deliveryNote || '-'}</div>
              <div><strong>e-Way Bill:</strong> {selectedInvoice.ewayBillNumber || '-'}</div>
              <div><strong>Buyer's Order:</strong> {selectedInvoice.buyersOrderNumber || '-'}</div>
              <div><strong>Ship To:</strong> {selectedInvoice.shipTo || '-'}</div>
              <div><strong>Bill To:</strong> {selectedInvoice.billTo || '-'}</div>
              <div><strong>Dispatched Via:</strong> {selectedInvoice.dispatchedThrough || '-'}</div>
              <div><strong>Vehicle No:</strong> {selectedInvoice.vehicleNumber || '-'}</div>
              <div><strong>PAN:</strong> {selectedInvoice.companyPan || '-'}</div>
              <div><strong>GST No:</strong> {selectedInvoice.gstNumber || '-'}</div>
            </div>

            <Divider />
            <h4 className="font-semibold">Line Items</h4>
            <Table
              columns={lineItemColumns}
              dataSource={[selectedInvoice]}
              rowKey="key"
              pagination={false}
              size="small"
              bordered
            />

            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <strong>Taxable Value:</strong>{' '}
                <Tag color="blue">₹ {toNumber(selectedInvoice.taxableValue).toLocaleString('en-IN')}</Tag>
              </div>
              <div>
                <strong>IGST:</strong>{' '}
                <Tag color="orange">
                  {selectedInvoice.igstRateAmount
                    ? `₹ ${toNumber(selectedInvoice.igstRateAmount).toLocaleString('en-IN')}`
                    : '-'}
                </Tag>
              </div>
              <div>
                <strong>Total Tax:</strong>{' '}
                <Tag color="red">₹ {toNumber(selectedInvoice.totalTaxAmount).toLocaleString('en-IN')}</Tag>
              </div>
            </div>
          </div>
        )}
      </Modal> */}
    </div>
  );
};

export default ScrapSalesSummary;
