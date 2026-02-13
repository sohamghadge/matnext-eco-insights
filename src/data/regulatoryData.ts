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
}

export interface ModelComplianceData {
    id: string;
    name: string;
    image: string;
    complianceScore: number; // 0-100
    type: 'EV' | 'ICE' | 'Hybrid';
    metrics: {
        recyclability: number; // %
        elvCompliance: boolean;
        hazardousSubstances: 'Compliant' | 'Non-Compliant';
        recycledMaterials: number; // Kg
    };
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
    material: 'Steel' | 'Aluminum' | 'Cast Iron' | 'Plastic';
    grade: string;
    modelIds: string[];
    rate: number; // Recyclability or Recoverability %
    benchmark: number; // Target %
    status: 'Compliant' | 'Non-Compliant' | 'Warning';
    action: string;
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
            description: 'Mandates 95% recoverability and 85% recyclability for all vehicles.',
            status: 'Compliant',
            deadline: 'Ongoing',
            impact: 'High',
        },
        {
            id: 'reg-2',
            name: 'AIS-129 (End-of-Life Vehicles)',
            description: 'Standard for collection and dismantling of ELVs in India.',
            status: 'Compliant',
            deadline: 'Ongoing',
            impact: 'High',
        },
        {
            id: 'reg-3',
            name: 'Battery Waste Management Rules, 2022',
            description: 'EPR for battery producers, ensuring collection and recycling.',
            status: 'In Progress',
            deadline: '31 Mar 2026',
            impact: 'High',
        },
        {
            id: 'reg-4',
            name: 'Plastic Waste Management Rules',
            description: 'Guidelines for recycled content in plastic packaging.',
            status: 'Non-Compliant',
            deadline: '30 Jun 2026',
            impact: 'Medium',
        },
    ],
    models: [
        {
            id: 'evitara',
            name: 'Maruti Suzuki eVitara',
            image: '/evitara.png', // Local Generated Image
            complianceScore: 92,
            type: 'EV',
            metrics: {
                recyclability: 95,
                elvCompliance: true,
                hazardousSubstances: 'Compliant',
                recycledMaterials: 450,
            },
            // EPR Stats
            eprRecovery: { target: 95, actual: 96.5, status: 'Compliant' },
            eprRecycling: { target: 85, actual: 87.2, status: 'Compliant' },
            exportData: {
                totalExportUnits: 15000,
                cbamCompliantUnits: 14250,
                compliantPercentage: 95,
                nonCompliantReasons: [
                    "Batch #402: Aluminum alloy rims from Supplier X lack verified embedded emission data.",
                    "Steel chassis components (Grade 304) exceed 1.9 tCO2e/t benchmark (Actual: 2.1 tCO2e/t)."
                ],
                complianceActions: [
                    "Request Form C emission declarations from Supplier X for Aluminum rims.",
                    "Switch chassis sourcing to Supplier Y (EAF Steel) with 0.8 tCO2e/t intensity."
                ]
            }
        },
        {
            id: 'fronx',
            name: 'Maruti Suzuki Fronx',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80',
            complianceScore: 88,
            type: 'ICE',
            metrics: {
                recyclability: 89,
                elvCompliance: true,
                hazardousSubstances: 'Compliant',
                recycledMaterials: 120,
            },
            // EPR Stats
            eprRecovery: { target: 95, actual: 94.8, status: 'Warning' },
            eprRecycling: { target: 85, actual: 82.5, status: 'Non-Compliant' },
            exportData: {
                totalExportUnits: 8500,
                cbamCompliantUnits: 5100,
                compliantPercentage: 60,
                nonCompliantReasons: [
                    "High carbon intensity in body panels (BOF Steel): 2.3 tCO2e/t vs EU Benchmark ~1.8 tCO2e/t.",
                    "Missing 'direct emissions' data for engine block casting (Iron)."
                ],
                complianceActions: [
                    "Secure 'Green Steel' certificates for body panels to reduce calculated intensity.",
                    "Audit foundry partners to establish direct emission monitoring for engine blocks."
                ]
            }
        },
        {
            id: 'baleno',
            name: 'Maruti Suzuki Baleno',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-66.jpeg?isig=0&q=80',
            complianceScore: 85,
            type: 'ICE',
            metrics: {
                recyclability: 87,
                elvCompliance: true,
                hazardousSubstances: 'Compliant',
                recycledMaterials: 280,
            },
            // EPR Stats
            eprRecovery: { target: 95, actual: 95.2, status: 'Compliant' },
            eprRecycling: { target: 85, actual: 86.0, status: 'Compliant' },
            exportData: {
                totalExportUnits: 12000,
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
        { id: 'st-1', name: 'Body Side Outer (LH)', material: 'Steel', grade: 'AHSS / DP600', hsCode: '8708.29', modelIds: ['evitara', 'fronx'], exportQty: 2500, emissions: 1.7, benchmark: 1.9, status: 'Compliant', supplier: 'Posco India', action: 'None' },
        { id: 'st-2', name: 'Chassis Main Rail', material: 'Steel', grade: 'HSLA 340', hsCode: '8708.99', modelIds: ['evitara'], exportQty: 1200, emissions: 2.1, benchmark: 1.9, status: 'Non-Compliant', supplier: 'Tata Steel', action: 'Switch to EAF Steel' },
        { id: 'st-3', name: 'Door Impact Beam', material: 'Steel', grade: 'Ultra High Strength (Boron)', hsCode: '8708.29', modelIds: ['baleno', 'fronx'], exportQty: 4000, emissions: 1.8, benchmark: 2.0, status: 'Compliant', supplier: 'JSW Steel', action: 'None' },
        { id: 'st-4', name: 'Suspension Control Arm', material: 'Steel', grade: 'Forged Steel', hsCode: '8708.80', modelIds: ['evitara', 'baleno'], exportQty: 2200, emissions: 2.3, benchmark: 2.0, status: 'Non-Compliant', supplier: 'Bharat Forge', action: 'Audit Process Energy' },
        { id: 'st-5', name: 'Fuel Tank Shell', material: 'Steel', grade: 'Galvannealed Sheet', hsCode: '8708.99', modelIds: ['fronx'], exportQty: 900, emissions: 1.9, benchmark: 1.9, status: 'Warning', supplier: 'Essar Steel', action: 'Monitor Emissions' },
        { id: 'st-6', name: 'Roof Panel', material: 'Steel', grade: 'Mild Steel (CRCA)', hsCode: '8708.29', modelIds: ['baleno'], exportQty: 1500, emissions: 1.6, benchmark: 1.9, status: 'Compliant', supplier: 'Posco India', action: 'None' },
        { id: 'st-7', name: 'Bumpled Reinforcement', material: 'Steel', grade: 'HSLA 420', hsCode: '8708.10', modelIds: ['evitara'], exportQty: 1100, emissions: 1.75, benchmark: 1.9, status: 'Compliant', supplier: 'Tata Steel', action: 'None' },
        { id: 'st-8', name: 'Seat Frame Structure', material: 'Steel', grade: 'Tubular Steel', hsCode: '9401.90', modelIds: ['evitara', 'fronx', 'baleno'], exportQty: 5000, emissions: 2.0, benchmark: 1.9, status: 'Non-Compliant', supplier: 'Lear Corp', action: 'Request Data' },
        { id: 'st-9', name: 'Exhaust Manifold', material: 'Steel', grade: 'Stainless Steel 409', hsCode: '8708.92', modelIds: ['fronx', 'baleno'], exportQty: 2000, emissions: 2.8, benchmark: 2.5, status: 'Non-Compliant', supplier: 'Viraj Profiles', action: 'Evaluate Scrap Usage' },
        { id: 'st-10', name: 'Wheel Rim (Steel)', material: 'Steel', grade: 'Dual Phase 590', hsCode: '8708.70', modelIds: ['baleno'], exportQty: 800, emissions: 1.85, benchmark: 1.8, status: 'Warning', supplier: 'Wheels India', action: 'Optimize Logistics' },

        // --- Aluminum Parts (10) - Benchmark ~ 4.0 - 4.5 ---
        { id: 'al-1', name: 'Engine Block', material: 'Aluminum', grade: 'ADC12 (Die Cast)', hsCode: '8409.91', modelIds: ['fronx', 'baleno'], exportQty: 4500, emissions: 4.8, benchmark: 4.2, status: 'Non-Compliant', supplier: 'Sunbeam Auto', action: 'Increase Recycled %' },
        { id: 'al-2', name: 'Alloy Wheel (17")', material: 'Aluminum', grade: 'Al-Si-Mg Alloy (A356)', hsCode: '8708.70', modelIds: ['evitara', 'fronx'], exportQty: 3200, emissions: 5.2, benchmark: 4.5, status: 'Non-Compliant', supplier: 'Minda Industries', action: 'Switch to Green Al' },
        { id: 'al-3', name: 'Heat Exchanger / Radiator', material: 'Aluminum', grade: '3003 Alloy Clad', hsCode: '8708.91', modelIds: ['evitara'], exportQty: 1500, emissions: 3.5, benchmark: 4.0, status: 'Warning', supplier: 'Denso India', action: 'Verify Electricity Source' },
        { id: 'al-4', name: 'Transmission Case', material: 'Aluminum', grade: 'ADC10', hsCode: '8708.40', modelIds: ['fronx'], exportQty: 2100, emissions: 4.5, benchmark: 4.2, status: 'Non-Compliant', supplier: 'Endurance Tech', action: 'Investigate Smelter Data' },
        { id: 'al-5', name: 'Hood Panel (Bonnet)', material: 'Aluminum', grade: '6000 Series (6016)', hsCode: '8708.29', modelIds: ['evitara'], exportQty: 850, emissions: 2.9, benchmark: 4.0, status: 'Compliant', supplier: 'Hindalco', action: 'None' },
        { id: 'al-6', name: 'Control Arm (Lower)', material: 'Aluminum', grade: 'Forged 6082', hsCode: '8708.80', modelIds: ['evitara'], exportQty: 900, emissions: 3.1, benchmark: 4.0, status: 'Warning', supplier: 'Bharat Forge', action: 'Track Ingot Source' },
        { id: 'al-7', name: 'AC Compressor Housing', material: 'Aluminum', grade: 'Die Cast Al', hsCode: '8414.90', modelIds: ['baleno', 'fronx', 'evitara'], exportQty: 5500, emissions: 4.2, benchmark: 4.0, status: 'Non-Compliant', supplier: 'Subros', action: 'Review Supply Chain' },
        { id: 'al-8', name: 'Battery Tray / Pack Housing', material: 'Aluminum', grade: 'Extruded 6063', hsCode: '8708.99', modelIds: ['evitara'], exportQty: 1200, emissions: 2.5, benchmark: 4.0, status: 'Compliant', supplier: 'Norsk Hydro', action: 'None (Green Al Used)' },
        { id: 'al-9', name: 'Steering Knuckle', material: 'Aluminum', grade: 'Cast A356-T6', hsCode: '8708.94', modelIds: ['evitara'], exportQty: 1100, emissions: 4.1, benchmark: 4.0, status: 'Non-Compliant', supplier: 'Rico Auto', action: 'Shift to Low-Carbon Al' },
        { id: 'al-10', name: 'Alternator Housing', material: 'Aluminum', grade: 'Die Cast', hsCode: '8511.90', modelIds: ['baleno'], exportQty: 3000, emissions: 4.6, benchmark: 4.2, status: 'Non-Compliant', supplier: 'Lucas TVS', action: 'Audit Foundry' },

        // --- Cast Iron Parts (10) - Benchmark ~ 1.5 ---
        { id: 'ci-1', name: 'Brake Disc / Rotor', material: 'Cast Iron', grade: 'Grey Cast Iron (G3000)', hsCode: '8708.30', modelIds: ['evitara', 'fronx', 'baleno'], exportQty: 12000, emissions: 1.2, benchmark: 1.5, status: 'Compliant', supplier: 'Brakes India', action: 'None' },
        { id: 'ci-2', name: 'Engine Block Lining', material: 'Cast Iron', grade: 'Grey Iron', hsCode: '8409.91', modelIds: ['fronx', 'baleno'], exportQty: 8000, emissions: 1.4, benchmark: 1.5, status: 'Warning', supplier: 'Kirloskar Ferrous', action: 'Check Coke Usage' },
        { id: 'ci-3', name: 'Exhaust Manifold (Turbo)', material: 'Cast Iron', grade: 'Hi-Si Moly Iron', hsCode: '8708.92', modelIds: ['fronx'], exportQty: 1500, emissions: 1.6, benchmark: 1.5, status: 'Non-Compliant', supplier: 'HinduJa Foundries', action: 'Implement Heat Recovery' },
        { id: 'ci-4', name: 'Camshaft', material: 'Cast Iron', grade: 'Chilled Cast Iron', hsCode: '8483.10', modelIds: ['baleno'], exportQty: 4000, emissions: 1.3, benchmark: 1.5, status: 'Compliant', supplier: 'Bharat Forge', action: 'None' },
        { id: 'ci-5', name: 'Crankshaft', material: 'Cast Iron', grade: 'Ductile Iron (SG Iron)', hsCode: '8483.10', modelIds: ['fronx'], exportQty: 3500, emissions: 1.1, benchmark: 1.5, status: 'Compliant', supplier: 'Amtek Auto', action: 'None' },
        { id: 'ci-6', name: 'Differential Case', material: 'Cast Iron', grade: 'Nodular Iron', hsCode: '8708.50', modelIds: ['evitara'], exportQty: 1200, emissions: 1.5, benchmark: 1.5, status: 'Warning', supplier: 'Sona Comstar', action: 'Monitor Scrap Input' },
        { id: 'ci-7', name: 'Water Pump Impeller', material: 'Cast Iron', grade: 'Cast Iron', hsCode: '8413.91', modelIds: ['baleno'], exportQty: 5000, emissions: 1.4, benchmark: 1.5, status: 'Warning', supplier: 'GMB India', action: 'Audit Energy Mix' },
        { id: 'ci-8', name: 'Flywheel', material: 'Cast Iron', grade: 'Grey Iron', hsCode: '8483.90', modelIds: ['fronx', 'baleno'], exportQty: 4200, emissions: 1.25, benchmark: 1.5, status: 'Compliant', supplier: 'Amtek', action: 'None' },
        { id: 'ci-9', name: 'Steering Box Housing', material: 'Cast Iron', grade: 'SG Iron', hsCode: '8708.94', modelIds: ['fronx'], exportQty: 2000, emissions: 1.35, benchmark: 1.5, status: 'Compliant', supplier: 'Rane TRW', action: 'None' },
        { id: 'ci-10', name: 'Clutch Pressure Plate', material: 'Cast Iron', grade: 'Grey Iron', hsCode: '8708.93', modelIds: ['baleno'], exportQty: 3800, emissions: 1.3, benchmark: 1.5, status: 'Compliant', supplier: 'Valeo India', action: 'None' },

        // --- Plastic Parts (10) - Benchmark ~ 3.0 ---
        { id: 'pl-1', name: 'Front Bumper Fascia', material: 'Plastic', grade: 'PP + EPDM (TPO)', hsCode: '8708.10', modelIds: ['evitara', 'fronx', 'baleno'], exportQty: 6000, emissions: 2.8, benchmark: 3.0, status: 'Compliant', supplier: 'Motherson Sumi', action: 'None' },
        { id: 'pl-2', name: 'Instrument Panel / Dash', material: 'Plastic', grade: 'PP-LGF / PC-ABS', hsCode: '8708.29', modelIds: ['evitara'], exportQty: 1500, emissions: 3.2, benchmark: 3.0, status: 'Warning', supplier: 'Tata AutoComp', action: 'Increase Recycled Content' },
        { id: 'pl-3', name: 'Fuel Tank', material: 'Plastic', grade: 'HDPE (Multi-layer)', hsCode: '8708.99', modelIds: ['fronx', 'baleno'], exportQty: 7000, emissions: 2.5, benchmark: 3.0, status: 'Compliant', supplier: 'Plastic Omnium', action: 'None' },
        { id: 'pl-4', name: 'Door Trim Panel', material: 'Plastic', grade: 'PP (Inj Molded)', hsCode: '8708.29', modelIds: ['baleno', 'fronx'], exportQty: 8000, emissions: 2.1, benchmark: 3.0, status: 'Compliant', supplier: 'Krishna Maruti', action: 'None' },
        { id: 'pl-5', name: 'Headlamp Housing', material: 'Plastic', grade: 'Polycarbonate (PC)', hsCode: '8512.20', modelIds: ['evitara'], exportQty: 2000, emissions: 4.5, benchmark: 3.5, status: 'Non-Compliant', supplier: 'Lumax', action: 'Switch to Bio-PC' },
        { id: 'pl-6', name: 'Air Intake Manifold', material: 'Plastic', grade: 'Nylon 6 (PA6-GF30)', hsCode: '8409.91', modelIds: ['fronx'], exportQty: 3000, emissions: 5.1, benchmark: 4.0, status: 'Non-Compliant', supplier: 'Mann+Hummel', action: 'Source Recycled PA6' },
        { id: 'pl-7', name: 'Wheel Arch Liner', material: 'Plastic', grade: 'Recycled PP', hsCode: '8708.29', modelIds: ['evitara', 'fronx'], exportQty: 4500, emissions: 1.2, benchmark: 3.0, status: 'Compliant', supplier: 'Supreme Treon', action: 'None' },
        { id: 'pl-8', name: 'Battery Case (12V)', material: 'Plastic', grade: 'Polypropylene Copolymer', hsCode: '8507.90', modelIds: ['baleno'], exportQty: 5000, emissions: 2.2, benchmark: 3.0, status: 'Compliant', supplier: 'Exide', action: 'None' },
        { id: 'pl-9', name: 'Seat Foam / Cushion', material: 'Plastic', grade: 'Polyurethane (PU)', hsCode: '9401.90', modelIds: ['evitara'], exportQty: 1500, emissions: 3.8, benchmark: 3.5, status: 'Warning', supplier: 'Bharat Seats', action: 'Explore Bio-PU' },
        { id: 'pl-10', name: 'Radiator Grille', material: 'Plastic', grade: 'ABS (Chrome Plated)', hsCode: '8708.29', modelIds: ['fronx'], exportQty: 1800, emissions: 4.0, benchmark: 3.5, status: 'Non-Compliant', supplier: 'Motherson', action: 'Reduce Chrome / Change Paint' },
    ],
    eprRecoveryParts: [
        // Steel (High Recovery)
        { id: 'r-st-1', name: 'Body Side Outer', material: 'Steel', grade: 'AHSS', modelIds: ['evitara'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-2', name: 'Chassis Rail', material: 'Steel', grade: 'HSLA', modelIds: ['evitara', 'fronx'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-3', name: 'Door Beam', material: 'Steel', grade: 'Boron', modelIds: ['baleno'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-4', name: 'Control Arm', material: 'Steel', grade: 'Forged', modelIds: ['evitara'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-5', name: 'Fuel Tank Shell', material: 'Steel', grade: 'Galvannealed', modelIds: ['fronx'], rate: 92, benchmark: 95, status: 'Warning', action: 'Improve Dismantling' },
        { id: 'r-st-6', name: 'Roof Panel', material: 'Steel', grade: 'Mild', modelIds: ['baleno'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-7', name: 'Reinforcement', material: 'Steel', grade: 'HSLA', modelIds: ['evitara'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-8', name: 'Seat Frame', material: 'Steel', grade: 'Tubular', modelIds: ['baleno'], rate: 94, benchmark: 95, status: 'Warning', action: 'Material Separation' },
        { id: 'r-st-9', name: 'Exhaust', material: 'Steel', grade: 'Stainless', modelIds: ['fronx'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-st-10', name: 'Wheel Rim', material: 'Steel', grade: 'DP', modelIds: ['baleno'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None' },
        // Aluminum
        { id: 'r-al-1', name: 'Engine Block', material: 'Aluminum', grade: 'ADC12', modelIds: ['fronx'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-al-2', name: 'Alloy Wheel', material: 'Aluminum', grade: 'A356', modelIds: ['evitara'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-al-3', name: 'Radiator', material: 'Aluminum', grade: '3003', modelIds: ['evitara'], rate: 88, benchmark: 95, status: 'Non-Compliant', action: 'Impure Alloys issue' },
        { id: 'r-al-4', name: 'Trans Case', material: 'Aluminum', grade: 'ADC10', modelIds: ['fronx'], rate: 94, benchmark: 95, status: 'Warning', action: 'Better Sorting' },
        { id: 'r-al-5', name: 'Hood Panel', material: 'Aluminum', grade: '6016', modelIds: ['evitara'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-al-6', name: 'Control Arm', material: 'Aluminum', grade: '6082', modelIds: ['evitara'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-al-7', name: 'Compressor', material: 'Aluminum', grade: 'Die Cast', modelIds: ['baleno'], rate: 85, benchmark: 95, status: 'Non-Compliant', action: 'Multi-material mix' },
        { id: 'r-al-8', name: 'Battery Tray', material: 'Aluminum', grade: '6063', modelIds: ['evitara'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-al-9', name: 'Knuckle', material: 'Aluminum', grade: 'A356', modelIds: ['evitara'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-al-10', name: 'Alternator', material: 'Aluminum', grade: 'Die Cast', modelIds: ['baleno'], rate: 89, benchmark: 95, status: 'Non-Compliant', action: 'Copper contamination' },
        // Iron
        { id: 'r-ci-1', name: 'Brake Disc', material: 'Cast Iron', grade: 'G3000', modelIds: ['evitara'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-2', name: 'Engine Lining', material: 'Cast Iron', grade: 'Grey', modelIds: ['fronx'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-3', name: 'Turbo Manifold', material: 'Cast Iron', grade: 'Hi-Si', modelIds: ['fronx'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-4', name: 'Camshaft', material: 'Cast Iron', grade: 'Chilled', modelIds: ['baleno'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-5', name: 'Crankshaft', material: 'Cast Iron', grade: 'SG', modelIds: ['fronx'], rate: 99, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-6', name: 'Diff Case', material: 'Cast Iron', grade: 'Nodular', modelIds: ['evitara'], rate: 96, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-7', name: 'Water Pump', material: 'Cast Iron', grade: 'Cast', modelIds: ['baleno'], rate: 90, benchmark: 95, status: 'Warning', action: 'Assembly complexity' },
        { id: 'r-ci-8', name: 'Flywheel', material: 'Cast Iron', grade: 'Grey', modelIds: ['fronx'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-9', name: 'Steering Box', material: 'Cast Iron', grade: 'SG', modelIds: ['fronx'], rate: 97, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-ci-10', name: 'Pressure Plate', material: 'Cast Iron', grade: 'Grey', modelIds: ['baleno'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        // Plastic (Energy Recovery Possible)
        { id: 'r-pl-1', name: 'Bumper', material: 'Plastic', grade: 'TPO', modelIds: ['evitara'], rate: 100, benchmark: 95, status: 'Compliant', action: 'Incineration safe' },
        { id: 'r-pl-2', name: 'Dash', material: 'Plastic', grade: 'ABS', modelIds: ['evitara'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-pl-3', name: 'Fuel Tank', material: 'Plastic', grade: 'HDPE', modelIds: ['fronx'], rate: 100, benchmark: 95, status: 'Compliant', action: 'High calorific val' },
        { id: 'r-pl-4', name: 'Door Trim', material: 'Plastic', grade: 'PP', modelIds: ['baleno'], rate: 100, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-pl-5', name: 'Headlamp', material: 'Plastic', grade: 'PC', modelIds: ['evitara'], rate: 90, benchmark: 95, status: 'Warning', action: 'Electronics removal' },
        { id: 'r-pl-6', name: 'Intake', material: 'Plastic', grade: 'Nylon', modelIds: ['fronx'], rate: 95, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-pl-7', name: 'Liner', material: 'Plastic', grade: 'PP', modelIds: ['evitara'], rate: 100, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-pl-8', name: 'Battery Case', material: 'Plastic', grade: 'PP', modelIds: ['baleno'], rate: 98, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-pl-9', name: 'Seat Foam', material: 'Plastic', grade: 'PU', modelIds: ['evitara'], rate: 100, benchmark: 95, status: 'Compliant', action: 'None' },
        { id: 'r-pl-10', name: 'Grille', material: 'Plastic', grade: 'ABS', modelIds: ['fronx'], rate: 92, benchmark: 95, status: 'Warning', action: 'Plating issue' },
    ],
    eprRecyclingParts: [
        // Steel (High Recycling)
        { id: 'rc-st-1', name: 'Body Side Outer', material: 'Steel', grade: 'AHSS', modelIds: ['evitara'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-2', name: 'Chassis Rail', material: 'Steel', grade: 'HSLA', modelIds: ['evitara', 'fronx'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-3', name: 'Door Beam', material: 'Steel', grade: 'Boron', modelIds: ['baleno'], rate: 97, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-4', name: 'Control Arm', material: 'Steel', grade: 'Forged', modelIds: ['evitara'], rate: 96, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-5', name: 'Fuel Tank Shell', material: 'Steel', grade: 'Galvannealed', modelIds: ['fronx'], rate: 90, benchmark: 85, status: 'Compliant', action: 'Coatings issue' },
        { id: 'rc-st-6', name: 'Roof Panel', material: 'Steel', grade: 'Mild', modelIds: ['baleno'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-7', name: 'Reinforcement', material: 'Steel', grade: 'HSLA', modelIds: ['evitara'], rate: 99, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-8', name: 'Seat Frame', material: 'Steel', grade: 'Tubular', modelIds: ['baleno'], rate: 92, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-9', name: 'Exhaust', material: 'Steel', grade: 'Stainless', modelIds: ['fronx'], rate: 95, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-st-10', name: 'Wheel Rim', material: 'Steel', grade: 'DP', modelIds: ['baleno'], rate: 99, benchmark: 85, status: 'Compliant', action: 'None' },
        // Aluminum
        { id: 'rc-al-1', name: 'Engine Block', material: 'Aluminum', grade: 'ADC12', modelIds: ['fronx'], rate: 92, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-2', name: 'Alloy Wheel', material: 'Aluminum', grade: 'A356', modelIds: ['evitara'], rate: 90, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-3', name: 'Radiator', material: 'Aluminum', grade: '3003', modelIds: ['evitara'], rate: 80, benchmark: 85, status: 'Warning', action: 'Plastic tanks' },
        { id: 'rc-al-4', name: 'Trans Case', material: 'Aluminum', grade: 'ADC10', modelIds: ['fronx'], rate: 91, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-5', name: 'Hood Panel', material: 'Aluminum', grade: '6016', modelIds: ['evitara'], rate: 85, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-6', name: 'Control Arm', material: 'Aluminum', grade: '6082', modelIds: ['evitara'], rate: 93, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-7', name: 'Compressor', material: 'Aluminum', grade: 'Die Cast', modelIds: ['baleno'], rate: 75, benchmark: 85, status: 'Non-Compliant', action: 'Assembly' },
        { id: 'rc-al-8', name: 'Battery Tray', material: 'Aluminum', grade: '6063', modelIds: ['evitara'], rate: 95, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-9', name: 'Knuckle', material: 'Aluminum', grade: 'A356', modelIds: ['evitara'], rate: 92, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-al-10', name: 'Alternator', material: 'Aluminum', grade: 'Die Cast', modelIds: ['baleno'], rate: 82, benchmark: 85, status: 'Warning', action: 'Copper removal' },
        // Iron
        { id: 'rc-ci-1', name: 'Brake Disc', material: 'Cast Iron', grade: 'G3000', modelIds: ['evitara'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-2', name: 'Engine Lining', material: 'Cast Iron', grade: 'Grey', modelIds: ['fronx'], rate: 97, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-3', name: 'Turbo Manifold', material: 'Cast Iron', grade: 'Hi-Si', modelIds: ['fronx'], rate: 96, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-4', name: 'Camshaft', material: 'Cast Iron', grade: 'Chilled', modelIds: ['baleno'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-5', name: 'Crankshaft', material: 'Cast Iron', grade: 'SG', modelIds: ['fronx'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-6', name: 'Diff Case', material: 'Cast Iron', grade: 'Nodular', modelIds: ['evitara'], rate: 95, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-7', name: 'Water Pump', material: 'Cast Iron', grade: 'Cast', modelIds: ['baleno'], rate: 88, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-8', name: 'Flywheel', material: 'Cast Iron', grade: 'Grey', modelIds: ['fronx'], rate: 98, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-9', name: 'Steering Box', material: 'Cast Iron', grade: 'SG', modelIds: ['fronx'], rate: 96, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-ci-10', name: 'Pressure Plate', material: 'Cast Iron', grade: 'Grey', modelIds: ['baleno'], rate: 90, benchmark: 85, status: 'Compliant', action: 'None' },
        // Plastic (Hard to Recycle)
        { id: 'rc-pl-1', name: 'Bumper', material: 'Plastic', grade: 'TPO', modelIds: ['evitara'], rate: 88, benchmark: 85, status: 'Compliant', action: 'Easy to remove' },
        { id: 'rc-pl-2', name: 'Dash', material: 'Plastic', grade: 'ABS', modelIds: ['evitara'], rate: 70, benchmark: 85, status: 'Non-Compliant', action: 'Composites' },
        { id: 'rc-pl-3', name: 'Fuel Tank', material: 'Plastic', grade: 'HDPE', modelIds: ['fronx'], rate: 75, benchmark: 85, status: 'Non-Compliant', action: 'Multi-layer barrier' },
        { id: 'rc-pl-4', name: 'Door Trim', material: 'Plastic', grade: 'PP', modelIds: ['baleno'], rate: 85, benchmark: 85, status: 'Compliant', action: 'None' },
        { id: 'rc-pl-5', name: 'Headlamp', material: 'Plastic', grade: 'PC', modelIds: ['evitara'], rate: 40, benchmark: 85, status: 'Non-Compliant', action: 'Glued assembly' },
        { id: 'rc-pl-6', name: 'Intake', material: 'Plastic', grade: 'Nylon', modelIds: ['fronx'], rate: 60, benchmark: 85, status: 'Non-Compliant', action: 'Glass Filled' },
        { id: 'rc-pl-7', name: 'Liner', material: 'Plastic', grade: 'PP', modelIds: ['evitara'], rate: 90, benchmark: 85, status: 'Compliant', action: 'Black plastic' },
        { id: 'rc-pl-8', name: 'Battery Case', material: 'Plastic', grade: 'PP', modelIds: ['baleno'], rate: 95, benchmark: 85, status: 'Compliant', action: 'Standardized' },
        { id: 'rc-pl-9', name: 'Seat Foam', material: 'Plastic', grade: 'PU', modelIds: ['evitara'], rate: 20, benchmark: 85, status: 'Non-Compliant', action: 'Chemical recycling needed' },
        { id: 'rc-pl-10', name: 'Grille', material: 'Plastic', grade: 'ABS', modelIds: ['fronx'], rate: 30, benchmark: 85, status: 'Non-Compliant', action: 'Plated' },
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
