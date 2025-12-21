import crypto from "crypto";
import { captchaStore } from "../lib/captcha-store.js";

/**
 * Generate a random alphanumeric CAPTCHA string
 */
export function generateCaptchaText(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a unique CAPTCHA ID
 */
export function generateCaptchaId() {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Create and store a new CAPTCHA
 */
export function createCaptcha() {
  const id = generateCaptchaId()
  const text = generateCaptchaText()
  const hashedText = crypto.createHash('sha256').update(text).digest('hex')
  const expiresAt = Date.now() + (5 * 60 * 1000) // 5 minutes

  captchaStore.set(id, {
    text,
    hashedText,
    expiresAt
  })

  // Generate SVG for display
  const svg = generateCaptchaSVG(text)

  return { id, text, svg }
}

/**
 * Generate SVG representation of CAPTCHA text
 */
function generateCaptchaSVG(text) {
  const width = 200
  const height = 60
  const fontSize = 24
  const charSpacing = 28

  // Use consistent colors for better readability
  const colors = ['#1a365d', '#2d3748', '#4a5568', '#2b6cb0', '#3182ce']
  const bgColor = '#f7fafc'

  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`
  svgContent += `<rect width="100%" height="100%" fill="${bgColor}"/>`

  // Add text with minimal distortion for better readability
  for (let i = 0; i < text.length; i++) {
    const baseX = 25 + (i * charSpacing)
    const baseY = 40

    // Add slight random variation but keep it readable
    const x = baseX + (Math.random() * 6 - 3) // ±3px variation
    const y = baseY + (Math.random() * 4 - 2) // ±2px variation
    const rotation = Math.random() * 10 - 5 // ±5 degrees
    const color = colors[Math.floor(Math.random() * colors.length)]

    svgContent += `<text x="${x}" y="${y}" font-family="monospace" font-size="${fontSize}" font-weight="bold" fill="${color}" transform="rotate(${rotation} ${x} ${y})">${text[i]}</text>`
  }

  // Add subtle noise lines (reduced for better readability)
  for (let i = 0; i < 3; i++) {
    const x1 = Math.random() * width
    const y1 = Math.random() * height
    const x2 = Math.random() * width
    const y2 = Math.random() * height
    svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>`
  }

  svgContent += '</svg>'

  return svgContent
}

/**
 * Verify a CAPTCHA answer
 */
export function verifyCaptcha(id, answer) {
  const entry = captchaStore.get(id)

  if (!entry) {
    return false
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    captchaStore.delete(id)
    return false
  }

  // Verify answer (case-insensitive)
  const isValid = entry.text.toLowerCase() === answer.toLowerCase()

  // Delete CAPTCHA after verification (single-use)
  captchaStore.delete(id)

  return isValid
}

/**
 * Get CAPTCHA SVG by ID
 */
export function getCaptchaSvg(id) {
  const entry = captchaStore.get(id)

  if (!entry || Date.now() > entry.expiresAt) {
    if (entry) captchaStore.delete(id)
    return null
  }

  return generateCaptchaSVG(entry.text)
}

/**
 * Clean up expired CAPTCHAs (run periodically)
 */
export function cleanupExpiredCaptchas() {
  const now = Date.now()
  for (const [id, entry] of captchaStore.entries()) {
    if (now > entry.expiresAt) {
      captchaStore.delete(id)
    }
  }
}

// Clean up expired CAPTCHAs every minute
setInterval(cleanupExpiredCaptchas, 60 * 1000)
