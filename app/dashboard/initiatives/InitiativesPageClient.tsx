'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Building2,
  Users,
  Target,
  TrendingUp,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Initiative } from '@/lib/initiatives-data'

interface InitiativesPageClientProps {
  initiatives: Initiative[]
}

export function InitiativesPageClient({ initiatives }: InitiativesPageClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [launchYearFilter, setLaunchYearFilter] = useState('All')

  // Filter options computed from data
  const owners = useMemo(() => {
    const uniqueOwners = Array.from(new Set(initiatives.map(init => init.owner)))
    return ['All', ...uniqueOwners.sort()]
  }, [initiatives])

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(initiatives.map(init => init.type)))
    return ['All', ...uniqueTypes.sort()]
  }, [initiatives])

  const statuses = ['All', 'Active', 'Inactive']

  const launchYears = useMemo(() => {
    const uniqueYears = Array.from(new Set(initiatives.map(init => init.launchYear)))
    return ['All', ...uniqueYears.sort((a, b) => b - a)]
  }, [initiatives])

  // Filtered initiatives based on search and filters
  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(initiative => {
      const matchesSearch = searchQuery === '' ||
        initiative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        initiative.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        initiative.focusAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesOwner = ownerFilter === 'All' || initiative.owner === ownerFilter
      const matchesType = typeFilter === 'All' || initiative.type === typeFilter
      const matchesStatus = statusFilter === 'All' || initiative.status === statusFilter
      const matchesLaunchYear = launchYearFilter === 'All' || initiative.launchYear.toString() === launchYearFilter

      return matchesSearch && matchesOwner && matchesType && matchesStatus && matchesLaunchYear
    })
  }, [initiatives, searchQuery, ownerFilter, typeFilter, statusFilter, launchYearFilter])

  // Helper functions for styling
  const getOwnerColor = (owner: Initiative['owner']) => {
    switch (owner) {
      case 'Government': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'State': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'Private': return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getTypeColor = (type: Initiative['type']) => {
    switch (type) {
      case 'Policy': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
      case 'Funding': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'Incubation': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'Infrastructure': return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getStatusColor = (status: Initiative['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'Inactive': return 'bg-red-500/20 text-red-700 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getOwnerIcon = (owner: Initiative['owner']) => {
    switch (owner) {
      case 'Government': return <Building2 className="w-4 h-4" />
      case 'State': return <Target className="w-4 h-4" />
      case 'Private': return <Users className="w-4 h-4" />
      default: return <Building2 className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Search & Filter Bar */}
      <div className="glass rounded-2xl p-6 shadow-lg border border-border/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search initiatives by name, description, or focus areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Owners</option>
              {owners.slice(1).map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Types</option>
              {types.slice(1).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Status</option>
              {statuses.slice(1).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={launchYearFilter}
              onChange={(e) => setLaunchYearFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Years</option>
              {launchYears.slice(1).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setOwnerFilter('All')
                setTypeFilter('All')
                setStatusFilter('All')
                setLaunchYearFilter('All')
              }}
              className="px-6 py-3 glass border-border/50 hover:bg-primary/10 hover:border-primary/60 hover:text-foreground transition-all duration-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Initiatives Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {filteredInitiatives.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-16 text-center shadow-lg border border-border/50"
          >
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">No initiatives found</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              {initiatives.length === 0
                ? "No initiatives have been added yet."
                : "Try adjusting your search or filter criteria to find what you're looking for."}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredInitiatives.length} of {initiatives.length} initiatives
              </p>
            </div>

            {/* Initiatives Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 perspective-[2000px]">
              {filteredInitiatives.map((initiative, index) => (
                <motion.div
                  key={initiative.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -10, 
                    rotateX: 2, 
                    rotateY: -2,
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.3)" 
                  }}
                  className="apple-glass rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group cursor-pointer h-full relative overflow-hidden"
                  onClick={() => router.push(`/dashboard/initiatives/${initiative.id}`)}
                >
                  {/* Glass Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-2xl" />
                  {/* Header Section */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 shadow-lg">
                      {getOwnerIcon(initiative.owner)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors duration-300 mb-2">
                        {initiative.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Launched {initiative.launchYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={`${getOwnerColor(initiative.owner)} border`}>
                      {initiative.owner}
                    </Badge>
                    <Badge className={`${getTypeColor(initiative.type)} border`}>
                      {initiative.type}
                    </Badge>
                    <Badge className={`${getStatusColor(initiative.status)} border`}>
                      {initiative.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {initiative.description}
                  </p>

                  {/* Focus Areas */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {initiative.focusAreas.slice(0, 3).map((area, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {initiative.focusAreas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{initiative.focusAreas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Target Sectors */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Target Sectors:</p>
                    <div className="flex flex-wrap gap-1">
                      {initiative.targetSectors.slice(0, 2).map((sector, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                      {initiative.targetSectors.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{initiative.targetSectors.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    {initiative.officialWebsite && (
                      <a
                        href={initiative.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Official Site
                      </a>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass border-border/50">
                        <DropdownMenuItem
                          className="hover:bg-card/50 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/initiatives/${initiative.id}`)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
