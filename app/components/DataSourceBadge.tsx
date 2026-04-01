'use client'

import { Database, FileSpreadsheet } from 'lucide-react'

interface DataSourceBadgeProps {
  source: 'excel' | 'mock'
}

export default function DataSourceBadge({ source }: DataSourceBadgeProps) {
  if (source === 'excel') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        <FileSpreadsheet className="w-3 h-3" />
        Excel Data
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
      <Database className="w-3 h-3" />
      Sample Data
    </span>
  )
}
