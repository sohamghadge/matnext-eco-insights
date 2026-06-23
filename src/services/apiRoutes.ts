export const API_ROUTES = {
    MATERIAL_LIST: `/user-management/v1/tags`,
    MATERIAL_TARGET_TILE: `/dashboard-management/v1/tiles/materialtype`,
    MATERIAL_TARGET: `/job-management/v1/material-fiscal-year-target`,
    FISCAL_YEAR: `/job-management/v1/fiscalyear`,
    TRIGGER_SHEET: `/dashboard-management/v1/trigger/sheet`,
    USER_REPORTS: (pageNo: number) => `/job-management/v1/userreports/${pageNo}`,
}
