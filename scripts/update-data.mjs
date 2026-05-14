#!/usr/bin/env node
/**
 * MatNEXT Eco-Insights — Data Update Script
 *
 * MANUAL MODE (prompt-driven):
 *   node scripts/update-data.mjs
 *
 * IMPORT MODE (from Vahan browser-script JSON):
 *   node scripts/update-data.mjs --import path/to/rvsf_full_data.json [--fy 2024-25]
 *
 * The import mode reads the JSON produced by the Vahan portal browser script,
 * maps each RVSF via scripts/vahan-mapping.json, and writes all fields to
 * src/data/liveData.json automatically.
 *
 * Fields updated per import:
 *   oemCompetitor.monthlyOverrides[month][competitorId]  ← monthlyCD
 *   oemCompetitor.rcOriginOverrides[competitorId]        ← rcOriginStates (% converted)
 *   elvHotspot.collectionOverrides[FY][elvId]            ← summary.privateCDTotal
 *   oemCompetitor.lastUpdated / elvHotspot.lastUpdated   ← now
 */

import { createInterface } from 'readline';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIVE_DATA_PATH    = join(__dirname, '../src/data/liveData.json');
const MAPPING_PATH      = join(__dirname, 'vahan-mapping.json');

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// ─── Month helpers ────────────────────────────────────────────────────────────

const MONTH_3 = { JAN:'Jan',FEB:'Feb',MAR:'Mar',APR:'Apr',MAY:'May',JUN:'Jun',
                  JUL:'Jul',AUG:'Aug',SEP:'Sep',OCT:'Oct',NOV:'Nov',DEC:'Dec' };
const MONTHS_ORDERED = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

/** "01-APR-2025" → 2025 */
function yearFromPortalDate(d) {
  return parseInt(d?.split('-')[2] ?? new Date().getFullYear());
}

/** "01-APR-2025" → month index 0-11 (APR = 3) */
function monthIdxFromPortalDate(d) {
  const mon = d?.split('-')[1]?.toUpperCase();
  return MONTHS_ORDERED.indexOf(mon ?? 'JAN');
}

/**
 * Convert browser-script monthlyCD array to dashboard month keys.
 * The portal chart always shows JAN-DEC bars for the calendar year of fromDate.
 * For FY ranges spanning two years (e.g. Apr 2025 – Mar 2026) the bars
 * still correspond to Jan–Dec of fromDate's year; the importer writes all 12.
 */
function buildMonthKeys(monthlyCD, fromDate) {
  const year = yearFromPortalDate(fromDate);
  return monthlyCD.map(({ month, value, cdGenerated }) => ({
    key: `${MONTH_3[month.toUpperCase()]} ${year}`,
    value: value ?? cdGenerated ?? 0,
  }));
}

/**
 * Derive FY string from fromDate.
 * "01-APR-2025" → "2025-26"  |  "01-JAN-2025" → "2024-25"
 */
function fyFromPortalDate(d) {
  const year = yearFromPortalDate(d);
  const mIdx = monthIdxFromPortalDate(d);
  // Indian FY starts April (idx 3)
  if (mIdx >= 3) return `${year}-${String(year + 1).slice(-2)}`;
  return `${year - 1}-${String(year).slice(-2)}`;
}

// ─── OEM Competitor config (mirrors competitorData.ts) ───────────────────────

const allMonths = [
  'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024',
  'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025',
  'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025',
  'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026',
];

const monthUtil24 = [
  0.78, 0.82, 0.85, 0.90, 0.87, 0.84, 0.81, 0.88, 0.92, 0.86, 0.90, 0.83,
  0.85, 0.88, 0.92, 0.97, 0.95, 0.93, 0.90, 0.96, 1.0, 0.94, 1.05, 0.98,
];

const rvsfBaseRate = {
  msti_noida: 870, rewire_jaipur: 480, rewire_bhubaneswar: 290, rewire_surat: 380,
  rewire_chandigarh: 390, rewire_delhi: 620, rewire_pune: 840, rewire_guwahati: 365,
  rewire_kolkata: 660, rewire_lucknow: 430, rewire_raipur: 880,
  cero_greater_noida: 1050, cero_chennai: 790, cero_pune: 920, cero_bengaluru: 680,
  cero_ahmedabad: 560, cero_indore: 465, cero_hyderabad: 560, cero_guwahati: 340,
  cero_chandigarh: 310, cero_kolkata: 230, cero_mumbai: 250, cero_jaipur: 148,
  cero_nagpur: 170, cero_bhopal: 138,
};

const oemRvsfNames = {
  msti_noida: 'MSTI — Noida (MSIL/Honda/Toyota)',
  rewire_jaipur: 'Re.Wi.Re — Jaipur (Tata)',
  rewire_bhubaneswar: 'Re.Wi.Re — Bhubaneswar (Tata)',
  rewire_surat: 'Re.Wi.Re — Surat (Tata)',
  rewire_chandigarh: 'Re.Wi.Re — Chandigarh (Tata)',
  rewire_delhi: 'Re.Wi.Re — Delhi NCR (Tata)',
  rewire_pune: 'Re.Wi.Re — Pune (Tata)',
  rewire_guwahati: 'Re.Wi.Re — Guwahati (Tata)',
  rewire_kolkata: 'Re.Wi.Re — Kolkata (Tata)',
  rewire_lucknow: 'Re.Wi.Re — Lucknow (Tata)',
  rewire_raipur: 'Re.Wi.Re — Raipur (Tata)',
  cero_greater_noida: 'CERO — Greater Noida (Mahindra)',
  cero_chennai: 'CERO — Chennai (Mahindra)',
  cero_pune: 'CERO — Pune (Mahindra)',
  cero_bengaluru: 'CERO — Bengaluru (Mahindra)',
  cero_ahmedabad: 'CERO — Ahmedabad (Mahindra)',
  cero_indore: 'CERO — Indore (Mahindra)',
  cero_hyderabad: 'CERO — Hyderabad (Mahindra)',
  cero_guwahati: 'CERO — Guwahati (Mahindra)',
  cero_chandigarh: 'CERO — Chandigarh (Mahindra)',
  cero_kolkata: 'CERO — Kolkata (Mahindra)',
  cero_mumbai: 'CERO — Mumbai (Mahindra)',
  cero_jaipur: 'CERO — Jaipur (Mahindra)',
  cero_nagpur: 'CERO — Nagpur (Mahindra)',
  cero_bhopal: 'CERO — Bhopal (Mahindra)',
};

// ─── ELV Hotspot config ───────────────────────────────────────────────────────

const elvFYOptions = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

const elvRvsfList = [
  { id: 'RVSF-001', name: 'MSTI Noida', state: 'Uttar Pradesh' },
  { id: 'RVSF-002', name: 'MSTI Gujarat', state: 'Gujarat' },
  { id: 'RVSF-003', name: 'MSTI South - Bengaluru', state: 'Karnataka' },
  { id: 'RVSF-004', name: 'MSTI West - Pune', state: 'Maharashtra' },
  { id: 'RVSF-005', name: 'Delhi RVSF Hub', state: 'Delhi' },
  { id: 'RVSF-006', name: 'Haryana Auto Scrap - Gurugram', state: 'Haryana' },
  { id: 'RVSF-007', name: 'Chennai Vehicle Scrap Centre', state: 'Tamil Nadu' },
  { id: 'RVSF-008', name: 'Hyderabad ELV Processing', state: 'Telangana' },
  { id: 'RVSF-009', name: 'Kolkata Scrap Hub', state: 'West Bengal' },
  { id: 'RVSF-010', name: 'Rajasthan Auto Recycle - Jaipur', state: 'Rajasthan' },
  { id: 'RVSF-011', name: 'Punjab Vehicle Dismantling', state: 'Punjab' },
  { id: 'RVSF-012', name: 'Kerala ELV Hub - Kochi', state: 'Kerala' },
  { id: 'RVSF-013', name: 'Mumbai Scrap Centre - Thane', state: 'Maharashtra' },
  { id: 'RVSF-014', name: 'Nagpur Auto Recycle', state: 'Maharashtra' },
  { id: 'RVSF-015', name: 'MP Vehicles Scrap - Indore', state: 'Madhya Pradesh' },
  { id: 'RVSF-016', name: 'Andhra ELV Processing Centre', state: 'Andhra Pradesh' },
  { id: 'RVSF-017', name: 'Coimbatore Scrap Hub', state: 'Tamil Nadu' },
  { id: 'RVSF-018', name: 'Bengaluru South Scrap', state: 'Karnataka' },
  { id: 'RVSF-019', name: 'Ahmedabad ELV Centre', state: 'Gujarat' },
  { id: 'RVSF-020', name: 'Lucknow Auto Scrap', state: 'Uttar Pradesh' },
  { id: 'RVSF-021', name: 'Bihar Vehicle Scrap - Patna', state: 'Bihar' },
  { id: 'RVSF-022', name: 'Odisha ELV Centre - Bhubaneswar', state: 'Odisha' },
  { id: 'RVSF-023', name: 'Gurgaon Scrap Hub', state: 'Haryana' },
  { id: 'RVSF-024', name: 'Faridabad Vehicle Dismantling', state: 'Haryana' },
  { id: 'RVSF-025', name: 'Surat ELV Processing', state: 'Gujarat' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const seeded = (seed, min, max) => {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return Math.round(min + r * (max - min));
};

function computedMonthlyCount(rvsfId, monthIdx) {
  const base = rvsfBaseRate[rvsfId] ?? 200;
  const variance = seeded(monthIdx * 31 + rvsfId.length * 7 + rvsfId.charCodeAt(0), -12, 12) / 100;
  return Math.round(base * monthUtil24[monthIdx] * (1 + variance));
}

function fmt(n) {
  return n !== undefined && n !== null ? n.toLocaleString('en-IN') : '—';
}

function formatDate(iso) {
  if (!iso) return 'never';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function loadLiveData() {
  try {
    return JSON.parse(readFileSync(LIVE_DATA_PATH, 'utf-8'));
  } catch {
    console.error(`ERROR: Cannot read ${LIVE_DATA_PATH}`);
    process.exit(1);
  }
}

function saveLiveData(liveData) {
  writeFileSync(LIVE_DATA_PATH, JSON.stringify(liveData, null, 2) + '\n');
  console.log('  liveData.json saved.');
}

async function offerCommit(label) {
  const doCommit = (await ask('\nCommit and push? (triggers auto-redeploy) [y/n]: ')).trim().toLowerCase();
  if (doCommit === 'y') {
    try {
      execSync('git add src/data/liveData.json', { stdio: 'inherit' });
      const date = new Date().toISOString().split('T')[0];
      execSync(`git commit -m "data: update ${label} [${date}]"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });
      console.log('\n  Pushed. Auto-deployment triggered.\n');
    } catch (e) {
      console.error('\n  git push failed:', e.message);
      console.log('  Run manually: git add src/data/liveData.json && git commit -m "data: update" && git push\n');
    }
  } else {
    console.log('\n  Skipped. Run `git push` manually when ready.\n');
  }
}

// ─── IMPORT MODE ──────────────────────────────────────────────────────────────

async function runImport(jsonPath, cliFY) {
  // Load browser-script JSON
  let records;
  try {
    records = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Cannot read ${jsonPath}: ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(records)) {
    console.error('ERROR: JSON must be an array of RVSF records (as produced by the Vahan browser script).');
    process.exit(1);
  }

  // Load mapping
  let mappingDoc;
  if (!existsSync(MAPPING_PATH)) {
    console.error(`ERROR: Mapping file not found at ${MAPPING_PATH}`);
    console.error('       Run the script once to generate it, then fill in the vahanCode values.');
    process.exit(1);
  }
  try {
    mappingDoc = JSON.parse(readFileSync(MAPPING_PATH, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Cannot parse ${MAPPING_PATH}: ${e.message}`);
    process.exit(1);
  }

  // Build lookup: vahanCode → { competitorId, elvId }
  const byCode = {};
  const byName = {};
  for (const m of (mappingDoc.mappings ?? [])) {
    if (m.vahanCode && m.vahanCode !== 'FILL_ME') byCode[m.vahanCode] = m;
    if (m.name) byName[m.name.toLowerCase()] = m;
  }

  // Derive FY from first record's fromDate if not supplied via CLI
  const sampleDate = records.find(r => r.fromDate)?.fromDate;
  const derivedFY  = sampleDate ? fyFromPortalDate(sampleDate) : '2024-25';
  const targetFY   = cliFY || derivedFY;

  console.log('\n====================================================');
  console.log('  MatNEXT — Vahan Import');
  console.log('====================================================');
  console.log(`  JSON file   : ${jsonPath}`);
  console.log(`  Records     : ${records.length} RVSFs`);
  console.log(`  Date range  : ${sampleDate ?? '?'} → ${records.find(r => r.uptoDate)?.uptoDate ?? '?'}`);
  console.log(`  ELV target FY: ${targetFY}`);
  console.log('====================================================\n');

  const liveData = loadLiveData();
  if (!liveData.oemCompetitor.rcOriginOverrides) liveData.oemCompetitor.rcOriginOverrides = {};

  const stats = { monthly: 0, rcOrigin: 0, elvCollection: 0, skipped: 0, unmapped: 0 };

  for (const rec of records) {
    if (rec.error) { stats.skipped++; continue; }

    // Resolve mapping: try by code first, then by name
    const mapping = byCode[rec.rvsfCode]
      ?? byName[rec.rvsf?.toLowerCase()]
      ?? null;

    if (!mapping) {
      console.warn(`  [UNMAPPED] ${rec.rvsf} (code: ${rec.rvsfCode}) — add to vahan-mapping.json`);
      stats.unmapped++;
      continue;
    }

    const { competitorId, elvId } = mapping;

    // ── 1. OEM Competitor: monthly CD overrides ──
    if (competitorId && Array.isArray(rec.monthlyCD)) {
      const monthKeys = buildMonthKeys(rec.monthlyCD, rec.fromDate);
      for (const { key, value } of monthKeys) {
        if (!allMonths.includes(key)) continue; // outside dashboard range — skip
        if (!liveData.oemCompetitor.monthlyOverrides[key]) {
          liveData.oemCompetitor.monthlyOverrides[key] = {};
        }
        liveData.oemCompetitor.monthlyOverrides[key][competitorId] = value;
        stats.monthly++;
      }
    }

    // ── 2. OEM Competitor: RC origin overrides ──
    if (competitorId && Array.isArray(rec.rcOriginStates) && rec.rcOriginStates.length > 0) {
      const total = rec.rcOriginStates.reduce((s, r) => s + (r.count || 0), 0);
      if (total > 0) {
        const dist = {};
        for (const { state, count } of rec.rcOriginStates) {
          if (state && count > 0) {
            dist[state] = Math.round((count / total) * 1000) / 10; // 1 decimal %
          }
        }
        liveData.oemCompetitor.rcOriginOverrides[competitorId] = dist;
        stats.rcOrigin++;
      }
    }

    // ── 3. ELV Hotspot: annual collection override ──
    if (elvId) {
      const total = rec.summary?.privateCDTotal ?? 0;
      if (total > 0) {
        if (!liveData.elvHotspot.collectionOverrides[targetFY]) {
          liveData.elvHotspot.collectionOverrides[targetFY] = {};
        }
        liveData.elvHotspot.collectionOverrides[targetFY][elvId] = total;
        stats.elvCollection++;
      }
    }
  }

  // Update timestamps
  const now = new Date().toISOString();
  liveData.oemCompetitor.lastUpdated = now;
  liveData.elvHotspot.lastUpdated    = now;

  saveLiveData(liveData);

  console.log('\n  Import complete:');
  console.log(`    Monthly overrides written : ${stats.monthly}`);
  console.log(`    RC origin overrides       : ${stats.rcOrigin}`);
  console.log(`    ELV collection overrides  : ${stats.elvCollection}`);
  console.log(`    Skipped (portal errors)   : ${stats.skipped}`);
  console.log(`    Unmapped (no match found) : ${stats.unmapped}`);
  if (stats.unmapped > 0) {
    console.log(`\n  Fill in the missing vahanCode values in ${MAPPING_PATH}`);
    console.log('  and re-run to include those RVSFs.\n');
  }

  await offerCommit('Vahan import');
}

// ─── MANUAL MODE ─────────────────────────────────────────────────────────────

async function updateELVHotspot(liveData) {
  console.log('\n--- ELV Hotspot: Select FY ---\n');
  elvFYOptions.forEach((fy, i) => console.log(`  ${i + 1}. FY ${fy}`));

  const fyChoice = (await ask('\nEnter FY number: ')).trim();
  const fyIdx = parseInt(fyChoice, 10) - 1;
  if (isNaN(fyIdx) || fyIdx < 0 || fyIdx >= elvFYOptions.length) {
    console.log('Invalid choice.'); return;
  }
  const fy = elvFYOptions[fyIdx];

  if (!liveData.elvHotspot.collectionOverrides[fy]) {
    liveData.elvHotspot.collectionOverrides[fy] = {};
  }
  const fyOverrides = liveData.elvHotspot.collectionOverrides[fy];

  const elvBaseData = {
    '2021-22': { 'RVSF-001': 4000, 'RVSF-002': 5000, 'RVSF-003': 4500, 'RVSF-004': 6000, 'RVSF-005': 13000, 'RVSF-006': 3000, 'RVSF-007': 3500, 'RVSF-008': 2500, 'RVSF-009': 2000, 'RVSF-010': 1500 },
    '2022-23': { 'RVSF-001': 9000, 'RVSF-002': 10000, 'RVSF-003': 9000, 'RVSF-004': 12000, 'RVSF-005': 15000, 'RVSF-006': 7000, 'RVSF-007': 7000, 'RVSF-008': 5000, 'RVSF-009': 4000, 'RVSF-010': 3000, 'RVSF-011': 2500, 'RVSF-013': 8000, 'RVSF-020': 4500, 'RVSF-023': 4000, 'RVSF-024': 3500, 'RVSF-025': 4500 },
    '2023-24': { 'RVSF-001': 13000, 'RVSF-002': 12000, 'RVSF-003': 12000, 'RVSF-004': 16000, 'RVSF-005': 22000, 'RVSF-006': 9000, 'RVSF-007': 10000, 'RVSF-008': 9000, 'RVSF-009': 7000, 'RVSF-010': 5000, 'RVSF-011': 4000, 'RVSF-012': 6000, 'RVSF-013': 12000, 'RVSF-014': 5000, 'RVSF-015': 4000, 'RVSF-016': 5000, 'RVSF-017': 6000, 'RVSF-018': 5000, 'RVSF-019': 6000, 'RVSF-020': 7000, 'RVSF-023': 5500, 'RVSF-024': 5500, 'RVSF-025': 7000 },
    '2024-25': { 'RVSF-001': 20000, 'RVSF-002': 20000, 'RVSF-003': 20000, 'RVSF-004': 25000, 'RVSF-005': 33000, 'RVSF-006': 14000, 'RVSF-007': 18000, 'RVSF-008': 14000, 'RVSF-009': 12000, 'RVSF-010': 8000, 'RVSF-011': 7000, 'RVSF-012': 10000, 'RVSF-013': 20000, 'RVSF-014': 9000, 'RVSF-015': 7000, 'RVSF-016': 8000, 'RVSF-017': 8000, 'RVSF-018': 10000, 'RVSF-019': 12000, 'RVSF-020': 12000, 'RVSF-021': 3000, 'RVSF-022': 2500, 'RVSF-023': 10000, 'RVSF-024': 7500, 'RVSF-025': 10000 },
  };

  console.log(`\n--- ELV Hotspot: FY ${fy} — Enter vehicles collected per RVSF ---`);
  console.log('  Press Enter to keep current value. Type number to update.\n');

  for (const rvsf of elvRvsfList) {
    const override = fyOverrides[rvsf.id];
    const base = elvBaseData[fy]?.[rvsf.id];
    const current = override ?? base;
    const display = current !== undefined
      ? (override !== undefined ? `override: ${fmt(override)}, base: ${fmt(base)}` : `base: ${fmt(base)}`)
      : 'no data yet';

    const input = (await ask(`  ${rvsf.id} | ${rvsf.name} (${rvsf.state}) [${display}]: `)).trim();
    if (input === '') continue;
    const val = parseInt(input, 10);
    if (!isNaN(val) && val >= 0) {
      fyOverrides[rvsf.id] = val;
    } else {
      console.log('    Invalid — skipped.');
    }
  }

  console.log(`\n  FY ${fy} ELV data updated.`);
}

async function updateOEMCompetitor(liveData) {
  console.log('\n--- OEM Competitor: Select Month ---\n');
  allMonths.forEach((m, i) => console.log(`  ${String(i + 1).padStart(2)}. ${m}`));

  const monthChoice = (await ask('\nEnter month number: ')).trim();
  const mIdx = parseInt(monthChoice, 10) - 1;
  if (isNaN(mIdx) || mIdx < 0 || mIdx >= allMonths.length) {
    console.log('Invalid choice.'); return;
  }
  const month = allMonths[mIdx];

  if (!liveData.oemCompetitor.monthlyOverrides[month]) {
    liveData.oemCompetitor.monthlyOverrides[month] = {};
  }
  const monthOverrides = liveData.oemCompetitor.monthlyOverrides[month];

  console.log(`\n--- OEM Competitor: ${month} — Enter vehicles collected per RVSF ---`);
  console.log('  Press Enter to keep value. Type number to set actual.\n');

  for (const [rvsfId, name] of Object.entries(oemRvsfNames)) {
    const computed = computedMonthlyCount(rvsfId, mIdx);
    const existing = monthOverrides[rvsfId];
    const display = existing !== undefined
      ? `actual: ${fmt(existing)}, algo: ${fmt(computed)}`
      : `algo: ${fmt(computed)}`;

    const input = (await ask(`  ${name} [${display}]: `)).trim();
    if (input === '') continue;
    const val = parseInt(input, 10);
    if (!isNaN(val) && val >= 0) {
      monthOverrides[rvsfId] = val;
    } else {
      console.log('    Invalid — skipped.');
    }
  }

  console.log(`\n  ${month} OEM Competitor data updated.`);
}

async function runManual() {
  const liveData = loadLiveData();

  console.log('\n====================================================');
  console.log('  MatNEXT Eco-Insights — Data Update Tool');
  console.log('====================================================');
  const elvTs  = liveData.elvHotspot?.lastUpdated;
  const oemTs  = liveData.oemCompetitor?.lastUpdated;
  if (elvTs)  console.log(`  ELV Hotspot last updated : ${formatDate(elvTs)}`);
  if (oemTs)  console.log(`  OEM Competitor last updated: ${formatDate(oemTs)}`);
  console.log('====================================================\n');

  console.log('Which tab to update?');
  console.log('  1. ELV Hotspot Analysis');
  console.log('  2. OEM Competitor Analysis');
  console.log('  3. Exit\n');

  const tabChoice = (await ask('Enter choice (1/2/3): ')).trim();

  if (tabChoice === '3') {
    console.log('Exiting.');
    rl.close();
    return;
  }

  if (tabChoice === '1') {
    await updateELVHotspot(liveData);
    liveData.elvHotspot.lastUpdated = new Date().toISOString();
  } else if (tabChoice === '2') {
    await updateOEMCompetitor(liveData);
    liveData.oemCompetitor.lastUpdated = new Date().toISOString();
  } else {
    console.log('Invalid choice. Exiting.');
    rl.close();
    return;
  }

  saveLiveData(liveData);
  await offerCommit(tabChoice === '1' ? 'ELV Hotspot' : 'OEM Competitor');
  rl.close();
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const importIdx = args.indexOf('--import');

if (importIdx !== -1) {
  const jsonPath = args[importIdx + 1];
  if (!jsonPath) {
    console.error('ERROR: --import requires a file path. Example: node scripts/update-data.mjs --import ./rvsf_data.json');
    process.exit(1);
  }
  const fyIdx = args.indexOf('--fy');
  const cliFY = fyIdx !== -1 ? args[fyIdx + 1] : null;
  runImport(jsonPath, cliFY).catch((e) => { console.error(e); rl.close(); }).finally(() => rl.close());
} else {
  runManual().catch((e) => { console.error(e); rl.close(); });
}
