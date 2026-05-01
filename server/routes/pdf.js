import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('isProduction:', isProduction);
router.get('/generate-pdf/:startupId', async (req, res) => {
  let browser = null;
  try {
    const { startupId } = req.params;

    browser = await puppeteer.launch({
      args: isProduction ? [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ] : [],
      executablePath: isProduction
        ? await chromium.executablePath()
        : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1800, deviceScaleFactor: 1 });
    await page.setExtraHTTPHeaders({ 'x-pdf-mode': 'true' });

    const baseUrl = process.env.CLIENT_URL || 'https://innopulse-puce.vercel.app';
    const url = `${baseUrl}/dashboard/startups/${startupId}?pdf=true`;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await page.setCookie({
        name: 'token',
        value: token,
        domain: new URL(baseUrl).hostname,
        path: '/',
      });
    }

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#report-ready', { timeout: 30000 }).catch(() => console.log('report-ready selector timed out'));
    await new Promise(resolve => setTimeout(resolve, 3000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
    });

    await browser.close();
    browser = null;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="innopulse-report.pdf"');
    res.send(Buffer.from(pdfBuffer));

  } catch (err) {
    if (browser) await browser.close();
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;