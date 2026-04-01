'use client'

import { FolderOpen, CheckCircle2, IndianRupee, Star } from 'lucide-react'
import type { VMCData, CBRTProject } from '@/app/types'
import KPICard from '@/app/components/KPICard'
import DownloadCSV from '@/app/components/DownloadCSV'
import BubbleChart from './charts/BubbleChart'

interface CBRTSectionProps {
  data: VMCData['cbrt']
}

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Flood Resilience': 'bg-blue-100 text-blue-700',
  'Heat Adaptation': 'bg-orange-100 text-orange-700',
  'Water Security': 'bg-cyan-100 text-cyan-700',
  'Clean Energy': 'bg-emerald-100 text-emerald-700',
  'Low-Carbon Transport': 'bg-purple-100 text-purple-700',
  'Green Infrastructure': 'bg-lime-100 text-lime-700',
  'Ecosystem Services': 'bg-teal-100 text-teal-700',
  'DRR & Preparedness': 'bg-red-100 text-red-700',
}

function RiskBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 max-w-[50px]">
        <div className="h-1.5 rounded-full" style={{ width: `${value * 10}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value.toFixed(1)}</span>
    </div>
  )
}

export default function CBRTSection({ data }: CBRTSectionProps) {
  const { kpis, projects } = data
  const eligibleProjects = projects.filter((p: CBRTProject) => p.eligible)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Climate Bond Readiness Toolkit (CBRT)</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Project prioritisation for Climate Bonds Initiative certification — Vadodara VMC
          </p>
        </div>
        <DownloadCSV data={projects} filename="vmc-cbrt-projects" label="Export Projects" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"
          value={kpis.totalProjects}
          subtitle="In capital programme"
          icon={FolderOpen}
          color="blue"
        />
        <KPICard
          title="CBRT Eligible"
          value={kpis.eligibleProjects}
          unit={`/ ${kpis.totalProjects}`}
          subtitle="Meet CBI criteria"
          icon={CheckCircle2}
          color="emerald"
          trend="up"
          trendValue={`${Math.round(kpis.eligibleProjects / kpis.totalProjects * 100)}% eligible`}
        />
        <KPICard
          title="Eligible Budget"
          value={`₹${kpis.eligibleBudget}`}
          unit="Cr"
          subtitle="Bondable expenditure"
          icon={IndianRupee}
          color="emerald"
        />
        <KPICard
          title="High Priority"
          value={projects.filter((p: CBRTProject) => p.priority === 'High').length}
          subtitle="High risk + high impact"
          icon={Star}
          color="amber"
        />
      </div>

      {/* Bubble chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-slate-700 mb-1">Project Prioritisation Matrix</h4>
        <p className="text-xs text-slate-400 mb-1">
          X = Climate Risk Score · Y = Climate Impact Score · Bubble size = Budget (₹Cr)
        </p>
        <p className="text-xs text-slate-300 mb-3">
          Top-right quadrant = High risk + High impact = Priority for climate bond issuance
        </p>
        <BubbleChart projects={projects} />
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Quadrants:</span>
          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded">↗ High Risk + High Impact → Priority Bond Projects</span>
          <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded">↗ Low Risk + High Impact → Co-benefit Projects</span>
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-700">CBRT-Eligible Project List</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {eligibleProjects.length} eligible · ₹{kpis.eligibleBudget} Cr bondable
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-500">Project</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500">Category</th>
                <th className="px-4 py-3 font-semibold text-slate-500 min-w-[100px]">Risk Score</th>
                <th className="px-4 py-3 font-semibold text-slate-500 min-w-[100px]">Impact Score</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500">Budget (₹Cr)</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-500">Priority</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-500">Eligible</th>
              </tr>
            </thead>
            <tbody>
              {[...projects]
                .sort((a, b) => (b.risk + b.impact) - (a.risk + a.impact))
                .map((p: CBRTProject, i: number) => (
                  <tr key={i} className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${!p.eligible ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate" title={p.name}>
                      {p.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[p.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBar value={p.risk} color="#f97316" />
                    </td>
                    <td className="px-4 py-3">
                      <RiskBar value={p.impact} color="#10b981" />
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700 tabular-nums">{p.budget}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[p.priority]}`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.eligible
                        ? <span className="text-emerald-600 font-bold text-xs">✓ Yes</span>
                        : <span className="text-slate-400 text-xs">No</span>
                      }
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
