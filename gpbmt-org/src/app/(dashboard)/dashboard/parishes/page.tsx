'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ParishForm } from '@/components/forms/parish-form';
import {
  useParishes,
  useDeleteParish,
  useActivateParish,
  useDeactivateParish,
} from '@/queries/parishes';
import type { ParishFilters } from '@/queries/keys';
import type { ParishFullResponse } from '@/types/api.types';

/**
 * Format date for display in Vietnamese format
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function ParishesPage() {
  // Filters state
  const [filters, setFilters] = useState<ParishFilters>({
    search: '',
    isActive: undefined,
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedParish, setSelectedParish] =
    useState<ParishFullResponse | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'delete' | 'activate' | 'deactivate';
    parish: ParishFullResponse | null;
  }>({ open: false, type: 'delete', parish: null });

  // Data fetching
  const { data, isLoading, refetch } = useParishes({
    ...filters,
    page,
    limit,
  } as ParishFilters);

  const parishes = (data?.data?.parishes || []) as ParishFullResponse[];
  const meta = data?.meta;

  // Mutations
  const deleteMutation = useDeleteParish({
    onSuccess: () => {
      toast.success('Đã xóa giáo xứ');
      setConfirmDialog({ open: false, type: 'delete', parish: null });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa giáo xứ');
    },
  });

  const activateMutation = useActivateParish({
    onSuccess: () => {
      toast.success('Đã kích hoạt giáo xứ');
      setConfirmDialog({ open: false, type: 'activate', parish: null });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });

  const deactivateMutation = useDeactivateParish({
    onSuccess: () => {
      toast.success('Đã vô hiệu hóa giáo xứ');
      setConfirmDialog({ open: false, type: 'deactivate', parish: null });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      isActive: value === 'all' ? undefined : value === 'active',
    }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleAddParish = useCallback(() => {
    setSelectedParish(null);
    setFormOpen(true);
  }, []);

  const handleEditParish = useCallback((parish: ParishFullResponse) => {
    setSelectedParish(parish);
    setFormOpen(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    const { type, parish } = confirmDialog;
    if (!parish) return;

    if (type === 'delete') {
      deleteMutation.mutate(parish.id);
    } else if (type === 'activate') {
      activateMutation.mutate(parish.id);
    } else if (type === 'deactivate') {
      deactivateMutation.mutate(parish.id);
    }
  }, [confirmDialog, deleteMutation, activateMutation, deactivateMutation]);

  const isProcessing =
    deleteMutation.isPending ||
    activateMutation.isPending ||
    deactivateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Giáo xứ</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý thông tin các giáo xứ trong Giáo phận
          </p>
        </div>
        <Button onClick={handleAddParish}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm giáo xứ
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên giáo xứ..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={
            filters.isActive === undefined
              ? 'all'
              : filters.isActive
                ? 'active'
                : 'inactive'
          }
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Đã vô hiệu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Parishes Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên giáo xứ</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ngày thành lập</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[120px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : parishes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              parishes.map((parish) => (
                <TableRow key={parish.id}>
                  <TableCell className="font-medium">{parish.name}</TableCell>
                  <TableCell>{parish.address || '-'}</TableCell>
                  <TableCell>{parish.phone || '-'}</TableCell>
                  <TableCell>{parish.email || '-'}</TableCell>
                  <TableCell>{formatDate(parish.foundingDate)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        parish.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {parish.isActive ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditParish(parish)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {parish.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              type: 'deactivate',
                              parish,
                            })
                          }
                          title="Vô hiệu hóa"
                        >
                          <XCircle className="h-4 w-4 text-orange-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              type: 'activate',
                              parish,
                            })
                          }
                          title="Kích hoạt"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            type: 'delete',
                            parish,
                          })
                        }
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(meta.page - 1) * meta.limit + 1} -{' '}
            {Math.min(meta.page * meta.limit, meta.total)} trong số {meta.total}{' '}
            giáo xứ
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
            >
              Trước
            </Button>
            <span className="text-sm">
              Trang {meta.page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Parish Form Dialog */}
      <ParishForm
        open={formOpen}
        onOpenChange={setFormOpen}
        parish={selectedParish}
        onSuccess={() => refetch()}
      />

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'delete' && 'Xóa giáo xứ'}
              {confirmDialog.type === 'activate' && 'Kích hoạt giáo xứ'}
              {confirmDialog.type === 'deactivate' && 'Vô hiệu hóa giáo xứ'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'delete' &&
                `Bạn có chắc muốn xóa giáo xứ "${confirmDialog.parish?.name}"? Hành động này không thể hoàn tác.`}
              {confirmDialog.type === 'activate' &&
                `Bạn có chắc muốn kích hoạt lại giáo xứ "${confirmDialog.parish?.name}"?`}
              {confirmDialog.type === 'deactivate' &&
                `Bạn có chắc muốn vô hiệu hóa giáo xứ "${confirmDialog.parish?.name}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, type: 'delete', parish: null })
              }
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              variant={confirmDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
