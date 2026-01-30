# Buon Ma Thuot Diocese Management System (GPBMT.ORG) - Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Comprehensively digitize financial, HR, and administrative management processes for Buon Ma Thuot Diocese
- Provide RBAC authorization system with 5 user roles aligned with diocese organizational structure
- Ensure transparency and traceability for all financial transactions through audit logging
- Automate approval workflows for transactions, payroll, and rental contracts

### Background Context
Buon Ma Thuot Diocese currently manages multiple parishes, parishioners, and financial funds using manual methods. Digitization will increase transparency, reduce errors, and support internal auditing. The system needs to manage 11 fund types in 3 groups (CBCV, Diocese Office, Internal), integrate HR module with payroll that auto-generates transactions, and administration module with asset rental contracts.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-30 | 1.0 | Initial draft based on brainstorm | @planner |

## Requirements

### Functional
- FR1: CRUD management for parishes and parishioners with hierarchical relationships
- FR2: Manage 11 fund types with balances auto-calculated from transactions
- FR3: Manage income/expense categories with 2 system categories that cannot be deleted (Employee Salary, Asset Rental Income)
- FR4: Manage bank accounts with auto-updated balances
- FR5: Manage sender/receiver entities with searchable select component and quick-add feature
- FR6: CRUD transactions (Income/Expense/Adjustment) with 2-level approval workflow
- FR7: Upload and preview images/documents for transactions
- FR8: Advanced transaction filtering with multiple criteria and date range
- FR9: Manage employees with labor contracts (fixed-term/indefinite)
- FR10: Monthly payroll that auto-generates expense transactions upon approval
- FR11: Manage assets with image uploads
- FR12: Rental contracts that auto-generate income transactions upon payment
- FR13: RBAC authorization system with 5 roles
- FR14: Audit log recording all CRUD operations on important entities

### Non Functional
- NFR1: System must be responsive, working well on desktop and tablet
- NFR2: API response time < 500ms for standard CRUD operations
- NFR3: Support minimum 50 concurrent users
- NFR4: Data must be backed up daily
- NFR5: Encrypt sensitive data (passwords, bank account information)
- NFR6: System availability of 99.5%

## User Interface Design Goals

### Overall UX Vision
Professional admin interface, easy to use for non-technical users (parish priests, secretaries). Prioritize clarity and simplicity with forms organized logically following business workflows.

### Key Interaction Paradigms
- Sidebar navigation with menu auto-showing/hiding based on user permissions
- Table-based data display with pagination, search, and advanced filtering
- Modal forms for quick-add and inline editing
- Tab-based views for transaction types (Income/Expense/Adjustment)
- Approval workflow with clear status indicators

### Core Screens and Views
- Dashboard: Role-based overview statistics
- Parishes & Parishioners: List view with search and filter
- Finance: Tab view (Funds, Categories, Bank Accounts, Entities, Transactions)
- HR: List view with monthly payroll
- Administration: Tab view (Assets, Contracts)
- System: User management, Audit log

### Accessibility
WCAG AA

### Branding
Clean, professional with color tones appropriate for religious organization (neutral, calm colors)

### Target Device and Platforms
Web Responsive (Desktop-first, tablet support)

## Technical Assumptions

### Repository Structure
Monorepo
Rationale: Single codebase with Next.js fullstack simplifies deployment, enables shared types, and reduces complexity

### Service Architecture
Monolith
Rationale: Medium-scale system (~50 users), no need for microservices complexity. Next.js fullstack with API routes provides clean architecture that's easy to develop, deploy, and maintain

### Testing Requirements
Unit + Integration
Rationale: Unit tests for critical business logic (balance calculations, approval workflows). Integration tests for API routes and database operations

### Additional Technical Assumptions and Requests
- **Framework:** Next.js 15+ (App Router, Server Components, API Routes)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** MongoDB with Mongoose ODM
- **File Storage:** Cloudinary
- **Form Management:** React Hook Form + Yup validation
- **Data Tables:** TanStack React Table
- **Server State:** TanStack React Query
- **Authentication:** NextAuth.js with JWT
- **Deployment:** Vercel (recommended) or Docker

## Epic List

**Epic 1: Foundation & Authentication**
Set up project infrastructure, authentication, and basic RBAC authorization

**Epic 2: Parish & Parishioner Management**
Module for managing parishes and parishioners with hierarchical relationships

**Epic 3: Finance - Master Data**
Finance module master data (Funds, Categories, Bank Accounts, Entities)

**Epic 4: Finance - Transaction Management**
Transaction management module with approval workflow and file upload integration

**Epic 5: HR & Payroll**
HR and payroll module with auto-generated transactions

**Epic 6: Administration - Assets & Contracts**
Administration module (Assets, Rental Contracts) with transaction integration

**Epic 7: System - Audit & Dashboard**
Audit logging and statistics dashboard

## Epic 1: Foundation & Authentication

**Goal:** Set up project structure, database schema, JWT authentication, and RBAC authorization with 5 roles. This is the foundation for the entire system.

### Story 1.1: Project Setup & Database Schema
**As a** developer,
**I want** a properly configured Next.js 15+ fullstack project with MongoDB,
**so that** I can start building features on a solid foundation.

**Acceptance Criteria:**
1. Given Next.js project setup, When I run `npm install && npm run dev`, Then the application starts successfully
2. Given MongoDB connection, When the app starts, Then database connection is established
3. Given Mongoose schemas, When I run seed script, Then core collections (User, Role, Parish) are created
4. Given ESLint, Prettier, and TypeScript config, When I run lint, Then code style is enforced consistently
5. Given shadcn/ui setup, When I import components, Then they render with Tailwind styling

### Story 1.2: Authentication System
**As a** user,
**I want** to login with email and password,
**so that** I can access the system securely.

**Acceptance Criteria:**
1. Given valid credentials, When I submit login form, Then I'm authenticated and redirected to dashboard
2. Given invalid credentials, When I submit login form, Then I see appropriate error message
3. Given expired session, When I make request, Then I'm redirected to login page
4. Given logged in user, When I click logout, Then session is invalidated and I'm redirected to login
5. Given login form, When I submit, Then React Hook Form validates with Yup schema

### Story 1.3: RBAC Implementation
**As an** administrator,
**I want** to assign roles to users,
**so that** they have appropriate access to system features.

**Acceptance Criteria:**
1. Given 5 predefined roles (Super Admin, Diocese Manager, Parish Priest, Accountant, Parish Secretary), When I assign role to user, Then their permissions are updated
2. Given user with specific role, When they access sidebar, Then only permitted menu items are visible
3. Given user without permission, When they access restricted API route, Then they receive 403 Forbidden
4. Given user without permission, When they navigate to restricted URL, Then they're redirected to Dashboard with error

### Story 1.4: User Management
**As a** Super Admin,
**I want** to manage user accounts,
**so that** I can control system access.

**Acceptance Criteria:**
1. Given user management page, When I create new user, Then account is created with specified role and parish assignment
2. Given existing user, When I deactivate account, Then user cannot login but data is preserved
3. Given existing user, When I reset password, Then temporary password is set and user must change on next login
4. Given user list with TanStack Table, When I filter by role or parish, Then only matching users are displayed

## Epic 2: Parish & Parishioner Management

**Goal:** Implement CRUD operations for parishes and parishioners with hierarchical relationship. Each parishioner must belong to exactly one parish.

### Story 2.1: Parish Management
**As an** administrator,
**I want** to manage parish information,
**so that** I can maintain accurate parish records.

**Acceptance Criteria:**
1. Given parish list page, When I click add, Then I can create new parish with name, address, phone, and founding date
2. Given existing parish, When I edit details, Then changes are saved and reflected in list
3. Given parish with parishioners, When I try to delete, Then system prevents deletion with warning
4. Given parish list with TanStack Table, When I search by name, Then matching parishes are displayed

### Story 2.2: Parishioner Management
**As a** parish secretary,
**I want** to manage parishioner records,
**so that** I can maintain accurate membership data.

**Acceptance Criteria:**
1. Given parishioner form, When I create record, Then parishioner is created with required parish assignment
2. Given parishioner list, When I filter by parish, Then only parishioners from that parish are shown
3. Given Parish Priest role, When I view parishioners, Then I only see parishioners from my assigned parish
4. Given parishioner details, When I update info, Then changes are saved with audit log entry

## Epic 3: Finance - Master Data

**Goal:** Implement financial master data management including 11 funds (3 groups), income/expense categories, bank accounts, and sender/receiver entities. Each with automatic balance calculation where applicable.

### Story 3.1: Fund Management
**As an** accountant,
**I want** to manage the 11 diocese funds,
**so that** I can track financial contributions by purpose.

**Acceptance Criteria:**
1. Given fund list, When page loads, Then all 11 funds are displayed with current balance
2. Given fund form, When I create/edit fund, Then I can set name, group (A/B/C), and description
3. Given fund with transactions, When I view details, Then balance is calculated as SUM(income) - SUM(expense) + SUM(adjustment)
4. Given fund list with TanStack Table, When I filter by group, Then only funds in that group are displayed

### Story 3.2: Income/Expense Category Management
**As an** accountant,
**I want** to manage income/expense categories,
**so that** transactions can be properly classified.

**Acceptance Criteria:**
1. Given category list, When I create category, Then I can set name, type (income/expense), and parent category
2. Given system categories (Employee Salary, Asset Rental Income), When I try to delete or deactivate, Then system prevents action with warning
3. Given category with transactions, When I view details, Then transaction count is displayed
4. Given category list, When I toggle status, Then category is activated/deactivated

### Story 3.3: Bank Account Management
**As an** accountant,
**I want** to manage diocese bank accounts,
**so that** transfer transactions can be properly tracked.

**Acceptance Criteria:**
1. Given bank account form, When I create account, Then I can set bank name, account number, account holder, and purpose
2. Given account list, When page loads, Then each account shows current balance from transactions
3. Given account with transactions, When I view details, Then balance is calculated from transfer transactions
4. Given account list, When I set default account, Then that account is pre-selected in transaction forms

### Story 3.4: Sender/Receiver Entity Management
**As an** accountant,
**I want** to manage sender/receiver entities,
**so that** transaction counterparties are properly tracked.

**Acceptance Criteria:**
1. Given entity form, When I create entity, Then I can set name, phone (required), and bank account info
2. Given transaction form, When I select entity field, Then I can search existing entities or quick-add new one via modal
3. Given entity with incomplete bank info, When creating transfer transaction, Then system warns about missing info
4. Given entity list, When I search by name or phone, Then matching entities are displayed

## Epic 4: Finance - Transaction Management

**Goal:** Implement core transaction management with three types (Income, Expense, Adjustment), approval workflow, file attachments via Cloudinary, and advanced filtering. Integration with fund and bank account balances.

### Story 4.1: Transaction CRUD
**As a** user with transaction permission,
**I want** to create and manage financial transactions,
**so that** all financial activities are recorded.

**Acceptance Criteria:**
1. Given transaction form with React Hook Form, When I create income/expense, Then I must select fund, category, entity, and payment method
2. Given transfer payment method, When I save transaction, Then I must select a bank account
3. Given transaction list, When page loads, Then transactions are displayed in tabs (Income/Expense/Adjustment)
4. Given pending transaction, When I edit or delete, Then changes are saved; Given approved transaction, Then edit/delete is blocked

### Story 4.2: Adjustment Transactions
**As an** accountant,
**I want** to create adjustment transactions,
**so that** I can correct fund balances with proper documentation.

**Acceptance Criteria:**
1. Given adjustment form, When I create adjustment, Then I must select type (Increase/Decrease) and provide reason
2. Given adjustment, When approved, Then fund balance is updated accordingly
3. Given adjustment list, When I view details, Then adjustment type and reason are clearly displayed
4. Given adjustment history, When I filter by fund, Then only adjustments for that fund are shown

### Story 4.3: Transaction Approval Workflow
**As a** Diocese Manager or Super Admin,
**I want** to approve or reject transactions,
**so that** only valid transactions affect balances.

**Acceptance Criteria:**
1. Given pending transactions, When I view approval queue, Then I can approve individually or in bulk
2. Given transaction approval, When I approve, Then transaction is finalized and balances are updated
3. Given transaction rejection, When I reject with reason, Then transaction is marked rejected and creator is notified
4. Given approved transaction, When I cancel approval (as Super Admin/Diocese Manager), Then balances are reversed

### Story 4.4: File Attachments with Cloudinary
**As a** transaction creator,
**I want** to attach supporting documents,
**so that** transactions have proper documentation.

**Acceptance Criteria:**
1. Given transaction form, When I upload images/documents, Then files are uploaded to Cloudinary and attached to transaction
2. Given attached files, When I click preview, Then images display in lightbox and documents open in new tab
3. Given file upload, When file exceeds size limit (10MB), Then user sees error with allowed size
4. Given transaction details, When I view attachments, Then all Cloudinary URLs are listed with preview thumbnails

### Story 4.5: Advanced Filtering
**As a** finance user,
**I want** to filter transactions by multiple criteria,
**so that** I can find specific transactions quickly.

**Acceptance Criteria:**
1. Given transaction list with TanStack Table, When I apply date range filter, Then only transactions in that period are shown
2. Given filter panel, When I select multiple criteria (fund, category, status, entity), Then results match all criteria
3. Given filter state, When I clear filters, Then all transactions are displayed again
4. Given export function, When I export filtered results, Then CSV file downloads with matching data

## Epic 5: HR & Payroll

**Goal:** Implement employee management with labor contracts and monthly payroll generation. Approved payroll automatically creates salary expense transactions.

### Story 5.1: Employee Management
**As an** HR user,
**I want** to manage employee records,
**so that** I can track diocese staff.

**Acceptance Criteria:**
1. Given employee form, When I create employee, Then I can set personal info and position
2. Given employee list with TanStack Table, When I filter by contract status, Then only matching employees are shown
3. Given employee details, When I view profile, Then contract history is displayed
4. Given employee, When I update basic info, Then changes are saved with audit log

### Story 5.2: Labor Contract Management
**As an** HR user,
**I want** to manage employee contracts,
**so that** salary and employment terms are documented.

**Acceptance Criteria:**
1. Given employee, When I create contract, Then I can set type (fixed/indefinite), salary, start date, and end date
2. Given fixed-term contract, When approaching expiry (30 days), Then system shows warning indicator
3. Given employee with active contract, When I try to create new contract, Then system prevents overlap
4. Given contract list, When I view details, Then salary and terms are clearly displayed

### Story 5.3: Monthly Payroll Generation
**As an** accountant,
**I want** to generate monthly payroll,
**so that** employees are paid correctly.

**Acceptance Criteria:**
1. Given payroll page, When I select month without existing payroll, Then I can generate new payroll
2. Given payroll generation, When I generate, Then all employees with active contracts are included
3. Given pending payroll, When I edit line items, Then I can adjust allowances, deductions, and advances
4. Given month with existing payroll, When I try to generate, Then system prevents duplicate

### Story 5.4: Payroll Approval and Transaction Creation
**As a** Diocese Manager,
**I want** to approve payroll,
**so that** salary payments are authorized and recorded.

**Acceptance Criteria:**
1. Given pending payroll, When I approve, Then payroll status changes to approved (read-only)
2. Given approval process, When employee not in sender/receiver list, Then system auto-adds from employee info
3. Given approved payroll, When approval completes, Then expense transactions are created for each employee
4. Given created transactions, When I view, Then they link back to payroll and employee record

## Epic 6: Administration - Assets & Contracts

**Goal:** Implement asset management and rental contract management. Rental payments automatically create income transactions.

### Story 6.1: Asset Management
**As an** administrator,
**I want** to manage diocese assets,
**so that** property inventory is tracked.

**Acceptance Criteria:**
1. Given asset form, When I create asset, Then I can set type, area, value, status, and upload images to Cloudinary
2. Given asset list with TanStack Table, When I filter by status (available/rented/in-use), Then matching assets are shown
3. Given asset images, When I upload multiple, Then all images display in gallery view from Cloudinary
4. Given asset with active rental, When I try to delete, Then system prevents deletion

### Story 6.2: Rental Contract Management
**As an** administrator,
**I want** to manage rental contracts,
**so that** leased property income is tracked.

**Acceptance Criteria:**
1. Given rental form with React Hook Form, When I create contract, Then I must provide tenant info, asset, duration, deposit, and monthly rent
2. Given active contract, When I edit, Then only duration and rent amount can be modified
3. Given contract list, When contract expires soon (30 days), Then warning indicator is displayed
4. Given contract details, When I upload documents, Then attachments are stored in Cloudinary

### Story 6.3: Rental Payment Processing
**As an** accountant,
**I want** to record rental payments,
**so that** income is tracked with proper documentation.

**Acceptance Criteria:**
1. Given active contract, When I record payment, Then income transaction is created linked to contract
2. Given payment form, When selecting fund, Then I can choose which fund receives the income
3. Given transfer payment, When tenant or diocese lacks bank info, Then system blocks transfer option with guidance message
4. Given payment history, When I view contract, Then all payments are listed with status

## Epic 7: System - Audit & Dashboard

**Goal:** Implement comprehensive audit logging for traceability and role-based dashboards for management overview.

### Story 7.1: Audit Log System
**As a** Super Admin,
**I want** to view system audit logs,
**so that** I can trace all user actions for accountability.

**Acceptance Criteria:**
1. Given CRUD operation on important entity, When action completes, Then audit log entry is created automatically
2. Given audit log entry, When I view details, Then I see user, action, timestamp, IP, old value, new value
3. Given audit log list with TanStack Table, When I filter by user/action/entity/date range, Then matching entries are shown
4. Given old/new values, When I view detail, Then changes are displayed in JSON diff or comparison table format

### Story 7.2: Dashboard - Super Admin & Diocese Manager
**As a** Super Admin or Diocese Manager,
**I want** to see diocese-wide statistics,
**so that** I can monitor overall financial health.

**Acceptance Criteria:**
1. Given dashboard, When page loads, Then summary cards show total income, expense, and net by period
2. Given dashboard, When I view charts, Then income/expense trend by month is visualized
3. Given dashboard, When I view pending approvals, Then count of pending transactions and payrolls is shown
4. Given dashboard, When I click summary card, Then I'm navigated to detailed list view

### Story 7.3: Dashboard - Parish Level
**As a** Parish Priest,
**I want** to see my parish statistics,
**so that** I can monitor parish financial activities.

**Acceptance Criteria:**
1. Given Parish Priest dashboard, When page loads, Then only my parish data is shown
2. Given parish stats, When I view summary, Then income/expense for my parish is displayed
3. Given recent activity, When I view list, Then my recent transactions and their status are shown
4. Given parishioner count, When I view stats, Then total parishioners in my parish is displayed

## Checklist Results Report

Skipped - Will run after user approval

## Next Steps

### Architect Prompt
Run `*create-architecture` with this PRD to generate the technical architecture document including:
- MongoDB schema design with Mongoose
- Next.js API route specifications
- Component architecture with shadcn/ui
- Cloudinary integration details
- Security implementation with NextAuth.js
