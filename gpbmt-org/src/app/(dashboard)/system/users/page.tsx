'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  MoreHorizontal,
  UserCog,
  KeyRound,
  UserX,
  UserCheck,
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
import { UserForm } from '@/components/forms/user-form';
import {
  useUsers,
  useDeactivateUser,
  useActivateUser,
  useResetPassword,
} from '@/queries/users';
import { useRoles } from '@/queries/roles';
import { useParishes } from '@/queries/parishes';
import type { UserFilters } from '@/lib/validations/user.schema';
import type { UserResponse } from '@/types/api.types';

// Role display names in Vietnamese
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  SUPER_ADMIN: 'Quản trị viên',
  DIOCESE_MANAGER: 'Quản lý Giáo phận',
  PARISH_PRIEST: 'Linh mục Giáo xứ',
  ACCOUNTANT: 'Kế toán',
  PARISH_SECRETARY: 'Thư ký Giáo xứ',
};

export default function UsersPage() {
  // Filters state
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    roleId: undefined,
    parishId: undefined,
    isActive: undefined,
    page: 1,
    limit: 20,
  });

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'deactivate' | 'activate' | 'reset-password';
    user: UserResponse | null;
  }>({ open: false, type: 'deactivate', user: null });
  const [resetPasswordResult, setResetPasswordResult] = useState<{
    open: boolean;
    password: string;
  }>({ open: false, password: '' });

  // Data fetching
  const { data, isLoading, refetch } = useUsers(filters);
  const { data: rolesData } = useRoles();
  const { data: parishesData } = useParishes({ isActive: true });

  const users = data?.data?.users || [];
  const meta = data?.meta;
  const roles = rolesData?.data?.roles || [];
  const parishes = parishesData?.data?.parishes || [];

  // Mutations
  const deactivateMutation = useDeactivateUser({
    onSuccess: () => {
      toast.success('Đã vô hiệu hóa tài khoản');
      setConfirmDialog({ open: false, type: 'deactivate', user: null });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });

  const activateMutation = useActivateUser({
    onSuccess: () => {
      toast.success('Đã kích hoạt tài khoản');
      setConfirmDialog({ open: false, type: 'activate', user: null });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });

  const resetPasswordMutation = useResetPassword({
    onSuccess: (data) => {
      setConfirmDialog({ open: false, type: 'reset-password', user: null });
      setResetPasswordResult({
        open: true,
        password: data.data.temporaryPassword,
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, []);

  const handleRoleFilter = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      roleId: value === 'all' ? undefined : value,
      page: 1,
    }));
  }, []);

  const handleParishFilter = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      parishId: value === 'all' ? undefined : value,
      page: 1,
    }));
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      isActive: value === 'all' ? undefined : value === 'active',
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleAddUser = useCallback(() => {
    setSelectedUser(null);
    setFormOpen(true);
  }, []);

  const handleEditUser = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setFormOpen(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    const { type, user } = confirmDialog;
    if (!user) return;

    if (type === 'deactivate') {
      deactivateMutation.mutate(user.id);
    } else if (type === 'activate') {
      activateMutation.mutate(user.id);
    } else if (type === 'reset-password') {
      resetPasswordMutation.mutate({ id: user.id });
    }
  }, [
    confirmDialog,
    deactivateMutation,
    activateMutation,
    resetPasswordMutation,
  ]);

  const isProcessing =
    deactivateMutation.isPending ||
    activateMutation.isPending ||
    resetPasswordMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.roleId || 'all'}
          onValueChange={handleRoleFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {ROLE_DISPLAY_NAMES[role.name] || role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.parishId || 'all'}
          onValueChange={handleParishFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Giáo xứ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giáo xứ</SelectItem>
            {parishes.map((parish) => (
              <SelectItem key={parish.id} value={parish.id}>
                {parish.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Giáo xứ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role
                      ? ROLE_DISPLAY_NAMES[user.role.name] || user.role.name
                      : '-'}
                  </TableCell>
                  <TableCell>{user.parish?.name || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        title="Chỉnh sửa"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            type: 'reset-password',
                            user,
                          })
                        }
                        title="Đặt lại mật khẩu"
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      {user.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              type: 'deactivate',
                              user,
                            })
                          }
                          title="Vô hiệu hóa"
                        >
                          <UserX className="h-4 w-4 text-red-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              type: 'activate',
                              user,
                            })
                          }
                          title="Kích hoạt"
                        >
                          <UserCheck className="h-4 w-4 text-green-500" />
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
            người dùng
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

      {/* User Form Dialog */}
      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        onSuccess={() => refetch()}
      />

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'deactivate' && 'Vô hiệu hóa tài khoản'}
              {confirmDialog.type === 'activate' && 'Kích hoạt tài khoản'}
              {confirmDialog.type === 'reset-password' && 'Đặt lại mật khẩu'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'deactivate' &&
                `Bạn có chắc muốn vô hiệu hóa tài khoản "${confirmDialog.user?.name}"? Người dùng này sẽ không thể đăng nhập.`}
              {confirmDialog.type === 'activate' &&
                `Bạn có chắc muốn kích hoạt lại tài khoản "${confirmDialog.user?.name}"?`}
              {confirmDialog.type === 'reset-password' &&
                `Bạn có chắc muốn đặt lại mật khẩu cho "${confirmDialog.user?.name}"? Một mật khẩu tạm thời sẽ được tạo.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, type: 'deactivate', user: null })
              }
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              variant={confirmDialog.type === 'deactivate' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Result Dialog */}
      <Dialog
        open={resetPasswordResult.open}
        onOpenChange={(open) =>
          setResetPasswordResult((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mật khẩu tạm thời</DialogTitle>
            <DialogDescription>
              Vui lòng sao chép và gửi mật khẩu này cho người dùng. Họ sẽ phải
              đổi mật khẩu khi đăng nhập lần sau.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-md p-4 font-mono text-center text-lg">
            {resetPasswordResult.password}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(resetPasswordResult.password);
                toast.success('Đã sao chép mật khẩu');
              }}
            >
              Sao chép
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setResetPasswordResult({ open: false, password: '' })
              }
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
