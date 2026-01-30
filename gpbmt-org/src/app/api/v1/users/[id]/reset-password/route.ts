/**
 * API Route: POST /api/v1/users/[id]/reset-password
 *
 * Reset user password (admin action).
 * Sets a temporary password and flags user to change on next login.
 *
 * Only Super Admin can access this endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import User from '@/lib/db/models/user.model';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/user.schema';

/**
 * Generate a random temporary password
 */
function generateTempPassword(length: number = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * POST /api/v1/users/[id]/reset-password
 * Reset user password
 */
export const POST = withPermission(
  PERMISSIONS.USERS_WRITE,
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const userId = params.id as string;

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

      // Parse request body (optional - can provide custom password)
      let body: ResetPasswordInput = {};
      try {
        const rawBody = await req.text();
        if (rawBody) {
          body = JSON.parse(rawBody);
        }
      } catch {
        // Empty body is OK - will generate random password
      }

      // Validate input if provided
      let validatedData: ResetPasswordInput;
      try {
        validatedData = await resetPasswordSchema.validate(body, {
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

      // Generate or use provided password
      const tempPassword = validatedData.newPassword || generateTempPassword();
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      // Update user password and set mustChangePassword flag
      user.passwordHash = passwordHash;
      user.mustChangePassword = true;
      await user.save();

      return NextResponse.json({
        success: true,
        data: {
          userId: user._id.toString(),
          temporaryPassword: tempPassword,
          mustChangePassword: true,
        },
        message: 'Đã đặt lại mật khẩu. Người dùng phải đổi mật khẩu khi đăng nhập lần sau.',
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi đặt lại mật khẩu',
          },
        },
        { status: 500 }
      );
    }
  }
);
