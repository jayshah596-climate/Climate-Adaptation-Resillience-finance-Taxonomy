'use client'

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface VMCAlignmentPieChartProps {
  alignedBudget: number
  totalBudget: number
  currency?: string
}

const COLORS = ['#10b981', '#e2e8f0']

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
  if (percent < 0.06) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-700">{payload[0].name}</p>
        <p className="text-slate-500">₹{payload[0].value} Cr ({payload[0].payload.percent}%)</p>
      </div>
    )
  }
  return null
}

export default function VMCAlignmentPieChart({ alignedBudget, totalBudget }: VMCAlignmentPieChartProps) {
  const notAligned = totalBudget - alignedBudget
  const alignedPct = Math.round((alignedBudget / totalBudget) * 100)

  const data = [
    { name: 'EU Taxonomy Aligned', value: alignedBudget, percent: alignedPct },
    { name: 'Not Yet Aligned', value: notAligned, percent: 100 - alignedPct },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderLabel}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value: string) => (
            <span className="text-xs font-medium text-slate-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
