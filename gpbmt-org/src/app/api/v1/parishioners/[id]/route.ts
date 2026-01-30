/**
 * API Routes: /api/v1/parishioners/[id]
 *
 * GET - Get parishioner details
 * PATCH - Update parishioner
 * DELETE - Delete parishioner (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withParishScope, withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import { Parishioner, Parish, AuditLog } from '@/lib/db/models';
import { AuditAction } from '@/types/models.types';
import {
  updateParishionerSchema,
  type UpdateParishionerInput,
} from '@/lib/validations/parishioner.schema';

/**
 * Parishioner response type
 */
interface ParishionerApiResponse {
  id: string;
  parish: {
    id: string;
    name: string;
  } | null;
  fullName: string;
  baptismName: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  familyHead: {
    id: string;
    fullName: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Format parishioner object for API response
 */
function formatParishioner(parishioner: {
  _id: { toString: () => string };
  parish?: { _id: { toString: () => string }; name: string } | null;
  fullName: string;
  baptismName?: string;
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  address?: string;
  familyHead?: { _id: { toString: () => string }; fullName: string } | null;
  createdAt: Date;
  updatedAt: Date;
}): ParishionerApiResponse {
  return {
    id: parishioner._id.toString(),
    parish: parishioner.parish
      ? {
          id: parishioner.parish._id.toString(),
          name: parishioner.parish.name,
        }
      : null,
    fullName: parishioner.fullName,
    baptismName: parishioner.baptismName || null,
    dateOfBirth: parishioner.dateOfBirth || null,
    gender: parishioner.gender || null,
    phone: parishioner.phone || null,
    address: parishioner.address || null,
    familyHead: parishioner.familyHead
      ? {
          id: parishioner.familyHead._id.toString(),
          fullName: parishioner.familyHead.fullName,
        }
      : null,
    createdAt: parishioner.createdAt,
    updatedAt: parishioner.updatedAt,
  };
}

/**
 * GET /api/v1/parishioners/[id]
 * Get parishioner details
 * Parish Priest and Parish Secretary can only view their parish's parishioners
 */
export const GET = withParishScope(
  PERMISSIONS.PARISHIONERS_READ,
  async (req: NextRequest, { user, params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const parishionerId = params.id as string;

      const parishioner = await Parishioner.findById(parishionerId)
        .populate('parish', 'name')
        .populate('familyHead', 'fullName')
        .lean()
        .exec();

      if (!parishioner) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Giáo dân không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Parish-scoped users can only view their parish's parishioners
      const parishScopedRoles = ['PARISH_PRIEST', 'PARISH_SECRETARY'];
      if (parishScopedRoles.includes(user.roleName) && user.parish) {
        const parishionerParishId =
          typeof parishioner.parish === 'object' && parishioner.parish
            ? (parishioner.parish as { _id: { toString: () => string } })._id.toString()
            : String(parishioner.parish);

        if (parishionerParishId !== user.parish) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Bạn không có quyền xem giáo dân này',
              },
            },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          parishioner: formatParishioner(
            parishioner as unknown as Parameters<typeof formatParishioner>[0]
          ),
        },
      });
    } catch (error) {
      console.error('Error getting parishioner:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi lấy thông tin giáo dân',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/parishioners/[id]
 * Update parishioner
 * Parish Priest and Parish Secretary can only update their parish's parishioners
 */
export const PATCH = withParishScope(
  PERMISSIONS.PARISHIONERS_WRITE,
  async (req: NextRequest, { user, params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const parishionerId = params.id as string;

      // Check if parishioner exists
      const existingParishioner = await Parishioner.findById(parishionerId);
      if (!existingParishioner) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Giáo dân không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Store old value for audit log
      const oldValue = existingParishioner.toObject();

      // Parish-scoped users can only update their parish's parishioners
      const parishScopedRoles = ['PARISH_PRIEST', 'PARISH_SECRETARY'];
      if (parishScopedRoles.includes(user.roleName) && user.parish) {
        if (existingParishioner.parish.toString() !== user.parish) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Bạn không có quyền cập nhật giáo dân này',
              },
            },
            { status: 403 }
          );
        }
      }

      // Parse request body
      let body: UpdateParishionerInput;
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
      let validatedData: UpdateParishionerInput;
      try {
        validatedData = await updateParishionerSchema.validate(body, {
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

      // If changing parish, verify it exists and user has permission
      if (validatedData.parish && validatedData.parish !== existingParishioner.parish.toString()) {
        const newParish = await Parish.findById(validatedData.parish);
        if (!newParish) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'Giáo xứ mới không tồn tại',
              },
            },
            { status: 404 }
          );
        }

        // Parish-scoped users cannot move parishioners to other parishes
        if (parishScopedRoles.includes(user.roleName)) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Bạn không có quyền chuyển giáo dân sang giáo xứ khác',
              },
            },
            { status: 403 }
          );
        }
      }

      // Verify familyHead exists if provided
      if (validatedData.familyHead) {
        const familyHead = await Parishioner.findById(validatedData.familyHead);
        if (!familyHead) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'Chủ hộ không tồn tại',
              },
            },
            { status: 404 }
          );
        }
      }

      // Build update object
      const updateData: Record<string, unknown> = {};
      if (validatedData.parish) updateData.parish = validatedData.parish;
      if (validatedData.fullName) updateData.fullName = validatedData.fullName;
      if (validatedData.baptismName !== undefined)
        updateData.baptismName = validatedData.baptismName || undefined;
      if (validatedData.dateOfBirth !== undefined)
        updateData.dateOfBirth = validatedData.dateOfBirth || undefined;
      if (validatedData.gender !== undefined)
        updateData.gender = validatedData.gender || undefined;
      if (validatedData.phone !== undefined)
        updateData.phone = validatedData.phone || undefined;
      if (validatedData.address !== undefined)
        updateData.address = validatedData.address || undefined;
      if (validatedData.familyHead !== undefined)
        updateData.familyHead = validatedData.familyHead || undefined;

      // Update parishioner
      await Parishioner.findByIdAndUpdate(parishionerId, updateData);

      // Fetch updated parishioner
      const updatedParishioner = await Parishioner.findById(parishionerId)
        .populate('parish', 'name')
        .populate('familyHead', 'fullName')
        .lean()
        .exec();

      // Create audit log
      await AuditLog.create({
        user: user.id,
        action: AuditAction.UPDATE,
        entityType: 'Parishioner',
        entityId: parishionerId,
        oldValue: oldValue as unknown as Record<string, unknown>,
        newValue: updatedParishioner as unknown as Record<string, unknown>,
      });

      return NextResponse.json({
        success: true,
        data: {
          parishioner: formatParishioner(
            updatedParishioner as unknown as Parameters<typeof formatParishioner>[0]
          ),
        },
        message: 'Cập nhật giáo dân thành công',
      });
    } catch (error) {
      console.error('Error updating parishioner:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi cập nhật giáo dân',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/parishioners/[id]
 * Delete parishioner (SUPER_ADMIN only)
 */
export const DELETE = withPermission(
  PERMISSIONS.PARISHIONERS_DELETE,
  async (req: NextRequest, { user, params }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      const parishionerId = params.id as string;

      // Check if parishioner exists
      const existingParishioner = await Parishioner.findById(parishionerId)
        .populate('parish', 'name')
        .populate('familyHead', 'fullName');

      if (!existingParishioner) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Giáo dân không tồn tại',
            },
          },
          { status: 404 }
        );
      }

      // Store for audit log and response
      const deletedData = existingParishioner.toObject();

      // Check if this parishioner is a family head for others
      const dependents = await Parishioner.countDocuments({ familyHead: parishionerId });
      if (dependents > 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'HAS_DEPENDENTS',
              message: `Không thể xóa vì giáo dân này là chủ hộ của ${dependents} người khác`,
            },
          },
          { status: 400 }
        );
      }

      // Delete parishioner
      await Parishioner.findByIdAndDelete(parishionerId);

      // Create audit log
      await AuditLog.create({
        user: user.id,
        action: AuditAction.DELETE,
        entityType: 'Parishioner',
        entityId: parishionerId,
        oldValue: deletedData as unknown as Record<string, unknown>,
      });

      return NextResponse.json({
        success: true,
        data: {
          parishioner: formatParishioner(
            deletedData as unknown as Parameters<typeof formatParishioner>[0]
          ),
        },
        message: 'Xóa giáo dân thành công',
      });
    } catch (error) {
      console.error('Error deleting parishioner:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi xóa giáo dân',
          },
        },
        { status: 500 }
      );
    }
  }
);
