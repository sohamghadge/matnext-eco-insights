import * as XLSX from 'xlsx';
import { FilterState, getFinancialYear } from '@/data/dashboardData';

// Helper to format date for export
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generic CSV export
export const exportToCSV = (data: Record<string, unknown>[], filename: string, filters: FilterState) => {
  if (data.length === 0) return;

  // Add filter context as first rows
  const filterContext = [
    { Column: 'Export Date', Value: new Date().toISOString() },
    { Column: 'Date Range', Value: `${formatDate(filters.dateFrom)} to ${formatDate(filters.dateTo)}` },
    { Column: 'Financial Year', Value: getFinancialYear(filters.dateFrom) },
    { Column: 'Plant', Value: filters.plant },
    { Column: 'Target Market', Value: filters.targetMarket },
    { Column: 'Sourced from ELV', Value: filters.sourcedFromELV },
    { Column: 'Selected Materials', Value: filters.materials.join(', ') },
    { Column: '---', Value: '---' },
  ];

  const headers = Object.keys(data[0]);
  const csvRows = [
    '# Filter Settings',
    ...filterContext.map(f => `${f.Column},${f.Value}`),
    '',
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${formatDate(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Excel export with multiple sheets
export const exportToExcel = (
  sheets: { name: string; data: Record<string, unknown>[] }[],
  filename: string,
  filters: FilterState
) => {
  const workbook = XLSX.utils.book_new();

  // Add filter info sheet first
  const filterData = [
    { Setting: 'Export Date', Value: new Date().toISOString() },
    { Setting: 'Date Range From', Value: formatDate(filters.dateFrom) },
    { Setting: 'Date Range To', Value: formatDate(filters.dateTo) },
    { Setting: 'Financial Year', Value: getFinancialYear(filters.dateFrom) },
    { Setting: 'Plant', Value: filters.plant },
    { Setting: 'Target Market', Value: filters.targetMarket },
    { Setting: 'Sourced from ELV', Value: filters.sourcedFromELV },
    { Setting: 'Selected Materials', Value: filters.materials.join(', ') },
  ];
  
  const filterSheet = XLSX.utils.json_to_sheet(filterData);
  XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filter Settings');

  // Add data sheets
  sheets.forEach(sheet => {
    if (sheet.data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      
      // Auto-size columns
      const colWidths = Object.keys(sheet.data[0]).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31)); // Excel sheet name limit
    }
  });

  // Generate and download
  XLSX.writeFile(workbook, `${filename}_${formatDate(new Date())}.xlsx`);
};

// Prepare material targets for export
export const prepareMaterialDataForExport = (
  data: { material: string; target: number; achieved: number; percentage: number; unit: string; targetMarket: string; financialYear: string; plant: string; sourcedFromELV: string }[]
) => {
  return data.map(item => ({
    'Material': item.material,
    'Target (MT)': item.target,
    'Achieved (MT)': item.achieved,
    'Achievement %': `${item.percentage.toFixed(2)}%`,
    'Unit': item.unit,
    'Target Market': item.targetMarket,
    'Financial Year': item.financialYear,
    'Plant': item.plant,
    'Sourced from ELV': item.sourcedFromELV,
  }));
};

// Prepare EPR data for export
export const prepareEPRDataForExport = (
  data: { material: string; creditsGenerated: number; dispatchVolume: number; unit: string; targetMarket: string; financialYear: string; plant: string; sourcedFromELV: string }[]
) => {
  return data.map(item => ({
    'Material': item.material,
    'EPR Credits Generated': item.creditsGenerated.toFixed(2),
    'Dispatch Volume': item.dispatchVolume,
    'Unit': item.unit,
    'Target Market': item.targetMarket,
    'Financial Year': item.financialYear,
    'Plant': item.plant,
    'Sourced from ELV': item.sourcedFromELV,
  }));
};

// Prepare component data for export
export const prepareComponentDataForExport = (
  data: { partName: string; quantity: number; unit: string; recycledWeight: number; totalWeight: number; ecoScore: number; targetMarket: string; financialYear: string; plant: string; sourcedFromELV: string }[]
) => {
  return data.map(item => ({
    'Part Name': item.partName,
    'Quantity': item.quantity,
    'Unit': item.unit,
    'Recycled Weight (MT)': item.recycledWeight,
    'Total Weight (MT)': item.totalWeight,
    'Recycled %': `${((item.recycledWeight / item.totalWeight) * 100).toFixed(2)}%`,
    'Eco-Score': item.ecoScore.toFixed(1),
    'Target Market': item.targetMarket,
    'Financial Year': item.financialYear,
    'Plant': item.plant,
    'Sourced from ELV': item.sourcedFromELV,
  }));
};

// Prepare recycler data for export
export const prepareRecyclerDataForExport = (
  data: { type: string; quantity: number; percentage: number; targetMarket: string; financialYear: string; plant: string }[]
) => {
  return data.map(item => ({
    'Material Type': item.type,
    'Quantity (MT)': item.quantity,
    'Percentage': `${item.percentage}%`,
    'Target Market': item.targetMarket,
    'Financial Year': item.financialYear,
    'Plant': item.plant,
  }));
};

// Prepare model data for export
export const prepareModelDataForExport = (
  data: { model: string; recycledContentPercent: number; status: string; targetMarket: string; financialYear: string; plant: string }[]
) => {
  return data.map(item => ({
    'Model': item.model,
    'Recycled Content %': `${item.recycledContentPercent.toFixed(3)}%`,
    'Status': item.status === 'compliant' ? 'Within Norms' : item.status,
    'Target Market': item.targetMarket,
    'Financial Year': item.financialYear,
    'Plant': item.plant,
  }));
};

// Prepare part data for export
export const preparePartDataForExport = (
  data: { part: string; recycledContentPercent: number; targetMarket: string; financialYear: string; plant: string }[]
) => {
  return data.map(item => ({
    'Part Name': item.part,
    'Recycled Content %': `${item.recycledContentPercent.toFixed(2)}%`,
    'Target Market': item.targetMarket,
    'Financial Year': item.financialYear,
    'Plant': item.plant,
  }));
};
