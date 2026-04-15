import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const router = express.Router();

router.get('/generate-pdf/:startupId', async (req, res) => {
  let browser = null;
  try {
    const { startupId } = req.params;

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1 });
    const url = `https://innopulse-puce.vercel.app/report/${startupId}`;

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
    
    // Wait 2 seconds for JS rendering
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });

    await browser.close();
    browser = null;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="innopulse-report.pdf"');
    res.send(Buffer.from(pdfBuffer));

  } catch (err) {
    if (browser) {
      await browser.close();
    }
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
