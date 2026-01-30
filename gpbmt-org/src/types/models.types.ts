import type { Document, Types } from 'mongoose';

// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIOCESE_MANAGER = 'DIOCESE_MANAGER',
  PARISH_PRIEST = 'PARISH_PRIEST',
  ACCOUNTANT = 'ACCOUNTANT',
  PARISH_SECRETARY = 'PARISH_SECRETARY',
}

// Role Interface
export interface IRole {
  _id: Types.ObjectId;
  name: UserRole;
  permissions: string[];
  createdAt: Date;
}

export interface IRoleDocument extends IRole, Document {
  _id: Types.ObjectId;
}

// Parish Interface
export interface IParish {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  foundingDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParishDocument extends IParish, Document {
  _id: Types.ObjectId;
}

// User Interface
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  role: Types.ObjectId | IRole;
  parish?: Types.ObjectId | IParish;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

// Permission codes
export const PERMISSIONS = {
  // User management
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  USERS_DELETE: 'users.delete',

  // Parish management
  PARISHES_READ: 'parishes.read',
  PARISHES_WRITE: 'parishes.write',
  PARISHES_DELETE: 'parishes.delete',

  // Parishioner management
  PARISHIONERS_READ: 'parishioners.read',
  PARISHIONERS_WRITE: 'parishioners.write',
  PARISHIONERS_DELETE: 'parishioners.delete',

  // Transaction management
  TRANSACTIONS_READ: 'transactions.read',
  TRANSACTIONS_CREATE: 'transactions.create',
  TRANSACTIONS_APPROVE: 'transactions.approve',
  TRANSACTIONS_DELETE: 'transactions.delete',

  // Payroll management
  PAYROLLS_READ: 'payrolls.read',
  PAYROLLS_MANAGE: 'payrolls.manage',
  PAYROLLS_APPROVE: 'payrolls.approve',

  // Asset management
  ASSETS_READ: 'assets.read',
  ASSETS_WRITE: 'assets.write',
  ASSETS_DELETE: 'assets.delete',

  // Audit logs
  AUDIT_LOGS_READ: 'audit-logs.read',
} as const;

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [UserRole.DIOCESE_MANAGER]: [
    PERMISSIONS.PARISHES_READ,
    PERMISSIONS.PARISHES_WRITE,
    PERMISSIONS.PARISHIONERS_READ,
    PERMISSIONS.PARISHIONERS_WRITE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.TRANSACTIONS_CREATE,
    PERMISSIONS.TRANSACTIONS_APPROVE,
    PERMISSIONS.PAYROLLS_READ,
    PERMISSIONS.PAYROLLS_APPROVE,
    PERMISSIONS.ASSETS_READ,
    PERMISSIONS.ASSETS_WRITE,
  ],
  [UserRole.PARISH_PRIEST]: [
    PERMISSIONS.PARISHES_READ,
    PERMISSIONS.PARISHIONERS_READ,
    PERMISSIONS.PARISHIONERS_WRITE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.TRANSACTIONS_CREATE,
    PERMISSIONS.ASSETS_READ,
  ],
  [UserRole.ACCOUNTANT]: [
    PERMISSIONS.PARISHES_READ,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.TRANSACTIONS_CREATE,
    PERMISSIONS.PAYROLLS_READ,
    PERMISSIONS.PAYROLLS_MANAGE,
    PERMISSIONS.ASSETS_READ,
    PERMISSIONS.ASSETS_WRITE,
  ],
  [UserRole.PARISH_SECRETARY]: [
    PERMISSIONS.PARISHES_READ,
    PERMISSIONS.PARISHIONERS_READ,
    PERMISSIONS.PARISHIONERS_WRITE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.TRANSACTIONS_CREATE,
  ],
};
