import mongoose from "mongoose"

const cachedStatsSchema = new mongoose.Schema(
  {
    totalStartups: { type: Number, default: 0 },
    totalFunding: { type: Number, default: 0 },
    totalEmployees: { type: Number, default: 0 },
    staleCount: { type: Number, default: 0 },

    sectorDistribution: [
      {
        sector: String,
        count: Number,
        funding: Number,
      },
    ],

    stageBreakdown: [
      {
        stage: String,
        count: Number,
      },
    ],

    lastRefreshedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const CachedStats =
  mongoose.models.CachedStats ||
  mongoose.model("CachedStats", cachedStatsSchema)

export default CachedStats
