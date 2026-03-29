import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Startup from "@/server/models/startup";

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the cron job using CRON_SECRET
    // Vercel sends a Bearer token with the CRON_SECRET in the Authorization header
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow local testing easily if CRON_SECRET isn't strictly enforced during development, 
    // but in production, it will be required
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized access to cron endpoint" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Calculate the date 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Update startups that:
    // 1. Are approved
    // 2. Are not already flagged as stale 
    // 3. Either have lastActivityAt > 90 days old OR (no lastActivityAt AND updatedAt > 90 days old)
    const result = await Startup.updateMany(
      {
        status: "approved",
        isStale: { $ne: true },
        $or: [
          { lastActivityAt: { $lte: ninetyDaysAgo } },
          { lastActivityAt: { $exists: false }, updatedAt: { $lte: ninetyDaysAgo } }
        ]
      },
      {
        $set: { isStale: true }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Stale startups sync completed",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error) {
    console.error("[CRON ERROR] Failed to run stale flagging job:", error);
    return NextResponse.json(
      { error: "Internal server error during cron job" },
      { status: 500 }
    );
  }
}
