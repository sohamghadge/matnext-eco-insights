// Dashboard data extracted from Excel file - Complete Dataset

export interface FilterState {
  year: string;
  month: string;
  plant: string;
  targetMarket: string;
  sourcedFromELV: string;
  material: string;
}

export const defaultFilters: FilterState = {
  year: '2025-26',
  month: 'Apr',
  plant: 'All',
  targetMarket: 'Domestic',
  sourcedFromELV: 'Yes',
  material: 'All',
};

export const filterOptions = {
  years: ['2024-25', '2025-26', '2026-27'],
  months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  plants: ['All', 'Gurgaon', 'Manesar', 'Gujarat'],
  targetMarkets: ['Domestic', 'Export'],
  sourcedFromELV: ['Yes', 'No'],
  materials: ['All', 'Steel', 'Plastic', 'Cast Iron', 'Li-ion'],
};

// ============================================
// TAB 1: MSIL (Corporate) Data
// ============================================

export interface MaterialTarget {
  material: string;
  target: number;
  achieved: number;
  percentage: number;
  unit: string;
}

export const materialTargets: MaterialTarget[] = [
  { material: 'Steel', target: 1000, achieved: 100, percentage: 10.00, unit: 'MT' },
  { material: 'Plastic', target: 800, achieved: 50, percentage: 6.25, unit: 'MT' },
  { material: 'Cast Iron', target: 500, achieved: 40, percentage: 8.00, unit: 'MT' },
  { material: 'Li-ion Batteries', target: 200, achieved: 10, percentage: 5.00, unit: 'MT' },
];

export interface ModelRecycledContent {
  model: string;
  recycledContentPercent: number;
  status: 'compliant' | 'warning' | 'critical';
}

export const modelRecycledContent: ModelRecycledContent[] = [
  { model: 'Fronx', recycledContentPercent: 0.010, status: 'compliant' },
  { model: 'Wagon-R', recycledContentPercent: 0.005, status: 'compliant' },
  { model: 'Alto', recycledContentPercent: 0.008, status: 'compliant' },
  { model: 'Super Carry', recycledContentPercent: 0.004, status: 'compliant' },
];

export interface PartRecycledContent {
  part: string;
  recycledContentPercent: number;
}

export const partRecycledContent: PartRecycledContent[] = [
  { part: 'Front Bumper', recycledContentPercent: 0.50 },
  { part: 'Rear Bumper', recycledContentPercent: 0.40 },
  { part: 'Dashboard', recycledContentPercent: 0.20 },
  { part: 'Door Panels', recycledContentPercent: 0.50 },
];

// ============================================
// TAB 2: RVSF (Scrapping & EPR) Data
// ============================================

export interface EPRCreditData {
  material: string;
  creditsGenerated: number;
  dispatchVolume: number;
  unit: string;
}

export const eprCreditData: EPRCreditData[] = [
  { material: 'Steel', creditsGenerated: 1245.67, dispatchVolume: 1300, unit: 'MT' },
  { material: 'Plastic', creditsGenerated: 456.23, dispatchVolume: 500, unit: 'MT' },
  { material: 'Cast Iron', creditsGenerated: 234.89, dispatchVolume: 250, unit: 'MT' },
  { material: 'Li-ion Batteries', creditsGenerated: 89.45, dispatchVolume: 100, unit: 'MT' },
];

export interface PortalIntegration {
  portalName: string;
  status: 'linked' | 'pending' | 'error';
  lastSync: string;
  url: string;
}

export const portalIntegrations: PortalIntegration[] = [
  { 
    portalName: 'CPCB Portal', 
    status: 'linked', 
    lastSync: '2025-04-15 14:30:00',
    url: 'https://cpcb.nic.in'
  },
  { 
    portalName: 'VAHAN (Voluntary Vehicle Scrapper)', 
    status: 'linked', 
    lastSync: '2025-04-15 14:25:00',
    url: 'https://vscrap.parivahan.gov.in'
  },
];

// ============================================
// TAB 3: Recyclers (Material Processing) Data
// ============================================

export interface PlasticBreakdown {
  type: string;
  quantity: number;
  percentage: number;
  color: string;
}

export const plasticBreakdown: PlasticBreakdown[] = [
  { type: 'Painted Plastic', quantity: 50, percentage: 50, color: '#10b981' },
  { type: 'Unpainted Plastic', quantity: 40, percentage: 40, color: '#3b82f6' },
  { type: 'PP (Polypropylene)', quantity: 10, percentage: 10, color: '#f59e0b' },
];

export interface RecyclerStats {
  metric: string;
  value: number;
  unit: string;
}

export const recyclerStats: RecyclerStats[] = [
  { metric: 'Recycled Material Weight', value: 5.00, unit: 'MT' },
  { metric: 'Total Material Supplied', value: 100.00, unit: 'MT' },
  { metric: 'Recycling Efficiency', value: 5.00, unit: '%' },
];

export const recyclerSummary = {
  recycledWeight: 5.00,
  totalSupplied: 100.00,
  efficiency: 5.00,
};

// ============================================
// TAB 4: Suppliers (Components) Data
// ============================================

export interface ComponentData {
  partName: string;
  quantity: number;
  unit: string;
  recycledWeight: number;
  totalWeight: number;
  ecoScore: number;
}

export const componentData: ComponentData[] = [
  { partName: 'Front Bumper', quantity: 80, unit: 'Nos.', recycledWeight: 2.0, totalWeight: 40, ecoScore: 5.0 },
  { partName: 'Rear Bumper', quantity: 70, unit: 'Nos.', recycledWeight: 1.5, totalWeight: 35, ecoScore: 4.3 },
  { partName: 'Interior Parts', quantity: 15, unit: 'Nos.', recycledWeight: 1.5, totalWeight: 25, ecoScore: 6.0 },
];

export const supplierSummary = {
  recycledMaterialWeight: 5.00,
  totalMaterialSupplied: 100.00,
  totalComponents: 165,
};

// ============================================
// Chart Data for Trends (All Tabs)
// ============================================

export const materialTrendData = [
  { month: 'Apr', steel: 100, plastic: 50, castIron: 40, liion: 10 },
  { month: 'May', steel: 150, plastic: 80, castIron: 55, liion: 18 },
  { month: 'Jun', steel: 220, plastic: 120, castIron: 75, liion: 28 },
  { month: 'Jul', steel: 310, plastic: 170, castIron: 100, liion: 40 },
  { month: 'Aug', steel: 420, plastic: 230, castIron: 130, liion: 55 },
  { month: 'Sep', steel: 550, plastic: 300, castIron: 165, liion: 72 },
  { month: 'Oct', steel: 680, plastic: 380, castIron: 205, liion: 92 },
  { month: 'Nov', steel: 780, plastic: 450, castIron: 250, liion: 115 },
  { month: 'Dec', steel: 850, plastic: 520, castIron: 300, liion: 140 },
  { month: 'Jan', steel: 920, plastic: 600, castIron: 360, liion: 165 },
  { month: 'Feb', steel: 970, plastic: 680, castIron: 420, liion: 185 },
  { month: 'Mar', steel: 1000, plastic: 750, castIron: 480, liion: 200 },
];

export const eprTrendData = [
  { month: 'Apr', credits: 1245.67 },
  { month: 'May', credits: 1456.32 },
  { month: 'Jun', credits: 1687.45 },
  { month: 'Jul', credits: 1923.78 },
  { month: 'Aug', credits: 2156.12 },
  { month: 'Sep', credits: 2389.56 },
];

export const recyclerTrendData = [
  { month: 'Apr', input: 100, output: 5 },
  { month: 'May', input: 120, output: 6.5 },
  { month: 'Jun', input: 145, output: 8.2 },
  { month: 'Jul', input: 170, output: 10.1 },
  { month: 'Aug', input: 200, output: 12.5 },
  { month: 'Sep', input: 230, output: 15.2 },
];

export const componentTrendData = [
  { month: 'Apr', frontBumper: 80, rearBumper: 70, interior: 15 },
  { month: 'May', frontBumper: 95, rearBumper: 82, interior: 22 },
  { month: 'Jun', frontBumper: 112, rearBumper: 96, interior: 30 },
  { month: 'Jul', frontBumper: 130, rearBumper: 112, interior: 38 },
  { month: 'Aug', frontBumper: 150, rearBumper: 130, interior: 48 },
  { month: 'Sep', frontBumper: 172, rearBumper: 150, interior: 58 },
];
