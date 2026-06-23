// Dashboard data extracted from Excel file - Complete Dataset with all 21 materials

import liveDataRaw from './liveData.json';
const _elvCollectionOverrides: Record<string, Record<string, number>> =
  (liveDataRaw as { elvHotspot?: { collectionOverrides?: Record<string, Record<string, number>> } })
    .elvHotspot?.collectionOverrides ?? {};

export interface FilterState {
  fiscalYear: string | number | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  plant: string;
  targetMarket: string;
  sourcedFromELV: string;
  materials: (number | string | undefined)[];
}

export const defaultFilters: FilterState = {
  fiscalYear: null,
  dateFrom: null,
  dateTo: null,
  plant: 'All',
  targetMarket: 'Domestic',
  sourcedFromELV: 'Yes',
  materials: [],
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
  if (!filters.dateFrom || !filters.dateTo) return 1;

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
  if (!filters.dateFrom || !filters.dateTo) return 1;

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
  return masterScrapDispatchDetails;
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

// Material Weight Breakdown (Total Weight by Category)
export interface MaterialWeightItem {
  material: string;
  weight: number;
  unit: string;
}

const masterMaterialWeightItems: MaterialWeightItem[] = [
  { material: 'Mix Steel', weight: 4526.94, unit: 'Kgs' },
  { material: 'Aluminium', weight: 410.63, unit: 'Kgs' },
  { material: 'Hazardous Waste', weight: 428.84, unit: 'Kgs' },
  { material: 'Shell & Painted Steel', weight: 479.38, unit: 'Kgs' },
  { material: 'Plastic Scrap', weight: 200.20, unit: 'Kgs' },
];

const masterTotalWeightKgs = 6974.00;

export const getMaterialWeightData = (_filters: FilterState): { total: number; items: MaterialWeightItem[] } => {
  return {
    total: masterTotalWeightKgs,
    items: masterMaterialWeightItems,
  };
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
  const baseSummary = { ...supplierSummary };

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

export const getFinancialYear = (date: Date | null | undefined): string => {
  if (!date) return '';

  const month = date.getMonth();
  const year = date.getFullYear();
  if (month >= 3) { // April onwards
    return `${year}-${(year + 1).toString().slice(2)}`;
  }
  return `${year - 1}-${year.toString().slice(2)}`;
};
export const getFinancialYearTargetKey = (date: Date | null | undefined): string => {
  if (!date) return '';

  const year = date.getFullYear();
  return `20${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
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

// ============================================
// TAB 5: ELV HOTSPOT ANALYSIS DATA
// ============================================

export interface SIAMSalesDataPoint {
  state: string;
  fyYear: string;
  unitsSold: number;
}

export interface ELVRVSFRegistry {
  rvsfId: string;
  name: string;
  state: string;
  district: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  capacityPerYear: number;
  vehicleTypes: string[];
  lat?: number;
  lng?: number;
  address?: string;
  pincode?: string;
}

export interface ELVRVSFCollection {
  rvsfId: string;
  state: string;
  fyYear: string;
  vehiclesCollected: number;
}

export interface ELVOriginDataPoint {
  originState: string;
  makeYear: number;
  fyYearScrapped: string;
  vehicleCount: number;
}

export interface StateHotspotData {
  state: string;
  lat: number;
  lng: number;
  salesLagYear: number;
  rvsfCount: number;
  vehiclesCollected: number;
  hotspotScore: number;
  coverageStatus: 'green' | 'amber' | 'red';
  totalCapacity: number;
  salesCurrentYear: number;
}

// State geo-centers
export const elvStateCoords: Record<string, [number, number]> = {
  'Maharashtra': [19.7515, 75.7139],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Delhi': [28.7041, 77.1025],
  'Karnataka': [15.3173, 75.7139],
  'Tamil Nadu': [11.1271, 78.6569],
  'Gujarat': [22.2587, 71.1924],
  'Haryana': [29.0588, 76.0856],
  'Rajasthan': [27.0238, 74.2179],
  'Telangana': [17.1232, 79.2088],
  'West Bengal': [22.9868, 87.8550],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Punjab': [31.1471, 75.3412],
  'Kerala': [10.8505, 76.2711],
  'Andhra Pradesh': [15.9129, 79.7400],
  'Bihar': [25.0961, 85.3131],
  'Odisha': [20.9517, 85.0985],
  'Chhattisgarh': [21.2787, 81.8661],
  'Jharkhand': [23.6102, 85.2799],
  'Assam': [26.2006, 92.9376],
  'Uttarakhand': [30.0668, 79.0193],
};

// SIAM State-wise PV Sales Data (FY 2004-05 to FY 2024-25)
// National totals from SIAM Annual Reports. State share derived from Vahan registration data:
// MH 13%, UP 11%, DL 7%, KA 9%, TN 8.5%, GJ 7.2%, HR 5%, RJ 8%, WB 4.2%, MP 5.1%,
// AP 3.8%, TS 3.7%, PB 2.6%, KL 3.5%, BR 2.5%, OD 1.5%, CG 1.1%, JH 1%, AS 1%, UK 0.8%
// National totals (units): FY05=1.062M, FY10=1.950M, FY15=2.601M, FY19=3.377M, FY21=2.711M, FY25=4.300M
const siamSalesRaw: Record<string, Record<string, number>> = {
  'Maharashtra': {
    '2004-05': 138100, '2005-06': 148600, '2006-07': 179300, '2007-08': 201400,
    '2008-09': 201800, '2009-10': 253500, '2010-11': 325100, '2011-12': 341800,
    '2012-13': 346600, '2013-14': 325400, '2014-15': 338100, '2015-16': 362600,
    '2016-17': 396200, '2017-18': 427400, '2018-19': 439000, '2019-20': 360500,
    '2020-21': 352400, '2021-22': 398200, '2022-23': 505700, '2023-24': 547800,
    '2024-25': 559000,
  },
  'Uttar Pradesh': {
    '2004-05': 116800, '2005-06': 125700, '2006-07': 151700, '2007-08': 170400,
    '2008-09': 170700, '2009-10': 214500, '2010-11': 275100, '2011-12': 289200,
    '2012-13': 293300, '2013-14': 275300, '2014-15': 286100, '2015-16': 306800,
    '2016-17': 335300, '2017-18': 361700, '2018-19': 371500, '2019-20': 305000,
    '2020-21': 298200, '2021-22': 336900, '2022-23': 427900, '2023-24': 463500,
    '2024-25': 473000,
  },
  'Delhi': {
    '2004-05': 74300, '2005-06': 80000, '2006-07': 96500, '2007-08': 108400,
    '2008-09': 108600, '2009-10': 136500, '2010-11': 175100, '2011-12': 184000,
    '2012-13': 186600, '2013-14': 175200, '2014-15': 182100, '2015-16': 195200,
    '2016-17': 213400, '2017-18': 230200, '2018-19': 236400, '2019-20': 194100,
    '2020-21': 189800, '2021-22': 214400, '2022-23': 272300, '2023-24': 295000,
    '2024-25': 301000,
  },
  'Karnataka': {
    '2004-05': 95600, '2005-06': 102900, '2006-07': 124100, '2007-08': 139400,
    '2008-09': 139700, '2009-10': 175500, '2010-11': 225100, '2011-12': 236600,
    '2012-13': 239900, '2013-14': 225300, '2014-15': 234100, '2015-16': 251000,
    '2016-17': 274300, '2017-18': 295900, '2018-19': 303900, '2019-20': 249600,
    '2020-21': 244000, '2021-22': 275700, '2022-23': 350100, '2023-24': 379300,
    '2024-25': 387000,
  },
  'Tamil Nadu': {
    '2004-05': 90300, '2005-06': 97200, '2006-07': 117200, '2007-08': 131700,
    '2008-09': 131900, '2009-10': 165800, '2010-11': 212600, '2011-12': 223500,
    '2012-13': 226600, '2013-14': 212800, '2014-15': 221100, '2015-16': 237100,
    '2016-17': 259100, '2017-18': 279500, '2018-19': 287000, '2019-20': 235700,
    '2020-21': 230400, '2021-22': 260400, '2022-23': 330700, '2023-24': 358200,
    '2024-25': 365500,
  },
  'Gujarat': {
    '2004-05': 76500, '2005-06': 82300, '2006-07': 99300, '2007-08': 111500,
    '2008-09': 111700, '2009-10': 140400, '2010-11': 180100, '2011-12': 189300,
    '2012-13': 192000, '2013-14': 180200, '2014-15': 187300, '2015-16': 200800,
    '2016-17': 219500, '2017-18': 236700, '2018-19': 243100, '2019-20': 199700,
    '2020-21': 195200, '2021-22': 220500, '2022-23': 280100, '2023-24': 303400,
    '2024-25': 309600,
  },
  'Haryana': {
    '2004-05': 53100, '2005-06': 57200, '2006-07': 69000, '2007-08': 77500,
    '2008-09': 77600, '2009-10': 97500, '2010-11': 125100, '2011-12': 131500,
    '2012-13': 133300, '2013-14': 125200, '2014-15': 130100, '2015-16': 139500,
    '2016-17': 152400, '2017-18': 164400, '2018-19': 168900, '2019-20': 138700,
    '2020-21': 135600, '2021-22': 153200, '2022-23': 194500, '2023-24': 210700,
    '2024-25': 215000,
  },
  'Rajasthan': {
    '2004-05': 85000, '2005-06': 91400, '2006-07': 110300, '2007-08': 123900,
    '2008-09': 124200, '2009-10': 156000, '2010-11': 200100, '2011-12': 210300,
    '2012-13': 213300, '2013-14': 200200, '2014-15': 208100, '2015-16': 223100,
    '2016-17': 243800, '2017-18': 263000, '2018-19': 270200, '2019-20': 221800,
    '2020-21': 216900, '2021-22': 245000, '2022-23': 311200, '2023-24': 337100,
    '2024-25': 344000,
  },
  'Telangana': {
    '2004-05': 39300, '2005-06': 42300, '2006-07': 51000, '2007-08': 57300,
    '2008-09': 57400, '2009-10': 72200, '2010-11': 92500, '2011-12': 97300,
    '2012-13': 98600, '2013-14': 92600, '2014-15': 96200, '2015-16': 103200,
    '2016-17': 112800, '2017-18': 121700, '2018-19': 124900, '2019-20': 102600,
    '2020-21': 100300, '2021-22': 113300, '2022-23': 143900, '2023-24': 155900,
    '2024-25': 159100,
  },
  'West Bengal': {
    '2004-05': 44600, '2005-06': 48000, '2006-07': 57900, '2007-08': 65100,
    '2008-09': 65200, '2009-10': 81900, '2010-11': 105000, '2011-12': 110400,
    '2012-13': 112000, '2013-14': 105100, '2014-15': 109200, '2015-16': 117100,
    '2016-17': 128000, '2017-18': 138100, '2018-19': 141800, '2019-20': 116500,
    '2020-21': 113900, '2021-22': 128600, '2022-23': 163400, '2023-24': 177000,
    '2024-25': 180600,
  },
  'Madhya Pradesh': {
    '2004-05': 54200, '2005-06': 58300, '2006-07': 70300, '2007-08': 79000,
    '2008-09': 79200, '2009-10': 99500, '2010-11': 127600, '2011-12': 134100,
    '2012-13': 136000, '2013-14': 127700, '2014-15': 132700, '2015-16': 142200,
    '2016-17': 155400, '2017-18': 167700, '2018-19': 172200, '2019-20': 141400,
    '2020-21': 138300, '2021-22': 156200, '2022-23': 198400, '2023-24': 214900,
    '2024-25': 219300,
  },
  'Punjab': {
    '2004-05': 27600, '2005-06': 29700, '2006-07': 35900, '2007-08': 40300,
    '2008-09': 40400, '2009-10': 50700, '2010-11': 65000, '2011-12': 68400,
    '2012-13': 69300, '2013-14': 65100, '2014-15': 67600, '2015-16': 72500,
    '2016-17': 79200, '2017-18': 85500, '2018-19': 87800, '2019-20': 72100,
    '2020-21': 70500, '2021-22': 79600, '2022-23': 101100, '2023-24': 109600,
    '2024-25': 111800,
  },
  'Kerala': {
    '2004-05': 37200, '2005-06': 40000, '2006-07': 48300, '2007-08': 54200,
    '2008-09': 54300, '2009-10': 68300, '2010-11': 87500, '2011-12': 92000,
    '2012-13': 93300, '2013-14': 87600, '2014-15': 91000, '2015-16': 97600,
    '2016-17': 106700, '2017-18': 115100, '2018-19': 118200, '2019-20': 97100,
    '2020-21': 94900, '2021-22': 107200, '2022-23': 136200, '2023-24': 147500,
    '2024-25': 150500,
  },
  'Andhra Pradesh': {
    '2004-05': 40400, '2005-06': 43400, '2006-07': 52400, '2007-08': 58900,
    '2008-09': 59000, '2009-10': 74100, '2010-11': 95000, '2011-12': 99900,
    '2012-13': 101300, '2013-14': 95100, '2014-15': 98800, '2015-16': 106000,
    '2016-17': 115800, '2017-18': 124900, '2018-19': 128300, '2019-20': 105400,
    '2020-21': 103000, '2021-22': 116400, '2022-23': 147800, '2023-24': 160100,
    '2024-25': 163400,
  },
  'Bihar': {
    '2004-05': 26600, '2005-06': 28600, '2006-07': 34500, '2007-08': 38700,
    '2008-09': 38800, '2009-10': 48800, '2010-11': 62500, '2011-12': 65700,
    '2012-13': 66700, '2013-14': 62600, '2014-15': 65000, '2015-16': 69700,
    '2016-17': 76200, '2017-18': 82200, '2018-19': 84400, '2019-20': 69300,
    '2020-21': 67800, '2021-22': 76600, '2022-23': 97300, '2023-24': 105400,
    '2024-25': 107500,
  },
  'Odisha': {
    '2004-05': 15900, '2005-06': 17100, '2006-07': 20700, '2007-08': 23200,
    '2008-09': 23300, '2009-10': 29300, '2010-11': 37500, '2011-12': 39400,
    '2012-13': 40000, '2013-14': 37500, '2014-15': 39000, '2015-16': 41800,
    '2016-17': 45700, '2017-18': 49300, '2018-19': 50700, '2019-20': 41600,
    '2020-21': 40700, '2021-22': 45900, '2022-23': 58400, '2023-24': 63200,
    '2024-25': 64500,
  },
  'Chhattisgarh': {
    '2004-05': 11700, '2005-06': 12600, '2006-07': 15200, '2007-08': 17000,
    '2008-09': 17100, '2009-10': 21500, '2010-11': 27500, '2011-12': 28900,
    '2012-13': 29300, '2013-14': 27500, '2014-15': 28600, '2015-16': 30700,
    '2016-17': 33500, '2017-18': 36200, '2018-19': 37100, '2019-20': 30500,
    '2020-21': 29800, '2021-22': 33700, '2022-23': 42800, '2023-24': 46400,
    '2024-25': 47300,
  },
  'Jharkhand': {
    '2004-05': 10600, '2005-06': 11400, '2006-07': 13800, '2007-08': 15500,
    '2008-09': 15500, '2009-10': 19500, '2010-11': 25000, '2011-12': 26300,
    '2012-13': 26700, '2013-14': 25000, '2014-15': 26000, '2015-16': 27900,
    '2016-17': 30500, '2017-18': 32900, '2018-19': 33800, '2019-20': 27700,
    '2020-21': 27100, '2021-22': 30600, '2022-23': 38900, '2023-24': 42100,
    '2024-25': 43000,
  },
  'Assam': {
    '2004-05': 10600, '2005-06': 11400, '2006-07': 13800, '2007-08': 15500,
    '2008-09': 15500, '2009-10': 19500, '2010-11': 25000, '2011-12': 26300,
    '2012-13': 26700, '2013-14': 25000, '2014-15': 26000, '2015-16': 27900,
    '2016-17': 30500, '2017-18': 32900, '2018-19': 33800, '2019-20': 27700,
    '2020-21': 27100, '2021-22': 30600, '2022-23': 38900, '2023-24': 42100,
    '2024-25': 43000,
  },
  'Uttarakhand': {
    '2004-05': 8500, '2005-06': 9100, '2006-07': 11000, '2007-08': 12400,
    '2008-09': 12400, '2009-10': 15600, '2010-11': 20000, '2011-12': 21000,
    '2012-13': 21300, '2013-14': 20000, '2014-15': 20800, '2015-16': 22300,
    '2016-17': 24400, '2017-18': 26300, '2018-19': 27000, '2019-20': 22200,
    '2020-21': 21700, '2021-22': 24500, '2022-23': 31100, '2023-24': 33700,
    '2024-25': 34400,
  },
};

export const elvRvsfRegistry: ELVRVSFRegistry[] = [
  // ── Existing core RVSFs (with coordinates) ──
  { rvsfId: 'RVSF-001', name: 'MSTI Noida', state: 'Uttar Pradesh', district: 'Gautam Buddh Nagar', registrationDate: '2022-03-15', status: 'active', capacityPerYear: 25000, vehicleTypes: ['Four Wheeler', 'Three Wheeler'], lat: 28.54, lng: 77.39, pincode: '201305' },
  { rvsfId: 'RVSF-002', name: 'MSTI Gujarat', state: 'Gujarat', district: 'Ahmedabad', registrationDate: '2022-06-20', status: 'active', capacityPerYear: 20000, vehicleTypes: ['Four Wheeler'], lat: 23.03, lng: 72.57, pincode: '380001' },
  { rvsfId: 'RVSF-003', name: 'MSTI South - Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban', registrationDate: '2022-09-10', status: 'active', capacityPerYear: 18000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 12.97, lng: 77.59, pincode: '560001' },
  { rvsfId: 'RVSF-004', name: 'MSTI West - Pune', state: 'Maharashtra', district: 'Pune', registrationDate: '2022-11-05', status: 'active', capacityPerYear: 22000, vehicleTypes: ['Four Wheeler'], lat: 18.52, lng: 73.86, pincode: '411001' },
  { rvsfId: 'RVSF-005', name: 'Delhi RVSF Hub', state: 'Delhi', district: 'South West Delhi', registrationDate: '2021-08-12', status: 'active', capacityPerYear: 30000, vehicleTypes: ['Four Wheeler', 'Two Wheeler', 'Three Wheeler'], lat: 28.60, lng: 77.08, pincode: '110033' },
  { rvsfId: 'RVSF-006', name: 'Haryana Auto Scrap - Gurugram', state: 'Haryana', district: 'Gurugram', registrationDate: '2022-01-18', status: 'active', capacityPerYear: 15000, vehicleTypes: ['Four Wheeler'], lat: 28.46, lng: 77.03, pincode: '122001' },
  { rvsfId: 'RVSF-007', name: 'Chennai Vehicle Scrap Centre', state: 'Tamil Nadu', district: 'Chennai', registrationDate: '2022-04-22', status: 'active', capacityPerYear: 16000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 13.08, lng: 80.27, pincode: '600001' },
  { rvsfId: 'RVSF-008', name: 'Hyderabad ELV Processing', state: 'Telangana', district: 'Rangareddy', registrationDate: '2023-01-15', status: 'active', capacityPerYear: 12000, vehicleTypes: ['Four Wheeler'], lat: 17.38, lng: 78.48, pincode: '500001' },
  { rvsfId: 'RVSF-009', name: 'Kolkata Scrap Hub', state: 'West Bengal', district: 'Kolkata', registrationDate: '2023-03-20', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler', 'Three Wheeler'], lat: 22.57, lng: 88.36, pincode: '700001' },
  { rvsfId: 'RVSF-010', name: 'Rajasthan Auto Recycle - Jaipur', state: 'Rajasthan', district: 'Jaipur', registrationDate: '2023-06-10', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 26.91, lng: 75.79, pincode: '302001' },
  { rvsfId: 'RVSF-011', name: 'Punjab Vehicle Dismantling', state: 'Punjab', district: 'Ludhiana', registrationDate: '2023-09-05', status: 'active', capacityPerYear: 7000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 30.90, lng: 75.85, pincode: '141001' },
  { rvsfId: 'RVSF-012', name: 'Kerala ELV Hub - Kochi', state: 'Kerala', district: 'Ernakulam', registrationDate: '2024-01-20', status: 'active', capacityPerYear: 9000, vehicleTypes: ['Four Wheeler'], lat: 9.97, lng: 76.28, pincode: '682001' },
  { rvsfId: 'RVSF-013', name: 'Mumbai Scrap Centre - Thane', state: 'Maharashtra', district: 'Thane', registrationDate: '2023-11-15', status: 'active', capacityPerYear: 20000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 19.30, lng: 73.07, pincode: '421311' },
  { rvsfId: 'RVSF-014', name: 'Nagpur Auto Recycle', state: 'Maharashtra', district: 'Nagpur', registrationDate: '2024-02-28', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 21.15, lng: 79.09, pincode: '440001' },
  { rvsfId: 'RVSF-015', name: 'MP Vehicles Scrap - Indore', state: 'Madhya Pradesh', district: 'Indore', registrationDate: '2024-03-10', status: 'active', capacityPerYear: 7000, vehicleTypes: ['Four Wheeler'], lat: 22.72, lng: 75.86, pincode: '452001' },
  { rvsfId: 'RVSF-016', name: 'Andhra ELV Processing Centre', state: 'Andhra Pradesh', district: 'Visakhapatnam', registrationDate: '2024-01-05', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 17.69, lng: 83.22, pincode: '530001' },
  { rvsfId: 'RVSF-017', name: 'Coimbatore Scrap Hub', state: 'Tamil Nadu', district: 'Coimbatore', registrationDate: '2024-04-15', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 11.01, lng: 76.97, pincode: '641001' },
  { rvsfId: 'RVSF-018', name: 'Bengaluru South Scrap', state: 'Karnataka', district: 'Bengaluru Rural', registrationDate: '2024-05-20', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler'], lat: 12.71, lng: 77.76, pincode: '562106' },
  { rvsfId: 'RVSF-019', name: 'Ahmedabad ELV Centre', state: 'Gujarat', district: 'Ahmedabad', registrationDate: '2024-06-10', status: 'active', capacityPerYear: 12000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 22.99, lng: 72.63, pincode: '382405' },
  { rvsfId: 'RVSF-020', name: 'Lucknow Auto Scrap', state: 'Uttar Pradesh', district: 'Lucknow', registrationDate: '2024-07-15', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 26.85, lng: 80.95, pincode: '226001' },
  { rvsfId: 'RVSF-021', name: 'Bihar Vehicle Scrap - Patna', state: 'Bihar', district: 'Patna', registrationDate: '2024-08-20', status: 'inactive', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 25.60, lng: 85.13, pincode: '800001' },
  { rvsfId: 'RVSF-022', name: 'Odisha ELV Centre - Bhubaneswar', state: 'Odisha', district: 'Bhubaneswar', registrationDate: '2024-09-10', status: 'inactive', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 20.30, lng: 85.83, pincode: '751001' },
  { rvsfId: 'RVSF-023', name: 'Gurgaon Scrap Hub', state: 'Haryana', district: 'Gurugram', registrationDate: '2023-04-15', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.45, lng: 77.02, pincode: '122004' },
  { rvsfId: 'RVSF-024', name: 'Faridabad Vehicle Dismantling', state: 'Haryana', district: 'Faridabad', registrationDate: '2023-07-20', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 28.41, lng: 77.31, pincode: '121001' },
  { rvsfId: 'RVSF-025', name: 'Surat ELV Processing', state: 'Gujarat', district: 'Surat', registrationDate: '2023-10-05', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 21.17, lng: 72.83, pincode: '395001' },

  // ── Andhra Pradesh ──
  { rvsfId: 'AP-001', name: 'Antikythera Dynamics', state: 'Andhra Pradesh', district: 'Anantapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 14.68, lng: 77.60, pincode: '515721' },
  { rvsfId: 'AP-002', name: 'CYRYBRAL SOFT TECH', state: 'Andhra Pradesh', district: 'Vizianagaram', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 18.12, lng: 83.40, pincode: '535213' },
  { rvsfId: 'AP-003', name: 'Duggis Vehicle Scrapping', state: 'Andhra Pradesh', district: 'Krishna', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 16.89, lng: 80.10, pincode: '521175' },
  { rvsfId: 'AP-004', name: 'Hindustan Recycling Hub (AP)', state: 'Andhra Pradesh', district: 'Guntur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5500, vehicleTypes: ['Four Wheeler'], lat: 16.31, lng: 80.45, pincode: '522017' },

  // ── Assam ──
  { rvsfId: 'AS-001', name: 'ARUN SAHU', state: 'Assam', district: 'Tinsukia', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 27.49, lng: 95.36, pincode: '786146' },
  { rvsfId: 'AS-002', name: 'AXOM PLATINUM SCRAPPERS', state: 'Assam', district: 'Kamrup Rural', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 26.18, lng: 91.68, pincode: '781031' },
  { rvsfId: 'AS-003', name: 'HINDUSTAN RECYCLING HUB (AS)', state: 'Assam', district: 'Tinsukia', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 27.36, lng: 95.32, pincode: '786125' },
  { rvsfId: 'AS-004', name: 'KD ECOSYSTEM', state: 'Assam', district: 'Kamrup Rural', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 26.47, lng: 91.61, pincode: '781354' },
  { rvsfId: 'AS-005', name: 'Mahindra MSTC Recycling (AS)', state: 'Assam', district: 'Kamrup Rural', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 26.17, lng: 91.66, pincode: '781101' },

  // ── Bihar ──
  { rvsfId: 'BR-001', name: 'B.K Construction & Co', state: 'Bihar', district: 'Bhagalpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 25.39, lng: 87.10, pincode: '853204' },
  { rvsfId: 'BR-002', name: 'DHIRAJ KUMAR SINGH', state: 'Bihar', district: 'Saran', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 25.78, lng: 84.75, pincode: '841428' },
  { rvsfId: 'BR-003', name: 'KNOVEL VENTURES', state: 'Bihar', district: 'Vaishali', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 25.68, lng: 85.22, pincode: '844102' },
  { rvsfId: 'BR-004', name: 'S K ENTERPRISES (BR)', state: 'Bihar', district: 'Vaishali', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 25.69, lng: 85.24, pincode: '844102' },
  { rvsfId: 'BR-005', name: 'SRI NEELAYUM PRECOATED STEEL', state: 'Bihar', district: 'Patna', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 25.47, lng: 85.52, pincode: '803202' },

  // ── Chandigarh ──
  { rvsfId: 'CH-001', name: 'Select Technical Services', state: 'Chandigarh', district: 'Chandigarh', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 30.74, lng: 76.79, pincode: '160002' },

  // ── Chhattisgarh ──
  { rvsfId: 'CG-001', name: 'AGRAWAL STRUCTURE MILLS', state: 'Chhattisgarh', district: 'Raipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 21.28, lng: 81.70, pincode: '492001' },
  { rvsfId: 'CG-002', name: 'BHILAI TECHNO', state: 'Chhattisgarh', district: 'Durg', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 21.21, lng: 81.43, pincode: '490026' },
  { rvsfId: 'CG-003', name: 'CHHATTISGARH ECO RECYCLERS', state: 'Chhattisgarh', district: 'Bastar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 19.08, lng: 82.02, pincode: '494001' },
  { rvsfId: 'CG-004', name: 'Metal Corporation of India (CG)', state: 'Chhattisgarh', district: 'Raipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 21.25, lng: 81.65, pincode: '492001' },
  { rvsfId: 'CG-005', name: 'RAIPUR GREEN ENERGY', state: 'Chhattisgarh', district: 'Raipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 21.35, lng: 81.52, pincode: '493111' },
  { rvsfId: 'CG-006', name: 'S R SCRAPS', state: 'Chhattisgarh', district: 'Durg', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 21.20, lng: 81.42, pincode: '490026' },

  // ── Delhi ──
  { rvsfId: 'DL-001', name: 'A TO Z VEHICLE SCRAP', state: 'Delhi', district: 'North West Delhi', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.68, lng: 77.14, pincode: '110033' },
  { rvsfId: 'DL-002', name: 'BHARAT MOTORS (DL)', state: 'Delhi', district: 'South East Delhi', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 28.51, lng: 77.29, pincode: '110044' },
  { rvsfId: 'DL-003', name: 'EZWASTE RECYCLING', state: 'Delhi', district: 'South East Delhi', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.52, lng: 77.28, pincode: '110044' },

  // ── Goa ──
  { rvsfId: 'GA-001', name: 'Mangal Iron', state: 'Goa', district: 'North Goa', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 15.40, lng: 74.01, pincode: '403404' },

  // ── Gujarat ──
  { rvsfId: 'GJ-001', name: 'Baroda Green Sustainable Solutions', state: 'Gujarat', district: 'Vadodara', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 22.59, lng: 73.17, pincode: '391520' },
  { rvsfId: 'GJ-002', name: 'CMR Kataria Recycling', state: 'Gujarat', district: 'Kheda', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 22.75, lng: 72.55, pincode: '387550' },
  { rvsfId: 'GJ-003', name: 'Jitendra Recycling', state: 'Gujarat', district: 'Ahmedabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 22.83, lng: 72.15, pincode: '382220' },
  { rvsfId: 'GJ-004', name: 'KOTHI STEEL', state: 'Gujarat', district: 'Panchmahal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5500, vehicleTypes: ['Four Wheeler'], lat: 22.78, lng: 73.60, pincode: '389001' },
  { rvsfId: 'GJ-005', name: 'Mahindra MSTC Recycling (GJ)', state: 'Gujarat', district: 'Kheda', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 12000, vehicleTypes: ['Four Wheeler'], lat: 22.76, lng: 72.56, pincode: '387550' },
  { rvsfId: 'GJ-006', name: 'Mayapuri Trading Corporation', state: 'Gujarat', district: 'Ahmedabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 22.99, lng: 72.64, pincode: '382405' },
  { rvsfId: 'GJ-007', name: 'MTC BUSINESS', state: 'Gujarat', district: 'Ahmedabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 22.98, lng: 72.38, pincode: '382110' },
  { rvsfId: 'GJ-008', name: 'SHREE AMBICA AUTOMOTIVE', state: 'Gujarat', district: 'Surat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 21.26, lng: 72.98, pincode: '394180' },
  { rvsfId: 'GJ-009', name: 'Shuchaye Recyclers', state: 'Gujarat', district: 'Bhavnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 21.76, lng: 72.15, pincode: '364050' },
  { rvsfId: 'GJ-010', name: 'TT Recycling Management India', state: 'Gujarat', district: 'Ahmedabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 23.20, lng: 72.50, pincode: '382120' },

  // ── Haryana ──
  { rvsfId: 'HR-001', name: 'Bagga Link Service', state: 'Haryana', district: 'Sonipat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 28.99, lng: 77.02, pincode: '131021' },
  { rvsfId: 'HR-002', name: 'BLACK MINING JUNKYARD', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.62, lng: 76.60, pincode: '124107' },
  { rvsfId: 'HR-003', name: 'CHUNK RECYCLING INDIA', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 28.68, lng: 76.93, pincode: '124507' },
  { rvsfId: 'HR-004', name: 'COMPETENT RECYCLING SOLUTIONS', state: 'Haryana', district: 'Sonipat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 28.98, lng: 77.01, pincode: '131021' },
  { rvsfId: 'HR-005', name: 'DEEP SEWAK SCRAPPERS', state: 'Haryana', district: 'Sirsa', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 29.53, lng: 75.03, pincode: '125055' },
  { rvsfId: 'HR-006', name: 'GANPATI SCRAPPING SOLUTION', state: 'Haryana', district: 'Rewari', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.20, lng: 76.60, pincode: '123106' },
  { rvsfId: 'HR-007', name: 'HINDUSTAN SCRAP CORPORATION', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5500, vehicleTypes: ['Four Wheeler'], lat: 28.61, lng: 76.65, pincode: '124507' },
  { rvsfId: 'HR-008', name: 'INDIAN MOTORS (HR)', state: 'Haryana', district: 'Sonipat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.95, lng: 77.05, pincode: '131029' },
  { rvsfId: 'HR-009', name: 'JOHAR MOTORS', state: 'Haryana', district: 'Palwal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 27.89, lng: 77.37, pincode: '121105' },
  { rvsfId: 'HR-010', name: 'ABHISHEK K KAIHO RECYCLERS', state: 'Haryana', district: 'Gurugram', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.39, lng: 77.00, pincode: '122105' },
  { rvsfId: 'HR-011', name: 'NATH JI ENTERPRISES', state: 'Haryana', district: 'Sonipat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.97, lng: 77.03, pincode: '131001' },
  { rvsfId: 'HR-012', name: 'Neogreenfleet Recycling (HR)', state: 'Haryana', district: 'Gurugram', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 28.46, lng: 77.04, pincode: '122004' },
  { rvsfId: 'HR-013', name: 'Pineview Technology', state: 'Haryana', district: 'Sonipat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 28.86, lng: 77.02, pincode: '131028' },
  { rvsfId: 'HR-014', name: 'PKN MOTOR SCRAPPERS', state: 'Haryana', district: 'Sonipat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.94, lng: 77.06, pincode: '131029' },
  { rvsfId: 'HR-015', name: 'QUICK SCRAP', state: 'Haryana', district: 'Rewari', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.21, lng: 76.80, pincode: '123110' },
  { rvsfId: 'HR-016', name: 'RE SUSTAINABILITY AND RECYCLING', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 28.72, lng: 76.92, pincode: '124103' },
  { rvsfId: 'HR-017', name: 'Rosmerta Auto Recycling', state: 'Haryana', district: 'Gurugram', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 7000, vehicleTypes: ['Four Wheeler'], lat: 28.47, lng: 77.04, pincode: '122001' },
  { rvsfId: 'HR-018', name: 'SAM IMPEX', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.63, lng: 76.61, pincode: '124107' },
  { rvsfId: 'HR-019', name: 'SCRAP VEHICLE ELV INDIA', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 28.69, lng: 76.94, pincode: '124507' },
  { rvsfId: 'HR-020', name: 'SERVE UTTAM VENTURES', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.74, lng: 76.88, pincode: '124105' },
  { rvsfId: 'HR-021', name: 'SG JUNKYARD AND RECYCLING', state: 'Haryana', district: 'Jhajjar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.67, lng: 76.92, pincode: '124507' },
  { rvsfId: 'HR-022', name: 'SHRI SCRAPER AND RECYCLING CENTRE', state: 'Haryana', district: 'Hisar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.16, lng: 75.73, pincode: '125052' },
  { rvsfId: 'HR-023', name: 'TOTAL WASTE SOLUTION', state: 'Haryana', district: 'Ambala', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 30.38, lng: 76.77, pincode: '133004' },
  { rvsfId: 'HR-024', name: 'VARDHMAN AUTO RECYCLING', state: 'Haryana', district: 'Palwal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.14, lng: 77.33, pincode: '121102' },

  // ── Himachal Pradesh ──
  { rvsfId: 'HP-001', name: 'SAHNI ENTERPRISES', state: 'Himachal Pradesh', district: 'Sirmaur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 30.56, lng: 77.30, pincode: '173206' },
  { rvsfId: 'HP-002', name: 'SCRAP WARRIORS', state: 'Himachal Pradesh', district: 'Hamirpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 31.78, lng: 76.35, pincode: '177301' },

  // ── Jharkhand ──
  { rvsfId: 'JH-001', name: 'PINEVIEW RECYCLERS', state: 'Jharkhand', district: 'Ranchi', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 23.34, lng: 85.31, pincode: '834002' },
  { rvsfId: 'JH-002', name: 'PRADEEP KUMAR GUPTA', state: 'Jharkhand', district: 'Ranchi', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 23.37, lng: 85.33, pincode: '834005' },
  { rvsfId: 'JH-003', name: 'UTKAL AUTOCOACH', state: 'Jharkhand', district: 'West Singhbhum', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 22.60, lng: 85.83, pincode: '833220' },

  // ── Karnataka ──
  { rvsfId: 'KA-001', name: 'Mahindra MSTC Recycling (KA)', state: 'Karnataka', district: 'Bengaluru Rural', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler'], lat: 13.07, lng: 77.52, pincode: '562135' },
  { rvsfId: 'KA-002', name: 'SUHAS AUTOMOTIVE', state: 'Karnataka', district: 'Tumkur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 13.50, lng: 77.22, pincode: '572129' },
  { rvsfId: 'KA-003', name: 'TVS MOTOR COMPANY RVSF', state: 'Karnataka', district: 'Bengaluru Urban', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Two Wheeler', 'Three Wheeler'], lat: 12.72, lng: 77.77, pincode: '562106' },

  // ── Kerala ──
  { rvsfId: 'KL-001', name: 'SILK RVSF NORTH ZONE', state: 'Kerala', district: 'Kannur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 11.87, lng: 75.37, pincode: '670009' },
  { rvsfId: 'KL-002', name: 'SILK RVSF SOUTH ZONE', state: 'Kerala', district: 'Alappuzha', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 9.69, lng: 76.33, pincode: '688582' },
  { rvsfId: 'KL-003', name: 'SIMCO RVSF & KSRTC', state: 'Kerala', district: 'Malappuram', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 10.75, lng: 76.08, pincode: '679582' },

  // ── Ladakh ──
  { rvsfId: 'LA-001', name: 'Ibex Sales Corporation', state: 'Jammu & Kashmir', district: 'Leh', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 1500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 34.16, lng: 77.58, pincode: '194101' },

  // ── Madhya Pradesh ──
  { rvsfId: 'MP-001', name: 'Emperial Construction', state: 'Madhya Pradesh', district: 'Bhopal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 23.26, lng: 77.41, pincode: '462022' },
  { rvsfId: 'MP-002', name: 'Kakda Stone Crusher', state: 'Madhya Pradesh', district: 'Bhopal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 23.28, lng: 77.43, pincode: '462023' },
  { rvsfId: 'MP-003', name: 'MAA REWA ENTERPRISES', state: 'Madhya Pradesh', district: 'Bhopal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 23.63, lng: 77.42, pincode: '463106' },
  { rvsfId: 'MP-004', name: 'Mahindra MSTC Recycling (MP)', state: 'Madhya Pradesh', district: 'Indore', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 22.72, lng: 75.86, pincode: '453771' },
  { rvsfId: 'MP-005', name: 'Narmada Enterprises', state: 'Madhya Pradesh', district: 'Jabalpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 23.18, lng: 79.94, pincode: '482004' },
  { rvsfId: 'MP-006', name: 'Shivam Disposal', state: 'Madhya Pradesh', district: 'Gwalior', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 26.22, lng: 78.18, pincode: '475001' },

  // ── Maharashtra ──
  { rvsfId: 'MH-001', name: 'Alchemy Recycling', state: 'Maharashtra', district: 'Palghar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 19.65, lng: 73.14, pincode: '421303' },
  { rvsfId: 'MH-002', name: 'Automotive Manufacturers (Khalapur)', state: 'Maharashtra', district: 'Raigad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 18.78, lng: 73.28, pincode: '410206' },
  { rvsfId: 'MH-003', name: 'Automotive Manufacturers (Nagpur)', state: 'Maharashtra', district: 'Nagpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 21.16, lng: 79.10, pincode: '440026' },
  { rvsfId: 'MH-004', name: 'BHAGYALAXMI ROLLING MILL', state: 'Maharashtra', district: 'Jalna', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 19.83, lng: 75.88, pincode: '431213' },
  { rvsfId: 'MH-005', name: 'BHOSALE AUTOMOTIVE', state: 'Maharashtra', district: 'Pune', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5500, vehicleTypes: ['Four Wheeler'], lat: 18.62, lng: 73.90, pincode: '410501' },
  { rvsfId: 'MH-006', name: 'B M MOTORS', state: 'Maharashtra', district: 'Pune', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 18.46, lng: 74.60, pincode: '413801' },
  { rvsfId: 'MH-007', name: 'MADHUBAN TRADE STEELS', state: 'Maharashtra', district: 'Pune', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 6000, vehicleTypes: ['Four Wheeler'], lat: 18.76, lng: 73.86, pincode: '410501' },
  { rvsfId: 'MH-008', name: 'Mahindra MSTC Recycling (MH)', state: 'Maharashtra', district: 'Thane', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 12000, vehicleTypes: ['Four Wheeler'], lat: 19.31, lng: 73.08, pincode: '421311' },
  { rvsfId: 'MH-009', name: 'Re Vahaan Recyclers', state: 'Maharashtra', district: 'Nagpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 21.24, lng: 79.18, pincode: '441202' },
  { rvsfId: 'MH-010', name: 'TATA INTERNATIONAL VEHICLE APPLICATIONS', state: 'Maharashtra', district: 'Pune', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 8000, vehicleTypes: ['Four Wheeler'], lat: 18.64, lng: 73.89, pincode: '410501' },

  // ── Odisha ──
  { rvsfId: 'OR-001', name: 'Empreo Premium', state: 'Odisha', district: 'Puri', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 20.12, lng: 85.84, pincode: '752055' },
  { rvsfId: 'OR-002', name: 'PODDAR TYRES', state: 'Odisha', district: 'Jajpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 20.84, lng: 86.33, pincode: '755023' },

  // ── Punjab ──
  { rvsfId: 'PB-001', name: 'Bless Green Steel', state: 'Punjab', district: 'Ludhiana', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 30.90, lng: 75.87, pincode: '141416' },
  { rvsfId: 'PB-002', name: 'DADA TRADING COMPANY', state: 'Punjab', district: 'Rupnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 30.77, lng: 76.50, pincode: '140101' },
  { rvsfId: 'PB-003', name: 'DIMPLE ASSOCIATES', state: 'Punjab', district: 'Mansa', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 29.99, lng: 75.39, pincode: '151505' },
  { rvsfId: 'PB-004', name: 'GLOBAL SCRAPPAGE YARDS', state: 'Punjab', district: 'Mohali', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 30.60, lng: 76.80, pincode: '140507' },
  { rvsfId: 'PB-005', name: 'Junkmunchers (JMELV)', state: 'Punjab', district: 'Patiala', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 30.34, lng: 76.39, pincode: '147021' },
  { rvsfId: 'PB-006', name: 'Neogreenfleet Recycling (PB)', state: 'Punjab', district: 'Patiala', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 30.48, lng: 76.59, pincode: '140401' },
  { rvsfId: 'PB-007', name: 'VIKRAM ENTERPRISES (PB)', state: 'Punjab', district: 'Mansa', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 30.00, lng: 75.40, pincode: '151505' },

  // ── Rajasthan ──
  { rvsfId: 'RJ-001', name: 'Ganganagar Vaahan Udyog', state: 'Rajasthan', district: 'Jaipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 26.90, lng: 75.78, pincode: '303007' },
  { rvsfId: 'RJ-002', name: 'NIRGUN MOTOR RECYCLERS', state: 'Rajasthan', district: 'Jaipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 26.85, lng: 75.80, pincode: '303348' },
  { rvsfId: 'RJ-003', name: 'SCRAPIO AUTO', state: 'Rajasthan', district: 'Jaipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 27.40, lng: 75.93, pincode: '303103' },
  { rvsfId: 'RJ-004', name: 'WORTECH ENGINEERS', state: 'Rajasthan', district: 'Jaipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 26.70, lng: 75.95, pincode: '303904' },

  // ── Tamil Nadu ──
  { rvsfId: 'TN-001', name: 'MAHINDRA MSTC RECYCLING (TN)', state: 'Tamil Nadu', district: 'Kancheepuram', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler'], lat: 12.97, lng: 79.95, pincode: '631604' },

  // ── Telangana ──
  { rvsfId: 'TS-001', name: 'Amber Enterprises', state: 'Telangana', district: 'Siddipet', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 17.85, lng: 78.60, pincode: '502334' },
  { rvsfId: 'TS-002', name: 'AUTOTECH SCRAPPERS', state: 'Telangana', district: 'Nandyal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 16.51, lng: 79.87, pincode: '515721' },
  { rvsfId: 'TS-003', name: 'Sri Harsha Equipments India', state: 'Telangana', district: 'Sangareddy', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 17.55, lng: 78.32, pincode: '502307' },

  // ── Uttarakhand ──
  { rvsfId: 'UK-001', name: 'GADAR KHARDA', state: 'Uttarakhand', district: 'Haridwar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 29.85, lng: 77.89, pincode: '247668' },
  { rvsfId: 'UK-002', name: 'GARHWAL SCRAP', state: 'Uttarakhand', district: 'Haridwar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.86, lng: 77.90, pincode: '247668' },
  { rvsfId: 'UK-003', name: 'HONEST RECYCLING', state: 'Uttarakhand', district: 'Haridwar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 29.92, lng: 78.10, pincode: '247663' },
  { rvsfId: 'UK-004', name: 'RAG Engines', state: 'Uttarakhand', district: 'Haridwar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 29.93, lng: 77.95, pincode: '247661' },
  { rvsfId: 'UK-005', name: 'SEGA TECH SOLUTION', state: 'Uttarakhand', district: 'Haridwar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 29.84, lng: 77.88, pincode: '247667' },

  // ── Uttar Pradesh (new) ──
  { rvsfId: 'UP-N001', name: 'AA1 SCRAP CENTER', state: 'Uttar Pradesh', district: 'Muzaffarnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.47, lng: 77.70, pincode: '251308' },
  { rvsfId: 'UP-N002', name: 'AAKHYA VEHICLE SCRAPPING CENTER', state: 'Uttar Pradesh', district: 'Agra', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 27.18, lng: 78.01, pincode: '282007' },
  { rvsfId: 'UP-N003', name: 'Agarwal Trading', state: 'Uttar Pradesh', district: 'Kanpur Dehat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 26.15, lng: 79.90, pincode: '209312' },
  { rvsfId: 'UP-N004', name: 'AGP SCRAPPING SERVICES', state: 'Uttar Pradesh', district: 'Saharanpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 29.97, lng: 77.55, pincode: '247001' },
  { rvsfId: 'UP-N005', name: 'AMAR TELECOMMUNICATION & CONSTRUCTION', state: 'Uttar Pradesh', district: 'Meerut', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.98, lng: 77.72, pincode: '250002' },
  { rvsfId: 'UP-N006', name: 'ARUN KUMAR MISHRA', state: 'Uttar Pradesh', district: 'Kanpur Dehat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 26.20, lng: 80.01, pincode: '224172' },
  { rvsfId: 'UP-N007', name: 'AS SCRAP YARD', state: 'Uttar Pradesh', district: 'Muzaffarnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.46, lng: 77.69, pincode: '251003' },
  { rvsfId: 'UP-N008', name: 'ASTHA GOEL', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.73, lng: 77.78, pincode: '245101' },
  { rvsfId: 'UP-N009', name: 'A.S.V. TRADERS', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.40, lng: 77.85, pincode: '203394' },
  { rvsfId: 'UP-N010', name: 'Atal Scraper', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.41, lng: 77.86, pincode: '203001' },
  { rvsfId: 'UP-N011', name: 'AZMI ZOYA CONTRACTOR', state: 'Uttar Pradesh', district: 'Azamgarh', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 26.07, lng: 83.18, pincode: '276121' },
  { rvsfId: 'UP-N012', name: 'BANDHAN AUTO SCRAPING', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.75, lng: 77.30, pincode: '201003' },
  { rvsfId: 'UP-N013', name: 'Bharat Motor (Sikandrabad)', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 28.45, lng: 77.69, pincode: '203205' },
  { rvsfId: 'UP-N014', name: 'Bharat Scrap Facilities', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 28.44, lng: 77.70, pincode: '203205' },
  { rvsfId: 'UP-N015', name: 'BHARAT VEHICLE SCRAP FACILITY', state: 'Uttar Pradesh', district: 'Meerut', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 29.42, lng: 77.68, pincode: '250601' },
  { rvsfId: 'UP-N016', name: 'BHARAT WASTE MANAGEMENT', state: 'Uttar Pradesh', district: 'Bareilly', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.38, lng: 79.43, pincode: '243201' },
  { rvsfId: 'UP-N017', name: 'Brawny Minerals', state: 'Uttar Pradesh', district: 'Saharanpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 29.86, lng: 77.91, pincode: '247669' },
  { rvsfId: 'UP-N018', name: 'buland motors', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.39, lng: 77.84, pincode: '203001' },
  { rvsfId: 'UP-N019', name: 'CSR MOTOR SCRAPPERS', state: 'Uttar Pradesh', district: 'Gorakhpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 26.76, lng: 83.37, pincode: '273401' },
  { rvsfId: 'UP-N020', name: 'Dilshad Ahemad', state: 'Uttar Pradesh', district: 'Bijnor', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 29.37, lng: 78.13, pincode: '246734' },
  { rvsfId: 'UP-N021', name: 'DOSNEXTGEN INDIA', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.74, lng: 77.79, pincode: '245101' },
  { rvsfId: 'UP-N022', name: 'Dr. Pranjal Patel', state: 'Uttar Pradesh', district: 'Auraiya', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 26.46, lng: 79.51, pincode: '206244' },
  { rvsfId: 'UP-N023', name: 'Firozabad Vehicle Scrapping Center', state: 'Uttar Pradesh', district: 'Firozabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 27.15, lng: 78.40, pincode: '283203' },
  { rvsfId: 'UP-N024', name: 'Genesis Vehicle Scrapping', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.72, lng: 77.77, pincode: '245101' },
  { rvsfId: 'UP-N025', name: 'GLOBAL ULTRA TECH', state: 'Uttar Pradesh', district: 'Rampur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.81, lng: 79.00, pincode: '244921' },
  { rvsfId: 'UP-N026', name: 'GLOBAL VEHICLE WASTE MANAGEMENT', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.75, lng: 77.80, pincode: '245206' },
  { rvsfId: 'UP-N027', name: 'GOENKA MOTORS', state: 'Uttar Pradesh', district: 'Varanasi', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 25.32, lng: 83.01, pincode: '221206' },
  { rvsfId: 'UP-N028', name: 'GO GREEN ELV HANDLERS', state: 'Uttar Pradesh', district: 'Baghpat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.95, lng: 77.22, pincode: '250101' },
  { rvsfId: 'UP-N029', name: 'GOODVALUE AUTO SCRAP', state: 'Uttar Pradesh', district: 'Muzaffarnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.40, lng: 77.72, pincode: '251203' },
  { rvsfId: 'UP-N030', name: 'GRAND GLOBAL JUNKYARD', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.71, lng: 77.76, pincode: '245101' },
  { rvsfId: 'UP-N031', name: 'GREEN INDIA VEHICLE SCRAP', state: 'Uttar Pradesh', district: 'Bareilly', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.36, lng: 79.41, pincode: '243303' },
  { rvsfId: 'UP-N032', name: 'HERWIN MOTORS INDUSTRY', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.75, lng: 77.30, pincode: '201102' },
  { rvsfId: 'UP-N033', name: 'INDIA SCRAP ENTERPRISE', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.79, lng: 78.11, pincode: '245205' },
  { rvsfId: 'UP-N034', name: 'INNOVATION ELEPHANTS', state: 'Uttar Pradesh', district: 'Etawah', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 26.78, lng: 79.02, pincode: '206001' },
  { rvsfId: 'UP-N035', name: 'IRSHAD MALIK', state: 'Uttar Pradesh', district: 'Aligarh', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 27.88, lng: 78.08, pincode: '202001' },
  { rvsfId: 'UP-N036', name: 'JAI HIND VEHICLE SCRAP (Moradabad)', state: 'Uttar Pradesh', district: 'Moradabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.84, lng: 78.77, pincode: '244221' },
  { rvsfId: 'UP-N037', name: 'JAI HIND VEHICLE SCRAP (Hapur)', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.76, lng: 77.81, pincode: '245101' },
  { rvsfId: 'UP-N038', name: 'KAKA VEHICLE FITNESS', state: 'Uttar Pradesh', district: 'Moradabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler', 'Two Wheeler'], lat: 28.85, lng: 78.78, pincode: '244504' },
  { rvsfId: 'UP-N039', name: 'KHURJA MOTORS', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.25, lng: 77.85, pincode: '203131' },
  { rvsfId: 'UP-N040', name: 'KUSEDI AZ RECYCLING', state: 'Uttar Pradesh', district: 'Badaun', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.07, lng: 79.09, pincode: '243638' },
  { rvsfId: 'UP-N041', name: 'LDR TRADERS', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 28.80, lng: 78.12, pincode: '245205' },
  { rvsfId: 'UP-N042', name: 'LHP AWADH SCRAPPING FACILITY', state: 'Uttar Pradesh', district: 'Sitapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 27.56, lng: 80.68, pincode: '261001' },
  { rvsfId: 'UP-N043', name: 'Mahindra MSTC Recycling (UP)', state: 'Uttar Pradesh', district: 'Gautam Buddh Nagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 10000, vehicleTypes: ['Four Wheeler'], lat: 28.47, lng: 77.50, pincode: '201306' },
  { rvsfId: 'UP-N044', name: 'MANGALMURTYE ENTERPRISES', state: 'Uttar Pradesh', district: 'Lalitpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 24.69, lng: 78.41, pincode: '284121' },
  { rvsfId: 'UP-N045', name: 'MANI FLOUR MILL', state: 'Uttar Pradesh', district: 'Raebareli', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 26.23, lng: 81.24, pincode: '229303' },
  { rvsfId: 'UP-N046', name: 'MARUTI SUZUKI TOYOTSU INDIA (MSTI)', state: 'Uttar Pradesh', district: 'Gautam Buddh Nagar', registrationDate: '2022-03-01', status: 'active', capacityPerYear: 25000, vehicleTypes: ['Four Wheeler', 'Two Wheeler', 'Three Wheeler'], lat: 28.54, lng: 77.39, pincode: '201305' },
  { rvsfId: 'UP-N047', name: 'MINERAL OIL COMPANY', state: 'Uttar Pradesh', district: 'Raebareli', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 26.24, lng: 81.25, pincode: '209305' },
  { rvsfId: 'UP-N048', name: 'Mohd Shadik', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 28.26, lng: 77.86, pincode: '203131' },
  { rvsfId: 'UP-N049', name: 'Mohit Agencies', state: 'Uttar Pradesh', district: 'Kanpur Dehat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 26.16, lng: 79.91, pincode: '209304' },
  { rvsfId: 'UP-N050', name: 'Moto Scrapland', state: 'Uttar Pradesh', district: 'Barabanki', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 26.93, lng: 81.20, pincode: '225203' },
  { rvsfId: 'UP-N051', name: 'M/S GOPALA CHATURVEDI', state: 'Uttar Pradesh', district: 'Mathura', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 27.49, lng: 77.52, pincode: '281403' },
  { rvsfId: 'UP-N052', name: 'M/S GREEN AUTO SCRAPPING', state: 'Uttar Pradesh', district: 'Agra', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 27.19, lng: 78.02, pincode: '282007' },
  { rvsfId: 'UP-N053', name: 'M/S RAJ COMPANY', state: 'Uttar Pradesh', district: 'Lakhimpur Kheri', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 27.95, lng: 80.78, pincode: '262701' },
  { rvsfId: 'UP-N054', name: 'M/S SHASTA TRADERS', state: 'Uttar Pradesh', district: 'Firozabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 27.16, lng: 78.41, pincode: '283203' },
  { rvsfId: 'UP-N055', name: 'MTQ Traders', state: 'Uttar Pradesh', district: 'Muzaffarnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 29.48, lng: 77.71, pincode: '251003' },
  { rvsfId: 'UP-N056', name: 'National Enterprises (UP)', state: 'Uttar Pradesh', district: 'Rampur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 28.70, lng: 79.08, pincode: '244924' },
  { rvsfId: 'UP-N057', name: 'NEW HINDUSTAN SCRAPE TRADING', state: 'Uttar Pradesh', district: 'Aligarh', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 27.89, lng: 78.09, pincode: '202002' },
  { rvsfId: 'UP-N058', name: 'NEXT LIFE SCRAP INDIA', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.68, lng: 77.46, pincode: '201003' },
  { rvsfId: 'UP-N059', name: 'NIRVANA SCRAPPERS', state: 'Uttar Pradesh', district: 'Baghpat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.96, lng: 77.23, pincode: '250101' },
  { rvsfId: 'UP-N060', name: 'NS Vehicle Scrap', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.42, lng: 77.87, pincode: '203395' },
  { rvsfId: 'UP-N061', name: 'P S Enterprises', state: 'Uttar Pradesh', district: 'Lucknow', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 26.86, lng: 80.96, pincode: '226401' },
  { rvsfId: 'UP-N062', name: 'Purvanchal Auto Scrap & Recycling Centre', state: 'Uttar Pradesh', district: 'Ghazipur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 25.58, lng: 83.57, pincode: '233304' },
  { rvsfId: 'UP-N063', name: 'RAJ ASSOCIATES', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.60, lng: 78.07, pincode: '245412' },
  { rvsfId: 'UP-N064', name: 'RATANGARH VEHICLE SCRAP', state: 'Uttar Pradesh', district: 'Bijnor', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 29.38, lng: 78.14, pincode: '246734' },
  { rvsfId: 'UP-N065', name: 'RK SWIFT SOLUTION', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.76, lng: 77.31, pincode: '201102' },
  { rvsfId: 'UP-N066', name: 'Royal Motors (Baghpat)', state: 'Uttar Pradesh', district: 'Baghpat', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.97, lng: 77.24, pincode: '250609' },
  { rvsfId: 'UP-N067', name: 'ROYAL RECYCLING INDUSTRIES', state: 'Uttar Pradesh', district: 'Bulandshahr', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.27, lng: 77.87, pincode: '203131' },
  { rvsfId: 'UP-N068', name: 'ROYAL VEHICLE ENTERPRISES', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.74, lng: 77.82, pincode: '245101' },
  { rvsfId: 'UP-N069', name: 'RR&R MANTECH', state: 'Uttar Pradesh', district: 'Sambhal', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.58, lng: 78.57, pincode: '244302' },
  { rvsfId: 'UP-N070', name: 'RUDRA TRADING COMPANY', state: 'Uttar Pradesh', district: 'Muzaffarnagar', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.49, lng: 77.72, pincode: '251003' },
  { rvsfId: 'UP-N071', name: 'SARAL AUTO SCRAPING INDIA', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.69, lng: 77.47, pincode: '201003' },
  { rvsfId: 'UP-N072', name: 'Scrapvenger ELV India', state: 'Uttar Pradesh', district: 'Lucknow', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 26.75, lng: 81.10, pincode: '226301' },
  { rvsfId: 'UP-N073', name: 'SEVEN STAR AUTO SCRAPING INDIA', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.70, lng: 77.48, pincode: '201003' },
  { rvsfId: 'UP-N074', name: 'SHEEBA UDYOG RECYCLING', state: 'Uttar Pradesh', district: 'Hapur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.77, lng: 77.83, pincode: '245301' },
  { rvsfId: 'UP-N075', name: 'SHESHDHER SINGH', state: 'Uttar Pradesh', district: 'Meerut', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.74, lng: 77.79, pincode: '245206' },
  { rvsfId: 'UP-N076', name: 'SHREE ENTERPRISES (LKO)', state: 'Uttar Pradesh', district: 'Lucknow', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 26.76, lng: 81.11, pincode: '226301' },
  { rvsfId: 'UP-N077', name: 'shri ji agro engineering works', state: 'Uttar Pradesh', district: 'Agra', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 27.20, lng: 78.03, pincode: '283124' },
  { rvsfId: 'UP-N078', name: 'Simran Recyclings', state: 'Uttar Pradesh', district: 'Saharanpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 29.98, lng: 77.56, pincode: '247001' },
  { rvsfId: 'UP-N079', name: 'SPARKGREEN UDHYOG RECYCLING', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.83, lng: 77.60, pincode: '201204' },
  { rvsfId: 'UP-N080', name: 'SPR SCRAP CENTRE', state: 'Uttar Pradesh', district: 'Gorakhpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 26.77, lng: 83.38, pincode: '273001' },
  { rvsfId: 'UP-N081', name: 'SSENTERPRISE', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.66, lng: 77.44, pincode: '201102' },
  { rvsfId: 'UP-N082', name: 'SUNRICE SCRAP CENTER', state: 'Uttar Pradesh', district: 'Shahjahanpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 27.88, lng: 79.91, pincode: '242301' },
  { rvsfId: 'UP-N083', name: 'THSILDAR SINGH SECURITIES', state: 'Uttar Pradesh', district: 'Gorakhpur', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 26.78, lng: 83.39, pincode: '273015' },
  { rvsfId: 'UP-N084', name: 'UNION VEHICLE SCRAP', state: 'Uttar Pradesh', district: 'Moradabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 28.86, lng: 78.79, pincode: '244102' },
  { rvsfId: 'UP-N085', name: 'UNITED IRON & STEEL CORP.', state: 'Uttar Pradesh', district: 'Aligarh', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 27.90, lng: 78.10, pincode: '202001' },
  { rvsfId: 'UP-N086', name: 'U S ENTERPRISES', state: 'Uttar Pradesh', district: 'Bijnor', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 29.39, lng: 78.15, pincode: '246761' },
  { rvsfId: 'UP-N087', name: 'VARUN PACKERS', state: 'Uttar Pradesh', district: 'Agra', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 27.21, lng: 78.04, pincode: '283135' },
  { rvsfId: 'UP-N088', name: 'VIKKY SAINI', state: 'Uttar Pradesh', district: 'Moradabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 2500, vehicleTypes: ['Four Wheeler'], lat: 28.87, lng: 78.80, pincode: '244001' },
  { rvsfId: 'UP-N089', name: 'VIRAT SCRAPPERS', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3500, vehicleTypes: ['Four Wheeler'], lat: 28.77, lng: 77.32, pincode: '201102' },
  { rvsfId: 'UP-N090', name: 'V VENTURES', state: 'Uttar Pradesh', district: 'Agra', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 3000, vehicleTypes: ['Four Wheeler'], lat: 27.17, lng: 78.00, pincode: '282006' },
  { rvsfId: 'UP-N091', name: 'YGA STAR AUTO SCRAPPING CENTRE', state: 'Uttar Pradesh', district: 'Ghaziabad', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 28.67, lng: 77.45, pincode: '201003' },

  // ── West Bengal ──
  { rvsfId: 'WB-001', name: 'Bengal Recycling Hub', state: 'West Bengal', district: 'Hooghly', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 22.90, lng: 88.39, pincode: '712305' },
  { rvsfId: 'WB-002', name: 'Eccel Exports', state: 'West Bengal', district: 'Howrah', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4500, vehicleTypes: ['Four Wheeler'], lat: 22.47, lng: 88.07, pincode: '711306' },
  { rvsfId: 'WB-003', name: 'Hollyhocks India', state: 'West Bengal', district: 'South 24 Parganas', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 4000, vehicleTypes: ['Four Wheeler'], lat: 22.20, lng: 88.45, pincode: '743387' },
  { rvsfId: 'WB-004', name: 'Selladale Synergies India', state: 'West Bengal', district: 'Nadia', registrationDate: '2024-01-01', status: 'active', capacityPerYear: 5000, vehicleTypes: ['Four Wheeler'], lat: 22.98, lng: 88.44, pincode: '741234' },
];

// RVSF Collection Data — Vahan portal realistic totals:
// FY 2021-22: ~45K national | FY 2022-23: ~108K | FY 2023-24: ~193K | FY 2024-25: ~320K
const _baseElvRvsfCollectionData: ELVRVSFCollection[] = [
  // FY 2021-22 — national ~45,000 (RVSF policy nascent, pilot RVSFs only)
  { rvsfId: 'RVSF-005', state: 'Delhi', fyYear: '2021-22', vehiclesCollected: 13000 },
  { rvsfId: 'RVSF-001', state: 'Uttar Pradesh', fyYear: '2021-22', vehiclesCollected: 4000 },
  { rvsfId: 'RVSF-004', state: 'Maharashtra', fyYear: '2021-22', vehiclesCollected: 6000 },
  { rvsfId: 'RVSF-006', state: 'Haryana', fyYear: '2021-22', vehiclesCollected: 3000 },
  { rvsfId: 'RVSF-002', state: 'Gujarat', fyYear: '2021-22', vehiclesCollected: 5000 },
  { rvsfId: 'RVSF-003', state: 'Karnataka', fyYear: '2021-22', vehiclesCollected: 4500 },
  { rvsfId: 'RVSF-007', state: 'Tamil Nadu', fyYear: '2021-22', vehiclesCollected: 3500 },
  { rvsfId: 'RVSF-008', state: 'Telangana', fyYear: '2021-22', vehiclesCollected: 2500 },
  { rvsfId: 'RVSF-009', state: 'West Bengal', fyYear: '2021-22', vehiclesCollected: 2000 },
  { rvsfId: 'RVSF-010', state: 'Rajasthan', fyYear: '2021-22', vehiclesCollected: 1500 },
  // FY 2022-23 — national ~108,000 (rapid scale-up, new registrations)
  { rvsfId: 'RVSF-005', state: 'Delhi', fyYear: '2022-23', vehiclesCollected: 15000 },
  { rvsfId: 'RVSF-001', state: 'Uttar Pradesh', fyYear: '2022-23', vehiclesCollected: 9000 },
  { rvsfId: 'RVSF-020', state: 'Uttar Pradesh', fyYear: '2022-23', vehiclesCollected: 4500 },
  { rvsfId: 'RVSF-004', state: 'Maharashtra', fyYear: '2022-23', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-013', state: 'Maharashtra', fyYear: '2022-23', vehiclesCollected: 8000 },
  { rvsfId: 'RVSF-006', state: 'Haryana', fyYear: '2022-23', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-023', state: 'Haryana', fyYear: '2022-23', vehiclesCollected: 4000 },
  { rvsfId: 'RVSF-024', state: 'Haryana', fyYear: '2022-23', vehiclesCollected: 3500 },
  { rvsfId: 'RVSF-002', state: 'Gujarat', fyYear: '2022-23', vehiclesCollected: 10000 },
  { rvsfId: 'RVSF-025', state: 'Gujarat', fyYear: '2022-23', vehiclesCollected: 4500 },
  { rvsfId: 'RVSF-003', state: 'Karnataka', fyYear: '2022-23', vehiclesCollected: 9000 },
  { rvsfId: 'RVSF-007', state: 'Tamil Nadu', fyYear: '2022-23', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-008', state: 'Telangana', fyYear: '2022-23', vehiclesCollected: 5000 },
  { rvsfId: 'RVSF-009', state: 'West Bengal', fyYear: '2022-23', vehiclesCollected: 4000 },
  { rvsfId: 'RVSF-010', state: 'Rajasthan', fyYear: '2022-23', vehiclesCollected: 3000 },
  { rvsfId: 'RVSF-011', state: 'Punjab', fyYear: '2022-23', vehiclesCollected: 2500 },
  // FY 2023-24 — national ~193,000 (gov incentive scheme + FAME-III push)
  { rvsfId: 'RVSF-005', state: 'Delhi', fyYear: '2023-24', vehiclesCollected: 22000 },
  { rvsfId: 'RVSF-001', state: 'Uttar Pradesh', fyYear: '2023-24', vehiclesCollected: 13000 },
  { rvsfId: 'RVSF-020', state: 'Uttar Pradesh', fyYear: '2023-24', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-004', state: 'Maharashtra', fyYear: '2023-24', vehiclesCollected: 16000 },
  { rvsfId: 'RVSF-013', state: 'Maharashtra', fyYear: '2023-24', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-014', state: 'Maharashtra', fyYear: '2023-24', vehiclesCollected: 5000 },
  { rvsfId: 'RVSF-006', state: 'Haryana', fyYear: '2023-24', vehiclesCollected: 9000 },
  { rvsfId: 'RVSF-023', state: 'Haryana', fyYear: '2023-24', vehiclesCollected: 5500 },
  { rvsfId: 'RVSF-024', state: 'Haryana', fyYear: '2023-24', vehiclesCollected: 5500 },
  { rvsfId: 'RVSF-002', state: 'Gujarat', fyYear: '2023-24', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-019', state: 'Gujarat', fyYear: '2023-24', vehiclesCollected: 6000 },
  { rvsfId: 'RVSF-025', state: 'Gujarat', fyYear: '2023-24', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-003', state: 'Karnataka', fyYear: '2023-24', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-018', state: 'Karnataka', fyYear: '2023-24', vehiclesCollected: 5000 },
  { rvsfId: 'RVSF-007', state: 'Tamil Nadu', fyYear: '2023-24', vehiclesCollected: 10000 },
  { rvsfId: 'RVSF-017', state: 'Tamil Nadu', fyYear: '2023-24', vehiclesCollected: 6000 },
  { rvsfId: 'RVSF-008', state: 'Telangana', fyYear: '2023-24', vehiclesCollected: 9000 },
  { rvsfId: 'RVSF-016', state: 'Andhra Pradesh', fyYear: '2023-24', vehiclesCollected: 5000 },
  { rvsfId: 'RVSF-009', state: 'West Bengal', fyYear: '2023-24', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-010', state: 'Rajasthan', fyYear: '2023-24', vehiclesCollected: 5000 },
  { rvsfId: 'RVSF-011', state: 'Punjab', fyYear: '2023-24', vehiclesCollected: 4000 },
  { rvsfId: 'RVSF-012', state: 'Kerala', fyYear: '2023-24', vehiclesCollected: 6000 },
  { rvsfId: 'RVSF-015', state: 'Madhya Pradesh', fyYear: '2023-24', vehiclesCollected: 4000 },
  // FY 2024-25 — national ~320,000 (mature ecosystem, 25 active RVSFs)
  { rvsfId: 'RVSF-005', state: 'Delhi', fyYear: '2024-25', vehiclesCollected: 33000 },
  { rvsfId: 'RVSF-001', state: 'Uttar Pradesh', fyYear: '2024-25', vehiclesCollected: 20000 },
  { rvsfId: 'RVSF-020', state: 'Uttar Pradesh', fyYear: '2024-25', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-004', state: 'Maharashtra', fyYear: '2024-25', vehiclesCollected: 25000 },
  { rvsfId: 'RVSF-013', state: 'Maharashtra', fyYear: '2024-25', vehiclesCollected: 20000 },
  { rvsfId: 'RVSF-014', state: 'Maharashtra', fyYear: '2024-25', vehiclesCollected: 9000 },
  { rvsfId: 'RVSF-006', state: 'Haryana', fyYear: '2024-25', vehiclesCollected: 14000 },
  { rvsfId: 'RVSF-023', state: 'Haryana', fyYear: '2024-25', vehiclesCollected: 10000 },
  { rvsfId: 'RVSF-024', state: 'Haryana', fyYear: '2024-25', vehiclesCollected: 7500 },
  { rvsfId: 'RVSF-002', state: 'Gujarat', fyYear: '2024-25', vehiclesCollected: 20000 },
  { rvsfId: 'RVSF-019', state: 'Gujarat', fyYear: '2024-25', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-025', state: 'Gujarat', fyYear: '2024-25', vehiclesCollected: 10000 },
  { rvsfId: 'RVSF-003', state: 'Karnataka', fyYear: '2024-25', vehiclesCollected: 20000 },
  { rvsfId: 'RVSF-018', state: 'Karnataka', fyYear: '2024-25', vehiclesCollected: 10000 },
  { rvsfId: 'RVSF-007', state: 'Tamil Nadu', fyYear: '2024-25', vehiclesCollected: 18000 },
  { rvsfId: 'RVSF-017', state: 'Tamil Nadu', fyYear: '2024-25', vehiclesCollected: 8000 },
  { rvsfId: 'RVSF-008', state: 'Telangana', fyYear: '2024-25', vehiclesCollected: 14000 },
  { rvsfId: 'RVSF-016', state: 'Andhra Pradesh', fyYear: '2024-25', vehiclesCollected: 8000 },
  { rvsfId: 'RVSF-009', state: 'West Bengal', fyYear: '2024-25', vehiclesCollected: 12000 },
  { rvsfId: 'RVSF-010', state: 'Rajasthan', fyYear: '2024-25', vehiclesCollected: 8000 },
  { rvsfId: 'RVSF-011', state: 'Punjab', fyYear: '2024-25', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-012', state: 'Kerala', fyYear: '2024-25', vehiclesCollected: 10000 },
  { rvsfId: 'RVSF-015', state: 'Madhya Pradesh', fyYear: '2024-25', vehiclesCollected: 7000 },
  { rvsfId: 'RVSF-021', state: 'Bihar', fyYear: '2024-25', vehiclesCollected: 3000 },
  { rvsfId: 'RVSF-022', state: 'Odisha', fyYear: '2024-25', vehiclesCollected: 2500 },
];

export const elvRvsfCollectionData: ELVRVSFCollection[] = _baseElvRvsfCollectionData.map(entry => {
  const override = _elvCollectionOverrides[entry.fyYear]?.[entry.rvsfId];
  return override !== undefined ? { ...entry, vehiclesCollected: override } : entry;
});

export const elvOriginData: ELVOriginDataPoint[] = [
  // FY 2022-23
  { originState: 'Delhi', makeYear: 2007, fyYearScrapped: '2022-23', vehicleCount: 8500 },
  { originState: 'Delhi', makeYear: 2008, fyYearScrapped: '2022-23', vehicleCount: 9800 },
  { originState: 'Maharashtra', makeYear: 2006, fyYearScrapped: '2022-23', vehicleCount: 6200 },
  { originState: 'Maharashtra', makeYear: 2007, fyYearScrapped: '2022-23', vehicleCount: 7300 },
  { originState: 'Uttar Pradesh', makeYear: 2007, fyYearScrapped: '2022-23', vehicleCount: 5100 },
  { originState: 'Gujarat', makeYear: 2008, fyYearScrapped: '2022-23', vehicleCount: 4800 },
  { originState: 'Haryana', makeYear: 2007, fyYearScrapped: '2022-23', vehicleCount: 4200 },
  { originState: 'Karnataka', makeYear: 2008, fyYearScrapped: '2022-23', vehicleCount: 4600 },
  { originState: 'Tamil Nadu', makeYear: 2007, fyYearScrapped: '2022-23', vehicleCount: 3900 },
  { originState: 'Telangana', makeYear: 2008, fyYearScrapped: '2022-23', vehicleCount: 3200 },
  { originState: 'West Bengal', makeYear: 2007, fyYearScrapped: '2022-23', vehicleCount: 2800 },
  { originState: 'Rajasthan', makeYear: 2008, fyYearScrapped: '2022-23', vehicleCount: 2100 },
  // FY 2023-24
  { originState: 'Delhi', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 14000 },
  { originState: 'Delhi', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 12000 },
  { originState: 'Maharashtra', makeYear: 2007, fyYearScrapped: '2023-24', vehicleCount: 12500 },
  { originState: 'Maharashtra', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 11000 },
  { originState: 'Maharashtra', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 9500 },
  { originState: 'Uttar Pradesh', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 9000 },
  { originState: 'Uttar Pradesh', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 7800 },
  { originState: 'Gujarat', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 9500 },
  { originState: 'Gujarat', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 8200 },
  { originState: 'Haryana', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 8000 },
  { originState: 'Karnataka', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 8500 },
  { originState: 'Tamil Nadu', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 7500 },
  { originState: 'Telangana', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 5800 },
  { originState: 'West Bengal', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 4800 },
  { originState: 'Rajasthan', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 4000 },
  { originState: 'Punjab', makeYear: 2008, fyYearScrapped: '2023-24', vehicleCount: 3500 },
  { originState: 'Kerala', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 4500 },
  { originState: 'Madhya Pradesh', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 3000 },
  { originState: 'Andhra Pradesh', makeYear: 2009, fyYearScrapped: '2023-24', vehicleCount: 3200 },
  // FY 2024-25
  { originState: 'Delhi', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 20000 },
  { originState: 'Delhi', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 15000 },
  { originState: 'Maharashtra', makeYear: 2008, fyYearScrapped: '2024-25', vehicleCount: 18000 },
  { originState: 'Maharashtra', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 20000 },
  { originState: 'Maharashtra', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 16000 },
  { originState: 'Uttar Pradesh', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 14000 },
  { originState: 'Uttar Pradesh', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 12000 },
  { originState: 'Gujarat', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 13500 },
  { originState: 'Gujarat', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 11000 },
  { originState: 'Haryana', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 11000 },
  { originState: 'Haryana', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 9500 },
  { originState: 'Karnataka', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 13000 },
  { originState: 'Karnataka', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 10000 },
  { originState: 'Tamil Nadu', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 12000 },
  { originState: 'Tamil Nadu', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 9500 },
  { originState: 'Telangana', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 8500 },
  { originState: 'Telangana', makeYear: 2010, fyYearScrapped: '2024-25', vehicleCount: 7000 },
  { originState: 'West Bengal', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 7000 },
  { originState: 'Rajasthan', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 5500 },
  { originState: 'Punjab', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 5000 },
  { originState: 'Kerala', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 6500 },
  { originState: 'Madhya Pradesh', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 4500 },
  { originState: 'Andhra Pradesh', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 4800 },
  { originState: 'Bihar', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 2000 },
  { originState: 'Odisha', makeYear: 2009, fyYearScrapped: '2024-25', vehicleCount: 1800 },
];

// ELV AI Insights
export const elvAIInsights: AIInsight[] = [
  {
    id: 1,
    suggestion: 'Massive ELV wave incoming FY 2026-27. Vehicles sold in peak FY 2010-12 (~8.3M units) reach 15-year threshold. Prioritize greenfield RVSF approvals in Maharashtra, UP, and Delhi NCR within 18 months.',
    impact: 'high',
    category: 'Capacity Planning',
    source: 'SIAM Sales Historical Data + RVSF Registry (Vahan Portal)',
    reasoning: 'Current national RVSF capacity (~330K/year) covers only 4% of the incoming ELV wave. Without scale-up, 96% will be informally scrapped with zero environmental controls.',
  },
  {
    id: 2,
    suggestion: 'Bihar, Odisha, and Chhattisgarh have zero active RVSFs despite significant ELV populations. Fast-track licensing using hub-and-spoke model with satellite collection centres in these states.',
    impact: 'high',
    category: 'Infrastructure Gap',
    source: 'RVSF Registry Analysis + SIAM State Sales Data',
    reasoning: 'Combined ~6M vehicles sold FY 2005-12 in these three states have no formal scrapping pathway. All informal scrapping generates zero EPR credits and zero environmental controls.',
  },
  {
    id: 3,
    suggestion: 'Replicate Delhi NCR RVSF model in Bengaluru, Hyderabad, and Pune. Delhi shows highest collection rate (82% of ELV target) — document this playbook for scale.',
    impact: 'medium',
    category: 'Best Practice Replication',
    source: 'Delhi RVSF Performance Data + National Benchmarking',
    reasoning: 'Delhi\'s success driven by 3+ active RVSFs, enforcement of ELV policy, and proximity to high-density vehicle population. Other metros have similar conditions but lower coverage.',
  },
  {
    id: 4,
    suggestion: 'National ELV collection gap represents a Rs. 12,400 Cr recoverable material opportunity annually. Align RVSF expansion with EPR credit targets to create private operator financial incentives.',
    impact: 'medium',
    category: 'Economic Opportunity',
    source: 'Material Value Analysis + EPR Framework',
    reasoning: '94.2% of ELV-age vehicles are unaccounted. Each scrapped vehicle yields ~Rs. 45,000 in steel/aluminium/component value. Closing 50% of the gap equals Rs. 12,400 Cr in annual recoverable value.',
  },
  {
    id: 5,
    suggestion: 'Steel recovery from ELVs is priced at ₹28/kg scrap vs ₹62/kg virgin equivalent — a 55% discount that erodes RVSF margins. Negotiate OEM buy-back agreements or index scrap prices to LME HMS benchmarks to stabilise revenue.',
    impact: 'high',
    category: 'Material Pricing',
    source: 'Steel Scrap Market Data (MSTC) + LME HMS Index',
    reasoning: 'ELV-grade steel (HMS 1&2 mix) trades at steep discount to primary steel. OEM buy-back contracts eliminate spot-price volatility and guarantee volume, improving RVSF unit economics by an estimated 18-22%.',
  },
  {
    id: 6,
    suggestion: 'Aluminium recovery per scrapped car averages 48 kg at ₹95/kg — highest per-kg margin material in the ELV stream. Upgrade dismantling lines in top-5 RVSFs to improve Al separation yield from current ~62% to 85%+.',
    impact: 'high',
    category: 'Material Recovery',
    source: 'RVSF Dismantling Yield Data + Aluminium Association of India',
    reasoning: 'Every 1% improvement in Al recovery yield adds ₹456/vehicle margin. At 50,000 vehicles/year throughput, 23pp yield improvement = ₹5.2 Cr additional annual revenue per RVSF without volume growth.',
  },
  {
    id: 7,
    suggestion: 'Lithium-ion battery ELV volumes will surge from 2026 as EV fleet ages. Establish Li-ion pre-processing partnerships with battery recyclers now — RVSF licences currently do not cover battery shredding under BMSW rules.',
    impact: 'high',
    category: 'Emerging Waste Stream',
    source: 'SMEV EV Sales Data + CPCB BMSW Rules 2022',
    reasoning: 'India sold 1.5M EVs in FY 2021-22; 3-5 year battery replacement cycle means ~500K packs enter waste stream FY 2024-27. Each Li-ion pack has ₹8,000-18,000 recoverable value but requires separate CPCB authorisation.',
  },
  {
    id: 8,
    suggestion: 'UP and Maharashtra account for 38% of national ELV stock but only 22% of registered RVSFs. Targeting 8 new RVSF approvals in Lucknow, Agra, Pune, and Nashik corridors would reduce average vehicle-to-RVSF distance by 40 km.',
    impact: 'medium',
    category: 'Geographic Concentration',
    source: 'Vahan Registration Data + RVSF Geospatial Analysis',
    reasoning: 'High vehicle-to-RVSF distance (>80 km) is the #1 stated reason owners avoid formal scrapping — transport cost eats into the Deposit of Recycling Fee benefit. Closer facilities increase formal capture rate by est. 15-28%.',
  },
  {
    id: 9,
    suggestion: 'Plastic recovery from ELVs (avg. 35 kg/vehicle, ₹42/kg) is largely bypassed due to mixed polymer content. Invest in NIR-based sorting at 3-4 high-volume RVSFs to separate PP/ABS/PVC and access recycler premium pricing (+₹18-25/kg).',
    impact: 'medium',
    category: 'Material Pricing',
    source: 'Polymer Market Index (CRISIL) + RVSF Plastic Recovery Audit',
    reasoning: 'Mixed automotive plastic fetches ₹42/kg; sorted PP commands ₹60/kg, ABS ₹67/kg. NIR sorter capex (~₹35L) payback is 14 months at 10,000+ vehicles/year throughput — viable for top-tier RVSFs.',
  },
  {
    id: 10,
    suggestion: 'Rubber (tyres + seals) constitutes ~65 kg/vehicle and is currently sold at ₹12/kg to informal pyrolysis units. Redirect to CPCB-authorised co-processing cement kilns at ₹18-22/kg — 50-83% price uplift with full regulatory compliance.',
    impact: 'medium',
    category: 'Compliance + Revenue',
    source: 'CPCB Authorised Co-processor List + Tyre Rubber Price Index',
    reasoning: 'Informal rubber pyrolysis generates uncontrolled emissions and exposes RVSFs to regulatory risk. Cement kiln co-processing is authorised under HW Rules 2016, commands a premium, and generates co-processing certificates useful for EPR reporting.',
  },
];

// Brand share multipliers for logical sample data
const brandMultipliers: Record<string, number> = {
  'Maruti Suzuki': 0.45,
  'Hyundai': 0.15,
  'Tata': 0.12,
  'Mahindra': 0.10,
  'Kia': 0.05,
  'Toyota': 0.05,
  'Honda': 0.03,
  'Others': 0.05,
};

// Helper: Convert FY string to end calendar year (e.g., '2009-10' -> 2010)
const fyToEndYear = (fy: string): number => {
  const parts = fy.split('-');
  const startYear = parseInt(parts[0]);
  return startYear + 1;
};

// Helper: Convert end calendar year to FY string (e.g., 2010 -> '2009-10')
const endYearToFY = (year: number): string => {
  return `${year - 1}-${String(year).slice(-2)}`;
};

// Get ELV lag FY: for selectedFY '2024-25' and lag 15, returns '2009-10'
export const getELVLagFY = (selectedFY: string, lagYears: number): string => {
  const endYear = fyToEndYear(selectedFY);
  return endYearToFY(endYear - lagYears);
};

// Get SIAM sales by state for a given FY
export const getELVSalesByState = (fyYear: string, brands: string[] = ['All']): Record<string, number> => {
  const result: Record<string, number> = {};
  let multiplier = 1;
  if (brands.length > 0 && !brands.includes('All')) {
    multiplier = brands.reduce((sum, brand) => sum + (brandMultipliers[brand] || 0), 0);
  }

  for (const [state, yearData] of Object.entries(siamSalesRaw)) {
    result[state] = Math.round((yearData[fyYear] || 0) * multiplier);
  }
  return result;
};

// Get state sales history (all years)
export const getStateSalesHistory = (state: string, brands: string[] = ['All']) => {
  const yearData = siamSalesRaw[state] || {};
  let multiplier = 1;
  if (brands.length > 0 && !brands.includes('All')) {
    multiplier = brands.reduce((sum, brand) => sum + (brandMultipliers[brand] || 0), 0);
  }
  return Object.entries(yearData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fy, units]) => ({ fy, units: Math.round(units * multiplier) }));
};

// Get collection by state for a given FY
export const getELVCollectionByState = (fyYear: string): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const item of elvRvsfCollectionData) {
    if (item.fyYear === fyYear) {
      result[item.state] = (result[item.state] || 0) + item.vehiclesCollected;
    }
  }
  return result;
};

// Get state collection history (all years)
export const getStateCollectionHistory = (state: string) => {
  const years = ['2021-22', '2022-23', '2023-24', '2024-25'];
  return years.map(fy => ({
    fy,
    collected: elvRvsfCollectionData
      .filter(d => d.fyYear === fy && d.state === state)
      .reduce((s, d) => s + d.vehiclesCollected, 0),
  }));
};

// Compute hotspot data for all states
export const getELVHotspotStateData = (selectedFY: string, lagYears: number, brands: string[] = ['All']): StateHotspotData[] => {
  const lagFY = getELVLagFY(selectedFY, lagYears);
  const salesLagData = getELVSalesByState(lagFY, brands);
  const salesCurrentData = getELVSalesByState(selectedFY, brands);
  const collectionData = getELVCollectionByState(selectedFY);
  const states = Object.keys(elvStateCoords);

  const rawScores: Record<string, number> = {};
  for (const state of states) {
    const sales = salesLagData[state] || 0;
    const collected = Math.max(collectionData[state] || 0, 1);
    rawScores[state] = sales / collected;
  }
  const maxScore = Math.max(...Object.values(rawScores), 1);

  return states.map(state => {
    const [lat, lng] = elvStateCoords[state];
    const salesLagYear = salesLagData[state] || 0;
    const salesCurrentYear = salesCurrentData[state] || 0;
    const vehiclesCollected = collectionData[state] || 0;
    const normalizedScore = Math.round((rawScores[state] / maxScore) * 100);
    const activeRVSFs = elvRvsfRegistry.filter(r => r.state === state && r.status === 'active');
    const rvsfCount = activeRVSFs.length;
    const totalCapacity = activeRVSFs.reduce((s, r) => s + r.capacityPerYear, 0);
    const coverageStatus: 'green' | 'amber' | 'red' =
      normalizedScore <= 33 ? 'green' : normalizedScore <= 66 ? 'amber' : 'red';

    return { state, lat, lng, salesLagYear, salesCurrentYear, rvsfCount, vehiclesCollected, hotspotScore: normalizedScore, coverageStatus, totalCapacity };
  });
};

// National KPIs
export const getELVNationalKPIs = (selectedFY: string, lagYears: number, brands: string[] = ['All']) => {
  const lagFY = getELVLagFY(selectedFY, lagYears);
  const salesSelected = Object.values(getELVSalesByState(selectedFY, brands)).reduce((a, b) => a + b, 0);
  const estimatedELV = Object.values(getELVSalesByState(lagFY, brands)).reduce((a, b) => a + b, 0);
  const totalActiveRVSFs = elvRvsfRegistry.filter(r => r.status === 'active').length;
  const totalCollected = elvRvsfCollectionData
    .filter(d => d.fyYear === selectedFY)
    .reduce((s, d) => s + d.vehiclesCollected, 0);
  const gapPercent = estimatedELV > 0 ? Math.round(((estimatedELV - totalCollected) / estimatedELV) * 100) : 0;
  const hotspotData = getELVHotspotStateData(selectedFY, lagYears, brands);
  const topHotspots = [...hotspotData].sort((a, b) => b.hotspotScore - a.hotspotScore).slice(0, 3).map(d => d.state);

  return { salesSelected, estimatedELV, totalActiveRVSFs, totalCollected, gapPercent, topHotspots, lagFY };
};

// Sales vs Collection trend
export const getELVTrendData = (lagYears: number, brands: string[] = ['All']) => {
  const years = ['2021-22', '2022-23', '2023-24', '2024-25'];
  return years.map(fy => {
    const lagFY = getELVLagFY(fy, lagYears);
    const estimatedELV = Object.values(getELVSalesByState(lagFY, brands)).reduce((a, b) => a + b, 0);
    const collected = elvRvsfCollectionData.filter(d => d.fyYear === fy).reduce((s, d) => s + d.vehiclesCollected, 0);
    const sales = Object.values(getELVSalesByState(fy, brands)).reduce((a, b) => a + b, 0);
    return { fy, sales, estimatedELV, collected, gap: estimatedELV - collected };
  });
};

// State rankings for sortable table
export const getELVStateRankings = (selectedFY: string, lagYears: number, brands: string[] = ['All']) => {
  return getELVHotspotStateData(selectedFY, lagYears, brands)
    .map(d => ({
      ...d,
      collectionGap: d.salesLagYear - d.vehiclesCollected,
      gapPercent: d.salesLagYear > 0
        ? Math.round(((d.salesLagYear - d.vehiclesCollected) / d.salesLagYear) * 100)
        : 0,
    }))
    .sort((a, b) => b.hotspotScore - a.hotspotScore);
};

// ELV age profile - which make-year vehicles are being scrapped
export const getELVAgeProfile = (fyYear: string) => {
  const data = elvOriginData.filter(d => d.fyYearScrapped === fyYear);
  const byMakeYear: Record<number, number> = {};
  for (const d of data) {
    byMakeYear[d.makeYear] = (byMakeYear[d.makeYear] || 0) + d.vehicleCount;
  }
  return Object.entries(byMakeYear)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([year, count]) => ({ makeYear: String(year), vehicleCount: count }));
};

// Available FY options for ELV tab
export const elvFYOptions = [
  '2024-25', '2023-24', '2022-23', '2021-22',
];

export const elvBrandOptions = [
  'All', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'Others',
];
