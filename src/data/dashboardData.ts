// Dashboard data extracted from Excel file - Complete Dataset with all 21 materials

export interface FilterState {
  dateFrom: Date;
  dateTo: Date;
  plant: string;
  targetMarket: string;
  sourcedFromELV: string;
  materials: string[];
}

export const defaultFilters: FilterState = {
  dateFrom: new Date('2026-01-01'),
  dateTo: new Date('2026-01-31'),
  plant: 'All',
  targetMarket: 'Domestic',
  sourcedFromELV: 'Yes',
  materials: ['Steel', 'Aluminium', 'Copper', 'Plastic'],
};

export const filterOptions = {
  plants: ['All', 'Gurgaon', 'Manesar', 'Gujarat'],
  targetMarkets: ['Domestic', 'Export'],
  sourcedFromELV: ['Yes', 'No'],
  // All 21 materials from the screenshot
  allMaterials: [
    'Steel',
    'Aluminium',
    'Copper',
    'Plastic',
    'Glass',
    'Paper',
    'Textile',
    'E-Waste',
    'Battery',
    'Used Oil',
    'Rubber',
    'Cast Iron',
    'Black Mass',
    'Platinum/Palladium',
    'Freon',
    'Foam',
    'Lead',
    'Mix',
    'Lead Acid Battery',
    'Waste',
    'Zinc',
  ],
};

// ============================================
// TAB 1: MSIL (Corporate) Data - All 21 Materials
// ============================================

export interface MaterialTarget {
  material: string;
  target: number;
  achieved: number;
  percentage: number;
  unit: string;
  targetMarket: string;
  financialYear: string;
  plant: string;
  sourcedFromELV: string;
}

// All 21 materials with comprehensive data
export const materialTargets: MaterialTarget[] = [
  { material: 'Steel', target: 1000, achieved: 100, percentage: 10.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Aluminium', target: 500, achieved: 45, percentage: 9.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Copper', target: 300, achieved: 28, percentage: 9.33, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'Plastic', target: 800, achieved: 50, percentage: 6.25, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Glass', target: 400, achieved: 35, percentage: 8.75, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Paper', target: 200, achieved: 18, percentage: 9.00, unit: 'MT', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { material: 'Textile', target: 150, achieved: 12, percentage: 8.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'E-Waste', target: 250, achieved: 22, percentage: 8.80, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Battery', target: 180, achieved: 15, percentage: 8.33, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Used Oil', target: 120, achieved: 10, percentage: 8.33, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { material: 'Rubber', target: 350, achieved: 30, percentage: 8.57, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'Cast Iron', target: 500, achieved: 40, percentage: 8.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Black Mass', target: 100, achieved: 8, percentage: 8.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Platinum/Palladium', target: 50, achieved: 4, percentage: 8.00, unit: 'KG', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Freon', target: 80, achieved: 6, percentage: 7.50, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'No' },
  { material: 'Foam', target: 220, achieved: 18, percentage: 8.18, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Lead', target: 160, achieved: 13, percentage: 8.13, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Mix', target: 300, achieved: 25, percentage: 8.33, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Lead Acid Battery', target: 200, achieved: 10, percentage: 5.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'Waste', target: 400, achieved: 35, percentage: 8.75, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { material: 'Zinc', target: 140, achieved: 12, percentage: 8.57, unit: 'MT', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
];

export interface ModelRecycledContent {
  model: string;
  recycledContentPercent: number;
  status: 'compliant' | 'warning' | 'critical';
  targetMarket: string;
  financialYear: string;
  plant: string;
}

export const modelRecycledContent: ModelRecycledContent[] = [
  { model: 'Fronx', recycledContentPercent: 0.010, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { model: 'Wagon-R', recycledContentPercent: 0.005, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar' },
  { model: 'Alto', recycledContentPercent: 0.008, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { model: 'Super Carry', recycledContentPercent: 0.004, status: 'compliant', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat' },
  { model: 'Swift', recycledContentPercent: 0.012, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { model: 'Baleno', recycledContentPercent: 0.009, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar' },
  { model: 'Dzire', recycledContentPercent: 0.007, status: 'compliant', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gurgaon' },
  { model: 'Ertiga', recycledContentPercent: 0.011, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat' },
];

export interface PartRecycledContent {
  part: string;
  recycledContentPercent: number;
  targetMarket: string;
  financialYear: string;
  plant: string;
}

export const partRecycledContent: PartRecycledContent[] = [
  { part: 'Front Bumper', recycledContentPercent: 0.50, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { part: 'Rear Bumper', recycledContentPercent: 0.40, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { part: 'Dashboard', recycledContentPercent: 0.20, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar' },
  { part: 'Door Panels', recycledContentPercent: 0.50, targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat' },
  { part: 'Wheel Arch', recycledContentPercent: 0.35, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { part: 'Engine Cover', recycledContentPercent: 0.28, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar' },
  { part: 'Fender Liners', recycledContentPercent: 0.45, targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat' },
  { part: 'Trunk Liner', recycledContentPercent: 0.38, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
];

// ============================================
// TAB 2: RVSF (Scrapping & EPR) Data - All Materials
// ============================================

export interface EPRCreditData {
  material: string;
  creditsGenerated: number;
  dispatchVolume: number;
  unit: string;
  targetMarket: string;
  financialYear: string;
  plant: string;
  sourcedFromELV: string;
}

export const eprCreditData: EPRCreditData[] = [
  { material: 'Steel', creditsGenerated: 1245.67, dispatchVolume: 1300, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Aluminium', creditsGenerated: 567.34, dispatchVolume: 600, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Copper', creditsGenerated: 234.56, dispatchVolume: 250, unit: 'MT', targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'Plastic', creditsGenerated: 456.23, dispatchVolume: 500, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Glass', creditsGenerated: 178.90, dispatchVolume: 200, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Paper', creditsGenerated: 89.12, dispatchVolume: 100, unit: 'MT', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { material: 'Textile', creditsGenerated: 67.45, dispatchVolume: 75, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'E-Waste', creditsGenerated: 145.67, dispatchVolume: 160, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Battery', creditsGenerated: 112.34, dispatchVolume: 120, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Used Oil', creditsGenerated: 78.90, dispatchVolume: 85, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { material: 'Rubber', creditsGenerated: 189.45, dispatchVolume: 200, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'Cast Iron', creditsGenerated: 234.89, dispatchVolume: 250, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Black Mass', creditsGenerated: 45.67, dispatchVolume: 50, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Platinum/Palladium', creditsGenerated: 12.34, dispatchVolume: 15, unit: 'KG', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Freon', creditsGenerated: 34.56, dispatchVolume: 40, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'No' },
  { material: 'Foam', creditsGenerated: 98.76, dispatchVolume: 110, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Lead', creditsGenerated: 87.65, dispatchVolume: 95, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { material: 'Mix', creditsGenerated: 156.78, dispatchVolume: 170, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { material: 'Lead Acid Battery', creditsGenerated: 89.45, dispatchVolume: 100, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { material: 'Waste', creditsGenerated: 234.56, dispatchVolume: 250, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { material: 'Zinc', creditsGenerated: 67.89, dispatchVolume: 75, unit: 'MT', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
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
// TAB 2 (Extended): RVSF Dashboard Data
// ============================================

// RVSF Filter Options
export const rvsfFilterOptions = {
  sources: ['Collection Center', 'Individual'],
  elvMakes: ['Maruti Suzuki', 'Tata Motors', 'Mahindra', 'Honda', 'Hyundai'],
  makeYears: ['2005-06', '2006-07', '2007-08', '2008-09', '2009-10', '2010-11', '2011-12', '2012-13', '2013-14', '2014-15'],
};

// RVSF Summary Statistics
export interface RVSFSummaryStats {
  vehiclesScrapped: number;
  inventory: { value: number; unit: string };
  codGenerated: number;
  msilTestVehiclesScrapped: number;
  collectionCentres: number;
}

export const rvsfSummaryStats: RVSFSummaryStats = {
  vehiclesScrapped: 8542,
  inventory: { value: 45678, unit: 'kg' },
  codGenerated: 5234,
  msilTestVehiclesScrapped: 6128,
  collectionCentres: 47,
};

// Scrap Dispatch Details
export interface ScrapDispatchDetails {
  material: string;
  value: number;
  unit: string;
}

export const scrapDispatchDetails: ScrapDispatchDetails[] = [
  { material: 'Steel', value: 892.5, unit: 'MT/kg' },
  { material: 'Plastic', value: 234.8, unit: 'MT/kg' },
  { material: 'Cast Iron', value: 156.2, unit: 'MT/kg' },
  { material: 'Li-Ion Batteries', value: 45.6, unit: 'MT/kg' },
];

// MSIL Components Dispatch Details
export const msilComponentsDispatchDetails: ScrapDispatchDetails[] = [
  { material: 'Steel', value: 678.3, unit: 'MT/kg' },
  { material: 'Plastic', value: 189.4, unit: 'MT/kg' },
  { material: 'Cast Iron', value: 123.7, unit: 'MT/kg' },
  { material: 'Li-Ion Batteries', value: 34.2, unit: 'MT/kg' },
];

// Monthwise CD (Certificate of Deposit) Generated
export interface MonthwiseCDData {
  month: string;
  value: number;
  color: string;
}

export const monthwiseCDData: MonthwiseCDData[] = [
  { month: 'JUL', value: 810, color: '#ec4899' },
  { month: 'AUG', value: 420, color: '#a855f7' },
  { month: 'SEP', value: 510, color: '#22d3d3' },
  { month: 'OCT', value: 520, color: '#eab308' },
  { month: 'NOV', value: 420, color: '#22c55e' },
  { month: 'DEC', value: 430, color: '#06b6d4' },
];

// MSIL Test Vehicles Scrapped Monthly
export interface MSILTestVehiclesData {
  month: string;
  value: number;
  color: string;
}

export const msilTestVehiclesData: MSILTestVehiclesData[] = [
  { month: 'JAN', value: 680, color: '#ec4899' },
  { month: 'FEB', value: 420, color: '#a855f7' },
  { month: 'MAR', value: 510, color: '#22d3d3' },
  { month: 'APR', value: 560, color: '#eab308' },
  { month: 'MAY', value: 620, color: '#22c55e' },
  { month: 'JUN', value: 580, color: '#06b6d4' },
  { month: 'JUL', value: 490, color: '#3b82f6' },
  { month: 'AUG', value: 430, color: '#f97316' },
  { month: 'SEP', value: 550, color: '#8b5cf6' },
  { month: 'OCT', value: 410, color: '#14b8a6' },
  { month: 'NOV', value: 650, color: '#f59e0b' },
  { month: 'DEC', value: 450, color: '#a1a1aa' },
];

// Fixed Targets
export interface FixedTarget {
  targetYear: string;
  targetVehiclesScrapped: number;
  targetWeightScrapped: string;
}

export const fixedTargets: FixedTarget[] = [
  { targetYear: '2025/2026', targetVehiclesScrapped: 12500, targetWeightScrapped: '1,20,00,000 kg' },
  { targetYear: '2026/2027', targetVehiclesScrapped: 15000, targetWeightScrapped: '1,50,00,000 kg' },
];

// Vehicle Origin Locations for India Map
export interface VehicleOriginLocation {
  state: string;
  lat: number;
  lng: number;
  density: number; // 1-10 scale
  vehicleCount: number;
}

export const vehicleOriginLocations: VehicleOriginLocation[] = [
  { state: 'Maharashtra', lat: 19.7515, lng: 75.7139, density: 9, vehicleCount: 1250 },
  { state: 'Delhi NCR', lat: 28.7041, lng: 77.1025, density: 10, vehicleCount: 1580 },
  { state: 'Gujarat', lat: 22.2587, lng: 71.1924, density: 8, vehicleCount: 980 },
  { state: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, density: 7, vehicleCount: 820 },
  { state: 'Karnataka', lat: 15.3173, lng: 75.7139, density: 7, vehicleCount: 780 },
  { state: 'Rajasthan', lat: 27.0238, lng: 74.2179, density: 6, vehicleCount: 650 },
  { state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, density: 8, vehicleCount: 920 },
  { state: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, density: 5, vehicleCount: 540 },
  { state: 'West Bengal', lat: 22.9868, lng: 87.855, density: 6, vehicleCount: 620 },
  { state: 'Punjab', lat: 31.1471, lng: 75.3412, density: 5, vehicleCount: 480 },
  { state: 'Haryana', lat: 29.0588, lng: 76.0856, density: 7, vehicleCount: 750 },
  { state: 'Kerala', lat: 10.8505, lng: 76.2711, density: 4, vehicleCount: 380 },
  { state: 'Telangana', lat: 18.1124, lng: 79.0193, density: 6, vehicleCount: 590 },
  { state: 'Andhra Pradesh', lat: 15.9129, lng: 79.74, density: 5, vehicleCount: 520 },
  { state: 'Odisha', lat: 20.9517, lng: 85.0985, density: 3, vehicleCount: 280 },
];

// AI Insights for RVSF
export interface AIInsight {
  id: number;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export const rvsfAIInsights: AIInsight[] = [
  { id: 1, suggestion: 'Increase sourcing from South India (Tamil Nadu, Karnataka, Kerala) to meet Q4 targets - potential 25% increase in collection volume', impact: 'high', category: 'Sourcing' },
  { id: 2, suggestion: 'Partner with 5 additional Collection Centers in Delhi NCR region to capitalize on high vehicle density', impact: 'high', category: 'Partnership' },
  { id: 3, suggestion: 'Optimize logistics routes in Western corridor (Gujarat-Maharashtra) to reduce transportation costs by 15%', impact: 'medium', category: 'Operations' },
  { id: 4, suggestion: 'Focus on pre-2010 vehicle models which have higher scrap value and easier dismantling process', impact: 'medium', category: 'Strategy' },
  { id: 5, suggestion: 'Implement predictive maintenance scheduling for RVSF equipment to reduce downtime by 20%', impact: 'low', category: 'Maintenance' },
];

// Steel EPR Credits Status
export interface SteelEPRCreditsStatus {
  creditsGenerated: number;
  unit: string;
  linkedToDispatch: boolean;
  cpcbPortalUrl: string;
}

export const steelEPRCreditsStatus: SteelEPRCreditsStatus = {
  creditsGenerated: 892.5,
  unit: 'MT',
  linkedToDispatch: false,
  cpcbPortalUrl: 'https://cpcb.nic.in',
};

// ============================================
// TAB 3: Recyclers (Material Processing) Data
// ============================================

export interface PlasticBreakdown {
  type: string;
  quantity: number;
  percentage: number;
  color: string;
  targetMarket: string;
  financialYear: string;
  plant: string;
}

export const plasticBreakdown: PlasticBreakdown[] = [
  { type: 'Painted Plastic', quantity: 50, percentage: 50, color: '#10b981', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { type: 'Unpainted Plastic', quantity: 40, percentage: 40, color: '#3b82f6', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar' },
  { type: 'PP (Polypropylene)', quantity: 10, percentage: 10, color: '#f59e0b', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat' },
];

export interface RecyclerStats {
  metric: string;
  value: number;
  unit: string;
  targetMarket: string;
  financialYear: string;
  plant: string;
}

export const recyclerStats: RecyclerStats[] = [
  { metric: 'Recycled Material Weight', value: 5.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { metric: 'Total Material Supplied', value: 100.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { metric: 'Yield Percentage', value: 5.00, unit: '%', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
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
  targetMarket: string;
  financialYear: string;
  plant: string;
  sourcedFromELV: string;
}

export const componentData: ComponentData[] = [
  { partName: 'Front Bumper', quantity: 80, unit: 'Nos.', recycledWeight: 2.0, totalWeight: 40, ecoScore: 5.0, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { partName: 'Rear Bumper', quantity: 70, unit: 'Nos.', recycledWeight: 1.5, totalWeight: 35, ecoScore: 4.3, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { partName: 'Interior Parts', quantity: 15, unit: 'Nos.', recycledWeight: 1.5, totalWeight: 25, ecoScore: 6.0, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { partName: 'Dashboard Panel', quantity: 45, unit: 'Nos.', recycledWeight: 1.2, totalWeight: 30, ecoScore: 4.0, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
  { partName: 'Door Trim', quantity: 120, unit: 'Nos.', recycledWeight: 2.8, totalWeight: 48, ecoScore: 5.8, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No' },
  { partName: 'Wheel Arch Liner', quantity: 90, unit: 'Nos.', recycledWeight: 1.8, totalWeight: 36, ecoScore: 5.0, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes' },
  { partName: 'Engine Cover', quantity: 55, unit: 'Nos.', recycledWeight: 1.0, totalWeight: 22, ecoScore: 4.5, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
  { partName: 'Trunk Liner', quantity: 65, unit: 'Nos.', recycledWeight: 1.3, totalWeight: 26, ecoScore: 5.0, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes' },
];

export const supplierSummary = {
  recycledMaterialWeight: 5.00,
  totalMaterialSupplied: 100.00,
  totalComponents: 540,
};

// ============================================
// Chart Data for Trends (All Tabs)
// ============================================

export const materialTrendData = [
  { month: 'Apr', steel: 100, plastic: 50, castIron: 40, aluminium: 45, copper: 28, glass: 35, rubber: 30 },
  { month: 'May', steel: 150, plastic: 80, castIron: 55, aluminium: 68, copper: 42, glass: 52, rubber: 45 },
  { month: 'Jun', steel: 220, plastic: 120, castIron: 75, aluminium: 100, copper: 62, glass: 78, rubber: 67 },
  { month: 'Jul', steel: 310, plastic: 170, castIron: 100, aluminium: 140, copper: 88, glass: 110, rubber: 94 },
  { month: 'Aug', steel: 420, plastic: 230, castIron: 130, aluminium: 190, copper: 118, glass: 148, rubber: 128 },
  { month: 'Sep', steel: 550, plastic: 300, castIron: 165, aluminium: 250, copper: 155, glass: 195, rubber: 168 },
  { month: 'Oct', steel: 680, plastic: 380, castIron: 205, aluminium: 320, copper: 198, glass: 248, rubber: 215 },
  { month: 'Nov', steel: 780, plastic: 450, castIron: 250, aluminium: 380, copper: 238, glass: 298, rubber: 258 },
  { month: 'Dec', steel: 850, plastic: 520, castIron: 300, aluminium: 420, copper: 268, glass: 340, rubber: 295 },
  { month: 'Jan', steel: 920, plastic: 600, castIron: 360, aluminium: 465, copper: 290, glass: 375, rubber: 325 },
  { month: 'Feb', steel: 970, plastic: 680, castIron: 420, aluminium: 490, copper: 305, glass: 395, rubber: 348 },
  { month: 'Mar', steel: 1000, plastic: 750, castIron: 480, aluminium: 500, copper: 315, glass: 410, rubber: 365 },
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
  { month: 'Apr', frontBumper: 80, rearBumper: 70, interior: 15, dashboard: 45 },
  { month: 'May', frontBumper: 95, rearBumper: 82, interior: 22, dashboard: 52 },
  { month: 'Jun', frontBumper: 112, rearBumper: 96, interior: 30, dashboard: 60 },
  { month: 'Jul', frontBumper: 130, rearBumper: 112, interior: 38, dashboard: 70 },
  { month: 'Aug', frontBumper: 150, rearBumper: 130, interior: 48, dashboard: 82 },
  { month: 'Sep', frontBumper: 172, rearBumper: 150, interior: 58, dashboard: 95 },
];

// Helper function to get financial year from date
export const getFinancialYear = (date: Date): string => {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month >= 3) { // April onwards
    return `${year}-${(year + 1).toString().slice(2)}`;
  }
  return `${year - 1}-${year.toString().slice(2)}`;
};
