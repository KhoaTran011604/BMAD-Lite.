/**
 * Parish Validation Schemas
 *
 * Shared between frontend and backend for consistent validation.
 * Uses Yup for declarative schema validation.
 */

import * as yup from 'yup';

/**
 * Schema for creating a new parish
 */
export const createParishSchema = yup.object({
  name: yup
    .string()
    .required('Tên giáo xứ là bắt buộc')
    .min(2, 'Tên giáo xứ phải có ít nhất 2 ký tự')
    .max(100, 'Tên giáo xứ không được quá 100 ký tự')
    .trim(),
  address: yup
    .string()
    .optional()
    .nullable()
    .max(255, 'Địa chỉ không được quá 255 ký tự')
    .trim(),
  phone: yup
    .string()
    .optional()
    .nullable()
    .max(20, 'Số điện thoại không được quá 20 ký tự')
    .matches(/^[0-9+\-.\s()]*$/, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .optional()
    .nullable()
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),
  foundingDate: yup
    .date()
    .optional()
    .nullable()
    .max(new Date(), 'Ngày thành lập không thể trong tương lai'),
});

export type CreateParishInput = yup.InferType<typeof createParishSchema>;

/**
 * Schema for updating an existing parish
 */
export const updateParishSchema = yup.object({
  name: yup
    .string()
    .optional()
    .min(2, 'Tên giáo xứ phải có ít nhất 2 ký tự')
    .max(100, 'Tên giáo xứ không được quá 100 ký tự')
    .trim(),
  address: yup
    .string()
    .optional()
    .nullable()
    .max(255, 'Địa chỉ không được quá 255 ký tự')
    .trim(),
  phone: yup
    .string()
    .optional()
    .nullable()
    .max(20, 'Số điện thoại không được quá 20 ký tự')
    .matches(/^[0-9+\-.\s()]*$/, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .optional()
    .nullable()
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),
  foundingDate: yup
    .date()
    .optional()
    .nullable()
    .max(new Date(), 'Ngày thành lập không thể trong tương lai'),
  isActive: yup.boolean().optional(),
});

export type UpdateParishInput = yup.InferType<typeof updateParishSchema>;

/**
 * Schema for parish list filters
 */
export const parishFiltersSchema = yup.object({
  search: yup.string().optional(),
  isActive: yup.boolean().optional(),
  page: yup.number().optional().min(1).default(1),
  limit: yup.number().optional().min(1).max(100).default(20),
});

export type ParishFilters = yup.InferType<typeof parishFiltersSchema>;
