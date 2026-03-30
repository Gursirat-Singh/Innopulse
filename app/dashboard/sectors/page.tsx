export const dynamic = 'force-dynamic'
export const revalidate = 0

import connectToDatabase from "@/lib/mongodb"
import { getAggregatedSectors } from "@/lib/services/sector.services"
import SectorsPageHeader from "./components/SectorsPageHeader"
import SectorSummaryCards from "./components/SectorSummaryCards"
import SectorsGrid from "./components/SectorsGrid"

export default async function SectorsPage() {
  // Server-side data aggregation for summary cards
  await connectToDatabase()
  const sectorsData = await getAggregatedSectors()

  return (
    <div className="space-y-6">
      {/* Page Header - Server Component */}
      <SectorsPageHeader />

      {/* Sector Summary Cards - Server Component */}
      <SectorSummaryCards sectorsData={sectorsData} />

      {/* Sectors Grid with Search/Sort - Client Component */}
      <SectorsGrid />
    </div>
  )
}
