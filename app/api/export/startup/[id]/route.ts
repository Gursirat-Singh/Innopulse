import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Startup from '@/server/models/startup'
import { formatIndianCurrency, formatIndianNumber } from '@/lib/utils'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || id === 'undefined' || id === 'null') {
    return NextResponse.json({ error: 'Startup ID is required' }, { status: 400 })
  }

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
    const startup = await Startup.findById(id).lean()

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      )
    }

    // 2. Benchmarking queries
    const peers = await Startup.find({ sector: startup.sector, status: 'approved' }).lean()
    
    // Calculate Percentile
    peers.sort((a: any, b: any) => (b.employees || 0) - (a.employees || 0))
    const empRank = peers.findIndex((p: any) => p._id.toString() === startup._id.toString()) + 1
    const empPercentile = Math.max(1, Math.ceil((empRank / Math.max(peers.length, 1)) * 100))

    // Define top peers for Benchmark Table
    peers.sort((a: any, b: any) => (b.funding || 0) - (a.funding || 0))
    const topCompetitors = peers.slice(0, 5)
    // Make sure current startup is in the list if not in top 5
    if (!topCompetitors.find((c: any) => c._id.toString() === startup._id.toString())) {
      topCompetitors.pop();
      topCompetitors.push(startup);
      topCompetitors.sort((a: any, b: any) => (b.funding || 0) - (a.funding || 0))
    }

    // Construct insight
    let insightString = ""
    if (peers.length > 1) {
      insightString = `${startup.name} ranks in the top ${empPercentile}% of ${startup.sector} startups by team size tracked on InnoPulse. With ${formatIndianCurrency(startup.funding)} in total funding and ${formatIndianNumber(startup.employees)} employees across operations, it stands as a significant ${startup.stage.toLowerCase()}-stage player driving growth.`
    } else {
      insightString = `${startup.name} is currently the central tracked startup operating within the ${startup.sector} sector on InnoPulse. Operating with ${formatIndianCurrency(startup.funding)} in funding and an active team of ${formatIndianNumber(startup.employees)} employees, it occupies a primary ${startup.stage.toLowerCase()}-stage market position.`
    }

    // Mock Chart Data logic
    const safeFunding = Math.max(startup.funding || 0, 1000000)
    const fundingData = [
      { round: 'Seed', amount: safeFunding * 0.15, date: '2022-Q3' },
      { round: 'Series A', amount: safeFunding * 0.35, date: '2023-Q4' },
      { round: 'Series B', amount: safeFunding * 0.50, date: '2024-Q2' },
    ]
    const maxFund = Math.max(...fundingData.map(d => d.amount), 1)

    const safeEmp = Math.max(startup.employees || 0, 10)
    const teamData = [
      { year: '2022', employees: Math.floor(safeEmp * 0.25) },
      { year: '2023', employees: Math.floor(safeEmp * 0.60) },
      { year: '2024', employees: safeEmp },
    ]
    const maxTeam = Math.max(...teamData.map(d => d.employees), 1)

    // 3. Build HTML Template
    const reportDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    const profileUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://innopulse.in'}/dashboard/startups/${startup._id}`

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; color: #111827; margin: 0; padding: 0; line-height: 1.5; }
        .page { padding: 20px; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px; }
        .brand-col { display: flex; flex-direction: column; }
        .logo-text { font-size: 24px; font-weight: 900; color: #111827; letter-spacing: -0.05em; line-height: 1; }
        .logo-sub { font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-top: 4px; }
        .doc-type { font-size: 11px; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; }
        
        .accent-bar { width: 100%; height: 6px; background: linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%); position: fixed; top: 0; left: 0; }
        
        .tagline-container { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .small-badge { display: inline-flex; align-items: center; padding: 4px 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px; }
        .badge-sector { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; }
        .badge-stage { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
        
        .startup-name { font-size: 52px; font-weight: 900; line-height: 1; margin: 0 0 15px 0; letter-spacing: -0.03em; color: #111827; }
        
        .insight-box { margin-bottom: 30px; padding: 18px; border-left: 4px solid #3B82F6; background: #F8FAFC; border-radius: 0 8px 8px 0; }
        .insight-text { font-size: 14px; color: #0F172A; font-weight: 500; leading-trim: both; text-edge: cap; }
        
        .kpi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 35px; }
        .kpi-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; }
        .kpi-label { font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 5px; }
        .kpi-value { font-size: 20px; font-weight: 800; color: #0F172A; }
        .kpi-val-green { color: #059669; }
        
        .section-title { font-size: 18px; font-weight: 800; color: #111827; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #E2E8F0; }
        
        .bench-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
        .bench-table th { text-align: left; background: #F1F5F9; color: #475569; font-weight: 700; padding: 10px; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; border-bottom: 2px solid #CBD5E1; }
        .bench-table td { padding: 12px 10px; border-bottom: 1px solid #E2E8F0; color: #334155; font-weight: 500; }
        .bench-row.highlight { background: #F0F9FF; }
        .bench-row.highlight td { color: #0284C7; font-weight: 700; }
        
        /* Native CSS Charts */
        .chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .chart-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; }
        .chart-title { font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 20px; }
        
        .chart-wrapper { display: flex; align-items: flex-end; justify-content: space-around; height: 180px; padding-top: 20px; border-bottom: 1px solid #CBD5E1; margin-bottom: 10px; }
        .bar-col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; width: 40px; text-align: center; }
        .bar-val { font-size: 10px; font-weight: 700; color: #64748B; margin-bottom: 5px; }
        .bar-plot { width: 30px; border-radius: 4px 4px 0 0; transition: height 0.3s ease; }
        .plot-fund { background: linear-gradient(180deg, #10B981 0%, #059669 100%); }
        .plot-team { background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%); }
        .bar-lbl { font-size: 10px; font-weight: 600; color: #475569; margin-top: 8px; line-height: 1.2; }
        
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 20px; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; }
        .contact-item { font-size: 12px; }
        .c-label { color: #64748B; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
        .c-value { color: #0F172A; font-weight: 600; }
        
      </style>
    </head>
    <body>
      <div class="accent-bar"></div>
      
      <!-- PAGE 1: Executive Overview & Benchmarking -->
      <div class="page">
        <div class="header">
          <div class="brand-col">
            <div class="logo-text">InnoPulse</div>
            <div class="logo-sub">Ecosystem Intelligence</div>
          </div>
          <div class="doc-type">Startup Analytics Report</div>
        </div>

        <div>
          <div class="tagline-container">
            <span class="small-badge badge-sector">${startup.sector}</span>
            <span class="small-badge badge-stage">${startup.stage}</span>
          </div>
          <h1 class="startup-name">${startup.name}</h1>
          
          <div class="insight-box">
            <div class="insight-text">${insightString}</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Total Funding</div>
            <div class="kpi-value kpi-val-green">${formatIndianCurrency(startup.funding)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Team Size</div>
            <div class="kpi-value">${formatIndianNumber(startup.employees)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Headquarters</div>
            <div class="kpi-value" style="font-size:16px;">${startup.city}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Revenue Estimate</div>
            <div class="kpi-value" style="font-size:16px;">${startup.revenueRange || 'Pre-revenue'}</div>
          </div>
        </div>

        <div class="section-title">Sector Benchmarking (${startup.sector})</div>
        <table class="bench-table">
          <thead>
            <tr>
              <th style="width: 50px;">Rank</th>
              <th>Company Name</th>
              <th>Stage</th>
              <th>Funding Raised</th>
              <th>Team Size</th>
            </tr>
          </thead>
          <tbody>
            ${topCompetitors.map((c: any, i: number) => {
              const isTarget = c._id.toString() === startup._id.toString();
              return `
                <tr class="bench-row ${isTarget ? 'highlight' : ''}">
                  <td style="font-weight: ${isTarget ? '800' : '500'};">#${i + 1}</td>
                  <td>${c.name} ${isTarget ? '(Subject)' : ''}</td>
                  <td>${c.stage}</td>
                  <td style="color: #059669;">${formatIndianCurrency(c.funding)}</td>
                  <td>${formatIndianNumber(c.employees)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div style="page-break-before: always;"></div>

      <!-- PAGE 2: Actionable Data & Footer -->
      <div class="page">
        <div class="header">
          <div class="brand-col">
            <div class="logo-text">InnoPulse</div>
            <div class="logo-sub">Ecosystem Intelligence</div>
          </div>
          <div class="doc-type">Strategic Metrics</div>
        </div>

        <div class="section-title" style="margin-top:0;">Growth & Financing Analysis</div>
        
        <div class="chart-row">
          <!-- Funding Chart -->
          <div class="chart-card">
            <div class="chart-title">Capital Velocity (Simulated)</div>
            <div class="chart-wrapper">
              ${fundingData.map(d => {
                const heightPercentage = Math.max(5, (d.amount / maxFund) * 100);
                return `
                <div class="bar-col">
                  <div class="bar-val">${(d.amount / 10000000).toFixed(1)}Cr</div>
                  <div class="bar-plot plot-fund" style="height: ${heightPercentage}%" title="${d.round}"></div>
                  <div class="bar-lbl">${d.round}<br/><span style="color:#94A3B8;font-size:8px;">${d.date}</span></div>
                </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Team Chart -->
          <div class="chart-card">
            <div class="chart-title">Team Expansion Trajectory</div>
            <div class="chart-wrapper">
              ${teamData.map(d => {
                const heightPercentage = Math.max(5, (d.employees / maxTeam) * 100);
                return `
                <div class="bar-col">
                  <div class="bar-val">${formatIndianNumber(d.employees)}</div>
                  <div class="bar-plot plot-team" style="height: ${heightPercentage}%; width:40px;"></div>
                  <div class="bar-lbl">${d.year}</div>
                </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <div class="section-title">Directory Intelligence</div>
        <div class="contact-grid">
          <div class="contact-item">
            <div class="c-label">Website Surface</div>
            <div class="c-value" style="color: #2563EB;">${startup.website || 'Not provided'}</div>
          </div>
          <div class="contact-item">
            <div class="c-label">Public Email Line</div>
            <div class="c-value">${startup.email || 'Not provided'}</div>
          </div>
          <div class="contact-item">
            <div class="c-label">Primary Desk</div>
            <div class="c-value">${startup.phone || 'Not provided'}</div>
          </div>
        </div>

      </div>
    </body>
    </html>
    `

    // 4. Launch Puppeteer (dual-mode: local Chrome for dev, @sparticuz/chromium for prod)
    const isDev = process.env.NODE_ENV === 'development'
    
    browser = await puppeteer.launch({
      args: isDev
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : [
            ...chromium.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process',
          ],
      executablePath: isDev
        ? (process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
        : await chromium.executablePath(),
      headless: isDev ? true : ('shell' as const),
    })

    const page = await browser.newPage()
    
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await new Promise(resolve => setTimeout(resolve, 2000))

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '0',
        bottom: '50px',
        left: '0'
      },
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="font-size: 8px; color: #9CA3AF; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 40px; font-family: sans-serif;">
          <span>Report Generated on ${reportDate} via <span style="color:#3B82F6">${profileUrl}</span></span>
          <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>
      `,
    })

    await browser.close()

    const filename = `startup-${startup.name.replace(/\s+/g, '_')}-benchmark-report.pdf`

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
