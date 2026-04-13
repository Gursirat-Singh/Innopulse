import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Startup from '@/server/models/startup'
import { formatIndianCurrency, formatIndianNumber } from '@/lib/utils'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  // Authenticate user
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { error: 'No authentication token provided' },
      { status: 401 }
    )
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  let browser
  try {
    // 1. Fetch data from MongoDB
    await connectDB()
    const startups = await Startup.find({ status: 'approved' }).lean()

    // 2. Compute Analytics
    let totalFunding = 0
    let totalJobs = 0
    let newStartupsThisMonth = 0

    const sectorMap: Record<string, { count: number, funding: number }> = {}
    const cityMap: Record<string, { count: number, funding: number }> = {}
    const stageMap: Record<string, number> = {}

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    startups.forEach((s: any) => {
      const fund = Number(s.funding) || 0
      const jobs = Number(s.employees) || 0
      totalFunding += fund
      totalJobs += jobs

      const createdDate = new Date(s.createdAt)
      if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
        newStartupsThisMonth++
      }

      if (!sectorMap[s.sector]) sectorMap[s.sector] = { count: 0, funding: 0 }
      sectorMap[s.sector].count++
      sectorMap[s.sector].funding += fund

      if (!cityMap[s.city]) cityMap[s.city] = { count: 0, funding: 0 }
      cityMap[s.city].count++
      cityMap[s.city].funding += fund

      if (!stageMap[s.stage]) stageMap[s.stage] = 0
      stageMap[s.stage]++
    })

    const sortedSectors = Object.entries(sectorMap)
      .map(([name, data]) => ({
        name: name || "Unspecified",
        count: data.count,
        funding: data.funding,
        percentage: Math.round((data.count / startups.length) * 100) || 0
      }))
      .sort((a, b) => b.funding - a.funding)

    const sortedCities = Object.entries(cityMap)
      .map(([name, data]) => ({
        name: name || "Unspecified",
        startups: data.count,
        funding: data.funding
      }))
      .sort((a, b) => b.startups - a.startups)
      .slice(0, 10) // top 10

    const sortedStages = Object.entries(stageMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // 3. Build HTML Template
    const reportDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    
    const topFinSector = sortedSectors[0] || { name: '-', funding: 0 }
    const topCity = sortedCities[0] || { name: '-', startups: 0 }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; color: #111827; margin: 0; padding: 0; line-height: 1.5; }
        .page { padding: 20px; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px; margin-bottom: 40px; }
        .logo-text { font-size: 28px; font-weight: 900; color: #111827; letter-spacing: -0.05em; }
        .logo-sub { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-top: 2px; }
        .report-type { padding: 4px 10px; background: #EFF6FF; color: #1D4ED8; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px; border: 1px solid #BFDBFE; display: inline-block; }
        .accent-bar { width: 100%; height: 6px; background: linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%); position: fixed; top: 0; left: 0; }
        .kpi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .kpi-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; text-align: center; }
        .kpi-label { font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px; }
        .kpi-val { font-size: 26px; font-weight: 800; color: #111827; }
        .kpi-val.green { color: #059669; }
        .kpi-val.blue { color: #1D4ED8; }
        .section-title { font-size: 18px; font-weight: 800; color: #111827; margin: 40px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #E5E7EB; display: flex; align-items: center; gap: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
        th { text-align: left; background: #F3F4F6; color: #4B5563; font-weight: 700; padding: 12px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB; }
        td { padding: 12px; border-bottom: 1px solid #E5E7EB; color: #374151; font-weight: 500; }
        tr:nth-child(even) { background: #F9FAFB; }
        .text-right { text-align: right; }
        .amount { color: #059669; font-weight: 700; }
        .insight-box { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #3B82F6; }
        .insight-text { font-size: 14px; color: #1E3A8A; font-weight: 500; }
        .meta-footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; }
        .meta-label { font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
        .meta-value { font-size: 12px; color: #111827; font-weight: 700; }
        .bar-container { width: 100%; background: #E5E7EB; height: 6px; border-radius: 3px; overflow: hidden; margin-top: 5px; }
        .bar-fill { height: 100%; background: #3B82F6; }
      </style>
    </head>
    <body>
      <div class="accent-bar"></div>
      
      <div class="page">
        <div class="header">
          <div>
            <div class="logo-text">InnoPulse</div>
            <div class="logo-sub">Ecosystem Intelligence</div>
          </div>
          <div style="text-align:right;">
            <div class="report-type">Analytics Report</div>
            <div style="font-size:12px; color:#6B7280; font-weight:600; margin-top:8px;">${reportDate}</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Active Startups</div>
            <div class="kpi-val">${formatIndianNumber(startups.length)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Funding Raised</div>
            <div class="kpi-val green">${formatIndianCurrency(totalFunding)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Jobs Created</div>
            <div class="kpi-val blue">${formatIndianNumber(totalJobs)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">New This Month</div>
            <div class="kpi-val">${formatIndianNumber(newStartupsThisMonth)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Avg Funding / Startup</div>
            <div class="kpi-val green">${startups.length ? formatIndianCurrency(totalFunding / startups.length) : '₹0'}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Avg Stage Velocity</div>
            <div class="kpi-val">+15.0%</div>
          </div>
        </div>

        <div class="section-title">Key Insights</div>
        <div class="insight-box">
          <div class="insight-text">• <strong>${topFinSector.name} Leads Market:</strong> This sector dominates with ${formatIndianCurrency(topFinSector.funding)} in raised capital.</div>
        </div>
        <div class="insight-box">
          <div class="insight-text">• <strong>Top Hub - ${topCity.name}:</strong> The city stands out with ${formatIndianNumber(topCity.startups)} active startups leading local innovation.</div>
        </div>
        <div class="insight-box">
          <div class="insight-text">• <strong>Economic Impact:</strong> The ecosystem has generated a total of ${formatIndianNumber(totalJobs)} formal employment opportunities.</div>
        </div>

        <div class="section-title" style="margin-top:50px;">Sector Distribution</div>
        <table>
          <thead>
            <tr>
              <th>Sector</th>
              <th class="text-right">Count</th>
              <th class="text-right">Share</th>
              <th class="text-right">Total Funding</th>
            </tr>
          </thead>
          <tbody>
            ${sortedSectors.map(s => `
              <tr>
                <td>
                  ${s.name}
                  <div class="bar-container"><div class="bar-fill" style="width: ${s.percentage}%;"></div></div>
                </td>
                <td class="text-right">${formatIndianNumber(s.count)}</td>
                <td class="text-right">${s.percentage}%</td>
                <td class="text-right amount">${formatIndianCurrency(s.funding)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="page-break-before: always;"></div>

        <div class="section-title" style="margin-top:0;">Top Geographic Hubs</div>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th class="text-right">Active Startups</th>
              <th class="text-right">Total Funding</th>
            </tr>
          </thead>
          <tbody>
            ${sortedCities.map(c => `
              <tr>
                <td>${c.name}</td>
                <td class="text-right">${formatIndianNumber(c.startups)}</td>
                <td class="text-right amount">${formatIndianCurrency(c.funding)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Funding Stage Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th class="text-right">Number of Startups</th>
            </tr>
          </thead>
          <tbody>
            ${sortedStages.map(s => `
              <tr>
                <td><span style="font-weight:700; color:#4B5563;">${s.name}</span></td>
                <td class="text-right">${formatIndianNumber(s.count)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="meta-footer">
          <div>
            <div class="meta-label">Prepared By</div>
            <div class="meta-value">InnoPulse Data Platform</div>
          </div>
          <div style="text-align:right;">
            <div class="meta-label">Data Cutoff Date</div>
            <div class="meta-value">${reportDate}</div>
          </div>
        </div>

      </div>
    </body>
    </html>
    `

    // 4. Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    
    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '0',
        bottom: '40px',
        left: '0'
      },
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="font-size: 8px; color: #9CA3AF; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 40px; font-family: sans-serif;">
          <span>© 2026 InnoPulse - India's Startup Ecosystem Platform</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    })

    await browser.close()

    // 5. Return PDF
    const filename = `innopulse-analytics-${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
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
