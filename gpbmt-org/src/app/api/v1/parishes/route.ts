/**
 * API Route: GET /api/v1/parishes
 *
 * List all parishes.
 * Requires authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/rbac';
import { connectToDatabase } from '@/lib/db/connection';
import Parish from '@/lib/db/models/parish.model';

/**
 * GET /api/v1/parishes
 * List all parishes
 */
export const GET = withAuth(async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const isActive = searchParams.has('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined;

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (typeof isActive === 'boolean') {
      query.isActive = isActive;
    }

    const parishes = await Parish.find(query).sort({ name: 1 }).lean().exec();

    return NextResponse.json({
      success: true,
      data: {
        parishes: parishes.map((parish) => ({
          id: parish._id.toString(),
          name: parish.name,
          address: parish.address || null,
          phone: parish.phone || null,
          isActive: parish.isActive,
        })),
      },
    });
  } catch (error) {
    console.error('Error listing parishes:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Có lỗi xảy ra khi lấy danh sách giáo xứ',
        },
      },
      { status: 500 }
    );
  }
});
