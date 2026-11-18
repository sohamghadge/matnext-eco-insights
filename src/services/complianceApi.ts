import type { ApiError } from './apiClient';
import { get } from './apiMethods';
import { API_ROUTES } from './apiRoutes';

export type QuantitativeTarget = string | {
    target?: string;
    prediction?: Record<string, string> | null;
} | null;

export interface ComplianceRecord {
    id: number;
    formalName: string;
    countryRegion: string;
    targetYear: string | null;
    status: string;
    material: string | string[] | null;
    quantitativeTarget: QuantitativeTarget;
    officialSource: string | null;
    issuingAuthority: string | null;
    dateOfIssue: string | null;
    effectiveDate: string | null;
    amendmentVersionDate: string | null;
    summaryOfRequirement: string | null;
    applicabilityToAuto: string | null;
    stakeholderRelevance: string | null;
    changeType: string | null;
    previousValue: string | null;
    currentValue: string | null;
    lastVerified: string | null;
    sourceUrl: string | null;
    regulationType: string | null;
}

export type ComplianceData = ComplianceRecord[] | { list: ComplianceRecord[] };

export interface ComplianceResponse {
    data: ComplianceData | null;
    error?: ApiError | null;
    success?: boolean;
    message?: string;
}

export const getComplianceApi = (pageNo: number) =>
    get<ComplianceResponse>(API_ROUTES.COMPLIANCE(pageNo));
