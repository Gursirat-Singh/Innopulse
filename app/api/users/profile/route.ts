import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()

    // Get user from session/auth context
    // For now, we'll assume the user ID comes from the request body or headers
    // In a real implementation, you'd get this from the authenticated session

    const body = await request.json()
    const { userId, name, phone } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      )
    }

    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone must be a string' },
        { status: 400 }
      )
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone.trim() || undefined }),
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password -resetToken -resetTokenExpiry -otp -otpExpiry')

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)

    if (error instanceof Error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Invalid data provided' },
          { status: 400 }
        )
      }

      // Handle cast errors (invalid ObjectId)
      if (error.name === 'CastError') {
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
