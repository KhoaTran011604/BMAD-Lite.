/**
 * API Route: PATCH /api/v1/users/[id]/role
 *
 * Assign a role to a user.
 * Only Super Admin can access this endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import User from '@/lib/db/models/user.model';
import Role from '@/lib/db/models/role.model';

interface RoleAssignmentBody {
  roleId: string;
}

/**
 * PATCH /api/v1/users/[id]/role
 * Assign role to user
 */
export const PATCH = withPermission(
  PERMISSIONS.USERS_WRITE,
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const userId = params.id as string;

      // Parse request body
      let body: RoleAssignmentBody;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_REQUEST',
              message: 'Dữ liệu yêu cầu không hợp lệ',
            },
          },
          { status: 400 }
        );
      }

      const { roleId } = body;

      // Validate roleId is provided
      if (!roleId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Vui lòng chọn vai trò',
            },
          },
          { status: 400 }
        );
      }

      // Check if role exists
      const role = await Role.findById(roleId);
      if (!role) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Vai trò không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Người dùng không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Update user's role
      user.role = role._id;
      await user.save();

      // Return updated user with populated role
      const updatedUser = await User.findById(userId)
        .select('-passwordHash')
        .populate('role')
        .populate('parish')
        .exec();

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: updatedUser?._id.toString(),
            email: updatedUser?.email,
            name: updatedUser?.name,
            phone: updatedUser?.phone,
            role: {
              id: (updatedUser?.role as { _id: { toString: () => string }; name: string; permissions: string[] })?._id.toString(),
              name: (updatedUser?.role as { name: string })?.name,
              permissions: (updatedUser?.role as { permissions: string[] })?.permissions,
            },
            parish: updatedUser?.parish
              ? {
                  id: (updatedUser.parish as { _id: { toString: () => string }; name: string })._id.toString(),
                  name: (updatedUser.parish as { name: string }).name,
                }
              : null,
            isActive: updatedUser?.isActive,
            createdAt: updatedUser?.createdAt,
            updatedAt: updatedUser?.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi gán vai trò',
          },
        },
        { status: 500 }
      );
    }
  }
);
