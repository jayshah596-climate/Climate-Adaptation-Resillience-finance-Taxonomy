'use client'

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  Legend, Tooltip,
} from 'recharts'
import type { RiskZone } from '@/app/types'

interface RiskRadarChartProps {
  zones: RiskZone[]
  selectedZones?: string[]
}

const ZONE_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
]

const HAZARDS = [
  { key: 'floodRisk', label: 'Flood' },
  { key: 'heatRisk', label: 'Heat' },
  { key: 'waterRisk', label: 'Water' },
  { key: 'stormRisk', label: 'Storm' },
  { key: 'droughtRisk', label: 'Drought' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
        {payload.map((p: { name: string; value: number; color: string }, i: number) => (
          <div key={i} className="flex justify-between gap-3">
            <span style={{ color: p.color }} className="font-medium">{p.name}</span>
            <span className="font-semibold text-slate-700">{p.value}/10</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RiskRadarChart({ zones, selectedZones }: RiskRadarChartProps) {
  const displayZones = selectedZones?.length
    ? zones.filter(z => selectedZones.includes(z.zone))
    : zones.slice(0, 4) // show first 4 by default

  const radarData = HAZARDS.map(h => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const point: any = { hazard: h.label }
    displayZones.forEach(z => {
      point[z.zone] = (z as unknown as Record<string, number>)[h.key]
    })
    return point
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="hazard"
          tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
        />
        {displayZones.map((zone, i) => (
          <Radar
            key={zone.zone}
            name={zone.zone}
            dataKey={zone.zone}
            stroke={ZONE_COLORS[i % ZONE_COLORS.length]}
            fill={ZONE_COLORS[i % ZONE_COLORS.length]}
            fillOpacity={0.12}
            strokeWidth={2}
          />
        ))}
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="plainline"
          iconSize={14}
          formatter={(value: string) => (
            <span className="text-xs font-medium text-slate-600">{value}</span>
          )}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
