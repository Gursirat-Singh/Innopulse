import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import Startup from '@/server/models/startup'
import User from '@/server/models/User' // Explicitly load to prevent OverwriteModelError in Serverless
import { refreshCachedStats } from '@/lib/refreshStats'
import { rateLimit, getIP } from '@/lib/rateLimiter'

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Startup ID" },
        { status: 400 }
      );
    }

    await connectDB()

    // Prevent Webpack from tree-shaking the User model in production
    if (!User) {
      console.warn("User model failed to load");
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Startup ID" },
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

    if (!action || !['approve', 'reject', 'edit'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve", "reject", or "edit"' },
        { status: 400 }
      )
    }

    // Rate limiting for admin approval actions (20 requests per 15 mins)
    if (action === 'approve') {
      const ip = getIP(request);
      const rl = await rateLimit(`admin_approve_${ip}`, 20, 15 * 60 * 1000);
      if (!rl.success) {
        return NextResponse.json(
          { error: "Rate limit exceeded for approvals. Please try again later." },
          { status: 429, headers: { "X-RateLimit-Reset": rl.reset.toString() } }
        );
      }
    }

    /* ---------- EDIT ACTION ---------- */
    if (action === 'edit') {
      const { updates } = body

      if (!updates || typeof updates !== 'object') {
        return NextResponse.json(
          { error: 'Updates object is required for edit action' },
          { status: 400 }
        )
      }

      const startup = await Startup.findById(id)
      if (!startup) {
        return NextResponse.json(
          { error: "Startup not found" },
          { status: 404 }
        )
      }

      // Compute diff: only track fields that actually changed
      const editableFields = ['name', 'sector', 'city', 'stage', 'funding', 'employees', 'revenueRange', 'website', 'email', 'phone']
      const changedFields: string[] = []
      const previousValues: Record<string, any> = {}
      const newValues: Record<string, any> = {}

      for (const field of editableFields) {
        if (updates[field] !== undefined && String(updates[field]) !== String(startup[field] ?? '')) {
          changedFields.push(field)
          previousValues[field] = startup[field]
          newValues[field] = updates[field]
          ;(startup as any)[field] = updates[field]
        }
      }

      if (changedFields.length === 0) {
        return NextResponse.json(
          { message: 'No fields changed' },
          { status: 200 }
        )
      }

      // Push history entry
      startup.changeHistory.push({
        changedAt: new Date(),
        changedBy: decoded.id,
        changedFields,
        previousValues,
        newValues,
      })

      // Reset stale tracking
      startup.lastActivityAt = new Date()
      startup.isStale = false

      await startup.save()

      // Refresh cached stats
      await refreshCachedStats()

      const serialized = {
        ...startup.toObject(),
        _id: startup._id.toString()
      }

      return NextResponse.json({
        message: 'Startup updated successfully',
        startup: serialized,
        changedFields,
      })
    }

    /* ---------- APPROVE / REJECT ACTION ---------- */
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date()
    }

    if (action === 'approve') {
      updateData.approvedBy = decoded.id
      updateData.lastActivityAt = new Date()
      updateData.isStale = false
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

    // Refresh cached stats on approval/rejection
    await refreshCachedStats()

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Startup ID" },
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
