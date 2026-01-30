/**
 * API Routes: /api/v1/users/[id]
 *
 * GET - Get user details
 * PATCH - Update user
 * DELETE - Deactivate user (soft delete)
 *
 * Only Super Admin can access these endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import User from '@/lib/db/models/user.model';
import Role from '@/lib/db/models/role.model';
import Parish from '@/lib/db/models/parish.model';
import {
  updateUserSchema,
  roleRequiresParish,
  type UpdateUserInput,
} from '@/lib/validations/user.schema';

/**
 * Format user object for API response
 */
function formatUser(user: {
  _id: { toString: () => string };
  email: string;
  name: string;
  phone?: string;
  role: { _id: { toString: () => string }; name: string; permissions?: string[] } | null;
  parish?: { _id: { toString: () => string }; name: string } | null;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    phone: user.phone || null,
    role: user.role
      ? {
          id: user.role._id.toString(),
          name: user.role.name,
        }
      : null,
    parish: user.parish
      ? {
          id: user.parish._id.toString(),
          name: user.parish.name,
        }
      : null,
    isActive: user.isActive,
    mustChangePassword: user.mustChangePassword,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * GET /api/v1/users/[id]
 * Get user details
 */
export const GET = withPermission(
  PERMISSIONS.USERS_READ,
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const userId = params.id as string;

      const user = await User.findById(userId)
        .select('-passwordHash')
        .populate('role', 'name permissions')
        .populate('parish', 'name')
        .lean()
        .exec();

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

      return NextResponse.json({
        success: true,
        data: {
          user: formatUser(user as unknown as Parameters<typeof formatUser>[0]),
        },
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi lấy thông tin người dùng',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/users/[id]
 * Update user
 */
export const PATCH = withPermission(
  PERMISSIONS.USERS_WRITE,
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const userId = params.id as string;

      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
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

      // Parse request body
      let body: UpdateUserInput;
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

      // Validate input
      let validatedData: UpdateUserInput;
      try {
        validatedData = await updateUserSchema.validate(body, {
          abortEarly: false,
          stripUnknown: true,
        });
      } catch (validationError) {
        const yupError = validationError as { inner?: { path?: string; message: string }[] };
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Dữ liệu không hợp lệ',
              details: yupError.inner?.map((e) => ({
                path: e.path,
                message: e.message,
              })),
            },
          },
          { status: 400 }
        );
      }

      // Check email uniqueness if changing email
      if (validatedData.email && validatedData.email !== existingUser.email) {
        const emailExists = await User.findOne({ email: validatedData.email });
        if (emailExists) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'DUPLICATE_EMAIL',
                message: 'Email đã được sử dụng',
              },
            },
            { status: 409 }
          );
        }
      }

      // Determine the final role
      let finalRoleId = validatedData.roleId || existingUser.role.toString();
      let finalParishId = validatedData.parishId;

      // Verify role if changing
      if (validatedData.roleId) {
        const role = await Role.findById(validatedData.roleId);
        if (!role) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_ROLE',
                message: 'Vai trò không tồn tại',
              },
            },
            { status: 400 }
          );
        }

        // Check parish requirement for parish-scoped roles
        const parishId = validatedData.parishId ?? (existingUser.parish?.toString() || null);
        if (roleRequiresParish(role.name) && !parishId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'PARISH_REQUIRED',
                message: 'Vai trò này yêu cầu phải gán giáo xứ',
              },
            },
            { status: 400 }
          );
        }
      }

      // Verify parish if provided
      if (finalParishId) {
        const parish = await Parish.findById(finalParishId);
        if (!parish) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_PARISH',
                message: 'Giáo xứ không tồn tại',
              },
            },
            { status: 400 }
          );
        }
      }

      // Build update object
      const updateData: Record<string, unknown> = {};
      if (validatedData.email) updateData.email = validatedData.email;
      if (validatedData.name) updateData.name = validatedData.name;
      if (validatedData.phone !== undefined) updateData.phone = validatedData.phone || undefined;
      if (validatedData.roleId) updateData.role = validatedData.roleId;
      if (validatedData.parishId !== undefined) {
        updateData.parish = validatedData.parishId || undefined;
      }
      if (typeof validatedData.isActive === 'boolean') {
        updateData.isActive = validatedData.isActive;
      }

      // Update user
      await User.findByIdAndUpdate(userId, updateData);

      // Fetch updated user
      const updatedUser = await User.findById(userId)
        .select('-passwordHash')
        .populate('role', 'name')
        .populate('parish', 'name')
        .lean()
        .exec();

      return NextResponse.json({
        success: true,
        data: {
          user: formatUser(updatedUser as unknown as Parameters<typeof formatUser>[0]),
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi cập nhật người dùng',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/users/[id]
 * Deactivate user (soft delete)
 */
export const DELETE = withPermission(
  PERMISSIONS.USERS_DELETE,
  async (req: NextRequest, { params, user }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const userId = params.id as string;

      // Prevent self-deactivation
      if (userId === user.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Không thể vô hiệu hóa tài khoản của chính mình',
            },
          },
          { status: 403 }
        );
      }

      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
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

      // Deactivate user (soft delete)
      existingUser.isActive = false;
      await existingUser.save();

      // Fetch updated user
      const deactivatedUser = await User.findById(userId)
        .select('-passwordHash')
        .populate('role', 'name')
        .populate('parish', 'name')
        .lean()
        .exec();

      return NextResponse.json({
        success: true,
        data: {
          user: formatUser(deactivatedUser as unknown as Parameters<typeof formatUser>[0]),
        },
        message: 'Đã vô hiệu hóa tài khoản người dùng',
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi vô hiệu hóa người dùng',
          },
        },
        { status: 500 }
      );
    }
  }
);
