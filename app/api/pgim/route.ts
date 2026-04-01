import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import type { PGIMData, PortfolioCompany, SectorData } from '@/app/types'

export const dynamic = 'force-dynamic'

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_PORTFOLIO: PortfolioCompany[] = [
  { name: 'Ørsted A/S', sector: 'Energy', revenue: 8200, emissions: 142, alignmentPct: 94, transitionScore: 4.8 },
  { name: 'Siemens Energy AG', sector: 'Energy', revenue: 6800, emissions: 890, alignmentPct: 71, transitionScore: 3.9 },
  { name: 'Vestas Wind Systems', sector: 'Energy', revenue: 4100, emissions: 78, alignmentPct: 98, transitionScore: 4.9 },
  { name: 'Tata Steel Europe', sector: 'Industry', revenue: 5600, emissions: 3420, alignmentPct: 22, transitionScore: 2.1 },
  { name: 'ArcelorMittal S.A.', sector: 'Industry', revenue: 7900, emissions: 5100, alignmentPct: 18, transitionScore: 1.9 },
  { name: 'Schneider Electric', sector: 'Buildings', revenue: 3400, emissions: 210, alignmentPct: 87, transitionScore: 4.4 },
  { name: 'Alstom S.A.', sector: 'Transport', revenue: 2900, emissions: 145, alignmentPct: 82, transitionScore: 4.2 },
  { name: 'Iberdrola S.A.', sector: 'Utilities', revenue: 9100, emissions: 420, alignmentPct: 76, transitionScore: 4.1 },
  { name: 'Yara International', sector: 'Agriculture', revenue: 1800, emissions: 680, alignmentPct: 31, transitionScore: 2.4 },
  { name: 'Deutsche Telekom', sector: 'ICT', revenue: 4200, emissions: 156, alignmentPct: 65, transitionScore: 3.5 },
  { name: 'Holcim Group', sector: 'Industry', revenue: 3100, emissions: 2890, alignmentPct: 15, transitionScore: 1.7 },
  { name: 'Enel S.p.A.', sector: 'Utilities', revenue: 6300, emissions: 380, alignmentPct: 79, transitionScore: 4.0 },
]

const MOCK_EMISSIONS = [
  { year: 2019, actual: 1250, target: 1250, bau: 1250 },
  { year: 2020, actual: 1180, target: 1188, bau: 1262 },
  { year: 2021, actual: 1120, target: 1128, bau: 1275 },
  { year: 2022, actual: 1060, target: 1069, bau: 1288 },
  { year: 2023, actual: 990,  target: 1012, bau: 1301 },
  { year: 2024, actual: null, target: 957,  bau: 1315 },
  { year: 2025, actual: null, target: 904,  bau: 1329 },
  { year: 2026, actual: null, target: 854,  bau: 1343 },
  { year: 2027, actual: null, target: 805,  bau: 1357 },
  { year: 2028, actual: null, target: 759,  bau: 1372 },
  { year: 2029, actual: null, target: 714,  bau: 1387 },
  { year: 2030, actual: null, target: 625,  bau: 1402 },
]

function buildMockData(): PGIMData {
  const portfolio = MOCK_PORTFOLIO

  const totalRevenue = portfolio.reduce((s, c) => s + c.revenue, 0)
  const weightedAlignment = portfolio.reduce((s, c) => s + (c.alignmentPct * c.revenue), 0) / totalRevenue
  const greenRevenue = portfolio.filter(c => c.alignmentPct >= 67).reduce((s, c) => s + c.revenue, 0) / totalRevenue * 100
  const transitionAssets = portfolio.filter(c => c.transitionScore >= 3).length / portfolio.length * 100

  // Sector aggregation
  const sectorMap = new Map<string, { revenues: number[]; alignments: number[]; count: number }>()
  for (const c of portfolio) {
    if (!sectorMap.has(c.sector)) sectorMap.set(c.sector, { revenues: [], alignments: [], count: 0 })
    const s = sectorMap.get(c.sector)!
    s.revenues.push(c.revenue)
    s.alignments.push(c.alignmentPct)
    s.count++
  }

  const sectorData: SectorData[] = Array.from(sectorMap.entries()).map(([sector, data]) => {
    const avgAlignment = data.alignments.reduce((a, b) => a + b, 0) / data.alignments.length
    return {
      sector,
      aligned: Math.round(avgAlignment),
      notAligned: Math.round(100 - avgAlignment),
      count: data.count,
      totalRevenue: data.revenues.reduce((a, b) => a + b, 0),
    }
  })

  return {
    kpis: {
      totalPortfolioValue: Math.round(totalRevenue),
      taxonomyAligned: Math.round(weightedAlignment),
      greenRevenue: Math.round(greenRevenue),
      transitionAssets: Math.round(transitionAssets),
    },
    portfolio,
    sectorData,
    emissionsTrajectory: MOCK_EMISSIONS,
    dataSource: 'mock',
  }
}

// ── Excel Parser ──────────────────────────────────────────────────────────────

function parseExcelData(): PGIMData {
  const filePath = path.join(process.cwd(), 'PGIM', 'PGIM_Transition_Finance_Toolkit.xlsx')
  if (!fs.existsSync(filePath)) return buildMockData()

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require('xlsx')
    const buffer = fs.readFileSync(filePath)
    const workbook = XLSX.read(buffer, { type: 'buffer' })

    let portfolio: PortfolioCompany[] = []

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null })

      if (rows.length < 2) continue

      // Normalise column keys to lowercase for fuzzy matching
      const keys = Object.keys(rows[0] || {}).map(k => k.toString().toLowerCase().trim())

      const hasCompany = keys.some(k => k.includes('company') || k.includes('entity') || k.includes('name') || k.includes('issuer'))
      const hasSector = keys.some(k => k.includes('sector') || k.includes('industry'))
      const hasRevenue = keys.some(k => k.includes('revenue') || k.includes('turnover') || k.includes('sales'))

      if (!hasCompany || !hasSector || !hasRevenue) continue

      const findKey = (keys: string[], terms: string[]) =>
        keys.find(k => terms.some(t => k.includes(t))) ?? null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      portfolio = rows.filter(r => r).map((r: any): PortfolioCompany => {
        const rawKeys = Object.keys(r)
        const getVal = (terms: string[]) => {
          const k = rawKeys.find(k2 => terms.some(t => k2.toLowerCase().includes(t)))
          return k ? r[k] : null
        }

        const name = String(getVal(['company', 'entity', 'name', 'issuer']) ?? 'Unknown')
        const sector = String(getVal(['sector', 'industry']) ?? 'Other')
        const revenue = Number(getVal(['revenue', 'turnover', 'sales']) ?? 0) || 0
        const emissions = Number(getVal(['emission', 'ghg', 'co2', 'carbon']) ?? 0) || 0
        const alignmentPct = Number(getVal(['alignment', 'aligned', 'taxonomy']) ?? 0) || 0
        const transitionScore = Number(getVal(['transition', 'score', 'rating', 'grade']) ?? 0) || 0

        return { name, sector, revenue, emissions, alignmentPct: Math.min(100, alignmentPct), transitionScore: Math.min(5, transitionScore) }
      }).filter(c => c.name !== 'Unknown')

      if (portfolio.length > 0) break
    }

    if (portfolio.length === 0) return buildMockData()

    const totalRevenue = portfolio.reduce((s, c) => s + c.revenue, 0) || 1
    const weightedAlignment = portfolio.reduce((s, c) => s + (c.alignmentPct * c.revenue), 0) / totalRevenue
    const greenRevenue = portfolio.filter(c => c.alignmentPct >= 67).reduce((s, c) => s + c.revenue, 0) / totalRevenue * 100
    const transitionAssets = portfolio.filter(c => c.transitionScore >= 3).length / portfolio.length * 100

    const sectorMap = new Map<string, { revenues: number[]; alignments: number[] }>()
    for (const c of portfolio) {
      if (!sectorMap.has(c.sector)) sectorMap.set(c.sector, { revenues: [], alignments: [] })
      sectorMap.get(c.sector)!.revenues.push(c.revenue)
      sectorMap.get(c.sector)!.alignments.push(c.alignmentPct)
    }

    const sectorData: SectorData[] = Array.from(sectorMap.entries()).map(([sector, data]) => {
      const avg = data.alignments.reduce((a, b) => a + b, 0) / data.alignments.length
      return {
        sector,
        aligned: Math.round(avg),
        notAligned: Math.round(100 - avg),
        count: data.alignments.length,
        totalRevenue: data.revenues.reduce((a, b) => a + b, 0),
      }
    })

    return {
      kpis: {
        totalPortfolioValue: Math.round(totalRevenue),
        taxonomyAligned: Math.round(weightedAlignment),
        greenRevenue: Math.round(greenRevenue),
        transitionAssets: Math.round(transitionAssets),
      },
      portfolio,
      sectorData,
      emissionsTrajectory: MOCK_EMISSIONS,
      dataSource: 'excel',
    }
  } catch {
    return buildMockData()
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const data = parseExcelData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(buildMockData())
  }
}
