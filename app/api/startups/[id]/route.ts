import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Startup from '@/server/models/startup'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { error: "Startup ID is required" },
        { status: 400 }
      );
    }

    await connectDB()

    // Get single startup by ID
    const startup = await Startup.findById(id)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      )
    }

    // Ensure _id is a string
    const serializedStartup = {
      ...startup.toObject(),
      _id: startup._id.toString()
    }

    return NextResponse.json(serializedStartup)
  } catch (error) {
    console.error('Error fetching startup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { error: "Startup ID is required" },
        { status: 400 }
      );
    }

    await connectDB()

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

    // Get request body
    const body = await request.json()
    const { action } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Find and update startup
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date()
    }

    if (action === 'approve') {
      updateData.approvedBy = decoded.id
    }

    const startup = await Startup.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email')
     .populate('approvedBy', 'name email')

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      )
    }

    // Ensure _id is a string
    const serializedStartup = {
      ...startup.toObject(),
      _id: startup._id.toString()
    }

    return NextResponse.json({
      message: `Startup ${action}d successfully`,
      startup: serializedStartup
    })
  } catch (error) {
    console.error('Error updating startup:', error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { error: "Startup ID is required" },
        { status: 400 }
      );
    }

    await connectDB()

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

    // Find and delete startup
    const startup = await Startup.findByIdAndDelete(id)

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Startup deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting startup:', error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
