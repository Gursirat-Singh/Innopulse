"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { createStartup, type Startup } from "@/lib/services/startup.services"

interface AddStartupFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const stages = ["Ideation", "Seed", "Series A", "Series B", "Growth"]

export function AddStartupForm({ isOpen, onClose, onSuccess }: AddStartupFormProps) {
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
      await createStartup({ ...formData, stage: formData.stage as Startup['stage'] })
      onSuccess()
      onClose()
      setFormData({
        name: "",
        sector: "",
        city: "",
        stage: "",
        website: "",
        email: "",
        phone: "",
      })
    } catch (error) {
      console.error("Failed to create startup:", error)
      setErrors({ submit: "Failed to create startup. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add New Startup">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Required Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter startup name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="sector" className="text-sm font-medium text-foreground">
              Sector *
            </Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => handleInputChange("sector", e.target.value)}
              placeholder="e.g., Fintech, Healthcare, EdTech"
              className={errors.sector ? "border-red-500" : ""}
            />
            {errors.sector && <p className="text-sm text-red-500 mt-1">{errors.sector}</p>}
          </div>

          <div>
            <Label htmlFor="city" className="text-sm font-medium text-foreground">
              City *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter city"
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="stage" className="text-sm font-medium text-foreground">
              Stage *
            </Label>
            <Select
              id="stage"
              value={formData.stage}
              onChange={(e) => handleInputChange("stage", e.target.value)}
              className={errors.stage ? "border-red-500" : ""}
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

        {/* Optional Fields */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Contact Information (Optional)</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="website" className="text-sm font-medium text-foreground">
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contact@example.com"
                type="email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 9876543210"
                type="tel"
              />
            </div>
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500">{errors.submit}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Creating..." : "Create Startup"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
