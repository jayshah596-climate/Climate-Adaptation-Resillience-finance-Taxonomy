'use client'

import { Leaf, BarChart3, Globe } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight">
                Climate Finance Dashboard
              </h1>
              <p className="text-xs text-emerald-300/80 hidden sm:block">
                EU Taxonomy · Transition Finance · Resilience Finance
              </p>
            </div>
          </div>

          {/* Right badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">Climate Bonds Initiative</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-300">EU Taxonomy Aligned</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
