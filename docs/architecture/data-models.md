# Data Models

## User
**Purpose:** System users with authentication and role assignment

**Key Attributes:**
- _id: ObjectId (PK)
- email: string (unique, required)
- passwordHash: string (required)
- name: string (required)
- phone: string
- role: ObjectId (ref: Role)
- parish: ObjectId (ref: Parish, for Parish Priest/Secretary)
- isActive: boolean (default: true)
- mustChangePassword: boolean (default: false)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to one Role
- optionally belongs to one Parish

## Role
**Purpose:** Predefined user roles for RBAC

**Key Attributes:**
- _id: ObjectId (PK)
- name: string (enum: SUPER_ADMIN, DIOCESE_MANAGER, PARISH_PRIEST, ACCOUNTANT, PARISH_SECRETARY)
- permissions: string[] (list of permission codes)
- createdAt: Date

**Relationships:**
- has many Users

## Parish
**Purpose:** Diocese parish units

**Key Attributes:**
- _id: ObjectId (PK)
- name: string (required)
- address: string
- phone: string
- email: string
- foundingDate: Date
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many Parishioners
- has many Users (Parish Priest, Secretary)

## Parishioner
**Purpose:** Parish members/congregation

**Key Attributes:**
- _id: ObjectId (PK)
- parish: ObjectId (ref: Parish, required)
- fullName: string (required)
- baptismName: string
- dateOfBirth: Date
- gender: string (enum: MALE, FEMALE)
- phone: string
- address: string
- familyHead: ObjectId (ref: Parishioner, self-reference)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to one Parish
- optionally belongs to family (self-reference)

## Fund
**Purpose:** Diocese financial funds (11 types in 3 groups)

**Key Attributes:**
- _id: ObjectId (PK)
- name: string (required)
- code: string (unique)
- group: string (enum: GROUP_A, GROUP_B, GROUP_C)
- description: string
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many Transactions

**Virtual Fields:**
- balance: computed from transactions (income - expense + adjustments)

## Category
**Purpose:** Income/expense classification categories

**Key Attributes:**
- _id: ObjectId (PK)
- name: string (required)
- type: string (enum: INCOME, EXPENSE)
- parent: ObjectId (ref: Category, self-reference)
- isSystem: boolean (default: false, prevents deletion)
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- self-referential parent-child hierarchy
- has many Transactions

## BankAccount
**Purpose:** Diocese bank accounts for transfers

**Key Attributes:**
- _id: ObjectId (PK)
- bankName: string (required)
- accountNumber: string (required)
- accountHolder: string (required)
- purpose: string
- isDefault: boolean (default: false)
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many Transactions (as source/destination)

**Virtual Fields:**
- balance: computed from transfer transactions

## Entity
**Purpose:** Transaction counterparties (sender/receiver)

**Key Attributes:**
- _id: ObjectId (PK)
- name: string (required)
- phone: string (required)
- email: string
- address: string
- bankName: string
- bankAccountNumber: string
- bankAccountHolder: string
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many Transactions

## Transaction
**Purpose:** Financial transactions (income, expense, adjustment)

**Key Attributes:**
- _id: ObjectId (PK)
- transactionNumber: string (auto-generated, unique)
- type: string (enum: INCOME, EXPENSE, ADJUSTMENT)
- fund: ObjectId (ref: Fund, required)
- category: ObjectId (ref: Category, required)
- entity: ObjectId (ref: Entity, required)
- amount: number (required, positive)
- adjustmentType: string (enum: INCREASE, DECREASE, for adjustments only)
- adjustmentReason: string (for adjustments only)
- paymentMethod: string (enum: CASH, TRANSFER)
- bankAccount: ObjectId (ref: BankAccount, required if TRANSFER)
- description: string
- transactionDate: Date (required)
- attachments: string[] (Cloudinary URLs)
- status: string (enum: PENDING, APPROVED, REJECTED)
- rejectionReason: string
- approvedBy: ObjectId (ref: User)
- approvedAt: Date
- createdBy: ObjectId (ref: User, required)
- parish: ObjectId (ref: Parish, for parish-level transactions)
- sourceType: string (enum: MANUAL, PAYROLL, RENTAL)
- sourceId: ObjectId (ref to Payroll or RentalPayment)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to Fund, Category, Entity
- optionally belongs to BankAccount
- belongs to User (creator, approver)
- optionally linked to Payroll or RentalPayment

## Employee
**Purpose:** Diocese staff members

**Key Attributes:**
- _id: ObjectId (PK)
- fullName: string (required)
- dateOfBirth: Date
- gender: string (enum: MALE, FEMALE)
- phone: string (required)
- email: string
- address: string
- position: string (required)
- department: string
- bankName: string
- bankAccountNumber: string
- bankAccountHolder: string
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many Contracts
- has many PayrollItems

## Contract
**Purpose:** Employee labor contracts

**Key Attributes:**
- _id: ObjectId (PK)
- employee: ObjectId (ref: Employee, required)
- type: string (enum: FIXED_TERM, INDEFINITE)
- baseSalary: number (required)
- startDate: Date (required)
- endDate: Date (required for FIXED_TERM)
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to Employee

## Payroll
**Purpose:** Monthly payroll batch

**Key Attributes:**
- _id: ObjectId (PK)
- month: number (1-12, required)
- year: number (required)
- status: string (enum: DRAFT, APPROVED)
- totalAmount: number (computed)
- approvedBy: ObjectId (ref: User)
- approvedAt: Date
- createdBy: ObjectId (ref: User, required)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many PayrollItems
- generates many Transactions upon approval

**Indexes:**
- unique compound index on (month, year)

## PayrollItem
**Purpose:** Individual employee salary in payroll

**Key Attributes:**
- _id: ObjectId (PK)
- payroll: ObjectId (ref: Payroll, required)
- employee: ObjectId (ref: Employee, required)
- baseSalary: number (from contract)
- allowances: number (default: 0)
- deductions: number (default: 0)
- advances: number (default: 0)
- netSalary: number (computed: base + allowances - deductions - advances)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to Payroll
- belongs to Employee

## Asset
**Purpose:** Diocese property/assets

**Key Attributes:**
- _id: ObjectId (PK)
- name: string (required)
- type: string (enum: LAND, BUILDING, VEHICLE, EQUIPMENT, OTHER)
- area: number (for land/building)
- areaUnit: string (enum: SQM, HECTARE)
- value: number
- address: string
- description: string
- status: string (enum: AVAILABLE, RENTED, IN_USE)
- images: string[] (Cloudinary URLs)
- documents: string[] (Cloudinary URLs)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- has many RentalContracts

## RentalContract
**Purpose:** Asset rental agreements

**Key Attributes:**
- _id: ObjectId (PK)
- asset: ObjectId (ref: Asset, required)
- tenantName: string (required)
- tenantPhone: string (required)
- tenantEmail: string
- tenantAddress: string
- tenantBankName: string
- tenantBankAccountNumber: string
- tenantBankAccountHolder: string
- monthlyRent: number (required)
- deposit: number
- startDate: Date (required)
- endDate: Date (required)
- fund: ObjectId (ref: Fund, default fund for payments)
- documents: string[] (Cloudinary URLs)
- isActive: boolean (default: true)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to Asset
- belongs to Fund (default)
- has many RentalPayments

## RentalPayment
**Purpose:** Rental payment records

**Key Attributes:**
- _id: ObjectId (PK)
- rentalContract: ObjectId (ref: RentalContract, required)
- paymentDate: Date (required)
- amount: number (required)
- paymentMethod: string (enum: CASH, TRANSFER)
- bankAccount: ObjectId (ref: BankAccount)
- fund: ObjectId (ref: Fund)
- transaction: ObjectId (ref: Transaction, auto-created)
- createdBy: ObjectId (ref: User, required)
- createdAt: Date
- updatedAt: Date

**Relationships:**
- belongs to RentalContract
- creates one Transaction

## AuditLog
**Purpose:** System activity tracking

**Key Attributes:**
- _id: ObjectId (PK)
- user: ObjectId (ref: User, required)
- action: string (enum: CREATE, UPDATE, DELETE)
- entityType: string (e.g., 'Transaction', 'Payroll')
- entityId: ObjectId
- oldValue: Mixed (JSON of previous state)
- newValue: Mixed (JSON of new state)
- ipAddress: string
- userAgent: string
- createdAt: Date

**Relationships:**
- belongs to User
- references any entity

## TypeScript Interfaces
```typescript
// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIOCESE_MANAGER = 'DIOCESE_MANAGER',
  PARISH_PRIEST = 'PARISH_PRIEST',
  ACCOUNTANT = 'ACCOUNTANT',
  PARISH_SECRETARY = 'PARISH_SECRETARY',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export enum FundGroup {
  GROUP_A = 'GROUP_A', // CBCV funds
  GROUP_B = 'GROUP_B', // Diocese Office funds
  GROUP_C = 'GROUP_C', // Internal funds
}

// Core interfaces
export interface IUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: IRole | string;
  parish?: IParish | string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  _id: string;
  transactionNumber: string;
  type: TransactionType;
  fund: IFund | string;
  category: ICategory | string;
  entity: IEntity | string;
  amount: number;
  adjustmentType?: 'INCREASE' | 'DECREASE';
  adjustmentReason?: string;
  paymentMethod: PaymentMethod;
  bankAccount?: IBankAccount | string;
  description?: string;
  transactionDate: Date;
  attachments: string[];
  status: TransactionStatus;
  rejectionReason?: string;
  approvedBy?: IUser | string;
  approvedAt?: Date;
  createdBy: IUser | string;
  parish?: IParish | string;
  sourceType?: 'MANUAL' | 'PAYROLL' | 'RENTAL';
  sourceId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```
