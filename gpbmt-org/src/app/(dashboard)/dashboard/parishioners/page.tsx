'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { ParishionerForm } from '@/components/forms/parishioner-form';
import { useParishioners, useDeleteParishioner } from '@/queries/parishioners';
import { useParishes } from '@/queries/parishes';
import { usePermissions } from '@/hooks/use-permissions';
import type { ParishionerFilters } from '@/queries/keys';
import type { ParishionerResponse } from '@/types/api.types';
import { Gender } from '@/types/models.types';

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

/**
 * Format gender for display
 */
function formatGender(gender: string | null): string {
  if (!gender) return '-';
  return gender === Gender.MALE ? 'Nam' : 'Nữ';
}

export default function ParishionersPage() {
  const { parish: userParish, isParishScoped, can } = usePermissions();

  // Filters state
  const [filters, setFilters] = useState<ParishionerFilters>({
    search: '',
    parish: undefined,
    gender: undefined,
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  // Set parish filter for parish-scoped users
  useEffect(() => {
    if (isParishScoped && userParish) {
      setFilters((prev) => ({ ...prev, parish: userParish }));
    }
  }, [isParishScoped, userParish]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedParishioner, setSelectedParishioner] =
    useState<ParishionerResponse | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    parishioner: ParishionerResponse | null;
  }>({ open: false, parishioner: null });

  // Fetch parishes for filter dropdown
  const { data: parishesData } = useParishes({ isActive: true });
  const parishes = parishesData?.data?.parishes || [];

  // Data fetching
  const { data, isLoading, refetch } = useParishioners({
    ...filters,
    page,
    limit,
  });

  const parishioners = data?.data?.parishioners || [];
  const meta = data?.meta;

  // Mutations
  const deleteMutation = useDeleteParishioner({
    onSuccess: () => {
      toast.success('Đã xóa giáo dân');
      setDeleteDialog({ open: false, parishioner: null });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa giáo dân');
    },
  });

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  }, []);

  const handleParishFilter = useCallback(
    (value: string) => {
      // Parish-scoped users cannot change parish filter
      if (isParishScoped) return;
      setFilters((prev) => ({
        ...prev,
        parish: value === 'all' ? undefined : value,
      }));
      setPage(1);
    },
    [isParishScoped]
  );

  const handleGenderFilter = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      gender: value === 'all' ? undefined : value,
    }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleAddParishioner = useCallback(() => {
    setSelectedParishioner(null);
    setFormOpen(true);
  }, []);

  const handleEditParishioner = useCallback((parishioner: ParishionerResponse) => {
    setSelectedParishioner(parishioner);
    setFormOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.parishioner) {
      deleteMutation.mutate(deleteDialog.parishioner.id);
    }
  }, [deleteDialog.parishioner, deleteMutation]);

  const canDelete = can('parishioners.delete');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Giáo dân</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý thông tin giáo dân trong Giáo phận
          </p>
        </div>
        <Button onClick={handleAddParishioner}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm giáo dân
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo họ tên, tên thánh..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Parish filter - hidden for parish-scoped users */}
        {!isParishScoped && (
          <Select
            value={filters.parish || 'all'}
            onValueChange={handleParishFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Giáo xứ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giáo xứ</SelectItem>
              {parishes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.gender || 'all'}
          onValueChange={handleGenderFilter}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={Gender.MALE}>Nam</SelectItem>
            <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Parishioners Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Tên thánh</TableHead>
              <TableHead>Giáo xứ</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : parishioners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              parishioners.map((parishioner) => (
                <TableRow key={parishioner.id}>
                  <TableCell className="font-medium">
                    {parishioner.fullName}
                  </TableCell>
                  <TableCell>{parishioner.baptismName || '-'}</TableCell>
                  <TableCell>{parishioner.parish?.name || '-'}</TableCell>
                  <TableCell>{formatDate(parishioner.dateOfBirth)}</TableCell>
                  <TableCell>{formatGender(parishioner.gender)}</TableCell>
                  <TableCell>{parishioner.phone || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditParishioner(parishioner)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              parishioner,
                            })
                          }
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
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
            giáo dân
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

      {/* Parishioner Form Dialog */}
      <ParishionerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        parishioner={selectedParishioner}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa giáo dân</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa giáo dân &quot;{deleteDialog.parishioner?.fullName}
              &quot;? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, parishioner: null })
              }
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xử lý...' : 'Xác nhận xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
