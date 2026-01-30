import * as yup from 'yup';
import { Gender } from '@/types/models.types';

/**
 * Schema for creating a parishioner
 */
export const createParishionerSchema = yup.object({
  parish: yup
    .string()
    .required('Giáo xứ là bắt buộc')
    .matches(/^[0-9a-fA-F]{24}$/, 'ID giáo xứ không hợp lệ'),
  fullName: yup
    .string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .trim(),
  baptismName: yup
    .string()
    .max(100, 'Tên thánh không được quá 100 ký tự')
    .trim()
    .nullable()
    .transform((value) => value || undefined),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Ngày sinh không được trong tương lai')
    .nullable()
    .transform((value) => value || undefined),
  gender: yup
    .string()
    .oneOf(Object.values(Gender), 'Giới tính không hợp lệ')
    .nullable()
    .transform((value) => value || undefined),
  phone: yup
    .string()
    .max(20, 'Số điện thoại không được quá 20 ký tự')
    .trim()
    .nullable()
    .transform((value) => value || undefined),
  address: yup
    .string()
    .max(500, 'Địa chỉ không được quá 500 ký tự')
    .trim()
    .nullable()
    .transform((value) => value || undefined),
  familyHead: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID chủ hộ không hợp lệ')
    .nullable()
    .transform((value) => value || undefined),
});

export type CreateParishionerInput = yup.InferType<typeof createParishionerSchema>;

/**
 * Schema for updating a parishioner
 */
export const updateParishionerSchema = yup.object({
  parish: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID giáo xứ không hợp lệ')
    .optional(),
  fullName: yup
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .trim()
    .optional(),
  baptismName: yup
    .string()
    .max(100, 'Tên thánh không được quá 100 ký tự')
    .trim()
    .nullable()
    .transform((value) => value || undefined),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Ngày sinh không được trong tương lai')
    .nullable()
    .transform((value) => value || undefined),
  gender: yup
    .string()
    .oneOf(Object.values(Gender), 'Giới tính không hợp lệ')
    .nullable()
    .transform((value) => value || undefined),
  phone: yup
    .string()
    .max(20, 'Số điện thoại không được quá 20 ký tự')
    .trim()
    .nullable()
    .transform((value) => value || undefined),
  address: yup
    .string()
    .max(500, 'Địa chỉ không được quá 500 ký tự')
    .trim()
    .nullable()
    .transform((value) => value || undefined),
  familyHead: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID chủ hộ không hợp lệ')
    .nullable()
    .transform((value) => value || undefined),
});

export type UpdateParishionerInput = yup.InferType<typeof updateParishionerSchema>;

/**
 * Schema for parishioner filters
 */
export const parishionerFiltersSchema = yup.object({
  parish: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID giáo xứ không hợp lệ')
    .optional(),
  search: yup.string().trim().optional(),
  gender: yup
    .string()
    .oneOf(Object.values(Gender), 'Giới tính không hợp lệ')
    .optional(),
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(20),
});

export type ParishionerFiltersInput = yup.InferType<typeof parishionerFiltersSchema>;
