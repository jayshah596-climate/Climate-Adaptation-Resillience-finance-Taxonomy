'use client'

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: LucideIcon
  color: 'emerald' | 'blue' | 'amber' | 'purple'
  loading?: boolean
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    valueColor: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    valueColor: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    valueColor: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    valueColor: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
}

export default function KPICard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color,
  loading,
}: KPICardProps) {
  const c = colorMap[color]

  if (loading) {
    return (
      <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm animate-pulse`}>
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-xl ${c.iconBg}`} />
          <div className="w-16 h-5 bg-slate-200 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-20 h-8 bg-slate-200 rounded" />
          <div className="w-32 h-4 bg-slate-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.iconBg}`}>
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
        </div>
        {trend && trendValue && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
            {trendValue}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${c.valueColor}`}>
          {value}
          {unit && (
            <span className="text-base font-semibold ml-1 opacity-70">{unit}</span>
          )}
        </div>
        <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
