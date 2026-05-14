export interface QCLog { parameter: string; expected: string; actual: string; passed: boolean; date: string; inspectorId: string; }
export type PartStatus = 'OK' | 'Flagged' | 'Recalled' | 'Under Review';
export interface ComplianceIssue { rule: string; current: string; required: string; deadline: string; responsibleParty: string; }
export type MaterialCategory = 'STEEL' | 'PLASTIC' | 'RUBBER' | 'BATTERY' | 'GLASS' | 'ALUMINIUM' | 'COMPOSITE' | 'ELECTRONIC' | 'COPPER' | 'FOAM';
export interface PartNode {
  id: string; name: string; partNumber: string; supplierName: string; batchNumber: string;
  incorporationDate: string; materialComposition: string; recycledContentPercent?: number;
  material?: MaterialCategory;
  materialProducer?: string; elvBatch?: string;
  status: PartStatus; children?: PartNode[];
  supplierAddress?: string; supplierCertification?: string; qcLogs?: QCLog[];
  materialTraceability?: string; actionItems?: string[]; compliance?: ComplianceIssue[];
}
export interface ActiveRecall { id: string; description: string; date: string; authority: string; status: 'Pending' | 'In Progress' | 'Completed'; owner: string; }
export interface PastRecall { id: string; description: string; date: string; authority: string; status: 'Completed'; owner: string; completionDate: string; }
export interface VehicleTrace {
  vehicleId: string; modelName: string; engineNumber: string; chassisNumber: string;
  manufacturingDate: string; assemblyLineId: string; status: 'In Production' | 'Dispatched' | 'Recalled';
  rootPart: PartNode; activeRecalls: ActiveRecall[]; pastRecalls: PastRecall[];
}
export interface PartsAIInsight { id: number; title: string; explanation: string; confidence: 'High' | 'Medium' | 'Low'; category: 'Anomaly' | 'Risk' | 'Predictive' | 'Compliance' | 'Recall'; dataBasis: string; }
export interface SearchSuggestion { value: string; label: string; vehicleId: string; modelName: string; type: 'Engine Number' | 'Chassis Number'; }

const mkPart = (id: string, name: string, pn: string, supp: string, batch: string, date: string, mat: string, rc: number, st: PartStatus, children?: PartNode[], extras?: Partial<PartNode>): PartNode =>
  ({ id, name, partNumber: pn, supplierName: supp, batchNumber: batch, incorporationDate: date, materialComposition: mat, recycledContentPercent: rc, material: 'COMPOSITE' as MaterialCategory, status: st, children, ...extras });

const mp = (id: string, name: string, pn: string, supp: string, batch: string, date: string, mat: string, rc: number, st: PartStatus, matCat: MaterialCategory, producer: string, elvBatch: string, children?: PartNode[], extras?: Partial<PartNode>): PartNode =>
  ({ id, name, partNumber: pn, supplierName: supp, batchNumber: batch, incorporationDate: date, materialComposition: mat, recycledContentPercent: rc, material: matCat, materialProducer: producer, elvBatch, status: st, children, ...extras });

export const mockVehicles: VehicleTrace[] = [
  {
    vehicleId: 'V-1001', modelName: 'Grand Vitara', engineNumber: 'K15C-1093847', chassisNumber: 'MA3EA11S2N1093847',
    manufacturingDate: '2025-10-15', assemblyLineId: 'Line-2A (Gurgaon)', status: 'Dispatched',
    activeRecalls: [{ id: 'REC-2026-001', description: 'Possible micro-cracks in fuel pump impeller — units from batch L-2204 may exhibit reduced fuel delivery under high load conditions.', date: '2026-02-10', authority: 'MoRTH — CMVR Cell', status: 'Pending', owner: 'Service Center — Delhi NCR' }],
    pastRecalls: [{ id: 'REC-2024-011', description: 'Airbag ECU firmware OTA patch.', date: '2024-06-15', authority: 'MoRTH', status: 'Completed', owner: 'MSIL Service Network', completionDate: '2024-09-30' }],
    rootPart: mp('root-GV','Grand Vitara Complete Assembly','GV-ASSY-001','MSIL Gurgaon Plant','B-GV-251015','2025-10-15','Multi-material',12,'Flagged','COMPOSITE','MSIL Internal','ELV-2025-GV-001',[
      /* ── STEEL PARTS ── */
      mp('gv-s01','Front Bumper Reinforcement Beam','BMP-STL-GV-001','Gestamp India','GST-B-221','2025-10-08','HCT590 High-Strength Steel, 22% Recycled',22,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0441',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'604 MPa',passed:true,date:'2025-10-08',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL Batch ELV-STL-2025-0441 → rolled & coated at Gestamp Pune'}),
      mp('gv-s02','Rear Bumper Cross Member','BMP-STL-GV-002','Gestamp India','GST-B-222','2025-10-08','HCT590 Steel, 22% Recycled',22,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0442',undefined,{materialTraceability:'HCT590 → Tata Steel BSL Batch ELV-STL-2025-0442'}),
      mp('gv-s03','Hub – Front Wheel (Pair)','HUB-FR-GV-003','Sona BLW Precision','SBW-B-331','2025-10-07','Forged Steel SAE 1045, 8% Recycled',8,'OK','STEEL','Kalyani Steels','ELV-STL-2025-0501',undefined,{supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Runout (mm)',expected:'≤0.05',actual:'0.03',passed:true,date:'2025-10-07',inspectorId:'INS-042'}],materialTraceability:'SAE 1045 → Kalyani Steels Batch ELV-STL-2025-0501 → forged at Sona BLW Manesar'}),
      mp('gv-s04','Drum Brake – Rear (Pair)','BRK-DRM-GV-004','Bosch India','BSH-B-440','2025-10-09','Grey Cast Iron GCI-250, 40% Recycled',40,'OK','STEEL','Electrosteel Castings','ELV-STL-2025-0502'),
      mp('gv-s05','Pinion – Steering Rack','STR-PIN-GV-005','JTEKT India','JTK-B-112','2025-10-06','Case-Hardened Steel 20CrMo, 5% Recycled',5,'OK','STEEL','Sunflag Iron','ELV-STL-2025-0503',undefined,{qcLogs:[{parameter:'Hardness (HRC)',expected:'58-62',actual:'60',passed:true,date:'2025-10-06',inspectorId:'INS-067'}]}),
      mp('gv-s06','Gear – Transmission (5-Speed)','GBX-GR-GV-006','Suzuki Motor Gujarat','SMG-B-881','2025-10-05','Alloy Steel 16MnCr5, 6% Recycled',6,'OK','STEEL','Sunflag Iron','ELV-STL-2025-0504'),
      mp('gv-s07','Steering Column Shaft','STC-GV-007','NSK India','NSK-B-214','2025-10-07','EN8 Steel, Splined',5,'OK','STEEL','Mukand Ltd','ELV-STL-2025-0505'),
      mp('gv-s08','Door Hinge Set (x8)','DH-GV-008','Shiroki India','SHK-B-119','2025-10-10','HSLA Steel, 18% Recycled',18,'OK','STEEL','JSW Steel','ELV-STL-2025-0506',undefined,{materialTraceability:'HSLA → JSW Steel Batch ELV-STL-2025-0506 → stamped at Shiroki Rohtak'}),
      mp('gv-s09','Front Subframe','SBF-GV-009','MSIL Press Shop','MPS-B-557','2025-10-11','HCT780 Steel, 15% Green Steel',15,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0443',undefined,{qcLogs:[{parameter:'Weld Quality',expected:'Grade A',actual:'Grade A',passed:true,date:'2025-10-11',inspectorId:'INS-077'}]}),
      mp('gv-s10','Roof Panel (Pressed)','RF-GV-010','MSIL Press Shop','MPS-B-558','2025-10-12','DC04 Deep-Draw Steel, 10% Recycled',10,'OK','STEEL','ArcelorMittal Nippon','ELV-STL-2025-0444'),
      /* ── PLASTIC PARTS ── */
      mp('gv-p01','Front Bumper Fascia','BMP-FR-GV-P01','AutoPlastics Inc.','AP-B-099','2025-10-13','PP 15% Recycled (Target 20%)',15,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0301',[
        mp('gv-p01a','PP Resin Pellets (rPP)','PP-REL-001','Reliance Industries','REL-B-4421','2025-10-01','rPP – Post-Consumer Recycled Polypropylene',15,'Flagged','PLASTIC','Chemical Recycler MRF-India','ELV-PL-2025-0301',undefined,{qcLogs:[{parameter:'MFI (g/10min)',expected:'12',actual:'10.8',passed:false,date:'2025-10-02',inspectorId:'INS-055'}],actionItems:['rPP content below target — escalate to AutoPlastics procurement']})
      ],{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'15%',passed:false,date:'2025-10-13',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'15% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-12-01']}),
      mp('gv-p02','Rear Bumper Fascia','BMP-RR-GV-P02','AutoPlastics Inc.','AP-B-100','2025-10-13','PP+EPDM 12% Recycled',12,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0302',undefined,{materialTraceability:'rPP+EPDM → Reliance Batch REL-B-4422 → AutoPlastics Bhiwadi'}),
      mp('gv-p03','Instrument Panel (Dashboard)','IP-GV-P03','Faurecia India','FAU-B-228','2025-10-11','ABS+PC 18% Recycled',18,'OK','PLASTIC','Covestro India','ELV-PL-2025-0303',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-B-771 → Faurecia Pune'}),
      mp('gv-p04','Door Trim Panel – Set of 4','DTP-GV-P04','Motherson Sumi','MSS-B-1122','2025-10-14','PP-GF, 38% Recycled Polyester',38,'OK','PLASTIC','Indorama Ventures','ELV-PL-2025-0304'),
      mp('gv-p05','Fender Liner – Front Pair','FL-GV-P05','Unipres India','UNI-B-334','2025-10-13','HDPE 20% Recycled',20,'OK','PLASTIC','Dow Chemical India','ELV-PL-2025-0305',undefined,{materialTraceability:'HDPE regrind → Dow India Batch DOW-B-2291'}),
      mp('gv-p06','Front Grille Assembly','GRL-GV-P06','SRG India','SRG-B-221','2025-10-14','Chrome-plated ABS, 5% Recycled',5,'OK','PLASTIC','LG Chem India','ELV-PL-2025-0306'),
      mp('gv-p07','HVAC Housing & Ducts','HVAC-GV-P07','Denso India','DNO-B-882','2025-10-12','PP 10% Recycled',10,'OK','PLASTIC','Reliance Industries','ELV-PL-2025-0307'),
      mp('gv-p08','Fuel Tank (HDPE)','FT-GV-P08','Inergy Automotive','INA-B-441','2025-10-10','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0308',undefined,{materialTraceability:'HDPE→SABIC India Batch SBC-B-119',compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      mp('gv-p09','Windshield Laminated','WS-GV-P09','AGC Automotive India','AGC-B-556','2025-10-14','Laminated Safety Glass',0,'OK','GLASS','AGC Inc. Japan','ELV-GL-2025-0101',[
        mp('gv-p09a','PVB Interlayer Film','PVB-STD-001','Eastman Chemical','EC-PVB-9901','2025-10-01','Polyvinyl Butyral',0,'Under Review','PLASTIC','Eastman USA','ELV-PL-2025-0309')
      ]),
      mp('gv-p10','Tail Lamp Lens (Pair)','TLL-GV-P10','Lumax Industries','LMX-B-554','2025-10-14','PMMA+PC 3% Recycled',3,'OK','PLASTIC','Mitsubishi Chemical India','ELV-PL-2025-0310'),
      /* ── BATTERY PARTS ── */
      mp('gv-b01','12V Lead-Acid Starter Battery','BAT-12V-60AH','Exide Industries','EXD-B-7723','2025-10-15','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0011',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'540A',actual:'558A',passed:true,date:'2025-10-15',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India Batch ELV-BAT-2025-0011 → Exide Hosur Plant'}),
      mp('gv-b02','48V Mild Hybrid Battery Pack (SHVS)','BAT-48V-SHVS','Toshiba SCIB India','TSB-B-102','2025-10-14','LTO Cells, 12% Recycled Li',12,'OK','BATTERY','Toshiba Japan (LTO)','ELV-BAT-2025-0012',undefined,{supplierCertification:'AIS 156 Rev4, UN38.3',qcLogs:[{parameter:'State of Health (%)',expected:'≥98%',actual:'99.1%',passed:true,date:'2025-10-14',inspectorId:'INS-099'}],materialTraceability:'LTO → Toshiba Japan → assembled at Toshiba SCIB India Nashik'}),
      /* ── ENGINE (existing) ── */
      mp('eng-K15C','Engine Assembly (K15C)','ENG-K15C-00','Suzuki Motor Gujarat','ENG-B-992','2025-10-10','Aluminium Alloy 30% Recycled',30,'Flagged','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0211',[
        mp('fuel-pump','Fuel Pump Module','FP-88321-A','Denso India Pvt. Ltd.','L-2204','2025-10-05','POM Plastic + SS304',0,'Recalled','PLASTIC','DuPont India','ELV-PL-2025-0299',undefined,{supplierAddress:'Plot 3, Sector 3, IMT Manesar',supplierCertification:'ISO 9001:2015, IATF 16949',qcLogs:[{parameter:'Flow Rate (L/h)',expected:'60 L/h',actual:'57.8 L/h',passed:false,date:'2025-10-06',inspectorId:'INS-102'}],materialTraceability:'POM → DuPont India Batch DP-2024-0892 → Denso Nagpur',actionItems:['Schedule replacement — REC-2026-001']}),
        mp('ecu-1','Engine Control Unit (ECU)','ECU-K15C-SW2','Continental AG India','ECU-B-334','2025-10-09','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0101',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW2.4.1',actual:'SW2.4.1',passed:true,date:'2025-10-09',inspectorId:'INS-088'}]})
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Compression Ratio',expected:'12.0:1',actual:'12.0:1',passed:true,date:'2025-10-10',inspectorId:'INS-091'}]})
    ])
  },
  {
    vehicleId: 'V-1002', modelName: 'Swift', engineNumber: 'K12M-2039121', chassisNumber: 'MA3FBE1S1P2039121',
    manufacturingDate: '2025-11-02', assemblyLineId: 'Line-1B (Manesar)', status: 'In Production',
    activeRecalls: [], pastRecalls: [],
    rootPart: mp('root-SW','Swift Complete Assembly','SW-ASSY-001','MSIL Manesar','B-SW-251102','2025-11-02','Multi-material',18,'OK','COMPOSITE','MSIL Internal','ELV-2025-SW-001',[
      /* ── STEEL ── */
      mp('sw-s01','Front Bumper Reinforcement Beam','BMP-STL-SW-001','Gestamp India','GST-C-301','2025-10-27','HCT590 Steel, 20% Recycled',20,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0521',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'598 MPa',passed:true,date:'2025-10-27',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL Batch ELV-STL-2025-0521 → Gestamp Pune'}),
      mp('sw-s02','Rear Bumper Cross Member','BMP-STL-SW-002','Gestamp India','GST-C-302','2025-10-27','HCT590 Steel, 20% Recycled',20,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0522'),
      mp('sw-s03','Hub – Front Wheel (Pair)','HUB-FR-SW-003','Sona BLW Precision','SBW-C-441','2025-10-26','Forged Steel SAE 1045, 8% Recycled',8,'OK','STEEL','Kalyani Steels','ELV-STL-2025-0541',undefined,{qcLogs:[{parameter:'Runout (mm)',expected:'≤0.05',actual:'0.04',passed:true,date:'2025-10-26',inspectorId:'INS-042'}],materialTraceability:'SAE 1045 → Kalyani Steels ELV-STL-2025-0541 → forged at Sona BLW Manesar'}),
      mp('sw-s04','Front Subframe','SBF-SW-004','MSIL Press Shop','MPS-C-671','2025-10-28','HCT780 Steel, 14% Green Steel',14,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0523',undefined,{qcLogs:[{parameter:'Weld Quality',expected:'Grade A',actual:'Grade A',passed:true,date:'2025-10-28',inspectorId:'INS-077'}],materialTraceability:'HCT780 → Tata Steel BSL ELV-STL-2025-0523 → MSIL Manesar Press Shop'}),
      /* ── PLASTIC ── */
      mp('sw-p01','Front Bumper Fascia','BMP-FR-SW-P01','AutoPlastics Inc.','AP-C-111','2025-10-30','PP 18% Recycled (Target 20%)',18,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0321',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'18%',passed:false,date:'2025-10-30',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'18% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-12-15']}),
      mp('sw-p02','Instrument Panel (Dashboard)','IP-SW-P02','Faurecia India','FAU-C-241','2025-10-31','ABS+PC 18% Recycled',18,'OK','PLASTIC','Covestro India','ELV-PL-2025-0322',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-C-801 → Faurecia Pune'}),
      mp('sw-p03','Door Trim Panel – Set of 4','DTP-SW-P03','Motherson Sumi','MSS-C-1201','2025-11-01','PP-GF, 35% Recycled Polyester',35,'OK','PLASTIC','Indorama Ventures','ELV-PL-2025-0323',undefined,{materialTraceability:'PP-GF + rPET → Indorama Ventures → Motherson Sumi Noida'}),
      mp('sw-p04','Fuel Tank (HDPE)','FT-SW-P04','Inergy Automotive','INA-C-551','2025-10-29','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0324',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('sw-b01','12V Lead-Acid Starter Battery','BAT-12V-45AH-SW','Exide Industries','EXD-C-8801','2025-11-01','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0021',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'450A',actual:'462A',passed:true,date:'2025-11-01',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India Batch ELV-BAT-2025-0021 → Exide Hosur Plant'}),
      /* ── ENGINE ── */
      mp('eng-K12M','Engine Assembly (K12M)','ENG-K12M-01','Suzuki Motor Gujarat','ENG-C-1105','2025-10-28','Aluminium 35% Recycled',35,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0221',[
        mp('sw-ecu','Engine Control Unit (ECU)','ECU-K12M-SW1','Continental AG India','ECU-C-441','2025-10-27','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0111',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW1.8.2',actual:'SW1.8.2',passed:true,date:'2025-10-27',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India Batch ELV-EL-2025-0111 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Power Output',expected:'61 kW',actual:'61 kW',passed:true,date:'2025-10-28',inspectorId:'INS-091'}]}),
    ])
  },
  {
    vehicleId: 'V-1003', modelName: 'Baleno', engineNumber: 'K12N-3812099', chassisNumber: 'MA3EWBE1XR3812099',
    manufacturingDate: '2025-09-20', assemblyLineId: 'Line-3C (Gurgaon)', status: 'Dispatched',
    activeRecalls: [], pastRecalls: [],
    rootPart: mp('root-BA','Baleno Complete Assembly','BA-ASSY-001','MSIL Gurgaon','B-BA-250920','2025-09-20','Multi-material',20,'OK','COMPOSITE','MSIL Internal','ELV-2025-BA-001',[
      /* ── STEEL ── */
      mp('ba-s01','Front Bumper Reinforcement','BMP-STL-BA-001','Gestamp India','GST-D-401','2025-09-14','HCT590 Steel, 20% Recycled',20,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0561',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'602 MPa',passed:true,date:'2025-09-14',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL ELV-STL-2025-0561 → Gestamp Pune'}),
      mp('ba-s02','Door Hinge Set (x8)','DH-BA-002','Shiroki India','SHK-D-221','2025-09-15','HSLA Steel, 18% Recycled',18,'OK','STEEL','JSW Steel','ELV-STL-2025-0562',undefined,{materialTraceability:'HSLA → JSW Steel ELV-STL-2025-0562 → Shiroki Rohtak'}),
      mp('ba-s03','Steering Column Shaft','STC-BA-003','NSK India','NSK-D-317','2025-09-16','EN8 Steel, Splined',5,'OK','STEEL','Mukand Ltd','ELV-STL-2025-0563',undefined,{qcLogs:[{parameter:'Spline Runout (mm)',expected:'≤0.03',actual:'0.02',passed:true,date:'2025-09-16',inspectorId:'INS-067'}]}),
      mp('ba-s04','Front Seat Assembly','SEAT-BA-001','Brose India','BR-D-334','2025-09-18','Steel Frame, Fabric 22% Recycled',22,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0564',undefined,{supplierAddress:'Brose India, Pune',supplierCertification:'IATF 16949',materialTraceability:'Steel frame → Tata Steel BSL + 22% rPET fabric → Brose India Pune'}),
      /* ── PLASTIC ── */
      mp('ba-p01','Front Bumper Fascia','BMP-FR-BA-P01','AutoPlastics Inc.','AP-D-131','2025-09-17','PP 15% Recycled (Target 20%)',15,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0341',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'15%',passed:false,date:'2025-09-17',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'15% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-11-30']}),
      mp('ba-p02','Instrument Panel (Dashboard)','IP-BA-P02','Faurecia India','FAU-D-251','2025-09-18','ABS+PC 20% Recycled',20,'OK','PLASTIC','Covestro India','ELV-PL-2025-0342',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-D-821 → Faurecia Pune'}),
      mp('ba-p03','Sunroof Module','SRF-BA-003','Webasto India','WB-D-092','2025-09-19','Toughened Glass, Aluminium Frame',5,'Under Review','GLASS','AGC India','ELV-GL-2025-0121',undefined,{supplierAddress:'Webasto India, Chennai',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Sealing Integrity (Pa)',expected:'≥500 Pa',actual:'432 Pa',passed:false,date:'2025-09-19',inspectorId:'INS-119'}],actionItems:['Webasto to submit CAPA by 2025-11-15 — sealing adhesive batch WB-ADH-0991 under review']}),
      mp('ba-p04','Fuel Tank (HDPE)','FT-BA-P04','Inergy Automotive','INA-D-561','2025-09-16','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0343',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('ba-b01','12V Lead-Acid Starter Battery','BAT-12V-45AH-BA','Exide Industries','EXD-D-9901','2025-09-20','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0031',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'450A',actual:'458A',passed:true,date:'2025-09-20',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India ELV-BAT-2025-0031 → Exide Hosur'}),
      /* ── ENGINE ── */
      mp('eng-K12N-BA','Engine Assembly (K12N DualJet)','ENG-K12N-01','Suzuki Motor Gujarat','ENG-D-881','2025-09-15','Aluminium 35% Recycled',35,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0231',[
        mp('ba-ecu','Engine Control Unit (ECU)','ECU-K12N-BA1','Continental AG India','ECU-D-551','2025-09-14','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0121',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW2.1.4',actual:'SW2.1.4',passed:true,date:'2025-09-14',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India ELV-EL-2025-0121 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Compression Ratio',expected:'11.5:1',actual:'11.5:1',passed:true,date:'2025-09-15',inspectorId:'INS-091'}]}),
    ])
  },
  {
    vehicleId: 'V-1004', modelName: 'Brezza', engineNumber: 'K15B-4421332', chassisNumber: 'MA3GLBE1XS4421332',
    manufacturingDate: '2025-08-10', assemblyLineId: 'Line-4A (Gujarat)', status: 'Recalled',
    activeRecalls: [{ id: 'REC-2025-019', description: 'Potential brake booster vacuum hose delamination under extreme heat conditions.', date: '2025-12-01', authority: 'MoRTH', status: 'In Progress', owner: 'MSIL Nationwide Service Network' }],
    pastRecalls: [],
    rootPart: mp('root-BR','Brezza Complete Assembly','BR-ASSY-001','MSIL Gujarat','B-BR-250810','2025-08-10','Multi-material',14,'Recalled','COMPOSITE','MSIL Internal','ELV-2025-BR-001',[
      /* ── STEEL ── */
      mp('br-s01','Front Bumper Reinforcement','BMP-STL-BR-001','Gestamp India','GST-E-501','2025-08-04','HCT590 Steel, 20% Recycled',20,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0581',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'596 MPa',passed:true,date:'2025-08-04',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL ELV-STL-2025-0581 → Gestamp Pune'}),
      mp('br-s02','Front Subframe','SBF-BR-002','MSIL Press Shop','MPS-E-771','2025-08-05','HCT780 Steel, 15% Green Steel',15,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0582',undefined,{qcLogs:[{parameter:'Weld Quality',expected:'Grade A',actual:'Grade A',passed:true,date:'2025-08-05',inspectorId:'INS-077'}],materialTraceability:'HCT780 → Tata Steel BSL ELV-STL-2025-0582 → MSIL Gujarat Press Shop'}),
      mp('br-s03','Hub – Front Wheel (Pair)','HUB-FR-BR-003','Sona BLW Precision','SBW-E-661','2025-08-03','Forged Steel SAE 1045, 8% Recycled',8,'OK','STEEL','Kalyani Steels','ELV-STL-2025-0583',undefined,{qcLogs:[{parameter:'Runout (mm)',expected:'≤0.05',actual:'0.04',passed:true,date:'2025-08-03',inspectorId:'INS-042'}]}),
      /* ── PLASTIC ── */
      mp('br-p01','Front Bumper Fascia','BMP-FR-BR-P01','AutoPlastics Inc.','AP-E-151','2025-08-07','PP 14% Recycled (Target 20%)',14,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0361',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'14%',passed:false,date:'2025-08-07',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'14% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-10-31']}),
      mp('br-p02','Instrument Panel (Dashboard)','IP-BR-P02','Faurecia India','FAU-E-261','2025-08-08','ABS+PC 17% Recycled',17,'OK','PLASTIC','Covestro India','ELV-PL-2025-0362',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-E-841 → Faurecia Pune'}),
      mp('br-p03','Fuel Tank (HDPE)','FT-BR-P03','Inergy Automotive','INA-E-571','2025-08-06','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0363',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('br-b01','12V Lead-Acid Starter Battery','BAT-12V-60AH-BR','Exide Industries','EXD-E-1101','2025-08-09','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0041',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'540A',actual:'551A',passed:true,date:'2025-08-09',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India ELV-BAT-2025-0041 → Exide Hosur'}),
      /* ── ENGINE ── */
      mp('eng-K15B','Engine Assembly (K15B)','ENG-K15B-00','Suzuki Motor Gujarat','ENG-A-771','2025-08-05','Aluminium 28% Recycled',28,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0241',[
        mp('br-ecu','Engine Control Unit (ECU)','ECU-K15B-BR1','Continental AG India','ECU-E-661','2025-08-04','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0131',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW3.2.1',actual:'SW3.2.1',passed:true,date:'2025-08-04',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India ELV-EL-2025-0131 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Power Output',expected:'77 kW',actual:'77 kW',passed:true,date:'2025-08-05',inspectorId:'INS-091'}]}),
      /* ── BRAKE SYSTEM (Recalled) ── */
      mp('brake-sys','Brake System Assembly','BRK-SYS-001','Bosch India','BSH-E-442','2025-08-08','Cast Iron, Steel',12,'Recalled','STEEL','Electrosteel Castings','ELV-STL-2025-0584',[
        mp('brake-booster','Brake Booster Vacuum Hose','BBH-001-RBR','SunFlex Rubbers','SFR-B-899','2025-08-06','EPDM Rubber',0,'Recalled','RUBBER','SunFlex Rubbers','ELV-RBR-2025-0001',undefined,{supplierAddress:'SunFlex Rubbers, Pune Industrial Area',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Delamination Resistance (°C)',expected:'150°C',actual:'118°C',passed:false,date:'2025-08-07',inspectorId:'INS-201'}],materialTraceability:'EPDM compound → SunFlex Rubbers Pune batch SFR-EPDM-2025-0441',actionItems:['Immediate recall — REC-2025-019 in progress','All units from batch SFR-B-899 quarantined']}),
      ],{supplierAddress:'Bosch India, Nashik',supplierCertification:'IATF 16949:2016',materialTraceability:'Cast iron drums → Electrosteel Castings ELV-STL-2025-0584 → Bosch India Nashik'}),
    ])
  },
  {
    vehicleId: 'V-1005', modelName: 'Fronx', engineNumber: 'Z12E-5590012', chassisNumber: 'MA3HKBE1XT5590012',
    manufacturingDate: '2025-12-01', assemblyLineId: 'Line-2B (Gurgaon)', status: 'In Production',
    activeRecalls: [], pastRecalls: [],
    rootPart: mp('root-FX','Fronx Complete Assembly','FX-ASSY-001','MSIL Gurgaon','B-FX-251201','2025-12-01','Multi-material',22,'OK','COMPOSITE','MSIL Internal','ELV-2025-FX-001',[
      /* ── STEEL ── */
      mp('fx-s01','Front Bumper Reinforcement','BMP-STL-FX-001','Gestamp India','GST-F-601','2025-11-24','HCT590 Steel, 22% Recycled',22,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0601',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'607 MPa',passed:true,date:'2025-11-24',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL ELV-STL-2025-0601 → Gestamp Pune'}),
      mp('fx-s02','Front Subframe','SBF-FX-002','MSIL Press Shop','MPS-F-881','2025-11-25','HCT780 Steel, 16% Green Steel',16,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0602',undefined,{qcLogs:[{parameter:'Weld Quality',expected:'Grade A',actual:'Grade A',passed:true,date:'2025-11-25',inspectorId:'INS-077'}],materialTraceability:'HCT780 → Tata Steel BSL ELV-STL-2025-0602 → MSIL Gurgaon Press Shop'}),
      mp('fx-s03','Roof Panel (Pressed)','RF-FX-003','MSIL Press Shop','MPS-F-882','2025-11-26','DC04 Deep-Draw Steel, 10% Recycled',10,'OK','STEEL','ArcelorMittal Nippon','ELV-STL-2025-0603',undefined,{materialTraceability:'DC04 → ArcelorMittal Nippon ELV-STL-2025-0603 → MSIL Gurgaon Press Shop'}),
      /* ── PLASTIC ── */
      mp('fx-p01','Front Bumper Fascia','BMP-FR-FX-P01','AutoPlastics Inc.','AP-F-171','2025-11-28','PP 20% Recycled',20,'OK','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0381',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'20%',passed:true,date:'2025-11-28',inspectorId:'INS-055'}],materialTraceability:'rPP → Reliance Industries Batch REL-F-5531 → AutoPlastics Bhiwadi'}),
      mp('fx-p02','Instrument Panel (Dashboard)','IP-FX-P02','Faurecia India','FAU-F-271','2025-11-29','ABS+PC 22% Recycled',22,'OK','PLASTIC','Covestro India','ELV-PL-2025-0382',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-F-861 → Faurecia Pune'}),
      mp('fx-p03','Fuel Tank (HDPE)','FT-FX-P03','Inergy Automotive','INA-F-581','2025-11-26','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0383',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('fx-b01','12V Lead-Acid Starter Battery','BAT-12V-45AH-FX','Exide Industries','EXD-F-2201','2025-11-30','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0051',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'450A',actual:'461A',passed:true,date:'2025-11-30',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India ELV-BAT-2025-0051 → Exide Hosur'}),
      /* ── ENGINE with TURBO ── */
      mp('eng-Z12E','Engine Assembly (Z12E Turbo)','ENG-Z12E-01','Suzuki Motor Gujarat','ENG-Z-009','2025-11-28','Aluminium 38% Recycled',38,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0251',[
        mp('fx-turbo','Turbocharger Unit','TURBO-Z12-001','BorgWarner India','BW-F-114','2025-11-25','Nickel Superalloy, Cast Iron',0,'OK','COMPOSITE','BorgWarner USA','ELV-CMT-2025-0001',undefined,{supplierAddress:'BorgWarner India, Chennai',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Boost Pressure (bar)',expected:'1.20',actual:'1.21',passed:true,date:'2025-11-26',inspectorId:'INS-114'}],materialTraceability:'Nickel superalloy turbine wheel → BorgWarner USA → assembled at BorgWarner India Chennai'}),
        mp('fx-ecu','Engine Control Unit (ECU)','ECU-Z12E-FX1','Continental AG India','ECU-F-771','2025-11-27','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0141',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW4.1.0',actual:'SW4.1.0',passed:true,date:'2025-11-27',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India ELV-EL-2025-0141 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Turbo Boost at 3000 RPM',expected:'1.20 bar',actual:'1.21 bar',passed:true,date:'2025-11-28',inspectorId:'INS-091'}]}),
      /* ── INFOTAINMENT ── */
      mp('infotain','Infotainment System (9")','IVI-FX-009','Harman India','HAR-F-556','2025-11-30','PCB, Tempered Glass',3,'OK','ELECTRONIC','Harman International USA','ELV-EL-2025-0142',undefined,{supplierAddress:'Harman India, Pune',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Display Brightness (nits)',expected:'800',actual:'812',passed:true,date:'2025-11-30',inspectorId:'INS-222'}],materialTraceability:'Tempered glass + PCB → Harman India Pune batch HAR-F-556'}),
    ])
  },
  {
    vehicleId: 'V-1006', modelName: 'Ertiga', engineNumber: 'K15C-6671208', chassisNumber: 'MA3ERBE3XU6671208',
    manufacturingDate: '2025-07-22', assemblyLineId: 'Line-1A (Manesar)', status: 'Dispatched',
    activeRecalls: [], pastRecalls: [],
    rootPart: mp('root-ER','Ertiga Complete Assembly','ER-ASSY-001','MSIL Manesar','B-ER-250722','2025-07-22','Multi-material',16,'OK','COMPOSITE','MSIL Internal','ELV-2025-ER-001',[
      /* ── STEEL ── */
      mp('er-s01','Front Bumper Reinforcement','BMP-STL-ER-001','Gestamp India','GST-G-701','2025-07-16','HCT590 Steel, 20% Recycled',20,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0621',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'601 MPa',passed:true,date:'2025-07-16',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL ELV-STL-2025-0621 → Gestamp Pune'}),
      mp('er-s02','Sliding Door Rail – Pair','SDR-ER-002','Shiroki India','SHK-G-331','2025-07-17','HSLA Steel, 18% Recycled',18,'OK','STEEL','JSW Steel','ELV-STL-2025-0622',undefined,{supplierAddress:'Shiroki India, Rohtak',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Rail Straightness (mm/m)',expected:'≤0.3',actual:'0.2',passed:true,date:'2025-07-17',inspectorId:'INS-042'}],materialTraceability:'HSLA → JSW Steel ELV-STL-2025-0622 → Shiroki Rohtak'}),
      mp('er-s03','Front Subframe','SBF-ER-003','MSIL Press Shop','MPS-G-991','2025-07-18','HCT780 Steel, 15% Green Steel',15,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0623',undefined,{materialTraceability:'HCT780 → Tata Steel BSL ELV-STL-2025-0623 → MSIL Manesar Press Shop'}),
      /* ── PLASTIC ── */
      mp('er-p01','Front Bumper Fascia','BMP-FR-ER-P01','AutoPlastics Inc.','AP-G-191','2025-07-19','PP 16% Recycled (Target 20%)',16,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0401',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'16%',passed:false,date:'2025-07-19',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'16% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-09-30']}),
      mp('er-p02','Instrument Panel (Dashboard)','IP-ER-P02','Faurecia India','FAU-G-281','2025-07-20','ABS+PC 17% Recycled',17,'OK','PLASTIC','Covestro India','ELV-PL-2025-0402',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-G-881 → Faurecia Pune'}),
      mp('er-p03','Fuel Tank (HDPE)','FT-ER-P03','Inergy Automotive','INA-G-591','2025-07-18','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0403',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('er-b01','12V Lead-Acid Starter Battery','BAT-12V-60AH-ER','Exide Industries','EXD-G-3301','2025-07-21','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0061',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'540A',actual:'548A',passed:true,date:'2025-07-21',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India ELV-BAT-2025-0061 → Exide Hosur'}),
      /* ── SEATS (Flagged compliance) ── */
      mp('er-seats3','3rd Row Seat Assembly','SEAT-ER-3R','TS Tech India','TST-G-667','2025-07-20','Steel Frame, Foam, Fabric 18% Recycled',18,'Flagged','COMPOSITE','Indorama Ventures','ELV-CMT-2025-0011',undefined,{supplierAddress:'TS Tech India, Neemrana',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Fabric Recycled Content (%)',expected:'25%',actual:'18%',passed:false,date:'2025-07-20',inspectorId:'INS-155'}],compliance:[{rule:'MSIL Sustainability Charter FY26',current:'18% Recycled Fabric',required:'25% Recycled Fabric',deadline:'2026-06-30',responsibleParty:'TS Tech India'}],actionItems:['TS Tech India corrective action plan due 2025-09-15']}),
      /* ── ENGINE ── */
      mp('eng-ER','Engine Assembly (K15C)','ENG-K15C-02','Suzuki Motor Gujarat','ENG-B-1102','2025-07-18','Aluminium 30% Recycled',30,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0261',[
        mp('er-ecu','Engine Control Unit (ECU)','ECU-K15C-ER2','Continental AG India','ECU-G-881','2025-07-17','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0151',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW2.4.1',actual:'SW2.4.1',passed:true,date:'2025-07-17',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India ELV-EL-2025-0151 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Compression Ratio',expected:'12.0:1',actual:'12.0:1',passed:true,date:'2025-07-18',inspectorId:'INS-091'}]}),
      /* ── AC SYSTEM ── */
      mp('er-ac','Dual-Zone AC System','AC-ER-DZ-001','Denso India','DNO-G-883','2025-07-21','Aluminium Heat Exchanger, Copper Tubing',20,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0262',undefined,{supplierAddress:'Denso India, Manesar',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Cooling Capacity (kW)',expected:'5.0',actual:'5.1',passed:true,date:'2025-07-21',inspectorId:'INS-180'}],materialTraceability:'Aluminium heat exchanger → Hindalco ELV-ALU-2025-0262 + copper tubing → Denso India Manesar'}),
    ])
  },
  {
    vehicleId: 'V-1007', modelName: 'Dzire', engineNumber: 'K12N-7823401', chassisNumber: 'MA3FCBE1XV7823401',
    manufacturingDate: '2025-06-14', assemblyLineId: 'Line-3A (Gurgaon)', status: 'Dispatched',
    activeRecalls: [], pastRecalls: [],
    rootPart: mp('root-DZ','Dzire Complete Assembly','DZ-ASSY-001','MSIL Gurgaon','B-DZ-250614','2025-06-14','Multi-material',19,'OK','COMPOSITE','MSIL Internal','ELV-2025-DZ-001',[
      /* ── STEEL ── */
      mp('dz-s01','Front Bumper Reinforcement','BMP-STL-DZ-001','Gestamp India','GST-H-801','2025-06-08','HCT590 Steel, 20% Recycled',20,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0641',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'599 MPa',passed:true,date:'2025-06-08',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL ELV-STL-2025-0641 → Gestamp Pune'}),
      mp('dz-s02','Bootlid Assembly','BLD-DZ-002','JBM Auto','JBM-H-441','2025-06-12','Steel 20% Recycled',20,'OK','STEEL','JSW Steel','ELV-STL-2025-0642',undefined,{supplierAddress:'JBM Auto, Gurgaon',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Panel Planarity (mm)',expected:'≤1.5',actual:'1.1',passed:true,date:'2025-06-12',inspectorId:'INS-042'}],materialTraceability:'DC04 steel → JSW Steel ELV-STL-2025-0642 → JBM Auto Gurgaon'}),
      mp('dz-s03','Front Subframe','SBF-DZ-003','MSIL Press Shop','MPS-H-1101','2025-06-09','HCT780 Steel, 14% Green Steel',14,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0643',undefined,{materialTraceability:'HCT780 → Tata Steel BSL ELV-STL-2025-0643 → MSIL Gurgaon Press Shop'}),
      mp('dz-s04','Front Seat Assembly','SEAT-DZ-001','TS Tech India','TST-H-771','2025-06-12','Steel Frame, Fabric 20% Recycled',20,'OK','COMPOSITE','Indorama Ventures','ELV-CMT-2025-0021',undefined,{materialTraceability:'Steel frame + 20% rPET fabric → TS Tech India Gurgaon'}),
      /* ── PLASTIC ── */
      mp('dz-p01','Front Bumper Fascia','BMP-FR-DZ-P01','AutoPlastics Inc.','AP-H-211','2025-06-11','PP 17% Recycled (Target 20%)',17,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0421',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'17%',passed:false,date:'2025-06-11',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'17% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-08-31']}),
      mp('dz-p02','Instrument Panel (Dashboard)','IP-DZ-P02','Faurecia India','FAU-H-291','2025-06-12','ABS+PC 19% Recycled',19,'OK','PLASTIC','Covestro India','ELV-PL-2025-0422',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-H-901 → Faurecia Pune'}),
      mp('dz-p03','Fuel Tank (HDPE)','FT-DZ-P03','Inergy Automotive','INA-H-601','2025-06-10','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0423',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('dz-b01','12V Lead-Acid Starter Battery','BAT-12V-45AH-DZ','Exide Industries','EXD-H-4401','2025-06-13','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0071',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'450A',actual:'455A',passed:true,date:'2025-06-13',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India ELV-BAT-2025-0071 → Exide Hosur'}),
      /* ── ENGINE ── */
      mp('eng-DZ','Engine Assembly (K12N)','ENG-K12N-02','Suzuki Motor Gujarat','ENG-D-992','2025-06-10','Aluminium 35% Recycled',35,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0271',[
        mp('dz-ecu','Engine Control Unit (ECU)','ECU-K12N-DZ2','Continental AG India','ECU-H-991','2025-06-09','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0161',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW2.1.4',actual:'SW2.1.4',passed:true,date:'2025-06-09',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India ELV-EL-2025-0161 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Power Output',expected:'66 kW',actual:'66 kW',passed:true,date:'2025-06-10',inspectorId:'INS-091'}]}),
    ])
  },
  {
    vehicleId: 'V-1008', modelName: 'WagonR', engineNumber: 'K10C-8839021', chassisNumber: 'MA3EWD31XV8839021',
    manufacturingDate: '2025-05-03', assemblyLineId: 'Line-2C (Manesar)', status: 'Dispatched',
    activeRecalls: [], pastRecalls: [],
    rootPart: mp('root-WR','WagonR Complete Assembly','WR-ASSY-001','MSIL Manesar','B-WR-250503','2025-05-03','Multi-material',17,'Flagged','COMPOSITE','MSIL Internal','ELV-2025-WR-001',[
      /* ── STEEL ── */
      mp('wr-s01','Front Bumper Reinforcement','BMP-STL-WR-001','Gestamp India','GST-I-901','2025-04-27','HCT590 Steel, 19% Recycled',19,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0661',undefined,{supplierAddress:'Gestamp India, Pune',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Tensile Strength',expected:'590 MPa',actual:'594 MPa',passed:true,date:'2025-04-27',inspectorId:'INS-031'}],materialTraceability:'HCT590 → Tata Steel BSL ELV-STL-2025-0661 → Gestamp Pune'}),
      mp('wr-s02','Hub – Front Wheel (Pair)','HUB-FR-WR-002','Sona BLW Precision','SBW-I-881','2025-04-28','Forged Steel SAE 1045, 8% Recycled',8,'OK','STEEL','Kalyani Steels','ELV-STL-2025-0662',undefined,{qcLogs:[{parameter:'Runout (mm)',expected:'≤0.05',actual:'0.04',passed:true,date:'2025-04-28',inspectorId:'INS-042'}],materialTraceability:'SAE 1045 → Kalyani Steels ELV-STL-2025-0662 → forged at Sona BLW Manesar'}),
      mp('wr-s03','Front Subframe','SBF-WR-003','MSIL Press Shop','MPS-I-1221','2025-04-29','HCT780 Steel, 13% Green Steel',13,'OK','STEEL','Tata Steel BSL','ELV-STL-2025-0663',undefined,{materialTraceability:'HCT780 → Tata Steel BSL ELV-STL-2025-0663 → MSIL Manesar Press Shop'}),
      /* ── PLASTIC ── */
      mp('wr-p01','Front Bumper Fascia','BMP-FR-WR-P01','AutoPlastics Inc.','AP-I-231','2025-05-01','PP 16% Recycled (Target 20%)',16,'Flagged','PLASTIC','Reliance Industries (rPP)','ELV-PL-2025-0441',undefined,{supplierAddress:'AutoPlastics Inc., Bhiwadi',supplierCertification:'ISO 9001:2015',qcLogs:[{parameter:'Recycled PP Content (%)',expected:'20%',actual:'16%',passed:false,date:'2025-05-01',inspectorId:'INS-055'}],compliance:[{rule:'EPR Plastic Mandate FY26',current:'16% Recycled',required:'20% Recycled',deadline:'2026-03-31',responsibleParty:'AutoPlastics Inc.'}],actionItems:['Supplier corrective action plan by 2025-07-31']}),
      mp('wr-p02','Instrument Panel (Dashboard)','IP-WR-P02','Faurecia India','FAU-I-301','2025-05-01','ABS+PC 16% Recycled',16,'OK','PLASTIC','Covestro India','ELV-PL-2025-0442',undefined,{materialTraceability:'ABS+PC → Covestro India Batch COV-I-921 → Faurecia Pune'}),
      mp('wr-p03','Fuel Tank (HDPE)','FT-WR-P03','Inergy Automotive','INA-I-611','2025-04-30','HDPE 6-layer barrier, 0% Recycled',0,'Under Review','PLASTIC','SABIC India','ELV-PL-2025-0443',undefined,{compliance:[{rule:'REACH Regulation — Barrier Tank',current:'0% rHDPE',required:'5% rHDPE by FY27',deadline:'2027-03-31',responsibleParty:'Inergy Automotive'}]}),
      /* ── BATTERY ── */
      mp('wr-b01','12V Lead-Acid Starter Battery','BAT-12V-45AH-WR','Exide Industries','EXD-I-5501','2025-05-02','Lead 85% Recycled, PP Case',85,'OK','BATTERY','Gravita India (recycled Pb)','ELV-BAT-2025-0081',undefined,{supplierCertification:'ISO 14001, BIS IS 1652',qcLogs:[{parameter:'Cold Cranking Amps',expected:'450A',actual:'457A',passed:true,date:'2025-05-02',inspectorId:'INS-033'}],materialTraceability:'Recycled Pb → Gravita India ELV-BAT-2025-0081 → Exide Hosur'}),
      /* ── SHVS ISG MOTOR (Flagged) ── */
      mp('wr-emot','SHVS Belt ISG Motor','ISG-WR-001','Valeo India','VAL-I-334','2025-05-01','Copper Winding, Rare Earth Magnets',5,'Flagged','COPPER','Valeo France','ELV-COP-2025-0001',undefined,{supplierAddress:'Valeo India, Gurgaon',supplierCertification:'IATF 16949',qcLogs:[{parameter:'Regeneration Efficiency (%)',expected:'92%',actual:'87%',passed:false,date:'2025-05-02',inspectorId:'INS-150'}],materialTraceability:'Copper windings → Valeo France batch VAL-INT-2025-099 → Valeo India Gurgaon',actionItems:['Performance below spec — supplier review open','Valeo India to submit root cause analysis by 2025-07-01']}),
      /* ── ENGINE ── */
      mp('eng-K10C','Engine Assembly (K10C)','ENG-K10C-01','Suzuki Motor Gujarat','ENG-K-223','2025-04-29','Aluminium 32% Recycled',32,'OK','ALUMINIUM','Hindalco Industries','ELV-ALU-2025-0281',[
        mp('wr-ecu','Engine Control Unit (ECU)','ECU-K10C-WR1','Continental AG India','ECU-I-1101','2025-04-28','PCB FR4 + Epoxy Housing',5,'OK','ELECTRONIC','Panasonic India','ELV-EL-2025-0171',undefined,{qcLogs:[{parameter:'Firmware Version',expected:'SW1.5.3',actual:'SW1.5.3',passed:true,date:'2025-04-28',inspectorId:'INS-088'}],materialTraceability:'PCB FR4 → Panasonic India ELV-EL-2025-0171 → Continental Pune'}),
      ],{supplierAddress:'Suzuki Motor Gujarat, Hansalpur',supplierCertification:'IATF 16949:2016',qcLogs:[{parameter:'Power Output',expected:'50 kW',actual:'50 kW',passed:true,date:'2025-04-29',inspectorId:'INS-091'}]}),
    ])
  },
];

export const searchIndex: SearchSuggestion[] = [
  { value: 'K15C-1093847',       label: 'K15C-1093847',       vehicleId: 'V-1001', modelName: 'Grand Vitara',  type: 'Engine Number'  },
  { value: 'MA3EA11S2N1093847',  label: 'MA3EA11S2N1093847',  vehicleId: 'V-1001', modelName: 'Grand Vitara',  type: 'Chassis Number' },
  { value: 'K12M-2039121',       label: 'K12M-2039121',       vehicleId: 'V-1002', modelName: 'Swift',         type: 'Engine Number'  },
  { value: 'MA3FBE1S1P2039121',  label: 'MA3FBE1S1P2039121',  vehicleId: 'V-1002', modelName: 'Swift',         type: 'Chassis Number' },
  { value: 'K12N-3812099',       label: 'K12N-3812099',       vehicleId: 'V-1003', modelName: 'Baleno',        type: 'Engine Number'  },
  { value: 'MA3EWBE1XR3812099',  label: 'MA3EWBE1XR3812099',  vehicleId: 'V-1003', modelName: 'Baleno',        type: 'Chassis Number' },
  { value: 'K15B-4421332',       label: 'K15B-4421332',       vehicleId: 'V-1004', modelName: 'Brezza',        type: 'Engine Number'  },
  { value: 'MA3GLBE1XS4421332',  label: 'MA3GLBE1XS4421332',  vehicleId: 'V-1004', modelName: 'Brezza',        type: 'Chassis Number' },
  { value: 'Z12E-5590012',       label: 'Z12E-5590012',       vehicleId: 'V-1005', modelName: 'Fronx',         type: 'Engine Number'  },
  { value: 'MA3HKBE1XT5590012',  label: 'MA3HKBE1XT5590012',  vehicleId: 'V-1005', modelName: 'Fronx',         type: 'Chassis Number' },
  { value: 'K15C-6671208',       label: 'K15C-6671208',       vehicleId: 'V-1006', modelName: 'Ertiga',        type: 'Engine Number'  },
  { value: 'MA3ERBE3XU6671208',  label: 'MA3ERBE3XU6671208',  vehicleId: 'V-1006', modelName: 'Ertiga',        type: 'Chassis Number' },
  { value: 'K12N-7823401',       label: 'K12N-7823401',       vehicleId: 'V-1007', modelName: 'Dzire',         type: 'Engine Number'  },
  { value: 'MA3FCBE1XV7823401',  label: 'MA3FCBE1XV7823401',  vehicleId: 'V-1007', modelName: 'Dzire',         type: 'Chassis Number' },
  { value: 'K10C-8839021',       label: 'K10C-8839021',       vehicleId: 'V-1008', modelName: 'WagonR',        type: 'Engine Number'  },
  { value: 'MA3EWD31XV8839021',  label: 'MA3EWD31XV8839021',  vehicleId: 'V-1008', modelName: 'WagonR',        type: 'Chassis Number' },
];

export const detectIdentifierType = (q: string): 'Engine Number' | 'Chassis Number' | 'Unknown' => {
  const u = q.toUpperCase().trim();
  if (/^[A-Z0-9]{17}$/.test(u)) return 'Chassis Number';
  if (/^[A-Z0-9]{2,4}-[A-Z0-9]{6,8}$/.test(u)) return 'Engine Number';
  return 'Unknown';
};

export const findVehicle = (query: string): VehicleTrace | undefined => {
  const q = query.trim().toUpperCase();
  return mockVehicles.find(v => v.engineNumber.toUpperCase().includes(q) || v.chassisNumber.toUpperCase().includes(q));
};

export const computeAlertPaths = (root: PartNode): Set<string> => {
  const ids = new Set<string>();
  const mark = (n: PartNode, path: string[]) => {
    const p = [...path, n.id];
    if (n.status === 'Flagged' || n.status === 'Recalled') p.forEach(id => ids.add(id));
    n.children?.forEach(c => mark(c, p));
  };
  mark(root, []);
  return ids;
};

export const countNodes = (root: PartNode): number => {
  let c = 1;
  root.children?.forEach(ch => { c += countNodes(ch); });
  return c;
};

export const partsAIInsights: PartsAIInsight[] = [
  { id: 1, title: 'Batch Anomaly — Fuel Pump Flow Rate', explanation: 'Batch L-2204 fuel pump flow readings are 18% below fleet average for FP-88321-A across Grand Vitara production since 2023. Immediate quarantine review is warranted.', confidence: 'High', category: 'Anomaly', dataBasis: 'Compared 1,240 QA records across 3 assembly lines. Z-score: -3.2 (p < 0.001).' },
  { id: 2, title: 'Supplier Risk — AutoPlastics Inc.', explanation: 'AutoPlastics Inc. has 3 compliance flags in Q3-Q4 FY25 across 7 models for failing to meet recycled content mandates. High risk of persistent supply gap.', confidence: 'High', category: 'Risk', dataBasis: 'MatNEXT Supplier Graph + MoEFCC EPR audit logs Q3-Q4 FY25.' },
  { id: 3, title: 'EPR Compliance Gap — Plastic Components', explanation: 'Vehicle overall recycled plastic content (16.2%) is below the FY2025-26 mandate of 20%. Primary driver: Front Bumper Fascia from AutoPlastics Inc.', confidence: 'Medium', category: 'Compliance', dataBasis: 'BOM weight-averaged recycled content vs. MoEFCC ELV Mandate Clause 4.2.' },
  { id: 4, title: 'Predictive Maintenance — ECU Firmware', explanation: 'ECU firmware SW2.4.1 on K15C engines shows 2.1% field failure at 80,000–90,000km in Continental AG batches. Pre-emptive OTA update recommended.', confidence: 'Low', category: 'Predictive', dataBasis: 'Warranty claim DB — 4,200 vehicles, 36-month cohort, ECU batches B-290 to B-350.' },
  { id: 5, title: 'Recall Impact — Fuel Pump Batch L-2204', explanation: 'Batch L-2204 was distributed across ~1,420 vehicles produced between 2025-09-20 and 2025-10-20 at Gurgaon Line-2A. REC-2026-001 scope should expand to cover these.', confidence: 'High', category: 'Recall', dataBasis: 'Assembly line traceability logs + Denso India dispatch records for batch L-2204.' },
];
