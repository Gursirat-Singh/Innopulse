import Startup from "@/server/models/startup"

export interface AggregatedSector {
  name: string
  totalStartups: number
  totalFunding: number
  avgEmployees: number
  dominantStage: string
  topCities: string[]
}

export interface SectorStats {
  totalSectors: number
  totalStartups: number
  totalFunding: number
  topSectorByStartups: string
}

export interface SectorsData {
  sectors: AggregatedSector[]
  stats: SectorStats
}

// Aggregate sectors data from approved startups
export async function getAggregatedSectors(): Promise<SectorsData> {
  // MongoDB aggregation pipeline to group startups by sector
  const sectorAggregation = await Startup.aggregate([
    // Only include approved startups
    { $match: { status: "approved" } },

    // Group by sector
    {
      $group: {
        _id: "$sector",
        totalStartups: { $sum: 1 },
        totalFunding: { $sum: "$funding" },
        totalEmployees: { $sum: "$employees" },
        stages: { $push: "$stage" },
        cities: { $push: "$city" }
      }
    },

    // Calculate additional metrics
    {
      $addFields: {
        avgEmployees: {
          $cond: {
            if: { $gt: ["$totalStartups", 0] },
            then: { $divide: ["$totalEmployees", "$totalStartups"] },
            else: 0
          }
        },
        // Find dominant stage (most frequent)
        dominantStage: {
          $let: {
            vars: {
              stageCounts: {
                $reduce: {
                  input: "$stages",
                  initialValue: {},
                  in: {
                    $mergeObjects: [
                      "$$value",
                      {
                        $literal: {
                          "$$this": {
                            $add: [
                              { $ifNull: ["$$value.$$this", 0] },
                              1
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            in: {
              $let: {
                vars: {
                  maxCount: { $max: { $objectToArray: "$$stageCounts" } },
                  maxEntry: {
                    $filter: {
                      input: { $objectToArray: "$$stageCounts" },
                      cond: {
                        $eq: ["$$this.v", { $max: { $objectToArray: "$$stageCounts" } }]
                      }
                    }
                  }
                },
                in: { $arrayElemAt: ["$$maxEntry.k", 0] }
              }
            }
          }
        },
        // Get top cities by frequency (simplified approach)
        topCities: {
          $reduce: {
            input: "$cities",
            initialValue: [],
            in: {
              $cond: {
                if: { $in: ["$$this", "$$value"] },
                then: "$$value",
                else: {
                  $concatArrays: [
                    "$$value",
                    ["$$this"]
                  ]
                }
              }
            }
          }
        }
      }
    },

    // Project final fields
    {
      $project: {
        name: "$_id",
        totalStartups: 1,
        totalFunding: 1,
        avgEmployees: { $round: ["$avgEmployees", 1] },
        dominantStage: 1,
        topCities: 1,
        _id: 0
      }
    },

    // Sort by total startups descending
    { $sort: { totalStartups: -1 } }
  ])

  // Calculate overall stats
  const totalSectors = sectorAggregation.length
  const totalStartups = sectorAggregation.reduce((sum, sector) => sum + sector.totalStartups, 0)
  const totalFunding = sectorAggregation.reduce((sum, sector) => sum + sector.totalFunding, 0)
  const topSectorByStartups = totalSectors > 0 ? sectorAggregation[0].name : ""

  const stats: SectorStats = {
    totalSectors,
    totalStartups,
    totalFunding,
    topSectorByStartups
  }

  return {
    sectors: sectorAggregation,
    stats
  }
}

// Format funding amount to Indian Rupees
export function formatFunding(amount: number): string {
  if (amount == null) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Get sector by name for filtering startups
export async function getSectorByName(sectorName: string): Promise<AggregatedSector | null> {
  const sectorsData = await getAggregatedSectors()
  return sectorsData.sectors.find(sector =>
    sector.name.toLowerCase() === sectorName.toLowerCase()
  ) || null
}
