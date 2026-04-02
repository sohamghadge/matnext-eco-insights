import { Card, Typography, Tag, Progress, Statistic, Table, Button, Modal, Select, Space, Input, notification } from 'antd';
import { Car, CheckCircle, AlertTriangle, Calendar, ChevronRight, Info, ImageOff, Globe, Filter, Search, Recycle, Settings } from 'lucide-react';
import { RegulatoryData, ComplianceStat, ModelComplianceData, PartComplianceData, EPRPartData } from '@/data/regulatoryData';
import { useState, useMemo } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface ComplianceOverviewProps {
    data: RegulatoryData;
}

const regulatoryLandscapeData = [
    {
        key: '0',
        countryRegion: 'India',
        formalName: 'Environment Protection (End-of-Life Vehicles) Rules, 2025 [S.O. 98(E)]',
        targetYear: '2025-26',
        status: 'Implemented',
        material: 'Steel',
        quantitativeTarget: '8% of steel (by weight) used in vehicles sold 20 years prior must be scrapped/recycled via Registered Vehicle Scrapping Facilities (RVSFs) — EPR obligation for transport vehicles (15-year average life) and non-transport vehicles (20-year average life). Target rises gradually to 18% by 2035-36.',
        officialSourceTitle: 'Ministry of Environment, Forest and Climate Change — Gazette of India S.O. 98(E), dated 6 January 2025',
        officialSourceURL: 'https://egazette.gov.in/writeReadData/2024/251663.pdf',
        issuingAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India',
        dateOfIssue: '2025-01-06',
        effectiveDate: '2025-04-01',
        amendmentVersionDate: 'N/A (new notification; replaced draft ELV Management Rules 2024)',
        summaryOfRequirement: 'Producers (manufacturers, assemblers, importers) of all motor vehicles must meet annual EPR targets for scrapping of steel from ELVs starting FY 2025-26 at 8%, rising to 18% by 2035-36. EPR compliance is via purchase of certificates from authorised RVSFs through a centralised CPCB portal. Annual returns due by 30 June each year. Applies to all vehicles including EVs and battery-operated vehicles; excludes agricultural tractors/trailers, waste batteries, plastic packaging, waste tyres, and e-waste (covered under separate rules).',
        applicability: 'Yes — directly and exclusively applies to automobile producers, RVSFs, bulk consumers, and collection centres.',
        relevance: 'Producers (OEMs, importers, assemblers), RVSFs, Bulk Consumers, Collection Centres',
        changeType: 'New',
        previousValue: 'N/A',
        currentValue: '8% steel recycling EPR target in FY 2025-26, rising to 18% by FY 2035-36',
        lastVerified: '2026-03-31',
    },
    // {
    //     key: '1',
    //     countryRegion: 'India',
    //     formalName: 'Environment Protection (End-of-Life Vehicles) Rules, 2025 [S.O. 98(E)]',
    //     targetYear: '2030-31',
    //     status: 'Implemented',
    //     material: 'Steel',
    //     quantitativeTarget: 'Phased EPR target for steel scrapping — intermediate phase (exact % confirmed at ~13% for mid-phase years between 2025-26 and 2035-36, as per Schedule in the Rules). Final 18% target is mandated by 2035-36.',
    //     officialSourceTitle: 'Ministry of Environment, Forest and Climate Change — Gazette of India S.O. 98(E), dated 6 January 2025',
    //     officialSourceURL: 'https://egazette.gov.in/writeReadData/2024/251663.pdf',
    //     issuingAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India',
    //     dateOfIssue: '2025-01-06',
    //     effectiveDate: '2025-04-01',
    //     amendmentVersionDate: 'N/A',
    //     summaryOfRequirement: 'Phased EPR targets for steel recycling from ELVs — 8% (2025-26), rising to ~13% mid-phase, then 18% by 2035-36. Producers must obtain EPR certificates from RVSFs, which are valid for 5 years and tradeable on CPCB portal.',
    //     applicability: 'Yes',
    //     relevance: 'Producers (OEMs, importers, assemblers), RVSFs',
    //     changeType: 'New',
    //     previousValue: 'N/A',
    //     currentValue: 'Phased targets up to 18% by FY 2035-36',
    //     lastVerified: '2026-03-31',
    // },
    {
        key: '2',
        countryRegion: 'India',
        formalName: 'Battery Waste Management Rules, 2022 (as amended by Amendment Rules 2023, 2024, 2025)',
        targetYear: '2024-25',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'Material recovery target of 70% (by dry weight) for EV and portable lithium-ion batteries in FY 2024-25. Recyclers must achieve 70% recovery. Collection target: 70% of EV batteries placed in market by FY 2027-28.',
        officialSourceTitle: 'Battery Waste Management Rules 2022 — Ministry of Environment, Forest and Climate Change; amendments 2023, 2024, 2025 notified via Gazette of India',
        officialSourceURL: 'https://cpcb.nic.in/rules-5/',
        issuingAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India; monitored by CPCB',
        dateOfIssue: '2022-08-01',
        effectiveDate: '2022-08-01',
        amendmentVersionDate: '2025 (most recent amendment); also 2023 and 2024 amendments',
        summaryOfRequirement: 'EPR framework for all battery types (EV, automotive, portable, industrial). Producers responsible for collection, recycling/refurbishment of waste batteries. Recovery targets increase from 70% in 2024-25 to 80% in 2025-26, and 90% from 2026-27 onwards. Mandatory minimum recycled content in new batteries from FY 2027-28 (starting at 5%, rising to 20% by 2030-31). 2025 amendment adds mandatory QR-code/barcode on batteries for traceability. Annual and quarterly returns to CPCB mandatory. Battery-level obligations separate from ELV Rules 2025.',
        applicability: 'Yes — explicitly covers EV batteries, automotive starter batteries, and battery packs in vehicles',
        relevance: 'Producers (including EV OEMs and importers), Recyclers, Refurbishers, Collection Agents',
        changeType: 'Updated (2025 amendment adds QR traceability)',
        previousValue: '2024 amendment: prescribed minimum recycled content from 2027-28 onward',
        currentValue: '2025 amendment: mandatory QR/barcode EPR number on batteries; micro-producer exemptions; flexible labelling. Recovery targets: 70% (2024-25), 80% (2025-26), 90% (2026-27+). Recycled content: 5% in 2027-28 rising to 20% by 2030-31.',
        lastVerified: '2026-03-31',
    },
    {
        key: '3',
        countryRegion: 'India',
        formalName: 'Battery Waste Management Rules, 2022 (as amended)',
        targetYear: '2027-28',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'Minimum 5% recycled content (from domestically recycled materials, by dry weight) in new batteries manufactured/sold in India from FY 2027-28. Rises to 20% by FY 2030-31.',
        officialSourceTitle: 'Battery Waste Management (Second Amendment) Rules 2024, G.S.R. — Gazette of India, 20 June 2024',
        officialSourceURL: 'https://cpcb.nic.in/rules-5/',
        issuingAuthority: 'MoEFCC, Government of India',
        dateOfIssue: '2024-06-20',
        effectiveDate: '2027-04-01 (for recycled content obligation)',
        amendmentVersionDate: '2024-06-20 (Second Amendment 2024)',
        summaryOfRequirement: 'From FY 2027-28, producers of portable, EV, automotive, and industrial batteries must incorporate minimum percentages of domestically recycled materials: 5% in 2027-28, scaling up to 20% by 2030-31. Applies to all battery categories. CPCB portal is basis for compliance tracking.',
        applicability: 'Yes — directly applicable to EV battery and automotive battery producers',
        relevance: 'Producers (OEMs, importers), Battery Manufacturers',
        changeType: 'New (recycled content obligation introduced via 2024 amendment)',
        previousValue: 'No mandatory recycled content in batteries before this amendment',
        currentValue: '5% recycled content in 2027-28, rising to 20% by 2030-31',
        lastVerified: '2026-03-31',
    },
    {
        key: '4',
        countryRegion: 'India',
        formalName: 'Hazardous and Other Wastes (Management and Transboundary Movement) Amendment Rules, 2025 — EPR for Non-Ferrous Metal Scrap [G.S.R. 438(E)]',
        targetYear: '2026-27',
        status: 'Official',
        material: 'Aluminium',
        quantitativeTarget: '10% EPR recycling target for aluminium scrap in FY 2026-27, rising to 75% by FY 2032-33 (as per Schedule XI of the Rules).',
        officialSourceTitle: 'Gazette of India G.S.R. 438(E) dated 1 July 2025 — Hazardous and Other Wastes (Management and Transboundary Movement) Amendment Rules, 2025',
        officialSourceURL: 'https://egazette.gov.in',
        issuingAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India',
        dateOfIssue: '2025-07-01',
        effectiveDate: '2026-04-01',
        amendmentVersionDate: '2025-07-01',
        summaryOfRequirement: 'New Chapter under Hazardous Waste Rules introduces EPR for non-ferrous metal scrap (aluminium, copper, zinc, and their alloys). Mandatory registration on CPCB portal. EPR recycling targets begin at 10% in 2026-27 and rise to 75% by 2032-33. Producers must also use minimum recycled content per Schedule XIII. Applies to producers, manufacturers, recyclers, refurbishers, collection agents, bulk consumers. Relevant to automotive aluminium components and parts. Automotive sector is a major consumer of aluminium (42% per EC data).',
        applicability: 'Yes — automotive sector is the single largest consumer of aluminium; applies to producers of aluminium-containing products including auto components',
        relevance: 'Producers, Manufacturers, Recyclers, Refurbishers, Collection Agents, Bulk Consumers',
        changeType: 'New',
        previousValue: 'No formal EPR for aluminium/copper/zinc scrap under this framework',
        currentValue: '10% EPR target from 2026-27, rising to 75% by 2032-33',
        lastVerified: '2026-03-31',
    },
    {
        key: '5',
        countryRegion: 'India',
        formalName: 'Hazardous and Other Wastes (Management and Transboundary Movement) Amendment Rules, 2025 — EPR for Non-Ferrous Metal Scrap [G.S.R. 438(E)]',
        targetYear: '2026-27',
        status: 'Official',
        material: 'Copper',
        quantitativeTarget: '10% EPR recycling target for copper scrap in FY 2026-27, rising to 75% by FY 2032-33 (as per Schedule XI of the Rules).',
        officialSourceTitle: 'Gazette of India G.S.R. 438(E) dated 1 July 2025 — Hazardous and Other Wastes (Management and Transboundary Movement) Amendment Rules, 2025',
        officialSourceURL: 'https://egazette.gov.in',
        issuingAuthority: 'MoEFCC, Government of India',
        dateOfIssue: '2025-07-01',
        effectiveDate: '2026-04-01',
        amendmentVersionDate: '2025-07-01',
        summaryOfRequirement: 'Same framework as for Aluminium. EPR for copper scrap from 10% in 2026-27 to 75% in 2032-33. Minimum recycled content obligations also apply per Schedule XIII. Critical for automotive wiring harnesses, motors, and EV powertrain copper components.',
        applicability: 'Yes — copper is a critical material in automotive wiring harnesses, EV motors, and braking systems',
        relevance: 'Producers, Manufacturers, Recyclers, Bulk Consumers',
        changeType: 'New',
        previousValue: 'No formal EPR for copper scrap under this framework',
        currentValue: '10% EPR target from 2026-27, rising to 75% by 2032-33',
        lastVerified: '2026-03-31',
    },
    {
        key: '6',
        countryRegion: 'India',
        formalName: 'Hazardous and Other Wastes (Management and Transboundary Movement) Amendment Rules, 2025 — EPR for Non-Ferrous Metal Scrap [G.S.R. 438(E)]',
        targetYear: '2026-27',
        status: 'Official',
        material: 'Zinc',
        quantitativeTarget: '10% EPR recycling target for zinc scrap in FY 2026-27, rising to 75% by FY 2032-33 (as per Schedule XI of the Rules).',
        officialSourceTitle: 'Gazette of India G.S.R. 438(E) dated 1 July 2025 — Hazardous and Other Wastes (Management and Transboundary Movement) Amendment Rules, 2025',
        officialSourceURL: 'https://egazette.gov.in',
        issuingAuthority: 'MoEFCC, Government of India',
        dateOfIssue: '2025-07-01',
        effectiveDate: '2026-04-01',
        amendmentVersionDate: '2025-07-01',
        summaryOfRequirement: 'Same framework as for Aluminium and Copper. EPR for zinc scrap from 10% in 2026-27 to 75% in 2032-33. Zinc is used in galvanised steel components and die-cast automotive parts.',
        applicability: 'Yes — zinc used in galvanisation of steel automotive body panels and die-cast components',
        relevance: 'Producers, Manufacturers, Recyclers, Bulk Consumers',
        changeType: 'New',
        previousValue: 'No formal EPR for zinc scrap under this framework',
        currentValue: '10% EPR target from 2026-27, rising to 75% by 2032-33',
        lastVerified: '2026-03-31',
    },
    {
        key: '7',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation on Circularity Requirements for Vehicle Design and Management of End-of-Life Vehicles (Proposed ELV Regulation — replacing ELV Directive 2000/53/EC and 3R Type-Approval Directive 2005/64/EC)',
        targetYear: '~2031 (6 years after entry into force)',
        status: 'Official',
        material: 'Plastic',
        quantitativeTarget: 'Minimum 15% recycled plastic content in each new vehicle type within 6 years of entry into force (~2031); rising to 25% within 10 years (~2035). Of the 25%, a portion must be sourced from ELV-derived plastics (closed-loop / circular content).',
        officialSourceTitle: "European Parliament Press Release — 'Circular economy: deal on new EU rules for the automotive sector', 12 December 2025; Council of the EU Press Release, 12 December 2025",
        officialSourceURL: 'https://www.europarl.europa.eu/news/en/press-room/20251209IPR32114/circular-economy-deal-on-new-eu-rules-for-the-automotive-sector',
        issuingAuthority: 'European Parliament and Council of the European Union (provisional agreement reached 12 December 2025; pending formal adoption)',
        dateOfIssue: '2025-12-12 (provisional agreement)',
        effectiveDate: 'Pending formal adoption and publication in Official Journal (expected 2026); requirements phased 6 and 10 years after entry into force',
        amendmentVersionDate: 'Based on EC Proposal COM(2023) 451 of 13 July 2023; negotiated text agreed December 2025',
        summaryOfRequirement: 'New regulation replaces the ELV Directive (2000/53/EC) and the 3R Type-Approval Directive (2005/64/EC). Introduces: (1) minimum recycled plastic content in new vehicles (15% within 6 years, 25% within 10 years of entry into force); (2) EU-wide EPR system; (3) Circularity Vehicle Passport; (4) stricter rules on vehicle collection, treatment and ELV determination; (5) ban on export of non-roadworthy vehicles; (6) feasibility study for setting recycled content targets for steel, aluminium, magnesium, and critical raw materials (Commission must introduce these by delegated act within 2 years of entry into force). Expands coverage to trucks, buses, and motorcycles (previously excluded).',
        applicability: 'Yes — exclusively targets the automotive sector across entire vehicle lifecycle',
        relevance: 'OEMs, Importers, Authorised Treatment Facilities (ATFs), Recyclers, Dismantlers, Producers',
        changeType: 'New (replaces 2000 ELV Directive)',
        previousValue: 'ELV Directive 2000/53/EC: 85% reuse/recycling and 95% reuse/recovery by weight (no material-specific recycled content targets)',
        currentValue: '15% recycled plastic within ~6 years; 25% within ~10 years of entry into force. Steel/aluminium targets: delegated act to follow within 2 years.',
        lastVerified: '2026-03-31',
    },
    {
        key: '8',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation on Circularity Requirements for Vehicle Design and Management of End-of-Life Vehicles',
        targetYear: '~2035 (10 years after entry into force)',
        status: 'Official',
        material: 'Plastic',
        quantitativeTarget: 'Minimum 25% recycled plastic content in each new vehicle type within 10 years of entry into force (~2035), with a portion of that 25% required to come from ELV-sourced closed-loop material.',
        officialSourceTitle: 'European Parliament Press Release, 12 December 2025; Council of the EU Press Release, 12 December 2025',
        officialSourceURL: 'https://www.europarl.europa.eu/news/en/press-room/20251209IPR32114/circular-economy-deal-on-new-eu-rules-for-the-automotive-sector',
        issuingAuthority: 'European Parliament and Council of the EU',
        dateOfIssue: '2025-12-12 (provisional agreement)',
        effectiveDate: '~2035 (10 years after entry into force)',
        amendmentVersionDate: 'Same as above',
        summaryOfRequirement: '25% recycled plastic (with ELV-sourced closed-loop portion) required in new vehicles within 10 years of regulation entry into force. Calculation methodology for recycled content to be finalised by end of 2026 under the regulation.',
        applicability: 'Yes',
        relevance: 'OEMs, Importers, Suppliers, Recyclers',
        changeType: 'New',
        previousValue: 'No mandatory recycled plastic content under former ELV Directive',
        currentValue: '25% recycled plastic within ~10 years of entry into force',
        lastVerified: '2026-03-31',
    },
    {
        key: '9',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation on Circularity Requirements for Vehicle Design and Management of End-of-Life Vehicles',
        targetYear: 'TBD (within 2 years of entry into force, via delegated act)',
        status: 'Proposed',
        material: 'Steel',
        quantitativeTarget: "Target to be established by European Commission delegated act following completion of a feasibility study, within 2 years of the regulation's entry into force. No specific quantitative target adopted yet.",
        officialSourceTitle: 'Council of the EU Press Release, 12 December 2025',
        officialSourceURL: 'https://www.consilium.europa.eu/en/press/press-releases/2025/12/12/circular-economy-council-and-parliament-strike-deal-on-rules-for-vehicle-circularity-and-management-of-end-of-life-vehicles/',
        issuingAuthority: 'European Commission (delegated act authority); European Parliament and Council',
        dateOfIssue: '2025-12-12 (provisional agreement)',
        effectiveDate: 'TBD — delegated act to follow within 2 years of regulation entry into force',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: 'The regulation mandates the Commission to introduce recycled content targets for steel (and also aluminium, magnesium, and critical raw materials) via a delegated act. These targets must be preceded by a feasibility study and focus on post-consumer waste sources. No percentage thresholds are set in the primary text.',
        applicability: 'Yes',
        relevance: 'OEMs, Importers, Recyclers',
        changeType: 'New (obligation to set future target)',
        previousValue: 'No recycled steel content mandate under former ELV Directive',
        currentValue: 'Feasibility study + delegated act within 2 years of entry into force',
        lastVerified: '2026-03-31',
    },
    {
        key: '10',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation on Circularity Requirements for Vehicle Design and Management of End-of-Life Vehicles',
        targetYear: 'TBD (within 2 years of entry into force, via delegated act)',
        status: 'Proposed',
        material: 'Aluminium',
        quantitativeTarget: "Target to be established by European Commission delegated act following feasibility study, within 2 years of the regulation's entry into force. No specific quantitative target adopted yet.",
        officialSourceTitle: 'Council of the EU Press Release, 12 December 2025',
        officialSourceURL: 'https://www.consilium.europa.eu/en/press/press-releases/2025/12/12/circular-economy-council-and-parliament-strike-deal-on-rules-for-vehicle-circularity-and-management-of-end-of-life-vehicles/',
        issuingAuthority: 'European Commission (delegated act authority)',
        dateOfIssue: '2025-12-12 (provisional agreement)',
        effectiveDate: 'TBD',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: 'Commission to introduce recycled aluminium content targets by delegated act within 2 years of entry into force. Feasibility study required first.',
        applicability: "Yes — EU automotive sector is world's largest single consumer of aluminium (42% of total EU aluminium use)",
        relevance: 'OEMs, Importers, Suppliers',
        changeType: 'New (obligation to set future target)',
        previousValue: 'No recycled aluminium content mandate under former ELV Directive',
        currentValue: 'Feasibility study + delegated act within 2 years of entry into force',
        lastVerified: '2026-03-31',
    },
    {
        key: '11',
        countryRegion: 'Europe / EU',
        formalName: 'ELV Directive 2000/53/EC on End-of-Life Vehicles (currently in force; to be replaced by new ELV Regulation upon its formal adoption)',
        targetYear: 'Ongoing (targets already in force)',
        status: 'Implemented',
        material: 'Others',
        quantitativeTarget: 'Minimum 85% reuse and recycling (by weight per vehicle per year); minimum 95% reuse and recovery (by weight per vehicle per year). Restriction on use of lead, mercury, cadmium, and hexavalent chromium in new vehicles.',
        officialSourceTitle: 'Directive 2000/53/EC of the European Parliament and of the Council of 18 September 2000 on end-of-life vehicles (OJ L 269, 21.10.2000); EUR-Lex consolidated version',
        officialSourceURL: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=legissum:l21225',
        issuingAuthority: 'European Parliament and Council of the European Union',
        dateOfIssue: '2000-09-18',
        effectiveDate: '2002-01-01 (progressively phased; current targets fully applicable since 2015)',
        amendmentVersionDate: 'Amended by Directive (EU) 2018/849 (30 May 2018)',
        summaryOfRequirement: 'Framework ELV Directive: requires 85% reuse+recycling and 95% reuse+recovery by average weight per vehicle annually. Bans lead, mercury, cadmium, hexavalent chromium in new vehicles. Requires free take-back at end of life. Producers must provide dismantling information. Will be superseded by the new ELV Regulation once formally adopted and in force.',
        applicability: 'Yes — applies to passenger cars (M1 category) and light commercial vehicles (N1 category)',
        relevance: 'OEMs, Importers, ATFs, Recyclers, Dismantlers',
        changeType: 'No Change (currently in force; to be superseded by new Regulation)',
        previousValue: '85% recycling / 95% recovery targets (unchanged since 2015)',
        currentValue: '85% recycling / 95% recovery targets (same)',
        lastVerified: '2026-03-31',
    },
    {
        key: '12',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation (EU) 2023/1542 on Batteries and Waste Batteries (EU Battery Regulation)',
        targetYear: '2025',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'Recycling efficiency targets for waste batteries by 31 December 2025: 75% for lead-acid batteries; 65% for lithium-based batteries; 80% for nickel-cadmium batteries; 50% for other batteries. Methodology for calculating these rates adopted July 2025 (Delegated Act).',
        officialSourceTitle: 'Regulation (EU) 2023/1542 of the European Parliament and of the Council of 12 July 2023 on batteries and waste batteries (OJ L 191, 28.7.2023); Annex XII',
        officialSourceURL: 'https://eur-lex.europa.eu/EN/legal-content/summary/sustainability-rules-for-batteries-and-waste-batteries.html',
        issuingAuthority: 'European Parliament and Council of the EU; European Commission (delegated acts)',
        dateOfIssue: '2023-07-28',
        effectiveDate: '2023-08-18 (entered into force); applies from 2024-02-18; replaces Batteries Directive 2006/66/EC from 2025-08-18',
        amendmentVersionDate: 'Regulation (EU) 2025/1561 adopted 18 July 2025 (amending due diligence obligations); Delegated Act on recycling efficiency methodology adopted July 2025',
        summaryOfRequirement: 'Comprehensive regulation covering all batteries (EV, LMT, industrial, portable, SLI). Key automotive obligations: (1) Recycling efficiency targets by end-2025 (75% lead-acid, 65% Li-ion, 80% NiCd, 50% other); (2) Higher targets from end-2030 (80% lead-acid, 70% Li-ion); (3) Material recovery targets by end-2027: 50% lithium, 90% cobalt/copper/lead/nickel; (4) Minimum recycled content in batteries from August 2031: 16% cobalt, 85% lead, 6% lithium, 6% nickel — increasing to 26% cobalt, 85% lead, 12% lithium, 15% nickel by 2036; (5) Battery passport required from 18 February 2027 for EV/LMT/industrial batteries >2 kWh; (6) Due diligence on cobalt, natural graphite, lithium, nickel supply chains from August 2025.',
        applicability: 'Yes — EV batteries, LMT batteries, and SLI (starter/lighting/ignition) batteries directly relevant to automotive',
        relevance: 'OEMs, Battery Producers, Importers, Recyclers, Refurbishers, PROs',
        changeType: 'New (replaces 2006 Batteries Directive effective August 2025)',
        previousValue: 'Batteries Directive 2006/66/EC — lower recycling efficiency targets',
        currentValue: '65% recycling efficiency for Li-ion batteries by end-2025; full set of targets as described above',
        lastVerified: '2026-03-31',
    },
    {
        key: '13',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation (EU) 2023/1542 on Batteries and Waste Batteries — Recycled Content Requirements',
        targetYear: '2031',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'From 18 August 2031: minimum recycled content in EV, SLI, and specified industrial batteries: 16% cobalt, 85% lead, 6% lithium, 6% nickel (from battery manufacturing waste or post-consumer waste).',
        officialSourceTitle: 'Regulation (EU) 2023/1542, Article 8 and Annex on recycled content targets',
        officialSourceURL: 'https://eur-lex.europa.eu/EN/legal-content/summary/sustainability-rules-for-batteries-and-waste-batteries.html',
        issuingAuthority: 'European Parliament and Council of the EU',
        dateOfIssue: '2023-07-28',
        effectiveDate: '2031-08-18 (for recycled content mandate)',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: 'All EV, LMT and rechargeable industrial batteries (>2 kWh) placed on EU market must contain minimum recycled content: cobalt 16%, lead 85%, lithium 6%, nickel 6% from 2031. Targets rise further in 2036: cobalt 26%, lead 85%, lithium 12%, nickel 15%.',
        applicability: 'Yes — EV batteries are primary automotive relevance',
        relevance: 'Battery Producers, OEMs, Importers',
        changeType: 'New',
        previousValue: 'No mandatory recycled content for batteries under former Directive',
        currentValue: '16% Co, 85% Pb, 6% Li, 6% Ni recycled content from 2031; 26% Co, 85% Pb, 12% Li, 15% Ni from 2036',
        lastVerified: '2026-03-31',
    },
    {
        key: '14',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation (EU) 2023/1542 on Batteries and Waste Batteries — Material Recovery Targets',
        targetYear: '2027',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'By end of 2027: lithium recovery from waste batteries must reach 50%. By end of 2031: lithium recovery 80%. Copper, cobalt, lead, nickel: 90% recovery by end of 2027.',
        officialSourceTitle: 'Regulation (EU) 2023/1542, Article on recovery targets; IEA Policy Database',
        officialSourceURL: 'https://www.iea.org/policies/16763-eu-sustainable-batteries-regulation',
        issuingAuthority: 'European Parliament and Council of the EU',
        dateOfIssue: '2023-07-28',
        effectiveDate: '2027-12-31 (for first-phase recovery targets)',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: 'Material recovery requirements from recycling of waste batteries: lithium 50% by end-2027 (80% by end-2031); cobalt, copper, lead, nickel: 90% by end-2027. Methodology for calculating recovery rates adopted by EC delegated act July 2025.',
        applicability: 'Yes — directly relevant to EV battery value chain',
        relevance: 'Recyclers, Battery Producers, OEMs',
        changeType: 'New',
        previousValue: 'No lithium-specific recovery targets under former Batteries Directive',
        currentValue: 'Li: 50% by end-2027; Co/Cu/Pb/Ni: 90% by end-2027',
        lastVerified: '2026-03-31',
    },
    {
        key: 'eu-cbam-1',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation (EU) 2023/956 of the European Parliament and of the Council establishing a Carbon Border Adjustment Mechanism (CBAM) — Definitive Phase: Iron and Steel',
        targetYear: '2026 (Definitive Phase commences)',
        status: 'Implemented',
        material: 'Steel',
        quantitativeTarget: 'Importers of iron and steel products listed in Annex I (flat-rolled products, bars, rods, wire, tubes, pipes, and selected downstream articles) above the 50-tonne annual de minimis threshold must purchase and surrender CBAM certificates equal to verified embedded GHG emissions (tCO2e). Certificate price: weekly average EU ETS allowance auction price. Penalty for non-surrender: €100/tCO2e. Annual CBAM declaration with third-party verified embedded emissions due by 30 September each year. First certificate surrender: 30 September 2027 covering 2026 imports.',
        officialSourceTitle: 'Regulation (EU) 2023/956 of 10 May 2023, OJ L 130/52, 25.05.2023; as amended by Regulation (EU) 2025/2083 of 8 October 2025, OJ L published 17 October 2025 — EUR-Lex',
        officialSourceURL: 'https://eur-lex.europa.eu/EN/legal-content/summary/carbon-border-adjustment-mechanism.html',
        issuingAuthority: 'European Parliament and Council of the European Union; European Commission (implementing and delegated acts)',
        dateOfIssue: '2023-05-10',
        effectiveDate: '2026-01-01 (Definitive Phase; Transitional reporting-only phase: October 2023 – December 2025)',
        amendmentVersionDate: 'Regulation (EU) 2025/2083, entered into force 20 October 2025 (simplification amendments)',
        summaryOfRequirement: 'CBAM entered its Definitive Phase on 1 January 2026. During the completed Transitional Phase (Oct 2023–Dec 2025), importers were required to submit quarterly reports of embedded emissions with no financial obligation. From 1 January 2026: (1) Importers must hold Authorised CBAM Declarant status (application deadline: 31 March 2026); (2) Embedded emissions must be calculated per prescribed methodology (default values available); (3) CBAM certificates must be purchased and surrendered annually. Certificate sales commence 1 February 2027 for the 2026 import year. Direct and indirect emissions methodology applies to iron and steel. Iron and steel constitute approximately 65–70% of an average vehicle by weight; automotive steel producers and component manufacturers exporting to EU customers must provide embedded emissions declarations to their EU-side importers.',
        applicability: 'Yes — iron and steel are the primary structural materials in vehicle manufacturing; directly relevant to steel producers and automotive component exporters supplying EU-based customers',
        relevance: 'EU Importers (Authorised CBAM Declarants), Steel Producers and Exporters, Automotive Component Manufacturers exporting to EU',
        changeType: 'New (Definitive Phase commenced 1 January 2026)',
        previousValue: 'Transitional Phase Oct 2023–Dec 2025: quarterly embedded emissions reporting only; no certificate purchase required',
        currentValue: 'Definitive Phase from 1 Jan 2026: certificate purchase and surrender mandatory. First surrender: 30 September 2027 for 2026 imports. Price = weekly average EU ETS price. Penalty: €100/tCO2e.',
        lastVerified: '2026-03-31',
    },
    {
        key: 'eu-cbam-2',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation (EU) 2023/956 establishing a Carbon Border Adjustment Mechanism (CBAM) — Definitive Phase: Aluminium',
        targetYear: '2026 (Definitive Phase commences)',
        status: 'Implemented',
        material: 'Aluminium',
        quantitativeTarget: 'Importers of aluminium and aluminium products listed in Annex I (primary and secondary aluminium, alloys, wire, rods, bars, plates, sheets, foil, tubes, and selected articles) above the 50-tonne annual de minimis threshold must purchase and surrender CBAM certificates equal to verified embedded GHG emissions (tCO2e). For aluminium, both direct emissions and indirect emissions (electricity consumed in smelting and processing) are included in the embedded emissions calculation. Certificate price: weekly average EU ETS allowance auction price. Penalty for non-surrender: €100/tCO2e. Annual declaration due by 30 September; first surrender 30 September 2027 for 2026 imports.',
        officialSourceTitle: 'Regulation (EU) 2023/956 of 10 May 2023, OJ L 130/52, 25.05.2023; as amended by Regulation (EU) 2025/2083 of 8 October 2025 — EUR-Lex',
        officialSourceURL: 'https://eur-lex.europa.eu/EN/legal-content/summary/carbon-border-adjustment-mechanism.html',
        issuingAuthority: 'European Parliament and Council of the European Union; European Commission',
        dateOfIssue: '2023-05-10',
        effectiveDate: '2026-01-01 (Definitive Phase; Transitional phase: October 2023 – December 2025)',
        amendmentVersionDate: 'Regulation (EU) 2025/2083, entered into force 20 October 2025',
        summaryOfRequirement: "Same CBAM Definitive Phase framework as for iron and steel, applied to aluminium and aluminium articles in Annex I. Aluminium smelting is highly electricity-intensive; indirect (Scope 2) emissions from electricity use are included in embedded emissions calculation — a key difference from most other CBAM goods. Importers must be Authorised CBAM Declarants from 2026. The EU automotive industry is among the world's largest consumers of aluminium (approximately 42% of total EU aluminium use). Aluminium-intensive vehicle components (body panels, castings, wheels, heat exchangers) exported to EU customers trigger CBAM embedded emissions reporting and certificate obligations for EU-side importers.",
        applicability: 'Yes — aluminium constitutes 10–15% of modern vehicle weight and is rising with lightweighting trends; directly relevant to aluminium die-casters, body panel producers, and heat management component exporters to the EU',
        relevance: 'EU Importers (Authorised CBAM Declarants), Aluminium Producers and Exporters, Automotive Component Manufacturers exporting to EU',
        changeType: 'New (Definitive Phase commenced 1 January 2026)',
        previousValue: 'Transitional Phase Oct 2023–Dec 2025: quarterly embedded emissions reporting only; no certificate purchase required',
        currentValue: 'Definitive Phase from 1 Jan 2026: certificate purchase and surrender mandatory, including indirect electricity-based emissions. First surrender: 30 September 2027 for 2026 imports.',
        lastVerified: '2026-03-31',
    },
    {
        key: 'eu-cbam-3',
        countryRegion: 'Europe / EU',
        formalName: 'Regulation (EU) 2025/2083 of the European Parliament and of the Council of 8 October 2025 amending Regulation (EU) 2023/956 as regards simplifying and strengthening the Carbon Border Adjustment Mechanism',
        targetYear: '2026 (provisions effective from 1 January 2026; entered into force 20 October 2025)',
        status: 'Implemented',
        material: 'Steel',
        quantitativeTarget: 'Key amendments applicable from 1 January 2026: (1) Single mass-based de minimis threshold: importers bringing ≤50 tonnes cumulative net mass of CBAM goods per calendar year are fully exempt from all CBAM obligations; (2) Annual CBAM declaration deadline extended from 31 May to 30 September of the year following importation; (3) CBAM certificate sales commencement postponed from 1 January 2026 to 1 February 2027; (4) First certificate surrender deadline: 30 September 2027 covering 2026 imports; (5) Authorised CBAM Declarant application deadline: 31 March 2026; (6) Simplified default values for embedded emissions calculations.',
        officialSourceTitle: 'Regulation (EU) 2025/2083 of the European Parliament and of the Council of 8 October 2025 — Official Journal of the European Union, published 17 October 2025',
        officialSourceURL: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
        issuingAuthority: 'European Parliament and Council of the European Union',
        dateOfIssue: '2025-10-08',
        effectiveDate: '2025-10-20 (entered into force); operative provisions from 2026-01-01',
        amendmentVersionDate: '2025-10-08 (amends Regulation (EU) 2023/956)',
        summaryOfRequirement: 'The CBAM Simplification Regulation amends Regulation (EU) 2023/956 to reduce administrative burden without altering the fundamental certificate purchase and surrender obligation. Key automotive materials in scope remain iron, steel, and aluminium. A broader review of CBAM scope — potentially expanding coverage to downstream products including automotive components — was anticipated by the European Commission for early 2026. No scope expansion to downstream automotive products has been formally proposed as of this report date.',
        applicability: 'Yes — applies to all CBAM-covered materials including iron, steel, and aluminium used extensively in automotive manufacturing and component export to the EU',
        relevance: 'EU Importers (Authorised CBAM Declarants), Steel and Aluminium Producers and Exporters, Automotive Component Manufacturers exporting to EU',
        changeType: 'Updated (amendment to Regulation (EU) 2023/956)',
        previousValue: 'Regulation (EU) 2023/956 original: no de minimis threshold; annual declaration deadline 31 May; certificate sales from 1 January 2026; first surrender 31 May 2026',
        currentValue: '50-tonne annual de minimis exemption; declaration deadline extended to 30 September; certificate sales from 1 February 2027; first surrender 30 September 2027',
        lastVerified: '2026-03-31',
    },
    {
        key: '15',
        countryRegion: 'Japan',
        formalName: 'Act on Recycling, etc. of End-of-Life Vehicles (自動車リサイクル法) — Law No. 87 of 2002',
        targetYear: 'Ongoing (fully in force since 2005)',
        status: 'Implemented',
        material: 'Others',
        quantitativeTarget: "No single aggregate quantitative recovery target is stated in the law. The law mandates 100% collection and recycling/energy recovery of Automobile Shredder Residue (ASR) generated by scrapping. ASR comprises plastics, glass, rubber, non-ferrous metals. Manufacturers must calculate ASR weight per model and charge recycling fees accordingly. Japan's overall ELV material recycling rate is approximately 83.7%, with reuse/recycling/recovery at approximately 99.5% (2017 data, METI/MOE).",
        officialSourceTitle: 'Act on Recycling, etc. of End-of-Life Vehicles (Act No. 87 of July 2002) — Ministry of Economy, Trade and Industry (METI) and Ministry of the Environment (MOE)',
        officialSourceURL: 'https://www.meti.go.jp/policy/mono_info_service/mono/automobile/automobile_recycle/law_notice/pdf/english.pdf',
        issuingAuthority: 'Ministry of Economy, Trade and Industry (METI) and Ministry of the Environment (MOE), Government of Japan',
        dateOfIssue: '2002-07-01',
        effectiveDate: '2005-01-01 (fully operational)',
        amendmentVersionDate: 'Last significant amendment Act No. 50 of 2006',
        summaryOfRequirement: "Japan's primary ELV recycling law. Based on EPR: manufacturers/importers responsible for collecting and recycling/energy recovering three mandated items from ELVs: (1) Automobile Shredder Residue (ASR) — comprising plastics, glass, rubber, non-ferrous metals; (2) Airbags; (3) Fluorocarbons (CFCs/HFCs from air conditioning). Vehicle owners pay recycling fee at purchase. Fee is managed by Japan Automobile Recycling Promotion Center (JARC). Japan Auto Recycling Partnership (JARP) facilitates collective recycling for manufacturers. ASR recycling primarily via energy recovery (blast furnace methods). Law does not cover batteries separately — these handled under distinct frameworks.",
        applicability: 'Yes — exclusively automotive; applies to all vehicles including EVs (but EV batteries excluded from ASR scope — handled separately)',
        relevance: 'OEMs, Importers, Dismantlers, Shredding Operators, Fluorocarbon Collectors',
        changeType: 'No Change (law unchanged since 2006 amendment; continues in operation)',
        previousValue: 'Same framework since 2005',
        currentValue: 'Mandatory ASR + airbag + fluorocarbon collection and recycling/energy recovery by manufacturers; fee-based system at point of vehicle purchase',
        lastVerified: '2026-03-31',
    },
    {
        key: '16',
        countryRegion: 'Japan',
        formalName: 'Act on Recycling, etc. of End-of-Life Vehicles — Airbag Recycling Obligation',
        targetYear: 'Ongoing',
        status: 'Implemented',
        material: 'Others',
        quantitativeTarget: 'No explicit percentage target stated in law. All airbags from ELVs must be collected by dismantlers and delivered to automobile manufacturers for proper processing (activation or recycling).',
        officialSourceTitle: 'Act on Recycling, etc. of End-of-Life Vehicles (Act No. 87 of 2002); JARP Official Website',
        officialSourceURL: 'https://jarp.org/en/productslist/asr/',
        issuingAuthority: 'METI and MOE, Government of Japan; JARP (Japan Auto Recycling Partnership) as implementing body',
        dateOfIssue: '2002-07-01',
        effectiveDate: '2005-01-01',
        amendmentVersionDate: '2006',
        summaryOfRequirement: 'Airbags from ELVs must be removed by registered dismantlers using manufacturer-provided instructions and collective activation connectors. Delivered to auto manufacturers (via JARP) for safe activation or material recycling. All major Japanese manufacturers participate (Toyota, Honda, Nissan, Mazda, Subaru, Mitsubishi, Suzuki, Daihatsu, Isuzu, Hino, UD Trucks, and foreign brands Volvo, Mercedes-Benz, Jaguar Land Rover).',
        applicability: 'Yes',
        relevance: 'OEMs, Importers, Dismantlers',
        changeType: 'No Change',
        previousValue: 'Same obligation since 2005',
        currentValue: 'Mandatory airbag collection and delivery to manufacturers',
        lastVerified: '2026-03-31',
    },
    {
        key: '17',
        countryRegion: 'Japan',
        formalName: 'Planned Mandatory Battery Recycling Law for Small Electronics and Mobile Batteries (2026 Law — proposed by METI/MOE)',
        targetYear: '2026',
        status: 'Proposed',
        material: 'Battery',
        quantitativeTarget: 'No explicit quantitative target published yet. The law will mandate EPR-based collection and recycling for lithium-ion batteries in mobile devices (power banks, mobile phones, heated tobacco devices). Automotive EV battery recycling not yet covered by this specific law (currently under ELV Recycling Act framework).',
        officialSourceTitle: 'METI/MOE announcement on planned 2026 battery recycling law — as reported by Asahi Shimbun and Eco-Business (November 2025)',
        officialSourceURL: 'https://www.eco-business.com/news/japan-to-join-global-race-to-recycle-lithium-batteries-and-curb-e-waste-hazards/',
        issuingAuthority: 'Ministry of Economy, Trade and Industry (METI) and Ministry of the Environment (MOE), Government of Japan',
        dateOfIssue: '2025-11 (announced; full text not yet published)',
        effectiveDate: '2026-04-01 (planned; pending formal enactment)',
        amendmentVersionDate: 'N/A (new law)',
        summaryOfRequirement: "Japan is introducing a mandatory EPR law for lithium-ion batteries in small electronics and mobile devices from fiscal year 2026, driven by increasing fire incidents from improperly discarded batteries. From April 2026, recycling of Li-ion batteries in power banks, mobile phones, and heated tobacco devices will be compulsory. Linked to Japan's Green Transformation (GX) strategy. EV battery recycling for automotive remains principally under the 2002 ELV Recycling Act with JARP-managed collection.",
        applicability: 'Partial — directly targets small electronics batteries; indirect automotive relevance via EV battery critical minerals circularity; direct EV battery automotive obligation pending further legislation',
        relevance: 'Electronics Producers, Battery Manufacturers; future automotive relevance anticipated',
        changeType: 'New',
        previousValue: 'No mandatory EPR law for Li-ion batteries in small electronics in Japan',
        currentValue: 'Planned mandatory EPR law for mobile Li-ion batteries from April 2026',
        lastVerified: '2026-03-31',
    },
    {
        key: '18',
        countryRegion: 'Japan',
        formalName: 'METI EV Battery Carbon Footprint Reporting Requirement (FY 2024 — subsidy eligibility condition)',
        targetYear: '2024',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'No quantitative recycled content target set yet. Requirement is for EV manufacturers to calculate and report carbon dioxide emissions generated during battery production. Vehicles exceeding future emission caps will be ineligible for government EV subsidies.',
        officialSourceTitle: 'METI announcement on EV battery carbon footprint reporting plan (FY 2024)',
        officialSourceURL: 'https://www.meti.go.jp',
        issuingAuthority: 'Ministry of Economy, Trade and Industry (METI), Government of Japan',
        dateOfIssue: '2024',
        effectiveDate: '2024 (FY 2024 — for subsidy qualification reporting)',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: "EV manufacturers selling in Japan must calculate and report CO2 emissions from battery production (covering procurement, manufacturing, and end-of-life). Initially required for government subsidy eligibility disclosure. Future emission caps will render non-compliant batteries ineligible for subsidies. Japan is coordinating with EU to align battery carbon footprint standards. Links to METI Green Transformation (GX) strategy and Japan's 46% GHG reduction by 2030 target.",
        applicability: 'Yes — directly targets EV battery carbon footprint in the automotive sector',
        relevance: 'OEMs, Battery Producers, Importers',
        changeType: 'New',
        previousValue: 'No battery carbon footprint reporting requirement in Japan before FY2024',
        currentValue: 'Mandatory carbon footprint reporting for EV batteries from FY2024 for subsidy qualification; emission cap threshold TBD',
        lastVerified: '2026-03-31',
    },
    {
        key: 'th-1',
        countryRegion: 'Thailand',
        formalName: 'Hazardous Substance Act B.E. 2535 (1992) as amended by Hazardous Substance Act (No. 3) B.E. 2551 (2008) and Hazardous Substance Act (No. 4) B.E. 2562 (2019)',
        targetYear: 'Ongoing (latest amendment B.E. 2562 / 2019)',
        status: 'Implemented',
        material: 'Others',
        quantitativeTarget: 'No single quantitative recycling or recovery percentage target. Prescribes mandatory licensing (Type 3 and Type 4 classification), labelling, storage, transport, and disposal standards for hazardous substances. Lead-acid automotive batteries classified as Type 3 hazardous substance under Department of Industrial Works (DIW) responsibility: licence required for production, import, distribution, storage, use, and disposal. Automotive fluids (brake fluid, engine coolant, used engine oil, refrigerants) subject to prescribed disposal restrictions. Penalty for non-compliance: up to THB 200,000 fine and/or 2 years imprisonment under B.E. 2562 amendment.',
        officialSourceTitle: 'Hazardous Substance Act B.E. 2535 (1992) and amendments — Royal Gazette of Thailand; Department of Industrial Works (DIW), Ministry of Industry, Government of Thailand',
        officialSourceURL: 'https://www.jetro.go.jp/thailand/e_survey/hazardousact.html',
        issuingAuthority: 'Ministry of Industry (lead: Department of Industrial Works, DIW); jointly implemented with Ministry of Agriculture, Ministry of Public Health, Ministry of Natural Resources and Environment',
        dateOfIssue: '1992 (B.E. 2535)',
        effectiveDate: '1992; B.E. 2562 (2019) amendment currently in force',
        amendmentVersionDate: 'B.E. 2562 (2019) — introduced electronic licensing via DIW iHazard portal and strengthened import/export notification and penalties',
        summaryOfRequirement: "Thailand's primary legislation governing hazardous materials including those arising in automotive manufacturing and end-of-life vehicle processing. Classifies hazardous substances into four types. Lead-acid automotive batteries are Type 3, requiring DIW licence for all stages from production to disposal. All automotive manufacturers, importers, and dismantlers must comply with applicable licensing and disposal standards for vehicle-related hazardous materials. Electronic licensing via DIW's iHazard portal introduced under the 2019 amendment. Relevant to all vehicle manufacturers, ELV dismantlers, battery producers, and vehicle fluid handlers operating in Thailand.",
        applicability: 'Yes — explicitly covers lead-acid automotive batteries, automotive lubricants and brake fluids, coolants, refrigerants, and ELV-derived hazardous waste streams',
        relevance: 'Vehicle Manufacturers, Importers, Battery Producers, Automotive Dismantlers, Waste Management Operators, DIW-licensed Recyclers',
        changeType: 'No Change (framework in force since 1992; latest substantive amendment 2019)',
        previousValue: 'B.E. 2551 (2008) amendment: updated substance classifications and licensing categories',
        currentValue: 'B.E. 2562 (2019): electronic licensing via iHazard portal; strengthened enforcement; increased penalties up to THB 200,000',
        lastVerified: '2026-03-31',
    },
    {
        key: 'th-2',
        countryRegion: 'Thailand',
        formalName: 'Notification of the Ministry of Industry on Management of Waste or Unused Materials B.E. 2566 (2023) — Used Battery Management',
        targetYear: '2023 (in force)',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: 'No specific quantitative collection or recycling percentage target prescribed. Mandates that producers and importers of all battery types (lead-acid, lithium-ion, NiMH, NiCd, and all rechargeable battery types) establish and operate take-back schemes for end-of-life batteries. Recycling and disposal must be conducted exclusively at facilities licensed by the Department of Industrial Works (DIW). Annual reporting of collection volumes and disposal records to DIW required. Non-compliance may result in licence suspension or revocation under the Hazardous Substance Act.',
        officialSourceTitle: 'Notification of the Ministry of Industry on Management of Waste or Unused Materials B.E. 2566 (2023) — published in the Royal Gazette of Thailand, 31 May 2023; Ministry of Industry, Department of Industrial Works',
        officialSourceURL: 'https://www.nationthailand.com/business/automobile/40037853',
        issuingAuthority: 'Ministry of Industry, Government of Thailand; Department of Industrial Works (DIW)',
        dateOfIssue: '2023-05-31',
        effectiveDate: '2023-05-31',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: "Mandatory take-back and recycling obligation for battery producers and importers in Thailand. Applies to all battery types including automotive lead-acid starter batteries and EV lithium-ion battery packs. Take-back networks must be established by producers and importers; recycling must be performed at DIW-licensed facilities; annual returns on collection volumes are required. Note: Thailand's NESDC identified in November 2024 that this notification does not adequately address EV-specific battery risks (thermal runaway, hazardous material leaching, fire incidents) and has recommended a dedicated EV battery waste regulation. An upgraded regulatory framework is anticipated but had not been formally enacted as of this report date.",
        applicability: 'Yes — directly applicable to automotive battery producers, EV battery importers, and vehicle manufacturers distributing battery-powered vehicles in Thailand',
        relevance: 'Battery Producers and Importers, EV OEMs, Automotive Manufacturers, DIW-licensed Recyclers and Treatment Facilities',
        changeType: 'New',
        previousValue: 'No dedicated battery waste management notification in force prior to B.E. 2566',
        currentValue: 'Mandatory producer take-back and DIW-licensed recycling for all battery types from May 2023; annual reporting to DIW required',
        lastVerified: '2026-03-31',
    },
    {
        key: 'th-3',
        countryRegion: 'Thailand',
        formalName: 'Thai Industrial Standard TIS 2368-2564 — Electrical and Electronic Equipment That May Contain Hazardous Substances: Restriction of the Use of Certain Hazardous Substances (Thailand RoHS)',
        targetYear: 'B.E. 2564 (2021)',
        status: 'Implemented',
        material: 'Others',
        quantitativeTarget: 'Maximum concentration limits (homogeneous material basis, aligned with EU RoHS 2): Lead (Pb) ≤ 0.1% by weight; Mercury (Hg) ≤ 0.1%; Cadmium (Cd) ≤ 0.01%; Hexavalent Chromium (Cr(VI)) ≤ 0.1%; Polybrominated Biphenyls (PBB) ≤ 0.1%; Polybrominated Diphenyl Ethers (PBDE) ≤ 0.1%.',
        officialSourceTitle: 'Thai Industrial Standard TIS 2368-2564 — Thai Industrial Standards Institute (TISI), Ministry of Industry, Government of Thailand',
        officialSourceURL: 'https://enviliance.com/regions/southeast-asia/th',
        issuingAuthority: 'Thai Industrial Standards Institute (TISI), Ministry of Industry, Government of Thailand',
        dateOfIssue: 'B.E. 2564 (2021)',
        effectiveDate: 'B.E. 2564 (2021)',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: "Thailand's industrial standard restricting hazardous substances in electrical and electronic equipment, aligned with EU RoHS Directive 2011/65/EU. Restricts six substance groups (Pb, Hg, Cd, Cr(VI), PBB, PBDE) above defined concentration thresholds in homogeneous materials. Directly relevant to automotive electronics, EV battery management systems, infotainment units, sensors, and wiring harnesses. ⚠️ Applicability Note: TIS standards in Thailand may be either mandatory (compulsory) or voluntary. Whether TIS 2368-2564 is gazetted as a mandatory standard for automotive applications should be verified directly with TISI or the Department of Industrial Works. Application to vehicle sub-systems may differ from application to standalone EEE products.",
        applicability: 'Yes (with mandatory status to be confirmed) — automotive electronics, EV battery management systems, and vehicle electrical components are within the technical scope of this standard',
        relevance: 'Automotive Electronics Manufacturers, EV Component Producers, Vehicle Importers, Component Suppliers',
        changeType: 'No Change',
        previousValue: 'Earlier edition of TIS 2368 based on EU RoHS 1 substance list',
        currentValue: 'TIS 2368-2564: aligned with EU RoHS 2 (Directive 2011/65/EU); six restricted substances with defined concentration thresholds',
        lastVerified: '2026-03-31',
    },
    {
        key: 'th-4',
        countryRegion: 'Thailand',
        formalName: 'Board of Investment EV 3.5 Policy — Battery Electric Vehicle and Battery Production Incentive Conditions B.E. 2567 (2024–2027)',
        targetYear: '2024–2027',
        status: 'Implemented',
        material: 'Battery',
        quantitativeTarget: "Incentive conditions for BOI-promoted EV producers from 2026: (1) BEV excise duty reduced to 2% for qualifying producers; (2) Import duty concession on BEV CBU units applicable for 2024–2025 only — transition to CKD or locally assembled production required from 2026 to retain incentive eligibility; (3) Domestic production of battery modules or battery packs in Thailand required as condition for continued BOI privilege from 2026; (4) 8-year corporate income tax exemption and import duty exemption on machinery for BOI-promoted EV and battery manufacturing projects. Underpins Thailand's 30@30 national target: 30% of total domestic motor vehicle production to be zero-emission vehicles by 2030, targeting 725,000 BEV cars and 675,000 BEV motorcycles per year.",
        officialSourceTitle: 'Board of Investment of Thailand (BOI) EV 3.5 Announcement, January 2024; National EV Policy Committee Resolution B.E. 2567 — BOI Official Website',
        officialSourceURL: 'https://www.boi.go.th/un/boi_event_detail?module=news&topic_id=135055&language=en',
        issuingAuthority: 'Board of Investment of Thailand (BOI); National EV Policy Committee (chaired by Prime Minister of Thailand)',
        dateOfIssue: '2024-01',
        effectiveDate: '2024-01-01',
        amendmentVersionDate: 'N/A',
        summaryOfRequirement: "Thailand's 30@30 EV policy framework conditions future BOI incentive eligibility on domestic battery supply chains from 2026. While EV 3.5 is primarily an investment promotion policy, it has direct material compliance implications: (1) It drives investment in local battery cell, module, and pack manufacturing, creating battery waste streams governed by the Ministry of Industry B.E. 2566 notification; (2) Thailand's NESDC 2024 review identified the absence of EV battery end-of-life regulations as a critical gap in the 30@30 framework; (3) Future BOI conditions are expected to incorporate battery recyclability and second-life requirements as circularity eligibility criteria.",
        applicability: 'Yes — directly applicable to EV manufacturers and battery producers seeking BOI investment incentives in Thailand; indirect compliance driver for battery material management obligations',
        relevance: 'EV OEMs, Battery Manufacturers and Module Producers, BOI-registered Automotive Producers and Importers',
        changeType: 'New',
        previousValue: 'BOI EV 3.0 policy (2022–2023): consumer subsidies and import duty concessions without domestic battery production conditions',
        currentValue: 'EV 3.5 (2024–2027): domestic battery production required from 2026 for continued incentive eligibility; 2% BEV excise rate; 30@30 national target operative',
        lastVerified: '2026-03-31',
    },
    {
        key: 'th-5',
        countryRegion: 'Thailand',
        formalName: 'NESDC Policy Recommendations on EV Battery Waste Management Framework, Thailand — November 2024 [Proposed Regulatory Development]',
        targetYear: 'TBD (regulatory development stage)',
        status: 'Proposed',
        material: 'Battery',
        quantitativeTarget: 'No quantitative targets enacted. NESDC recommended in November 2024: (1) Dedicated EV battery waste regulation separate from the existing Ministry of Industry B.E. 2566 notification; (2) Mandatory producer take-back schemes with defined collection rate targets for EV batteries; (3) Minimum recycling efficiency requirements for lithium-ion EV batteries; (4) EV battery tracking registry from production through end-of-life; (5) Standards for second-life battery repurposing. No formal percentage thresholds have been gazetted.',
        officialSourceTitle: 'National Economic and Social Development Council (NESDC) — Recommendations on EV Battery Waste Management, November 2024; as published by NESDC and Nation Thailand',
        officialSourceURL: 'https://www.nationthailand.com/news/general/40043753',
        issuingAuthority: 'National Economic and Social Development Council (NESDC), Government of Thailand — policy advisory and planning body',
        dateOfIssue: '2024-11',
        effectiveDate: 'TBD — pending formal regulatory drafting, stakeholder consultation, and Royal Gazette notification',
        amendmentVersionDate: 'N/A (recommendation stage; no gazette notification issued)',
        summaryOfRequirement: "Thailand's NESDC issued formal policy recommendations in November 2024 calling for urgent dedicated EV battery waste regulation, citing rising fire and contamination risks from improperly discarded lithium-ion batteries as EV adoption accelerates under the 30@30 policy. The NESDC identified that the existing Ministry of Industry notification (B.E. 2566) does not adequately address EV battery-specific characteristics (high energy density, thermal runaway risk, hazardous cathode chemistry). As of this report date, no formal bill or Royal Gazette notification implementing these recommendations has been confirmed. ⚠️ This entry represents a regulatory gap and anticipated future obligation, not a currently enacted mandate.",
        applicability: 'Yes — directly targets EV battery end-of-life in the Thai automotive market; critical for EV OEMs and battery importers building Thailand operations under the 30@30 framework',
        relevance: 'EV OEMs, Battery Importers and Producers, EV Battery Recyclers, Ministry of Industry, Ministry of Natural Resources and Environment',
        changeType: 'New (regulatory gap identification — no prior proposed EV battery waste framework in Thailand)',
        previousValue: 'No dedicated proposed EV battery waste framework in Thailand prior to NESDC November 2024 report',
        currentValue: 'NESDC recommendations issued November 2024; formal regulatory drafting not confirmed as of report date',
        lastVerified: '2026-03-31',
    },
];

const ComplianceOverview = ({ data }: ComplianceOverviewProps) => {
    const [selectedModel, setSelectedModel] = useState<ModelComplianceData | null>(null);
    const [partFilterMaterial, setPartFilterMaterial] = useState<string | null>(null);
    const [partFilterModel, setPartFilterModel] = useState<string | null>(null);

    // Fleet Stats Cards
    const renderStatCard = (stat: ComplianceStat) => {
        let color = 'text-gray-500';
        let bgColor = 'bg-gray-50';
        let Icon = Car;

        switch (stat.status) {
            case 'success':
                color = 'text-emerald-600';
                bgColor = 'bg-emerald-50';
                Icon = CheckCircle;
                break;
            case 'warning':
                color = 'text-amber-600';
                bgColor = 'bg-amber-50';
                Icon = AlertTriangle;
                break;
            case 'error':
                color = 'text-red-600';
                bgColor = 'bg-red-50';
                Icon = AlertTriangle;
                break;
            case 'neutral':
                if (stat.icon === 'calendar') Icon = Calendar;
                color = 'text-blue-600';
                bgColor = 'bg-blue-50';
                break;
        }

        // Custom rendering for "Active Models" to show split
        if (stat.label === 'Active Models') {
            // Calculate split based on data.models
            const domestic = data.models.filter(m => m.targetMarket === 'Domestic').length;
            const exports = data.models.filter(m => m.targetMarket === 'Export').length;

            return (
                <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-start justify-between">
                        <div>
                            <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">{stat.label}</Text>
                            <div className={`text-2xl font-bold mt-1 ${color}`}>{stat.value}</div>
                            <div className="flex gap-3 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase">Domestic</span>
                                    <span className="text-sm font-semibold text-gray-700">{domestic}</span>
                                </div>
                                <div className="w-px bg-gray-200 h-8 self-center"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase">Export</span>
                                    <span className="text-sm font-semibold text-gray-700">{exports}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`p-2 rounded-lg ${bgColor}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                    </div>
                </Card>
            );
        }

        return (
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">{stat.label}</Text>
                        <div className={`text-2xl font-bold mt-1 ${color}`}>{stat.value}</div>
                        {stat.subValue && <Text type="secondary" className="text-xs mt-1 block">{stat.subValue}</Text>}
                    </div>
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
            </Card>
        );
    };

    // Regulatory Landscape Columns
    const regulatoryLandscapeColumns = [
        {
            title: 'Country/Region',
            dataIndex: 'countryRegion',
            key: 'countryRegion',
            width: 120,
            render: (text: string) => {
                const colorMap: Record<string, string> = {
                    'Europe / EU': 'blue',
                    'Japan': 'geekblue',
                    'India': 'green',
                    'Thailand': 'volcano',
                };
                return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
            },
        },
        {
            title: 'Formal Name of Compliance/Mandate',
            dataIndex: 'formalName',
            key: 'formalName',
            width: 280,
            render: (text: string) => <span className="text-xs text-gray-800">{text}</span>,
        },
        {
            title: 'Target Year',
            dataIndex: 'targetYear',
            key: 'targetYear',
            width: 160,
            render: (text: string) => <span className="text-xs font-medium text-gray-700">{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    'Implemented': 'success',
                    'Official': 'processing',
                    'Proposed': 'warning',
                };
                return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
            },
        },
        {
            title: 'Material',
            dataIndex: 'material',
            key: 'material',
            width: 100,
            render: (material: string) => {
                const colorMap: Record<string, string> = {
                    'Steel': 'default',
                    'Battery': 'volcano',
                    'Aluminium': 'cyan',
                    'Copper': 'gold',
                    'Zinc': 'purple',
                    'Plastic': 'geekblue',
                    'Others': 'default',
                };
                return <Tag color={colorMap[material] || 'default'}>{material}</Tag>;
            },
        },
        {
            title: 'Quantitative Target',
            dataIndex: 'quantitativeTarget',
            key: 'quantitativeTarget',
            width: 300,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Official Source',
            key: 'officialSource',
            width: 220,
            render: (_: any, record: any) => (
                <a href={record.officialSourceURL} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    {record.officialSourceTitle}
                </a>
            ),
        },
        {
            title: 'Issuing Authority',
            dataIndex: 'issuingAuthority',
            key: 'issuingAuthority',
            width: 220,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Date of Issue / Publication',
            dataIndex: 'dateOfIssue',
            key: 'dateOfIssue',
            width: 140,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Effective Date',
            dataIndex: 'effectiveDate',
            key: 'effectiveDate',
            width: 220,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Amendment / Version Date',
            dataIndex: 'amendmentVersionDate',
            key: 'amendmentVersionDate',
            width: 200,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Summary of Requirement',
            dataIndex: 'summaryOfRequirement',
            key: 'summaryOfRequirement',
            width: 360,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Applicability to Automobile Sector',
            dataIndex: 'applicability',
            key: 'applicability',
            width: 200,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'OEM / Recycler / Producer / Importer / RVSF / Supplier Relevance',
            dataIndex: 'relevance',
            key: 'relevance',
            width: 220,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Change Type',
            dataIndex: 'changeType',
            key: 'changeType',
            width: 180,
            render: (text: string) => {
                let dotColor = '#d9d9d9';
                if (text.startsWith('New')) dotColor = '#52c41a';
                else if (text.startsWith('Updated')) dotColor = '#fa8c16';
                return (
                    <div className="flex items-start gap-1 text-xs text-gray-700 whitespace-normal break-words">
                        <span style={{ color: dotColor, fontSize: 16, lineHeight: '16px', flexShrink: 0 }}>●</span>
                        <span>{text}</span>
                    </div>
                );
            },
        },
        {
            title: 'Previous Value',
            dataIndex: 'previousValue',
            key: 'previousValue',
            width: 220,
            render: (text: string) => <span className="text-xs text-gray-700">{text}</span>,
        },
        {
            title: 'Current Value',
            dataIndex: 'currentValue',
            key: 'currentValue',
            width: 260,
            render: (text: string) => <span className="text-xs font-medium text-gray-800">{text}</span>,
        },
        {
            title: 'Last Verified',
            dataIndex: 'lastVerified',
            key: 'lastVerified',
            width: 110,
            render: (text: string) => <span className="text-xs text-gray-500">{text}</span>,
        },
    ];

    // Vehicle Compliance Table Columns (CBAM)
    const modelColumns = [
        {
            title: 'Model',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string, record: ModelComplianceData) => (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-7 rounded shadow-sm bg-gray-100 overflow-hidden">
                        <img src={record.image} alt={text} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-700 text-xs">{text}</div>
                        <Tag className="text-[10px] m-0">{record.type}</Tag>
                    </div>
                </div>
            ),
        },
        {
            title: 'Total Parts',
            dataIndex: 'partCountTotal',
            key: 'partCountTotal',
            width: 80,
            render: (val: number) => <span className="font-semibold">{val}</span>
        },
        {
            title: 'Steel/Iron Parts',
            key: 'steelParts',
            width: 120,
            render: (_: any, record: ModelComplianceData) => (
                <div className="text-xs">
                    <Tag color="default">{record.compliantPartCountSteel}/{record.partCountSteel}</Tag>
                </div>
            )
        },
        {
            title: 'Al Parts',
            key: 'alParts',
            width: 100,
            render: (_: any, record: ModelComplianceData) => (
                <div className="text-xs">
                    <Tag color="default">{record.compliantPartCountAl}/{record.partCountAl}</Tag>
                </div>
            )
        },
        {
            title: 'Exp. Count',
            dataIndex: 'exportVehicleCount',
            key: 'exportVehicleCount',
            width: 90,
            render: (val: number) => <span className="font-semibold text-xs">{val?.toLocaleString()}</span>
        },
        {
            title: 'Volume Ratio (Steel)',
            key: 'volSteel',
            width: 140,
            render: (_: any, record: ModelComplianceData) => {
                const pct = (record.volumePartCompliantSteel / record.volumePartCountSteel * 100);
                return (
                    <div className="text-xs">
                        <div>{(record.volumePartCompliantSteel / 1000).toFixed(0)}k / {(record.volumePartCountSteel / 1000).toFixed(0)}k</div>
                        <Progress percent={pct} size="small" showInfo={false} strokeColor={pct >= 90 ? '#10b981' : '#f59e0b'} />
                    </div>
                );
            }
        },
        {
            title: 'Volume Ratio (Al)',
            key: 'volAl',
            width: 130,
            render: (_: any, record: ModelComplianceData) => {
                const pct = (record.volumePartCompliantAl / record.volumePartCountAl * 100);
                return (
                    <div className="text-xs">
                        <div>{(record.volumePartCompliantAl / 1000).toFixed(0)}k / {(record.volumePartCountAl / 1000).toFixed(0)}k</div>
                        <Progress percent={pct} size="small" showInfo={false} strokeColor={pct >= 90 ? '#10b981' : '#f59e0b'} />
                    </div>
                );
            }
        },
        {
            title: 'CBAM Readiness',
            dataIndex: 'cbamReadiness',
            key: 'cbamReadiness',
            width: 100,
            render: (val: number) => (
                <div className="w-16">
                    <Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} />
                    <div className="text-xs text-right mt-0.5">{val}%</div>
                </div>
            )
        },
        {
            title: 'Calculation',
            dataIndex: 'cbamCalculation',
            key: 'cbamCalculation',
            width: 120,
            render: (text: string) => <Tag color="blue" className="text-[10px]">{text}</Tag>
        },
        {
            title: 'CBAM Amount',
            dataIndex: 'cbamAmount',
            key: 'cbamAmount',
            width: 100,
            render: (val: number) => <span className="font-mono text-xs text-gray-700">€{val?.toLocaleString()}</span>
        },
        {
            title: 'Reduction (Data)',
            dataIndex: 'reductionDataMgmt',
            key: 'reductionDataMgmt',
            width: 100,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span>
        },
        {
            title: 'Reduction (Sust.)',
            dataIndex: 'reductionSustainable',
            key: 'reductionSustainable',
            width: 100,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span>
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_: any, record: ModelComplianceData) => (
                <Button size="small" type="link" onClick={() => setSelectedModel(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    // Part Wise Compliance Logic
    const filteredParts = useMemo(() => {
        return data.parts.filter(part => {
            const matchesMaterial = partFilterMaterial ? part.material === partFilterMaterial : true;
            const matchesModel = partFilterModel ? part.modelIds.includes(partFilterModel) : true;
            return matchesMaterial && matchesModel;
        });
    }, [data.parts, partFilterMaterial, partFilterModel]);
    const [cbamModelFilter, setCbamModelFilter] = useState<string>('All');

    // --- EPR Recovery Logic ---
    const [eprRecoveryMaterialFilter, setEprRecoveryMaterialFilter] = useState<string>('All');
    const [eprRecoveryModelFilter, setEprRecoveryModelFilter] = useState<string>('All');

    const filteredEprRecoveryParts = useMemo(() => {
        return data.eprRecoveryParts.filter(part => {
            const matchesMaterial = eprRecoveryMaterialFilter === 'All' || part.material === eprRecoveryMaterialFilter;
            const matchesModel = eprRecoveryModelFilter === 'All' || part.modelIds.includes(eprRecoveryModelFilter);
            return matchesMaterial && matchesModel;
        });
    }, [eprRecoveryMaterialFilter, eprRecoveryModelFilter, data.eprRecoveryParts]);

    const eprRecoveryStats = useMemo(() => {
        const total = filteredEprRecoveryParts.length;
        const compliant = filteredEprRecoveryParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredEprRecoveryParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredEprRecoveryParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredEprRecoveryParts]);


    // --- EPR Recycling Logic ---
    const [eprRecyclingMaterialFilter, setEprRecyclingMaterialFilter] = useState<string>('All');
    const [eprRecyclingModelFilter, setEprRecyclingModelFilter] = useState<string>('All');

    const filteredEprRecyclingParts = useMemo(() => {
        return data.eprRecyclingParts.filter(part => {
            const matchesMaterial = eprRecyclingMaterialFilter === 'All' || part.material === eprRecyclingMaterialFilter;
            const matchesModel = eprRecyclingModelFilter === 'All' || part.modelIds.includes(eprRecyclingModelFilter);
            return matchesMaterial && matchesModel;
        });
    }, [eprRecyclingMaterialFilter, eprRecyclingModelFilter, data.eprRecyclingParts]);

    const eprRecyclingStats = useMemo(() => {
        const total = filteredEprRecyclingParts.length;
        const compliant = filteredEprRecyclingParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredEprRecyclingParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredEprRecyclingParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredEprRecyclingParts]);

    // Common Render for EPR Parts
    const eprPartColumns = (type: 'Recovery' | 'Recycling') => [
        {
            title: 'Part Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (text: string) => <span className="font-medium text-gray-700 text-xs">{text}</span>
        },
        {
            title: 'Part ID',
            dataIndex: 'partId',
            key: 'partId',
            width: 100,
            render: (text: string) => <span className="font-mono text-[11px] text-gray-500">{text || 'N/A'}</span>
        },
        {
            title: 'Material / Grade',
            key: 'material',
            width: 130,
            render: (_: any, record: EPRPartData) => (
                <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-xs">{record.material}</span>
                    <span className="text-[10px] text-gray-500">{record.grade}</span>
                </div>
            )
        },
        {
            title: type === 'Recovery' ? 'Recovery Rate' : 'Recycling Rate',
            dataIndex: 'rate',
            key: 'rate',
            width: 120,
            render: (val: number, record: EPRPartData) => (
                <div>
                    <div className="font-semibold text-gray-800 text-xs">{val}%</div>
                    <div className="text-[10px] text-gray-500">
                        Target: <span className="font-medium">{record.benchmark}%</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Exp. Qty',
            dataIndex: 'exportQty',
            key: 'exportQty',
            width: 80,
            render: (val: number) => <span className="text-gray-700 text-xs">{val?.toLocaleString() || '-'}</span>
        },
        {
            title: 'Readiness',
            dataIndex: 'cbamReadiness',
            key: 'cbamReadiness',
            width: 90,
            render: (val: number) => (
                <div className="w-16">
                    <Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} />
                    <div className="text-[10px] text-right mt-0.5">{val ?? '-'}%</div>
                </div>
            )
        },
        {
            title: 'Calculation',
            dataIndex: 'cbamCalculation',
            key: 'cbamCalculation',
            width: 110,
            render: (text: string) => <Tag color="blue" className="text-[10px]">{text || '-'}</Tag>
        },
        {
            title: 'Amount',
            dataIndex: 'cbamAmount',
            key: 'cbamAmount',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-gray-700">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Red. (Data)',
            dataIndex: 'reductionDataMgmt',
            key: 'reductionDataMgmt',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Red. (Sust.)',
            dataIndex: 'reductionSustainable',
            key: 'reductionSustainable',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Action',
            key: 'action',
            width: 90,
            render: (_: any, record: EPRPartData) => (
                <Button type="text" size="small" className="text-blue-600" onClick={() => {
                    Modal.confirm({
                        title: 'Raise Issue Ticket',
                        content: (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Create an Issue Management ticket for <strong>{record.name}</strong> ({record.partId})?</p>
                                <p className="mt-1 text-xs text-gray-500">Material: {record.material} | Rate: {record.rate}% (Target: {record.benchmark}%)</p>
                            </div>
                        ),
                        okText: 'Create Ticket',
                        okButtonProps: { className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' },
                        onOk: () => { notification.success({ message: 'Issue Ticket Created', description: `Ticket raised for ${record.name} (${record.partId}).`, placement: 'topRight' }); },
                    });
                }}>
                    Raise Issue
                </Button>
            )
        }
    ];

    const cbamStats = useMemo(() => {
        const total = filteredParts.length;
        const compliant = filteredParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredParts]);

    const partStats = useMemo(() => {
        const total = filteredParts.length;
        const compliant = filteredParts.filter(p => p.status === 'Compliant').length;
        const nonCompliant = filteredParts.filter(p => p.status === 'Non-Compliant').length;
        const warning = filteredParts.filter(p => p.status === 'Warning').length;
        return { total, compliant, nonCompliant, warning };
    }, [filteredParts]);

    const partColumns = [
        {
            title: 'Part Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (text: string, record: PartComplianceData) => (
                <div>
                    <div className="font-medium text-gray-800 text-xs">{text}</div>
                    <div className="text-[10px] text-gray-500">{record.supplier}</div>
                </div>
            ),
        },
        {
            title: 'Part No.',
            dataIndex: 'partId',
            key: 'partId',
            width: 100,
            render: (text: string) => <span className="font-mono text-[11px] text-gray-500">{text || 'N/A'}</span>
        },
        {
            title: 'Total Count',
            dataIndex: 'exportQty',
            key: 'exportQty',
            width: 90,
            render: (val: number) => <span className="text-gray-700 text-xs font-semibold">{val?.toLocaleString() || '-'}</span>
        },
        {
            title: 'Material / Grade',
            key: 'material',
            width: 130,
            render: (_: any, record: PartComplianceData) => (
                <div>
                    <Tag className="mr-0 mb-1 text-[10px]">{record.material}</Tag>
                    <div className="text-[10px] text-gray-500">{record.grade}</div>
                </div>
            )
        },
        {
            title: 'CBAM Readiness',
            dataIndex: 'cbamReadiness',
            key: 'cbamReadiness',
            width: 100,
            render: (val: number) => {
                if (val === undefined) return <span className="text-gray-400">-</span>;
                return (
                    <div className="w-16">
                        <Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} />
                        <div className="text-[10px] text-right mt-0.5">{val}%</div>
                    </div>
                );
            }
        },
        {
            title: 'Calculation',
            dataIndex: 'cbamCalculation',
            key: 'cbamCalculation',
            width: 110,
            render: (val: string) => val ? <Tag color="blue" className="text-[10px]">{val}</Tag> : <span className="text-gray-400">-</span>
        },
        {
            title: 'CBAM Amount',
            dataIndex: 'cbamAmount',
            key: 'cbamAmount',
            width: 100,
            render: (val: number) => val ? <span className="font-mono text-xs">€{val.toLocaleString()}</span> : <span className="text-gray-400">-</span>
        },
        {
            title: 'Red. (Data)',
            dataIndex: 'reductionDataMgmt',
            key: 'reductionDataMgmt',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Red. (Sust.)',
            dataIndex: 'reductionSustainable',
            key: 'reductionSustainable',
            width: 90,
            render: (val: number) => <span className="font-mono text-xs text-emerald-600">{val ? `€${val.toLocaleString()}` : '-'}</span>
        },
        {
            title: 'Action',
            key: 'action',
            width: 90,
            render: (_: any, record: PartComplianceData) => (
                <Button type="text" size="small" className="text-blue-600" onClick={() => {
                    Modal.confirm({
                        title: 'Raise Issue Ticket',
                        content: (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Create an Issue Management ticket for <strong>{record.name}</strong> ({record.partId})?</p>
                                <p className="mt-1 text-xs text-gray-500">Material: {record.material} | Grade: {record.grade}</p>
                            </div>
                        ),
                        okText: 'Create Ticket',
                        okButtonProps: { className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' },
                        onOk: () => { notification.success({ message: 'Issue Ticket Created', description: `Ticket raised for ${record.name} (${record.partId}).`, placement: 'topRight' }); },
                    });
                }}>
                    Raise Issue
                </Button>
            )
        }
    ];


    return (
        <div className="space-y-8 animate-fade-in pb-12 overflow-x-hidden">
            {/* 1. Fleet Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map((stat, idx) => (
                    <div key={idx}>{renderStatCard(stat)}</div>
                ))}
            </div>

            {/* 2. Regulatory Landscape */}
            <Card title="Regulatory Landscape" className="shadow-sm border-gray-200" headStyle={{ borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <Table
                        dataSource={regulatoryLandscapeData}
                        columns={regulatoryLandscapeColumns}
                        pagination={false}
                        size="small"
                        rowKey="key"
                        scroll={{ x: 3300 }}
                    />
                </div>
            </Card>

            {/* 3. CBAM Context & Education */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-900 mb-3">EU Carbon Border Adjustment Mechanism (CBAM)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                                <h4 className="text-sm font-bold text-purple-800 mb-2">Phase 1 — Transitional (Oct 2023 – Dec 2025)</h4>
                                <p className="text-xs text-purple-700 leading-relaxed">
                                    Reporting-only phase. EU importers must report embedded emissions quarterly for covered goods: <strong>Cement, Iron & Steel, Aluminium, Fertilisers, Electricity, Hydrogen</strong>. No financial obligations yet.
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                                <h4 className="text-sm font-bold text-purple-800 mb-2">Phase 2 — Financial (Jan 2026 – Dec 2027)</h4>
                                <p className="text-xs text-purple-700 leading-relaxed">
                                    EU importers must purchase <strong>CBAM certificates</strong> based on embedded emissions exceeding EU ETS benchmarks. Free allowances phase out gradually. Applies to raw materials and basic processed goods.
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                            <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Jan 2028 Onwards — Automotive Components
                            </h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                CBAM scope extends to <strong>downstream products including automotive components</strong> containing CBAM-covered materials (Steel, Aluminium, Iron). OEMs exporting vehicles with these parts to the EU must ensure complete emissions data traceability. By translation, <strong>any OEM using these parts in EU-bound vehicles becomes liable</strong> for CBAM certificate costs.
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                            <h4 className="text-sm font-bold text-purple-800 mb-2">Quantitative Targets (EU Benchmarks)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">≤ 1.9</div>
                                    <div className="text-[10px] text-purple-600">tCO2e/t — Steel</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">≤ 4.2</div>
                                    <div className="text-[10px] text-purple-600">tCO2e/t — Aluminium</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">≤ 1.5</div>
                                    <div className="text-[10px] text-purple-600">tCO2e/t — Iron</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-900">€93</div>
                                    <div className="text-[10px] text-purple-600">avg/tCO2e — ETS Price</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <Tag color="purple" className="px-3 py-1 text-sm">Current Phase: Transitional</Tag>
                            <Tag color="orange" className="px-3 py-1 text-sm">Financial Phase: Jan 2026</Tag>
                            <Tag color="red" className="px-3 py-1 text-sm">Auto Components: Jan 2028</Tag>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Vehicle Wise CBAM Compliance */}
            <Card
                title={<div className="flex items-center gap-2"><Car className="w-4 h-4" /> Vehicle Wise CBAM Compliance</div>}
                className="shadow-sm border-gray-200"
                headStyle={{ borderBottom: '1px solid #f0f0f0' }}
            >
                {/* Vehicle Mini Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                        <div className="text-xs text-gray-500 uppercase font-semibold">Total Models</div>
                        <div className="text-xl font-bold text-gray-800">{data.models.length}</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                        <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                        <div className="text-xl font-bold text-emerald-700">{data.models.filter(m => m.cbamReadiness >= 90).length}</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-100">
                        <div className="text-xs text-amber-600 uppercase font-semibold">At Risk</div>
                        <div className="text-xl font-bold text-amber-700">{data.models.filter(m => m.cbamReadiness < 90).length}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded border border-purple-100">
                        <div className="text-xs text-purple-600 uppercase font-semibold">Total CBAM Liability</div>
                        <div className="text-xl font-bold text-purple-700">€{data.models.reduce((s, m) => s + m.cbamAmount, 0).toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <Table
                        dataSource={data.models}
                        columns={modelColumns}
                        pagination={false}
                        size="small"
                        rowKey="id"
                        scroll={{ x: 1800 }}
                    />
                </div>
            </Card>

            {/* 5. Part Wise CBAM Compliance */}
            <Card
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pr-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Part Wise CBAM Compliance
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                placeholder="Filter by Material"
                                allowClear
                                style={{ width: 160 }}
                                onChange={(val) => setPartFilterMaterial(val || 'All')}
                            >
                                <Option value="All">All Materials</Option>
                                <Option value="Steel">Steel</Option>
                                <Option value="Aluminum">Aluminum</Option>
                                <Option value="Cast Iron">Cast Iron</Option>
                                <Option value="Plastic">Plastic</Option>
                            </Select>
                            <Select
                                placeholder="Filter by Model"
                                allowClear
                                style={{ width: 160 }}
                                onChange={(val) => setPartFilterModel(val || 'All')}
                            >
                                <Option value="All">All Models</Option>
                                <Option value="evitara">eVitara</Option>
                                <Option value="fronx">Fronx</Option>
                                <Option value="baleno">Baleno</Option>
                            </Select>
                        </div>
                    </div>
                }
                className="shadow-sm border-gray-200"
                headStyle={{ borderBottom: '1px solid #f0f0f0' }}
            >
                {/* Summary Stats for Parts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                        <div className="text-xs text-gray-500 uppercase font-semibold">Total Parts</div>
                        <div className="text-xl font-bold text-gray-800">{partStats.total}</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                        <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                        <div className="text-xl font-bold text-emerald-700">{partStats.compliant}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-100">
                        <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                        <div className="text-xl font-bold text-red-700">{partStats.nonCompliant}</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-100">
                        <div className="text-xs text-amber-600 uppercase font-semibold">Warnings</div>
                        <div className="text-xl font-bold text-amber-700">{partStats.warning}</div>
                    </div>
                </div>

                <Table
                    dataSource={filteredParts}
                    columns={partColumns}
                    pagination={{ pageSize: 8 }}
                    size="small"
                    rowKey="id"
                />
            </Card>

            {/* --- SECTION 3: EPR (RECOVERY) COMPLIANCE --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Recycle className="w-6 h-6 text-blue-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">EPR (Recovery) Compliance</h3>
                </div>

                {/* 3.1 Recovery Context */}
                <Card className="bg-blue-50 border-blue-100 shadow-sm rounded-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-3">
                                <Info className="w-5 h-5" /> EPR Recovery — Energy Recovery + Recycling
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Recoverability</strong> refers to the potential to recover energy from waste (incineration with energy recovery) PLUS material recycling. Under ELV Directive & AIS-129, vehicles must achieve a minimum <strong>95% Recoverability Rate</strong> by weight.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-800 mb-1">ELV Steel Recovery (EPR)</h5>
                                    <p className="text-[11px] text-blue-700">8% (2025-30) → 13% (2030-35) → 18% (2035+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-800 mb-1">Battery Waste Collection</h5>
                                    <p className="text-[11px] text-blue-700">Lead Acid: 90% (2026+) | Li-Ion: 70% (2029+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-800 mb-1">Plastic Waste Collection</h5>
                                    <p className="text-[11px] text-blue-700">Cat I: 80% (2027+) | Cat II/III: 60% (2027+)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3.2 Vehicle Wise Recovery */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-600" /> Vehicle Wise Recovery Status
                        </h4>
                    </div>

                    {/* Vehicle Mini Cards */}
                    {(() => {
                        const legacyModels = data.models.filter(m => m.generation === 'Legacy');
                        return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Models</div>
                                    <div className="text-xl font-bold text-gray-800">{legacyModels.length}</div>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                    <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                    <div className="text-xl font-bold text-emerald-700">{legacyModels.filter(m => m.eprRecovery?.status === 'Compliant').length}</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                    <div className="text-xs text-amber-600 uppercase font-semibold">Warning</div>
                                    <div className="text-xl font-bold text-amber-700">{legacyModels.filter(m => m.eprRecovery?.status === 'Warning').length}</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded border border-red-100">
                                    <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                    <div className="text-xl font-bold text-red-700">{legacyModels.filter(m => m.eprRecovery?.status === 'Non-Compliant').length}</div>
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ overflowX: 'auto', width: '100%' }}>
                    <Table
                        dataSource={data.models.filter(m => m.generation === 'Legacy')}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 1600 }}
                        columns={[
                            {
                                title: 'Model',
                                dataIndex: 'name',
                                key: 'name',
                                width: 200,
                                render: (text: string, record: ModelComplianceData) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-7 rounded shadow-sm bg-gray-100 overflow-hidden">
                                            <img src={record.image} alt={text} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-700 text-xs">{text}</div>
                                            <Tag className="text-[10px] m-0">{record.type}</Tag>
                                        </div>
                                    </div>
                                ),
                            },
                            { title: 'Total Parts', dataIndex: 'partCountTotal', key: 'partCountTotal', width: 80, render: (val: number) => <span className="font-semibold">{val}</span> },
                            { title: 'Steel/Iron', key: 'steelParts', width: 100, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountSteel}/{r.partCountSteel}</Tag> },
                            { title: 'Al Parts', key: 'alParts', width: 90, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountAl}/{r.partCountAl}</Tag> },
                            {
                                title: 'Recovery Rate',
                                key: 'recoveryRate',
                                width: 120,
                                render: (_: any, record: ModelComplianceData) => (
                                    <div>
                                        <div className="font-bold text-xs">{record.eprRecovery?.actual ?? '-'}%</div>
                                        <div className="text-[10px] text-gray-500">Target: {record.eprRecovery?.target ?? '-'}%</div>
                                    </div>
                                )
                            },
                            { title: 'Exp. Count', dataIndex: 'exportVehicleCount', key: 'exportVehicleCount', width: 90, render: (val: number) => <span className="font-semibold text-xs">{val?.toLocaleString()}</span> },
                            { title: 'CBAM Readiness', dataIndex: 'cbamReadiness', key: 'cbamReadiness', width: 100, render: (val: number) => (<div className="w-16"><Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} /><div className="text-[10px] text-right mt-0.5">{val}%</div></div>) },
                            { title: 'Calculation', dataIndex: 'cbamCalculation', key: 'cbamCalculation', width: 110, render: (text: string) => <Tag color="blue" className="text-[10px]">{text}</Tag> },
                            { title: 'Amount', dataIndex: 'cbamAmount', key: 'cbamAmount', width: 100, render: (val: number) => <span className="font-mono text-xs text-gray-700">€{val?.toLocaleString()}</span> },
                            { title: 'Red. (Data)', dataIndex: 'reductionDataMgmt', key: 'reductionDataMgmt', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                            { title: 'Red. (Sust.)', dataIndex: 'reductionSustainable', key: 'reductionSustainable', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                        ]}
                    />
                    </div>
                </div>

                {/* 3.3 Part Wise Recovery */}
                <div>
                    <div className="flex items-center justify-between mb-4 mt-8">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600" /> Part Wise Recoverability
                        </h4>
                    </div>

                    {/* Filters & Stats */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <Select
                                placeholder="Filter by Material"
                                allowClear
                                value={eprRecoveryMaterialFilter}
                                onChange={(val) => setEprRecoveryMaterialFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="Steel">Steel</Option>
                                <Option value="Aluminum">Aluminum</Option>
                                <Option value="Cast Iron">Cast Iron</Option>
                                <Option value="Plastic">Plastic</Option>
                            </Select>
                            <Select
                                placeholder="Filter by Model"
                                allowClear
                                value={eprRecoveryModelFilter}
                                onChange={(val) => setEprRecoveryModelFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="All">All Models</Option>
                                <Option value="alto">Alto K10</Option>
                                <Option value="wagonr">Wagon R</Option>
                                <Option value="swift">Swift</Option>
                                <Option value="swiftdzire">Swift Dzire</Option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-semibold">Total Parts</div>
                                <div className="text-xl font-bold text-gray-800">{eprRecoveryStats.total}</div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                <div className="text-xl font-bold text-emerald-700">{eprRecoveryStats.compliant}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded border border-red-100">
                                <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                <div className="text-xl font-bold text-red-700">{eprRecoveryStats.nonCompliant}</div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="text-xs text-amber-600 uppercase font-semibold">Warnings</div>
                                <div className="text-xl font-bold text-amber-700">{eprRecoveryStats.warning}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <Table
                            dataSource={filteredEprRecoveryParts}
                            rowKey="id"
                            columns={eprPartColumns('Recovery')}
                            pagination={{ pageSize: 8 }}
                            size="small"
                            scroll={{ x: 1400 }}
                        />
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: EPR (RECYCLING) COMPLIANCE --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Recycle className="w-6 h-6 text-green-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">EPR (Recycling) Compliance</h3>
                </div>

                {/* 4.1 Recycling Context */}
                <Card className="bg-green-50 border-green-100 shadow-sm rounded-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-green-900 font-bold text-lg mb-3">
                                <Info className="w-5 h-5" /> EPR Recycling — Recycled Content Mandates
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Recyclability</strong> refers strictly to reprocessing waste into new products/materials (excluding energy recovery). The mandate requires a minimum <strong>85% Recyclability Rate</strong> by weight. Additionally, recycled content targets apply to new vehicle manufacturing.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">ELV Steel Recycled Content</h5>
                                    <p className="text-[11px] text-green-700">5% (2027-28) → 10% → 15% → 20% (2030+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">Battery Recycled Content</h5>
                                    <p className="text-[11px] text-green-700">5% (2027-28) → 10% → 15% → 20% (2030+)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">Plastic Recycled Content</h5>
                                    <p className="text-[11px] text-green-700">India: Upcoming | EU: 20% (15% from ELV) by 2030</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <h5 className="text-xs font-bold text-green-800 mb-1">EU Plastic (ELV Reg.)</h5>
                                    <p className="text-[11px] text-green-700">20% total, 15% from ELV sources by 2030</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 4.2 Vehicle Wise Recycling */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-600" /> Vehicle Wise Recycling Status
                        </h4>
                    </div>

                    {/* Vehicle Mini Cards */}
                    {(() => {
                        const newModels = data.models.filter(m => m.generation === 'New');
                        return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Models</div>
                                    <div className="text-xl font-bold text-gray-800">{newModels.length}</div>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                    <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                    <div className="text-xl font-bold text-emerald-700">{newModels.filter(m => m.eprRecycling?.status === 'Compliant').length}</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                    <div className="text-xs text-amber-600 uppercase font-semibold">Warning</div>
                                    <div className="text-xl font-bold text-amber-700">{newModels.filter(m => m.eprRecycling?.status === 'Warning').length}</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded border border-red-100">
                                    <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                    <div className="text-xl font-bold text-red-700">{newModels.filter(m => m.eprRecycling?.status === 'Non-Compliant').length}</div>
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <Table
                            dataSource={data.models.filter(m => m.generation === 'New')}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 1600 }}
                            columns={[
                                {
                                    title: 'Model',
                                    dataIndex: 'name',
                                    key: 'name',
                                    width: 200,
                                    render: (text: string, record: ModelComplianceData) => (
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-7 rounded shadow-sm bg-gray-100 overflow-hidden">
                                                <img src={record.image} alt={text} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-700 text-xs">{text}</div>
                                                <Tag className="text-[10px] m-0">{record.type}</Tag>
                                            </div>
                                        </div>
                                    ),
                                },
                                { title: 'Total Parts', dataIndex: 'partCountTotal', key: 'partCountTotal', width: 80, render: (val: number) => <span className="font-semibold">{val}</span> },
                                { title: 'Steel/Iron', key: 'steelParts', width: 100, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountSteel}/{r.partCountSteel}</Tag> },
                                { title: 'Al Parts', key: 'alParts', width: 90, render: (_: any, r: ModelComplianceData) => <Tag color="default" className="text-[10px]">{r.compliantPartCountAl}/{r.partCountAl}</Tag> },
                                {
                                    title: 'Recycling Rate',
                                    key: 'recyclingRate',
                                    width: 120,
                                    render: (_: any, record: ModelComplianceData) => (
                                        <div>
                                            <div className="font-bold text-xs">{record.eprRecycling?.actual ?? '-'}%</div>
                                            <div className="text-[10px] text-gray-500">Target: {record.eprRecycling?.target ?? '-'}%</div>
                                        </div>
                                    )
                                },
                                { title: 'Exp. Count', dataIndex: 'exportVehicleCount', key: 'exportVehicleCount', width: 90, render: (val: number) => <span className="font-semibold text-xs">{val?.toLocaleString()}</span> },
                                { title: 'CBAM Readiness', dataIndex: 'cbamReadiness', key: 'cbamReadiness', width: 100, render: (val: number) => (<div className="w-16"><Progress percent={val} size="small" strokeColor={val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444'} showInfo={false} /><div className="text-[10px] text-right mt-0.5">{val}%</div></div>) },
                                { title: 'Calculation', dataIndex: 'cbamCalculation', key: 'cbamCalculation', width: 110, render: (text: string) => <Tag color="blue" className="text-[10px]">{text}</Tag> },
                                { title: 'Amount', dataIndex: 'cbamAmount', key: 'cbamAmount', width: 100, render: (val: number) => <span className="font-mono text-xs text-gray-700">€{val?.toLocaleString()}</span> },
                                { title: 'Red. (Data)', dataIndex: 'reductionDataMgmt', key: 'reductionDataMgmt', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                                { title: 'Red. (Sust.)', dataIndex: 'reductionSustainable', key: 'reductionSustainable', width: 90, render: (val: number) => <span className="font-mono text-xs text-emerald-600">€{val?.toLocaleString()}</span> },
                            ]}
                        />
                    </div>
                </div>

                {/* 4.3 Part Wise Recycling */}
                <div>
                    <div className="flex items-center justify-between mb-4 mt-8">
                        <h4 className="text-base font-semibold m-0 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600" /> Part Wise Recyclability
                        </h4>
                    </div>

                    {/* Filters & Stats */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <Select
                                placeholder="Filter by Material"
                                allowClear
                                value={eprRecyclingMaterialFilter}
                                onChange={(val) => setEprRecyclingMaterialFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="Steel">Steel</Option>
                                <Option value="Aluminum">Aluminum</Option>
                                <Option value="Cast Iron">Cast Iron</Option>
                                <Option value="Plastic">Plastic</Option>
                            </Select>
                            <Select
                                placeholder="Filter by Model"
                                allowClear
                                value={eprRecyclingModelFilter}
                                onChange={(val) => setEprRecyclingModelFilter(val || 'All')}
                                style={{ width: 160 }}
                            >
                                <Option value="All">All Models</Option>
                                <Option value="evitara">eVitara</Option>
                                <Option value="fronx">Fronx</Option>
                                <Option value="baleno">Baleno</Option>
                                <Option value="xl6">XL6</Option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-semibold">Total Parts</div>
                                <div className="text-xl font-bold text-gray-800">{eprRecyclingStats.total}</div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <div className="text-xs text-emerald-600 uppercase font-semibold">Compliant</div>
                                <div className="text-xl font-bold text-emerald-700">{eprRecyclingStats.compliant}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded border border-red-100">
                                <div className="text-xs text-red-600 uppercase font-semibold">Non-Compliant</div>
                                <div className="text-xl font-bold text-red-700">{eprRecyclingStats.nonCompliant}</div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                <div className="text-xs text-amber-600 uppercase font-semibold">Warnings</div>
                                <div className="text-xl font-bold text-amber-700">{eprRecyclingStats.warning}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <Table
                            dataSource={filteredEprRecyclingParts}
                            rowKey="id"
                            columns={eprPartColumns('Recycling')}
                            pagination={{ pageSize: 8 }}
                            size="small"
                            scroll={{ x: 1400 }}
                        />
                    </div>
                </div>
            </div>
            {/* Modal for detailed vehicle view */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-gray-700" />
                        <span className="text-lg font-semibold">{selectedModel?.name} - Export & CBAM Compliance</span>
                    </div>
                }
                open={!!selectedModel}
                onCancel={() => setSelectedModel(null)}
                footer={null}
                width={800}
                className="top-8"
            >
                {selectedModel && selectedModel.exportData && (
                    <div className="space-y-6 pt-2">
                        {/* 1. CBAM Context Header */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                                <Globe className="w-4 h-4" /> EU Carbon Border Adjustment Mechanism (CBAM)
                            </h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                The EU CBAM imposes a carbon price on imports of carbon-intensive products like <strong>Steel, Aluminum, and Iron</strong> used in vehicle manufacturing.
                                From 2026, importers must surrender CBAM certificates corresponding to embedded emissions. Non-compliant vehicles face penalties and export bans.
                            </p>
                        </div>

                        {/* 2. Export Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card size="small" className="bg-slate-50 border-slate-200 shadow-sm">
                                <Statistic
                                    title={<span className="text-gray-600 font-medium">Total Scheduled Exports (EU)</span>}
                                    value={selectedModel.exportData.totalExportUnits}
                                    suffix="units"
                                    valueStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                                />
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Compliance Rate</span>
                                        <span className={selectedModel.exportData.compliantPercentage >= 90 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                                            {selectedModel.exportData.compliantPercentage}%
                                        </span>
                                    </div>
                                    <Progress
                                        percent={selectedModel.exportData.compliantPercentage}
                                        strokeColor={selectedModel.exportData.compliantPercentage >= 90 ? '#10b981' : '#f59e0b'}
                                        showInfo={false}
                                        size="small"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        <strong>{selectedModel.exportData.cbamCompliantUnits.toLocaleString()}</strong> units are cleared for export.
                                    </p>
                                </div>
                            </Card>

                            <Card size="small" className="bg-white border-slate-200 shadow-sm">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Vehicle Carbon Intensity</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-gray-800">{selectedModel.type === 'EV' ? '14.2' : '28.5'}</span>
                                            <span className="text-xs text-gray-500 mb-1">tCO2e / vehicle</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Key Material Emissions</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Steel Body</span>
                                                <span className="font-mono text-gray-700">1.8 tCO2e/t</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span>Aluminum Parts</span>
                                                <span className="font-mono text-gray-700">4.2 tCO2e/t</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 3. Non-Compliance Analysis & Actions */}
                        {selectedModel.exportData.nonCompliantReasons.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Reasons */}
                                <div className="border border-red-100 bg-red-50 rounded-lg p-4">
                                    <h4 className="flex items-center gap-2 text-red-800 font-semibold mb-3">
                                        <AlertTriangle className="w-4 h-4" /> Non-Compliance Detected
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedModel.exportData.nonCompliantReasons.map((reason, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-red-700 items-start">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                                                <span className="leading-snug">{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="border border-emerald-100 bg-emerald-50 rounded-lg p-4">
                                    <h4 className="flex items-center gap-2 text-emerald-800 font-semibold mb-3">
                                        <CheckCircle className="w-4 h-4" /> Remedial Actions
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedModel.exportData.complianceActions.map((action, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-emerald-700 items-start">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                <span className="leading-snug">{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {!selectedModel.exportData && (
                            <div className="text-center py-8 text-gray-500">
                                No export data available for this model.
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ComplianceOverview;
