// OEM Competitor Analysis — Master Data Layer
// All data is mock/simulated based on publicly available RVSF registry, MoRTH/V-SCRAP data,
// and realistic ELV processing rates for India (mid-2025 baseline).

import liveDataRaw from './liveData.json';
import { elvRvsfRegistry } from './dashboardData';
const _oemLive = (liveDataRaw as { oemCompetitor?: { monthlyOverrides?: Record<string, Record<string, number>>; rcOriginOverrides?: Record<string, Record<string, number>> } }).oemCompetitor ?? {};
const _monthlyOverrides: Record<string, Record<string, number>> = _oemLive.monthlyOverrides ?? {};
const _rcOriginOverrides: Record<string, Record<string, number>> = _oemLive.rcOriginOverrides ?? {};

// ─── State geo-centers (for RC origin map) ──────────────────────────────────
export const stateCoords: Record<string, [number, number]> = {
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
  'Himachal Pradesh': [31.1048, 77.1734],
  'Chandigarh': [30.7333, 76.7794],
  'Goa': [15.2993, 74.1240],
  'Manipur': [24.6637, 93.9063],
  'Meghalaya': [25.4670, 91.3662],
  'Tripura': [23.9408, 91.9882],
  'Ladakh': [34.1526, 77.5771],
};

// ─── OEM Master List ─────────────────────────────────────────────────────────
export interface OEMInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  description: string;
  annualCapacity: number;
}

export const oemList: OEMInfo[] = [
  { id: 'hero', name: 'Hero MotoCorp', shortName: 'Hero', color: '#E31E24', bgColor: '#fde8e8', description: 'Two-wheeler OEM. No dedicated RVSF as of mid-2025. EPR compliance via authorised partners.', annualCapacity: 0 },
  { id: 'honda', name: 'Honda Cars India', shortName: 'Honda', color: '#CC0000', bgColor: '#fde8e8', description: 'No OEM-owned RVSF. Operates via MoU with MSTI (Maruti Suzuki Toyotsu India). Vehicles routed to MSTI Noida.', annualCapacity: 24000 },
  { id: 'hyundai', name: 'Hyundai Motor India', shortName: 'Hyundai', color: '#002C5F', bgColor: '#e6eaf5', description: 'No dedicated OEM RVSF as of mid-2025. Partners with authorised RVSFs for ELV collection under EPR framework.', annualCapacity: 0 },
  { id: 'kia', name: 'Kia India', shortName: 'Kia', color: '#BB162B', bgColor: '#fde8eb', description: 'No dedicated OEM RVSF. EPR compliance through registered RVSF network.', annualCapacity: 0 },
  { id: 'mahindra', name: 'Mahindra & Mahindra (CERO)', shortName: 'M&M', color: '#E31837', bgColor: '#fdeaed', description: 'CERO — JV: Mahindra Accelo Ltd. + MSTC Ltd. (Govt. of India). 9 full dismantling plants + 5 collection touchpoints.', annualCapacity: 195000 },
  { id: 'msil', name: 'Maruti Suzuki India (MSIL / MSTI)', shortName: 'MSIL', color: '#003087', bgColor: '#e8f0fa', description: 'JV: Maruti Suzuki India Ltd. + Toyota Tsusho Group. Operates MSTI Noida (India\'s first branded OEM scrapping facility) and TT Recycling Management India, Ahmedabad.', annualCapacity: 32000 },
  { id: 'renault', name: 'Renault India', shortName: 'Renault', color: '#F0C300', bgColor: '#fdf8dc', description: 'No dedicated OEM RVSF. EPR compliance via authorised scrapping partners.', annualCapacity: 0 },
  { id: 'stellantis', name: 'Stellantis India (Citroën / Jeep)', shortName: 'Stellantis', color: '#7A2182', bgColor: '#f3e8f6', description: 'No dedicated OEM RVSF. EPR compliance via authorised scrapping partners.', annualCapacity: 0 },
  { id: 'suzuki_moto', name: 'Suzuki Motorcycle India', shortName: 'SMIPL', color: '#005BAC', bgColor: '#e6eef8', description: 'Two-wheeler OEM. No dedicated RVSF. EPR compliance via authorised partners.', annualCapacity: 0 },
  { id: 'tata', name: 'Tata Motors (Re.Wi.Re)', shortName: 'Tata', color: '#00388B', bgColor: '#e8eef9', description: 'Re.Wi.Re (Recycle with Respect) — Tata Motors\' pan-India ELV network with 10 partner-operated facilities.', annualCapacity: 167000 },
  { id: 'toyota', name: 'Toyota Kirloskar Motor', shortName: 'Toyota', color: '#EB0A1E', bgColor: '#fde8ea', description: 'Toyota Tsusho is a 50% JV partner in MSTI (alongside Maruti Suzuki). MSTI Noida is the associated facility.', annualCapacity: 24000 },
  { id: 'tvs', name: 'TVS Motor Company', shortName: 'TVS', color: '#E2211C', bgColor: '#fde8e8', description: 'Two-wheeler OEM. Operates 1 registered RVSF at Besthmanahalli, Bengaluru Rural, Karnataka (V-SCRAP/MoRTH registered). EPR compliance via own facility and authorised partners.', annualCapacity: 12000 },
];

// ─── RVSF Master List ────────────────────────────────────────────────────────
export interface RVSFInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  capacityPerYear: number;
  oems: string[];
  type: 'full_dismantling' | 'collection_touchpoint';
  operatingPartner?: string;
  status: 'active' | 'upcoming' | 'inactive';
}

export const rvsfMaster: RVSFInfo[] = [
  // MSIL / MSTI
  { id: 'msti_noida', name: 'MSTI — Noida', city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, capacityPerYear: 24000, oems: ['msil', 'honda', 'toyota'], type: 'full_dismantling', operatingPartner: 'Maruti Suzuki Toyotsu India Pvt. Ltd.', status: 'active' },
  { id: 'tt_recycling_ahmedabad', name: 'TT Recycling Management India — Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lat: 23.20, lng: 72.50, capacityPerYear: 8000, oems: ['msil'], type: 'full_dismantling', operatingPartner: 'TT Recycling Management India Pvt. Ltd.', status: 'active' },
  // Tata Motors Re.Wi.Re
  { id: 'rewire_jaipur', name: 'Re.Wi.Re — Jaipur', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, capacityPerYear: 15000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Ganganagar Vaahan Udyog Pvt. Ltd.', status: 'active' },
  { id: 'rewire_bhubaneswar', name: 'Re.Wi.Re — Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, capacityPerYear: 10000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Shree Ambica Auto', status: 'active' },
  { id: 'rewire_surat', name: 'Re.Wi.Re — Surat', city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, capacityPerYear: 12000, oems: ['tata'], type: 'full_dismantling', status: 'active' },
  { id: 'rewire_chandigarh', name: 'Re.Wi.Re — Chandigarh', city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, capacityPerYear: 12000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Dada Trading Company', status: 'active' },
  { id: 'rewire_delhi', name: 'Re.Wi.Re — Delhi NCR', city: 'Delhi NCR', state: 'Haryana', lat: 28.5204, lng: 77.0894, capacityPerYear: 18000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Johar Motors', status: 'active' },
  { id: 'rewire_pune', name: 'Re.Wi.Re — Pune', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, capacityPerYear: 21000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Tata International Vehicle Applications (TIVA)', status: 'active' },
  { id: 'rewire_guwahati', name: 'Re.Wi.Re — Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, capacityPerYear: 15000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Axom Platinum Scrappers', status: 'active' },
  { id: 'rewire_kolkata', name: 'Re.Wi.Re — Kolkata', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, capacityPerYear: 21000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Selladale Synergies India Pvt. Ltd.', status: 'active' },
  { id: 'rewire_lucknow', name: 'Re.Wi.Re — Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, capacityPerYear: 15000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Moto Scrapland Pvt. Ltd.', status: 'active' },
  { id: 'rewire_raipur', name: 'Re.Wi.Re — Raipur', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, capacityPerYear: 25000, oems: ['tata'], type: 'full_dismantling', operatingPartner: 'Raipur Green Energy Pvt. Ltd.', status: 'active' },
  // Mahindra CERO — Full Dismantling Plants
  { id: 'cero_greater_noida', name: 'CERO — Greater Noida', city: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040, capacityPerYear: 25000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_chennai', name: 'CERO — Chennai (Sriperumbudur)', city: 'Sriperumbudur', state: 'Tamil Nadu', lat: 12.9681, lng: 79.9453, capacityPerYear: 20000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_pune', name: 'CERO — Pune', city: 'Pune', state: 'Maharashtra', lat: 18.6298, lng: 73.7997, capacityPerYear: 22000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_bengaluru', name: 'CERO — Bengaluru (Devanahalli)', city: 'Devanahalli', state: 'Karnataka', lat: 13.2472, lng: 77.7117, capacityPerYear: 20000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_ahmedabad', name: 'CERO — Ahmedabad (Kheda)', city: 'Kheda', state: 'Gujarat', lat: 22.7559, lng: 72.6849, capacityPerYear: 18000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_indore', name: 'CERO — Indore', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, capacityPerYear: 15000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_hyderabad', name: 'CERO — Hyderabad (Tupran)', city: 'Tupran', state: 'Telangana', lat: 17.8025, lng: 78.2855, capacityPerYear: 18000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_guwahati', name: 'CERO — Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.1630, lng: 91.7014, capacityPerYear: 12000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_chandigarh', name: 'CERO — Chandigarh', city: 'Chandigarh', state: 'Chandigarh', lat: 30.7500, lng: 76.8100, capacityPerYear: 12000, oems: ['mahindra'], type: 'full_dismantling', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  // Mahindra CERO — Collection Touchpoints
  { id: 'cero_kolkata', name: 'CERO — Kolkata', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.4200, capacityPerYear: 8000, oems: ['mahindra'], type: 'collection_touchpoint', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_mumbai', name: 'CERO — Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, capacityPerYear: 10000, oems: ['mahindra'], type: 'collection_touchpoint', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_jaipur', name: 'CERO — Jaipur', city: 'Jaipur', state: 'Rajasthan', lat: 26.9300, lng: 75.8100, capacityPerYear: 6000, oems: ['mahindra'], type: 'collection_touchpoint', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_nagpur', name: 'CERO — Nagpur', city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, capacityPerYear: 7000, oems: ['mahindra'], type: 'collection_touchpoint', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  { id: 'cero_bhopal', name: 'CERO — Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, capacityPerYear: 6000, oems: ['mahindra'], type: 'collection_touchpoint', operatingPartner: 'Mahindra MSTC Recycling Pvt. Ltd.', status: 'active' },
  // TVS Motor Company — OEM-affiliated (V-SCRAP registered)
  { id: 'ka_tvs_bengaluru', name: 'TVS Motor Company RVSF — Bengaluru Rural', city: 'Besthmanahalli', state: 'Karnataka', lat: 13.0975, lng: 77.3937, capacityPerYear: 12000, oems: ['tvs'], type: 'full_dismantling', operatingPartner: 'TVS Motor Company Limited', status: 'active' },
  // Independent / Non-OEM-affiliated RVSFs (V-SCRAP registered)
  // Kerala
  { id: 'kl_silk_thrissur', name: 'SILK RVSF — Thrissur', city: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, capacityPerYear: 8000, oems: [], type: 'full_dismantling', operatingPartner: 'SILK (State Industries Liaison & Krishitantra)', status: 'active' },
  { id: 'kl_kozhikode', name: 'Kozhikode Auto Recyclers', city: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, capacityPerYear: 6000, oems: [], type: 'full_dismantling', status: 'active' },
  // Haryana (24 registered RVSFs in V-SCRAP — largest state count)
  { id: 'hr_jd_bahadurgarh', name: 'J.D. Auto Scrap Pvt. Ltd. — Bahadurgarh', city: 'Bahadurgarh', state: 'Haryana', lat: 28.6944, lng: 76.9277, capacityPerYear: 14000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'hr_gurugram_metal', name: 'Gurugram Metal Recyclers Pvt. Ltd.', city: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, capacityPerYear: 12000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'hr_faridabad_auto', name: 'Faridabad Auto Scrapping India Pvt. Ltd.', city: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  // Uttar Pradesh (91 registered RVSFs in V-SCRAP — real operators)
  { id: 'up_seven_star', name: 'Seven Star Auto Scraping India Pvt. Ltd. — Ghaziabad', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, capacityPerYear: 18000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_saral_morta', name: 'Saral Auto Scraping India Pvt. Ltd. — Morta', city: 'Morta', state: 'Uttar Pradesh', lat: 28.7027, lng: 77.4820, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  // Maharashtra
  { id: 'mh_nashik_auto', name: 'Nashik Auto Recyclers Pvt. Ltd.', city: 'Nashik', state: 'Maharashtra', lat: 20.0059, lng: 73.7758, capacityPerYear: 12000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'mh_thane_scrap', name: 'Thane Scrap Processing Centre', city: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  // Gujarat
  { id: 'gj_vadodara', name: 'Vadodara Auto Scrap Pvt. Ltd.', city: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'gj_rajkot', name: 'Rajkot Metal Works Pvt. Ltd.', city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  // Tamil Nadu
  { id: 'tn_coimbatore', name: 'Coimbatore Auto Dismantlers Pvt. Ltd.', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'tn_madurai', name: 'Madurai Vehicle Recyclers Pvt. Ltd.', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Karnataka
  { id: 'ka_hubli_scrap', name: 'Hubli Auto Scrap Centre', city: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Andhra Pradesh
  { id: 'ap_vijayawada', name: 'Vijayawada Auto Recyclers Pvt. Ltd.', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'ap_vizag', name: 'Visakhapatnam Metal Scrap Pvt. Ltd.', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  // Telangana
  { id: 'tg_hyderabad_ind', name: 'Hyderabad Metal Works Pvt. Ltd.', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  // Rajasthan
  { id: 'rj_jodhpur', name: 'Jodhpur Auto Scrap Pvt. Ltd.', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Punjab
  { id: 'pb_ludhiana', name: 'Ludhiana Auto Metal Works Pvt. Ltd.', city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  // West Bengal
  { id: 'wb_durgapur', name: 'Durgapur Auto Recyclers Pvt. Ltd.', city: 'Durgapur', state: 'West Bengal', lat: 23.4800, lng: 87.3119, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  // Bihar
  { id: 'br_patna', name: 'Patna Vehicle Recyclers Pvt. Ltd.', city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Jharkhand
  { id: 'jh_dhanbad', name: 'Dhanbad Auto Scrap Pvt. Ltd.', city: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Madhya Pradesh
  { id: 'mp_jabalpur', name: 'Jabalpur Auto Recyclers Pvt. Ltd.', city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Delhi
  { id: 'dl_badarpur', name: 'Badarpur Metal Works Pvt. Ltd.', city: 'Delhi', state: 'Delhi', lat: 28.5022, lng: 77.3228, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  // Uttarakhand
  { id: 'uk_dehradun', name: 'Dehradun Auto Scrap Pvt. Ltd.', city: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, capacityPerYear: 6000, oems: [], type: 'full_dismantling', status: 'active' },
  // Himachal Pradesh
  { id: 'hp_solan', name: 'Solan Metal Works', city: 'Solan', state: 'Himachal Pradesh', lat: 30.9045, lng: 77.0967, capacityPerYear: 5000, oems: [], type: 'full_dismantling', status: 'active' },
  // Chhattisgarh
  { id: 'cg_bilaspur', name: 'Bilaspur Auto Recyclers Pvt. Ltd.', city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1391, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Odisha
  { id: 'od_rourkela', name: 'Rourkela Metal Recyclers Pvt. Ltd.', city: 'Rourkela', state: 'Odisha', lat: 22.2270, lng: 84.8643, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Goa
  { id: 'ga_panaji', name: 'Goa Auto Scrap Centre', city: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, capacityPerYear: 4000, oems: [], type: 'full_dismantling', status: 'active' },
  // ─── Extended Independent RVSF Coverage (V-SCRAP registered, pan-India) ──────
  // Uttar Pradesh (additional — 91 RVSFs registered state-wide in V-SCRAP)
  { id: 'up_agra_auto', name: 'Agra Auto Scrap Pvt. Ltd.', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, capacityPerYear: 12000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_kanpur_auto', name: 'Kanpur Auto Dismantlers Pvt. Ltd.', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_varanasi_auto', name: 'Varanasi Vehicle Recyclers Pvt. Ltd.', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_meerut_scrap', name: 'Meerut Auto Scrap Centre Pvt. Ltd.', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_prayagraj_metal', name: 'Prayagraj Metal Works Pvt. Ltd.', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_bareilly_auto', name: 'Bareilly Auto Recyclers Pvt. Ltd.', city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_aligarh_scrap', name: 'Aligarh Auto Scrap Centre', city: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'up_gorakhpur_auto', name: 'Gorakhpur Vehicle Scrap Pvt. Ltd.', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Haryana (additional — 24 RVSFs registered state-wide)
  { id: 'hr_ambala_auto', name: 'Ambala Auto Scrap Pvt. Ltd.', city: 'Ambala', state: 'Haryana', lat: 30.3784, lng: 76.7767, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'hr_panipat_scrap', name: 'Panipat Auto Recyclers Pvt. Ltd.', city: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'hr_hisar_metal', name: 'Hisar Metal Works Pvt. Ltd.', city: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'hr_rohtak_auto', name: 'Rohtak Auto Scrap Centre Pvt. Ltd.', city: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'hr_karnal_auto', name: 'Karnal Auto Scrap Pvt. Ltd.', city: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Delhi (additional)
  { id: 'dl_rohini_auto', name: 'Rohini Auto Scrap Pvt. Ltd.', city: 'Delhi', state: 'Delhi', lat: 28.7495, lng: 77.0682, capacityPerYear: 12000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'dl_okhla_metal', name: 'Okhla Industrial Auto Recyclers Pvt. Ltd.', city: 'Delhi', state: 'Delhi', lat: 28.5372, lng: 77.2651, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'dl_narela_scrap', name: 'Narela Auto Scrap Centre Pvt. Ltd.', city: 'Delhi', state: 'Delhi', lat: 28.8523, lng: 77.0922, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  // Maharashtra (additional)
  { id: 'mh_aurangabad_auto', name: 'Aurangabad Auto Recyclers Pvt. Ltd.', city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'mh_kolhapur_metal', name: 'Kolhapur Metal Works Pvt. Ltd.', city: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'mh_solapur_auto', name: 'Solapur Auto Scrap Centre Pvt. Ltd.', city: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'mh_navi_mumbai_auto', name: 'Navi Mumbai Auto Recyclers Pvt. Ltd.', city: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297, capacityPerYear: 13000, oems: [], type: 'full_dismantling', status: 'active' },
  // Gujarat (additional)
  { id: 'gj_surat_scrap', name: 'Surat Auto Recyclers Pvt. Ltd.', city: 'Surat', state: 'Gujarat', lat: 21.2010, lng: 72.8270, capacityPerYear: 12000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'gj_bhavnagar_auto', name: 'Bhavnagar Auto Recyclers Pvt. Ltd.', city: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'gj_anand_metal', name: 'Anand Metal Works Pvt. Ltd.', city: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Tamil Nadu (additional)
  { id: 'tn_trichy_auto', name: 'Trichy Auto Recyclers Pvt. Ltd.', city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'tn_salem_metal', name: 'Salem Metal Works Pvt. Ltd.', city: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'tn_tirunelveli_auto', name: 'Tirunelveli Auto Recyclers Pvt. Ltd.', city: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Karnataka (additional independent)
  { id: 'ka_mysuru_auto', name: 'Mysuru Auto Recyclers Pvt. Ltd.', city: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'ka_mangaluru_metal', name: 'Mangaluru Metal Works Pvt. Ltd.', city: 'Mangaluru', state: 'Karnataka', lat: 12.9141, lng: 74.8560, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'ka_tumkur_scrap', name: 'Tumkur Auto Scrap Centre', city: 'Tumkur', state: 'Karnataka', lat: 13.3379, lng: 77.1025, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Rajasthan (additional)
  { id: 'rj_kota_auto', name: 'Kota Auto Recyclers Pvt. Ltd.', city: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'rj_udaipur_metal', name: 'Udaipur Metal Works Pvt. Ltd.', city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'rj_ajmer_scrap', name: 'Ajmer Auto Scrap Centre', city: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Madhya Pradesh (additional)
  { id: 'mp_gwalior_auto', name: 'Gwalior Auto Scrap Pvt. Ltd.', city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'mp_ujjain_metal', name: 'Ujjain Metal Works Pvt. Ltd.', city: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1793, lng: 75.7849, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Punjab (additional)
  { id: 'pb_amritsar_auto', name: 'Amritsar Auto Scrap Pvt. Ltd.', city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, capacityPerYear: 11000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'pb_jalandhar_metal', name: 'Jalandhar Metal Works Pvt. Ltd.', city: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'pb_patiala_scrap', name: 'Patiala Auto Recyclers Pvt. Ltd.', city: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'pb_bathinda_auto', name: 'Bathinda Auto Scrap Centre', city: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Andhra Pradesh (additional)
  { id: 'ap_nellore_auto', name: 'Nellore Auto Recyclers Pvt. Ltd.', city: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'ap_kurnool_metal', name: 'Kurnool Metal Works Pvt. Ltd.', city: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'ap_tirupati_scrap', name: 'Tirupati Auto Scrap Centre', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  // Telangana (additional)
  { id: 'tg_warangal_auto', name: 'Warangal Auto Recyclers Pvt. Ltd.', city: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'tg_nizamabad_metal', name: 'Nizamabad Metal Works Pvt. Ltd.', city: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // West Bengal (additional)
  { id: 'wb_siliguri_auto', name: 'Siliguri Auto Scrap Pvt. Ltd.', city: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'wb_howrah_metal', name: 'Howrah Metal Works Pvt. Ltd.', city: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'wb_asansol_auto', name: 'Asansol Auto Recyclers Pvt. Ltd.', city: 'Asansol', state: 'West Bengal', lat: 23.6838, lng: 86.9737, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Bihar (additional)
  { id: 'br_gaya_auto', name: 'Gaya Auto Scrap Pvt. Ltd.', city: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 84.9994, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'br_muzaffarpur_metal', name: 'Muzaffarpur Metal Works Pvt. Ltd.', city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Jharkhand (additional)
  { id: 'jh_jamshedpur_auto', name: 'Jamshedpur Auto Recyclers Pvt. Ltd.', city: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'jh_ranchi_metal', name: 'Ranchi Metal Works Pvt. Ltd.', city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Odisha (additional)
  { id: 'od_cuttack_auto', name: 'Cuttack Auto Scrap Pvt. Ltd.', city: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8830, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Uttarakhand (additional)
  { id: 'uk_haridwar_auto', name: 'Haridwar Auto Recyclers Pvt. Ltd.', city: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Himachal Pradesh (additional)
  { id: 'hp_baddi_auto', name: 'Baddi Auto Scrap Pvt. Ltd.', city: 'Baddi', state: 'Himachal Pradesh', lat: 30.9598, lng: 76.7905, capacityPerYear: 7000, oems: [], type: 'full_dismantling', status: 'active' },
  // Chhattisgarh (additional)
  { id: 'cg_durg_auto', name: 'Durg Auto Recyclers Pvt. Ltd.', city: 'Durg', state: 'Chhattisgarh', lat: 21.1904, lng: 81.2849, capacityPerYear: 8000, oems: [], type: 'full_dismantling', status: 'active' },
  // Assam (new — 0 independent so far)
  { id: 'as_dibrugarh_auto', name: 'Dibrugarh Auto Scrap Pvt. Ltd.', city: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.9120, capacityPerYear: 6000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'as_silchar_metal', name: 'Silchar Auto Recyclers Pvt. Ltd.', city: 'Silchar', state: 'Assam', lat: 24.8333, lng: 92.7789, capacityPerYear: 5000, oems: [], type: 'full_dismantling', status: 'active' },
  // Kerala (additional)
  { id: 'kl_trivandrum_auto', name: 'Thiruvananthapuram Auto Scrap Pvt. Ltd.', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, capacityPerYear: 9000, oems: [], type: 'full_dismantling', status: 'active' },
  { id: 'kl_kochi_metal', name: 'Kochi Metal Works Pvt. Ltd.', city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, capacityPerYear: 10000, oems: [], type: 'full_dismantling', status: 'active' },
];

// ─── Augment rvsfMaster with all real RVSFs from ELV registry ────────────────
// OEM-affiliated elvIds already covered by tracked rvsfMaster entries above
const _coveredELVIds = new Set([
  'RVSF-001','CH-001','DL-001','RVSF-004','AS-005','RVSF-009','RVSF-020',
  'CG-001','UP-N043','RVSF-007','RVSF-003','RVSF-002','RVSF-015','RVSF-008',
  'RVSF-013','RVSF-010','RVSF-014','MP-001','GJ-010','KA-003','UP-N046',
]);
elvRvsfRegistry
  .filter(r => !_coveredELVIds.has(r.rvsfId) && r.lat != null && r.lng != null)
  .forEach(r => rvsfMaster.push({
    id: r.rvsfId,
    name: r.name,
    city: r.district,
    state: r.state,
    lat: r.lat!,
    lng: r.lng!,
    capacityPerYear: r.capacityPerYear,
    oems: [],
    type: 'full_dismantling',
    status: r.status,
  }));

// ─── OEM → RVSF Mapping ──────────────────────────────────────────────────────
export const oemRvsfMapping: Record<string, string[]> = {
  hero: [],
  msil: ['msti_noida', 'tt_recycling_ahmedabad'],
  tata: ['rewire_jaipur', 'rewire_bhubaneswar', 'rewire_surat', 'rewire_chandigarh', 'rewire_delhi', 'rewire_pune', 'rewire_guwahati', 'rewire_kolkata', 'rewire_lucknow', 'rewire_raipur'],
  mahindra: ['cero_greater_noida', 'cero_chennai', 'cero_pune', 'cero_bengaluru', 'cero_ahmedabad', 'cero_indore', 'cero_hyderabad', 'cero_guwahati', 'cero_chandigarh', 'cero_kolkata', 'cero_mumbai', 'cero_jaipur', 'cero_nagpur', 'cero_bhopal'],
  honda: ['msti_noida'],
  toyota: ['msti_noida'],
  hyundai: [],
  kia: [],
  renault: [],
  stellantis: [],
  suzuki_moto: [],
  tvs: ['ka_tvs_bengaluru'],
};

// ─── Monthly Data — 24 months (May 2024 → Apr 2026) ─────────────────────────
// Full 2-year range so date picker actually changes data.
export const allMonths = [
  'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024',
  'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025',
  'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025',
  'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026',
];

// Deterministic pseudo-random
const seeded = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return Math.round(min + r * (max - min));
};

// Seasonal utilization pattern — 24 months (year 2 is higher due to industry ramp-up)
const monthUtil24 = [
  0.78, 0.82, 0.85, 0.90, 0.87, 0.84, 0.81, 0.88, 0.92, 0.86, 0.90, 0.83,
  0.85, 0.88, 0.92, 0.97, 0.95, 0.93, 0.90, 0.96, 1.0, 0.94, 1.05, 0.98,
];

export interface MonthlyCollection { month: string; count: number; }
export interface MonthlyMaterial {
  month: string;
  steelKg: number; plasticKg: number; aluminiumKg: number;
  castIronKg: number; rubberKg: number; copperKg: number;
  ewasteKg: number; liionKg: number; zincKg: number;
  usedOilKg: number; freonKg: number; platinumGrams: number;
}
export interface RCOriginState { state: string; lat: number; lng: number; count: number; }

// ─── Filter utility — used by the tab to slice data by date range ────────────
export const filterDataByMonths = <T extends { month: string }>(data: T[], months: string[]): T[] => {
  const set = new Set(months);
  return data.filter(d => set.has(d.month));
};

// RC Origin distribution per RVSF (which states vehicles came from — RC data)
const rcOriginDistributions: Record<string, Record<string, number>> = {
  msti_noida: { 'Uttar Pradesh': 38, 'Delhi': 27, 'Haryana': 16, 'Punjab': 7, 'Rajasthan': 6, 'Uttarakhand': 4, 'Bihar': 2 },
  rewire_jaipur: { 'Rajasthan': 55, 'Delhi': 16, 'Haryana': 12, 'Gujarat': 8, 'Madhya Pradesh': 6, 'Uttar Pradesh': 3 },
  rewire_bhubaneswar: { 'Odisha': 58, 'West Bengal': 18, 'Jharkhand': 14, 'Andhra Pradesh': 6, 'Chhattisgarh': 4 },
  rewire_surat: { 'Gujarat': 60, 'Maharashtra': 20, 'Rajasthan': 10, 'Madhya Pradesh': 7, 'Goa': 3 },
  rewire_chandigarh: { 'Punjab': 40, 'Haryana': 25, 'Himachal Pradesh': 14, 'Delhi': 11, 'Uttar Pradesh': 7, 'Uttarakhand': 3 },
  rewire_delhi: { 'Delhi': 35, 'Haryana': 28, 'Uttar Pradesh': 22, 'Rajasthan': 10, 'Punjab': 5 },
  rewire_pune: { 'Maharashtra': 62, 'Karnataka': 14, 'Gujarat': 10, 'Goa': 8, 'Telangana': 4, 'Andhra Pradesh': 2 },
  rewire_guwahati: { 'Assam': 58, 'Meghalaya': 16, 'Manipur': 12, 'Tripura': 8, 'West Bengal': 6 },
  rewire_kolkata: { 'West Bengal': 55, 'Bihar': 18, 'Jharkhand': 14, 'Odisha': 8, 'Assam': 5 },
  rewire_lucknow: { 'Uttar Pradesh': 62, 'Bihar': 16, 'Madhya Pradesh': 10, 'Delhi': 8, 'Rajasthan': 4 },
  rewire_raipur: { 'Chhattisgarh': 58, 'Madhya Pradesh': 18, 'Jharkhand': 12, 'Odisha': 8, 'Maharashtra': 4 },
  cero_greater_noida: { 'Uttar Pradesh': 40, 'Delhi': 26, 'Haryana': 18, 'Punjab': 8, 'Rajasthan': 5, 'Uttarakhand': 3 },
  cero_chennai: { 'Tamil Nadu': 62, 'Andhra Pradesh': 16, 'Karnataka': 12, 'Kerala': 6, 'Telangana': 4 },
  cero_pune: { 'Maharashtra': 58, 'Karnataka': 16, 'Gujarat': 12, 'Goa': 8, 'Telangana': 4, 'Andhra Pradesh': 2 },
  cero_bengaluru: { 'Karnataka': 55, 'Andhra Pradesh': 18, 'Tamil Nadu': 14, 'Telangana': 8, 'Kerala': 5 },
  cero_ahmedabad: { 'Gujarat': 62, 'Rajasthan': 18, 'Maharashtra': 12, 'Madhya Pradesh': 6, 'Goa': 2 },
  cero_indore: { 'Madhya Pradesh': 58, 'Rajasthan': 18, 'Maharashtra': 12, 'Gujarat': 8, 'Chhattisgarh': 4 },
  cero_hyderabad: { 'Telangana': 55, 'Andhra Pradesh': 22, 'Karnataka': 12, 'Maharashtra': 7, 'Tamil Nadu': 4 },
  cero_guwahati: { 'Assam': 60, 'Meghalaya': 15, 'Manipur': 12, 'Tripura': 8, 'West Bengal': 5 },
  cero_chandigarh: { 'Punjab': 42, 'Haryana': 26, 'Himachal Pradesh': 14, 'Delhi': 10, 'Uttar Pradesh': 8 },
  cero_kolkata: { 'West Bengal': 62, 'Bihar': 16, 'Jharkhand': 12, 'Odisha': 7, 'Assam': 3 },
  cero_mumbai: { 'Maharashtra': 70, 'Gujarat': 15, 'Karnataka': 8, 'Goa': 5, 'Andhra Pradesh': 2 },
  cero_jaipur: { 'Rajasthan': 65, 'Delhi': 15, 'Haryana': 12, 'Gujarat': 5, 'Madhya Pradesh': 3 },
  cero_nagpur: { 'Maharashtra': 55, 'Madhya Pradesh': 22, 'Chhattisgarh': 14, 'Telangana': 6, 'Andhra Pradesh': 3 },
  cero_bhopal: { 'Madhya Pradesh': 62, 'Rajasthan': 18, 'Maharashtra': 10, 'Chhattisgarh': 7, 'Gujarat': 3 },
  // TVS RVSF (OEM-affiliated)
  ka_tvs_bengaluru: { 'Karnataka': 50, 'Tamil Nadu': 22, 'Andhra Pradesh': 12, 'Kerala': 8, 'Telangana': 8 },
  // Independent RVSFs (V-SCRAP registered)
  kl_silk_thrissur: { 'Kerala': 80, 'Tamil Nadu': 12, 'Karnataka': 5, 'Andhra Pradesh': 3 },
  kl_kozhikode: { 'Kerala': 75, 'Tamil Nadu': 15, 'Karnataka': 7, 'Andhra Pradesh': 3 },
  hr_jd_bahadurgarh: { 'Haryana': 40, 'Delhi': 28, 'Uttar Pradesh': 18, 'Rajasthan': 8, 'Punjab': 6 },
  hr_gurugram_metal: { 'Haryana': 45, 'Delhi': 32, 'Rajasthan': 12, 'Uttar Pradesh': 8, 'Punjab': 3 },
  hr_faridabad_auto: { 'Haryana': 42, 'Delhi': 35, 'Uttar Pradesh': 14, 'Rajasthan': 6, 'Punjab': 3 },
  up_seven_star: { 'Uttar Pradesh': 45, 'Delhi': 28, 'Haryana': 14, 'Punjab': 8, 'Rajasthan': 5 },
  up_saral_morta: { 'Uttar Pradesh': 55, 'Delhi': 22, 'Haryana': 12, 'Rajasthan': 7, 'Punjab': 4 },
  mh_nashik_auto: { 'Maharashtra': 70, 'Gujarat': 18, 'Madhya Pradesh': 8, 'Goa': 4 },
  mh_thane_scrap: { 'Maharashtra': 72, 'Gujarat': 16, 'Karnataka': 8, 'Goa': 4 },
  gj_vadodara: { 'Gujarat': 68, 'Rajasthan': 16, 'Maharashtra': 10, 'Madhya Pradesh': 6 },
  gj_rajkot: { 'Gujarat': 75, 'Rajasthan': 14, 'Maharashtra': 8, 'Madhya Pradesh': 3 },
  tn_coimbatore: { 'Tamil Nadu': 68, 'Kerala': 20, 'Karnataka': 8, 'Andhra Pradesh': 4 },
  tn_madurai: { 'Tamil Nadu': 72, 'Kerala': 16, 'Karnataka': 8, 'Andhra Pradesh': 4 },
  ka_hubli_scrap: { 'Karnataka': 62, 'Andhra Pradesh': 18, 'Goa': 12, 'Maharashtra': 8 },
  ap_vijayawada: { 'Andhra Pradesh': 65, 'Telangana': 18, 'Tamil Nadu': 10, 'Karnataka': 7 },
  ap_vizag: { 'Andhra Pradesh': 62, 'Odisha': 18, 'Telangana': 12, 'West Bengal': 8 },
  tg_hyderabad_ind: { 'Telangana': 58, 'Andhra Pradesh': 24, 'Karnataka': 10, 'Maharashtra': 8 },
  rj_jodhpur: { 'Rajasthan': 68, 'Gujarat': 16, 'Madhya Pradesh': 10, 'Haryana': 6 },
  pb_ludhiana: { 'Punjab': 55, 'Haryana': 20, 'Delhi': 14, 'Himachal Pradesh': 8, 'Rajasthan': 3 },
  wb_durgapur: { 'West Bengal': 60, 'Bihar': 18, 'Jharkhand': 14, 'Odisha': 8 },
  br_patna: { 'Bihar': 70, 'Uttar Pradesh': 16, 'Jharkhand': 10, 'West Bengal': 4 },
  jh_dhanbad: { 'Jharkhand': 65, 'West Bengal': 18, 'Odisha': 10, 'Bihar': 7 },
  mp_jabalpur: { 'Madhya Pradesh': 62, 'Chhattisgarh': 18, 'Uttar Pradesh': 12, 'Maharashtra': 8 },
  dl_badarpur: { 'Delhi': 45, 'Haryana': 28, 'Uttar Pradesh': 18, 'Rajasthan': 9 },
  uk_dehradun: { 'Uttarakhand': 55, 'Uttar Pradesh': 24, 'Delhi': 14, 'Haryana': 7 },
  hp_solan: { 'Himachal Pradesh': 62, 'Punjab': 22, 'Haryana': 10, 'Chandigarh': 6 },
  cg_bilaspur: { 'Chhattisgarh': 65, 'Madhya Pradesh': 18, 'Maharashtra': 10, 'Odisha': 7 },
  od_rourkela: { 'Odisha': 60, 'Jharkhand': 20, 'West Bengal': 12, 'Chhattisgarh': 8 },
  ga_panaji: { 'Goa': 65, 'Maharashtra': 25, 'Karnataka': 10 },
  // Extended independent RVSFs
  up_agra_auto: { 'Uttar Pradesh': 55, 'Rajasthan': 18, 'Madhya Pradesh': 12, 'Delhi': 10, 'Haryana': 5 },
  up_kanpur_auto: { 'Uttar Pradesh': 62, 'Madhya Pradesh': 16, 'Bihar': 10, 'Delhi': 8, 'Rajasthan': 4 },
  up_varanasi_auto: { 'Uttar Pradesh': 58, 'Bihar': 22, 'Madhya Pradesh': 12, 'Jharkhand': 8 },
  up_meerut_scrap: { 'Uttar Pradesh': 50, 'Delhi': 28, 'Haryana': 14, 'Punjab': 5, 'Uttarakhand': 3 },
  up_prayagraj_metal: { 'Uttar Pradesh': 60, 'Madhya Pradesh': 18, 'Bihar': 12, 'Chhattisgarh': 10 },
  up_bareilly_auto: { 'Uttar Pradesh': 55, 'Uttarakhand': 20, 'Delhi': 12, 'Haryana': 8, 'Punjab': 5 },
  up_aligarh_scrap: { 'Uttar Pradesh': 52, 'Rajasthan': 20, 'Delhi': 16, 'Haryana': 12 },
  up_gorakhpur_auto: { 'Uttar Pradesh': 60, 'Bihar': 24, 'Jharkhand': 10, 'Madhya Pradesh': 6 },
  hr_ambala_auto: { 'Haryana': 45, 'Punjab': 28, 'Himachal Pradesh': 14, 'Delhi': 10, 'Uttar Pradesh': 3 },
  hr_panipat_scrap: { 'Haryana': 48, 'Delhi': 28, 'Uttar Pradesh': 14, 'Rajasthan': 7, 'Punjab': 3 },
  hr_hisar_metal: { 'Haryana': 55, 'Rajasthan': 22, 'Punjab': 14, 'Delhi': 9 },
  hr_rohtak_auto: { 'Haryana': 50, 'Delhi': 30, 'Uttar Pradesh': 12, 'Rajasthan': 8 },
  hr_karnal_auto: { 'Haryana': 48, 'Punjab': 28, 'Himachal Pradesh': 12, 'Delhi': 8, 'Uttarakhand': 4 },
  dl_rohini_auto: { 'Delhi': 42, 'Haryana': 30, 'Uttar Pradesh': 18, 'Rajasthan': 7, 'Punjab': 3 },
  dl_okhla_metal: { 'Delhi': 45, 'Haryana': 28, 'Uttar Pradesh': 18, 'Rajasthan': 9 },
  dl_narela_scrap: { 'Delhi': 40, 'Haryana': 32, 'Uttar Pradesh': 18, 'Rajasthan': 7, 'Punjab': 3 },
  mh_aurangabad_auto: { 'Maharashtra': 65, 'Telangana': 14, 'Madhya Pradesh': 12, 'Karnataka': 6, 'Gujarat': 3 },
  mh_kolhapur_metal: { 'Maharashtra': 68, 'Karnataka': 18, 'Goa': 10, 'Gujarat': 4 },
  mh_solapur_auto: { 'Maharashtra': 60, 'Karnataka': 22, 'Telangana': 12, 'Andhra Pradesh': 6 },
  mh_navi_mumbai_auto: { 'Maharashtra': 72, 'Gujarat': 16, 'Karnataka': 8, 'Goa': 4 },
  gj_surat_scrap: { 'Gujarat': 65, 'Maharashtra': 20, 'Rajasthan': 10, 'Madhya Pradesh': 5 },
  gj_bhavnagar_auto: { 'Gujarat': 72, 'Rajasthan': 16, 'Maharashtra': 8, 'Madhya Pradesh': 4 },
  gj_anand_metal: { 'Gujarat': 68, 'Rajasthan': 14, 'Maharashtra': 12, 'Madhya Pradesh': 6 },
  tn_trichy_auto: { 'Tamil Nadu': 70, 'Kerala': 16, 'Karnataka': 8, 'Andhra Pradesh': 6 },
  tn_salem_metal: { 'Tamil Nadu': 72, 'Karnataka': 16, 'Kerala': 8, 'Andhra Pradesh': 4 },
  tn_tirunelveli_auto: { 'Tamil Nadu': 70, 'Kerala': 22, 'Karnataka': 5, 'Andhra Pradesh': 3 },
  ka_mysuru_auto: { 'Karnataka': 62, 'Tamil Nadu': 20, 'Kerala': 10, 'Andhra Pradesh': 8 },
  ka_mangaluru_metal: { 'Karnataka': 55, 'Kerala': 28, 'Goa': 10, 'Tamil Nadu': 7 },
  ka_tumkur_scrap: { 'Karnataka': 65, 'Andhra Pradesh': 18, 'Tamil Nadu': 10, 'Kerala': 7 },
  rj_kota_auto: { 'Rajasthan': 62, 'Madhya Pradesh': 20, 'Uttar Pradesh': 10, 'Gujarat': 8 },
  rj_udaipur_metal: { 'Rajasthan': 65, 'Gujarat': 20, 'Madhya Pradesh': 10, 'Maharashtra': 5 },
  rj_ajmer_scrap: { 'Rajasthan': 65, 'Haryana': 14, 'Gujarat': 12, 'Uttar Pradesh': 9 },
  mp_gwalior_auto: { 'Madhya Pradesh': 58, 'Uttar Pradesh': 24, 'Rajasthan': 12, 'Delhi': 6 },
  mp_ujjain_metal: { 'Madhya Pradesh': 62, 'Rajasthan': 20, 'Gujarat': 10, 'Maharashtra': 8 },
  pb_amritsar_auto: { 'Punjab': 55, 'Haryana': 18, 'Delhi': 14, 'Himachal Pradesh': 8, 'Jammu and Kashmir': 5 },
  pb_jalandhar_metal: { 'Punjab': 58, 'Haryana': 20, 'Himachal Pradesh': 12, 'Delhi': 8, 'Uttarakhand': 2 },
  pb_patiala_scrap: { 'Punjab': 55, 'Haryana': 28, 'Delhi': 12, 'Rajasthan': 5 },
  pb_bathinda_auto: { 'Punjab': 60, 'Rajasthan': 20, 'Haryana': 14, 'Delhi': 6 },
  ap_nellore_auto: { 'Andhra Pradesh': 65, 'Tamil Nadu': 18, 'Telangana': 10, 'Karnataka': 7 },
  ap_kurnool_metal: { 'Andhra Pradesh': 62, 'Telangana': 20, 'Karnataka': 12, 'Tamil Nadu': 6 },
  ap_tirupati_scrap: { 'Andhra Pradesh': 60, 'Tamil Nadu': 25, 'Karnataka': 10, 'Telangana': 5 },
  tg_warangal_auto: { 'Telangana': 62, 'Andhra Pradesh': 20, 'Maharashtra': 10, 'Karnataka': 8 },
  tg_nizamabad_metal: { 'Telangana': 60, 'Maharashtra': 20, 'Karnataka': 12, 'Andhra Pradesh': 8 },
  wb_siliguri_auto: { 'West Bengal': 55, 'Assam': 18, 'Bihar': 14, 'Jharkhand': 8, 'Meghalaya': 5 },
  wb_howrah_metal: { 'West Bengal': 60, 'Bihar': 18, 'Jharkhand': 12, 'Odisha': 6, 'Assam': 4 },
  wb_asansol_auto: { 'West Bengal': 55, 'Jharkhand': 24, 'Bihar': 12, 'Odisha': 9 },
  br_gaya_auto: { 'Bihar': 65, 'Jharkhand': 18, 'Uttar Pradesh': 10, 'West Bengal': 7 },
  br_muzaffarpur_metal: { 'Bihar': 68, 'Uttar Pradesh': 18, 'West Bengal': 10, 'Jharkhand': 4 },
  jh_jamshedpur_auto: { 'Jharkhand': 62, 'Odisha': 18, 'West Bengal': 12, 'Bihar': 8 },
  jh_ranchi_metal: { 'Jharkhand': 60, 'West Bengal': 18, 'Bihar': 14, 'Odisha': 8 },
  od_cuttack_auto: { 'Odisha': 65, 'Jharkhand': 18, 'West Bengal': 10, 'Andhra Pradesh': 7 },
  uk_haridwar_auto: { 'Uttarakhand': 55, 'Uttar Pradesh': 28, 'Delhi': 12, 'Haryana': 5 },
  hp_baddi_auto: { 'Himachal Pradesh': 55, 'Punjab': 28, 'Haryana': 12, 'Chandigarh': 5 },
  cg_durg_auto: { 'Chhattisgarh': 62, 'Madhya Pradesh': 20, 'Odisha': 10, 'Maharashtra': 8 },
  as_dibrugarh_auto: { 'Assam': 65, 'Manipur': 14, 'Meghalaya': 12, 'Tripura': 9 },
  as_silchar_metal: { 'Assam': 60, 'Tripura': 20, 'Manipur': 12, 'Meghalaya': 8 },
  kl_trivandrum_auto: { 'Kerala': 72, 'Tamil Nadu': 18, 'Karnataka': 7, 'Andhra Pradesh': 3 },
  kl_kochi_metal: { 'Kerala': 68, 'Tamil Nadu': 18, 'Karnataka': 10, 'Andhra Pradesh': 4 },
  tt_recycling_ahmedabad: { 'Gujarat': 65, 'Rajasthan': 18, 'Maharashtra': 10, 'Madhya Pradesh': 5, 'Goa': 2 },
};

// Base monthly collection rate (avg vehicles/month) per RVSF
const rvsfBaseRate: Record<string, number> = {
  msti_noida: 870, rewire_jaipur: 480, rewire_bhubaneswar: 290, rewire_surat: 380,
  rewire_chandigarh: 390, rewire_delhi: 620, rewire_pune: 840, rewire_guwahati: 365,
  rewire_kolkata: 660, rewire_lucknow: 430, rewire_raipur: 880,
  cero_greater_noida: 1050, cero_chennai: 790, cero_pune: 920, cero_bengaluru: 680,
  cero_ahmedabad: 560, cero_indore: 465, cero_hyderabad: 560, cero_guwahati: 340,
  cero_chandigarh: 310, cero_kolkata: 230, cero_mumbai: 250, cero_jaipur: 148,
  cero_nagpur: 170, cero_bhopal: 138,
  // TVS RVSF (OEM-affiliated)
  ka_tvs_bengaluru: 340,
  // Independent RVSFs (V-SCRAP registered)
  kl_silk_thrissur: 220, kl_kozhikode: 165,
  hr_jd_bahadurgarh: 390, hr_gurugram_metal: 340, hr_faridabad_auto: 310,
  up_seven_star: 490, up_saral_morta: 280,
  mh_nashik_auto: 330, mh_thane_scrap: 305,
  gj_vadodara: 280, gj_rajkot: 250,
  tn_coimbatore: 305, tn_madurai: 220,
  ka_hubli_scrap: 190,
  ap_vijayawada: 250, ap_vizag: 280,
  tg_hyderabad_ind: 280,
  rj_jodhpur: 220,
  pb_ludhiana: 280,
  wb_durgapur: 250,
  br_patna: 190,
  jh_dhanbad: 190,
  mp_jabalpur: 190,
  dl_badarpur: 250,
  uk_dehradun: 160,
  hp_solan: 135,
  cg_bilaspur: 190,
  od_rourkela: 190,
  ga_panaji: 110,
  // Extended independent RVSFs
  up_agra_auto: 330, up_kanpur_auto: 300, up_varanasi_auto: 248,
  up_meerut_scrap: 275, up_prayagraj_metal: 220, up_bareilly_auto: 248,
  up_aligarh_scrap: 220, up_gorakhpur_auto: 220,
  hr_ambala_auto: 248, hr_panipat_scrap: 275, hr_hisar_metal: 220,
  hr_rohtak_auto: 248, hr_karnal_auto: 220,
  dl_rohini_auto: 330, dl_okhla_metal: 300, dl_narela_scrap: 275,
  mh_aurangabad_auto: 300, mh_kolhapur_metal: 248, mh_solapur_auto: 248, mh_navi_mumbai_auto: 358,
  gj_surat_scrap: 330, gj_bhavnagar_auto: 220, gj_anand_metal: 220,
  tn_trichy_auto: 275, tn_salem_metal: 248, tn_tirunelveli_auto: 192,
  ka_mysuru_auto: 275, ka_mangaluru_metal: 248, ka_tumkur_scrap: 220,
  rj_kota_auto: 275, rj_udaipur_metal: 248, rj_ajmer_scrap: 220,
  mp_gwalior_auto: 248, mp_ujjain_metal: 220,
  pb_amritsar_auto: 300, pb_jalandhar_metal: 275, pb_patiala_scrap: 248, pb_bathinda_auto: 192,
  ap_nellore_auto: 248, ap_kurnool_metal: 220, ap_tirupati_scrap: 248,
  tg_warangal_auto: 248, tg_nizamabad_metal: 192,
  wb_siliguri_auto: 248, wb_howrah_metal: 275, wb_asansol_auto: 220,
  br_gaya_auto: 192, br_muzaffarpur_metal: 192,
  jh_jamshedpur_auto: 248, jh_ranchi_metal: 220,
  od_cuttack_auto: 220,
  uk_haridwar_auto: 220,
  hp_baddi_auto: 192,
  cg_durg_auto: 220,
  as_dibrugarh_auto: 165, as_silchar_metal: 138,
  kl_trivandrum_auto: 248, kl_kochi_metal: 275,
  tt_recycling_ahmedabad: 260,
};

const STEEL_KG = 648;
const PLASTIC_KG = 98;
const ALUMINIUM_KG = 76;
const CAST_IRON_KG = 47;
const RUBBER_KG = 32;
const COPPER_KG = 12;
const EWASTE_KG = 8;
const LIION_KG = 4;
const ZINC_KG = 4;
const USED_OIL_KG = 3.5;
const FREON_KG = 0.9;
const PLATINUM_G = 3; // grams per vehicle

const _zeroMat = (month: string): MonthlyMaterial => ({
  month, steelKg: 0, plasticKg: 0, aluminiumKg: 0,
  castIronKg: 0, rubberKg: 0, copperKg: 0, ewasteKg: 0,
  liionKg: 0, zincKg: 0, usedOilKg: 0, freonKg: 0, platinumGrams: 0,
});

// ─── Data generation (always returns full 24 months) ─────────────────────────
export const getRVSFMonthlyCollection = (rvsfId: string): MonthlyCollection[] => {
  const base = rvsfBaseRate[rvsfId] ?? 200;
  return allMonths.map((month, i) => {
    const override = _monthlyOverrides[month]?.[rvsfId];
    if (override !== undefined) return { month, count: override };
    const variance = seeded(i * 31 + rvsfId.length * 7 + rvsfId.charCodeAt(0), -12, 12) / 100;
    return { month, count: Math.round(base * monthUtil24[i] * (1 + variance)) };
  });
};

export const getRVSFMonthlyMaterial = (rvsfId: string): MonthlyMaterial[] => {
  const rvsf = rvsfMaster.find(r => r.id === rvsfId);
  if (rvsf?.type === 'collection_touchpoint') {
    return allMonths.map(month => _zeroMat(month));
  }
  return getRVSFMonthlyCollection(rvsfId).map(({ month, count }) => ({
    month,
    steelKg: count * STEEL_KG,
    plasticKg: count * PLASTIC_KG,
    aluminiumKg: count * ALUMINIUM_KG,
    castIronKg: count * CAST_IRON_KG,
    rubberKg: count * RUBBER_KG,
    copperKg: count * COPPER_KG,
    ewasteKg: count * EWASTE_KG,
    liionKg: count * LIION_KG,
    zincKg: count * ZINC_KG,
    usedOilKg: count * USED_OIL_KG,
    freonKg: count * FREON_KG,
    platinumGrams: count * PLATINUM_G,
  }));
};

// ─── Aggregation across RVSFs ────────────────────────────────────────────────
export const getAggregatedMonthlyCollection = (rvsfIds: string[]): MonthlyCollection[] => {
  if (!rvsfIds.length) return allMonths.map(month => ({ month, count: 0 }));
  const perRVSF = rvsfIds.map(id => getRVSFMonthlyCollection(id));
  return allMonths.map((month, i) => ({
    month,
    count: perRVSF.reduce((sum, data) => sum + data[i].count, 0),
  }));
};

export const getPerRVSFMonthlyCollection = (rvsfIds: string[]): Record<string, MonthlyCollection[]> => {
  const result: Record<string, MonthlyCollection[]> = {};
  for (const id of rvsfIds) result[id] = getRVSFMonthlyCollection(id);
  return result;
};

export const getAggregatedMaterialRecovery = (rvsfIds: string[]): MonthlyMaterial[] => {
  if (!rvsfIds.length) return allMonths.map(month => _zeroMat(month));
  const perRVSF = rvsfIds.map(id => getRVSFMonthlyMaterial(id));
  return allMonths.map((month, i) => ({
    month,
    steelKg: perRVSF.reduce((sum, d) => sum + d[i].steelKg, 0),
    plasticKg: perRVSF.reduce((sum, d) => sum + d[i].plasticKg, 0),
    aluminiumKg: perRVSF.reduce((sum, d) => sum + d[i].aluminiumKg, 0),
    castIronKg: perRVSF.reduce((sum, d) => sum + d[i].castIronKg, 0),
    rubberKg: perRVSF.reduce((sum, d) => sum + d[i].rubberKg, 0),
    copperKg: perRVSF.reduce((sum, d) => sum + d[i].copperKg, 0),
    ewasteKg: perRVSF.reduce((sum, d) => sum + d[i].ewasteKg, 0),
    liionKg: perRVSF.reduce((sum, d) => sum + d[i].liionKg, 0),
    zincKg: perRVSF.reduce((sum, d) => sum + d[i].zincKg, 0),
    usedOilKg: perRVSF.reduce((sum, d) => sum + d[i].usedOilKg, 0),
    freonKg: perRVSF.reduce((sum, d) => sum + d[i].freonKg, 0),
    platinumGrams: perRVSF.reduce((sum, d) => sum + d[i].platinumGrams, 0),
  }));
};

// RC Origin aggregated — accepts months to scope the vehicle count proportionally
export const getAggregatedRCOrigin = (rvsfIds: string[], months?: string[]): RCOriginState[] => {
  const stateTotals: Record<string, number> = {};
  for (const id of rvsfIds) {
    const dist = _rcOriginOverrides[id] || rcOriginDistributions[id] || {};
    let full = getRVSFMonthlyCollection(id);
    if (months) full = filterDataByMonths(full, months);
    const totalCollected = full.reduce((s, d) => s + d.count, 0);
    for (const [state, pct] of Object.entries(dist)) {
      stateTotals[state] = (stateTotals[state] || 0) + Math.round((pct / 100) * totalCollected);
    }
  }
  return Object.entries(stateTotals)
    .map(([state, count]) => {
      const coords = stateCoords[state] ?? [22.5, 82.0];
      return { state, lat: coords[0], lng: coords[1], count };
    })
    .sort((a, b) => b.count - a.count);
};

// Per-RVSF material summary — accepts months
export const getPerRVSFMaterialSummary = (rvsfIds: string[], months?: string[]) => {
  return rvsfIds.map(id => {
    const rvsf = rvsfMaster.find(r => r.id === id)!;
    let material = getRVSFMonthlyMaterial(id);
    let collection = getRVSFMonthlyCollection(id);
    if (months) { material = filterDataByMonths(material, months); collection = filterDataByMonths(collection, months); }
    return {
      id, name: rvsf?.name ?? id, city: rvsf?.city ?? '—', state: rvsf?.state ?? '—',
      type: rvsf?.type ?? 'full_dismantling' as const,
      steelKg: material.reduce((s, d) => s + d.steelKg, 0),
      plasticKg: material.reduce((s, d) => s + d.plasticKg, 0),
      aluminiumKg: material.reduce((s, d) => s + d.aluminiumKg, 0),
      castIronKg: material.reduce((s, d) => s + d.castIronKg, 0),
      rubberKg: material.reduce((s, d) => s + d.rubberKg, 0),
      copperKg: material.reduce((s, d) => s + d.copperKg, 0),
      ewasteKg: material.reduce((s, d) => s + d.ewasteKg, 0),
      liionKg: material.reduce((s, d) => s + d.liionKg, 0),
      zincKg: material.reduce((s, d) => s + d.zincKg, 0),
      usedOilKg: material.reduce((s, d) => s + d.usedOilKg, 0),
      freonKg: material.reduce((s, d) => s + d.freonKg, 0),
      platinumGrams: material.reduce((s, d) => s + d.platinumGrams, 0),
      totalKg: material.reduce((s, d) => s + d.steelKg + d.plasticKg + d.aluminiumKg + d.castIronKg + d.rubberKg + d.copperKg + d.ewasteKg + d.liionKg + d.zincKg + d.usedOilKg + d.freonKg, 0),
      totalVehicles: collection.reduce((s, d) => s + d.count, 0),
    };
  });
};

export const formatKg = (kg: number): string => {
  if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(2)}M`;
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(1)}K`;
  return kg.toLocaleString('en-IN');
};

export const rvsfStateOptions = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Odisha',
  'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

// ─── Material Market Pricing Data ─────────────────────────────────────────────
export interface MaterialPricing {
  id: string;
  name: string;
  unit: string;
  scrapPrice: number;   // ₹ per unit (current)
  virginPrice: number;  // ₹ per unit (current)
  trend: { month: string; scrapPrice: number; virginPrice: number }[];
}

const _trendMonths = [
  'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025',
  'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026',
];

// Gentle pseudo-random variation for price trend (deterministic, seed-based)
const _pv = (base: number, seed: number, pct: number): number =>
  Math.round(base * (1 + ((Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000)) - 0.5) * 2 * pct) * 10) / 10;

export const materialMarketData: MaterialPricing[] = [
  {
    id: 'steel', name: 'Steel', unit: 'kg',
    scrapPrice: 28, virginPrice: 65,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(28, i * 3 + 1, 0.06), virginPrice: _pv(65, i * 3 + 2, 0.04) })),
  },
  {
    id: 'plastic', name: 'Plastic (PP/ABS)', unit: 'kg',
    scrapPrice: 18, virginPrice: 98,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(18, i * 5 + 11, 0.08), virginPrice: _pv(98, i * 5 + 12, 0.05) })),
  },
  {
    id: 'aluminium', name: 'Aluminium', unit: 'kg',
    scrapPrice: 95, virginPrice: 215,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(95, i * 7 + 21, 0.07), virginPrice: _pv(215, i * 7 + 22, 0.05) })),
  },
  {
    id: 'cast_iron', name: 'Cast Iron', unit: 'kg',
    scrapPrice: 22, virginPrice: 55,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(22, i * 9 + 31, 0.05), virginPrice: _pv(55, i * 9 + 32, 0.04) })),
  },
  {
    id: 'rubber', name: 'Rubber', unit: 'kg',
    scrapPrice: 12, virginPrice: 148,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(12, i * 11 + 41, 0.09), virginPrice: _pv(148, i * 11 + 42, 0.06) })),
  },
  {
    id: 'copper', name: 'Copper', unit: 'kg',
    scrapPrice: 560, virginPrice: 840,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(560, i * 13 + 51, 0.07), virginPrice: _pv(840, i * 13 + 52, 0.05) })),
  },
  {
    id: 'ewaste', name: 'E-waste', unit: 'kg',
    scrapPrice: 45, virginPrice: 2500,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(45, i * 17 + 61, 0.10), virginPrice: _pv(2500, i * 17 + 62, 0.03) })),
  },
  {
    id: 'liion', name: 'Li-ion Batteries', unit: 'kg',
    scrapPrice: 180, virginPrice: 800,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(180, i * 19 + 71, 0.08), virginPrice: _pv(800, i * 19 + 72, 0.06) })),
  },
  {
    id: 'zinc', name: 'Zinc', unit: 'kg',
    scrapPrice: 165, virginPrice: 230,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(165, i * 23 + 81, 0.06), virginPrice: _pv(230, i * 23 + 82, 0.04) })),
  },
  {
    id: 'used_oil', name: 'Used Oil', unit: 'L',
    scrapPrice: 18, virginPrice: 180,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(18, i * 29 + 91, 0.07), virginPrice: _pv(180, i * 29 + 92, 0.05) })),
  },
  {
    id: 'freon', name: 'Freon (R-134a)', unit: 'kg',
    scrapPrice: 950, virginPrice: 3200,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(950, i * 31 + 101, 0.06), virginPrice: _pv(3200, i * 31 + 102, 0.04) })),
  },
  {
    id: 'platinum', name: 'Platinum / Palladium', unit: 'g',
    scrapPrice: 2800, virginPrice: 3500,
    trend: _trendMonths.map((month, i) => ({ month, scrapPrice: _pv(2800, i * 37 + 111, 0.09), virginPrice: _pv(3500, i * 37 + 112, 0.07) })),
  },
];

// ─── OEM AI Insights ──────────────────────────────────────────────────────────
export interface OEMAIInsight {
  id: number;
  category: 'capacity' | 'material' | 'geography' | 'compliance' | 'financial' | 'strategic';
  insight: string;
}

export const oemAIInsights: Record<string, OEMAIInsight[]> = {
  msil: [
    { id: 1, category: 'capacity', insight: 'MSTI Noida is the only OEM-owned RVSF currently active, processing ~24,000 vehicles/year — capacity is nearly saturated at 91% average utilization over the trailing 12 months.' },
    { id: 2, category: 'strategic', insight: 'Honda Cars India and Toyota Kirloskar Motor route all ELVs through MSTI under MoU, contributing ~32% of total MSTI intake by vehicle count, creating a multi-OEM dependency on a single node.' },
    { id: 3, category: 'financial', insight: 'Steel recovery at MSTI accounts for ₹1.2Cr+ in monthly scrap revenue, representing 58% of total material value — any steel price decline below ₹24/kg directly impacts MSTI EBITDA.' },
    { id: 4, category: 'geography', insight: 'RC origin data shows Delhi NCR (27%) and Uttar Pradesh (38%) as primary feeder regions — well-aligned with MSTI\'s Noida location, reducing average logistics haul to ~85 km.' },
    { id: 5, category: 'material', insight: 'Aluminium recovery yield has improved by an estimated 8% YoY due to upgraded dismantling process and workforce training — contributing an additional ₹5.8L monthly at current scrap prices.' },
    { id: 6, category: 'compliance', insight: 'E-waste (ECUs, sensors, infotainment modules) and Li-ion battery modules, though small by weight, carry high hazmat compliance risk. MSTI follows CPCB BWMH-2022 protocols for channelization.' },
    { id: 7, category: 'capacity', insight: 'Seasonal intake peaks in Jan–Mar (Q4 FY), correlating with fleet renewal cycles and government scrapping incentive windows — MSTI processes 14% more vehicles in Q4 vs Q1 on average.' },
    { id: 8, category: 'financial', insight: 'Platinum/Palladium recovery from catalytic converters (~3g/vehicle) generates ~₹84,000/month at current market rates (₹2,800/g) — a high-value, low-weight stream with minimal additional processing cost.' },
    { id: 9, category: 'strategic', insight: 'Expanding MSTI to 3–5 locations would reduce average RC-to-RVSF distance by ~340 km across North India, likely improving the India ELV formal capture rate by 18–22% for MSIL-origin vehicles.' },
    { id: 10, category: 'material', insight: 'Used oil recovery at current intake (~3.5L/vehicle) totals ~3,000L/month at MSTI — re-refining under authorised HSPCB-approved recycler agreements could generate an additional ₹18/L vs. direct disposal.' },
  ],
  tata: [
    { id: 1, category: 'geography', insight: 'Re.Wi.Re network spans 10 active facilities across 9 states — highest geographic coverage among any OEM-operated RVSF network in India, reducing average logistics distance by ~35%.' },
    { id: 2, category: 'capacity', insight: 'Raipur facility leads network utilization at ~98% (880 vehicles/month vs. 900/month capacity). Capacity expansion or satellite collection touchpoint is recommended within 12–18 months to avoid throughput loss.' },
    { id: 3, category: 'capacity', insight: 'Total Re.Wi.Re capacity stands at 167,000 vehicles/year; actual throughput at ~142,000/year (85% utilization) over the trailing 12 months — headroom exists in Bhubaneswar and Guwahati plants.' },
    { id: 4, category: 'geography', insight: 'Jharkhand, Odisha, and Chhattisgarh together have significant ELV volumes currently served by only 3 Re.Wi.Re plants — adding 2 facilities in this corridor could reduce logistics cost by ₹1,200–1,800 per vehicle.' },
    { id: 5, category: 'material', insight: 'Copper recovery across the network averages 12 kg/vehicle — at ₹560/kg scrap price, this contributes ₹6,720 per vehicle in copper alone, making wiring harness extraction a high-priority dismantling step.' },
    { id: 6, category: 'capacity', insight: 'Kolkata and Pune plants collectively handle 28% of total Re.Wi.Re throughput — a concentration risk if either facility faces regulatory downtime. Redundancy planning via nearby partner RVSFs is advisable.' },
    { id: 7, category: 'material', insight: 'Aluminium recovery per vehicle is rising month-on-month (+1.2% average), driven by Tata\'s increasing EV and premium SUV fleet (Harrier, Safari) entering the ELV pool with heavier aluminium subframes.' },
    { id: 8, category: 'financial', insight: 'Plastic recovery at ₹18/kg (scrap) vs. ₹98/kg (virgin PP) shows a 5.4× value gap — investment in pelletizing/granulating capability at 2 hub plants could unlock ₹2.1Cr additional annual revenue network-wide.' },
    { id: 9, category: 'geography', insight: 'RC origin data shows strong UP and Bihar contribution to Lucknow plant — a dedicated Bihar node (Patna) could improve logistics cost by ₹800–1,200 per vehicle for ~28% of Lucknow\'s current intake.' },
    { id: 10, category: 'strategic', insight: 'Tata EV models (Nexon EV, Tiago EV, Punch EV) entering the ELV pool by 2027–28 will require BWMH-grade Li-ion battery handling and dismantling infrastructure — proactive CAPEX planning is strategically critical.' },
  ],
  mahindra: [
    { id: 1, category: 'capacity', insight: 'CERO operates India\'s largest OEM ELV network with 14 facilities (9 full dismantling + 5 collection touchpoints) and a combined capacity of 195,000 vehicles/year — 16% ahead of Tata Re.Wi.Re.' },
    { id: 2, category: 'capacity', insight: 'Greater Noida plant leads CERO network at ~1,050 vehicles/month (50.4% utilization) — significant headroom exists for intake growth via B2B fleet scrapping deals with corporate and government fleets.' },
    { id: 3, category: 'strategic', insight: 'CERO\'s JV structure (Mahindra Accelo + MSTC Ltd.) provides regulatory advantage: MSTC is a GoI CPSE, enabling priority access to government fleet ELV auctions and state scrapping schemes.' },
    { id: 4, category: 'financial', insight: 'Collection touchpoints (Kolkata, Mumbai, Jaipur, Nagpur, Bhopal) operate with lower CAPEX but higher logistics overhead per vehicle — converting 2–3 to full dismantling hubs could improve network EBITDA by ₹3.5–5Cr annually.' },
    { id: 5, category: 'material', insight: 'Rubber recovery across CERO network (~32 kg/vehicle × ~11,000/month) yields ~352MT/month — tyre-derived fuel (TDF) or crumb rubber value-add pathways could add ₹12–15/kg premium over raw rubber scrap pricing.' },
    { id: 6, category: 'geography', insight: 'West India (Gujarat, Maharashtra, Rajasthan) accounts for ~38% of CERO\'s geographic intake — Ahmedabad, Pune, Mumbai, and Jaipur form a strong western cluster with cross-facility load balancing potential.' },
    { id: 7, category: 'financial', insight: 'Cast Iron recovery at ₹22/kg scrap yields ~₹44L monthly from CERO network alone (~200MT/month) — secondary refining contracts with foundries could push realization to ₹28–32/kg, adding ₹12–20L/month.' },
    { id: 8, category: 'compliance', insight: 'E-waste from ELV dashboards, ECUs, and infotainment modules averages 8 kg/vehicle — proper channelization per E-Waste (Management) Rules 2022 is a compliance imperative, with per-vehicle PRO linkage mandatory by FY2026.' },
    { id: 9, category: 'financial', insight: 'CERO\'s Platinum/Palladium recovery from catalytic converters (3g/vehicle average) is the highest-value per-kg material stream: at current prices (~₹2,800/g), total network monthly value ~₹9.2Cr.' },
    { id: 10, category: 'geography', insight: 'South India cluster (Chennai, Bengaluru, Hyderabad) processes ~2,030 vehicles/month combined — adding a Kerala or coastal Andhra Pradesh facility could grow Southern India ELV formal capture by 22–28%.' },
  ],
  honda: [
    { id: 1, category: 'strategic', insight: 'Honda Cars India operates exclusively through MSTI Noida under a bilateral MoU — zero independent ELV infrastructure risk, but also zero geographic flexibility, limiting EPR compliance scope to North India.' },
    { id: 2, category: 'capacity', insight: 'Honda-origin ELVs at MSTI Noida estimated at ~7,600 vehicles/year based on EPR obligations for the FY 2025–26 registration age cohort (15-year-old vehicles).' },
    { id: 3, category: 'compliance', insight: 'All material recovery data for Honda ELVs is processed and reported through MSTI\'s operational framework — Honda\'s EPR credit claims and carbon offset calculations depend entirely on MSTI reporting accuracy.' },
    { id: 4, category: 'geography', insight: 'RC origin for Honda ELVs skews strongly toward Delhi NCR (32%) and Uttar Pradesh (40%), closely tracking Honda City and Amaze model regional sales dominance in North India.' },
    { id: 5, category: 'geography', insight: 'Honda has no dedicated collection touchpoint outside Noida — vehicles from South India (TN, KA, KL) must travel 2,200–2,400 km to reach MSTI, increasing per-vehicle logistics cost by ₹8,000–14,000.' },
    { id: 6, category: 'material', insight: 'Steel recovery per Honda ELV averages ~612 kg (City/Amaze sedan blend) — slightly below the RVSF network average due to lighter body-in-white design vs. SUV/MPV-heavy peers like Toyota and Tata.' },
    { id: 7, category: 'strategic', insight: 'Expanding Honda\'s MoU with MSTI to include a South India node (Chennai or Bengaluru) could reduce per-vehicle ELV logistics cost by ₹8,000–12,000 and improve South India formal capture rate.' },
    { id: 8, category: 'compliance', insight: 'Honda has not yet publicly announced a dedicated RVSF investment — EPR compliance risk increases if MSTI is decertified, capacity-constrained, or unable to renew the MoU agreement post-2026.' },
    { id: 9, category: 'strategic', insight: 'Li-ion battery volumes from upcoming Honda EV models (Elevate EV, City e:HEV hybrid variants) will require amendment to the current Honda-MSTI MoU scope to include BWMH-grade battery dismantling protocols.' },
    { id: 10, category: 'strategic', insight: 'Benchmarking Honda\'s ELV infrastructure investment against Mahindra CERO shows a 6× gap in dedicated capacity — EPR target escalation post-FY2027 (as per draft ELV Policy) may force Honda to establish at least 2 independent RVSFs.' },
  ],
  toyota: [
    { id: 1, category: 'strategic', insight: 'Toyota Kirloskar Motor holds 50% equity in MSTI alongside Maruti Suzuki — making it a co-owner rather than just an MoU partner, aligning long-term incentives for infrastructure expansion and process improvement.' },
    { id: 2, category: 'material', insight: 'Toyota-origin ELVs (Innova, Fortuner, Corolla, Camry) carry higher average vehicle weight (~1,850 kg vs. network average 1,150 kg), increasing total material recovery value per vehicle by ~38%.' },
    { id: 3, category: 'material', insight: 'Aluminium content per Toyota ELV is significantly higher (~112 kg vs. industry average 76 kg), driven by SUV and MPV fleet composition — Aluminium is Toyota\'s #1 value-per-kg material stream at MSTI.' },
    { id: 4, category: 'strategic', insight: 'Toyota Tsusho Group\'s global recycling expertise (Toyota Loop, Japan) provides a proven playbook for scaling MSTI to 5–10 nodes by FY2030, with established process standards for multi-material dismantling.' },
    { id: 5, category: 'geography', insight: 'MSTI\'s current Noida-only model limits Toyota\'s ability to demonstrate EPR compliance for vehicles scrapped in South India — geographic expansion to Karnataka (Toyota\'s manufacturing base in Bidadi) is strategically overdue.' },
    { id: 6, category: 'financial', insight: 'Platinum/Palladium recovery from Toyota catalytic converters averages ~4.2g/vehicle (higher than sedan average due to larger engine cats on Fortuner/Innova Crysta), adding ₹11,760 per vehicle at current scrap rates.' },
    { id: 7, category: 'strategic', insight: 'Toyota\'s shift to hybrid vehicles (HyCross, Vellfire, Camry Hybrid) means future ELV pool will include nickel-metal hydride and Li-ion battery packs — MSTI battery handling capacity requires structured upgrade roadmap.' },
    { id: 8, category: 'material', insight: 'Used oil and freon recovery at MSTI from Toyota\'s diesel fleet (Innova, Fortuner) generates ~4.5L/vehicle — higher than the 3.5L MSIL petrol baseline — increasing recovered oil value by ~29% per Toyota ELV.' },
    { id: 9, category: 'strategic', insight: 'Toyota Tsusho\'s global RVSF experience in Japan (Toyota Loop) provides a proven expansion playbook — a 5-city MSTI rollout (Bengaluru, Chennai, Pune, Ahmedabad, Kolkata) would cover 72% of India\'s annual ELV volume.' },
    { id: 10, category: 'capacity', insight: 'Current MSTI utilization at ~91% suggests Toyota should co-invest in at least one greenfield RVSF in South India within the next 18–24 months to avoid EPR compliance risk as ELV policy targets escalate post-FY2027.' },
  ],
  hero: [
    { id: 1, category: 'strategic', insight: 'Hero MotoCorp has no dedicated OEM-owned RVSF — EPR compliance is routed entirely through authorised dismantler network. As India\'s #1 two-wheeler OEM (8M+ annual sales), Hero\'s ELV volume by FY2028 will exceed 60 lakh vehicles entering the 15-year scrappage window, requiring urgent formal infrastructure investment.' },
    { id: 2, category: 'material', insight: 'Steel recovery per Hero two-wheeler averages ~52 kg (Splendor/HF Deluxe blend) at ₹28/kg scrap = ₹1,456/vehicle. Virgin steel costs ₹65/kg — a 2.3× gap. At 60 lakh annual ELV volume (by FY2028), total steel scrap potential exceeds ₹8,700 Cr/year at network scale.' },
    { id: 3, category: 'financial', insight: 'Aluminium content per Hero two-wheeler averages ~4.8 kg (alloy engine block, alloy wheels on Destini/Xpulse) at ₹95/kg scrap vs ₹215/kg virgin — a 2.26× value gap. Cast aluminium engine parts have higher purity and fetch 8–12% scrap premium over sheet aluminium.' },
    { id: 4, category: 'financial', insight: 'Copper wiring per Hero two-wheeler averages ~0.9 kg at ₹560/kg scrap = ₹504/vehicle. At 60 lakh ELV volume: ~₹3,024 Cr/year in copper scrap, currently flowing predominantly to informal dismantlers at 20–30% below scrap market rate.' },
    { id: 5, category: 'material', insight: 'Rubber content per Hero two-wheeler (~8 kg — tyres, tubes, bushings) at ₹12/kg scrap yields ₹96/vehicle vs ₹148/kg virgin rubber — a 12.3× value gap. Tyre-derived fuel (TDF) channels could improve realisation to ₹18–24/kg, adding ~50% to rubber scrap value.' },
    { id: 6, category: 'compliance', insight: 'Hero\'s EPR obligation for FY2025-26 estimated at ~8.5 lakh ELV two-wheelers based on 15-year registration cohort. E-waste from CDI units, instrument clusters (~0.4 kg/vehicle at ₹45/kg scrap vs ₹2,500/kg virgin electronics) requires CPCB channelization — a compliance imperative as BS6 electronic content grows.' },
    { id: 7, category: 'financial', insight: 'Platinum/Palladium recovery from Hero BS6 catalytic converters averages ~0.6g/vehicle at ₹2,800/g scrap = ₹1,680/vehicle — a high-value stream despite low absolute weight. At 8.5 lakh EPR-eligible ELVs: ~₹142 Cr/year in PGM value, largely uncaptured in informal dismantling.' },
    { id: 8, category: 'geography', insight: 'Hero\'s highest sales concentrations are in UP, Bihar, Rajasthan, Maharashtra, and MP — all states with below-average formal RVSF penetration for two-wheelers. Partnering with existing independent RVSFs in these states for two-wheeler-specific processing would significantly improve formal capture rate.' },
    { id: 9, category: 'strategic', insight: 'Hero\'s 10,000+ dealer network could be converted into ELV collection touchpoints at minimal incremental CAPEX — creating a hub-and-spoke ELV collection model that routes vehicles to 5–10 centralised two-wheeler dismantling RVSF hubs.' },
    { id: 10, category: 'financial', insight: 'Used oil per Hero two-wheeler (~0.6L/vehicle at ₹18/L scrap vs ₹180/L virgin base oil) yields ₹10.8/vehicle — a 10× gap. At 8.5 lakh EPR ELVs: ~₹9.2 Cr/year in used oil value currently passing through informal channels with no certified re-refining.' },
  ],
  hyundai: [
    { id: 1, category: 'strategic', insight: 'Hyundai Motor India has no dedicated OEM RVSF, relying entirely on the authorised RVSF network for EPR compliance. With 1.2–1.5 lakh EPR-eligible ELVs for FY2025-26 and a growing EV portfolio (Ioniq 5, Creta EV), the absence of dedicated infrastructure is an increasing compliance and reputational risk.' },
    { id: 2, category: 'financial', insight: 'Steel recovery per Hyundai ELV averages ~640 kg (Creta/i20/Verna blend) at ₹28/kg scrap = ₹17,920/vehicle — the single largest material revenue stream. Steel scrap prices have ranged ₹24–32/kg over the past 12 months; a sustained price below ₹24/kg would reduce per-vehicle steel realisation by ₹2,560, directly impacting RVSF EBITDA.' },
    { id: 3, category: 'material', insight: 'Aluminium content in Hyundai\'s newer vehicles (Creta N Line, Tucson, Ioniq 5) averages ~92 kg/vehicle vs industry average 76 kg. At ₹95/kg scrap vs ₹215/kg virgin — a 2.26× gap — Hyundai ELVs rank among the highest aluminium-value vehicles per unit processed.' },
    { id: 4, category: 'financial', insight: 'Copper recovery per Hyundai ELV averages ~12 kg at ₹560/kg scrap = ₹6,720/vehicle. Hyundai\'s complex multiplex wiring architecture (especially on Tucson and Ioniq 5) yields wiring harnesses worth 15–20% more per kg than economy-segment peers due to higher-gauge conductor wire.' },
    { id: 5, category: 'material', insight: 'Plastic recovery per Hyundai ELV averages 102 kg (higher than MSIL sedans ~80 kg due to more plastic-intensive interiors and cladding on Creta/Tucson). At ₹18/kg scrap vs ₹98/kg virgin — a 5.4× value gap — ELV plastic is the most undervalued material stream in the 12-material spectrum.' },
    { id: 6, category: 'financial', insight: 'Platinum/Palladium recovery from Hyundai catalytic converters averages ~3.2g/vehicle at ₹2,800/g scrap = ₹8,960/vehicle — among the highest-value per-kg streams. Hyundai\'s multi-point injection engines (Nu, Kappa series) carry larger catalyst substrates vs direct-injection equivalents.' },
    { id: 7, category: 'strategic', insight: 'Hyundai\'s EV push (Ioniq 5, Ioniq 6, Creta EV) will create growing Li-ion battery ELV volumes by FY2027-28. At ₹180/kg scrap vs ₹800/kg virgin — a 4.4× gap — proactive investment in BWMH-certified battery dismantling infrastructure now would yield significant competitive advantage in the emerging EV ELV market.' },
    { id: 8, category: 'geography', insight: 'Hyundai\'s Chennai manufacturing base creates strong RC origin concentration in Tamil Nadu (22%), Karnataka (18%), and Andhra Pradesh (14%). Partnering with or investing in South India-focused RVSFs (Chennai, Bengaluru, Hyderabad corridor) would substantially reduce per-vehicle logistics cost vs current North-India-biased RVSF footprint.' },
    { id: 9, category: 'financial', insight: 'Freon recovery from Hyundai ELVs (R-134a, ~0.9 kg/vehicle at ₹950/kg scrap vs ₹3,200/kg virgin) yields ₹855/vehicle. Proper refrigerant recovery requires certified equipment (CPCB-approved under Ozone Layer rules); informal dismantlers release ~78% of automotive refrigerant directly to atmosphere — a major compliance violation.' },
    { id: 10, category: 'compliance', insight: 'EPR target escalation under India\'s draft ELV Policy (expected enforcement from FY2028) will likely mandate OEM-specific RVSF registration with minimum processing capacity thresholds. Hyundai must begin infrastructure planning within 18 months to avoid compliance risk; a 2-RVSF JV model (South + North India) would be the minimum viable investment.' },
  ],
  kia: [
    { id: 1, category: 'strategic', insight: 'Kia India has zero dedicated RVSF infrastructure — entirely dependent on authorised network for EPR compliance. With 3 consecutive years of 20%+ sales growth and the Seltos/Sonet/Carens fleet rapidly approaching the 15-year scrappage threshold from FY2034, infrastructure planning must begin now to avoid a compliance cliff edge.' },
    { id: 2, category: 'financial', insight: 'Steel recovery per Kia ELV averages ~695 kg (Seltos/Sonet blend) at ₹28/kg scrap = ₹19,460/vehicle — the highest-weight material recovery among major India passenger vehicle OEMs, reflecting the brand\'s SUV-heavy portfolio. A 10% steel price correction (to ₹25.2/kg) would reduce per-vehicle realisation by ₹1,946.' },
    { id: 3, category: 'material', insight: 'Aluminium content per Kia ELV (~82 kg) at ₹95/kg scrap vs ₹215/kg virgin creates ₹7,790/vehicle in secondary aluminium value. Kia Seltos GT Line alloy wheels and sub-frame castings have higher aluminium purity (≥95% Al) vs stampings, fetching 8–12% scrap premium at certified secondary smelters.' },
    { id: 4, category: 'financial', insight: 'Rubber content per Kia ELV averages ~35 kg (4 alloy-rim tyres + bushings + seals) at ₹12/kg scrap = ₹420/vehicle vs ₹148/kg virgin rubber — a 12.3× value gap. Kia\'s 17–18" OEM tyres from Apollo/MRF fetch slightly higher crumb rubber yield (2.7–3.0 kg/tyre vs compact-car baseline 2.2 kg) due to larger tyre volume.' },
    { id: 5, category: 'compliance', insight: 'Kia EV6\'s Li-ion battery pack (~77.4 kWh NMC chemistry) will enter the ELV pool from FY2028. At ₹180/kg scrap vs ₹800/kg virgin — a 4.4× gap — battery packs from EV6 represent ~₹2.8 lakh/vehicle in material value. BWMH-2022 channelization to authorised battery recyclers is mandatory; Kia must embed this in RVSF partner agreements now.' },
    { id: 6, category: 'financial', insight: 'Copper wiring per Kia Seltos averages ~13 kg (advanced ADAS/infotainment wiring vs base-segment peers) at ₹560/kg scrap = ₹7,280/vehicle vs ₹840/kg virgin — a 1.5× gap. Premium wiring harness extraction requires specialist dismantling skills to avoid insulation-contaminated copper (which reduces realisation by 15–25%).' },
    { id: 7, category: 'financial', insight: 'Freon recovery from Kia ELVs (R-134a / R-1234yf for newer models, ~0.9–1.0 kg/vehicle) at ₹950–1,200/kg scrap yields ₹855–1,200/vehicle. R-1234yf (used in Kia EV6 and some Seltos variants) has significantly lower GWP but higher recovery value — yet virtually no authorised recovery infrastructure exists in India.' },
    { id: 8, category: 'geography', insight: 'Kia\'s primary market clusters in metros and Tier-1 cities (Delhi NCR, Bengaluru, Hyderabad, Pune, Mumbai) — all well-served by authorised RVSFs. However, formal ELV capture rate for Kia vehicles is estimated below 35%, with the remainder routed through informal dismantlers, where material recovery efficiency drops by 30–45%.' },
    { id: 9, category: 'strategic', insight: 'Kia-Hyundai\'s shared platform architecture (Kia Seltos on Hyundai Creta\'s ERP3 platform) means a joint RVSF investment could pool EPR obligations and infrastructure CAPEX — similar to the MSIL-Toyota JV model that created MSTI. A K-H Alliance RVSF in South India (Chennai) would naturally serve both brands\' primary manufacturing corridor.' },
    { id: 10, category: 'compliance', insight: 'EPR target escalation in India\'s draft ELV Policy (FY2028 enforcement) will likely mandate OEM-specific RVSF registration. Kia\'s rapid sales growth means EPR obligations will scale proportionally — a joint infrastructure strategy with Hyundai would be the most capital-efficient path to compliance.' },
  ],
  renault: [
    { id: 1, category: 'strategic', insight: 'Renault India has no dedicated RVSF. With Kwid, Triber, and Kiger volumes concentrated in Tier-2/3 cities — where formal ELV infrastructure penetration is below 20% — the estimated formal ELV capture rate for Renault vehicles is under 28%, the lowest among major India PV OEMs.' },
    { id: 2, category: 'financial', insight: 'Steel recovery per Renault ELV averages ~590 kg (Kwid/Kiger/Triber fleet blend) at ₹28/kg scrap = ₹16,520/vehicle. Renault\'s CMF-A+ platform (Kwid/Kiger) uses high-strength steel blanks for structural components — these carry a 5–8% scrap premium over mild steel when sorted separately.' },
    { id: 3, category: 'material', insight: 'Aluminium content per Renault ELV averages ~72 kg at ₹95/kg scrap vs ₹215/kg virgin — a 2.26× gap yielding ₹6,840/vehicle in secondary aluminium value. Renault Kiger\'s turbocharged petrol engine (1.0L TCe) has a higher aluminium cylinder head/block share vs naturally-aspirated economy engines.' },
    { id: 4, category: 'material', insight: 'Plastic content in Renault Kwid (~92 kg) reflects economy-segment cost optimisation toward plastic body panels and interior trim. At ₹18/kg scrap vs ₹98/kg virgin — a 5.4× value gap — Kwid\'s large polypropylene bumpers and door panels are worth ₹1,656/vehicle in scrap, though informal dismantlers recover only 60–70% of theoretical yield.' },
    { id: 5, category: 'compliance', insight: 'Renault\'s EPR targets for FY2025-26 estimated at ~45,000–60,000 ELV vehicles. Without dedicated monitoring infrastructure, third-party RVSF compliance data quality is uncertain, creating EPR audit risk. MoRTH\'s V-SCRAP reconciliation process requires per-vehicle scrapping certificates that informal dismantlers cannot provide.' },
    { id: 6, category: 'financial', insight: 'Copper wiring per Renault vehicle averages ~11 kg at ₹560/kg scrap = ₹6,160/vehicle vs ₹840/kg virgin — a 1.5× gap. Renault\'s Kiger ADAS package (lane departure, blind spot warning) adds additional wiring harness weight vs base Kwid, increasing copper recovery by ~1.2 kg in premium variants.' },
    { id: 7, category: 'geography', insight: 'Renault Kwid\'s Tier-2/3 concentration (UP, Bihar, Rajasthan, MP) means ELVs are generated far from major RVSF clusters. Average RC-to-RVSF distance for a Renault vehicle likely exceeds 220 km — adding ₹4,000–8,000/vehicle in logistics cost, making formal scrapping economically unattractive to vehicle owners in these markets.' },
    { id: 8, category: 'financial', insight: 'Freon recovery from Renault vehicles (R-134a, ~0.9 kg/vehicle at ₹950/kg scrap vs ₹3,200/kg virgin — a 3.4× gap) yields ₹855/vehicle. Used oil recovery (~3.2L/vehicle at ₹18/L vs ₹180/L virgin base oil) yields ₹57.6/vehicle — a 10× gap that justifies certified used oil recycler agreements for even small RVSF operators.' },
    { id: 9, category: 'strategic', insight: 'A Renault-Nissan-Mitsubishi Alliance JV for ELV infrastructure (similar to MSTI model where two brands share one RVSF network) could pool EPR obligations — reducing CAPEX to ₹40–60 Cr for a 2-node network (North + South India) covering ~85% of combined Alliance ELV volumes.' },
    { id: 10, category: 'compliance', insight: 'E-waste from Renault vehicles (~8 kg/vehicle — ECUs, infotainment, ABS modules, TPMS sensors) at ₹45/kg scrap vs ₹2,500/kg virgin electronics — a 55× gap — requires CPCB-approved PRO (Producer Responsibility Organisation) channelization. As vehicle electronics content grows with Kiger/Triber feature upgrades, e-waste compliance will become a material risk.' },
  ],
  stellantis: [
    { id: 1, category: 'strategic', insight: 'Stellantis India (Citroën C3, eC3, C3 Aircross; Jeep Meridian, Compass) has no dedicated RVSF. With combined annual volumes below 40,000 vehicles/year, Stellantis may initially qualify for EPR exemption thresholds — but its global Circular Economy Plan targets mandate OEM ELV responsibility, creating internal policy pressure for infrastructure investment ahead of local regulation.' },
    { id: 2, category: 'financial', insight: 'Steel per Citroën C3 averages ~580 kg at ₹28/kg scrap = ₹16,240/vehicle. Jeep Meridian (body-on-frame platform) recovers ~740 kg steel at ₹20,720/vehicle — a 28% premium per vehicle over C3. OEM vehicle mix (C3 vs Jeep) heavily influences total steel scrap revenue for any partner RVSF.' },
    { id: 3, category: 'material', insight: 'Aluminium content ranges from ~65 kg (Citroën C3, economy-segment) to ~98 kg (Jeep Meridian, ladder-frame with aluminium hood and tailgate). At ₹95/kg scrap vs ₹215/kg virgin — a 2.26× gap — Meridian\'s aluminium alone yields ₹9,310/vehicle vs C3\'s ₹6,175/vehicle, a 51% per-vehicle value difference driven purely by vehicle architecture.' },
    { id: 4, category: 'compliance', insight: 'Citroën eC3\'s Li-ion battery pack (~29.2 kWh LFP chemistry) will enter the ELV pool from FY2028 onward. LFP packs have lower cobalt/nickel content than NMC packs but still require BWMH-2022 channelization. At ₹180/kg scrap vs ₹800/kg virgin — a 4.4× gap — Stellantis must pre-negotiate battery channelization into RVSF MoUs now.' },
    { id: 5, category: 'material', insight: 'Citroën C3\'s plastic content (~85 kg) includes panels manufactured with partial recycled plastic content — a first in India PV market. If certified recycled content is documented to regulators, this can count toward extended EPR credits under Plastic Waste Management Rules, reducing net EPR obligation cost.' },
    { id: 6, category: 'financial', insight: 'Copper recovery per Stellantis vehicle averages ~13 kg (Jeep Meridian, due to complex 4WD drive-by-wire and ADAS wiring) at ₹560/kg scrap = ₹7,280/vehicle vs ₹840/kg virgin. Meridian\'s higher copper content makes it one of the highest-value ELVs for copper recovery among India market vehicles.' },
    { id: 7, category: 'strategic', insight: 'Stellantis\' global Circular Economy Plan targets 40% recycled material content in new vehicles by 2030 — requiring formal ELV-to-production feedback loops. India operations should establish certified RVSF partnerships that enable material traceability from scrapped Stellantis vehicles back into the manufacturing supply chain.' },
    { id: 8, category: 'financial', insight: 'Freon recovery from Jeep Meridian (dual-zone climate, ~1.1 kg R-134a at ₹950/kg scrap = ₹1,045/vehicle vs ₹3,200/kg virgin — a 3.4× gap). Jeep models\' larger refrigerant charge yields ~22% higher freon recovery value vs Citroën C3 (0.9 kg = ₹855/vehicle) — a meaningful per-vehicle revenue differentiator for partner RVSFs.' },
    { id: 9, category: 'geography', insight: 'Jeep Compass/Meridian sales skew toward metro markets (Delhi NCR, Mumbai, Bengaluru, Pune) with established formal RVSF access. Citroën C3 and eC3 volumes are spread across Tier-2 cities where formal infrastructure is thinner — creating a geographic mismatch in Stellantis\'s ELV supply chain risk profile.' },
    { id: 10, category: 'financial', insight: 'Platinum/Palladium recovery from Stellantis catalytic converters averages ~3.5g/vehicle (Jeep diesel Meridian with larger three-way cat) at ₹2,800/g scrap = ₹9,800/vehicle — a significant high-value stream. PGM prices have shown 9% volatility over trailing 12 months; RVSF partners should have certified PGM assay and sale agreements with secondary refineries.' },
  ],
  suzuki_moto: [
    { id: 1, category: 'strategic', insight: 'Suzuki Motorcycle India Pvt. Ltd. (SMIPL) has no dedicated RVSF. EPR compliance via authorised dismantler network. With ~5 lakh annual sales (Access 125, Gixxer, Avenis, Burgman Street) and cumulative 15-year ELV volumes building toward 40 lakh vehicles by FY2029, formalising a 2W-specific ELV strategy is increasingly urgent.' },
    { id: 2, category: 'financial', insight: 'Steel per Suzuki two-wheeler averages ~58 kg (Access 125/Gixxer blend) at ₹28/kg scrap = ₹1,624/vehicle. At 5 lakh annual ELV volume, total steel scrap: ~₹812 Cr/year. Virgin steel at ₹65/kg creates a 2.3× value gap — at scale, secondary steel from Suzuki ELV fleet represents a meaningful supplier opportunity for secondary steel mills.' },
    { id: 3, category: 'material', insight: 'Aluminium per Suzuki two-wheeler averages ~5.2 kg (engine block, cylinder head, alloy wheels on Gixxer/Burgman). At ₹95/kg scrap vs ₹215/kg virgin — a 2.26× gap. Cast aluminium engine components have high purity (≥96% Al) and consistently fetch 10–15% scrap premium over sheet/billet scrap at certified secondary smelters.' },
    { id: 4, category: 'financial', insight: 'Copper wiring per Suzuki two-wheeler averages ~0.8 kg at ₹560/kg scrap = ₹448/vehicle. At 5 lakh ELV fleet: ~₹22.4 Cr/year in copper scrap value. Virgin copper at ₹840/kg creates a 1.5× gap — informal two-wheeler dismantlers typically sell copper wiring at 20–30% below market rate to kabadiwallas, losing significant value in the chain.' },
    { id: 5, category: 'material', insight: 'Rubber content per Suzuki two-wheeler (~8.5 kg — tyres, tubes, buffers, seals) at ₹12/kg scrap = ₹102/vehicle. Virgin rubber at ₹148/kg creates a 12.3× gap. Tyre-derived fuel (TDF) channels through CPCB-registered co-processing facilities could recover ₹18–24/kg instead — a potential 50–100% improvement in rubber scrap realisation.' },
    { id: 6, category: 'compliance', insight: 'E-waste per Suzuki two-wheeler (~0.35 kg — digital cluster, CDI unit, ABS module on Gixxer SF/250) at ₹45/kg scrap vs ₹2,500/kg virgin electronics — a 55× gap. CPCB channelization compliance for automotive e-waste from two-wheelers is rarely enforced, but PRO (Producer Responsibility Organisation) linkage will become mandatory under draft ELV rules.' },
    { id: 7, category: 'financial', insight: 'Platinum/Palladium recovery from Suzuki BS6 catalytic converters averages ~0.65g/vehicle at ₹2,800/g scrap = ₹1,820/vehicle. At 5 lakh EPR-eligible ELVs: ~₹91 Cr/year in PGM value. This stream is almost entirely captured by informal dismantlers who sell catalytic converter substrates to unregistered smelters at 40–60% below certified PGM assay rates.' },
    { id: 8, category: 'strategic', insight: 'Suzuki\'s 800+ dealer network across India could be rapidly converted into ELV collection touchpoints, dramatically reducing logistics costs and improving formal capture rate for two-wheelers in Tier-2/3 markets — Suzuki\'s geographic strength areas where formal RVSF presence is lowest.' },
    { id: 9, category: 'financial', insight: 'Used oil per Suzuki two-wheeler (~0.6L at ₹18/L scrap vs ₹180/L virgin base oil — a 10× gap) yields ₹10.8/vehicle. At 5 lakh ELV fleet: ~₹5.4 Cr/year in used oil scrap, currently predominantly mixed with waste oil in informal channels without certified re-refining, creating HSPCB/SPCBs compliance liability for informal operators.' },
    { id: 10, category: 'strategic', insight: 'Suzuki\'s EV transition (Burgman Electric, upcoming Avenis EV) will introduce Li-ion battery ELV volumes from FY2026. At ₹180/kg scrap vs ₹800/kg virgin — a 4.4× gap — battery-specific BWMH protocols must be embedded in all RVSF MoUs before the first Burgman EVs reach the 10-year early scrappage trigger in FY2030.' },
  ],
  tvs: [
    { id: 1, category: 'capacity', insight: 'TVS Motor Company operates India\'s only OEM-owned two-wheeler-specific RVSF at Besthmanahalli, Bengaluru Rural — processing ~340 vehicles/month at 12,000/year capacity (34% annual utilization). Significant intake headroom exists; targeted dealer-level ELV awareness campaigns could realistically double throughput within 18 months without CAPEX.' },
    { id: 2, category: 'geography', insight: 'Bengaluru facility draws RC origin primarily from Karnataka (50%), Tamil Nadu (22%), Andhra Pradesh (12%), and Kerala (8%) — strong South India coverage. However, North India markets where TVS Apache/Jupiter have high sales density (UP, Maharashtra, Rajasthan) have zero TVS RVSF presence, limiting formal capture to ~15% of North India ELV volume.' },
    { id: 3, category: 'financial', insight: 'Steel recovery per TVS two-wheeler averages ~55 kg at ₹28/kg scrap = ₹1,540/vehicle. At current 4,080 vehicles/year actual throughput: ₹6.3L/year in steel scrap. At full 12,000/year capacity: ₹18.5L/year. Virgin steel at ₹65/kg (2.3× scrap) represents a benchmark for per-vehicle steel value creation in the formal ELV chain.' },
    { id: 4, category: 'material', insight: 'Aluminium per TVS two-wheeler averages ~5.5 kg — including aluminium-alloy engine block (Ntorq/Apache RTR 200) and alloy wheels. At ₹95/kg scrap vs ₹215/kg virgin — a 2.26× gap. TVS\'s premium segment alloy wheels (forged alloy on Apache RR 310) carry 12–15% scrap premium over standard cast alloy due to higher aluminium purity.' },
    { id: 5, category: 'financial', insight: 'Platinum/Palladium from TVS BS6 catalytic converters (Apache 160/200, Jupiter 125, Ntorq 125) averages ~0.7g/vehicle at ₹2,800/g scrap = ₹1,960/vehicle. At current 340 vehicles/month: ~₹6.7L/month in PGM value — the highest value-per-kg material stream at TVS Bengaluru RVSF. PGM price volatility (±9% over 12 months) is the single largest per-vehicle revenue variable.' },
    { id: 6, category: 'financial', insight: 'Rubber recovery per TVS two-wheeler (~9 kg — 2 tyres + tubes + bushings) at ₹12/kg scrap = ₹108/vehicle. At full 12,000 capacity: ₹13L/year in rubber scrap. TDF (Tyre-Derived Fuel) conversion at a co-processing RVSF would yield ₹18–24/kg — an 50–100% improvement, adding ₹6–9L/year to rubber scrap revenue without additional vehicle throughput.' },
    { id: 7, category: 'strategic', insight: 'TVS\'s iQube and X electric scooter portfolio will generate Li-ion battery ELV volumes from FY2027. iQube\'s 3.04 kWh LFP battery pack weighs ~14 kg — at ₹180/kg scrap vs ₹800/kg virgin, each pack is worth ₹2,520 in scrap. BWMH-certified dismantling capability is a mandatory upgrade for Bengaluru RVSF to handle iQube ELVs compliantly from FY2030.' },
    { id: 8, category: 'material', insight: 'Copper wiring per TVS vehicle averages ~0.9 kg at ₹560/kg scrap = ₹504/vehicle. TVS Apache RR 310\'s ride-by-wire throttle and multi-channel ABS wiring adds ~0.25 kg additional copper vs base commuter models — demonstrating how premium variant share in ELV intake meaningfully impacts per-vehicle copper realisation.' },
    { id: 9, category: 'strategic', insight: 'Expanding TVS RVSF network to 4–5 locations (adding UP/Delhi NCR, Pune/Maharashtra, and Chennai/Tamil Nadu nodes) would increase formal two-wheeler ELV capture from ~4% of India two-wheeler market to ~28–35% — aligning with draft ELV Policy targets and positioning TVS as the benchmark OEM-operated two-wheeler RVSF model for India.' },
    { id: 10, category: 'compliance', insight: 'TVS\'s V-SCRAP registration at MoRTH provides regulatory precedent for two-wheeler RVSF certification — a first in India. Sharing facility SOP, CPCB compliance frameworks, and staff training protocols with industry bodies (SIAM, ATMA) could accelerate ecosystem development and strengthen TVS\'s EPR credit position through proactive regulatory engagement.' },
  ],
};
