import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import CachedStats from "@/server/models/CachedStats"

export async function GET() {
  try {
    await connectToDatabase()

    let stats = await CachedStats.findOne({})

    // If no cached stats exist yet, return empty defaults
    if (!stats) {
      return NextResponse.json({
        totalStartups: 0,
        totalFunding: 0,
        totalEmployees: 0,
        staleCount: 0,
        sectorDistribution: [],
        stageBreakdown: [],
        lastRefreshedAt: null,
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching cached stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch cached stats" },
      { status: 500 }
    )
  }
}
