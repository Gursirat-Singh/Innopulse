import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectToDatabase from "@/lib/mongodb"
import Startup from "@/server/models/startup"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Authenticate admin user
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token provided" },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      role: string
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const staleStartups = await Startup.find({
      status: "approved",
      isStale: true,
    })
      .populate("createdBy", "name email")
      .sort({ lastActivityAt: 1 })

    return NextResponse.json(staleStartups)
  } catch (error) {
    console.error("Error fetching stale startups:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to fetch stale startups" },
      { status: 500 }
    )
  }
}
