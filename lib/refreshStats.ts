import connectToDatabase from "@/lib/mongodb"
import Startup from "@/server/models/startup"
import CachedStats from "@/server/models/CachedStats"

/**
 * Recompute and upsert the CachedStats document.
 * Call after every approval or startup edit.
 */
export async function refreshCachedStats() {
  await connectToDatabase()

  const approved = await Startup.find({ status: "approved" })

  let totalFunding = 0
  let totalEmployees = 0
  const sectorMap: Record<string, { count: number; funding: number }> = {}
  const stageMap: Record<string, number> = {}

  approved.forEach((s) => {
    totalFunding += Number(s.funding) || 0
    totalEmployees += Number(s.employees) || 0

    const sec = s.sector || "Unknown"
    if (!sectorMap[sec]) sectorMap[sec] = { count: 0, funding: 0 }
    sectorMap[sec].count++
    sectorMap[sec].funding += Number(s.funding) || 0

    const stg = s.stage || "Unknown"
    if (!stageMap[stg]) stageMap[stg] = 0
    stageMap[stg]++
  })

  const sectorDistribution = Object.entries(sectorMap).map(([sector, d]) => ({
    sector,
    count: d.count,
    funding: d.funding,
  }))

  const stageBreakdown = Object.entries(stageMap).map(([stage, count]) => ({
    stage,
    count,
  }))

  const staleCount = await Startup.countDocuments({
    status: "approved",
    isStale: true,
  })

  await CachedStats.findOneAndUpdate(
    {},
    {
      totalStartups: approved.length,
      totalFunding,
      totalEmployees,
      staleCount,
      sectorDistribution,
      stageBreakdown,
      lastRefreshedAt: new Date(),
    },
    { upsert: true, new: true }
  )
}
