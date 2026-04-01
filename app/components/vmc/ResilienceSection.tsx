'use client'

import { useState } from 'react'
import { AlertTriangle, Waves, Thermometer, Droplets } from 'lucide-react'
import type { VMCData, RiskZone } from '@/app/types'
import KPICard from '@/app/components/KPICard'
import DownloadCSV from '@/app/components/DownloadCSV'
import RiskRadarChart from './charts/RiskRadarChart'

interface ResilienceSectionProps {
  data: VMCData['resilience']
}

function RiskCell({ value }: { value: number }) {
  const bg = value >= 8 ? 'bg-red-500 text-white'
    : value >= 6 ? 'bg-orange-400 text-white'
    : value >= 4 ? 'bg-amber-300 text-amber-900'
    : 'bg-emerald-100 text-emerald-800'
  return (
    <td className={`px-3 py-2.5 text-center text-xs font-bold tabular-nums ${bg}`}>
      {value.toFixed(1)}
    </td>
  )
}

function avgRisk(zones: RiskZone[], key: keyof RiskZone): number {
  const vals = zones.map(z => z[key] as number)
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

export default function ResilienceSection({ data }: ResilienceSectionProps) {
  const { zones } = data
  const [selectedZones, setSelectedZones] = useState<string[]>(zones.slice(0, 4).map(z => z.zone))

  const highRiskZones = zones.filter(z => {
    const max = Math.max(z.floodRisk, z.heatRisk, z.waterRisk, z.stormRisk, z.droughtRisk)
    return max >= 8
  })

  const toggleZone = (zone: string) => {
    setSelectedZones(prev =>
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Climate Resilience Framework</h3>
          <p className="text-sm text-slate-500 mt-0.5">Multi-hazard risk assessment by urban zone — Vadodara, Gujarat</p>
        </div>
        <DownloadCSV data={zones} filename="vmc-resilience-risk-zones" label="Export Risk Data" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="High-Risk Zones"
          value={highRiskZones.length}
          unit={`/ ${zones.length}`}
          subtitle="Any hazard ≥ 8.0 score"
          icon={AlertTriangle}
          color="amber"
          trend="down"
          trendValue="Action needed"
        />
        <KPICard
          title="Avg. Flood Risk"
          value={avgRisk(zones, 'floodRisk')}
          unit="/ 10"
          subtitle="Vishwamitri catchment risk"
          icon={Waves}
          color="blue"
        />
        <KPICard
          title="Avg. Heat Risk"
          value={avgRisk(zones, 'heatRisk')}
          unit="/ 10"
          subtitle="Urban Heat Island index"
          icon={Thermometer}
          color="amber"
        />
      </div>

      {/* Zone selector + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Select Zones to Compare</h4>
          <div className="space-y-2">
            {zones.map(z => {
              const maxRisk = Math.max(z.floodRisk, z.heatRisk, z.waterRisk, z.stormRisk, z.droughtRisk)
              const riskLevel = maxRisk >= 8 ? 'text-red-500' : maxRisk >= 6 ? 'text-amber-500' : 'text-emerald-600'
              const selected = selectedZones.includes(z.zone)
              return (
                <button
                  key={z.zone}
                  onClick={() => toggleZone(z.zone)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
                    border transition-all duration-150 text-left
                    ${selected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  <span className="font-medium truncate">{z.zone}</span>
                  <span className={`font-bold text-xs ml-2 flex-shrink-0 ${riskLevel}`}>
                    {maxRisk.toFixed(1)}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">Click to toggle zone on radar</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-1">Multi-Hazard Risk Radar</h4>
          <p className="text-xs text-slate-400 mb-2">Risk scores 0–10 across 5 climate hazards</p>
          <RiskRadarChart zones={zones} selectedZones={selectedZones} />
        </div>
      </div>

      {/* Heatmap table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Risk Heatmap — All Zones</h4>
            <p className="text-xs text-slate-400 mt-0.5">Score 0–10: Low (green) → Medium (amber) → High (red)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /> &lt;4 Low</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-300" /> 4–6 Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-400" /> 6–8 High</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> ≥8 Critical</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left font-semibold text-slate-500 sticky left-0 bg-slate-50">Zone</th>
                <th className="px-3 py-3 text-center font-semibold text-slate-500">
                  <div className="flex items-center justify-center gap-1"><Waves className="w-3.5 h-3.5 text-blue-400" />Flood</div>
                </th>
                <th className="px-3 py-3 text-center font-semibold text-slate-500">
                  <div className="flex items-center justify-center gap-1"><Thermometer className="w-3.5 h-3.5 text-orange-400" />Heat</div>
                </th>
                <th className="px-3 py-3 text-center font-semibold text-slate-500">
                  <div className="flex items-center justify-center gap-1"><Droplets className="w-3.5 h-3.5 text-cyan-400" />Water</div>
                </th>
                <th className="px-3 py-3 text-center font-semibold text-slate-500">Storm</th>
                <th className="px-3 py-3 text-center font-semibold text-slate-500">Drought</th>
                <th className="px-3 py-3 text-center font-semibold text-slate-500">Overall</th>
              </tr>
            </thead>
            <tbody>
              {[...zones].sort((a, b) => {
                const maxA = Math.max(a.floodRisk, a.heatRisk, a.waterRisk, a.stormRisk, a.droughtRisk)
                const maxB = Math.max(b.floodRisk, b.heatRisk, b.waterRisk, b.stormRisk, b.droughtRisk)
                return maxB - maxA
              }).map((z, i) => {
                const overall = Math.round((z.floodRisk + z.heatRisk + z.waterRisk + z.stormRisk + z.droughtRisk) / 5 * 10) / 10
                return (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-5 py-2.5 font-medium text-slate-800 sticky left-0 bg-white whitespace-nowrap">{z.zone}</td>
                    <RiskCell value={z.floodRisk} />
                    <RiskCell value={z.heatRisk} />
                    <RiskCell value={z.waterRisk} />
                    <RiskCell value={z.stormRisk} />
                    <RiskCell value={z.droughtRisk} />
                    <RiskCell value={overall} />
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
