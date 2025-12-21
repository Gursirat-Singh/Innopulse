import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength (at least 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find user who has verified OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      isOtpVerified: true
    })

    if (!user) {
      return NextResponse.json(
        { message: 'OTP verification required' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear OTP data
    user.password = hashedPassword
    user.otp = undefined
    user.otpExpiry = undefined
    user.isOtpVerified = false
    await user.save()

    return NextResponse.json(
      { message: 'Password reset successfully' }
    )
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}