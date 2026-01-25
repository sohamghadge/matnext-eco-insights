// Dashboard data extracted from Excel file

export interface FilterState {
  year: string;
  month: string;
  plant: string;
  targetMarket: string;
  sourcedFromELV: string;
}

export const defaultFilters: FilterState = {
  year: '2025-26',
  month: 'Apr',
  plant: 'All',
  targetMarket: 'Domestic',
  sourcedFromELV: 'Yes',
};

export const filterOptions = {
  years: ['2024-25', '2025-26', '2026-27'],
  months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  plants: ['All', 'Gurgaon', 'Manesar', 'Gujarat'],
  targetMarkets: ['Domestic', 'Export'],
  sourcedFromELV: ['Yes', 'No'],
};

// MSIL Tab Data
export interface MaterialTarget {
  material: string;
  target: number;
  achieved: number;
  unit: string;
}

export const materialTargets: MaterialTarget[] = [
  { material: 'Steel', target: 1000, achieved: 100, unit: 'MT' },
  { material: 'Plastic', target: 800, achieved: 50, unit: 'MT' },
  { material: 'Cast Iron', target: 500, achieved: 40, unit: 'MT' },
  { material: 'Li-ion', target: 200, achieved: 10, unit: 'MT' },
];

export interface ModelRecycledContent {
  model: string;
  recycledContent: number;
  status: 'compliant' | 'warning' | 'critical';
}

export const modelRecycledContent: ModelRecycledContent[] = [
  { model: 'Fronx', recycledContent: 0.01, status: 'compliant' },
  { model: 'Wagon-R', recycledContent: 0.005, status: 'compliant' },
  { model: 'Alto', recycledContent: 0.008, status: 'compliant' },
  { model: 'Super Carry', recycledContent: 0.004, status: 'compliant' },
];

export interface PartRecycledContent {
  part: string;
  recycledContent: number;
}

export const partRecycledContent: PartRecycledContent[] = [
  { part: 'Front Bumper', recycledContent: 0.5 },
  { part: 'Rear Bumper', recycledContent: 0.4 },
  { part: 'Dashboard', recycledContent: 0.2 },
  { part: 'Door Panels', recycledContent: 0.5 },
];

// RVSF Tab Data
export interface EPRData {
  steelCredits: number;
  linkedWithCPCB: boolean;
  lastSync: string;
}

export const eprData: EPRData = {
  steelCredits: 1245.67,
  linkedWithCPCB: true,
  lastSync: '2025-04-15 14:30:00',
};

// Recyclers Tab Data
export interface PlasticBreakdown {
  type: string;
  quantity: number;
  color: string;
}

export const plasticBreakdown: PlasticBreakdown[] = [
  { type: 'Painted Plastic', quantity: 50, color: '#10b981' },
  { type: 'Unpainted Plastic', quantity: 40, color: '#3b82f6' },
  { type: 'PP', quantity: 10, color: '#f59e0b' },
];

export interface RecyclerStats {
  totalInput: number;
  recycledOutput: number;
  recycledWeight: number;
  totalSupplied: number;
}

export const recyclerStats: RecyclerStats = {
  totalInput: 100,
  recycledOutput: 5,
  recycledWeight: 5,
  totalSupplied: 100,
};

// Suppliers Tab Data
export interface ComponentData {
  partName: string;
  quantity: number;
  recycledWeight: number;
  totalWeight: number;
  ecoScore: number;
}

export const componentData: ComponentData[] = [
  { partName: 'Front Bumper', quantity: 80, recycledWeight: 2, totalWeight: 40, ecoScore: 5 },
  { partName: 'Rear Bumper', quantity: 70, recycledWeight: 1.5, totalWeight: 35, ecoScore: 4.3 },
  { partName: 'Interior Parts', quantity: 15, recycledWeight: 1.5, totalWeight: 25, ecoScore: 6 },
];

// Chart data for trends
export const monthlyTrends = [
  { month: 'Apr', steel: 100, plastic: 50, castIron: 40 },
  { month: 'May', steel: 120, plastic: 55, castIron: 45 },
  { month: 'Jun', steel: 150, plastic: 65, castIron: 50 },
  { month: 'Jul', steel: 180, plastic: 75, castIron: 55 },
  { month: 'Aug', steel: 200, plastic: 80, castIron: 60 },
  { month: 'Sep', steel: 220, plastic: 90, castIron: 65 },
];
