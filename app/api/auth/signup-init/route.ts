import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/lib/email";
import { rateLimit, getIP } from "@/lib/rateLimiter";

/**
 * POST /api/auth/signup-init
 * Step 1: Generate OTP for email verification during signup
 */
export async function POST(req: NextRequest) {
  try {
    // RATE LIMIT: max 3 requests per 15 minutes per IP
    const ip = getIP(req);
    const rl = await rateLimit(`signup_init_${ip}`, 3, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { message: "Too many signup requests. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Reset": rl.reset.toString() } }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const email = body?.email?.toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    console.log("🔍 Signup initiation request for:", email);

    // Check if user already exists in main collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if there's an existing pending registration
    const existingPending = await PendingUser.findOne({ email });

    // Rate limiting: prevent multiple OTP requests within 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    if (existingPending && existingPending.otpExpiry && existingPending.otpExpiry > oneMinuteAgo) {
      console.log("⚠️ Rate limited: OTP requested too recently");
      return NextResponse.json({
        message: "Please wait before requesting another verification code",
      });
    }

    // Generate secure OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for signup

    // Hash OTP before storing
    const hashedOTP = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store temporary signup data
    if (existingPending) {
      // Update existing pending user
      existingPending.password = hashedPassword; 
      existingPending.otp = hashedOTP;
      existingPending.otpExpiry = otpExpiry;
      existingPending.createdAt = new Date(); // Refresh TTL
      await existingPending.save();
      console.log("🔄 Updated existing pending user with OTP data");
    } else {
      // Create pending user record
      const newPendingUser = await PendingUser.create({
        email,
        password: hashedPassword,
        otp: hashedOTP,
        otpExpiry,
      });
      console.log("🆕 Created new pending user with OTP data:", newPendingUser._id);
    }

    console.log("🔑 OTP generated, hashed and stored for signup");
    console.log("📧 Email:", email);
    console.log("⏰ OTP Expiry:", otpExpiry);
    console.log("🔢 Raw OTP (for testing):", otp);

    // Send OTP email
    await sendOTPEmail(email, otp);

    console.log("✅ Signup OTP email sent successfully");

    return NextResponse.json({
      message: "Verification code sent to your email",
      email: email
    });

  } catch (error) {
    console.error("❌ Signup initiation API error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while sending verification code",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
