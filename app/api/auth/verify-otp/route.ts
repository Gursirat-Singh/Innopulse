import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/signup-verify
 * Step 2: Verify OTP and complete account creation
 */
export async function POST(req: NextRequest) {
  try {
    console.log("🔗 Connecting to database...");
    await connectToDatabase();
    console.log("✅ Database connected");

    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    console.log("🔍 Signup verification request for:", email);

    // Debug: Check total users in database
    const totalUsers = await User.countDocuments();
    console.log("📊 Total users in database:", totalUsers);

    // Debug: Check users with OTP data
    const usersWithOtp = await User.find({ otp: { $exists: true } }).select('email otpExpiry isEmailVerified');
    console.log("🔑 Users with OTP data:", usersWithOtp.map(u => ({
      email: u.email,
      otpExpiry: u.otpExpiry,
      isEmailVerified: u.isEmailVerified
    })));

    // Find user with valid OTP (for both signup and forgot password)
    const user = await User.findOne({
      email: email.toLowerCase(),
      otpExpiry: { $gt: new Date() },
      otp: { $exists: true, $ne: null }
    });

    // Also try finding any user with this email
    const anyUserWithEmail = await User.findOne({ email: email.toLowerCase() });
    console.log("🔍 Any user with this email exists:", !!anyUserWithEmail);
    if (anyUserWithEmail) {
      console.log("👤 User details:", {
        id: anyUserWithEmail._id,
        email: anyUserWithEmail.email,
        isEmailVerified: anyUserWithEmail.isEmailVerified,
        hasOtp: !!anyUserWithEmail.otp,
        otpExpiry: anyUserWithEmail.otpExpiry
      });
    }

    console.log("👤 Found user:", !!user);
    console.log("📧 User email verified status:", user?.isEmailVerified);
    console.log("⏰ OTP expiry:", user?.otpExpiry);
    console.log("🔢 Current time:", new Date());
    console.log("🔑 Has OTP:", !!user?.otp);

    if (!user || !user.otp) {
      console.log("❌ No user found or no OTP present");
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Verify OTP securely
    const isValidOTP = await bcrypt.compare(otp, user.otp);
    console.log("🔍 OTP comparison result:", isValidOTP);
    console.log("📝 Provided OTP:", otp);
    console.log("🔐 Stored OTP hash:", user.otp);

    if (!isValidOTP) {
      console.log("❌ OTP verification failed");
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Clear OTP data to prevent reuse (for both cases)
    user.otp = undefined;
    user.otpExpiry = undefined;

    // Handle different verification scenarios
    if (!user.isEmailVerified) {
      // Signup verification - complete account creation
      user.isEmailVerified = true;
      user.isOtpVerified = true;
      console.log("✅ Account created and email verified successfully");

      await user.save();

      return NextResponse.json({
        message: "Account created successfully! You can now log in.",
        verified: true
      });
    } else {
      // Forgot password verification - just mark as verified
      user.isOtpVerified = true;
      console.log("✅ OTP verified for password reset successfully");

      await user.save();

      return NextResponse.json({
        message: "OTP verified successfully!",
        verified: true
      });
    }

  } catch (error) {
    console.error("❌ Signup verification error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong during account creation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
