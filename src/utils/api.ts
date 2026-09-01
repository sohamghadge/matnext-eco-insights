import type { ApiResponse } from '@/services/apiClient';
import { get, post } from '@/services/apiMethods';
import { API_ROUTES } from '@/services/apiRoutes';

type FileUploadResponse = ApiResponse<{
  dmsId?: string;
}>;

type OcrPayload = {
  jobType: string;
  source: string;
  dmsId: string;
};

type OcrResponse<T = unknown> = ApiResponse<T>;

export type ScrapSalesAverageRateParams = {
  fromDate: string;
  toDate: string;
  materialType: string;
};

export type topBuyersRateParams = {
  fromDate: string;
  toDate: string;
  materialType: string;
  pageSize: number
};

export type ScrapSalesMetricsParams = ScrapSalesAverageRateParams;

export type InvoiceDetailsListParams = {
  fromDate: string;
  toDate: string;
  pageSize?: number;
};

export type DispatchInvoiceDetailsParams = InvoiceDetailsListParams & {
  materialType?: string;
};

export interface DispatchInvoiceDetailsItem {
  id?: number | null;
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  materialDescription?: string | string[] | null;
  quantity?: number | string | null;
  amount?: number | string | null;
  additionalExpense?: number | string | null;
  finalAmount?: number | string | null;
  ratePerKg?: number | string | null;
}

export interface DispatchInvoiceDetailsData {
  list: DispatchInvoiceDetailsItem[];
  pageNo: number;
  hasMore: boolean;
  lastPage: number;
  fullCount: number;
}

type ScrapSalesAverageRateResponse<T = unknown> = ApiResponse<T>;
type ScrapSalesTotalQuantityResponse<T = unknown> = ApiResponse<T>;
type ScrapSalesTotalValueResponse<T = unknown> = ApiResponse<T>;
type ScrapSalesCategoryDistributionResponse<T = unknown> = ApiResponse<T>;
type ScrapSalesTopBuyersResponse<T = unknown> = ApiResponse<T>;

export interface InvoiceDetailsListItem {
  id?: number | null;
  creationDate?: number | null;
  modificationDate?: number | null;
  ocrManagementId?: number | null;
  scrapId?: number | null;
  userId?: number | null;
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  deliveryNote?: string | null;
  ewayBillNumber?: string | null;
  buyersOrderNumber?: string | null;
  shipTo?: string | null;
  billTo?: string | null;
  dispatchedThrough?: string | null;
  scrapItemCategory?: string | null;
  materialDescription?: string | string[] | null;
  hsnSac?: string | null;
  quantity?: number | string | null;
  unitOfMeasurement?: string | null;
  ratePerKg?: number | string | null;
  grossAmount?: number | string | null;
  taxableValue?: number | string | null;
  igstRateAmount?: number | string | null;
  totalTaxAmount?: number | string | null;
  totalValue?: number | string | null;
  companyPan?: string | null;
  vehicleNumber?: string | null;
  gstNumber?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null;
  delivery_note?: string | null;
  eway_bill_number?: string | null;
  buyers_order_number?: string | null;
  ship_to?: string | null;
  bill_to?: string | null;
  dispatched_through?: string | null;
  scrap_item_category?: string | null;
  material_description?: string | null;
  hsn_sac?: string | null;
  unit_of_measurement?: string | null;
  rate_per_kg?: number | string | null;
  gross_amount?: number | string | null;
  taxable_value?: number | string | null;
  igst_rate_amount?: number | string | null;
  total_tax_amount?: number | string | null;
  company_pan?: string | null;
  vehicle_number?: string | null;
  gst_number?: string | null;
}

export interface InvoiceDetailsListData {
  list: InvoiceDetailsListItem[];
  pageNo: number;
  hasMore: boolean;
  lastPage: number;
  fullCount: number;
}

type InvoiceDetailsListResponse = {
  error: string | null;
  data: InvoiceDetailsListData | null;
};

type DispatchInvoiceDetailsResponse = {
  error: string | null;
  data: DispatchInvoiceDetailsData | null;
};

export const uploadFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await post<FileUploadResponse, FormData>(
    `${API_ROUTES.FILE_UPLOAD}?source=OCR`,
    formData,
    { 'Content-Type': 'multipart/form-data' },
  );
  return response.data?.dmsId;
};

export const getOcrData = async <T = unknown>(payload: OcrPayload): Promise<T | null> => {
  const response = await post<OcrResponse<T>, OcrPayload>(API_ROUTES.OCR, payload);
  return response.data ? response.data : null;
};

export const getInvoiceDetailsList = async (
  pageNo: number,
  params: InvoiceDetailsListParams,
): Promise<InvoiceDetailsListData | null> => {
  const response = await get<InvoiceDetailsListResponse | ApiResponse<InvoiceDetailsListData>>(
    API_ROUTES.INVOICE_DETAILS(pageNo),
    {
      ...params,
      pageSize: params.pageSize ?? 5,
    },
  );

  if ('success' in response) {
    return response.success ? response.data ?? null : null;
  }

  return response.error ? null : response.data ?? null;
};

export const getDispatchInvoiceDetails = async (
  pageNo: number,
  params: DispatchInvoiceDetailsParams,
): Promise<DispatchInvoiceDetailsData | null> => {
  const response = await get<DispatchInvoiceDetailsResponse | ApiResponse<DispatchInvoiceDetailsData>>(
    API_ROUTES.DISPATCH_INVOICE_DETAILS(pageNo),
    {
      ...params,
      pageSize: params.pageSize ?? 5,
    },
  );

  if ('success' in response) {
    return response.success ? response.data ?? null : null;
  }

  return response.error ? null : response.data ?? null;
};

export const getScrapSalesAverageRate = async <T = unknown>(
  params: ScrapSalesMetricsParams,
): Promise<T | null> => {
  const response = await get<ScrapSalesAverageRateResponse<T>>(
    API_ROUTES.SCRAP_SALES_AVERAGE_RATE,
    params,
  );

  return response.data || null;
};

export const getScrapSalesTotalQuantity = async <T = unknown>(
  params: ScrapSalesMetricsParams,
): Promise<T | null> => {
  const response = await get<ScrapSalesTotalQuantityResponse<T>>(
    API_ROUTES.SCRAP_SALES_TOTAL_QUANTITY,
    params,
  );

  return response.data || null;
};

export const getScrapSalesTotalValue = async <T = unknown>(
  params: ScrapSalesMetricsParams,
): Promise<T | null> => {
  const response = await get<ScrapSalesTotalValueResponse<T>>(
    API_ROUTES.SCRAP_SALES_TOTAL_VALUE,
    params,
  );

  return response.data || null;
};

export const getScrapSalesCategoryDistribution = async <T = unknown>(
  params: ScrapSalesMetricsParams,
): Promise<T | null> => {
  const response = await get<ScrapSalesCategoryDistributionResponse<T>>(
    API_ROUTES.SCRAP_SALES_CATEGORY_DISTRIBUTION,
    params,
  );

  return response.data || null;
};

export const getScrapSalesTopBuyers = async <T = unknown>(
  pageNo: number,
  params: topBuyersRateParams,
): Promise<T | null> => {
  const response = await get<ScrapSalesTopBuyersResponse<T>>(
    API_ROUTES.SCRAP_SALES_TOP_BUYERS(pageNo),
    params,
  );

  return response.data || null;
};
