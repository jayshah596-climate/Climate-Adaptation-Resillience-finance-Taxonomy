import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import type { VMCData, BudgetSector, RiskZone, CBRTProject } from '@/app/types'

export const dynamic = 'force-dynamic'

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_SECTORS: BudgetSector[] = [
  { sector: 'Water & Sanitation',       budget: 580, alignedBudget: 435, alignmentPct: 75 },
  { sector: 'Solid Waste Management',   budget: 210, alignedBudget: 136, alignmentPct: 65 },
  { sector: 'Urban Transport',          budget: 390, alignedBudget: 273, alignmentPct: 70 },
  { sector: 'Green Infrastructure',     budget: 160, alignedBudget: 144, alignmentPct: 90 },
  { sector: 'Energy Efficiency',        budget: 145, alignedBudget: 130, alignmentPct: 90 },
  { sector: 'Flood Risk Management',    budget: 320, alignedBudget: 224, alignmentPct: 70 },
  { sector: 'Housing & Buildings',      budget: 485, alignedBudget: 194, alignmentPct: 40 },
  { sector: 'Healthcare Infrastructure',budget: 557, alignedBudget: 144, alignmentPct: 26 },
]

const MOCK_ZONES: RiskZone[] = [
  { zone: 'Old City (Walled)',  floodRisk: 8.9, heatRisk: 8.2, waterRisk: 7.5, stormRisk: 6.1, droughtRisk: 5.8 },
  { zone: 'Fatehgunj',          floodRisk: 7.2, heatRisk: 7.8, waterRisk: 6.9, stormRisk: 5.4, droughtRisk: 6.2 },
  { zone: 'Karelibaug',         floodRisk: 6.1, heatRisk: 7.1, waterRisk: 5.8, stormRisk: 4.9, droughtRisk: 6.5 },
  { zone: 'Alkapuri (CBD)',     floodRisk: 4.8, heatRisk: 8.5, waterRisk: 5.2, stormRisk: 4.2, droughtRisk: 5.1 },
  { zone: 'Manjalpur',          floodRisk: 5.6, heatRisk: 7.4, waterRisk: 6.1, stormRisk: 5.0, droughtRisk: 7.2 },
  { zone: 'Gorwa Industrial',   floodRisk: 6.8, heatRisk: 7.9, waterRisk: 7.2, stormRisk: 5.8, droughtRisk: 4.6 },
  { zone: 'Waghodia Road',      floodRisk: 5.9, heatRisk: 6.8, waterRisk: 6.4, stormRisk: 4.5, droughtRisk: 7.8 },
  { zone: 'Padra Fringe',       floodRisk: 7.4, heatRisk: 6.2, waterRisk: 7.8, stormRisk: 5.3, droughtRisk: 8.1 },
]

const MOCK_PROJECTS: CBRTProject[] = [
  { name: 'Vishwamitri River Flood Barrier',       category: 'Flood Resilience',    risk: 9.1, impact: 9.5, budget: 185, eligible: true,  priority: 'High' },
  { name: 'Urban Heat Island Mitigation – Zone A', category: 'Heat Adaptation',     risk: 8.5, impact: 8.8, budget: 124, eligible: true,  priority: 'High' },
  { name: '24×7 Water Supply Upgradation',         category: 'Water Security',      risk: 7.8, impact: 9.2, budget: 210, eligible: true,  priority: 'High' },
  { name: 'Solar Rooftop – Municipal Buildings',   category: 'Clean Energy',        risk: 4.2, impact: 7.6, budget: 65,  eligible: true,  priority: 'Medium' },
  { name: 'Electric Bus Fleet (Phase I)',           category: 'Low-Carbon Transport',risk: 3.8, impact: 8.1, budget: 142, eligible: true,  priority: 'High' },
  { name: 'Green Corridor – Ring Road',            category: 'Green Infrastructure',risk: 3.1, impact: 7.2, budget: 48,  eligible: true,  priority: 'Medium' },
  { name: 'Stormwater Drainage Upgrade',           category: 'Flood Resilience',    risk: 7.2, impact: 8.4, budget: 98,  eligible: true,  priority: 'High' },
  { name: 'Solid Waste Biogas Plant',              category: 'Circular Economy',    risk: 3.5, impact: 6.9, budget: 72,  eligible: true,  priority: 'Medium' },
  { name: 'Wetland Restoration – Harni Lake',      category: 'Ecosystem Services',  risk: 6.8, impact: 8.9, budget: 56,  eligible: true,  priority: 'High' },
  { name: 'Low-Income Housing Retrofit',           category: 'Social Resilience',   risk: 8.1, impact: 7.8, budget: 165, eligible: false, priority: 'High' },
  { name: 'Smart Water Metering Network',          category: 'Water Security',      risk: 5.2, impact: 7.4, budget: 38,  eligible: true,  priority: 'Medium' },
  { name: 'Climate-Resilient Road Resurfacing',    category: 'Infrastructure',      risk: 4.9, impact: 6.1, budget: 82,  eligible: false, priority: 'Low' },
  { name: 'Urban Agriculture & Food Security',     category: 'Food Resilience',     risk: 6.4, impact: 7.0, budget: 29,  eligible: true,  priority: 'Medium' },
  { name: 'Community Early Warning System',        category: 'DRR & Preparedness',  risk: 8.7, impact: 9.1, budget: 22,  eligible: true,  priority: 'High' },
  { name: 'Mangrove Belt Expansion',               category: 'Ecosystem Services',  risk: 7.3, impact: 8.5, budget: 41,  eligible: true,  priority: 'High' },
]

function buildMockData(): VMCData {
  const sectors = MOCK_SECTORS
  const totalBudget = sectors.reduce((s, c) => s + c.budget, 0)
  const alignedBudget = sectors.reduce((s, c) => s + c.alignedBudget, 0)

  const eligibleProjects = MOCK_PROJECTS.filter(p => p.eligible)
  const totalCBRTBudget = MOCK_PROJECTS.reduce((s, p) => s + p.budget, 0)
  const eligibleBudget = eligibleProjects.reduce((s, p) => s + p.budget, 0)

  return {
    euTaxonomy: {
      kpis: {
        totalBudget,
        alignedBudget,
        alignmentPct: Math.round((alignedBudget / totalBudget) * 100),
      },
      sectors,
    },
    resilience: { zones: MOCK_ZONES },
    cbrt: {
      kpis: {
        totalProjects: MOCK_PROJECTS.length,
        eligibleProjects: eligibleProjects.length,
        totalBudget: totalCBRTBudget,
        eligibleBudget,
      },
      projects: MOCK_PROJECTS,
    },
    dataSource: 'mock',
  }
}

// ── Excel Parser Helpers ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSheetJSON(XLSX: any, filePath: string): any[][] {
  if (!fs.existsSync(filePath)) return []
  const buffer = fs.readFileSync(filePath)
  const wb = XLSX.read(buffer, { type: 'buffer' })
  return wb.SheetNames.map((name: string) =>
    XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: null })
  )
}

function parseVMCData(): VMCData {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require('xlsx')

    const euFile = path.join(process.cwd(), 'VMC', 'EU_Taxonomy_VMC_Budget_Mapping.xlsx')
    const resFile = path.join(process.cwd(), 'VMC', 'VMC_Climate_Resilience_Finance_Framework.xlsx')
    const cbrtFile = path.join(process.cwd(), 'VMC', 'VMC_CBRT_Budget_Mapping.xlsx')

    // ── EU Taxonomy ───────────────────────────────────────────────────────────
    let sectors: BudgetSector[] = []
    const euSheets = parseSheetJSON(XLSX, euFile)
    for (const rows of euSheets) {
      if (!rows || rows.length < 2) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getVal = (row: any, terms: string[]) => {
        const k = Object.keys(row).find(k2 => terms.some(t => k2.toLowerCase().includes(t)))
        return k ? row[k] : null
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: BudgetSector[] = rows.map((r: any) => ({
        sector: String(getVal(r, ['sector', 'department', 'category', 'head']) ?? ''),
        budget: Number(getVal(r, ['total', 'budget', 'allocation', 'expenditure']) ?? 0) || 0,
        alignedBudget: Number(getVal(r, ['aligned', 'green', 'eligible']) ?? 0) || 0,
        alignmentPct: Number(getVal(r, ['percent', 'pct', '%', 'ratio']) ?? 0) || 0,
      })).filter((s: BudgetSector) => s.sector && s.budget > 0)

      if (parsed.length > 0) { sectors = parsed; break }
    }

    // ── Resilience ────────────────────────────────────────────────────────────
    let zones: RiskZone[] = []
    const resSheets = parseSheetJSON(XLSX, resFile)
    for (const rows of resSheets) {
      if (!rows || rows.length < 2) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getVal = (row: any, terms: string[]) => {
        const k = Object.keys(row).find(k2 => terms.some(t => k2.toLowerCase().includes(t)))
        return k ? row[k] : null
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: RiskZone[] = rows.map((r: any) => ({
        zone: String(getVal(r, ['zone', 'area', 'ward', 'location', 'region']) ?? ''),
        floodRisk: Number(getVal(r, ['flood']) ?? 0) || 0,
        heatRisk: Number(getVal(r, ['heat', 'temperature', 'thermal']) ?? 0) || 0,
        waterRisk: Number(getVal(r, ['water', 'drought', 'stress']) ?? 0) || 0,
        stormRisk: Number(getVal(r, ['storm', 'cyclone', 'wind']) ?? 0) || 0,
        droughtRisk: Number(getVal(r, ['drought', 'dry']) ?? 0) || 0,
      })).filter((z: RiskZone) => z.zone)

      if (parsed.length > 0) { zones = parsed; break }
    }

    // ── CBRT ──────────────────────────────────────────────────────────────────
    let projects: CBRTProject[] = []
    const cbrtSheets = parseSheetJSON(XLSX, cbrtFile)
    for (const rows of cbrtSheets) {
      if (!rows || rows.length < 2) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getVal = (row: any, terms: string[]) => {
        const k = Object.keys(row).find(k2 => terms.some(t => k2.toLowerCase().includes(t)))
        return k ? row[k] : null
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: CBRTProject[] = rows.map((r: any) => {
        const eligible = getVal(r, ['eligible', 'cbrt', 'qualifying'])
        const risk = Number(getVal(r, ['risk']) ?? 0) || 0
        const impact = Number(getVal(r, ['impact', 'benefit', 'score']) ?? 0) || 0
        return {
          name: String(getVal(r, ['project', 'name', 'scheme', 'activity']) ?? ''),
          category: String(getVal(r, ['category', 'type', 'sector', 'theme']) ?? 'Other'),
          risk,
          impact,
          budget: Number(getVal(r, ['budget', 'cost', 'amount', 'crore']) ?? 0) || 0,
          eligible: eligible === true || String(eligible).toLowerCase() === 'yes' || Number(eligible) === 1,
          priority: risk >= 7 || impact >= 8 ? 'High' : risk >= 4 ? 'Medium' : 'Low' as CBRTProject['priority'],
        }
      }).filter((p: CBRTProject) => p.name)

      if (parsed.length > 0) { projects = parsed; break }
    }

    // Fall back to mock for any missing dataset
    const mock = buildMockData()
    if (sectors.length === 0) sectors = mock.euTaxonomy.sectors
    if (zones.length === 0) zones = mock.resilience.zones
    if (projects.length === 0) projects = mock.cbrt.projects

    const totalBudget = sectors.reduce((s, c) => s + c.budget, 0)
    const alignedBudget = sectors.reduce((s, c) => s + c.alignedBudget, 0)
    const eligibleProjects = projects.filter(p => p.eligible)

    return {
      euTaxonomy: {
        kpis: {
          totalBudget,
          alignedBudget,
          alignmentPct: totalBudget > 0 ? Math.round((alignedBudget / totalBudget) * 100) : 0,
        },
        sectors,
      },
      resilience: { zones },
      cbrt: {
        kpis: {
          totalProjects: projects.length,
          eligibleProjects: eligibleProjects.length,
          totalBudget: projects.reduce((s, p) => s + p.budget, 0),
          eligibleBudget: eligibleProjects.reduce((s, p) => s + p.budget, 0),
        },
        projects,
      },
      dataSource: sectors === mock.euTaxonomy.sectors ? 'mock' : 'excel',
    }
  } catch {
    return buildMockData()
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const data = parseVMCData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(buildMockData())
  }
}
