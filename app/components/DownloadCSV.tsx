'use client'

import { Download } from 'lucide-react'

interface DownloadCSVProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  filename: string
  label?: string
  className?: string
}

function toCSV(data: Record<string, unknown>[]): string {
  if (!data || data.length === 0) return ''
  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h]
      if (val === null || val === undefined) return ''
      const str = String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export default function DownloadCSV({ data, filename, label = 'Export CSV', className = '' }: DownloadCSVProps) {
  const handleDownload = () => {
    if (!data || data.length === 0) return
    const csv = toCSV(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={!data || data.length === 0}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
        border border-emerald-200 text-emerald-700 bg-emerald-50
        hover:bg-emerald-100 hover:border-emerald-300 transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  )
}
