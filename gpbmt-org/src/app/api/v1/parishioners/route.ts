/**
 * API Routes: /api/v1/parishioners
 *
 * GET - List all parishioners (paginated, searchable, parish-scoped)
 * POST - Create new parishioner
 *
 * Requires authentication.
 * Parish Priest and Parish Secretary see only their parish's parishioners.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withParishScope, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import { Parishioner, Parish, AuditLog } from '@/lib/db/models';
import { AuditAction } from '@/types/models.types';
import {
  createParishionerSchema,
  type CreateParishionerInput,
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
 * GET /api/v1/parishioners
 * List all parishioners with pagination, search, and parish filter
 * Parish Priest and Parish Secretary are limited to their assigned parish
 */
export const GET = withParishScope(
  PERMISSIONS.PARISHIONERS_READ,
  async (req: NextRequest, { user }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      // Parse query parameters
      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search') || undefined;
      const parishParam = searchParams.get('parish') || undefined;
      const gender = searchParams.get('gender') || undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const skip = (page - 1) * limit;

      // Build query
      const query: Record<string, unknown> = {};

      // Parish-scoped roles can only see their parish's parishioners
      const parishScopedRoles = ['PARISH_PRIEST', 'PARISH_SECRETARY'];
      if (parishScopedRoles.includes(user.roleName) && user.parish) {
        query.parish = user.parish;
      } else if (parishParam) {
        // Non-scoped users can filter by parish
        query.parish = parishParam;
      }

      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { baptismName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      if (gender) {
        query.gender = gender;
      }

      // Get total count and parishioners
      const [total, parishioners] = await Promise.all([
        Parishioner.countDocuments(query),
        Parishioner.find(query)
          .populate('parish', 'name')
          .populate('familyHead', 'fullName')
          .sort({ fullName: 1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          parishioners: parishioners.map((p) =>
            formatParishioner(p as unknown as Parameters<typeof formatParishioner>[0])
          ),
        },
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error listing parishioners:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi lấy danh sách giáo dân',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * POST /api/v1/parishioners
 * Create new parishioner
 * Parish Priest and Parish Secretary can only create in their assigned parish
 */
export const POST = withParishScope(
  PERMISSIONS.PARISHIONERS_WRITE,
  async (req: NextRequest, { user }: AuthContext): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      // Parse request body
      let body: CreateParishionerInput;
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

      // For parish-scoped users, auto-assign their parish
      const parishScopedRoles = ['PARISH_PRIEST', 'PARISH_SECRETARY'];
      if (parishScopedRoles.includes(user.roleName) && user.parish) {
        body.parish = user.parish;
      }

      // Validate input
      let validatedData: CreateParishionerInput;
      try {
        validatedData = await createParishionerSchema.validate(body, {
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

      // Verify parish exists
      const parish = await Parish.findById(validatedData.parish);
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

      // Parish-scoped users can only create in their parish
      if (parishScopedRoles.includes(user.roleName) && user.parish !== validatedData.parish) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Bạn chỉ có thể thêm giáo dân vào giáo xứ của mình',
            },
          },
          { status: 403 }
        );
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

      // Create parishioner
      const parishioner = new Parishioner({
        parish: validatedData.parish,
        fullName: validatedData.fullName,
        baptismName: validatedData.baptismName,
        dateOfBirth: validatedData.dateOfBirth,
        gender: validatedData.gender,
        phone: validatedData.phone,
        address: validatedData.address,
        familyHead: validatedData.familyHead,
      });

      await parishioner.save();

      // Create audit log
      await AuditLog.create({
        user: user.id,
        action: AuditAction.CREATE,
        entityType: 'Parishioner',
        entityId: parishioner._id,
        newValue: parishioner.toObject() as unknown as Record<string, unknown>,
      });

      // Populate for response
      await parishioner.populate('parish', 'name');
      await parishioner.populate('familyHead', 'fullName');

      return NextResponse.json(
        {
          success: true,
          data: {
            parishioner: formatParishioner(
              parishioner.toObject() as unknown as Parameters<typeof formatParishioner>[0]
            ),
          },
          message: 'Tạo giáo dân thành công',
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating parishioner:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi tạo giáo dân',
          },
        },
        { status: 500 }
      );
    }
  }
);
