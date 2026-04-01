'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { PortfolioCompany } from '@/app/types'

interface PortfolioTableProps {
  companies: PortfolioCompany[]
}

type SortKey = keyof PortfolioCompany
type SortDir = 'asc' | 'desc'

function AlignmentBadge({ pct }: { pct: number }) {
  const color = pct >= 70
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : pct >= 40
    ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-red-100 text-red-700 border-red-200'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 max-w-[60px]">
        <div
          className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md border ${color}`}>
        {pct}%
      </span>
    </div>
  )
}

function ScoreDots({ score }: { score: number }) {
  const color = score >= 4 ? '#10b981' : score >= 2.5 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-bold" style={{ color }}>{score.toFixed(1)}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: i <= Math.round(score) ? color : '#e2e8f0' }}
          />
        ))}
      </div>
    </div>
  )
}

const SECTOR_COLORS: Record<string, string> = {
  'Energy': 'bg-yellow-100 text-yellow-700',
  'Industry': 'bg-orange-100 text-orange-700',
  'Transport': 'bg-blue-100 text-blue-700',
  'Buildings': 'bg-purple-100 text-purple-700',
  'Utilities': 'bg-cyan-100 text-cyan-700',
  'Agriculture': 'bg-lime-100 text-lime-700',
  'ICT': 'bg-indigo-100 text-indigo-700',
}

export default function PortfolioTable({ companies }: PortfolioTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('alignmentPct')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...companies].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-emerald-500" />
      : <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />
  }

  const headers: { key: SortKey; label: string; align?: string }[] = [
    { key: 'name', label: 'Company' },
    { key: 'sector', label: 'Sector' },
    { key: 'revenue', label: 'Revenue (€M)', align: 'right' },
    { key: 'emissions', label: 'Emissions (ktCO₂e)', align: 'right' },
    { key: 'alignmentPct', label: 'Alignment' },
    { key: 'transitionScore', label: 'Trans. Score' },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map(h => (
              <th
                key={h.key}
                onClick={() => handleSort(h.key)}
                className={`
                  px-4 py-3 font-semibold text-slate-500 cursor-pointer select-none
                  hover:text-slate-700 transition-colors whitespace-nowrap
                  ${h.align === 'right' ? 'text-right' : 'text-left'}
                `}
              >
                <span className="inline-flex items-center gap-1">
                  {h.label}
                  <SortIcon k={h.key} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 hover:bg-emerald-50/30 transition-colors duration-100"
            >
              <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SECTOR_COLORS[c.sector] ?? 'bg-slate-100 text-slate-600'}`}>
                  {c.sector}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-700 tabular-nums">
                {c.revenue.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                <span className={`font-medium ${c.emissions > 1000 ? 'text-red-600' : c.emissions > 300 ? 'text-amber-600' : 'text-slate-600'}`}>
                  {c.emissions.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3 min-w-[140px]">
                <AlignmentBadge pct={c.alignmentPct} />
              </td>
              <td className="px-4 py-3">
                <ScoreDots score={c.transitionScore} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {companies.length === 0 && (
        <div className="py-10 text-center text-slate-400 text-sm">
          No companies match the current filters.
        </div>
      )}
    </div>
  )
}
