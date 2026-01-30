/**
 * User Validation Schemas
 *
 * Shared between frontend and backend for consistent validation.
 * Uses Yup for declarative schema validation.
 */

import * as yup from 'yup';
import { UserRole } from '@/types/models.types';

/**
 * Schema for creating a new user
 */
export const createUserSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ')
    .max(255, 'Email không được quá 255 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự'),
  name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự')
    .trim(),
  phone: yup
    .string()
    .optional()
    .max(20, 'Số điện thoại không được quá 20 ký tự')
    .matches(/^[0-9+\-\s]*$/, 'Số điện thoại không hợp lệ'),
  roleId: yup
    .string()
    .required('Vai trò là bắt buộc'),
  parishId: yup
    .string()
    .optional()
    .nullable()
    .when('roleId', {
      is: (roleId: string) => {
        // This will be validated at runtime - parish required for parish-scoped roles
        return !!roleId;
      },
      then: (schema) => schema,
      otherwise: (schema) => schema,
    }),
});

export type CreateUserInput = yup.InferType<typeof createUserSchema>;

/**
 * Schema for updating an existing user
 */
export const updateUserSchema = yup.object({
  email: yup
    .string()
    .optional()
    .email('Email không hợp lệ')
    .max(255, 'Email không được quá 255 ký tự'),
  name: yup
    .string()
    .optional()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự')
    .trim(),
  phone: yup
    .string()
    .optional()
    .nullable()
    .max(20, 'Số điện thoại không được quá 20 ký tự')
    .matches(/^[0-9+\-\s]*$/, 'Số điện thoại không hợp lệ'),
  roleId: yup
    .string()
    .optional(),
  parishId: yup
    .string()
    .optional()
    .nullable(),
  isActive: yup
    .boolean()
    .optional(),
});

export type UpdateUserInput = yup.InferType<typeof updateUserSchema>;

/**
 * Schema for password reset (admin action)
 */
export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .optional()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự'),
});

export type ResetPasswordInput = yup.InferType<typeof resetPasswordSchema>;

/**
 * Schema for user list filters
 */
export const userFiltersSchema = yup.object({
  search: yup.string().optional(),
  roleId: yup.string().optional(),
  parishId: yup.string().optional(),
  isActive: yup.boolean().optional(),
  page: yup.number().optional().min(1).default(1),
  limit: yup.number().optional().min(1).max(100).default(20),
});

export type UserFilters = yup.InferType<typeof userFiltersSchema>;

/**
 * Parish-scoped roles that require parish assignment
 */
export const PARISH_SCOPED_ROLES: UserRole[] = [
  UserRole.PARISH_PRIEST,
  UserRole.PARISH_SECRETARY,
];

/**
 * Check if a role requires parish assignment
 */
export function roleRequiresParish(roleName: string): boolean {
  return PARISH_SCOPED_ROLES.includes(roleName as UserRole);
}
