import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { rateLimit, getIP } from "@/lib/rateLimiter";

// Helper for auth
async function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  let token = authHeader?.replace("Bearer ", "");
  
  if (!token) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, decodeURIComponent(v.join('='))];
      }));
      token = cookies["token"];
    }
  }

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch (err) {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  try {
    // RATE LIMITING: max 30 requests per 15 minutes per IP
    const ip = getIP(request);
    const rl = await rateLimit(`watchlist_add_${ip}`, 30, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many watchlist modifications. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Reset": rl.reset.toString() } }
      );
    }

    await connectDB();

    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { startupId } = await params;
    if (!startupId) {
      return NextResponse.json({ error: "Startup ID is required" }, { status: 400 });
    }

    // Add to watchlist using $addToSet to prevent duplicates
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $addToSet: { watchlist: startupId } },
      { new: true }
    ).select('watchlist');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Startup added to watchlist",
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  try {
    await connectDB();

    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { startupId } = await params;
    if (!startupId) {
      return NextResponse.json({ error: "Startup ID is required" }, { status: 400 });
    }

    // Remove from watchlist
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $pull: { watchlist: startupId } },
      { new: true }
    ).select('watchlist');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Startup removed from watchlist",
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
