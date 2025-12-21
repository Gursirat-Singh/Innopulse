export type Startup = {
  name: string
  sector: string
  city: string
  stage: string
}

export const startups: Startup[] = [
  { name: "Razorpay", sector: "FinTech", city: "Bengaluru", stage: "Late" },
  { name: "Meesho", sector: "E-Commerce", city: "Bengaluru", stage: "Late" },
  { name: "CRED", sector: "FinTech", city: "Bengaluru", stage: "Growth" },
  { name: "Zerodha", sector: "FinTech", city: "Bengaluru", stage: "Profitable" },
  { name: "Byju’s", sector: "EdTech", city: "Bengaluru", stage: "Declining" },
]
