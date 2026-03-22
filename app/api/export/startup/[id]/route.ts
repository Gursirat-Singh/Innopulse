import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || id === 'undefined' || id === 'null') {
    return NextResponse.json({ error: 'Startup ID is required' }, { status: 400 })
  }

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
      viewport: { width: 1200, height: 1600 }, // Increased height for better chart rendering
      deviceScaleFactor: 1,
      // Set up authentication for PDF generation
      storageState: {
        cookies: [
          {
            name: 'token',
            value: 'pdf-mode-token', // Dummy token for PDF mode
            domain: 'localhost',
            path: '/',
            httpOnly: false,
            secure: false,
            expires: Date.now() / 1000 + 3600, // 1 hour from now
            sameSite: 'Lax' as const,
          }
        ],
        origins: []
      }
    })

    const page = await context.newPage()

    // Navigate to the dashboard page with pdf=true
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/dashboard/startups/${id}?pdf=true`

    await page.goto(url, { waitUntil: 'networkidle' })

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Generate PDF with professional footer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '25px',
        right: '20px',
        bottom: '35px', // Extra space for footer
        left: '20px'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 8px; color: #666; width: 100%; text-align: center; padding: 5px 0;">
          <span>Innopulse Startup Analytics Report</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 8px; color: #666; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 5px 20px;">
          <span>© 2026 Innopulse - India's Startup Ecosystem Platform</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    })

    // Close browser
    await browser.close()

    // Return PDF as downloadable response
    const filename = `startup-${id}-analytics.pdf`

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
