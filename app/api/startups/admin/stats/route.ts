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

    const totalApproved = await Startup.countDocuments({ status: "approved" })
    const totalPending = await Startup.countDocuments({ status: "pending" })
    const totalRejected = await Startup.countDocuments({ status: "rejected" })

    // Get today's approved startups
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const approvedToday = await Startup.countDocuments({
      status: "approved",
      updatedAt: { $gte: today, $lt: tomorrow }
    })

    // Calculate approval rate (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const approvedLast30Days = await Startup.countDocuments({
      status: "approved",
      updatedAt: { $gte: thirtyDaysAgo }
    })

    const totalDecisionsLast30Days = await Startup.countDocuments({
      status: { $in: ["approved", "rejected"] },
      updatedAt: { $gte: thirtyDaysAgo }
    })

    const approvalRate = totalDecisionsLast30Days > 0
      ? Math.round((approvedLast30Days / totalDecisionsLast30Days) * 100)
      : 0

    return NextResponse.json({
      totalApproved,
      totalPending,
      totalRejected,
      approvedToday,
      approvalRate
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    )
  }
}
