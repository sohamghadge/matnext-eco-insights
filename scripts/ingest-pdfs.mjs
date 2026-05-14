#!/usr/bin/env node
/**
 * MatNEXT PDF Ingestion Script
 *
 * Drop PDFs into:  data/pdfs/inbox/
 * Processed land in: data/pdfs/processed/
 *
 * Usage:
 *   node scripts/ingest-pdfs.mjs           — interactive (review each candidate)
 *   node scripts/ingest-pdfs.mjs --auto    — headless (for cron, auto-applies + commits)
 *
 * Cron (daily 8am, auto mode):
 *   0 8 * * * cd /path/to/matnext-eco-insights && node scripts/ingest-pdfs.mjs --auto >> logs/ingest.log 2>&1
 */

import { createRequire } from 'module';
import { createInterface } from 'readline';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, renameSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// CJS compat for pdf-parse
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const INBOX      = join(ROOT, 'data/pdfs/inbox');
const PROCESSED  = join(ROOT, 'data/pdfs/processed');
const LIVE_DATA  = join(ROOT, 'src/data/liveData.json');

const AUTO = process.argv.includes('--auto');

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// ─── RVSF alias tables ────────────────────────────────────────────────────────

const OEM_RVSFS = [
  { id: 'msti_noida',        name: 'MSTI — Noida',          aliases: ['MSTI Noida', 'MSTI', 'Maruti Suzuki Toyotsu'] },
  { id: 'rewire_jaipur',     name: 'Re.Wi.Re — Jaipur',     aliases: ['Re.Wi.Re Jaipur', 'ReWiRe Jaipur', 'Rewire Jaipur'] },
  { id: 'rewire_bhubaneswar',name: 'Re.Wi.Re — Bhubaneswar',aliases: ['Re.Wi.Re Bhubaneswar', 'Rewire Bhubaneswar'] },
  { id: 'rewire_surat',      name: 'Re.Wi.Re — Surat',      aliases: ['Re.Wi.Re Surat', 'Rewire Surat'] },
  { id: 'rewire_chandigarh', name: 'Re.Wi.Re — Chandigarh', aliases: ['Re.Wi.Re Chandigarh', 'Rewire Chandigarh'] },
  { id: 'rewire_delhi',      name: 'Re.Wi.Re — Delhi NCR',  aliases: ['Re.Wi.Re Delhi', 'Rewire Delhi', 'Delhi NCR Tata'] },
  { id: 'rewire_pune',       name: 'Re.Wi.Re — Pune',       aliases: ['Re.Wi.Re Pune', 'Rewire Pune'] },
  { id: 'rewire_guwahati',   name: 'Re.Wi.Re — Guwahati',   aliases: ['Re.Wi.Re Guwahati', 'Rewire Guwahati'] },
  { id: 'rewire_kolkata',    name: 'Re.Wi.Re — Kolkata',    aliases: ['Re.Wi.Re Kolkata', 'Rewire Kolkata'] },
  { id: 'rewire_lucknow',    name: 'Re.Wi.Re — Lucknow',    aliases: ['Re.Wi.Re Lucknow', 'Rewire Lucknow'] },
  { id: 'rewire_raipur',     name: 'Re.Wi.Re — Raipur',     aliases: ['Re.Wi.Re Raipur', 'Rewire Raipur'] },
  { id: 'cero_greater_noida',name: 'CERO — Greater Noida',  aliases: ['CERO Greater Noida', 'CERO Noida'] },
  { id: 'cero_chennai',      name: 'CERO — Chennai',        aliases: ['CERO Chennai', 'CERO Sriperumbudur'] },
  { id: 'cero_pune',         name: 'CERO — Pune',           aliases: ['CERO Pune'] },
  { id: 'cero_bengaluru',    name: 'CERO — Bengaluru',      aliases: ['CERO Bengaluru', 'CERO Bangalore', 'CERO Devanahalli'] },
  { id: 'cero_ahmedabad',    name: 'CERO — Ahmedabad',      aliases: ['CERO Ahmedabad', 'CERO Kheda'] },
  { id: 'cero_indore',       name: 'CERO — Indore',         aliases: ['CERO Indore'] },
  { id: 'cero_hyderabad',    name: 'CERO — Hyderabad',      aliases: ['CERO Hyderabad', 'CERO Tupran'] },
  { id: 'cero_guwahati',     name: 'CERO — Guwahati',       aliases: ['CERO Guwahati'] },
  { id: 'cero_chandigarh',   name: 'CERO — Chandigarh',     aliases: ['CERO Chandigarh'] },
  { id: 'cero_kolkata',      name: 'CERO — Kolkata',        aliases: ['CERO Kolkata'] },
  { id: 'cero_mumbai',       name: 'CERO — Mumbai',         aliases: ['CERO Mumbai'] },
  { id: 'cero_jaipur',       name: 'CERO — Jaipur',         aliases: ['CERO Jaipur'] },
  { id: 'cero_nagpur',       name: 'CERO — Nagpur',         aliases: ['CERO Nagpur'] },
  { id: 'cero_bhopal',       name: 'CERO — Bhopal',         aliases: ['CERO Bhopal'] },
];

const ELV_RVSFS = [
  { id: 'RVSF-001', name: 'MSTI Noida',                 aliases: ['RVSF-001', 'RVSF 001', 'MSTI Noida'] },
  { id: 'RVSF-002', name: 'Surat Vehicle Recycling Hub',aliases: ['RVSF-002', 'RVSF 002', 'Surat Vehicle Recycling'] },
  { id: 'RVSF-003', name: 'Bengaluru Auto Dismantling', aliases: ['RVSF-003', 'RVSF 003', 'Bengaluru Auto Dismantling'] },
  { id: 'RVSF-004', name: 'Pune Scrap Hub',             aliases: ['RVSF-004', 'RVSF 004', 'Pune Scrap Hub', 'Chakan Scrap'] },
  { id: 'RVSF-005', name: 'Delhi ELV Centre',           aliases: ['RVSF-005', 'RVSF 005', 'Delhi ELV Centre', 'Bawana ELV'] },
  { id: 'RVSF-006', name: 'Manesar Scrap Facility',     aliases: ['RVSF-006', 'RVSF 006', 'Manesar Scrap', 'Manesar Vehicle Scrap'] },
  { id: 'RVSF-007', name: 'Chennai Scrap Centre',       aliases: ['RVSF-007', 'RVSF 007', 'Chennai Vehicle Scrap'] },
  { id: 'RVSF-008', name: 'Hyderabad ELV Processing',  aliases: ['RVSF-008', 'RVSF 008', 'Hyderabad ELV'] },
  { id: 'RVSF-009', name: 'Kolkata Scrap Hub',          aliases: ['RVSF-009', 'RVSF 009', 'Kolkata Scrap Hub'] },
  { id: 'RVSF-010', name: 'Jaipur Auto Recycle',        aliases: ['RVSF-010', 'RVSF 010', 'Rajasthan Auto Recycle'] },
  { id: 'RVSF-011', name: 'Punjab Vehicle Dismantling', aliases: ['RVSF-011', 'RVSF 011', 'Punjab Vehicle Dismantling'] },
  { id: 'RVSF-012', name: 'Kerala ELV Hub',             aliases: ['RVSF-012', 'RVSF 012', 'Kerala ELV Hub', 'Kochi ELV'] },
  { id: 'RVSF-013', name: 'Mumbai Scrap Centre',        aliases: ['RVSF-013', 'RVSF 013', 'Mumbai Scrap Centre', 'Thane Scrap'] },
  { id: 'RVSF-014', name: 'Nagpur Auto Recycle',        aliases: ['RVSF-014', 'RVSF 014', 'Nagpur Auto Recycle'] },
  { id: 'RVSF-015', name: 'Indore Scrap',               aliases: ['RVSF-015', 'RVSF 015', 'MP Vehicles Scrap', 'Indore Scrap'] },
  { id: 'RVSF-016', name: 'Andhra ELV Centre',          aliases: ['RVSF-016', 'RVSF 016', 'Andhra ELV', 'Visakhapatnam ELV'] },
  { id: 'RVSF-017', name: 'Coimbatore Scrap Hub',       aliases: ['RVSF-017', 'RVSF 017', 'Coimbatore Scrap'] },
  { id: 'RVSF-018', name: 'Bengaluru South Scrap',      aliases: ['RVSF-018', 'RVSF 018', 'Bengaluru South Scrap'] },
  { id: 'RVSF-019', name: 'Ahmedabad ELV Centre',       aliases: ['RVSF-019', 'RVSF 019', 'Ahmedabad ELV'] },
  { id: 'RVSF-020', name: 'Lucknow Auto Scrap',         aliases: ['RVSF-020', 'RVSF 020', 'Lucknow Auto Scrap'] },
  { id: 'RVSF-021', name: 'Patna Vehicle Scrap',        aliases: ['RVSF-021', 'RVSF 021', 'Bihar Vehicle Scrap', 'Patna Scrap'] },
  { id: 'RVSF-022', name: 'Bhubaneswar ELV Centre',     aliases: ['RVSF-022', 'RVSF 022', 'Odisha ELV', 'Bhubaneswar ELV'] },
  { id: 'RVSF-023', name: 'Gurgaon Scrap Hub',          aliases: ['RVSF-023', 'RVSF 023', 'Gurgaon Scrap'] },
  { id: 'RVSF-024', name: 'Faridabad Dismantling',      aliases: ['RVSF-024', 'RVSF 024', 'Faridabad Vehicle Dismantling'] },
  { id: 'RVSF-025', name: 'Surat ELV Processing',       aliases: ['RVSF-025', 'RVSF 025', 'Surat ELV Processing'] },
];

// ─── Extraction helpers ───────────────────────────────────────────────────────

// Pull best vehicle-count number from a text window
function findBestNumber(ctx) {
  // Try action-word pattern first: "collected: 920", "processed 1,234 vehicles"
  const actionRe = /(?:collected|scrapped|processed|dismantled|received|total)[^\d]{0,20}([\d,]+)/gi;
  let m = actionRe.exec(ctx);
  if (m) {
    const n = parseInt(m[1].replace(/,/g, ''), 10);
    if (n >= 10 && n <= 999_999) return n;
  }
  // Fall back: largest plausible number in range
  const numRe = /\b(\d{1,3}(?:,\d{3})*|\d{2,6})\b/g;
  const nums = [];
  while ((m = numRe.exec(ctx)) !== null) {
    const n = parseInt(m[1].replace(/,/g, ''), 10);
    if (n >= 50 && n <= 999_999) nums.push(n);
  }
  return nums.length ? Math.max(...nums) : null;
}

// Detect "Apr 2026" / "April 2026" in text
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const LONG_TO_SHORT = { january:'Jan',february:'Feb',march:'Mar',april:'Apr',may:'May',june:'Jun',july:'Jul',august:'Aug',september:'Sep',october:'Oct',november:'Nov',december:'Dec' };

function detectMonth(text) {
  // From filename hint passed in separately — done in caller
  const re = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)[\s\-./]*(20\d{2})\b/gi;
  const m = re.exec(text);
  if (!m) return null;
  const key = m[1].toLowerCase();
  const short = LONG_TO_SHORT[key] || (key.charAt(0).toUpperCase() + key.slice(1));
  return `${short} ${m[2]}`;
}

// Try to infer month from filename: "apr2026_report.pdf", "report_04_2026.pdf"
function monthFromFilename(filename) {
  // "Apr 2026" style
  let m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[_\-. ]?(20\d{2})\b/i.exec(filename);
  if (m) return `${m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()} ${m[2]}`;
  // "04_2026" or "04-2026"
  m = /\b(0[1-9]|1[0-2])[_\-](20\d{2})\b/.exec(filename);
  if (m) return `${SHORT_MONTHS[parseInt(m[1], 10) - 1]} ${m[2]}`;
  return null;
}

// Detect "2024-25" FY in text
function detectFY(text) {
  const m = /\b(20\d{2})[\s\-–](2\d|\d{2})\b/.exec(text);
  if (!m) return null;
  const y1 = m[1];
  const y2 = m[2].length === 2 ? m[2] : m[2].slice(-2);
  return `${y1}-${y2}`;
}

// Current month as fallback
function currentMonth() {
  const d = new Date();
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Match RVSF names against text, return [{id, name, count, context}]
function matchRVSFs(text, rvsfList) {
  const results = [];
  const seen = new Set();

  for (const rvsf of rvsfList) {
    if (seen.has(rvsf.id)) continue;
    for (const alias of rvsf.aliases) {
      const idx = text.toLowerCase().indexOf(alias.toLowerCase());
      if (idx === -1) continue;
      const start = Math.max(0, idx - 250);
      const end   = Math.min(text.length, idx + alias.length + 350);
      const ctx   = text.slice(start, end).replace(/\s+/g, ' ').trim();
      const count = findBestNumber(ctx);
      if (count !== null) {
        results.push({ id: rvsf.id, name: rvsf.name, count, ctx: ctx.slice(0, 120) });
        seen.add(rvsf.id);
        break;
      }
    }
  }
  return results;
}

// ─── Apply helpers ────────────────────────────────────────────────────────────

function applyOEM(liveData, month, id, count) {
  if (!liveData.oemCompetitor.monthlyOverrides[month])
    liveData.oemCompetitor.monthlyOverrides[month] = {};
  liveData.oemCompetitor.monthlyOverrides[month][id] = count;
}

function applyELV(liveData, fy, id, count) {
  if (!liveData.elvHotspot.collectionOverrides[fy])
    liveData.elvHotspot.collectionOverrides[fy] = {};
  liveData.elvHotspot.collectionOverrides[fy][id] = count;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  [INBOX, PROCESSED].forEach(d => existsSync(d) || mkdirSync(d, { recursive: true }));

  const pdfs = readdirSync(INBOX).filter(f => /\.pdf$/i.test(f));
  if (!pdfs.length) {
    console.log('\nNo PDFs in data/pdfs/inbox/  — drop files there and re-run.\n');
    rl.close(); return;
  }

  const liveData = JSON.parse(readFileSync(LIVE_DATA, 'utf-8'));
  let totalUpdates = 0;

  for (const filename of pdfs) {
    console.log(`\n${'═'.repeat(62)}`);
    console.log(`  PDF: ${filename}`);
    console.log('═'.repeat(62));

    let text;
    try {
      const buf = readFileSync(join(INBOX, filename));
      const parsed = await pdfParse(buf);
      text = parsed.text;
      console.log(`  Extracted ${text.length.toLocaleString()} chars  (${parsed.numpages} pages)`);
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
      continue;
    }

    // ── Detect tab type ──
    const looksOEM = /MSTI|Re\.Wi\.Re|ReWiRe|CERO\s+\w|Tata.*Re\.Wi/i.test(text);
    const looksELV = /RVSF-\d{3}|ELV\s+hotspot|vehicle\s+scrapping.*state/i.test(text);
    let tab; // 'oem' | 'elv' | 'both'

    if (looksOEM && !looksELV) { tab = 'oem'; console.log('  Auto-detected: OEM Competitor'); }
    else if (looksELV && !looksOEM) { tab = 'elv'; console.log('  Auto-detected: ELV Hotspot'); }
    else if (looksOEM && looksELV) { tab = 'both'; console.log('  Auto-detected: Both tabs'); }
    else {
      if (AUTO) { tab = 'both'; }
      else {
        console.log('  Could not auto-detect tab.');
        const c = (await ask('  1=OEM Competitor  2=ELV Hotspot  3=Both  s=Skip: ')).trim().toLowerCase();
        if (c === 's') continue;
        tab = c === '2' ? 'elv' : c === '3' ? 'both' : 'oem';
      }
    }

    // ── Detect period ──
    const month = monthFromFilename(filename) || detectMonth(text);
    const fy    = detectFY(text);
    console.log(`  Month: ${month || '—'}   FY: ${fy || '—'}`);

    let pdfUpdates = 0;

    // ── OEM Competitor ──
    if (tab === 'oem' || tab === 'both') {
      let useMonth = month;
      if (!useMonth) {
        if (AUTO) {
          useMonth = currentMonth();
          console.log(`  No month found — using current month: ${useMonth}`);
        } else {
          useMonth = (await ask(`  Enter month for OEM data (e.g. "Apr 2026") or s to skip OEM: `)).trim();
          if (useMonth.toLowerCase() === 's') useMonth = null;
        }
      }
      if (useMonth) {
        const matches = matchRVSFs(text, OEM_RVSFS);
        console.log(`\n  OEM Competitor — ${useMonth}  (${matches.length} RVSFs matched)`);
        for (const m of matches) {
          if (AUTO) {
            applyOEM(liveData, useMonth, m.id, m.count);
            console.log(`    ✓ ${m.name.padEnd(28)} → ${m.count}`);
            pdfUpdates++;
          } else {
            process.stdout.write(`    ${m.name.padEnd(28)} → ${String(m.count).padStart(7)}  [${m.ctx.slice(0,55)}...]\n`);
            const inp = (await ask('      Apply? Enter=yes  number=override  s=skip: ')).trim().toLowerCase();
            if (inp === 's') continue;
            const val = inp === '' ? m.count : parseInt(inp, 10);
            if (isNaN(val)) { console.log('      Skipped (invalid).'); continue; }
            applyOEM(liveData, useMonth, m.id, val);
            pdfUpdates++;
          }
        }
        if (!matches.length) console.log('  No OEM RVSF names matched in this PDF.');
      }
    }

    // ── ELV Hotspot ──
    if (tab === 'elv' || tab === 'both') {
      let useFY = fy;
      if (!useFY) {
        if (AUTO) {
          // Auto: skip ELV if no FY detectable
          console.log('  No FY found — skipping ELV data for this PDF.');
        } else {
          useFY = (await ask(`  Enter FY for ELV data (e.g. "2024-25") or s to skip ELV: `)).trim();
          if (useFY.toLowerCase() === 's') useFY = null;
        }
      }
      if (useFY) {
        const matches = matchRVSFs(text, ELV_RVSFS);
        console.log(`\n  ELV Hotspot — FY ${useFY}  (${matches.length} RVSFs matched)`);
        for (const m of matches) {
          if (AUTO) {
            applyELV(liveData, useFY, m.id, m.count);
            console.log(`    ✓ ${m.id}  ${m.name.padEnd(30)} → ${m.count}`);
            pdfUpdates++;
          } else {
            process.stdout.write(`    ${m.id}  ${m.name.padEnd(28)} → ${String(m.count).padStart(7)}  [${m.ctx.slice(0,50)}...]\n`);
            const inp = (await ask('      Apply? Enter=yes  number=override  s=skip: ')).trim().toLowerCase();
            if (inp === 's') continue;
            const val = inp === '' ? m.count : parseInt(inp, 10);
            if (isNaN(val)) { console.log('      Skipped (invalid).'); continue; }
            applyELV(liveData, useFY, m.id, val);
            pdfUpdates++;
          }
        }
        if (!matches.length) console.log('  No ELV RVSF IDs matched in this PDF.');
      }
    }

    // ── Move PDF ──
    if (pdfUpdates > 0) {
      renameSync(join(INBOX, filename), join(PROCESSED, filename));
      console.log(`\n  Moved to processed/  (${pdfUpdates} values applied)`);
    } else {
      console.log('\n  No values applied — file stays in inbox.');
    }
    totalUpdates += pdfUpdates;
  }

  // ── Save + push ──
  console.log(`\n${'═'.repeat(62)}`);

  if (totalUpdates > 0) {
    liveData.lastUpdated = new Date().toISOString();
    liveData.lastUpdatedTab = 'PDF Ingestion';
    writeFileSync(LIVE_DATA, JSON.stringify(liveData, null, 2) + '\n');
    console.log(`  Saved liveData.json — ${totalUpdates} values updated`);

    const doCommit = AUTO ? 'y' : (await ask('\n  Commit and push to trigger redeploy? [y/n]: ')).trim().toLowerCase();
    if (doCommit === 'y') {
      try {
        execSync('git add src/data/liveData.json', { stdio: 'inherit' });
        const date = new Date().toISOString().split('T')[0];
        execSync(`git commit -m "data: PDF ingestion [${date}]"`, { stdio: 'inherit' });
        execSync('git push', { stdio: 'inherit' });
        console.log('  Pushed — auto-deployment triggered.');
      } catch (e) {
        console.error('  git push failed:', e.message);
      }
    }
  } else {
    console.log('  No data updated.');
  }

  console.log();
  rl.close();
}

main().catch(e => { console.error(e); rl.close(); process.exit(1); });
