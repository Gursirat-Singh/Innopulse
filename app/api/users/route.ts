import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import Startup from '@/server/models/startup';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all users with their startup counts
    const users = await User.find({}, { password: 0, resetToken: 0, resetTokenExpiry: 0 });

    // Get startup counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const startupCount = await Startup.countDocuments({ createdBy: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          startupCount,
        };
      })
    );

    return NextResponse.json(usersWithCounts);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
