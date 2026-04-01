'use client'

import { Filter, SlidersHorizontal } from 'lucide-react'

interface SectorFilterProps {
  sectors: string[]
  selectedSector: string
  alignmentThreshold: number
  onSectorChange: (sector: string) => void
  onThresholdChange: (threshold: number) => void
  resultCount: number
}

export default function SectorFilter({
  sectors,
  selectedSector,
  alignmentThreshold,
  onSectorChange,
  onThresholdChange,
  resultCount,
}: SectorFilterProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Sector dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Sector</label>
          <select
            value={selectedSector}
            onChange={e => onSectorChange(e.target.value)}
            className="
              ml-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5
              bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400
              focus:border-emerald-400 cursor-pointer min-w-[140px]
            "
          >
            <option value="All">All Sectors</option>
            {sectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Alignment threshold */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
            Min. Alignment
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={alignmentThreshold}
              onChange={e => onThresholdChange(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none bg-slate-200 accent-emerald-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-emerald-600 w-10 text-right tabular-nums">
              {alignmentThreshold}%
            </span>
          </div>
        </div>

        {/* Result count */}
        <div className="text-xs text-slate-400 font-medium whitespace-nowrap ml-auto">
          {resultCount} compan{resultCount === 1 ? 'y' : 'ies'} shown
        </div>
      </div>
    </div>
  )
}
