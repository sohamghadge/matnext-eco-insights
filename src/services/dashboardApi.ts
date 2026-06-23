import { get, post, patch, del } from "./apiMethods";
import type { ApiResponse } from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

export type DashboardQueryParams = Record<string, unknown>;
export type DashboardPayload = Record<string, unknown>;

export type TagItem =
  | {
    id?: string | number;
    name?: string;
    label?: string;
    value?: string;
    code?: string;
    tagName?: string;
    tagValue?: string;
    displayName?: string;
    description?: string;
  };

export type TagsResponse =
  {
    data?: TagItem[] | { content?: TagItem[]; records?: TagItem[]; items?: TagItem[] };
    content?: TagItem[];
    records?: TagItem[];
    items?: TagItem[];
    list?: TagItem[];
    result?: TagItem[];
  };
export type MaterialTileResp =
  {
    list?: {
      materialTypeId: number;
      materialTypeKey: string;
      quantity: number;
      targetQuantity: number;
    }[];
    pageNo?: number;
    hasMore?: boolean;
    lastPage?: number;
    fullCount?: number;
  };

export type MaterialTileItem = {
  id?: string | number;
  materialTypeId?: string | number;
  material?: string;
  materialName?: string;
  materialType?: string | { id?: string | number; name?: string };
  name?: string;
  target?: number;
  targetQuantity?: number;
  achieved?: number;
  achievedQuantity?: number;
  percentage?: number;
  achievementPercentage?: number;
  unit?: string;
  targetMarket?: string;
  financialYear?: string;
  plant?: string;
  sourcedFromELV?: string | boolean;
  elvSourced?: boolean;
};

export type MaterialTileResponse = {
  data?: MaterialTileItem[] | { content?: MaterialTileItem[]; records?: MaterialTileItem[]; items?: MaterialTileItem[] };
  content?: MaterialTileItem[];
  records?: MaterialTileItem[];
  items?: MaterialTileItem[];
  list?: MaterialTileItem[];
  result?: MaterialTileItem[];
};

export type MaterialTargetUnit = 'MT' | 'KGS' | 'L';

export type MaterialFiscalYearTargetPayload = {
  id?: string | number,
  userId?: string | number;
  materialTypeId: string | number;
  fiscalYear: string;
  unit?: MaterialTargetUnit | string;
  target: number;
};

export type MaterialFiscalYearTarget = MaterialFiscalYearTargetPayload & {
  id?: string | number;
  materialTypeKey?: string;
  materialTypeName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type MaterialTargetListData = {
  list: MaterialFiscalYearTarget[];
  pageNo?: number;
  hasMore?: boolean;
  lastPage?: number;
  fullCount?: number;
};

export type MaterialTargetListResponse = ApiResponse<MaterialTargetListData>;
export type SetMaterialTargetResponse = ApiResponse<MaterialFiscalYearTarget>;
export type DeleteMaterialTargetResponse = ApiResponse<MaterialFiscalYearTarget>;

export type FiscalYearItem = {
  id: string | number;
  year: string | number;
};

export type FiscalYearListData = {
  list: FiscalYearItem[];
  pageNo?: number;
  hasMore?: boolean;
  lastPage?: number;
  fullCount?: number;
};

export type FiscalYearListResponse = ApiResponse<FiscalYearListData>;

export type DashboardSheetType = 'DASHBOARD_MATERIAL_TYPES_TILE_SHEET';

export type DashboardMaterialSheetData = {
  materialTypeId?: string | number;
  materialTypeKey?: string;
  quantity?: number;
  targetQuantity?: number;
} & TagItem;

export type TriggerDashboardSheetPayload = {
  sheetType: DashboardSheetType;
  materialTypeIds: (string | number)[];
  fromDate: string | null;
  toDate: string | null;
  elvSourced: boolean;
  materialData: DashboardMaterialSheetData[];
};

export type TriggerDashboardSheetData = {
  link?: string;
  url?: string;
  fileUrl?: string;
  downloadUrl?: string;
};

export type TriggerDashboardSheetResponse = ApiResponse<TriggerDashboardSheetData | string>;

export type UserReportRequest = {
  id?: string | number;
  startDate?: string;
  fromDate?: string;
  endDate?: string;
  toDate?: string;
  createdDate?: string;
  createdAt?: string;
  status?: string;
  dmsDetails?: {
    fileName?: string;
    fileUrl?: string;
    modificationDate?: string;
  };
  link?: string;
  url?: string;
  fileUrl?: string;
  downloadUrl?: string;
  reportUrl?: string;
  excelUrl?: string;
};

export type PreviousHistoryInfo = {
  fullCount?: number;
  hasMore?: boolean;
  lastPage?: number;
  pageNo?: number;
  list?: UserReportRequest[];
};

export type previousHistoryInf = PreviousHistoryInfo;

export type UserReportsData = {
  list?: UserReportRequest[];
  content?: UserReportRequest[];
  records?: UserReportRequest[];
  items?: UserReportRequest[];
  pageNo?: number;
  hasMore?: boolean;
  lastPage?: number;
  fullCount?: number;
};

export type UserReportsResponse = ApiResponse<UserReportsData | UserReportRequest[]>;

const { MATERIAL_LIST, MATERIAL_TARGET_TILE, MATERIAL_TARGET, FISCAL_YEAR, TRIGGER_SHEET, USER_REPORTS } = API_ROUTES

export const getMaterialType = ({ params }) =>
  get<ApiResponse<TagsResponse>>(MATERIAL_LIST, params);

export const getMaterialTileData = ({ params }: { params: DashboardQueryParams }) =>
  get(MATERIAL_TARGET_TILE, params);

export const getMaterialTarget = ({ params }: { params: DashboardQueryParams }) =>
  get<MaterialTargetListResponse>(MATERIAL_TARGET, params);

export const getFiscalYears = () =>
  get<FiscalYearListResponse>(FISCAL_YEAR);

export const setMaterialTargetApi = (payload: MaterialFiscalYearTargetPayload) =>
  post<SetMaterialTargetResponse, MaterialFiscalYearTargetPayload>(MATERIAL_TARGET, payload);

export const updateMaterialTargetApi = (payload: MaterialFiscalYearTargetPayload) =>
  patch<SetMaterialTargetResponse, MaterialFiscalYearTargetPayload>(MATERIAL_TARGET, payload);

export const deleteMaterialTargetApi = ({ params }: { params: DashboardQueryParams }) =>
  del<DeleteMaterialTargetResponse>(MATERIAL_TARGET, params);

export const triggerDashboardSheetApi = (payload: TriggerDashboardSheetPayload) =>
  post<TriggerDashboardSheetResponse, TriggerDashboardSheetPayload>(TRIGGER_SHEET, payload);

export const getUserReportsApi = ({ params, pageNo }: { params: DashboardQueryParams, pageNo: number }) =>
  get<UserReportsResponse>(USER_REPORTS(pageNo), params);
