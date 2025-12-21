import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

    // Find user with valid OTP and not yet verified
    const user = await User.findOne({
      email: email.toLowerCase(),
      otpExpiry: { $gt: new Date() },
      isEmailVerified: false
    });

    console.log("👤 Found user with exact criteria:", !!user);

    // If not found with exact criteria, try more lenient search
    let targetUser = user;
    if (!targetUser) {
      console.log("🔄 User not found with exact criteria, trying broader search...");
      const usersWithEmail = await User.find({ email: email.toLowerCase() });
      console.log("📊 Users found with this email:", usersWithEmail.length);

      for (const u of usersWithEmail) {
        console.log("👤 User details:", {
          id: u._id,
          email: u.email,
          isEmailVerified: u.isEmailVerified,
          hasOtp: !!u.otp,
          otpExpiry: u.otpExpiry,
          currentTime: new Date(),
          isExpired: u.otpExpiry ? u.otpExpiry < new Date() : true
        });

        // Check if this user has a valid OTP
        if (u.otp && u.otpExpiry && u.otpExpiry > new Date() && !u.isEmailVerified) {
          targetUser = u;
          console.log("✅ Found valid user for OTP verification");
          break;
        }
      }
    }

    if (!targetUser || !targetUser.otp) {
      console.log("❌ No valid user found for OTP verification");
      return NextResponse.json(
        { message: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP securely
    const isValidOTP = await bcrypt.compare(otp, targetUser.otp);
    console.log("🔍 OTP comparison result:", isValidOTP);
    console.log("📝 Provided OTP:", `"${otp}"`);
    console.log("🔐 Stored OTP hash exists:", !!targetUser.otp);

    if (!isValidOTP) {
      console.log("❌ OTP verification failed - hash comparison failed");
      return NextResponse.json(
        { message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    console.log("✅ OTP verification successful");

    // Complete account creation
    targetUser.isEmailVerified = true;
    targetUser.isOtpVerified = true;
    // Clear OTP data to prevent reuse
    targetUser.otp = undefined;
    targetUser.otpExpiry = undefined;

    await targetUser.save();

    console.log("✅ Account created and email verified successfully");

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { id: targetUser._id, role: targetUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    console.log("🔑 JWT token generated for automatic login");

    return NextResponse.json({
      message: "Account created successfully! Logging you in...",
      verified: true,
      token: token
    });

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
