"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  PieChart,
  Building2,
  DollarSign,
  Users,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"

// Loading skeleton component
function SectorCardSkeleton() {
  return (
    <Card className="apple-glass border-0 shadow-xl h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted animate-pulse rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted animate-pulse rounded-lg">
              <div className="h-4 w-16 mx-auto mb-2 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-12 mx-auto bg-muted animate-pulse rounded"></div>
            </div>
            <div className="text-center p-3 bg-muted animate-pulse rounded-lg">
              <div className="h-4 w-16 mx-auto mb-2 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-12 mx-auto bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="flex gap-1">
                <div className="h-5 w-12 bg-muted animate-pulse rounded-full"></div>
                <div className="h-5 w-12 bg-muted animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AggregatedSector {
  name: string
  totalStartups: number
  totalFunding: number
  avgEmployees: number
  dominantStage: string
  topCities: string[]
}

// Format funding amount to Indian Rupees
function formatFunding(amount: number): string {
  if (amount == null) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Sectors Grid with Search/Sort Client Component
export default function SectorsGrid() {
  const router = useRouter()
  const [sectors, setSectors] = useState<AggregatedSector[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"startups" | "funding" | "employees">("startups")

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('/api/sectors')
        if (!response.ok) {
          throw new Error('Failed to fetch sectors')
        }
        const data = await response.json()
        setSectors(data.sectors || [])
      } catch (error) {
        console.error('Failed to fetch sectors:', error)
        setSectors([])
      } finally {
        setLoading(false)
      }
    }

    fetchSectors()
  }, [])

  const filteredAndSortedSectors = useMemo(() => {
    return sectors
      .filter((sector: AggregatedSector) => {
        if (!searchQuery) return true
        return sector.name.toLowerCase().includes(searchQuery.toLowerCase())
      })
      .sort((a: AggregatedSector, b: AggregatedSector) => {
        switch (sortBy) {
          case "startups":
            return b.totalStartups - a.totalStartups
          case "funding":
            return b.totalFunding - a.totalFunding
          case "employees":
            return b.avgEmployees - a.avgEmployees
          default:
            return 0
        }
      })
  }, [sectors, searchQuery, sortBy])

  const handleSectorClick = (sectorName: string) => {
    // Navigate to startups page with sector filter
    router.push(`/dashboard/startups?sector=${encodeURIComponent(sectorName)}`)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSortBy("startups")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Search & Sort Controls */}
      <div className="p-6 border-b border-border/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "startups" | "funding" | "employees")}
              className="w-[180px] bg-card/50 border-border/50"
            >
              <option value="startups">Number of Startups</option>
              <option value="funding">Total Funding</option>
              <option value="employees">Avg Employees</option>
            </Select>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="glass border-border/50 hover:text-foreground"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="p-6">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SectorCardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : filteredAndSortedSectors.length === 0 ? (
          <div className="text-center py-12">
            <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No sectors found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {filteredAndSortedSectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="apple-glass border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full cursor-pointer group"
                  onClick={() => handleSectorClick(sector.name)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-primary">
                          <PieChart className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                            {sector.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {sector.dominantStage || "N/A"} dominant stage
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-card/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Building2 className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Startups</span>
                          </div>
                          <div className="text-lg font-semibold text-foreground">
                            {sector.totalStartups}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-card/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-muted-foreground">Avg Team</span>
                          </div>
                          <div className="text-lg font-semibold text-foreground">
                            {sector.avgEmployees}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Funding
                          </span>
                          <span className="font-medium text-foreground">
                            {formatFunding(sector.totalFunding)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Top Cities:</span>
                          <div className="flex gap-1 flex-wrap justify-end">
                            {sector.topCities.slice(0, 2).map((city) => (
                              <Badge
                                key={city}
                                variant="secondary"
                                className="text-xs"
                              >
                                {city}
                              </Badge>
                            ))}
                            {sector.topCities.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{sector.topCities.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredAndSortedSectors.length > 0 && (
        <div className="px-6 py-4 border-t border-border/20 bg-card/20">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredAndSortedSectors.length} of {sectors.length} sectors
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
