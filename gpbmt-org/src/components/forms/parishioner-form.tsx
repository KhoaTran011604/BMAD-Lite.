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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCreateParishioner, useUpdateParishioner } from '@/queries/parishioners';
import { useParishes } from '@/queries/parishes';
import { usePermissions } from '@/hooks/use-permissions';
import {
  createParishionerSchema,
  updateParishionerSchema,
  type CreateParishionerInput,
  type UpdateParishionerInput,
} from '@/lib/validations/parishioner.schema';
import { Gender } from '@/types/models.types';
import type { ParishionerResponse } from '@/types/api.types';

interface ParishionerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parishioner?: ParishionerResponse | null;
  onSuccess?: () => void;
}

/**
 * Format date for HTML date input field (YYYY-MM-DD format)
 */
function formatDateForInput(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString.split('T')[0] ?? '';
}

export function ParishionerForm({
  open,
  onOpenChange,
  parishioner,
  onSuccess,
}: ParishionerFormProps) {
  const isEdit = !!parishioner;
  const { parish: userParish, isParishScoped } = usePermissions();

  // Fetch parishes for dropdown
  const { data: parishesData } = useParishes({ isActive: true });
  const parishes = parishesData?.data?.parishes || [];

  // Form setup
  const schema = isEdit ? updateParishionerSchema : createParishionerSchema;
  type FormValues = {
    parish: string;
    fullName: string;
    baptismName?: string;
    dateOfBirth?: Date;
    gender?: string;
    phone?: string;
    address?: string;
  };
  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema as any),
    defaultValues: {
      parish: '',
      fullName: '',
      baptismName: '',
      dateOfBirth: undefined,
      gender: undefined,
      phone: '',
      address: '',
    },
  });

  // Reset form when parishioner changes or dialog opens
  useEffect(() => {
    if (open) {
      if (parishioner) {
        form.reset({
          parish: parishioner.parish?.id || '',
          fullName: parishioner.fullName,
          baptismName: parishioner.baptismName || '',
          dateOfBirth: parishioner.dateOfBirth
            ? new Date(parishioner.dateOfBirth)
            : undefined,
          gender: parishioner.gender || undefined,
          phone: parishioner.phone || '',
          address: parishioner.address || '',
        });
      } else {
        form.reset({
          // For parish-scoped users, auto-select their parish
          parish: isParishScoped && userParish ? userParish : '',
          fullName: '',
          baptismName: '',
          dateOfBirth: undefined,
          gender: undefined,
          phone: '',
          address: '',
        });
      }
    }
  }, [open, parishioner, form, isParishScoped, userParish]);

  // Mutations
  const createMutation = useCreateParishioner({
    onSuccess: () => {
      toast.success('Tạo giáo dân thành công');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo giáo dân');
    },
  });

  const updateMutation = useUpdateParishioner({
    onSuccess: () => {
      toast.success('Cập nhật giáo dân thành công');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật giáo dân');
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Submit handler
  const onSubmit = (data: FormValues) => {
    // Clean up empty strings to undefined
    const cleanedData = {
      ...data,
      baptismName: data.baptismName || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
    };

    if (isEdit && parishioner) {
      updateMutation.mutate({
        id: parishioner.id,
        data: cleanedData as UpdateParishionerInput,
      });
    } else {
      createMutation.mutate(cleanedData as CreateParishionerInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa giáo dân' : 'Thêm giáo dân mới'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Parish */}
            <FormField
              control={form.control}
              name="parish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giáo xứ <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isParishScoped}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giáo xứ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parishes.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Họ và tên <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Baptism Name */}
            <FormField
              control={form.control}
              name="baptismName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thánh</FormLabel>
                  <FormControl>
                    <Input placeholder="Giuse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth and Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? formatDateForInput(field.value.toISOString())
                            : ''
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? new Date(value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Nam</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0912 345 678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Đường ABC, TP. Buôn Ma Thuột"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
