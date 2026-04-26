import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { getAggregatedSectors } from "@/lib/services/sector.services"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const sectorsData = await getAggregatedSectors()

    return NextResponse.json(sectorsData)
  } catch (error) {
    console.error("Error fetching sectors:", error)
    return NextResponse.json(
      { error: "Failed to fetch sectors" },
      { status: 500 }
    )
  }
}
