import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectorsData, formatFunding } from "@/lib/services/sector.services"

// Sector Summary Cards Server Component
export default function SectorSummaryCards({ sectorsData }: { sectorsData: SectorsData }) {
  const { stats } = sectorsData

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardDescription>Total Sectors</CardDescription>
          <CardTitle className="text-2xl">{stats.totalSectors}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardDescription>Total Startups</CardDescription>
          <CardTitle className="text-2xl">{stats.totalStartups.toLocaleString()}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardDescription>Total Funding</CardDescription>
          <CardTitle className="text-2xl">{formatFunding(stats.totalFunding)}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardDescription>Top Sector by Startups</CardDescription>
          <CardTitle className="text-2xl text-primary truncate" title={stats.topSectorByStartups}>
            {stats.topSectorByStartups || "N/A"}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
