import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectToDatabase from "@/lib/mongodb"
import Startup from "@/server/models/startup"
import { rateLimit, getIP } from "@/lib/rateLimiter"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all approved startups
    const approvedStartups = await Startup.find({ status: "approved" })
      .sort({ createdAt: -1 })

    return NextResponse.json(approvedStartups)
  } catch (error) {
    console.error("Error fetching approved startups:", error)
    return NextResponse.json(
      { error: "Failed to fetch approved startups" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // RATE LIMIT: max 5 requests per hour per IP
    const ip = getIP(request);
    const rl = await rateLimit(`startup_sub_${ip}`, 5, 60 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many startup submissions. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Reset": rl.reset.toString() } }
      );
    }

    await connectToDatabase()

    // Authenticate user
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

    // Get request body
    const body = await request.json()
    const { name, sector, city, stage, website, email, phone } = body

    // Validate required fields
    if (!name || !sector || !city || !stage) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sector, city, stage' },
        { status: 400 }
      )
    }

    // Validate stage
    const validStages = ["Ideation", "Seed", "Series A", "Series B", "Growth"]
    if (!validStages.includes(stage)) {
      return NextResponse.json(
        { error: 'Invalid stage. Must be one of: Ideation, Seed, Series A, Series B, Growth' },
        { status: 400 }
      )
    }

    // Create startup
    const startup = new Startup({
      name: name.trim(),
      sector: sector.trim(),
      city: city.trim(),
      stage,
      website: website?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      status: "pending",
      createdBy: decoded.id
    })

    await startup.save()

    return NextResponse.json(
      { message: 'Startup created successfully', startup },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating startup:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create startup" },
      { status: 500 }
    )
  }
}
