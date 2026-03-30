import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    JWT_SECRET: !!process.env.JWT_SECRET,
    MONGO_URI: !!process.env.MONGO_URI,
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
  };

  const allConfigured = Object.values(envStatus).every(v => v === true);

  if (!allConfigured) {
    return NextResponse.json({
      status: "Configuration Error",
      details: "One or more required environment variables are missing in this environment.",
      environment: process.env.NODE_ENV,
      checks: envStatus
    }, { status: 500 });
  }

  return NextResponse.json({
    status: "Healthy",
    message: "All critical serverless environment variables are correctly configured.",
    checks: envStatus
  });
}
