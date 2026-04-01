'use client'

import { useState, useEffect } from 'react'
import { Building2, ShieldAlert, Award } from 'lucide-react'
import type { VMCData } from '@/app/types'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import DataSourceBadge from '@/app/components/DataSourceBadge'
import EUTaxonomySection from './EUTaxonomySection'
import ResilienceSection from './ResilienceSection'
import CBRTSection from './CBRTSection'

type SubTab = 'eu-taxonomy' | 'resilience' | 'cbrt'

const SUB_TABS: { id: SubTab; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  {
    id: 'eu-taxonomy',
    label: 'EU Taxonomy Mapping',
    icon: Building2,
    description: 'Budget alignment · Sector analysis',
  },
  {
    id: 'resilience',
    label: 'Climate Resilience Framework',
    icon: ShieldAlert,
    description: 'Multi-hazard risk · Zone heatmap',
  },
  {
    id: 'cbrt',
    label: 'Climate Bond Readiness',
    icon: Award,
    description: 'CBRT eligibility · Project matrix',
  },
]

export default function VMCDashboard() {
  const [data, setData] = useState<VMCData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('eu-taxonomy')

  useEffect(() => {
    fetch('/api/vmc')
      .then(r => r.json())
      .then((d: VMCData) => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load VMC data'); setLoading(false) })
  }, [])

  if (loading) return <LoadingSpinner message="Loading VMC Resilience Finance data…" />
  if (error || !data) return (
    <div className="text-center py-20 text-red-500">{error ?? 'Unknown error'}</div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">VMC – Vadodara Municipal Corporation</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Resilience Finance · EU Taxonomy · Climate Bond Readiness Toolkit
          </p>
        </div>
        <DataSourceBadge source={data.dataSource} />
      </div>

      {/* Sub-tab navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-100">
          {SUB_TABS.map(tab => {
            const Icon = tab.icon
            const active = activeSubTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`
                  flex items-center gap-2.5 px-5 py-4 border-b-2 transition-all duration-150
                  text-sm font-semibold whitespace-nowrap focus:outline-none flex-1 justify-center sm:justify-start
                  ${active
                    ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                {active && (
                  <span className="hidden lg:block text-xs font-normal text-emerald-500/80 ml-1">
                    — {tab.description}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Sub-tab content */}
        <div className="p-5">
          {activeSubTab === 'eu-taxonomy' && <EUTaxonomySection data={data.euTaxonomy} />}
          {activeSubTab === 'resilience' && <ResilienceSection data={data.resilience} />}
          {activeSubTab === 'cbrt' && <CBRTSection data={data.cbrt} />}
        </div>
      </div>
    </div>
  )
}
