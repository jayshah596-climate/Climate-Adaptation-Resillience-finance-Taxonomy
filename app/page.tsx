'use client'

import { useState } from 'react'
import { BookOpen, GitBranch, Shield } from 'lucide-react'
import Header from './components/Header'
import TabNav from './components/TabNav'
import PGIMDashboard from './components/pgim/PGIMDashboard'
import VMCDashboard from './components/vmc/VMCDashboard'

// ── Info Cards ─────────────────────────────────────────────────────────────────

interface InfoCardProps {
  icon: React.FC<{ className?: string }>
  title: string
  description: string
  tags: string[]
  color: 'emerald' | 'blue' | 'purple'
}

const colorConfig = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    icon: 'text-emerald-600',
    tag: 'bg-emerald-100 text-emerald-700',
    title: 'text-emerald-800',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    icon: 'text-blue-600',
    tag: 'bg-blue-100 text-blue-700',
    title: 'text-blue-800',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    icon: 'text-purple-600',
    tag: 'bg-purple-100 text-purple-700',
    title: 'text-purple-800',
  },
}

function InfoCard({ icon: Icon, title, description, tags, color }: InfoCardProps) {
  const c = colorConfig[color]
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
      <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <h3 className={`text-sm font-bold ${c.title} mb-1.5`}>{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.tag}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'pgim' | 'vmc'>('pgim')

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Climate Finance Analytics
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                EU Taxonomy 2024
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Climate Finance &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Taxonomy Dashboard
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Unified analytics platform for <strong className="text-white">Transition Finance</strong> (PGIM private portfolio)
              and <strong className="text-white">Resilience Finance</strong> (Vadodara Municipal Corporation) —
              aligned to EU Taxonomy, Climate Bonds Initiative, and Science-Based Targets.
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoCard
                icon={BookOpen}
                title="EU Taxonomy Alignment"
                description="Maps investment activities and municipal budgets against the EU Taxonomy's six environmental objectives and DNSH criteria."
                tags={['Climate Mitigation', 'Adaptation', 'DNSH']}
                color="emerald"
              />
              <InfoCard
                icon={GitBranch}
                title="Transition Finance"
                description="Tracks portfolio companies on their net-zero transition pathway against Science-Based Targets and sectoral decarbonisation benchmarks."
                tags={['SBTi', 'Net Zero', 'Sector Pathways']}
                color="blue"
              />
              <InfoCard
                icon={Shield}
                title="Resilience Finance"
                description="Assesses municipal infrastructure projects for climate bond eligibility under Climate Bonds Initiative sector criteria."
                tags={['CBI Certified', 'CBRT', 'Urban Resilience']}
                color="purple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <TabNav activeTab={activeTab} onChange={setActiveTab} />

      {/* Dashboard content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'pgim' && <PGIMDashboard />}
        {activeTab === 'vmc' && <VMCDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-600">Climate Finance & Taxonomy Dashboard</span>
              <span>·</span>
              <span>Built with Next.js · Tailwind CSS · Recharts · SheetJS</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Data: PGIM Transition Finance Toolkit · VMC Budget Mapping</span>
              <span>·</span>
              <span>EU Taxonomy Regulation (2020/852)</span>
              <span>·</span>
              <span>Climate Bonds Initiative</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
