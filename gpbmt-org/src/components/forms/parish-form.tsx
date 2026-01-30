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
import { useCreateParish, useUpdateParish } from '@/queries/parishes';
import {
  createParishSchema,
  updateParishSchema,
  type CreateParishInput,
  type UpdateParishInput,
} from '@/lib/validations/parish.schema';
import type { ParishFullResponse } from '@/types/api.types';

interface ParishFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parish?: ParishFullResponse | null;
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

export function ParishForm({
  open,
  onOpenChange,
  parish,
  onSuccess,
}: ParishFormProps) {
  const isEdit = !!parish;

  // Form setup with explicit type
  const schema = isEdit ? updateParishSchema : createParishSchema;
  type FormValues = {
    name: string;
    address: string;
    phone: string;
    email: string;
    foundingDate?: Date;
  };
  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema as any),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      foundingDate: undefined,
    },
  });

  // Reset form when parish changes
  useEffect(() => {
    if (open) {
      if (parish) {
        form.reset({
          name: parish.name,
          address: parish.address || '',
          phone: parish.phone || '',
          email: parish.email || '',
          foundingDate: parish.foundingDate
            ? new Date(parish.foundingDate)
            : undefined,
        });
      } else {
        form.reset({
          name: '',
          address: '',
          phone: '',
          email: '',
          foundingDate: undefined,
        });
      }
    }
  }, [open, parish, form]);

  // Mutations
  const createMutation = useCreateParish({
    onSuccess: () => {
      toast.success('Tạo giáo xứ thành công');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo giáo xứ');
    },
  });

  const updateMutation = useUpdateParish({
    onSuccess: () => {
      toast.success('Cập nhật giáo xứ thành công');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật giáo xứ');
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Submit handler
  const onSubmit = (data: Record<string, unknown>) => {
    // Clean up empty strings to undefined
    const cleanedData = {
      ...data,
      address: data.address || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      foundingDate: data.foundingDate || undefined,
    };

    if (isEdit && parish) {
      updateMutation.mutate({
        id: parish.id,
        data: cleanedData as UpdateParishInput,
      });
    } else {
      createMutation.mutate(cleanedData as CreateParishInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa giáo xứ' : 'Thêm giáo xứ mới'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên giáo xứ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Giáo xứ Chính Tòa" {...field} />
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

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0262 3123 456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="giaoxu@gpbmt.org"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Founding Date */}
            <FormField
              control={form.control}
              name="foundingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày thành lập</FormLabel>
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
