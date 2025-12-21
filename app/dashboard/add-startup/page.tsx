"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { createStartup } from "@/lib/services/startup.services"

const stages = ["Ideation", "Seed", "Series A", "Series B", "Growth"]

const sectors = [
  "Fintech",
  "Healthcare",
  "EdTech",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Cybersecurity",
  "Clean Energy",
  "FoodTech",
  "Logistics",
  "Real Estate",
  "Gaming",
  "HR Tech",
  "Legal Tech",
  "Travel & Tourism",
  "Agriculture",
  "Manufacturing",
  "Other"
]

export default function AddStartupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    city: "",
    stage: "",
    website: "",
    email: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.sector.trim()) newErrors.sector = "Sector is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.stage) newErrors.stage = "Stage is required"

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await createStartup(formData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create startup:", error)
      setErrors({ submit: "Failed to create startup. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 px-4 py-2 rounded-lg hover:bg-card/50 border border-border/50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-5xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-3 mb-4">
            Add New Startup
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Fill in the details to add a new startup to the database.</p>
        </div>

        {/* Form Container - Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="glass-strong rounded-3xl p-10 space-y-10 shadow-2xl border border-white/20 bg-card/95 backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Required Fields */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Required Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-foreground">
                        Startup Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter startup name"
                        className={`h-11 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sector" className="text-sm font-medium text-foreground">
                          Sector *
                        </Label>
                        <Select
                          id="sector"
                          value={formData.sector}
                          onChange={(e) => handleInputChange("sector", e.target.value)}
                          className={`h-11 ${errors.sector ? "border-red-500 focus:ring-red-500" : ""}`}
                        >
                          <option value="">Select sector</option>
                          {sectors.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </Select>
                        {errors.sector && <p className="text-sm text-red-500 mt-1">{errors.sector}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-foreground">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter city"
                          className={`h-11 ${errors.city ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stage" className="text-sm font-medium text-foreground">
                        Growth Stage *
                      </Label>
                      <Select
                        id="stage"
                        value={formData.stage}
                        onChange={(e) => handleInputChange("stage", e.target.value)}
                        className={`h-11 ${errors.stage ? "border-red-500 focus:ring-red-500" : ""}`}
                      >
                        <option value="">Select stage</option>
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </Select>
                      {errors.stage && <p className="text-sm text-red-500 mt-1">{errors.stage}</p>}
                    </div>
                  </div>
                </div>

                {/* Optional Fields */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Contact Information (Optional)
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium text-foreground">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://example.com"
                        type="url"
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="contact@example.com"
                          type="email"
                          className={`h-11 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+91 9876543210"
                          type="tel"
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="px-8 py-3 h-12 text-base border-2 hover:bg-muted/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 h-12 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Startup
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
