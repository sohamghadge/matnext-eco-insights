import { useState, useEffect } from 'react';

// Types for Regulatory Data

export interface EPRComplianceItem {
    id: string;
    category: 'Steel' | 'Batteries' | 'Plastics' | 'Tyres';
    regulation: string;
    metric: string;
    target: number;
    achieved: number;
    unit: string;
    link?: string;
    subCategories?: { name: string; value: string }[];
    action?: boolean;
}

export interface CBAMItem {
    hsCode: string;
    description: string;
    exportQuantity: number; // Tonnes
    embeddedEmissions: number; // tCO2e / tonne
    carbonPricePaid: number; // EUR/tonne (hypothetical or local credit equivalent)
    freeAllowance: number; // Tonnes (hypothetical)
}

export interface CBAMExportData {
    totalExportUnits: number;
    cbamCompliantUnits: number;
    compliantPercentage: number;
    nonCompliantReasons: string[];
    complianceActions: string[];
}

export interface PartComplianceData {
    id: string;
    partId: string; // NEW
    name: string;
    material: 'Steel' | 'Aluminum' | 'Cast Iron' | 'Plastic';
    grade: string;
    hsCode: string;
    modelIds: string[]; // Associated car models
    exportQty: number; // Scheduled for EU export
    emissions: number; // tCO2e/tonne (Embedded)
    benchmark: number; // EU CBAM Benchmark for 100% free allowance
    status: 'Compliant' | 'Non-Compliant' | 'Warning';
    supplier: string;
    action: string;
    // CBAM Specifics
    cbamReadiness: number; // %
    cbamCalculation: string; // e.g., "Direct + Indirect"
    cbamAmount: number; // EUR
    reductionDataMgmt: number; // EUR
    reductionSustainable: number; // EUR
}

export interface ModelComplianceData {
    id: string;
    name: string;
    image: string;
    complianceScore: number; // 0-100
    type: 'EV' | 'ICE' | 'Hybrid';
    generation: 'New' | 'Legacy'; // To distinguish between Recovery (Old) and Recycling (New) targets
    // New Fields for Breakdown
    partCountTotal: number;
    partCountSteel: number;
    partCountAl: number;
    compliantPartCountSteel: number;
    compliantPartCountAl: number;
    exportVehicleCount: number;
    volumePartCountSteel: number;
    volumePartCompliantSteel: number; // For ratio 1,20,000 / 1,55,000
    volumePartCountAl: number;
    volumePartCompliantAl: number;

    cbamReadiness: number; // %
    cbamCalculation: string; // "Std Method"
    cbamAmount: number; // EUR
    reductionDataMgmt: number; // EUR
    reductionSustainable: number; // EUR

    metrics: {
        recyclability: number; // %
        elvCompliance: boolean;
        hazardousSubstances: 'Compliant' | 'Non-Compliant';
        recycledMaterials: number; // Kg
    };
    targetMarket: 'Domestic' | 'Export'; // New field for Active Models split
    // EPR Stats
    eprRecovery: {
        target: number; // %
        actual: number; // %
        status: 'Compliant' | 'Non-Compliant' | 'Warning';
    };
    eprRecycling: {
        target: number; // %
        actual: number; // %
        status: 'Compliant' | 'Non-Compliant' | 'Warning';
    };
    exportData?: CBAMExportData;
}

export interface ComplianceStat {
    label: string;
    value: number | string;
    subValue?: string;
    status: 'success' | 'warning' | 'error' | 'neutral';
    icon: 'car' | 'check' | 'alert' | 'calendar';
}

export interface Regulation {
    id: string;
    name: string;
    description: string;
    status: 'Compliant' | 'In Progress' | 'Non-Compliant';
    deadline: string;
    impact: 'High' | 'Medium' | 'Low';
    // New Fields
    formalName: string;
    country: string;
    quantitativeTarget: string;
    quantitativeAchieved: string;
}

export interface RegulatoryData {
    stats: ComplianceStat[];
    regulations: Regulation[];
    epr: EPRComplianceItem[];
    cbam: {
        status: 'Transitional' | 'Definitive';
        nextPhaseDate: Date;
        items: CBAMItem[];
    };
    parts: PartComplianceData[];
    eprRecoveryParts: EPRPartData[];
    eprRecyclingParts: EPRPartData[];
    models: ModelComplianceData[];
}

export interface EPRPartData {
    id: string;
    name: string;
    partId: string; // NEW
    material: 'Steel' | 'Aluminum' | 'Cast Iron' | 'Plastic';
    grade: string;
    modelIds: string[];
    rate: number; // Recyclability or Recoverability %
    benchmark: number; // Target %
    status: 'Compliant' | 'Non-Compliant' | 'Warning';
    action: string;
    // Financials/Readiness for consistecy if needed (optional for EPR but requested "same format")
    exportQty?: number;
    cbamReadiness?: number;
    cbamCalculation?: string;
    cbamAmount?: number;
    reductionDataMgmt?: number;
    reductionSustainable?: number;
}

// Mock Data
const mockRegulatoryData: RegulatoryData = {
    stats: [
        {
            label: 'Total Active Models',
            value: 12,
            subValue: 'Across all segments',
            status: 'neutral',
            icon: 'car',
        },
        {
            label: 'Fully Compliant',
            value: '85%',
            subValue: '10 Models',
            status: 'success',
            icon: 'check',
        },
        {
            label: 'At Risk / Non-Compliant',
            value: 2,
            subValue: 'Requires Attention',
            status: 'warning',
            icon: 'alert',
        },
        {
            label: 'Upcoming Deadline',
            value: '15 Days',
            subValue: 'RVSF Audit Due',
            status: 'neutral',
            icon: 'calendar',
        },
    ],
    regulations: [
        {
            id: 'reg-1',
            name: 'ELV Directive 2000/53/EC',
            formalName: 'Directive 2000/53/EC on End-of-Life Vehicles',
            country: 'EU',
            description: 'Mandates 95% recoverability and 85% recyclability for all vehicles.',
            status: 'Compliant',
            deadline: 'Ongoing',
            impact: 'High',
            quantitativeTarget: '95% Recovery',
            quantitativeAchieved: '96.2%',
        },
        {
            id: 'reg-2',
            name: 'AIS-129 (End-of-Life Vehicles)',
            formalName: 'AIS-129: Automotive Vehicles - End of Life Vehicles',
            country: 'India',
            description: 'Standard for collection and dismantling of ELVs in India.',
            status: 'Compliant',
            deadline: 'Ongoing',
            impact: 'High',
            quantitativeTarget: '95% Recovery',
            quantitativeAchieved: '95.5%',
        },
        {
            id: 'reg-3',
            name: 'Battery Waste Management Rules, 2022',
            formalName: 'Battery Waste Management Rules, 2022',
            country: 'India',
            description: 'EPR for battery producers, ensuring collection and recycling.',
            status: 'In Progress',
            deadline: '31 Mar 2026',
            impact: 'High',
            quantitativeTarget: '90% Collection',
            quantitativeAchieved: '78%',
        },
        {
            id: 'reg-4',
            name: 'Plastic Waste Management Rules',
            formalName: 'Plastic Waste Management (Amendment) Rules, 2024',
            country: 'India',
            description: 'Guidelines for recycled content in plastic packaging.',
            status: 'Non-Compliant',
            deadline: '30 Jun 2026',
            impact: 'Medium',
            quantitativeTarget: '30% Recycled Content',
            quantitativeAchieved: '22%',
        },
    ],
    models: [
        // --- New Models (Recycling Focus) ---
        {
            id: 'evitara',
            name: 'Maruti Suzuki eVitara',
            image: '/evitara.png',
            complianceScore: 92,
            type: 'EV',
            generation: 'New',
            targetMarket: 'Export',
            metrics: { recyclability: 95, elvCompliance: true, hazardousSubstances: 'Compliant', recycledMaterials: 450 },
            eprRecovery: { target: 95, actual: 96.5, status: 'Compliant' },
            eprRecycling: { target: 85, actual: 87.2, status: 'Compliant' },
            // New Fields
            partCountTotal: 3200,
            partCountSteel: 1200,
            partCountAl: 800,
            compliantPartCountSteel: 1150,
            compliantPartCountAl: 780,
            exportVehicleCount: 15000,
            volumePartCountSteel: 18000000, // 1200 * 15000
            volumePartCompliantSteel: 17250000,
            volumePartCountAl: 12000000,
            volumePartCompliantAl: 11700000,
            cbamReadiness: 95,
            cbamCalculation: 'Actual Data (Method A)',
            cbamAmount: 450000, // EUR
            reductionDataMgmt: 12000,
            reductionSustainable: 25000,
            exportData: {
                totalExportUnits: 15000,
                cbamCompliantUnits: 14250,
                compliantPercentage: 95,
                nonCompliantReasons: ["Batch #402: Aluminum alloy rims missing data."],
                complianceActions: ["Request Form C from Supplier X."]
            }
        },
        {
            id: 'fronx',
            name: 'Maruti Suzuki Fronx',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80',
            complianceScore: 88,
            type: 'ICE',
            generation: 'New',
            targetMarket: 'Export',
            metrics: { recyclability: 89, elvCompliance: true, hazardousSubstances: 'Compliant', recycledMaterials: 120 },
            eprRecovery: { target: 95, actual: 94.8, status: 'Warning' },
            eprRecycling: { target: 85, actual: 82.5, status: 'Non-Compliant' },
            partCountTotal: 2800,
            partCountSteel: 1500,
            partCountAl: 400,
            compliantPartCountSteel: 1300,
            compliantPartCountAl: 350,
            exportVehicleCount: 8500,
            volumePartCountSteel: 12750000,
            volumePartCompliantSteel: 11050000,
            volumePartCountAl: 3400000,
            volumePartCompliantAl: 2975000,
            cbamReadiness: 75,
            cbamCalculation: 'Hybrid (Default + Actual)',
            cbamAmount: 320000,
            reductionDataMgmt: 5000,
            reductionSustainable: 12000,
            exportData: {
                totalExportUnits: 8500,
                cbamCompliantUnits: 5100,
                compliantPercentage: 60,
                nonCompliantReasons: ["High carbon intensity in body panels."],
                complianceActions: ["Secure Green Steel certificates."]
            }
        },
        {
            id: 'grandvitara',
            name: 'Maruti Suzuki Grand Vitara',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/grand-vitara-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80', // Placeholder
            complianceScore: 90,
            type: 'Hybrid',
            generation: 'New',
            targetMarket: 'Domestic',
            metrics: { recyclability: 92, elvCompliance: true, hazardousSubstances: 'Compliant', recycledMaterials: 300 },
            eprRecovery: { target: 95, actual: 96.0, status: 'Compliant' },
            eprRecycling: { target: 85, actual: 86.5, status: 'Compliant' },
            partCountTotal: 3000,
            partCountSteel: 1300,
            partCountAl: 600,
            compliantPartCountSteel: 1250,
            compliantPartCountAl: 580,
            exportVehicleCount: 10000,
            volumePartCountSteel: 13000000,
            volumePartCompliantSteel: 12500000,
            volumePartCountAl: 6000000,
            volumePartCompliantAl: 5800000,
            cbamReadiness: 90,
            cbamCalculation: 'Actual Data',
            cbamAmount: 380000,
            reductionDataMgmt: 9000,
            reductionSustainable: 18000,
        },
        // --- Legacy Models (Recovery Focus) ---
        {
            id: 'alto',
            name: 'Maruti Suzuki Alto K10',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39013/alto-k10-exterior-right-front-three-quarter-60.jpeg?isig=0&q=80',
            complianceScore: 82,
            type: 'ICE',
            generation: 'Legacy',
            targetMarket: 'Domestic',
            metrics: { recyclability: 85, elvCompliance: true, hazardousSubstances: 'Compliant', recycledMaterials: 50 },
            eprRecovery: { target: 95, actual: 90.5, status: 'Non-Compliant' }, // Low recovery
            eprRecycling: { target: 85, actual: 80.0, status: 'Non-Compliant' },
            partCountTotal: 2000,
            partCountSteel: 1400,
            partCountAl: 100,
            compliantPartCountSteel: 1200,
            compliantPartCountAl: 80,
            exportVehicleCount: 5000,
            volumePartCountSteel: 7000000,
            volumePartCompliantSteel: 6000000,
            volumePartCountAl: 500000,
            volumePartCompliantAl: 400000,
            cbamReadiness: 60,
            cbamCalculation: 'Default Values',
            cbamAmount: 150000,
            reductionDataMgmt: 1000,
            reductionSustainable: 5000,
        },
        {
            id: 'wagonr',
            name: 'Maruti Suzuki Wagon R',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112947/wagon-r-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
            complianceScore: 84,
            type: 'ICE',
            generation: 'Legacy',
            targetMarket: 'Domestic',
            metrics: { recyclability: 86, elvCompliance: true, hazardousSubstances: 'Compliant', recycledMaterials: 60 },
            eprRecovery: { target: 95, actual: 93.0, status: 'Warning' },
            eprRecycling: { target: 85, actual: 81.5, status: 'Non-Compliant' },
            partCountTotal: 2200,
            partCountSteel: 1500,
            partCountAl: 150,
            compliantPartCountSteel: 1400,
            compliantPartCountAl: 130,
            exportVehicleCount: 4000,
            volumePartCountSteel: 6000000,
            volumePartCompliantSteel: 5600000,
            volumePartCountAl: 600000,
            volumePartCompliantAl: 520000,
            cbamReadiness: 65,
            cbamCalculation: 'Default Values',
            cbamAmount: 180000,
            reductionDataMgmt: 2000,
            reductionSustainable: 6000,
        },
        {
            id: 'swift',
            name: 'Maruti Suzuki Swift',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter-63.jpeg?isig=0&q=80',
            complianceScore: 86,
            type: 'ICE',
            generation: 'Legacy',
            targetMarket: 'Export',
            metrics: { recyclability: 88, elvCompliance: true, hazardousSubstances: 'Compliant', recycledMaterials: 80 },
            eprRecovery: { target: 95, actual: 95.5, status: 'Compliant' },
            eprRecycling: { target: 85, actual: 84.0, status: 'Warning' },
            partCountTotal: 2400,
            partCountSteel: 1600,
            partCountAl: 200,
            compliantPartCountSteel: 1550,
            compliantPartCountAl: 190,
            exportVehicleCount: 12000,
            volumePartCountSteel: 19200000,
            volumePartCompliantSteel: 18600000,
            volumePartCountAl: 2400000,
            volumePartCompliantAl: 2280000,
            cbamReadiness: 85,
            cbamCalculation: 'Actual Data',
            cbamAmount: 400000,
            reductionDataMgmt: 8000,
            reductionSustainable: 20000,
            exportData: {
                totalExportUnits: 12000, // Replicated from Baleno logic
                cbamCompliantUnits: 12000,
                compliantPercentage: 100,
                nonCompliantReasons: [],
                complianceActions: [],
            }
        },
    ],
    epr: [
        {
            id: 'epr-steel',
            category: 'Steel',
            regulation: 'Environment Protection (End-of-Life Vehicles) Rules, 2025',
            metric: 'Steel Recovery % from Scrapped Vehicles',
            target: 8.0,
            achieved: 6.5, // Gap analysis: 1.5% shortfall
            unit: '%',
            link: 'MoEFCC Notification S.O. 98(E)',
        },
        {
            id: 'epr-batteries',
            category: 'Batteries',
            regulation: 'Battery Waste Management Rules, 2022',
            metric: 'Recycling Efficiency',
            target: 90, // Collection Target
            achieved: 78,
            unit: '%',
            subCategories: [
                { name: 'Lead Acid Collection', value: '92%' },
                { name: 'Li-Ion Recovery', value: '45%' }, // Target is 50%
            ],
            action: true, // Buy EPR Credits
        },
        {
            id: 'epr-plastics',
            category: 'Plastics',
            regulation: 'Plastic Waste Management (Amendment) Rules, 2024',
            metric: 'Recycled Content in Packaging',
            target: 30,
            achieved: 22,
            unit: '%',
        },
        {
            id: 'epr-tyres',
            category: 'Tyres',
            regulation: 'Hazardous and Other Wastes (Amendment) Rules, 2022',
            metric: 'Retreading/Recycling Certificates',
            target: 100, // Assuming 100% compliance certificate requirement
            achieved: 100,
            unit: '% Compliance',
        },
    ],
    cbam: {
        status: 'Transitional',
        nextPhaseDate: new Date('2026-01-01'),
        items: [
            {
                hsCode: '7308',
                description: 'Structures of Steel',
                exportQuantity: 12500,
                embeddedEmissions: 1.6, // Good (< 1.8)
                carbonPricePaid: 15, // Local taxes paid
                freeAllowance: 0.8,
            },
            {
                hsCode: '7601',
                description: 'Unwrought Aluminum',
                exportQuantity: 8400,
                embeddedEmissions: 2.4, // High (> 2.2)
                carbonPricePaid: 12,
                freeAllowance: 0.5,
            },
            {
                hsCode: '7318',
                description: 'Screws, Bolts, Nuts',
                exportQuantity: 4200,
                embeddedEmissions: 1.9, // Moderate
                carbonPricePaid: 14,
                freeAllowance: 0.2,
            },
        ],
    },
    parts: [
        // --- Steel Parts (10) - Benchmark ~ 1.8 - 2.0 ---
        { id: 'st-1', partId: 'P-ST-001', name: 'Body Side Outer (LH)', material: 'Steel', grade: 'AHSS / DP600', hsCode: '8708.29', modelIds: ['evitara', 'fronx'], exportQty: 2500, emissions: 1.7, benchmark: 1.9, status: 'Compliant', supplier: 'Posco India', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 4500, reductionDataMgmt: 500, reductionSustainable: 1500 },
        { id: 'st-2', partId: 'P-ST-002', name: 'Chassis Main Rail', material: 'Steel', grade: 'HSLA 340', hsCode: '8708.99', modelIds: ['evitara'], exportQty: 1200, emissions: 2.1, benchmark: 1.9, status: 'Non-Compliant', supplier: 'Tata Steel', action: 'Switch to EAF Steel', cbamReadiness: 80, cbamCalculation: 'Hybrid', cbamAmount: 3200, reductionDataMgmt: 0, reductionSustainable: 0 },
        { id: 'st-3', partId: 'P-ST-003', name: 'Door Impact Beam', material: 'Steel', grade: 'Ultra High Strength (Boron)', hsCode: '8708.29', modelIds: ['baleno', 'fronx'], exportQty: 4000, emissions: 1.8, benchmark: 2.0, status: 'Compliant', supplier: 'JSW Steel', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 6000, reductionDataMgmt: 800, reductionSustainable: 2000 },
        { id: 'st-4', partId: 'P-ST-004', name: 'Suspension Control Arm', material: 'Steel', grade: 'Forged Steel', hsCode: '8708.80', modelIds: ['evitara', 'baleno'], exportQty: 2200, emissions: 2.3, benchmark: 2.0, status: 'Non-Compliant', supplier: 'Bharat Forge', action: 'Audit Process Energy', cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 4800, reductionDataMgmt: 100, reductionSustainable: 0 },
        { id: 'st-5', partId: 'P-ST-005', name: 'Fuel Tank Shell', material: 'Steel', grade: 'Galvannealed Sheet', hsCode: '8708.99', modelIds: ['fronx'], exportQty: 900, emissions: 1.9, benchmark: 1.9, status: 'Warning', supplier: 'Essar Steel', action: 'Monitor Emissions', cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 1200, reductionDataMgmt: 150, reductionSustainable: 300 },
        { id: 'st-6', partId: 'P-ST-006', name: 'Roof Panel', material: 'Steel', grade: 'Mild Steel (CRCA)', hsCode: '8708.29', modelIds: ['baleno'], exportQty: 1500, emissions: 1.6, benchmark: 1.9, status: 'Compliant', supplier: 'Posco India', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 2000, reductionDataMgmt: 300, reductionSustainable: 800 },
        { id: 'st-7', partId: 'P-ST-007', name: 'Bumpled Reinforcement', material: 'Steel', grade: 'HSLA 420', hsCode: '8708.10', modelIds: ['evitara'], exportQty: 1100, emissions: 1.75, benchmark: 1.9, status: 'Compliant', supplier: 'Tata Steel', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1800, reductionDataMgmt: 250, reductionSustainable: 600 },
        { id: 'st-8', partId: 'P-ST-008', name: 'Seat Frame Structure', material: 'Steel', grade: 'Tubular Steel', hsCode: '9401.90', modelIds: ['evitara', 'fronx', 'baleno'], exportQty: 5000, emissions: 2.0, benchmark: 1.9, status: 'Non-Compliant', supplier: 'Lear Corp', action: 'Request Data', cbamReadiness: 40, cbamCalculation: 'Default', cbamAmount: 9000, reductionDataMgmt: 0, reductionSustainable: 0 },
        { id: 'st-9', partId: 'P-ST-009', name: 'Exhaust Manifold', material: 'Steel', grade: 'Stainless Steel 409', hsCode: '8708.92', modelIds: ['fronx', 'baleno'], exportQty: 2000, emissions: 2.8, benchmark: 2.5, status: 'Non-Compliant', supplier: 'Viraj Profiles', action: 'Evaluate Scrap Usage', cbamReadiness: 70, cbamCalculation: 'Hybrid', cbamAmount: 5500, reductionDataMgmt: 200, reductionSustainable: 0 },
        { id: 'st-10', partId: 'P-ST-010', name: 'Wheel Rim (Steel)', material: 'Steel', grade: 'Dual Phase 590', hsCode: '8708.70', modelIds: ['baleno'], exportQty: 800, emissions: 1.85, benchmark: 1.8, status: 'Warning', supplier: 'Wheels India', action: 'Optimize Logistics', cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 1400, reductionDataMgmt: 100, reductionSustainable: 200 },

        // --- Aluminum Parts (10) - Benchmark ~ 4.0 - 4.5 ---
        { id: 'al-1', partId: 'P-AL-001', name: 'Engine Block', material: 'Aluminum', grade: 'ADC12 (Die Cast)', hsCode: '8409.91', modelIds: ['fronx', 'baleno'], exportQty: 4500, emissions: 4.8, benchmark: 4.2, status: 'Non-Compliant', supplier: 'Sunbeam Auto', action: 'Increase Recycled %', cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 12000, reductionDataMgmt: 0, reductionSustainable: 0 },
        { id: 'al-2', partId: 'P-AL-002', name: 'Alloy Wheel (17")', material: 'Aluminum', grade: 'Al-Si-Mg Alloy (A356)', hsCode: '8708.70', modelIds: ['evitara', 'fronx'], exportQty: 3200, emissions: 5.2, benchmark: 4.5, status: 'Non-Compliant', supplier: 'Minda Industries', action: 'Switch to Green Al', cbamReadiness: 55, cbamCalculation: 'Default', cbamAmount: 9500, reductionDataMgmt: 0, reductionSustainable: 0 },
        { id: 'al-3', partId: 'P-AL-003', name: 'Heat Exchanger / Radiator', material: 'Aluminum', grade: '3003 Alloy Clad', hsCode: '8708.91', modelIds: ['evitara'], exportQty: 1500, emissions: 3.5, benchmark: 4.0, status: 'Warning', supplier: 'Denso India', action: 'Verify Electricity Source', cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 3000, reductionDataMgmt: 400, reductionSustainable: 800 },
        { id: 'al-4', partId: 'P-AL-004', name: 'Transmission Case', material: 'Aluminum', grade: 'ADC10', hsCode: '8708.40', modelIds: ['fronx'], exportQty: 2100, emissions: 4.5, benchmark: 4.2, status: 'Non-Compliant', supplier: 'Endurance Tech', action: 'Investigate Smelter Data', cbamReadiness: 65, cbamCalculation: 'Default', cbamAmount: 5800, reductionDataMgmt: 100, reductionSustainable: 0 },
        { id: 'al-5', partId: 'P-AL-005', name: 'Hood Panel (Bonnet)', material: 'Aluminum', grade: '6000 Series (6016)', hsCode: '8708.29', modelIds: ['evitara'], exportQty: 850, emissions: 2.9, benchmark: 4.0, status: 'Compliant', supplier: 'Hindalco', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1200, reductionDataMgmt: 200, reductionSustainable: 600 },
        { id: 'al-6', partId: 'P-AL-006', name: 'Control Arm (Lower)', material: 'Aluminum', grade: 'Forged 6082', hsCode: '8708.80', modelIds: ['evitara'], exportQty: 900, emissions: 3.1, benchmark: 4.0, status: 'Warning', supplier: 'Bharat Forge', action: 'Track Ingot Source', cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 1800, reductionDataMgmt: 150, reductionSustainable: 300 },
        { id: 'al-7', partId: 'P-AL-007', name: 'AC Compressor Housing', material: 'Aluminum', grade: 'Die Cast Al', hsCode: '8414.90', modelIds: ['baleno', 'fronx', 'evitara'], exportQty: 5500, emissions: 4.2, benchmark: 4.0, status: 'Non-Compliant', supplier: 'Subros', action: 'Review Supply Chain', cbamReadiness: 70, cbamCalculation: 'Hybrid', cbamAmount: 7500, reductionDataMgmt: 300, reductionSustainable: 0 },
        { id: 'al-8', partId: 'P-AL-008', name: 'Battery Tray / Pack Housing', material: 'Aluminum', grade: 'Extruded 6063', hsCode: '8708.99', modelIds: ['evitara'], exportQty: 1200, emissions: 2.5, benchmark: 4.0, status: 'Compliant', supplier: 'Norsk Hydro', action: 'None (Green Al Used)', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1500, reductionDataMgmt: 250, reductionSustainable: 900 },
        { id: 'al-9', partId: 'P-AL-009', name: 'Steering Knuckle', material: 'Aluminum', grade: 'Cast A356-T6', hsCode: '8708.94', modelIds: ['evitara'], exportQty: 1100, emissions: 4.1, benchmark: 4.0, status: 'Non-Compliant', supplier: 'Rico Auto', action: 'Shift to Low-Carbon Al', cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 2800, reductionDataMgmt: 0, reductionSustainable: 0 },
        { id: 'al-10', partId: 'P-AL-010', name: 'Alternator Housing', material: 'Aluminum', grade: 'Die Cast', hsCode: '8511.90', modelIds: ['baleno'], exportQty: 3000, emissions: 4.6, benchmark: 4.2, status: 'Non-Compliant', supplier: 'Lucas TVS', action: 'Audit Foundry', cbamReadiness: 50, cbamCalculation: 'Default', cbamAmount: 6200, reductionDataMgmt: 0, reductionSustainable: 0 },

        // --- Cast Iron Parts (10) - Benchmark ~ 1.5 ---
        { id: 'ci-1', partId: 'P-CI-001', name: 'Brake Disc / Rotor', material: 'Cast Iron', grade: 'Grey Cast Iron (G3000)', hsCode: '8708.30', modelIds: ['evitara', 'fronx', 'baleno'], exportQty: 12000, emissions: 1.2, benchmark: 1.5, status: 'Compliant', supplier: 'Brakes India', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 8500, reductionDataMgmt: 1000, reductionSustainable: 3000 },
        { id: 'ci-2', partId: 'P-CI-002', name: 'Engine Block Lining', material: 'Cast Iron', grade: 'Grey Iron', hsCode: '8409.91', modelIds: ['fronx', 'baleno'], exportQty: 8000, emissions: 1.4, benchmark: 1.5, status: 'Warning', supplier: 'Kirloskar Ferrous', action: 'Check Coke Usage', cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 6000, reductionDataMgmt: 500, reductionSustainable: 1200 },
        { id: 'ci-3', partId: 'P-CI-003', name: 'Exhaust Manifold (Turbo)', material: 'Cast Iron', grade: 'Hi-Si Moly Iron', hsCode: '8708.92', modelIds: ['fronx'], exportQty: 1500, emissions: 1.6, benchmark: 1.5, status: 'Non-Compliant', supplier: 'HinduJa Foundries', action: 'Implement Heat Recovery', cbamReadiness: 70, cbamCalculation: 'Hybrid', cbamAmount: 2200, reductionDataMgmt: 100, reductionSustainable: 0 },
        { id: 'ci-4', partId: 'P-CI-004', name: 'Camshaft', material: 'Cast Iron', grade: 'Chilled Cast Iron', hsCode: '8483.10', modelIds: ['baleno'], exportQty: 4000, emissions: 1.3, benchmark: 1.5, status: 'Compliant', supplier: 'Bharat Forge', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 3500, reductionDataMgmt: 400, reductionSustainable: 1500 },
        { id: 'ci-5', partId: 'P-CI-005', name: 'Crankshaft', material: 'Cast Iron', grade: 'Ductile Iron (SG Iron)', hsCode: '8483.10', modelIds: ['fronx'], exportQty: 3500, emissions: 1.1, benchmark: 1.5, status: 'Compliant', supplier: 'Amtek Auto', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 2800, reductionDataMgmt: 350, reductionSustainable: 1200 },
        { id: 'ci-6', partId: 'P-CI-006', name: 'Differential Case', material: 'Cast Iron', grade: 'Nodular Iron', hsCode: '8708.50', modelIds: ['evitara'], exportQty: 1200, emissions: 1.5, benchmark: 1.5, status: 'Warning', supplier: 'Sona Comstar', action: 'Monitor Scrap Input', cbamReadiness: 80, cbamCalculation: 'Actual', cbamAmount: 1100, reductionDataMgmt: 100, reductionSustainable: 300 },
        { id: 'ci-7', partId: 'P-CI-007', name: 'Water Pump Impeller', material: 'Cast Iron', grade: 'Cast Iron', hsCode: '8413.91', modelIds: ['baleno'], exportQty: 5000, emissions: 1.4, benchmark: 1.5, status: 'Warning', supplier: 'GMB India', action: 'Audit Energy Mix', cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 3800, reductionDataMgmt: 300, reductionSustainable: 800 },
        { id: 'ci-8', partId: 'P-CI-008', name: 'Flywheel', material: 'Cast Iron', grade: 'Grey Iron', hsCode: '8483.90', modelIds: ['fronx', 'baleno'], exportQty: 4200, emissions: 1.25, benchmark: 1.5, status: 'Compliant', supplier: 'Amtek', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 3100, reductionDataMgmt: 300, reductionSustainable: 1100 },
        { id: 'ci-9', partId: 'P-CI-009', name: 'Steering Box Housing', material: 'Cast Iron', grade: 'SG Iron', hsCode: '8708.94', modelIds: ['fronx'], exportQty: 2000, emissions: 1.35, benchmark: 1.5, status: 'Compliant', supplier: 'Rane TRW', action: 'None', cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 1900, reductionDataMgmt: 200, reductionSustainable: 700 },
        { id: 'ci-10', partId: 'P-CI-010', name: 'Clutch Pressure Plate', material: 'Cast Iron', grade: 'Grey Iron', hsCode: '8708.93', modelIds: ['baleno'], exportQty: 3800, emissions: 1.3, benchmark: 1.5, status: 'Compliant', supplier: 'Valeo India', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 2900, reductionDataMgmt: 300, reductionSustainable: 1000 },

        // --- Plastic Parts (10) - Benchmark ~ 3.0 ---
        { id: 'pl-1', partId: 'P-PL-001', name: 'Front Bumper Fascia', material: 'Plastic', grade: 'PP + EPDM (TPO)', hsCode: '8708.10', modelIds: ['evitara', 'fronx', 'baleno'], exportQty: 6000, emissions: 2.8, benchmark: 3.0, status: 'Compliant', supplier: 'Motherson Sumi', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 8000, reductionDataMgmt: 800, reductionSustainable: 3500 },
        { id: 'pl-2', partId: 'P-PL-002', name: 'Instrument Panel / Dash', material: 'Plastic', grade: 'PP-LGF / PC-ABS', hsCode: '8708.29', modelIds: ['evitara'], exportQty: 1500, emissions: 3.2, benchmark: 3.0, status: 'Warning', supplier: 'Tata AutoComp', action: 'Increase Recycled Content', cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 2500, reductionDataMgmt: 200, reductionSustainable: 600 },
        { id: 'pl-3', partId: 'P-PL-003', name: 'Fuel Tank', material: 'Plastic', grade: 'HDPE (Multi-layer)', hsCode: '8708.99', modelIds: ['fronx', 'baleno'], exportQty: 7000, emissions: 2.5, benchmark: 3.0, status: 'Compliant', supplier: 'Plastic Omnium', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 9000, reductionDataMgmt: 1000, reductionSustainable: 4000 },
        { id: 'pl-4', partId: 'P-PL-004', name: 'Door Trim Panel', material: 'Plastic', grade: 'PP (Inj Molded)', hsCode: '8708.29', modelIds: ['baleno', 'fronx'], exportQty: 8000, emissions: 2.1, benchmark: 3.0, status: 'Compliant', supplier: 'Krishna Maruti', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 6500, reductionDataMgmt: 700, reductionSustainable: 2500 },
        { id: 'pl-5', partId: 'P-PL-005', name: 'Headlamp Housing', material: 'Plastic', grade: 'Polycarbonate (PC)', hsCode: '8512.20', modelIds: ['evitara'], exportQty: 2000, emissions: 4.5, benchmark: 3.5, status: 'Non-Compliant', supplier: 'Lumax', action: 'Switch to Bio-PC', cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 4200, reductionDataMgmt: 100, reductionSustainable: 0 },
        { id: 'pl-6', partId: 'P-PL-006', name: 'Air Intake Manifold', material: 'Plastic', grade: 'Nylon 6 (PA6-GF30)', hsCode: '8409.91', modelIds: ['fronx'], exportQty: 3000, emissions: 5.1, benchmark: 4.0, status: 'Non-Compliant', supplier: 'Mann+Hummel', action: 'Source Recycled PA6', cbamReadiness: 55, cbamCalculation: 'Default', cbamAmount: 5800, reductionDataMgmt: 0, reductionSustainable: 0 },
        { id: 'pl-7', partId: 'P-PL-007', name: 'Wheel Arch Liner', material: 'Plastic', grade: 'Recycled PP', hsCode: '8708.29', modelIds: ['evitara', 'fronx'], exportQty: 4500, emissions: 1.2, benchmark: 3.0, status: 'Compliant', supplier: 'Supreme Treon', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 3200, reductionDataMgmt: 400, reductionSustainable: 1500 },
        { id: 'pl-8', partId: 'P-PL-008', name: 'Battery Case (12V)', material: 'Plastic', grade: 'Polypropylene Copolymer', hsCode: '8507.90', modelIds: ['baleno'], exportQty: 5000, emissions: 2.2, benchmark: 3.0, status: 'Compliant', supplier: 'Exide', action: 'None', cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 4000, reductionDataMgmt: 500, reductionSustainable: 1800 },
        { id: 'pl-9', partId: 'P-PL-009', name: 'Seat Foam / Cushion', material: 'Plastic', grade: 'Polyurethane (PU)', hsCode: '9401.90', modelIds: ['evitara'], exportQty: 1500, emissions: 3.8, benchmark: 3.5, status: 'Warning', supplier: 'Bharat Seats', action: 'Explore Bio-PU', cbamReadiness: 80, cbamCalculation: 'Hybrid', cbamAmount: 2800, reductionDataMgmt: 200, reductionSustainable: 500 },
        { id: 'pl-10', partId: 'P-PL-010', name: 'Radiator Grille', material: 'Plastic', grade: 'ABS (Chrome Plated)', hsCode: '8708.29', modelIds: ['fronx'], exportQty: 1800, emissions: 4.0, benchmark: 3.5, status: 'Non-Compliant', supplier: 'Motherson', action: 'Reduce Chrome / Change Paint', cbamReadiness: 65, cbamCalculation: 'Default', cbamAmount: 3500, reductionDataMgmt: 100, reductionSustainable: 0 },
    ],
    eprRecoveryParts: [
        // Steel (High Recovery) - Legacy Models (Alto, WagonR, Swift)
        { id: 'r-st-1', partId: 'P-R-ST-001', name: 'Body Side Outer', material: 'Steel', grade: 'AHSS', modelIds: ['alto'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 500, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 900, reductionDataMgmt: 100, reductionSustainable: 300 },
        { id: 'r-st-2', partId: 'P-R-ST-002', name: 'Chassis Rail', material: 'Steel', grade: 'HSLA', modelIds: ['alto', 'wagonr'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 300, cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 600, reductionDataMgmt: 50, reductionSustainable: 200 },
        { id: 'r-st-3', partId: 'P-R-ST-003', name: 'Door Beam', material: 'Steel', grade: 'Boron', modelIds: ['swift'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 800, cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1400, reductionDataMgmt: 150, reductionSustainable: 400 },
        { id: 'r-st-4', partId: 'P-R-ST-004', name: 'Control Arm', material: 'Steel', grade: 'Forged', modelIds: ['alto'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 400, cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 700, reductionDataMgmt: 80, reductionSustainable: 250 },
        { id: 'r-st-5', partId: 'P-R-ST-005', name: 'Fuel Tank Shell', material: 'Steel', grade: 'Galvannealed', modelIds: ['wagonr'], rate: 92, benchmark: 95, status: 'Warning', action: 'Improve Dismantling', exportQty: 200, cbamReadiness: 70, cbamCalculation: 'Hybrid', cbamAmount: 350, reductionDataMgmt: 40, reductionSustainable: 100 },
        { id: 'r-st-6', partId: 'P-R-ST-006', name: 'Roof Panel', material: 'Steel', grade: 'Mild', modelIds: ['swift'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 92, cbamCalculation: 'Actual', cbamAmount: 500, reductionDataMgmt: 60, reductionSustainable: 180 },
        { id: 'r-st-7', partId: 'P-R-ST-007', name: 'Reinforcement', material: 'Steel', grade: 'HSLA', modelIds: ['alto'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 350, cbamReadiness: 98, cbamCalculation: 'Actual', cbamAmount: 650, reductionDataMgmt: 70, reductionSustainable: 220 },
        { id: 'r-st-8', partId: 'P-R-ST-008', name: 'Seat Frame', material: 'Steel', grade: 'Tubular', modelIds: ['swift'], rate: 94, benchmark: 95, status: 'Warning', action: 'Material Separation', exportQty: 900, cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 1600, reductionDataMgmt: 200, reductionSustainable: 0 },
        { id: 'r-st-9', partId: 'P-R-ST-009', name: 'Exhaust', material: 'Steel', grade: 'Stainless', modelIds: ['wagonr'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 450, cbamReadiness: 55, cbamCalculation: 'Default', cbamAmount: 800, reductionDataMgmt: 100, reductionSustainable: 0 },
        { id: 'r-st-10', partId: 'P-R-ST-010', name: 'Wheel Rim', material: 'Steel', grade: 'DP', modelIds: ['swift'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 700, cbamReadiness: 88, cbamCalculation: 'Actual', cbamAmount: 1200, reductionDataMgmt: 130, reductionSustainable: 380 },
        // Aluminum
        { id: 'r-al-1', partId: 'P-R-AL-001', name: 'Engine Block', material: 'Aluminum', grade: 'ADC12', modelIds: ['wagonr'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 75, cbamCalculation: 'Hybrid', cbamAmount: 2200, reductionDataMgmt: 200, reductionSustainable: 50 },
        { id: 'r-al-2', partId: 'P-R-AL-002', name: 'Alloy Wheel', material: 'Aluminum', grade: 'A356', modelIds: ['alto'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 400, cbamReadiness: 65, cbamCalculation: 'Default', cbamAmount: 1500, reductionDataMgmt: 150, reductionSustainable: 0 },
        { id: 'r-al-3', partId: 'P-R-AL-003', name: 'Radiator', material: 'Aluminum', grade: '3003', modelIds: ['alto'], rate: 88, benchmark: 95, status: 'Non-Compliant', action: 'Impure Alloys issue', exportQty: 300, cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 850, reductionDataMgmt: 80, reductionSustainable: 250 },
        { id: 'r-al-4', partId: 'P-R-AL-004', name: 'Trans Case', material: 'Aluminum', grade: 'ADC10', modelIds: ['wagonr'], rate: 94, benchmark: 95, status: 'Warning', action: 'Better Sorting', exportQty: 500, cbamReadiness: 70, cbamCalculation: 'Hybrid', cbamAmount: 1800, reductionDataMgmt: 170, reductionSustainable: 100 },
        { id: 'r-al-5', partId: 'P-R-AL-005', name: 'Hood Panel', material: 'Aluminum', grade: '6016', modelIds: ['alto'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 250, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 900, reductionDataMgmt: 90, reductionSustainable: 300 },
        { id: 'r-al-6', partId: 'P-R-AL-006', name: 'Control Arm', material: 'Aluminum', grade: '6082', modelIds: ['alto'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 350, cbamReadiness: 80, cbamCalculation: 'Actual', cbamAmount: 1300, reductionDataMgmt: 130, reductionSustainable: 400 },
        { id: 'r-al-7', partId: 'P-R-AL-007', name: 'Compressor', material: 'Aluminum', grade: 'Die Cast', modelIds: ['swift'], rate: 85, benchmark: 95, status: 'Non-Compliant', action: 'Multi-material mix', exportQty: 800, cbamReadiness: 50, cbamCalculation: 'Default', cbamAmount: 2800, reductionDataMgmt: 200, reductionSustainable: 0 },
        { id: 'r-al-8', partId: 'P-R-AL-008', name: 'Battery Tray', material: 'Aluminum', grade: '6063', modelIds: ['alto'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 200, cbamReadiness: 98, cbamCalculation: 'Actual', cbamAmount: 700, reductionDataMgmt: 70, reductionSustainable: 200 },
        { id: 'r-al-9', partId: 'P-R-AL-009', name: 'Knuckle', material: 'Aluminum', grade: 'A356', modelIds: ['alto'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 300, cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 1100, reductionDataMgmt: 110, reductionSustainable: 350 },
        { id: 'r-al-10', partId: 'P-R-AL-010', name: 'Alternator', material: 'Aluminum', grade: 'Die Cast', modelIds: ['swift'], rate: 89, benchmark: 95, status: 'Non-Compliant', action: 'Copper contamination', exportQty: 900, cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 3100, reductionDataMgmt: 250, reductionSustainable: 0 },
        // Iron
        { id: 'r-ci-1', partId: 'P-R-CI-001', name: 'Brake Disc', material: 'Cast Iron', grade: 'G3000', modelIds: ['alto'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 1000, cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1500, reductionDataMgmt: 150, reductionSustainable: 450 },
        { id: 'r-ci-2', partId: 'P-R-CI-002', name: 'Engine Lining', material: 'Cast Iron', grade: 'Grey', modelIds: ['wagonr'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 700, cbamReadiness: 92, cbamCalculation: 'Actual', cbamAmount: 1000, reductionDataMgmt: 100, reductionSustainable: 300 },
        { id: 'r-ci-3', partId: 'P-R-CI-003', name: 'Turbo Manifold', material: 'Cast Iron', grade: 'Hi-Si', modelIds: ['wagonr'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 300, cbamReadiness: 75, cbamCalculation: 'Hybrid', cbamAmount: 500, reductionDataMgmt: 50, reductionSustainable: 100 },
        { id: 'r-ci-4', partId: 'P-R-CI-004', name: 'Camshaft', material: 'Cast Iron', grade: 'Chilled', modelIds: ['swift'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 800, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 1200, reductionDataMgmt: 120, reductionSustainable: 350 },
        { id: 'r-ci-5', partId: 'P-R-CI-005', name: 'Crankshaft', material: 'Cast Iron', grade: 'SG', modelIds: ['wagonr'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 98, cbamCalculation: 'Actual', cbamAmount: 900, reductionDataMgmt: 90, reductionSustainable: 280 },
        { id: 'r-ci-6', partId: 'P-R-CI-006', name: 'Diff Case', material: 'Cast Iron', grade: 'Nodular', modelIds: ['alto'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 400, cbamReadiness: 88, cbamCalculation: 'Actual', cbamAmount: 600, reductionDataMgmt: 60, reductionSustainable: 180 },
        { id: 'r-ci-7', partId: 'P-R-CI-007', name: 'Water Pump', material: 'Cast Iron', grade: 'Cast', modelIds: ['swift'], rate: 90, benchmark: 95, status: 'Warning', action: 'Assembly complexity', exportQty: 900, cbamReadiness: 70, cbamCalculation: 'Default', cbamAmount: 1300, reductionDataMgmt: 100, reductionSustainable: 50 },
        { id: 'r-ci-8', partId: 'P-R-CI-008', name: 'Flywheel', material: 'Cast Iron', grade: 'Grey', modelIds: ['wagonr'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 500, cbamReadiness: 92, cbamCalculation: 'Actual', cbamAmount: 750, reductionDataMgmt: 75, reductionSustainable: 220 },
        { id: 'r-ci-9', partId: 'P-R-CI-009', name: 'Steering Box', material: 'Cast Iron', grade: 'SG', modelIds: ['wagonr'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 400, cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 600, reductionDataMgmt: 60, reductionSustainable: 180 },
        { id: 'r-ci-10', partId: 'P-R-CI-010', name: 'Pressure Plate', material: 'Cast Iron', grade: 'Grey', modelIds: ['swift'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 750, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 1100, reductionDataMgmt: 110, reductionSustainable: 320 },
        // Plastic (Energy Recovery Possible)
        { id: 'r-pl-1', partId: 'P-R-PL-001', name: 'Bumper', material: 'Plastic', grade: 'TPO', modelIds: ['alto'], rate: 100, benchmark: 95, status: 'Compliant', action: 'Incineration safe', exportQty: 1200, cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1600, reductionDataMgmt: 160, reductionSustainable: 480 },
        { id: 'r-pl-2', partId: 'P-R-PL-002', name: 'Dash', material: 'Plastic', grade: 'ABS', modelIds: ['alto'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 850, reductionDataMgmt: 85, reductionSustainable: 250 },
        { id: 'r-pl-3', partId: 'P-R-PL-003', name: 'Fuel Tank', material: 'Plastic', grade: 'HDPE', modelIds: ['wagonr'], rate: 100, benchmark: 95, status: 'Compliant', action: 'High calorific val', exportQty: 800, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 1100, reductionDataMgmt: 110, reductionSustainable: 320 },
        { id: 'r-pl-4', partId: 'P-R-PL-004', name: 'Door Trim', material: 'Plastic', grade: 'PP', modelIds: ['swift'], rate: 100, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 1500, cbamReadiness: 98, cbamCalculation: 'Actual', cbamAmount: 2000, reductionDataMgmt: 200, reductionSustainable: 600 },
        { id: 'r-pl-5', partId: 'P-R-PL-005', name: 'Headlamp', material: 'Plastic', grade: 'PC', modelIds: ['alto'], rate: 90, benchmark: 95, status: 'Warning', action: 'Electronics removal', exportQty: 500, cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 700, reductionDataMgmt: 50, reductionSustainable: 0 },
        { id: 'r-pl-6', partId: 'P-R-PL-006', name: 'Intake', material: 'Plastic', grade: 'Nylon', modelIds: ['wagonr'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 88, cbamCalculation: 'Actual', cbamAmount: 800, reductionDataMgmt: 80, reductionSustainable: 240 },
        { id: 'r-pl-7', partId: 'P-R-PL-007', name: 'Liner', material: 'Plastic', grade: 'PP', modelIds: ['alto'], rate: 100, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 400, cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 550, reductionDataMgmt: 55, reductionSustainable: 160 },
        { id: 'r-pl-8', partId: 'P-R-PL-008', name: 'Battery Case', material: 'Plastic', grade: 'PP', modelIds: ['swift'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 1000, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 1400, reductionDataMgmt: 140, reductionSustainable: 420 },
        { id: 'r-pl-9', partId: 'P-R-PL-009', name: 'Seat Foam', material: 'Plastic', grade: 'PU', modelIds: ['alto'], rate: 100, benchmark: 95, status: 'Compliant', action: 'None', exportQty: 700, cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 950, reductionDataMgmt: 95, reductionSustainable: 280 },
        { id: 'r-pl-10', partId: 'P-R-PL-010', name: 'Grille', material: 'Plastic', grade: 'ABS', modelIds: ['wagonr'], rate: 92, benchmark: 95, status: 'Warning', action: 'Plating issue', exportQty: 300, cbamReadiness: 65, cbamCalculation: 'Default', cbamAmount: 450, reductionDataMgmt: 30, reductionSustainable: 0 },
    ],
    eprRecyclingParts: [
        // Steel (High Recycling) - New Models (eVitara, Fronx, Grand Vitara)
        { id: 'rc-st-1', partId: 'P-RC-ST-001', name: 'Body Side Outer', material: 'Steel', grade: 'AHSS', modelIds: ['evitara'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 1000, cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 1800, reductionDataMgmt: 200, reductionSustainable: 600 },
        { id: 'rc-st-2', partId: 'P-RC-ST-002', name: 'Chassis Rail', material: 'Steel', grade: 'HSLA', modelIds: ['evitara', 'fronx'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 1500, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 2500, reductionDataMgmt: 250, reductionSustainable: 750 },
        { id: 'rc-st-3', partId: 'P-RC-ST-003', name: 'Door Beam', material: 'Steel', grade: 'Boron', modelIds: ['grandvitara'], rate: 97, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 800, cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 1400, reductionDataMgmt: 140, reductionSustainable: 400 },
        { id: 'rc-st-4', partId: 'P-RC-ST-004', name: 'Control Arm', material: 'Steel', grade: 'Forged', modelIds: ['evitara'], rate: 96, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 1000, reductionDataMgmt: 100, reductionSustainable: 300 },
        { id: 'rc-st-5', partId: 'P-RC-ST-005', name: 'Fuel Tank Shell', material: 'Steel', grade: 'Galvannealed', modelIds: ['fronx'], rate: 90, benchmark: 85, status: 'Compliant', action: 'Coatings issue', exportQty: 400, cbamReadiness: 75, cbamCalculation: 'Hybrid', cbamAmount: 700, reductionDataMgmt: 50, reductionSustainable: 150 },
        // ... more parts as implied but truncated above, continuing with similar logic
        // Aluminum
        { id: 'rc-al-1', partId: 'P-RC-AL-001', name: 'Engine Block (Al)', material: 'Aluminum', grade: 'ADC12', modelIds: ['fronx'], rate: 92, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 800, cbamReadiness: 80, cbamCalculation: 'Hybrid', cbamAmount: 2800, reductionDataMgmt: 280, reductionSustainable: 800 },
        { id: 'rc-al-2', partId: 'P-RC-AL-002', name: 'Alloy Wheel (17")', material: 'Aluminum', grade: 'A356', modelIds: ['grandvitara'], rate: 94, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 1200, cbamReadiness: 90, cbamCalculation: 'Actual', cbamAmount: 4200, reductionDataMgmt: 400, reductionSustainable: 1200 },
        { id: 'rc-al-3', partId: 'P-RC-AL-003', name: 'EV Battery Tray', material: 'Aluminum', grade: '6063', modelIds: ['evitara'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 600, cbamReadiness: 100, cbamCalculation: 'Actual', cbamAmount: 2000, reductionDataMgmt: 200, reductionSustainable: 600 },
        // Iron
        { id: 'rc-ci-1', partId: 'P-RC-CI-001', name: 'Brake Disc', material: 'Cast Iron', grade: 'G3000', modelIds: ['evitara'], rate: 99, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 2000, cbamReadiness: 98, cbamCalculation: 'Actual', cbamAmount: 3000, reductionDataMgmt: 300, reductionSustainable: 900 },
        { id: 'rc-ci-2', partId: 'P-RC-CI-002', name: 'Crankshaft', material: 'Cast Iron', grade: 'SG', modelIds: ['fronx'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 900, cbamReadiness: 95, cbamCalculation: 'Actual', cbamAmount: 1350, reductionDataMgmt: 135, reductionSustainable: 400 },
        // Plastic
        { id: 'rc-pl-1', partId: 'P-RC-PL-001', name: 'Bumper', material: 'Plastic', grade: 'TPO', modelIds: ['evitara'], rate: 88, benchmark: 85, status: 'Compliant', action: 'None', exportQty: 1500, cbamReadiness: 85, cbamCalculation: 'Actual', cbamAmount: 2200, reductionDataMgmt: 200, reductionSustainable: 600 },
        { id: 'rc-pl-2', partId: 'P-RC-PL-002', name: 'Dashboard', material: 'Plastic', grade: 'ABS/PC', modelIds: ['grandvitara'], rate: 82, benchmark: 85, status: 'Non-Compliant', action: 'Separation tech needed', exportQty: 700, cbamReadiness: 60, cbamCalculation: 'Default', cbamAmount: 1000, reductionDataMgmt: 50, reductionSustainable: 0 },
    ],
};

export const useRegulatoryData = () => {
    const [data, setData] = useState<RegulatoryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setData(mockRegulatoryData);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return { data, isLoading };
};
