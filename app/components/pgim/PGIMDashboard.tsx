'use client'

import { useState, useEffect } from 'react'
import { DollarSign, CheckCircle, Leaf, Zap } from 'lucide-react'
import type { PGIMData } from '@/app/types'

import KPICard from '@/app/components/KPICard'
import LoadingSpinner, { ChartSkeleton } from '@/app/components/LoadingSpinner'
import DownloadCSV from '@/app/components/DownloadCSV'
import DataSourceBadge from '@/app/components/DataSourceBadge'
import SectorFilter from './SectorFilter'
import PortfolioTable from './PortfolioTable'
import AlignmentPieChart from './charts/AlignmentPieChart'
import SectorBarChart from './charts/SectorBarChart'
import EmissionsLineChart from './charts/EmissionsLineChart'

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function PGIMDashboard() {
  const [data, setData] = useState<PGIMData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSector, setSelectedSector] = useState('All')
  const [alignmentThreshold, setAlignmentThreshold] = useState(0)

  useEffect(() => {
    fetch('/api/pgim')
      .then(r => r.json())
      .then((d: PGIMData) => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load PGIM data'); setLoading(false) })
  }, [])

  if (loading) return <LoadingSpinner message="Loading PGIM Transition Finance data…" />
  if (error || !data) return (
    <div className="text-center py-20 text-red-500">{error ?? 'Unknown error'}</div>
  )

  const sectors = [...new Set(data.portfolio.map(c => c.sector))].sort()
  const filtered = data.portfolio.filter(c =>
    (selectedSector === 'All' || c.sector === selectedSector) &&
    c.alignmentPct >= alignmentThreshold
  )

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">PGIM Transition Finance Portfolio</h2>
          <p className="text-sm text-slate-500 mt-0.5">EU Taxonomy alignment · Sector decarbonisation · Transition pathway analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceBadge source={data.dataSource} />
          <DownloadCSV data={data.portfolio} filename="pgim-portfolio" label="Export Portfolio" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Portfolio Value"
          value={`€${(data.kpis.totalPortfolioValue / 1000).toFixed(1)}B`}
          subtitle="Assets under analysis"
          icon={DollarSign}
          color="blue"
          trend="up"
          trendValue="+8.3% YoY"
        />
        <KPICard
          title="EU Taxonomy Aligned"
          value={data.kpis.taxonomyAligned}
          unit="%"
          subtitle="Revenue-weighted"
          icon={CheckCircle}
          color="emerald"
          trend="up"
          trendValue="+4.2pp"
        />
        <KPICard
          title="Green Revenue"
          value={data.kpis.greenRevenue}
          unit="%"
          subtitle="≥67% aligned companies"
          icon={Leaf}
          color="emerald"
          trend="up"
          trendValue="+6.1pp"
        />
        <KPICard
          title="Transition Assets"
          value={data.kpis.transitionAssets}
          unit="%"
          subtitle="Score ≥ 3.0/5.0"
          icon={Zap}
          color="amber"
          trend="neutral"
          trendValue="Stable"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Taxonomy Alignment" subtitle="Aligned vs non-aligned (revenue-weighted %)">
          <AlignmentPieChart
            aligned={data.kpis.taxonomyAligned}
            notAligned={100 - data.kpis.taxonomyAligned}
          />
        </ChartCard>

        <ChartCard title="Sector-wise Alignment %" subtitle="Average alignment by sector">
          <SectorBarChart data={data.sectorData} />
        </ChartCard>

        <ChartCard title="Emissions Trajectory" subtitle="ktCO₂e — Actual vs SBT vs BAU (2019–2030)">
          <EmissionsLineChart data={data.emissionsTrajectory} />
        </ChartCard>
      </div>

      {/* Sector filter skeleton while loading */}
      {data.portfolio.length === 0 ? (
        <ChartSkeleton height={60} />
      ) : (
        <SectorFilter
          sectors={sectors}
          selectedSector={selectedSector}
          alignmentThreshold={alignmentThreshold}
          onSectorChange={setSelectedSector}
          onThresholdChange={setAlignmentThreshold}
          resultCount={filtered.length}
        />
      )}

      {/* Portfolio table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Portfolio Companies</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click column headers to sort</p>
          </div>
          <DownloadCSV data={filtered} filename="pgim-filtered-portfolio" label="Export Filtered" />
        </div>
        <PortfolioTable companies={filtered} />
      </div>
    </div>
  )
}
