// ── PGIM Types ────────────────────────────────────────────────────────────────

export interface PortfolioCompany {
  name: string
  sector: string
  revenue: number        // €M
  emissions: number      // ktCO2e
  alignmentPct: number   // 0–100
  transitionScore: number // 0–5
}

export interface PGIMKPIs {
  totalPortfolioValue: number  // €M
  taxonomyAligned: number      // %
  greenRevenue: number         // %
  transitionAssets: number     // %
}

export interface SectorData {
  sector: string
  aligned: number      // % aligned
  notAligned: number   // % not aligned
  count: number        // company count
  totalRevenue: number // €M
}

export interface EmissionsDataPoint {
  year: number
  actual: number | null
  target: number
  bau: number
}

export interface PGIMData {
  kpis: PGIMKPIs
  portfolio: PortfolioCompany[]
  sectorData: SectorData[]
  emissionsTrajectory: EmissionsDataPoint[]
  dataSource: 'excel' | 'mock'
}

// ── VMC Types ─────────────────────────────────────────────────────────────────

export interface BudgetSector {
  sector: string
  budget: number        // ₹Cr
  alignedBudget: number // ₹Cr
  alignmentPct: number  // 0–100
}

export interface EUTaxonomyKPIs {
  totalBudget: number    // ₹Cr
  alignedBudget: number  // ₹Cr
  alignmentPct: number   // %
}

export interface RiskZone {
  zone: string
  floodRisk: number    // 0–10
  heatRisk: number     // 0–10
  waterRisk: number    // 0–10
  stormRisk: number    // 0–10
  droughtRisk: number  // 0–10
}

export interface CBRTProject {
  name: string
  category: string
  risk: number     // 0–10
  impact: number   // 0–10
  budget: number   // ₹Cr
  eligible: boolean
  priority: 'High' | 'Medium' | 'Low'
}

export interface CBRTKPIs {
  totalProjects: number
  eligibleProjects: number
  totalBudget: number // ₹Cr
  eligibleBudget: number // ₹Cr
}

export interface VMCData {
  euTaxonomy: {
    kpis: EUTaxonomyKPIs
    sectors: BudgetSector[]
  }
  resilience: {
    zones: RiskZone[]
  }
  cbrt: {
    kpis: CBRTKPIs
    projects: CBRTProject[]
  }
  dataSource: 'excel' | 'mock'
}
