'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRoles } from '@/queries/roles';
import { useParishes } from '@/queries/parishes';
import { useCreateUser, useUpdateUser } from '@/queries/users';
import {
  createUserSchema,
  updateUserSchema,
  roleRequiresParish,
  type CreateUserInput,
  type UpdateUserInput,
} from '@/lib/validations/user.schema';
import type { UserResponse } from '@/types/api.types';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserResponse | null;
  onSuccess?: () => void;
}

// Role display names in Vietnamese
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  SUPER_ADMIN: 'Quản trị viên',
  DIOCESE_MANAGER: 'Quản lý Giáo phận',
  PARISH_PRIEST: 'Linh mục Giáo xứ',
  ACCOUNTANT: 'Kế toán',
  PARISH_SECRETARY: 'Thư ký Giáo xứ',
};

export function UserForm({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormProps) {
  const isEdit = !!user;

  // Fetch roles and parishes
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { data: parishesData, isLoading: parishesLoading } = useParishes({
    isActive: true,
  });

  const roles = rolesData?.data?.roles || [];
  const parishes = parishesData?.data?.parishes || [];

  // Form setup - use any for flexibility between create/edit schemas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema = isEdit ? updateUserSchema : createUserSchema;
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema as any),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      roleId: '',
      parishId: '',
    },
  });

  // Watch role to conditionally show parish field
  const selectedRoleId = form.watch('roleId');
  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const showParishField = selectedRole
    ? roleRequiresParish(selectedRole.name)
    : false;

  // Reset form when user changes
  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          email: user.email,
          name: user.name,
          phone: user.phone || '',
          roleId: user.role?.id || '',
          parishId: user.parish?.id || '',
        });
      } else {
        form.reset({
          email: '',
          password: '',
          name: '',
          phone: '',
          roleId: '',
          parishId: '',
        });
      }
    }
  }, [open, user, form]);

  // Mutations
  const createMutation = useCreateUser({
    onSuccess: () => {
      toast.success('Tạo người dùng thành công');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo người dùng');
    },
  });

  const updateMutation = useUpdateUser({
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Submit handler
  const onSubmit = (data: Record<string, unknown>) => {
    if (isEdit && user) {
      updateMutation.mutate({ id: user.id, data: data as UpdateUserInput });
    } else {
      createMutation.mutate(data as CreateUserInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                      disabled={isEdit} // Can't change email
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password (only for create) */}
            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mật khẩu <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Tối thiểu 6 ký tự"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Họ tên <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vai trò <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={rolesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {ROLE_DISPLAY_NAMES[role.name] || role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parish (conditional) */}
            {showParishField && (
              <FormField
                control={form.control}
                name="parishId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Giáo xứ <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={parishesLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giáo xứ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parishes.map((parish) => (
                          <SelectItem key={parish.id} value={parish.id}>
                            {parish.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Đang xử lý...'
                  : isEdit
                    ? 'Cập nhật'
                    : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
