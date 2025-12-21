import api from "@/lib/api"

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
  createdBy: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
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

// 👤 User
export const createStartup = async (data: Partial<Startup>) => {
  return api.post("/startups", data)
}
