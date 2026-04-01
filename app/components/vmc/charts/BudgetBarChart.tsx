'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import type { BudgetSector } from '@/app/types'

interface BudgetBarChartProps {
  data: BudgetSector[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aligned = payload.find((p: { name: string }) => p.name === 'Aligned Budget')?.value ?? 0
    const notAligned = payload.find((p: { name: string }) => p.name === 'Non-Aligned')?.value ?? 0
    const total = aligned + notAligned
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[200px]">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-emerald-600 font-medium">Aligned</span>
            <span className="font-bold text-slate-700">₹{aligned} Cr</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400 font-medium">Non-Aligned</span>
            <span className="font-medium text-slate-600">₹{notAligned} Cr</span>
          </div>
          <div className="border-t border-slate-100 pt-1 flex justify-between gap-4">
            <span className="text-slate-500">Total</span>
            <span className="font-semibold text-slate-700">₹{total} Cr</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function BudgetBarChart({ data }: BudgetBarChartProps) {
  const chartData = data.map(s => ({
    sector: s.sector.length > 16 ? s.sector.substring(0, 15) + '…' : s.sector,
    fullSector: s.sector,
    'Aligned Budget': s.alignedBudget,
    'Non-Aligned': s.budget - s.alignedBudget,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 55 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="sector"
          tick={{ fontSize: 10, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Legend
          iconType="square"
          iconSize={10}
          formatter={(value: string) => (
            <span className="text-xs font-medium text-slate-600">{value}</span>
          )}
        />
        <Bar dataKey="Aligned Budget" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Non-Aligned" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
