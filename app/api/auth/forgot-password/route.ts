import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/lib/email";
import { rateLimit, getIP } from "@/lib/rateLimiter";

/**
 * POST /api/auth/forgot-password
 */
export async function POST(req: NextRequest) {
  try {
    // RATE LIMIT: max 3 requests per 15 minutes per IP
    const ip = getIP(req);
    const rl = await rateLimit(`forgot_pw_${ip}`, 3, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { message: "Too many password reset requests. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Reset": rl.reset.toString() } }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const email = body?.email?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Forgot password request for:", email);

    // Find user
    const user = await User.findOne({ email });

    // Always return success (security: prevent email enumeration)
    if (!user) {
      console.log("⚠️ No user found, returning generic success");
      return NextResponse.json({
        message:
          "If an account with that email exists, an OTP has been sent to your email.",
      });
    }

    // Check rate limiting - prevent multiple OTP requests within 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    if (user.otpExpiry && user.otpExpiry > oneMinuteAgo) {
      console.log("⚠️ Rate limited: OTP requested too recently");
      return NextResponse.json({
        message:
          "If an account with that email exists, an OTP has been sent to your email.",
      });
    }

    // Generate secure OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Hash OTP before storing
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log("🔑 OTP generated, hashed and saved");

    // Send OTP email
    await sendOTPEmail(user.email, otp);

    console.log("✅ OTP email sent successfully");

    return NextResponse.json({
      message:
        "If an account with that email exists, an OTP has been sent to your email.",
    });
  } catch (error: any) {
    console.error("❌ Forgot password API error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while sending OTP",
        error: error.message,
      },
      { status: 500 }
    );
  }
}