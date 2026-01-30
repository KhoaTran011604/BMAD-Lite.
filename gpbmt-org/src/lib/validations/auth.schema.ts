import * as yup from 'yup';

/**
 * Login form validation schema
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Vui lòng nhập email hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
