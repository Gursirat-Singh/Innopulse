import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
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

    // Debug: Check total pending users in database
    const totalPendingUsers = await PendingUser.countDocuments();
    console.log("📊 Total pending users in database:", totalPendingUsers);

    // Find pending user with valid OTP and not yet verified
    const targetPendingUser = await PendingUser.findOne({
      email: email.toLowerCase(),
      otpExpiry: { $gt: new Date() }
    });

    console.log("👤 Found pending user with exact criteria:", !!targetPendingUser);

    if (!targetPendingUser || !targetPendingUser.otp) {
      console.log("❌ No valid pending user found for OTP verification");
      return NextResponse.json(
        { message: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP securely
    const isValidOTP = await bcrypt.compare(otp, targetPendingUser.otp);
    console.log("🔍 OTP comparison result:", isValidOTP);

    if (!isValidOTP) {
      console.log("❌ OTP verification failed - hash comparison failed");
      return NextResponse.json(
        { message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    console.log("✅ OTP verification successful");

    // Complete account creation — use upsert to handle legacy unverified users
    // If an old unverified user record exists from before the PendingUser migration,
    // update it instead of creating a duplicate (which would cause E11000 duplicate key error)
    const newUser = await User.findOneAndUpdate(
      { email: targetPendingUser.email },
      {
        $set: {
          email: targetPendingUser.email,
          password: targetPendingUser.password, // Already hashed in PendingUser
          isEmailVerified: true,
          isOtpVerified: true,
          otp: undefined,
          otpExpiry: undefined,
        },
      },
      { upsert: true, new: true }
    );

    // Delete the pending user record now that it is successfully moved to User
    await PendingUser.deleteOne({ _id: targetPendingUser._id });

    console.log("✅ Account created and email verified successfully");

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role || 'viewer' },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id, role: newUser.role || 'viewer' },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    console.log("🔑 JWT token and refresh token generated for automatic login");

    return NextResponse.json({
      message: "Account created successfully! Logging you in...",
      verified: true,
      token: token,
      refreshToken: refreshToken
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
