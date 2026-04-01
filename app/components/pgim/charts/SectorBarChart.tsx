'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine,
} from 'recharts'
import type { SectorData } from '@/app/types'

interface SectorBarChartProps {
  data: SectorData[]
}

const getBarColor = (value: number) => {
  if (value >= 70) return '#10b981'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aligned = payload[0]?.value as number
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Aligned</span>
          <span className="font-bold" style={{ color: getBarColor(aligned) }}>{aligned}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Not Aligned</span>
          <span className="font-medium text-slate-600">{100 - aligned}%</span>
        </div>
      </div>
    )
  }
  return null
}

export default function SectorBarChart({ data }: SectorBarChartProps) {
  const sorted = [...data].sort((a, b) => b.aligned - a.aligned)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={sorted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="sector"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={45}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <ReferenceLine y={67} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Target 67%', position: 'insideTopRight', fontSize: 10, fill: '#10b981' }} />
        <Bar dataKey="aligned" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {sorted.map((entry, i) => (
            <Cell key={i} fill={getBarColor(entry.aligned)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
