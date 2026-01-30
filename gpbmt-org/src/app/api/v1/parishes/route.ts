/**
 * API Routes: /api/v1/parishes
 *
 * GET - List all parishes (paginated, searchable)
 * POST - Create new parish
 *
 * Requires authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import Parish from '@/lib/db/models/parish.model';
import {
  createParishSchema,
  type CreateParishInput,
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
 * GET /api/v1/parishes
 * List all parishes with pagination and search
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
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (typeof isActive === 'boolean') {
      query.isActive = isActive;
    }

    // Get total count and parishes
    const [total, parishes] = await Promise.all([
      Parish.countDocuments(query),
      Parish.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        parishes: parishes.map((parish) =>
          formatParish(parish as unknown as Parameters<typeof formatParish>[0])
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

/**
 * POST /api/v1/parishes
 * Create new parish
 */
export const POST = withPermission(
  PERMISSIONS.PARISHES_WRITE,
  async (req: NextRequest): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      // Parse request body
      let body: CreateParishInput;
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
      let validatedData: CreateParishInput;
      try {
        validatedData = await createParishSchema.validate(body, {
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

      // Check name uniqueness
      const existingParish = await Parish.findOne({ name: validatedData.name });
      if (existingParish) {
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

      // Create parish
      const parish = new Parish({
        name: validatedData.name,
        address: validatedData.address,
        phone: validatedData.phone,
        email: validatedData.email,
        foundingDate: validatedData.foundingDate,
        isActive: true,
      });

      await parish.save();

      return NextResponse.json(
        {
          success: true,
          data: {
            parish: formatParish(
              parish.toObject() as unknown as Parameters<typeof formatParish>[0]
            ),
          },
          message: 'Tạo giáo xứ thành công',
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating parish:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi tạo giáo xứ',
          },
        },
        { status: 500 }
      );
    }
  }
);
