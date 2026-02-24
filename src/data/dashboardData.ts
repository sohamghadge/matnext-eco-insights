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
// STAKEHOLDER LISTS
// ============================================
export const rvsfList = ['MSTI Noida', 'ABC Scrapping Facility', 'XYZ Scrapping Facility'];
export const recyclerList = [
  'Peeco Polytech, Sonipat',
  'Peeco Polytech, Panipat',
  'Kingfa Science and Technology Ltd.',
  'Mitsui Prime ACI',
  'Vardhaman Special Steels Limited',
  'Sunflag Steel India'
];
// Supplier list derived from data below

// ============================================
// TAB 1: MSIL (Corporate) Data - All 21 Materials
// ============================================

export const msilCorporateEcoScore = 8.9;

// Helper to determine data multiplier based on date range
// Default range is ~30 days (1 month) -> multiplier 1
const getDataMultiplier = (filters: FilterState): number => {
  const days = (filters.dateTo.getTime() - filters.dateFrom.getTime()) / (1000 * 3600 * 24);
  // Base is 30 days. If 365 days selected, data should be ~12x
  // Adding some randomness
  const base = Math.max(0.1, days / 30);
  // Add +/- 10% randomness so identical ranges don't look EXACTLY same if clicked again (though date usually static)
  // Actually, we want deterministic for same date, but different for slightly different dates.
  return base;
};

// Helper to calculate proration factor based on Annual Targets (365 days)
export const getProrationFactor = (filters: FilterState): number => {
  const days = Math.max(1, (filters.dateTo.getTime() - filters.dateFrom.getTime()) / (1000 * 3600 * 24));
  // Return fraction of year
  return days / 365;
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

// Master Static Data (Internal) to be filtered
const masterMaterialTargets: MaterialTarget[] = [
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
  { material: 'Lithium-Ion Battery', target: 220, achieved: 18, percentage: 8.18, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes' },
];

// Re-export static array for initial state if needed, but components should use get...
export const materialTargets = masterMaterialTargets;

export const getMaterialTargets = (filters: FilterState): MaterialTarget[] => {
  const prorationFactor = getProrationFactor(filters);

  return masterMaterialTargets
    .filter(m => {
      // Basic Filtering
      if (filters.plant !== 'All' && m.plant !== filters.plant) return false;
      return true;
    })
    .map(m => {
      // Treat master data as Annual Targets
      // Prorate target and achieved values
      const proratedTarget = Math.round(m.target * prorationFactor);
      const proratedAchieved = Math.round(m.achieved * prorationFactor);

      return {
        ...m,
        target: proratedTarget,
        achieved: proratedAchieved,
        // Recalculate percentage based on new values
        // Note: Percentage should ideally settle to similar values as both numerator and denominator scale, 
        // but let's calculate fresh to be safe.
        percentage: proratedTarget > 0 ? Math.min(100, (proratedAchieved / proratedTarget) * 100) : 0
      };
    });
};


export interface ModelRecycledContent {
  model: string;
  recycledContentPercent: number;
  // Fields for material-wise breakdown
  steelTarget: number;
  steelAchieved: number;
  aluminumTarget: number;
  aluminumAchieved: number;
  copperTarget: number;
  copperAchieved: number;
  plasticTarget: number;
  plasticAchieved: number;
  status: 'compliant' | 'warning' | 'critical';
  targetMarket: string;
  financialYear: string;
  plant: string;
  ecoScore: number;
}

const masterModelRecycledContent: ModelRecycledContent[] = [
  { model: 'Fronx', recycledContentPercent: 0.010, steelTarget: 20, steelAchieved: 22, aluminumTarget: 10, aluminumAchieved: 12, copperTarget: 5, copperAchieved: 5.5, plasticTarget: 8, plasticAchieved: 7.2, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 8.5 },
  { model: 'Wagon-R', recycledContentPercent: 0.005, steelTarget: 20, steelAchieved: 18, aluminumTarget: 10, aluminumAchieved: 8, copperTarget: 5, copperAchieved: 4.2, plasticTarget: 8, plasticAchieved: 6.5, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', ecoScore: 7.2 },
  { model: 'Alto', recycledContentPercent: 0.008, steelTarget: 20, steelAchieved: 21, aluminumTarget: 10, aluminumAchieved: 9, copperTarget: 5, copperAchieved: 4.8, plasticTarget: 8, plasticAchieved: 7.5, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 7.8 },
  { model: 'Super Carry', recycledContentPercent: 0.004, steelTarget: 15, steelAchieved: 14, aluminumTarget: 8, aluminumAchieved: 7, copperTarget: 4, copperAchieved: 3.5, plasticTarget: 6, plasticAchieved: 5.0, status: 'compliant', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat', ecoScore: 6.5 },
  { model: 'Swift', recycledContentPercent: 0.012, steelTarget: 20, steelAchieved: 24, aluminumTarget: 10, aluminumAchieved: 11, copperTarget: 5, copperAchieved: 5.8, plasticTarget: 8, plasticAchieved: 8.5, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 9.1 },
  { model: 'Baleno', recycledContentPercent: 0.009, steelTarget: 20, steelAchieved: 20, aluminumTarget: 10, aluminumAchieved: 9.5, copperTarget: 5, copperAchieved: 4.5, plasticTarget: 8, plasticAchieved: 7.0, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', ecoScore: 8.0 },
  { model: 'Dzire', recycledContentPercent: 0.007, steelTarget: 20, steelAchieved: 19, aluminumTarget: 10, aluminumAchieved: 8.5, copperTarget: 5, copperAchieved: 4.0, plasticTarget: 8, plasticAchieved: 6.8, status: 'compliant', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 7.5 },
  { model: 'Ertiga', recycledContentPercent: 0.011, steelTarget: 20, steelAchieved: 22, aluminumTarget: 10, aluminumAchieved: 11, copperTarget: 5, copperAchieved: 5.2, plasticTarget: 8, plasticAchieved: 8.0, status: 'compliant', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', ecoScore: 8.8 },
];

export const modelRecycledContent = masterModelRecycledContent;

export const getModelRecycledContent = (filters: FilterState): ModelRecycledContent[] => {
  // Model percentages don't usually scale with time duration, but might fluctuate slightly
  // Filtering by Plant is relevant.
  return masterModelRecycledContent.filter(m => filters.plant === 'All' || m.plant === filters.plant);
};

export interface PartRecycledContent {
  part: string;
  material: string; // New field
  recycledContentPercent: number;
  targetPercent: number; // New field
  targetMarket: string;
  financialYear: string;
  plant: string;
  ecoScore: number;
}

const masterPartRecycledContent: PartRecycledContent[] = [
  { part: 'Front Bumper', material: 'Plastic (PP)', recycledContentPercent: 0.50, targetPercent: 0.45, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 8.2 },
  { part: 'Rear Bumper', material: 'Plastic (PP)', recycledContentPercent: 0.40, targetPercent: 0.45, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 7.5 },
  { part: 'Dashboard', material: 'Plastic (ABS)', recycledContentPercent: 0.20, targetPercent: 0.25, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', ecoScore: 6.0 },
  { part: 'Door Panels', material: 'Plastic (PP)', recycledContentPercent: 0.50, targetPercent: 0.45, targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat', ecoScore: 8.5 },
  { part: 'Wheel Arch', material: 'Plastic (PE)', recycledContentPercent: 0.35, targetPercent: 0.30, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 7.0 },
  { part: 'Engine Cover', material: 'Plastic (PA)', recycledContentPercent: 0.28, targetPercent: 0.30, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', ecoScore: 6.8 },
  { part: 'Fender Liners', material: 'Plastic (PE)', recycledContentPercent: 0.45, targetPercent: 0.40, targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat', ecoScore: 8.0 },
  { part: 'Trunk Liner', material: 'Textile', recycledContentPercent: 0.38, targetPercent: 0.35, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 7.2 },
];

export const partRecycledContent = masterPartRecycledContent;

export const getPartRecycledContent = (filters: FilterState): PartRecycledContent[] => {
  return masterPartRecycledContent.filter(p => filters.plant === 'All' || p.plant === filters.plant);
};

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

// Keep eprCreditData for RVSFTab usage until fully replaced
// Master Static Data for EPR
const masterEprCreditData: EPRCreditData[] = [
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

export const eprCreditData = masterEprCreditData;

export const getEPRCreditData = (filters: FilterState): EPRCreditData[] => {
  const multiplier = getDataMultiplier(filters);
  return masterEprCreditData
    .filter(m => filters.plant === 'All' || m.plant === filters.plant)
    .map(m => ({
      ...m,
      creditsGenerated: Number((m.creditsGenerated * multiplier).toFixed(2)),
      dispatchVolume: Math.round(m.dispatchVolume * multiplier)
    }));
};

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

// Map Data
export interface CollectionCenter {
  id: string;
  location: string;
  state: string;
  type: string;
  lat?: number;
  lng?: number;
}

export const collectionCenters: CollectionCenter[] = [
  { id: 'CC1', location: 'Manesar', state: 'Haryana', type: 'Collection Center', lat: 28.3515, lng: 76.9428 },
  { id: 'CC2', location: 'Pune', state: 'Maharashtra', type: 'Collection Center', lat: 18.5204, lng: 73.8567 },
  { id: 'CC3', location: 'Chennai', state: 'Tamil Nadu', type: 'Collection Center', lat: 13.0827, lng: 80.2707 },
  { id: 'CC4', location: 'Kolkata', state: 'West Bengal', type: 'Collection Center', lat: 22.5726, lng: 88.3639 },
  { id: 'CC5', location: 'Bangalore', state: 'Karnataka', type: 'Collection Center', lat: 12.9716, lng: 77.5946 },
];

export interface RVSFLocation {
  id: string;
  name: string;
  location: string;
  state: string;
  capacity: string;
  lat?: number;
  lng?: number;
}

export const rvsfLocations: RVSFLocation[] = [
  { id: 'RVSF1', name: 'MSTI Noida', location: 'Noida', state: 'Uttar Pradesh', capacity: '1000/month', lat: 28.5355, lng: 77.3910 },
  { id: 'RVSF2', name: 'ABC Scrapping Facility', location: 'Gujarat', state: 'Gujarat', capacity: '800/month', lat: 22.2587, lng: 71.1924 },
  { id: 'RVSF3', name: 'XYZ Scrapping Facility', location: 'Karnataka', state: 'Karnataka', capacity: '600/month', lat: 15.3173, lng: 75.7139 },
];

// RVSF Summary Statistics
export interface RVSFSummaryStats {
  vehiclesScrapped: number;
  inventory: { value: number; unit: string };
  codGenerated: number;
  msilTestVehiclesScrapped: number;
  collectionCentres: number;
  complianceScore: number;
}

const masterRvsfSummaryStats: RVSFSummaryStats = {
  vehiclesScrapped: 6607,
  inventory: { value: 6607, unit: 'Nos' },
  codGenerated: 6607,
  msilTestVehiclesScrapped: 242,
  collectionCentres: 54,
  complianceScore: 8.7,
};

export const rvsfSummaryStats = masterRvsfSummaryStats;

export const getRVSFSummaryStats = (filters: FilterState): RVSFSummaryStats => {
  return {
    ...masterRvsfSummaryStats,
    vehiclesScrapped: masterRvsfSummaryStats.vehiclesScrapped,
    inventory: {
      value: masterRvsfSummaryStats.inventory.value,
      unit: masterRvsfSummaryStats.inventory.unit
    },
    codGenerated: masterRvsfSummaryStats.codGenerated,
    msilTestVehiclesScrapped: masterRvsfSummaryStats.msilTestVehiclesScrapped,
    complianceScore: masterRvsfSummaryStats.complianceScore // Score doesn't scale
  };
};


// RVSF Component Trend Data (Engines, Gearboxes, Axles)
export interface RvsfComponentTrendData {
  month: string;
  engines: number;
  gearboxes: number;
  axles: number;
}

const masterRvsfComponentTrendData: RvsfComponentTrendData[] = [
  { month: 'Jan', engines: 45, gearboxes: 40, axles: 35 },
  { month: 'Feb', engines: 52, gearboxes: 48, axles: 42 },
  { month: 'Mar', engines: 61, gearboxes: 55, axles: 48 },
  { month: 'Apr', engines: 58, gearboxes: 50, axles: 45 },
  { month: 'May', engines: 65, gearboxes: 56, axles: 52 },
  { month: 'Jun', engines: 72, gearboxes: 62, axles: 58 },
  { month: 'Jul', engines: 68, gearboxes: 60, axles: 55 },
  { month: 'Aug', engines: 75, gearboxes: 65, axles: 60 },
  { month: 'Sep', engines: 82, gearboxes: 70, axles: 65 },
  { month: 'Oct', engines: 78, gearboxes: 68, axles: 62 },
  { month: 'Nov', engines: 85, gearboxes: 75, axles: 68 },
  { month: 'Dec', engines: 80, gearboxes: 72, axles: 64 },
];

export const rvsfComponentTrendData = masterRvsfComponentTrendData;

export const getRvsfComponentTrendData = (filters: FilterState): RvsfComponentTrendData[] => {
  const multiplier = getDataMultiplier(filters);
  return masterRvsfComponentTrendData.map(d => ({
    ...d,
    engines: Math.round(d.engines * multiplier),
    gearboxes: Math.round(d.gearboxes * multiplier),
    axles: Math.round(d.axles * multiplier),
  }));
};

// Scrap Dispatch Details
export interface ScrapDispatchDetails {
  material: string;
  value: number;
  unit: string;
  ecoScore: number;
}

const masterScrapDispatchDetails: ScrapDispatchDetails[] = [
  { material: 'Steel', value: 730070, unit: 'Kgs', ecoScore: 9.0 },
  { material: 'Plastic', value: 18684, unit: 'Kgs', ecoScore: 7.5 },
  { material: 'Cast Iron', value: 0, unit: 'Kgs', ecoScore: 8.2 },
  { material: 'Li-Ion Batteries', value: 0, unit: 'Kgs', ecoScore: 9.5 },
  { material: 'Other materials', value: 0, unit: 'Kgs', ecoScore: 0.0 },
];

export const scrapDispatchDetails = masterScrapDispatchDetails;

export const getScrapDispatchDetails = (filters: FilterState): ScrapDispatchDetails[] => {
  const prorationFactor = getProrationFactor(filters);
  return masterScrapDispatchDetails.map(d => ({
    ...d,
    value: Number((d.value * prorationFactor).toFixed(1))
  }));
};

// MSIL Components Dispatch Details (Target vs Actual)
export interface ComponentDispatchData {
  component: string;
  dispatchQuantity: number;
  target: number;
  unit: string;
}

const masterMsilComponentDispatchData: ComponentDispatchData[] = [
  { component: 'Front Bumper', dispatchQuantity: 450, target: 500, unit: 'MT' },
  { component: 'Rear Bumper', dispatchQuantity: 380, target: 420, unit: 'MT' },
  { component: 'Door Panel', dispatchQuantity: 600, target: 650, unit: 'MT' },
  { component: 'Dashboard', dispatchQuantity: 200, target: 250, unit: 'MT' },
  { component: 'Engine Block', dispatchQuantity: 850, target: 900, unit: 'MT' },
  { component: 'Transmission Case', dispatchQuantity: 400, target: 450, unit: 'MT' },
  { component: 'Seats', dispatchQuantity: 300, target: 350, unit: 'MT' },
  { component: 'Headlamps', dispatchQuantity: 150, target: 180, unit: 'MT' },
];

export const msilComponentDispatchData = masterMsilComponentDispatchData;

export const getMSILComponentDispatchData = (filters: FilterState): ComponentDispatchData[] => {
  const prorationFactor = getProrationFactor(filters);
  return masterMsilComponentDispatchData.map(d => ({
    ...d,
    dispatchQuantity: Math.round(d.dispatchQuantity * prorationFactor),
    target: Math.round(d.target * prorationFactor)
  }));
};

// Recycler Plastic Data
export interface RecyclerPlasticData {
  type: string;
  value: number;
  color: string;
  ecoScore: number;
}

const masterRecyclerPlasticData: RecyclerPlasticData[] = [
  { type: 'Polypropylene (PP)', value: 450, color: '#3b82f6', ecoScore: 8.5 },
  { type: 'Polyurethane (PU)', value: 320, color: '#10b981', ecoScore: 7.8 },
  { type: 'ABS', value: 280, color: '#f59e0b', ecoScore: 6.9 },
  { type: 'Polycarbonate (PC)', value: 150, color: '#ec4899', ecoScore: 8.0 },
  { type: 'Others', value: 120, color: '#64748b', ecoScore: 5.5 },
];

// Monthwise CD (Certificate of Deposit) Generated
export interface MonthwiseCDData {
  month: string;
  value: number;
  color: string;
}

const masterMonthwiseCDData: MonthwiseCDData[] = [
  { month: 'JUL', value: 810, color: '#ec4899' },
  { month: 'AUG', value: 420, color: '#a855f7' },
  { month: 'SEP', value: 510, color: '#22d3d3' },
  { month: 'OCT', value: 520, color: '#eab308' },
  { month: 'NOV', value: 420, color: '#22c55e' },
  { month: 'DEC', value: 430, color: '#06b6d4' },
];

export const monthwiseCDData = masterMonthwiseCDData;

export const getMonthwiseCDData = (filters: FilterState): MonthwiseCDData[] => {
  // Return subset based on date range or just scale all?
  // Let's just scale values for now to simulate higher 'volume' in longer periods even though it's month-wise
  // In reality, this should return more months. 
  // Simulating just scaling values for simplicity as we don't have infinite month data
  const multiplier = getDataMultiplier(filters);
  return masterMonthwiseCDData.map(d => ({
    ...d,
    value: Math.round(d.value * multiplier)
  }));
};

// MSIL Test Vehicles Scrapped Monthly
export interface MSILTestVehiclesData {
  month: string;
  value: number;
  color: string;
}

const masterMsilTestVehiclesData: MSILTestVehiclesData[] = [
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

export const msilTestVehiclesData = masterMsilTestVehiclesData;

export const getMSILTestVehiclesData = (filters: FilterState): MSILTestVehiclesData[] => {
  const multiplier = getDataMultiplier(filters);
  return masterMsilTestVehiclesData.map(d => ({
    ...d,
    value: Math.round(d.value * multiplier)
  }));
};

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

const masterVehicleOriginLocations: VehicleOriginLocation[] = [
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

export const vehicleOriginLocations = masterVehicleOriginLocations;

export const getVehicleOriginLocations = (filters: FilterState): VehicleOriginLocation[] => {
  const multiplier = getDataMultiplier(filters);
  return masterVehicleOriginLocations.map(d => ({
    ...d,
  }));
};

// Material Collection Data for Map
export interface MaterialCollectionLocation {
  state: string;
  lat: number;
  lng: number;
  steel: number; // MT
  plastic: number; // MT
  rubber: number; // MT
  glass: number; // MT
  total: number; // MT
}

const masterMaterialCollectionLocations: MaterialCollectionLocation[] = [
  { state: 'Maharashtra', lat: 19.7515, lng: 75.7139, steel: 4500, plastic: 1200, rubber: 500, glass: 300, total: 6500 },
  { state: 'Delhi NCR', lat: 28.7041, lng: 77.1025, steel: 5200, plastic: 1800, rubber: 700, glass: 400, total: 8100 },
  { state: 'Gujarat', lat: 22.2587, lng: 71.1924, steel: 3800, plastic: 900, rubber: 400, glass: 200, total: 5300 },
  { state: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, steel: 3200, plastic: 850, rubber: 350, glass: 180, total: 4580 },
  { state: 'Karnataka', lat: 15.3173, lng: 75.7139, steel: 2900, plastic: 750, rubber: 300, glass: 150, total: 4100 },
  { state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, steel: 3500, plastic: 950, rubber: 450, glass: 220, total: 5120 },
  { state: 'Haryana', lat: 29.0588, lng: 76.0856, steel: 2800, plastic: 700, rubber: 320, glass: 160, total: 3980 },
  { state: 'West Bengal', lat: 22.9868, lng: 87.855, steel: 2100, plastic: 550, rubber: 250, glass: 120, total: 3020 },
];

export const materialCollectionLocations = masterMaterialCollectionLocations;

export const getMaterialCollectionData = (filters: FilterState): MaterialCollectionLocation[] => {
  const multiplier = getDataMultiplier(filters);
  return masterMaterialCollectionLocations.map(d => ({
    ...d,
    steel: Math.round(d.steel * multiplier),
    plastic: Math.round(d.plastic * multiplier),
    rubber: Math.round(d.rubber * multiplier),
    glass: Math.round(d.glass * multiplier),
    total: Math.round(d.total * multiplier)
  }));
};

// AI Insights for RVSF
export interface AIInsight {
  id: number;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  source: string;
  reasoning: string;
}

export const msilAIInsights: AIInsight[] = [
  { id: 1, suggestion: 'Analysis of CBAM and new EU-India FTA indicates rising compliance costs. Recommendation: Increase sourcing from Green-Certified Tier 1s by 15% to offset carbon tax liabilities.', impact: 'high', category: 'Compliance', source: 'European Commission Trade Policy 2024', reasoning: 'Projected carbon tax impact on non-green steel imports exceeds 18% margin threshold.' },
  { id: 2, suggestion: 'Plastic recycling targets at risk due to supply constraints. Action: Incentivize plastic recyclers to ramp up high-grade output by 20% or onboard 2 new suppliers.', impact: 'high', category: 'Supply Chain', source: 'Internal Supply Chain Audit Q3', reasoning: 'Current supplier capacity utilization is at 95%, unable to meet Q4 demand spike.' },
  { id: 3, suggestion: 'Steel usage efficiency is optimal, but aluminium scrap recovery can improve by 8% through better segregation at source.', impact: 'medium', category: 'Efficiency', source: 'Shop Floor Efficiency Report', reasoning: 'Mixed metal bins contain 12% recoverable aluminium that is currently being downcycled.' },
  { id: 4, suggestion: 'Switching to reusable packaging for "Engine Block" shipments can save 50 tons of waste annually.', impact: 'medium', category: 'Logistics', source: 'Packaging Waste Analysis', reasoning: 'Current single-use wooden pallets are major contributor to packaging waste.' },
];

export const rvsfAIInsights: AIInsight[] = [
  { id: 1, suggestion: 'Regional collection gap detected in South Zone. Action: Establish 3 new collection centers in Karnataka to meet vehicle scrap targets of 5000 units/quarter.', impact: 'high', category: 'Expansion', source: 'Regional Transport Office (RTO) Registration Data', reasoning: 'Vehicle deregistration rate in Karnataka increased by 22% in Q3, but collection remains flat.' },
  { id: 2, suggestion: 'Current vehicle collection run-rate is 15% below target. Initiate "Scrap & Save" marketing campaign in Maharashtra to boost inflow.', impact: 'high', category: 'Acquisition', source: 'Monthly Performance Review', reasoning: 'Competitor activity in Maharashtra has captured 10% of market share in last 2 months.' },
  { id: 3, suggestion: 'Optimize logistics routes in Western corridor (Gujarat-Maharashtra) to reduce transportation costs by 15%', impact: 'medium', category: 'Operations', source: 'Logistics Optimization Algorithm', reasoning: 'Average fuel consumption per ELV collection is 12% higher than national benchmark.' },
  { id: 4, suggestion: 'Deploy mobile shredding units in remote districts of Rajasthan to capture 20% more agricultural vehicle scrap.', impact: 'medium', category: 'Expansion', source: 'Rural Market Analysis', reasoning: 'Farmers in remote areas are retaining old tractors due to high transport cost to nearest RVSF.' },
  { id: 5, suggestion: 'Partner with insurance companies to automate "Total Loss" vehicle handovers, potentially increasing volume by 300 units/month.', impact: 'high', category: 'Partnership', source: 'Insurance Sector Report', reasoning: 'Current manual process causes 45-day delay, leading to value depreciation of wreck.' },
  { id: 6, suggestion: 'Implement rainwater harvesting at Noida facility to reduce water procurement costs by 25% and improve ESG score.', impact: 'low', category: 'Sustainability', source: 'Facility Audit Report', reasoning: 'Noida facility relies 100% on tanker water supply which is cost-inefficient.' },
];

// Helper functions to get vehicle counts for Collection Centers and RVSFs
export const getCollectionCenterVehicles = (center: CollectionCenter, filters: FilterState): number => {
  // Find the corresponding state in vehicleOriginLocations
  const originLocation = vehicleOriginLocations.find(loc => loc.state === center.state);

  if (!originLocation) return 0;

  // Simulation: Collection Centers collect ~40-60% of the state's total vehicles
  // Use a deterministic "random" factor based on ID length to be consistent
  const factor = 0.4 + (center.id.length % 3) * 0.1;

  const multiplier = getDataMultiplier(filters);

  return Math.round(originLocation.vehicleCount * factor * multiplier);
};

export const getRVSFVehicles = (rvsf: RVSFLocation, filters: FilterState): number => {
  // Find the corresponding state in vehicleOriginLocations
  const originLocation = vehicleOriginLocations.find(loc => loc.state === rvsf.state);

  if (!originLocation) return 0;

  // Simulation: RVSFs collect ~70-90% of the state's total vehicles (aggregating from multiple centers)
  // Use a deterministic "random" factor
  const factor = 0.7 + (rvsf.id.length % 3) * 0.1;

  const multiplier = getDataMultiplier(filters);

  return Math.round(originLocation.vehicleCount * factor * multiplier);
};

export const recyclerAIInsights: AIInsight[] = [
  { id: 1, suggestion: 'Scrap usage efficiency is 5% below sector benchmark. Recommendation: Implement advanced optical sorting to increase material purity and yield.', impact: 'high', category: 'Technology', source: 'Industry Benchmark Report 2025', reasoning: 'Competitors using optical sorting achieve 98% purity vs our 93%.' },
  { id: 2, suggestion: 'High demand for Recycled PP detected. Shift processing focus to Polypropylene for next 2 quarters to maximize margin.', impact: 'medium', category: 'Market Strategy', source: 'Market Commodity Trends', reasoning: 'Recycled PP prices have surged 15% whilst LDPE remains stagnant.' },
  { id: 3, suggestion: 'Energy consumption per MT is rising. Audit shredder efficiency and consider solar integration for daytime operations.', impact: 'medium', category: 'Energy', source: 'Energy Audit Q2', reasoning: 'Peak hour energy tariffs have increased by 8%, impacting operational opacity.' },
];

export const supplierAIInsights: AIInsight[] = [
  { id: 1, suggestion: 'CO2 reduction targets for FY26 are at risk. Action: Mandate adoption of Carbon Calculation Methodology for all logistics partners immediately.', impact: 'high', category: 'Sustainability', source: 'Sustainability Goals Tracker', reasoning: 'Scope 3 transport emissions are trending 5% above the reduction glide path.' },
  { id: 2, suggestion: 'Scope 3 emissions reporting shows gaps in Tier 2 data. Deploy digital data collection tool for sub-tier suppliers.', impact: 'high', category: 'Reporting', source: 'ESG Compliance Audit', reasoning: 'Only 40% of Tier 2 suppliers provided verifiable emissions data last quarter.' },
  { id: 3, suggestion: 'Switch to returnable packaging for "Door Trim" components to reduce packaging waste by 40 tons/year.', impact: 'medium', category: 'Circular Economy', source: 'Packaging Waste Analysis', reasoning: 'Single-use cardboard for Door Trims accounts for 15% of total packaging waste volume.' },
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
  ecoScore: number;
}

const masterPlasticBreakdown: PlasticBreakdown[] = [
  { type: 'Painted Plastic', quantity: 50, percentage: 50, color: '#10b981', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', ecoScore: 8.2 },
  { type: 'Unpainted Plastic', quantity: 40, percentage: 40, color: '#3b82f6', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', ecoScore: 7.5 },
  { type: 'Other Plastic Scrap', quantity: 10, percentage: 10, color: '#f59e0b', targetMarket: 'Export', financialYear: '2025-26', plant: 'Gujarat', ecoScore: 6.8 },
];

export const plasticBreakdown = masterPlasticBreakdown;

export const getPlasticBreakdown = (filters: FilterState): PlasticBreakdown[] => {
  const prorationFactor = getProrationFactor(filters);
  return masterPlasticBreakdown.map(d => ({
    ...d,
    quantity: Math.round(d.quantity * prorationFactor)
  }));
};

export interface RecyclerStats {
  metric: string;
  value: number;
  unit: string;
  targetMarket: string;
  financialYear: string;
  plant: string;
}

// Keeping for legacy support if needed, but RecyclerTab mainly uses `recyclerTrends` and calculated summaries now
export const recyclerStats: RecyclerStats[] = [
  { metric: 'Recycled Material Weight', value: 5.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { metric: 'Total Material Supplied', value: 100.00, unit: 'MT', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
  { metric: 'Yield Percentage', value: 5.00, unit: '%', targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon' },
];

export const recyclerSummary = {
  recycledWeight: 5.00,
  totalSupplied: 100.00,
  efficiency: 5.00,
  facilityEcoScore: 8.2,
};

// Advanced Filtering for Recyclers
export interface RecyclerProduct {
  recycler: string;
  material: string;
  grade: string;
  shape: string;
}

const masterRecyclerProducts: RecyclerProduct[] = [
  { recycler: 'Vardhaman Special Steels Limited', material: 'Steel', grade: 'G58C', shape: 'Dia Rolled Bars/Rods' },
  { recycler: 'Vardhaman Special Steels Limited', material: 'Steel', grade: 'G58C', shape: 'Billets' },
  { recycler: 'Sunflag Steel India', material: 'Steel', grade: 'L78H', shape: 'Dia Rolled Bars/Rods' },
  { recycler: 'Sunflag Steel India', material: 'Steel', grade: 'L78H', shape: 'Billets' },
  { recycler: 'Mitsui Prime ACI', material: 'Plastic PP', grade: 'HDX-8701', shape: 'Pellets (Compounded)' },
  { recycler: 'Kingfa Science and Technology Ltd.', material: 'Plastic PP', grade: 'ABC-1103', shape: 'Pellets (Compounded)' },
  { recycler: 'Peeco Polytech, Sonipat', material: 'Plastic PP', grade: 'XYZ-6545', shape: 'Pellets (Pre-Compounded)' },
  { recycler: 'Peeco Polytech, Panipat', material: 'Plastic PP', grade: 'XYZ-6545', shape: 'Pellets (Pre-Compounded)' },
  // Legacy/Other mappings if needed
  { recycler: 'Peeco Polytech, Sonipat', material: 'Plastic', grade: 'General', shape: 'Granules' },
];

export const getRecyclerAvailableOptions = (
  currentRecycler: string,
  currentMaterial: string,
  currentGrade: string,
  currentShape: string
) => {
  const getOptions = (field: keyof RecyclerProduct) => {
    let baseData = masterRecyclerProducts;
    if (field !== 'recycler' && currentRecycler !== 'All') baseData = baseData.filter(d => d.recycler === currentRecycler);
    if (field !== 'material' && currentMaterial !== 'All') baseData = baseData.filter(d => d.material === currentMaterial);
    if (field !== 'grade' && currentGrade !== 'All') baseData = baseData.filter(d => d.grade === currentGrade);
    if (field !== 'shape' && currentShape !== 'All') baseData = baseData.filter(d => d.shape === currentShape);

    return Array.from(new Set(baseData.map(d => d[field]))).sort();
  };

  return {
    recyclers: getOptions('recycler'),
    materials: getOptions('material'),
    grades: getOptions('grade'),
    shapes: getOptions('shape'),
  };
};

// Data for "Recycled Material Input vs Output" Graph
export interface RecyclerTrendData {
  month: string;
  plastic: number;
  metal: number;
  battery: number;
  recycler?: string; // Added for filtering
}

const masterRecyclerTrends: RecyclerTrendData[] = [
  { month: 'Jan', plastic: 400, metal: 240, battery: 240, recycler: 'Peeco Polytech, Sonipat' },
  { month: 'Feb', plastic: 300, metal: 139, battery: 221, recycler: 'Peeco Polytech, Sonipat' },
  { month: 'Mar', plastic: 200, metal: 980, battery: 229, recycler: 'Kingfa Science and Technology Ltd.' },
  { month: 'Apr', plastic: 278, metal: 390, battery: 200, recycler: 'Kingfa Science and Technology Ltd.' },
  { month: 'May', plastic: 189, metal: 480, battery: 218, recycler: 'Mitsui Prime ACI' },
  { month: 'Jun', plastic: 239, metal: 380, battery: 250, recycler: 'Mitsui Prime ACI' },
  { month: 'Jul', plastic: 349, metal: 430, battery: 210, recycler: 'Vardhaman Special Steels Limited' },
  { month: 'Aug', plastic: 200, metal: 980, battery: 229, recycler: 'Vardhaman Special Steels Limited' },
  { month: 'Sep', plastic: 278, metal: 390, battery: 200, recycler: 'Peeco Polytech, Sonipat' },
  { month: 'Oct', plastic: 189, metal: 480, battery: 218, recycler: 'Kingfa Science and Technology Ltd.' },
  { month: 'Nov', plastic: 239, metal: 380, battery: 250, recycler: 'Mitsui Prime ACI' },
  { month: 'Dec', plastic: 349, metal: 430, battery: 210, recycler: 'Vardhaman Special Steels Limited' },
];

export const recyclerTrends = masterRecyclerTrends;

export const getRecyclerTrends = (
  filters: FilterState,
  recyclerName?: string,
  materialName?: string,
  gradeName?: string,
  shapeName?: string
): RecyclerTrendData[] => {
  let data = masterRecyclerTrends;

  // Basic filtering by recycler if selected directly
  if (recyclerName && recyclerName !== 'All') {
    data = data.filter(d => d.recycler === recyclerName);
  } else if ((materialName && materialName !== 'All') || (gradeName && gradeName !== 'All') || (shapeName && shapeName !== 'All')) {
    // If recycler is 'All' but other filters are set, find compatible recyclers
    const compatibleRecyclers = new Set(
      masterRecyclerProducts.filter(p => {
        if (materialName && materialName !== 'All' && p.material !== materialName) return false;
        if (gradeName && gradeName !== 'All' && p.grade !== gradeName) return false;
        if (shapeName && shapeName !== 'All' && p.shape !== shapeName) return false;
        return true;
      }).map(p => p.recycler)
    );
    // Filter trends to only show data for these recyclers
    // Note: Trend data currently has hardcoded recyclers. 
    // If the selected material/grade/shape belongs to a recycler NOT in the trend data (like Vardhaman), 
    // the graph might be empty. 
    // For this demo, we can assume the new recyclers map to existing ones or just filter what we have.
    data = data.filter(d => d.recycler && compatibleRecyclers.has(d.recycler));
  }

  const prorationFactor = getProrationFactor(filters);
  return data.map(d => ({
    ...d,
    plastic: Math.round(d.plastic * prorationFactor),
    metal: Math.round(d.metal * prorationFactor),
    battery: Math.round(d.battery * prorationFactor)
  }));
};

export const getRecyclerList = () => recyclerList;

// ============================================
// TAB 4: Suppliers (Green Rating) Data
// ============================================

export interface SupplierEcoScore {
  supplier: string;
  component: string;
  ecoScore: number; // 0-10
  deliveryPerformance: number; // %
  recycledContent: number; // %
  targetMarket: string;
  financialYear: string;
  plant: string;
  material: string; // Added for advanced filtering
}

const masterSupplierEcoScores: SupplierEcoScore[] = [
  { supplier: 'Satelite Forging Pvt Ltd', component: 'Front Wheel Hub', ecoScore: 8.8, deliveryPerformance: 97, recycledContent: 30, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', material: 'Steel' },
  { supplier: 'Satelite Forging Pvt Ltd', component: 'Connecting Rod', ecoScore: 8.7, deliveryPerformance: 96, recycledContent: 28, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', material: 'Steel' },
  { supplier: 'Sona Comstar', component: 'Pinion', ecoScore: 9.0, deliveryPerformance: 99, recycledContent: 45, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', material: 'Steel' },
  { supplier: 'Sona Comstar', component: 'Annular Gear', ecoScore: 9.1, deliveryPerformance: 98, recycledContent: 42, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', material: 'Steel' },
  { supplier: 'MS Moulders', component: 'Front Bumper', ecoScore: 9.0, deliveryPerformance: 97, recycledContent: 30, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', material: 'Plastic' },
  { supplier: 'MS Moulders', component: 'Rear Bumper', ecoScore: 8.9, deliveryPerformance: 96, recycledContent: 28, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', material: 'Plastic' },
  { supplier: 'JTEKT India Pvt. Ltd.', component: 'Steering System', ecoScore: 8.5, deliveryPerformance: 95, recycledContent: 25, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Manesar', material: 'Steel' },
  { supplier: 'GKN Driveline India', component: 'Driveshaft', ecoScore: 8.8, deliveryPerformance: 96, recycledContent: 35, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', material: 'Steel' },
  // Keeping some others but aliasing if needed to match new simplified list, or just leaving them out if the user implied ONLY these.
  // The user said "Supplier Names to be the following", implying replacement.
];

export const supplierEcoScores = masterSupplierEcoScores;

// Helper to get unique supplier list
export const getSupplierList = () => {
  return Array.from(new Set(masterSupplierEcoScores.map(s => s.supplier)));
};

// Advanced Filtering Logic
export const getAvailableOptions = (
  currentSupplier: string,
  currentMaterial: string,
  currentPart: string
) => {
  let filteredData = masterSupplierEcoScores;

  // Filter based on selections (logic: if selected, filter by it)
  if (currentSupplier !== 'All') {
    filteredData = filteredData.filter(d => d.supplier === currentSupplier);
  }
  if (currentMaterial !== 'All') {
    filteredData = filteredData.filter(d => d.material === currentMaterial);
  }
  if (currentPart !== 'All') {
    filteredData = filteredData.filter(d => d.component === currentPart);
  }

  // Derived options based on the intersection
  // Ideally, when "All" is selected, we want to show options that are compatible with OTHER non-all selections.
  // The logic above effectively gets the "intersection" dataset.
  // BUT, to populate the dropdowns, we need to know what options are valid *given the other two*.

  const getOptions = (field: keyof SupplierEcoScore) => {
    let baseData = masterSupplierEcoScores;
    // Filter by OTHER two fields
    if (field !== 'supplier' && currentSupplier !== 'All') baseData = baseData.filter(d => d.supplier === currentSupplier);
    if (field !== 'material' && currentMaterial !== 'All') baseData = baseData.filter(d => d.material === currentMaterial);
    if (field !== 'component' && currentPart !== 'All') baseData = baseData.filter(d => d.component === currentPart);

    return Array.from(new Set(baseData.map(d => d[field] as string))).sort();
  };

  return {
    suppliers: getOptions('supplier'),
    materials: getOptions('material'),
    parts: getOptions('component'),
  };
};

export const getSupplierEcoScores = (
  filters: FilterState,
  supplierName?: string,
  materialName?: string,
  partName?: string
): SupplierEcoScore[] => {
  let data = masterSupplierEcoScores;

  if (supplierName && supplierName !== 'All') {
    data = data.filter(s => s.supplier === supplierName);
  }
  if (materialName && materialName !== 'All') {
    data = data.filter(s => s.material === materialName);
  }
  if (partName && partName !== 'All') {
    data = data.filter(s => s.component === partName);
  }

  return data.filter(s => {
    if (filters.plant !== 'All' && s.plant !== filters.plant) return false;
    // if (filters.targetMarket !== 'All' && s.targetMarket !== filters.targetMarket) return false;
    return true;
  });
};

export interface SupplierCarbonData {
  supplier: string;
  co2Reduction: number; // kg
  renewableEnergy: number; // %
}

const masterSupplierCarbonData: SupplierCarbonData[] = [
  { supplier: 'Satelite Forging Pvt Ltd', co2Reduction: 500, renewableEnergy: 60 },
  { supplier: 'Sona Comstar', co2Reduction: 450, renewableEnergy: 55 },
  { supplier: 'MS Moulders', co2Reduction: 300, renewableEnergy: 40 },
  { supplier: 'JTEKT India Pvt. Ltd.', co2Reduction: 480, renewableEnergy: 58 },
  { supplier: 'GKN Driveline India', co2Reduction: 350, renewableEnergy: 45 },
];

export const supplierCarbonData = masterSupplierCarbonData;

export const getSupplierCarbonData = (
  filters: FilterState,
  supplierName?: string,
  materialName?: string,
  partName?: string
): SupplierCarbonData[] => {
  let data = masterSupplierCarbonData;

  // Filter based on advanced filters
  // We need to know which suppliers supply the selected material/part.
  // We can use masterSupplierEcoScores as a lookup since it has the mapping.

  if (supplierName && supplierName !== 'All') {
    data = data.filter(s => s.supplier === supplierName);
  }

  // Filter by Material/Part implication
  if ((materialName && materialName !== 'All') || (partName && partName !== 'All')) {
    const relevantSuppliers = new Set(
      masterSupplierEcoScores
        .filter(s => {
          if (materialName && materialName !== 'All' && s.material !== materialName) return false;
          if (partName && partName !== 'All' && s.component !== partName) return false;
          return true;
        })
        .map(s => s.supplier)
    );
    data = data.filter(d => relevantSuppliers.has(d.supplier));
  }

  const multiplier = getDataMultiplier(filters);
  return data.map(d => ({
    ...d,
    co2Reduction: Math.round(d.co2Reduction * multiplier)
    // renewableEnergy % stays same
  }));
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
  supplier?: string; // Added for filtering
  material?: string; // Added for filtering
}


const masterComponentData: ComponentData[] = [
  { partName: 'Front Bumper', quantity: 80, unit: 'Nos.', recycledWeight: 2.0, totalWeight: 40, ecoScore: 5.0, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Plastic' },
  { partName: 'Rear Bumper', quantity: 70, unit: 'Nos.', recycledWeight: 1.5, totalWeight: 35, ecoScore: 4.3, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Plastic' },
  { partName: 'Interior Parts', quantity: 15, unit: 'Nos.', recycledWeight: 1.5, totalWeight: 25, ecoScore: 6.0, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Textile' },
  { partName: 'Dashboard Panel', quantity: 45, unit: 'Nos.', recycledWeight: 1.2, totalWeight: 30, ecoScore: 4.0, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Plastic' },
  { partName: 'Door Trim', quantity: 120, unit: 'Nos.', recycledWeight: 2.8, totalWeight: 48, ecoScore: 5.8, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'No', supplier: 'MS Moulders', material: 'Plastic' },
  { partName: 'Wheel Arch Liner', quantity: 90, unit: 'Nos.', recycledWeight: 1.8, totalWeight: 36, ecoScore: 5.0, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Plastic' },
  { partName: 'Engine Cover', quantity: 55, unit: 'Nos.', recycledWeight: 1.0, totalWeight: 22, ecoScore: 4.5, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Plastic' },
  { partName: 'Trunk Liner', quantity: 65, unit: 'Nos.', recycledWeight: 1.3, totalWeight: 26, ecoScore: 5.0, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gujarat', sourcedFromELV: 'Yes', supplier: 'MS Moulders', material: 'Textile' },
  // Added requested examples
  { partName: 'Front Wheel Hub', quantity: 200, unit: 'Nos.', recycledWeight: 5.0, totalWeight: 15, ecoScore: 8.8, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes', supplier: 'Satelite Forging Pvt Ltd', material: 'Steel' },
  { partName: 'Connecting Rod', quantity: 150, unit: 'Nos.', recycledWeight: 4.0, totalWeight: 12, ecoScore: 8.7, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes', supplier: 'Satelite Forging Pvt Ltd', material: 'Steel' },
  { partName: 'Pinion', quantity: 300, unit: 'Nos.', recycledWeight: 2.5, totalWeight: 8, ecoScore: 9.0, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes', supplier: 'Sona Comstar', material: 'Steel' },
  { partName: 'Annular Gear', quantity: 250, unit: 'Nos.', recycledWeight: 3.0, totalWeight: 10, ecoScore: 9.1, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes', supplier: 'Sona Comstar', material: 'Steel' },
  { partName: 'Steering System', quantity: 180, unit: 'Nos.', recycledWeight: 4.1, totalWeight: 12, ecoScore: 9.0, targetMarket: 'Export', financialYear: '2025-26', plant: 'Manesar', sourcedFromELV: 'Yes', supplier: 'JTEKT India Pvt. Ltd.', material: 'Steel' },
  { partName: 'Driveshaft', quantity: 200, unit: 'Nos.', recycledWeight: 4.5, totalWeight: 14, ecoScore: 8.8, targetMarket: 'Domestic', financialYear: '2025-26', plant: 'Gurgaon', sourcedFromELV: 'Yes', supplier: 'GKN Driveline India', material: 'Steel' },
];

export const componentData = masterComponentData;

export const getComponentData = (
  filters: FilterState,
  supplierName?: string,
  materialName?: string,
  partName?: string
): ComponentData[] => {
  const prorationFactor = getProrationFactor(filters);
  return masterComponentData
    .filter(c => {
      if (filters.plant !== 'All' && c.plant !== filters.plant) return false;
      // Filter by Advanced Filters
      if (supplierName && supplierName !== 'All' && c.supplier !== supplierName) return false;
      if (materialName && materialName !== 'All' && c.material !== materialName) return false;
      if (partName && partName !== 'All' && c.partName !== partName) return false;

      return true;
    })
    .map(c => ({
      ...c,
      quantity: Math.round(c.quantity * prorationFactor),
      recycledWeight: Number((c.recycledWeight * prorationFactor).toFixed(1)),
      totalWeight: Number((c.totalWeight * prorationFactor).toFixed(1))
    }));
};

export const supplierSummary = {
  recycledMaterialWeight: 5.00,
  totalMaterialSupplied: 100.00,
  totalComponents: 540,
};

// Helper to get total summary based on advanced filters
export const getSupplierSummary = (
  filters: FilterState,
  supplierName?: string,
  materialName?: string,
  partName?: string
) => {
  const prorationFactor = getProrationFactor(filters);

  // Start with default summary
  let baseSummary = { ...supplierSummary };

  // Adjust base summary using data density logic
  // Calculate filter restrictive-ness
  let filterFactor = 1.0;

  if (supplierName && supplierName !== 'All') filterFactor *= 0.25; // ~Expected share
  if (materialName && materialName !== 'All') filterFactor *= 0.4;
  if (partName && partName !== 'All') filterFactor *= 0.1;

  // Cap minimum factor so it doesn't vanish completely if user selects everything
  filterFactor = Math.max(filterFactor, 0.05);

  return {
    recycledMaterialWeight: Number((baseSummary.recycledMaterialWeight * prorationFactor * filterFactor).toFixed(2)),
    totalMaterialSupplied: Number((baseSummary.totalMaterialSupplied * prorationFactor * filterFactor).toFixed(2)),
    totalComponents: Math.round(baseSummary.totalComponents * prorationFactor * filterFactor)
  };
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

const masterComponentTrendData = [
  { month: 'Apr', frontBumper: 80, rearBumper: 70, interior: 15, dashboard: 45 },
  { month: 'Jun', frontBumper: 112, rearBumper: 96, interior: 30, dashboard: 60 },
  { month: 'Jul', frontBumper: 130, rearBumper: 112, interior: 38, dashboard: 70 },
  { month: 'Aug', frontBumper: 150, rearBumper: 130, interior: 48, dashboard: 82 },
  { month: 'Sep', frontBumper: 172, rearBumper: 150, interior: 58, dashboard: 95 },
];

export const componentTrendData = masterComponentTrendData;

export const getComponentTrendData = (filters: FilterState) => {
  const prorationFactor = getProrationFactor(filters);
  return masterComponentTrendData.map(d => ({
    ...d,
    frontBumper: Math.round(d.frontBumper * prorationFactor),
    rearBumper: Math.round(d.rearBumper * prorationFactor),
    interior: Math.round(d.interior * prorationFactor),
    dashboard: Math.round(d.dashboard * prorationFactor)
  }));
};

// Data for Suppliers Tab - Total Volume vs Recycled
export const masterComponentVolumeTrendData = [
  { month: 'Apr', quantity: 1200, recycled: 350 },
  { month: 'May', quantity: 1350, recycled: 410 },
  { month: 'Jun', quantity: 1500, recycled: 480 },
  { month: 'Jul', quantity: 1400, recycled: 450 },
  { month: 'Aug', quantity: 1650, recycled: 580 },
  { month: 'Sep', quantity: 1800, recycled: 650 },
  { month: 'Oct', quantity: 1950, recycled: 720 },
  { month: 'Nov', quantity: 2100, recycled: 850 },
  { month: 'Dec', quantity: 2000, recycled: 790 },
  { month: 'Jan', quantity: 2200, recycled: 880 },
  { month: 'Feb', quantity: 2350, recycled: 950 },
  { month: 'Mar', quantity: 2500, recycled: 1050 },
];

export const getComponentVolumeTrendData = (
  filters: FilterState,
  supplierName?: string,
  materialName?: string,
  partName?: string
) => {
  const prorationFactor = getProrationFactor(filters);

  // Apply scaling factor based on active filters to simulate filtered data
  let filterFactor = 1.0;
  if (supplierName && supplierName !== 'All') filterFactor *= 0.25;
  if (materialName && materialName !== 'All') filterFactor *= 0.4;
  if (partName && partName !== 'All') filterFactor *= 0.1;
  filterFactor = Math.max(filterFactor, 0.05);

  return masterComponentVolumeTrendData.map(d => ({
    ...d,
    quantity: Math.round(d.quantity * prorationFactor * filterFactor),
    recycled: Math.round(d.recycled * prorationFactor * filterFactor)
  }));
};

// Data for MSIL Tab - Material Achievement Trends
export const getMaterialTrendData = (filters: FilterState) => {
  const multiplier = getDataMultiplier(filters);
  return materialTrendData.map(d => ({
    ...d,
    steel: Math.round(d.steel * multiplier),
    aluminium: Math.round(d.aluminium * multiplier),
    copper: Math.round(d.copper * multiplier),
    plastic: Math.round(d.plastic * multiplier),
    castIron: Math.round(d.castIron * multiplier),
    glass: Math.round(d.glass * multiplier),
    rubber: Math.round(d.rubber * multiplier)
  }));
};

export const getFinancialYear = (date: Date): string => {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month >= 3) { // April onwards
    return `${year}-${(year + 1).toString().slice(2)}`;
  }
  return `${year - 1}-${year.toString().slice(2)}`;
};

// ============================================
// RANKING KPI SYSTEM
// ============================================

export interface RankingKPI {
  id: string;
  name: string;
  defaultWeight: number; // 0-100
  description: string;
}

export interface EntityScore {
  entityName: string;
  scores: { kpiId: string; rawScore: number }[]; // rawScore 0-10
}

// --- SUPPLIER RANKING ---
export const supplierRankingKPIs: RankingKPI[] = [
  { id: 'quality', name: 'Quality', defaultWeight: 30, description: 'Defect rate, adherence to specs' },
  { id: 'cost', name: 'Cost Competitiveness', defaultWeight: 25, description: 'Price vs. market, TCO' },
  { id: 'delivery', name: 'Delivery Performance', defaultWeight: 20, description: 'On-time delivery rate' },
  { id: 'sustainability', name: 'Sustainability (EcoScore)', defaultWeight: 15, description: 'Recycled content %, CO2' },
  { id: 'traceability', name: 'Traceability', defaultWeight: 10, description: '% components with full traceability' },
];

export const supplierEntityScores: EntityScore[] = [
  { entityName: 'Satelite Forging Pvt Ltd', scores: [{ kpiId: 'quality', rawScore: 8 }, { kpiId: 'cost', rawScore: 8 }, { kpiId: 'delivery', rawScore: 7 }, { kpiId: 'sustainability', rawScore: 7 }, { kpiId: 'traceability', rawScore: 9 }] },
  { entityName: 'Sona Comstar', scores: [{ kpiId: 'quality', rawScore: 9 }, { kpiId: 'cost', rawScore: 6 }, { kpiId: 'delivery', rawScore: 8 }, { kpiId: 'sustainability', rawScore: 9 }, { kpiId: 'traceability', rawScore: 8 }] },
  { entityName: 'MS Moulders', scores: [{ kpiId: 'quality', rawScore: 8 }, { kpiId: 'cost', rawScore: 7 }, { kpiId: 'delivery', rawScore: 9 }, { kpiId: 'sustainability', rawScore: 7 }, { kpiId: 'traceability', rawScore: 8 }] },
  { entityName: 'JTEKT India Pvt. Ltd.', scores: [{ kpiId: 'quality', rawScore: 8 }, { kpiId: 'cost', rawScore: 7 }, { kpiId: 'delivery', rawScore: 9 }, { kpiId: 'sustainability', rawScore: 8 }, { kpiId: 'traceability', rawScore: 7 }] },
  { entityName: 'GKN Driveline India', scores: [{ kpiId: 'quality', rawScore: 7 }, { kpiId: 'cost', rawScore: 8 }, { kpiId: 'delivery', rawScore: 8 }, { kpiId: 'sustainability', rawScore: 8 }, { kpiId: 'traceability', rawScore: 7 }] },
];

// --- RECYCLER RANKING ---
export const recyclerRankingKPIs: RankingKPI[] = [
  { id: 'yield', name: 'Yield Efficiency', defaultWeight: 30, description: 'Output MT / Input MT' },
  { id: 'purity', name: 'Material Purity', defaultWeight: 25, description: 'Grade quality of output' },
  { id: 'capacity', name: 'Capacity Utilization', defaultWeight: 20, description: 'Actual vs. rated capacity' },
  { id: 'compliance', name: 'Environmental Compliance', defaultWeight: 15, description: 'Certifications, audit scores' },
  { id: 'cost_per_mt', name: 'Cost per MT Processed', defaultWeight: 10, description: 'Operational cost efficiency' },
];

export const recyclerEntityScores: EntityScore[] = [
  { entityName: 'Vardhaman Special Steels Limited', scores: [{ kpiId: 'yield', rawScore: 9 }, { kpiId: 'purity', rawScore: 9 }, { kpiId: 'capacity', rawScore: 8 }, { kpiId: 'compliance', rawScore: 9 }, { kpiId: 'cost_per_mt', rawScore: 7 }] },
  { entityName: 'Sunflag Steel India', scores: [{ kpiId: 'yield', rawScore: 8 }, { kpiId: 'purity', rawScore: 8 }, { kpiId: 'capacity', rawScore: 7 }, { kpiId: 'compliance', rawScore: 8 }, { kpiId: 'cost_per_mt', rawScore: 8 }] },
  { entityName: 'Mitsui Prime ACI', scores: [{ kpiId: 'yield', rawScore: 7 }, { kpiId: 'purity', rawScore: 9 }, { kpiId: 'capacity', rawScore: 8 }, { kpiId: 'compliance', rawScore: 7 }, { kpiId: 'cost_per_mt', rawScore: 9 }] },
  { entityName: 'Kingfa Science and Technology Ltd.', scores: [{ kpiId: 'yield', rawScore: 8 }, { kpiId: 'purity', rawScore: 7 }, { kpiId: 'capacity', rawScore: 9 }, { kpiId: 'compliance', rawScore: 8 }, { kpiId: 'cost_per_mt', rawScore: 7 }] },
  { entityName: 'Peeco Polytech, Sonipat', scores: [{ kpiId: 'yield', rawScore: 8 }, { kpiId: 'purity', rawScore: 8 }, { kpiId: 'capacity', rawScore: 7 }, { kpiId: 'compliance', rawScore: 8 }, { kpiId: 'cost_per_mt', rawScore: 8 }] },
];

// --- RVSF RANKING ---
export const rvsfRankingKPIs: RankingKPI[] = [
  { id: 'elv_volume', name: 'ELV Processing Volume', defaultWeight: 30, description: 'Vehicles scrapped per period' },
  { id: 'recovery_rate', name: 'Material Recovery Rate', defaultWeight: 25, description: '% vehicle weight recovered' },
  { id: 'cod_gen', name: 'CoD Generation', defaultWeight: 20, description: 'Certificates issued on time' },
  { id: 'compliance', name: 'Compliance Score', defaultWeight: 15, description: 'CPCB/MoRTH adherence' },
  { id: 'logistics', name: 'Logistics Efficiency', defaultWeight: 10, description: 'Cost & time to collect ELVs' },
];

export const rvsfEntityScores: EntityScore[] = [
  { entityName: 'MSTI Noida', scores: [{ kpiId: 'elv_volume', rawScore: 9 }, { kpiId: 'recovery_rate', rawScore: 8 }, { kpiId: 'cod_gen', rawScore: 9 }, { kpiId: 'compliance', rawScore: 9 }, { kpiId: 'logistics', rawScore: 7 }] },
  { entityName: 'ABC Scrapping Facility', scores: [{ kpiId: 'elv_volume', rawScore: 8 }, { kpiId: 'recovery_rate', rawScore: 9 }, { kpiId: 'cod_gen', rawScore: 8 }, { kpiId: 'compliance', rawScore: 8 }, { kpiId: 'logistics', rawScore: 8 }] },
  { entityName: 'XYZ Scrapping Facility', scores: [{ kpiId: 'elv_volume', rawScore: 7 }, { kpiId: 'recovery_rate', rawScore: 7 }, { kpiId: 'cod_gen', rawScore: 8 }, { kpiId: 'compliance', rawScore: 9 }, { kpiId: 'logistics', rawScore: 9 }] },
];

