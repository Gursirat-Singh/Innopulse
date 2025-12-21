type MonthlySnapshot = {
  month: string
  totalStartups: number
  activeStartups: number
  funding: number
  employment: number
}

const snapshots: MonthlySnapshot[] = [
  {
    month: "2024-10",
    totalStartups: 90000,
    activeStartups: 82000,
    funding: 160_000_000_000,
    employment: 1_050_000,
  },
  {
    month: "2024-11",
    totalStartups: 93000,
    activeStartups: 85000,
    funding: 170_000_000_000,
    employment: 1_120_000,
  },
  {
    month: "2024-12",
    totalStartups: 95000,
    activeStartups: 87000,
    funding: 180_000_000_000,
    employment: 1_200_000,
  },
]

export function getLatestSnapshot() {
  return snapshots[snapshots.length - 1]
}

export function getMoMGrowth() {
  const len = snapshots.length
  const current = snapshots[len - 1]
  const previous = snapshots[len - 2]

  return {
    startupsGrowth: (
      ((current.totalStartups - previous.totalStartups) /
        previous.totalStartups) *
      100
    ).toFixed(1),

    fundingGrowth: (
      ((current.funding - previous.funding) / previous.funding) *
      100
    ).toFixed(1),
  }
}
