/**
 * API Routes: /api/v1/parishes/[id]
 *
 * GET - Get parish details
 * PATCH - Update parish
 * DELETE - Delete parish (with parishioner check)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import Parish from '@/lib/db/models/parish.model';
import User from '@/lib/db/models/user.model';
import Parishioner from '@/lib/db/models/parishioner.model';
import {
  updateParishSchema,
  type UpdateParishInput,
} from '@/lib/validations/parish.schema';

/**
 * Parish response type
 */
interface ParishApiResponse {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  foundingDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Format parish object for API response
 */
function formatParish(parish: {
  _id: { toString: () => string };
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  foundingDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ParishApiResponse {
  return {
    id: parish._id.toString(),
    name: parish.name,
    address: parish.address || null,
    phone: parish.phone || null,
    email: parish.email || null,
    foundingDate: parish.foundingDate || null,
    isActive: parish.isActive,
    createdAt: parish.createdAt,
    updatedAt: parish.updatedAt,
  };
}

/**
 * GET /api/v1/parishes/[id]
 * Get parish details
 */
export const GET = withAuth(
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const parishId = params.id as string;

      const parish = await Parish.findById(parishId).lean().exec();

      if (!parish) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Giáo xứ không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          parish: formatParish(
            parish as unknown as Parameters<typeof formatParish>[0]
          ),
        },
      });
    } catch (error) {
      console.error('Error getting parish:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi lấy thông tin giáo xứ',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/parishes/[id]
 * Update parish
 */
export const PATCH = withPermission(
  PERMISSIONS.PARISHES_WRITE,
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const parishId = params.id as string;

      // Check if parish exists
      const existingParish = await Parish.findById(parishId);
      if (!existingParish) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Giáo xứ không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Parse request body
      let body: UpdateParishInput;
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
      let validatedData: UpdateParishInput;
      try {
        validatedData = await updateParishSchema.validate(body, {
          abortEarly: false,
          stripUnknown: true,
        });
      } catch (validationError) {
        const yupError = validationError as {
          inner?: { path?: string; message: string }[];
        };
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

      // Check name uniqueness if changing name
      if (validatedData.name && validatedData.name !== existingParish.name) {
        const nameExists = await Parish.findOne({ name: validatedData.name });
        if (nameExists) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'DUPLICATE_NAME',
                message: 'Tên giáo xứ đã tồn tại',
              },
            },
            { status: 409 }
          );
        }
      }

      // Build update object
      const updateData: Record<string, unknown> = {};
      if (validatedData.name) updateData.name = validatedData.name;
      if (validatedData.address !== undefined)
        updateData.address = validatedData.address || undefined;
      if (validatedData.phone !== undefined)
        updateData.phone = validatedData.phone || undefined;
      if (validatedData.email !== undefined)
        updateData.email = validatedData.email || undefined;
      if (validatedData.foundingDate !== undefined)
        updateData.foundingDate = validatedData.foundingDate || undefined;
      if (typeof validatedData.isActive === 'boolean')
        updateData.isActive = validatedData.isActive;

      // Update parish
      await Parish.findByIdAndUpdate(parishId, updateData);

      // Fetch updated parish
      const updatedParish = await Parish.findById(parishId).lean().exec();

      return NextResponse.json({
        success: true,
        data: {
          parish: formatParish(
            updatedParish as unknown as Parameters<typeof formatParish>[0]
          ),
        },
        message: 'Cập nhật giáo xứ thành công',
      });
    } catch (error) {
      console.error('Error updating parish:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi cập nhật giáo xứ',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/parishes/[id]
 * Delete parish (only if no parishioners or users assigned)
 */
export const DELETE = withPermission(
  PERMISSIONS.PARISHES_DELETE,
  async (req: NextRequest, { params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const parishId = params.id as string;

      // Check if parish exists
      const existingParish = await Parish.findById(parishId);
      if (!existingParish) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Giáo xứ không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Check for assigned users (Parish Priest, Parish Secretary)
      const assignedUsers = await User.countDocuments({ parish: parishId });
      if (assignedUsers > 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'HAS_DEPENDENCIES',
              message: `Không thể xóa giáo xứ vì có ${assignedUsers} người dùng được gán`,
            },
          },
          { status: 400 }
        );
      }

      // Check for parishioners (Story 2.2)
      const parishionerCount = await Parishioner.countDocuments({ parish: parishId });
      if (parishionerCount > 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'HAS_PARISHIONERS',
              message: `Không thể xóa giáo xứ vì có ${parishionerCount} giáo dân thuộc giáo xứ này`,
            },
          },
          { status: 400 }
        );
      }

      // Delete parish
      await Parish.findByIdAndDelete(parishId);

      return NextResponse.json({
        success: true,
        data: {
          parish: formatParish(
            existingParish.toObject() as unknown as Parameters<
              typeof formatParish
            >[0]
          ),
        },
        message: 'Xóa giáo xứ thành công',
      });
    } catch (error) {
      console.error('Error deleting parish:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi xóa giáo xứ',
          },
        },
        { status: 500 }
      );
    }
  }
);
