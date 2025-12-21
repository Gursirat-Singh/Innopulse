import crypto from "crypto";

export interface CaptchaEntry {
  text: string
  hashedText: string
  expiresAt: number
}

// Shared CAPTCHA store for both server and client
export const captchaStore = new Map<string, CaptchaEntry>()
