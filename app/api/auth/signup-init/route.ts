import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/lib/email";

/**
 * POST /api/auth/signup-init
 * Step 1: Generate OTP for email verification during signup
 */
export async function POST(req: NextRequest) {
  try {
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

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // If user exists but not verified, allow re-initiation (cleanup old data)
    if (existingUser && !existingUser.isEmailVerified) {
      // Clear any existing OTP data
      existingUser.otp = undefined;
      existingUser.otpExpiry = undefined;
      existingUser.isOtpVerified = false;
      await existingUser.save();
    }

    // Rate limiting: prevent multiple OTP requests within 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    if (existingUser && existingUser.otpExpiry && existingUser.otpExpiry > oneMinuteAgo) {
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

    // Store temporary signup data
    if (existingUser) {
      // Update existing unverified user
      existingUser.password = await bcrypt.hash(password, 10); // Store hashed password temporarily
      existingUser.otp = hashedOTP;
      existingUser.otpExpiry = otpExpiry;
      existingUser.isOtpVerified = false;
      await existingUser.save();
      console.log("🔄 Updated existing user with OTP data");
    } else {
      // Create temporary user record (not verified yet)
      const newUser = await User.create({
        email,
        password: await bcrypt.hash(password, 10), // Store hashed password temporarily
        otp: hashedOTP,
        otpExpiry,
        isEmailVerified: false,
        isOtpVerified: false,
      });
      console.log("🆕 Created new user with OTP data:", newUser._id);
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
