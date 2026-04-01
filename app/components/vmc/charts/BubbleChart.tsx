'use client'

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ZAxis,
} from 'recharts'
import type { CBRTProject } from '@/app/types'

interface BubbleChartProps {
  projects: CBRTProject[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Flood Resilience':     '#3b82f6',
  'Heat Adaptation':      '#f59e0b',
  'Water Security':       '#06b6d4',
  'Clean Energy':         '#10b981',
  'Low-Carbon Transport': '#8b5cf6',
  'Green Infrastructure': '#22c55e',
  'Circular Economy':     '#64748b',
  'Ecosystem Services':   '#84cc16',
  'Social Resilience':    '#ec4899',
  'DRR & Preparedness':   '#ef4444',
  'Food Resilience':      '#a16207',
  'Infrastructure':       '#94a3b8',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as CBRTProject
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm max-w-[220px]">
        <p className="font-semibold text-slate-800 mb-1 text-xs leading-tight">{d.name}</p>
        <div className="space-y-0.5 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Category</span>
            <span className="font-medium text-slate-700">{d.category}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Risk Score</span>
            <span className="font-semibold text-orange-600">{d.risk}/10</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Impact Score</span>
            <span className="font-semibold text-emerald-600">{d.impact}/10</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Budget</span>
            <span className="font-bold text-slate-700">₹{d.budget} Cr</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">CBRT Eligible</span>
            <span className={`font-semibold ${d.eligible ? 'text-emerald-600' : 'text-red-500'}`}>
              {d.eligible ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function BubbleChart({ projects }: BubbleChartProps) {
  // Group by category for different colors
  const categories = [...new Set(projects.map(p => p.category))]

  const scatterData = projects.map(p => ({
    ...p,
    z: Math.max(p.budget * 0.8, 20),
  }))

  return (
    <ResponsiveContainer width="100%" height={340}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          type="number"
          dataKey="risk"
          name="Risk Score"
          domain={[0, 10]}
          label={{ value: 'Climate Risk Score →', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94a3b8' }}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="impact"
          name="Impact Score"
          domain={[0, 10]}
          label={{ value: 'Climate Impact ↑', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8', dx: 10 }}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <ZAxis type="number" dataKey="z" range={[40, 400]} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={5} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
        <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
        {categories.map(cat => {
          const catData = scatterData.filter(p => p.category === cat)
          const color = CATEGORY_COLORS[cat] ?? '#64748b'
          return (
            <Scatter
              key={cat}
              name={cat}
              data={catData}
              fill={color}
              fillOpacity={0.75}
              stroke={color}
              strokeWidth={1}
            />
          )
        })}
      </ScatterChart>
    </ResponsiveContainer>
  )
}
