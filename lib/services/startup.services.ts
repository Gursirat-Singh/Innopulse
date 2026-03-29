import api from "@/lib/api"

export type ChangeHistoryEntry = {
  changedAt: string
  changedBy: string | { _id: string; email: string; name?: string }
  changedFields: string[]
  previousValues: Record<string, any>
  newValues: Record<string, any>
}

export type Startup = {
  _id: string
  name: string
  sector: string
  city: string
  stage: "Ideation" | "Seed" | "Series A" | "Series B" | "Growth"
  funding: number
  employees: number
  revenueRange: string
  website?: string
  email?: string
  phone?: string
  status: "pending" | "approved" | "rejected"
  createdBy: string | { _id: string; email: string; name?: string }
  approvedBy?: string | { _id: string; email: string; name?: string }
  createdAt: string
  updatedAt: string
  lastActivityAt?: string
  isStale?: boolean
  changeHistory?: ChangeHistoryEntry[]
}

export type CachedStats = {
  totalStartups: number
  totalFunding: number
  totalEmployees: number
  staleCount: number
  sectorDistribution: { sector: string; count: number; funding: number }[]
  stageBreakdown: { stage: string; count: number }[]
  lastRefreshedAt: string | null
}

// ✅ Public — approved startups only
export const getApprovedStartups = async (): Promise<Startup[]> => {
  const res = await api.get("/startups")
  return res.data
}

// 👑 Admin only
export const getAllStartups = async (): Promise<Startup[]> => {
  const res = await api.get("/startups/admin/all")
  return res.data
}

// 👑 Admin only
export const getStartupById = async (id: string): Promise<Startup> => {
  const res = await api.get(`/startups/${id}`)
  return res.data
}

// 👑 Admin only
export const getPendingStartups = async (): Promise<Startup[]> => {
  const res = await api.get("/startups/pending")
  return res.data
}

// 👑 Admin only
export const approveStartup = async (id: string) => {
  return api.patch(`/startups/${id}`, { action: 'approve' })
}

// 👑 Admin only
export const rejectStartup = async (id: string) => {
  return api.patch(`/startups/${id}`, { action: 'reject' })
}

// 👑 Admin only
export const deleteStartup = async (id: string) => {
  return api.delete(`/startups/${id}`)
}

// 👑 Admin only — edit startup fields
export const updateStartup = async (id: string, updates: Partial<Startup>) => {
  return api.patch(`/startups/${id}`, { action: 'edit', updates })
}

// 👑 Admin only — get stale startups
export const getStaleStartups = async (): Promise<Startup[]> => {
  const res = await api.get("/startups/stale")
  return res.data
}

// 📊 Public — cached analytics
export const getCachedStats = async (): Promise<CachedStats> => {
  const res = await api.get("/stats")
  return res.data
}

// 👤 User
export const createStartup = async (data: Partial<Startup>) => {
  return api.post("/startups", data)
}
