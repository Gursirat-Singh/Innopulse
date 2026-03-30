import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password, captchaId, captchaAnswer } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // 1. Verify CAPTCHA
    if (!captchaId || !captchaAnswer) {
      return NextResponse.json({ message: "CAPTCHA verification is required" }, { status: 400 });
    }

    try {
      const decoded = jwt.verify(
        captchaId,
        process.env.JWT_SECRET || 'fallback_secret_development'
      ) as { text: string };

      if (decoded.text !== String(captchaAnswer).toLowerCase()) {
        return NextResponse.json({ message: "Invalid CAPTCHA. Please try again." }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired CAPTCHA. Please refresh it." }, { status: 400 });
    }

    // 2. Connect to Database & Verify User
    await connectDB();
    
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(String(password), user.password);
    if (!match) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Issue Authentication Tokens sharing the precise Serverless JWT_SECRET
    const secret = process.env.JWT_SECRET || 'fallback_secret_development';

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token, refreshToken });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
