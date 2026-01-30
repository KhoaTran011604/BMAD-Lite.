/**
 * API Route: GET /api/v1/roles
 *
 * List all available roles.
 * Requires authentication.
 */

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/rbac';
import { connectToDatabase } from '@/lib/db/connection';
import Role from '@/lib/db/models/role.model';

/**
 * GET /api/v1/roles
 * List all roles
 */
export const GET = withAuth(async (): Promise<NextResponse> => {
  try {
    await connectToDatabase();

    const roles = await Role.find().sort({ name: 1 }).lean().exec();

    return NextResponse.json({
      success: true,
      data: {
        roles: roles.map((role) => ({
          id: role._id.toString(),
          name: role.name,
          permissions: role.permissions,
        })),
      },
    });
  } catch (error) {
    console.error('Error listing roles:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Có lỗi xảy ra khi lấy danh sách vai trò',
        },
      },
      { status: 500 }
    );
  }
});
