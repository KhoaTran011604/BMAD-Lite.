/**
 * API Routes: /api/v1/users
 *
 * GET - List users with pagination and filtering
 * POST - Create a new user
 *
 * Only Super Admin can access these endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { withPermission, type AuthContext } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { connectToDatabase } from '@/lib/db/connection';
import User from '@/lib/db/models/user.model';
import Role from '@/lib/db/models/role.model';
import Parish from '@/lib/db/models/parish.model';
import {
  createUserSchema,
  userFiltersSchema,
  roleRequiresParish,
  type CreateUserInput,
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
 * GET /api/v1/users
 * List users with pagination and filtering
 */
export const GET = withPermission(
  PERMISSIONS.USERS_READ,
  async (req: NextRequest): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      // Parse query parameters
      const { searchParams } = new URL(req.url);
      const rawFilters = {
        search: searchParams.get('search') || undefined,
        roleId: searchParams.get('roleId') || undefined,
        parishId: searchParams.get('parishId') || undefined,
        isActive: searchParams.has('isActive')
          ? searchParams.get('isActive') === 'true'
          : undefined,
        page: searchParams.has('page')
          ? parseInt(searchParams.get('page')!, 10)
          : 1,
        limit: searchParams.has('limit')
          ? parseInt(searchParams.get('limit')!, 10)
          : 20,
      };

      // Validate filters
      const filters = await userFiltersSchema.validate(rawFilters, {
        stripUnknown: true,
      });

      // Build query
      const query: Record<string, unknown> = {};

      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
        ];
      }

      if (filters.roleId) {
        query.role = filters.roleId;
      }

      if (filters.parishId) {
        query.parish = filters.parishId;
      }

      if (typeof filters.isActive === 'boolean') {
        query.isActive = filters.isActive;
      }

      // Execute query with pagination
      const skip = (filters.page - 1) * filters.limit;

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-passwordHash')
          .populate('role', 'name')
          .populate('parish', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(filters.limit)
          .lean()
          .exec(),
        User.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          users: users.map((user) =>
            formatUser(user as unknown as Parameters<typeof formatUser>[0])
          ),
        },
        meta: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters.limit),
        },
      });
    } catch (error) {
      console.error('Error listing users:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi lấy danh sách người dùng',
          },
        },
        { status: 500 }
      );
    }
  }
);

/**
 * POST /api/v1/users
 * Create a new user
 */
export const POST = withPermission(
  PERMISSIONS.USERS_WRITE,
  async (req: NextRequest): Promise<NextResponse> => {
    try {
      await connectToDatabase();

      // Parse request body
      let body: CreateUserInput;
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
      let validatedData: CreateUserInput;
      try {
        validatedData = await createUserSchema.validate(body, {
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

      // Check if email already exists
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
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

      // Verify role exists
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
      if (roleRequiresParish(role.name) && !validatedData.parishId) {
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

      // Verify parish exists if provided
      if (validatedData.parishId) {
        const parish = await Parish.findById(validatedData.parishId);
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

      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.password, 12);

      // Create user
      const newUser = await User.create({
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
        phone: validatedData.phone || undefined,
        role: validatedData.roleId,
        parish: validatedData.parishId || undefined,
        isActive: true,
        mustChangePassword: true, // New users must change password on first login
      });

      // Fetch created user with populated fields
      const createdUser = await User.findById(newUser._id)
        .select('-passwordHash')
        .populate('role', 'name')
        .populate('parish', 'name')
        .lean()
        .exec();

      return NextResponse.json(
        {
          success: true,
          data: {
            user: formatUser(
              createdUser as unknown as Parameters<typeof formatUser>[0]
            ),
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Có lỗi xảy ra khi tạo người dùng',
          },
        },
        { status: 500 }
      );
    }
  }
);
