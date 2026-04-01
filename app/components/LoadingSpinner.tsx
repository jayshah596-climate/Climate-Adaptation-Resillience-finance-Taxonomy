'use client'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ message = 'Loading data...', size = 'md' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-3',
    lg: 'w-14 h-14 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-emerald-200 border-t-emerald-500 animate-spin`}
          style={{ borderWidth: size === 'lg' ? 4 : size === 'md' ? 3 : 2 }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">{message}</p>
        <p className="text-xs text-slate-400 mt-1">Parsing Excel data…</p>
      </div>
    </div>
  )
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-slate-300 text-sm">Loading chart…</div>
    </div>
  )
}
