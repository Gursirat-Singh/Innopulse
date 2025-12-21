import { Metadata } from 'next'
import { Suspense } from 'react'
import { initiativesData, getInitiativesStats, type Initiative } from '@/lib/initiatives-data'
import { InitiativesPageClient } from './InitiativesPageClient'

// Server Component for metadata and initial render
export const metadata: Metadata = {
  title: 'Initiatives | Innoscope',
  description: 'Key programs and policies supporting India\'s startup ecosystem',
}

// Server Component for summary stats
function InitiativesStats() {
  const stats = getInitiativesStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Initiatives</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalInitiatives}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-green-600 rounded"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Initiatives</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeInitiatives}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-purple-600 rounded"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Government + Private</p>
              <p className="text-2xl font-bold text-foreground">{stats.governmentInitiatives + stats.privateInitiatives}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-orange-600 rounded"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sectors Covered</p>
              <p className="text-2xl font-bold text-foreground">{stats.sectorsCovered}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Server Component for page header
function InitiativesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Initiatives
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Key programs and policies supporting India's startup ecosystem
        </p>
      </div>
    </div>
  )
}

// Main Server Component
export default function InitiativesPage() {
  return (
    <div className="min-h-screen space-y-8">
      {/* Page Header */}
      <InitiativesHeader />

      {/* Summary Stats */}
      <InitiativesStats />

      {/* Client Component for Search/Filters and Grid */}
      <Suspense fallback={<div>Loading initiatives...</div>}>
        <InitiativesPageClient initiatives={initiativesData} />
      </Suspense>
    </div>
  )
}
