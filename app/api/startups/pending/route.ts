import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectToDatabase from "@/lib/mongodb"
import Startup from "@/server/models/startup"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Authenticate admin user
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string }

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all pending startups with creator info
    const pendingStartups = await Startup.find({ status: "pending" })
      .populate("createdBy", "email")
      .sort({ createdAt: -1 })

    return NextResponse.json(pendingStartups)
  } catch (error) {
    console.error("Error fetching pending startups:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch pending startups" },
      { status: 500 }
    )
  }
}
