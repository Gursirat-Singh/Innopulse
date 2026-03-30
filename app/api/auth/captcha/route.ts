import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function generateCaptchaSVG(text: string) {
  const width = 200;
  const height = 60;
  const fontSize = 24;
  const charSpacing = 28;

  const colors = ['#1a365d', '#2d3748', '#4a5568', '#2b6cb0', '#3182ce'];
  const bgColor = '#f7fafc';

  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svgContent += `<rect width="100%" height="100%" fill="${bgColor}"/>`;

  for (let i = 0; i < text.length; i++) {
    const baseX = 25 + (i * charSpacing);
    const baseY = 40;

    const x = baseX + (Math.random() * 6 - 3);
    const y = baseY + (Math.random() * 4 - 2);
    const rotation = Math.random() * 10 - 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    svgContent += `<text x="${x}" y="${y}" font-family="monospace" font-size="${fontSize}" font-weight="bold" fill="${color}" transform="rotate(${rotation} ${x} ${y})">${text[i]}</text>`;
  }

  for (let i = 0; i < 3; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>`;
  }

  svgContent += '</svg>';
  return svgContent;
}

export async function GET() {
  try {
    // Validate JWT_SECRET is configured
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("FATAL: JWT_SECRET is not configured");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Wrap the captcha inside a stateless JWT so Serverless can verify it anywhere without Memory Stores
    const captchaId = jwt.sign(
      { text: text.toLowerCase() },
      secret,
      { expiresIn: '5m' }
    );

    const svg = generateCaptchaSVG(text);

    return NextResponse.json({
      captchaId,
      captchaSvg: svg
    });
  } catch (error) {
    console.error("CAPTCHA Generation Error:", error);
    return NextResponse.json({ message: "Failed to generate CAPTCHA" }, { status: 500 });
  }
}
