import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  let browser
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })

    const context = await browser.newContext({
      viewport: { width: 1200, height: 1600 },
      deviceScaleFactor: 1,
      // Set up authentication for PDF generation
      storageState: {
        cookies: [
          {
            name: 'token',
            value: 'pdf-mode-token',
            domain: 'localhost',
            path: '/',
            httpOnly: false,
            secure: false,
            expires: Date.now() / 1000 + 3600,
            sameSite: 'Lax' as const,
          }
        ],
        origins: []
      }
    })

    const page = await context.newPage()

    // Navigate to the analytics page with pdf=true
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/dashboard/analytics?pdf=true`

    await page.goto(url, { waitUntil: 'networkidle' })

    // Wait for content to load and render
    await page.waitForTimeout(3000)

    // Generate PDF with professional settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '30px',
        right: '25px',
        bottom: '40px', // Extra space for footer
        left: '25px'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 8px; color: #666; width: 100%; text-align: center; padding: 5px 0;">
          <span>Innopulse Analytics Report</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 8px; color: #666; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 5px 20px;">
          <span>© 2025 Innopulse - India's Startup Ecosystem Platform</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    })

    // Close browser
    await browser.close()

    // Return PDF as downloadable response
    const filename = `innopulse-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('PDF generation error:', error)

    if (browser) {
      await browser.close()
    }

    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
