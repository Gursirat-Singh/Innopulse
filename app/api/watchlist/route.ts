import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Startup from "@/server/models/startup"; // Need to ensure it's registered

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate user
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.replace("Bearer ", "");
    
    // Check cookies if Authorization header is missing (for browser requests)
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => {
          const [key, ...v] = c.split('=');
          return [key, decodeURIComponent(v.join('='))];
        }));
        token = cookies["token"];
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Fetch user with populated watchlist
    // Assuming Startup model is successfully registered via import
    const user = await User.findById(decoded.id).populate({
      path: 'watchlist',
      model: Startup,
      select: '-__v' 
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ watchlist: user.watchlist || [] });

  } catch (error) {
    console.error("Error fetching watchlist:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
