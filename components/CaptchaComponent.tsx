"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Shield, AlertCircle } from "lucide-react"

interface CaptchaComponentProps {
  onCaptchaChange: (captchaId: string, captchaAnswer: string) => void
  error?: string
}

export default function CaptchaComponent({ onCaptchaChange, error }: CaptchaComponentProps) {
  const [captchaId, setCaptchaId] = useState("")
  const [captchaSvg, setCaptchaSvg] = useState("")
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  const loadCaptcha = async () => {
    setIsLoading(true)
    setFetchError("")
    try {
      const response = await fetch("http://localhost:5000/api/auth/captcha")
      if (!response.ok) {
        throw new Error("Failed to fetch CAPTCHA")
      }
      const data = await response.json()
      setCaptchaId(data.captchaId)
      setCaptchaSvg(data.captchaSvg)
      setCaptchaAnswer("")
      onCaptchaChange(data.captchaId, "")
    } catch (err) {
      // Set an internal error state instead of console.error to avoid the Next.js dev error overlay
      setFetchError("Could not connect to the authentication server. Please ensure the backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const handleAnswerChange = (answer: string) => {
    setCaptchaAnswer(answer)
    onCaptchaChange(captchaId, answer)
  }

  const handleRefresh = () => {
    loadCaptcha()
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="captcha" className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        Security Verification
      </Label>

      <div className="flex items-center gap-3 p-4 bg-background/50 border border-border/50 rounded-xl">
        <div className="flex-1">
          {captchaSvg ? (
            <div
              className="flex items-center justify-center bg-muted/50 rounded-lg p-2"
              dangerouslySetInnerHTML={{ __html: captchaSvg }}
            />
          ) : (
            <div className="flex items-center justify-center h-16 bg-muted/50 rounded-lg p-2 text-center">
              {isLoading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <span className={`text-xs ${fetchError ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {fetchError || "Loading CAPTCHA..."}
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          id="captcha"
          name="captcha"
          type="text"
          required
          value={captchaAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/70"
          placeholder="Enter the code above"
          disabled={isLoading}
        />

        {error && (
          <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Enter the characters you see in the image above
        </p>
      </div>
    </div>
  )
}
