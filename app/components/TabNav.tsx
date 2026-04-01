'use client'

import { TrendingUp, Shield } from 'lucide-react'

interface TabNavProps {
  activeTab: 'pgim' | 'vmc'
  onChange: (tab: 'pgim' | 'vmc') => void
}

const tabs = [
  {
    id: 'pgim' as const,
    label: 'PGIM – Transition Finance',
    icon: TrendingUp,
    description: 'Private portfolio • EU Taxonomy • Sector analysis',
  },
  {
    id: 'vmc' as const,
    label: 'VMC – Resilience Finance',
    icon: Shield,
    description: 'Municipal budget • Climate bonds • Risk heatmap',
  },
]

export default function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
                  flex items-center gap-2.5 px-5 sm:px-7 py-4 sm:py-5 border-b-2 transition-all duration-200
                  whitespace-nowrap text-sm font-semibold focus:outline-none
                  ${isActive
                    ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="hidden sm:block text-xs font-normal text-emerald-600/70 ml-1">
                    — {tab.description}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
