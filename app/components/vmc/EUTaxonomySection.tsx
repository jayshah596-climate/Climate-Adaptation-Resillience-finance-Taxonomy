'use client'

import { Banknote, CheckSquare, Target } from 'lucide-react'
import type { VMCData } from '@/app/types'
import KPICard from '@/app/components/KPICard'
import DownloadCSV from '@/app/components/DownloadCSV'
import BudgetBarChart from './charts/BudgetBarChart'
import VMCAlignmentPieChart from './charts/AlignmentPieChart'

interface EUTaxonomySectionProps {
  data: VMCData['euTaxonomy']
}

function AlignmentBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'
  const textColor = pct >= 70 ? 'text-emerald-700' : pct >= 40 ? 'text-amber-700' : 'text-red-700'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right tabular-nums ${textColor}`}>{pct}%</span>
    </div>
  )
}

export default function EUTaxonomySection({ data }: EUTaxonomySectionProps) {
  const { kpis, sectors } = data

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800">EU Taxonomy Budget Mapping</h3>
          <p className="text-sm text-slate-500 mt-0.5">Vadodara Municipal Corporation — FY 2024–25 Budget Alignment</p>
        </div>
        <DownloadCSV data={sectors} filename="vmc-eu-taxonomy-budget" label="Export Budget Data" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Municipal Budget"
          value={`₹${kpis.totalBudget.toLocaleString()}`}
          unit="Cr"
          subtitle="FY 2024–25 Capital Budget"
          icon={Banknote}
          color="blue"
        />
        <KPICard
          title="EU Taxonomy Aligned"
          value={`₹${kpis.alignedBudget.toLocaleString()}`}
          unit="Cr"
          subtitle="Eligible green expenditure"
          icon={CheckSquare}
          color="emerald"
          trend="up"
          trendValue="+12% YoY"
        />
        <KPICard
          title="Alignment Rate"
          value={kpis.alignmentPct}
          unit="%"
          subtitle="Target: ≥ 70% by 2026"
          icon={Target}
          color="emerald"
          trend="up"
          trendValue="+5pp"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-1">Budget by Sector</h4>
          <p className="text-xs text-slate-400 mb-4">Aligned vs non-aligned spend (₹ Crore)</p>
          <BudgetBarChart data={sectors} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-1">Overall Taxonomy Alignment</h4>
          <p className="text-xs text-slate-400 mb-4">Share of budget eligible under EU Taxonomy</p>
          <VMCAlignmentPieChart
            alignedBudget={kpis.alignedBudget}
            totalBudget={kpis.totalBudget}
          />
        </div>
      </div>

      {/* Sector table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-700">Sector-level Budget Breakdown</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left font-semibold text-slate-500">Sector</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-500">Total (₹Cr)</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-500">Aligned (₹Cr)</th>
                <th className="px-5 py-3 font-semibold text-slate-500 min-w-[160px]">Alignment %</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...sectors].sort((a, b) => b.alignmentPct - a.alignmentPct).map((s, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{s.sector}</td>
                  <td className="px-5 py-3 text-right text-slate-700 tabular-nums font-medium">{s.budget.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-emerald-700 tabular-nums font-semibold">{s.alignedBudget.toLocaleString()}</td>
                  <td className="px-5 py-3 min-w-[160px]"><AlignmentBar pct={s.alignmentPct} /></td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      s.alignmentPct >= 70
                        ? 'bg-emerald-100 text-emerald-700'
                        : s.alignmentPct >= 40
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {s.alignmentPct >= 70 ? 'On Track' : s.alignmentPct >= 40 ? 'In Progress' : 'Needs Action'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
