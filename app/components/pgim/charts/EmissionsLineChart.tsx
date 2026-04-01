'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { EmissionsDataPoint } from '@/app/types'

interface EmissionsLineChartProps {
  data: EmissionsDataPoint[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[180px]">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((p: { name: string; value: number; color: string }, i: number) => (
          p.value != null && (
            <div key={i} className="flex justify-between gap-4 text-xs mb-0.5">
              <span style={{ color: p.color }} className="font-medium">{p.name}</span>
              <span className="text-slate-600 font-semibold">{p.value.toLocaleString()} ktCO₂e</span>
            </div>
          )
        ))}
      </div>
    )
  }
  return null
}

export default function EmissionsLineChart({ data }: EmissionsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          label={{ value: 'ktCO₂e', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8', dx: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="plainline"
          iconSize={16}
          formatter={(value: string) => (
            <span className="text-xs font-medium text-slate-600">{value}</span>
          )}
        />
        <ReferenceLine x={2023} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Now', position: 'top', fontSize: 10, fill: '#94a3b8' }} />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual Emissions"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Science-Based Target"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="bau"
          name="Business-As-Usual"
          stroke="#ef4444"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          dot={false}
          opacity={0.7}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
