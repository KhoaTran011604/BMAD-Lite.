# Diocese Management System (GPBMT.ORG)

# Product Requirements Document (PRD)

---

## Goals

- **G1:** Fully digitize financial management processes for Buon Ma Thuot Diocese, ensuring transparency and auditability
- **G2:** Standardize income/expense approval workflows with clear role-based access control (RBAC)
- **G3:** Unified management of parishes, parishioners, personnel, and assets on a single platform
- **G4:** Automate payroll processing and rental payment collection workflows

## Background Context

Buon Ma Thuot Diocese currently manages 11 different fund types, ranging from funds transferred to the Vietnam Bishops' Conference to internal funds and pastoral revenue sources. Current processes are mostly manual, making it difficult to track balances, prone to errors, and lacking transparency in income/expense approvals.

This system will address these issues by providing a centralized web platform, allowing different roles (from Super Admin to Parish Secretary) to perform their work within their authorized scope, with complete audit logs for auditing purposes.

## Change Log

| Date       | Version | Description                      | Author   |
| ---------- | ------- | -------------------------------- | -------- |
| 2026-01-29 | 1.0     | Initial draft from brainstorming | @planner |

---

## Functional Requirements

### Parish & Parishioner Module

- **FR1:** CRUD parishes with basic information (name, address, contact)
- **FR2:** CRUD parishioners with constraint: each parishioner must belong to a parish

### Finance Module

- **FR3:** CRUD fund categories (11 funds in 3 groups: VBCC, Diocese Office, Internal) with balance display using formula: Balance = Total Income - Total Expense + Adjustment Increase - Adjustment Decrease
- **FR4:** CRUD income/expense categories with 2 system categories that cannot be deleted: "Employee Salary" and "Asset Rental Income"
- **FR5:** CRUD bank accounts with balance display using similar formula
- **FR6:** CRUD sender/receiver entities with searchable select component and quick-add feature
- **FR7:** CRUD transactions with 3 types: Income, Expense, Adjustment
- **FR8:** Upload and preview images/documents for transactions
- **FR9:** Advanced transaction filtering: multiple criteria, date range
- **FR10:** Approval workflow: only "super admin" or "manager priest" can approve/unapprove
- **FR11:** Transactions can only be edited/deleted when pending; read-only after approval
- **FR12:** Validation: bank transfer transactions must have account info for both parties

### HR & Payroll Module

- **FR13:** CRUD personnel with basic info and employment contracts (fixed-term/indefinite, base salary)
- **FR14:** Generate monthly payroll (only 1 per month) for personnel with active contracts
- **FR15:** Payroll displays: name, base salary, allowances, attendance bonus, advances, net pay
- **FR16:** Payroll before approval: editable; after approval: read-only and auto-creates salary expense transactions
- **FR17:** Auto-add personnel to "Sender/Receiver" list when approving payroll (if not exists)

### Administration Module

- **FR18:** CRUD assets with info: type, area, value, status, images
- **FR19:** CRUD rental contracts with full tenant info (name, phone, address, email, bank account)
- **FR20:** Contracts can only edit: duration and rental amount
- **FR21:** Rental payments auto-create income transactions, linked to selected fund
- **FR22:** Validation: bank transfer payments must have complete account info for both parties

### System Module

- **FR23:** CRUD users with assignment to 1 of 5 roles: Super Admin, Manager Priest, Parish Priest, Accountant, Parish Secretary
- **FR24:** Assign users to specific parish (applies to Parish Priest, Parish Secretary)
- **FR25:** Activate/Deactivate accounts, Reset password
- **FR26:** Sidebar menu show/hide based on role; API endpoints check permissions
- **FR27:** Redirect to Dashboard + error message when accessing unauthorized URLs
- **FR28:** Audit log auto-records: Create/Update/Delete on important entities
- **FR29:** Audit log stores: old_value, new_value, IP, User Agent, timestamp
- **FR30:** Audit log: list view, filter by time/user/action/module, search

---

## Non-Functional Requirements

- **NFR1:** Responsive web design, optimized for desktop and tablet
- **NFR2:** Page load time < 3 seconds for lists with < 1000 records
- **NFR3:** Support minimum 50 concurrent users
- **NFR4:** Daily data backup, 30-day retention
- **NFR5:** HTTPS for all traffic
- **NFR6:** Session timeout: 8 hours for web
- **NFR7:** Password policy: minimum 8 characters, alphanumeric
- **NFR8:** Audit log retention: minimum 2 years
- **NFR9:** Full Vietnamese Unicode support (names, addresses, notes)
- **NFR10:** Export reports to Excel/PDF (post-MVP phase)

---

## User Interface Design Goals

### Overall UX Vision

Professional admin dashboard, easy to use for non-IT users (Parish Priests, Secretaries). Prioritize clarity, minimal steps, with intuitive data entry forms.

### Key Interaction Paradigms

- Sidebar navigation with role-based menu visibility
- CRUD operations via modal or drawer (no page navigation)
- Tables with pagination, sorting, filtering (TanStack Table)
- Quick-add component for lookup fields (sender/receiver)
- Approval workflow with clear Approve/Reject buttons

### Core Screens and Views

- **Dashboard:** Role-based overview statistics
- **Parishes:** List and parish details
- **Parishioners:** List, add/edit parishioners
- **Transactions:** 3 tabs (Income/Expense/Adjustment), filters, approval actions
- **Funds:** List with real-time balance
- **Bank Accounts:** List with balance
- **Personnel:** List, employment contracts
- **Payroll:** Monthly list, details, approval
- **Assets:** List with images
- **Rental Contracts:** List, payments
- **Users:** User management, role assignment
- **Audit Log:** Log list with filters

### Accessibility

WCAG AA (basic - contrast, keyboard navigation)

### Branding

Buon Ma Thuot Diocese logo, color scheme following guidelines (if available) or muted tones appropriate for religious organization

### Target Platforms

Web Responsive (Desktop-first, Tablet support)

---

## Technical Assumptions

### Repository Structure

**Monorepo**
Rationale: Next.js fullstack with shared types/validation. Monorepo simplifies dependency management and synchronized deployment.

### Service Architecture

**Monolith (Next.js Fullstack)**
Rationale: MVP with small team, clear domain boundaries. Next.js API routes provide simple backend without separate service.

### Testing Requirements

**Unit + Integration**
Rationale: Unit tests for business logic (balance calculation, approval workflow), Integration tests for API routes. E2E tests can be added post-MVP.

### Tech Stack

| Layer             | Technology               | Rationale                                     |
| ----------------- | ------------------------ | --------------------------------------------- |
| **Framework**     | Next.js 15+ (App Router) | Fullstack React, SSR/SSG, API routes          |
| **Language**      | TypeScript               | Type safety, better DX                        |
| **Styling**       | Tailwind CSS             | Utility-first, rapid UI development           |
| **UI Components** | shadcn/ui                | High-quality, customizable components         |
| **Database**      | MongoDB                  | Flexible schema, good for document-based data |
| **ODM**           | Mongoose                 | Schema validation, middleware support         |
| **Forms**         | React Hook Form + Yup    | Performant forms, schema validation           |
| **Tables**        | TanStack React Table     | Powerful, headless table component            |
| **Data Fetching** | TanStack React Query     | Caching, background updates, optimistic UI    |
| **Auth**          | NextAuth.js (Auth.js)    | Built-in Next.js integration, JWT             |
| **File Upload**   | Local storage (MVP)      | Simple for MVP, migrate to S3 later           |

### Additional Technical Assumptions

- **Node.js:** v20.x LTS
- **Package Manager:** pnpm
- **Deployment:** Vercel or Docker on VPS
- **Environment:** Development, Staging, Production

---

## Epic List

> **CRITICAL:** Please review and approve this Epic list before I detail each story.

**Epic 1: Foundation & Authentication**
Project setup, database schemas, authentication system, and RBAC implementation.

**Epic 2: Master Data Management**
CRUD for basic catalogs: Parishes, Parishioners, Fund Categories, Income/Expense Categories, Bank Accounts, Sender/Receiver Entities.

**Epic 3: Transaction Management (Core)**
Core feature: CRUD transactions (income/expense/adjustment), approval workflow, fund and account balance calculation.

**Epic 4: HR & Payroll**
Personnel management, employment contracts, payroll generation and approval, auto-create salary expense transactions.

**Epic 5: Asset & Rental Management**
Asset management, rental contracts, rental payments creating income transactions.

**Epic 6: Audit Log & Dashboard**
Automatic audit logging, log viewing and search, basic statistics dashboard.

---

## Epic Details

---

### Epic 1: Foundation & Authentication

**Goal:** Establish project foundation with working authentication, user management, and role-based access control. This epic delivers a deployable application with login capability and basic admin functions.

#### Story 1.1: Project Setup & Configuration

**As a** developer,
**I want** a properly configured Next.js project with all dependencies,
**so that** I can start building features on a solid foundation.

**Acceptance Criteria:**

1. Given a new project, When initialized, Then Next.js 15+ with App Router is configured
2. Given the project, When dependencies are installed, Then TypeScript, Tailwind CSS, shadcn/ui, MongoDB/Mongoose, React Hook Form, Yup, TanStack Table, TanStack Query are available
3. Given the project structure, When reviewed, Then it follows Next.js App Router conventions with `/app`, `/components`, `/lib`, `/models`, `/types` folders
4. Given environment configuration, When `.env.example` exists, Then it documents all required variables (MONGODB_URI, NEXTAUTH_SECRET, etc.)
5. Given the dev server, When `pnpm dev` runs, Then the application starts without errors on localhost:3000

#### Story 1.2: Database Connection & Base Models

**As a** developer,
**I want** MongoDB connection and base Mongoose models,
**so that** data can be persisted and retrieved.

**Acceptance Criteria:**

1. Given MongoDB URI in environment, When application starts, Then connection is established successfully
2. Given the User model, When defined, Then it includes: email, password (hashed), name, phone, role, parishId (optional), isActive, createdAt, updatedAt
3. Given the Role enum, When defined, Then it includes: SUPER_ADMIN, MANAGER_PRIEST, PARISH_PRIEST, ACCOUNTANT, PARISH_SECRETARY
4. Given database connection failure, When it occurs, Then application logs error and retries with exponential backoff
5. Given Mongoose models, When exported, Then TypeScript types are properly inferred

#### Story 1.3: Authentication System

**As a** user,
**I want** to log in with email and password,
**so that** I can access the system securely.

**Acceptance Criteria:**

1. Given NextAuth.js configuration, When set up, Then Credentials provider is configured with JWT strategy
2. Given the login page at `/login`, When rendered, Then it displays email and password fields with validation
3. Given valid credentials, When user submits login form, Then JWT token is created and user is redirected to dashboard
4. Given invalid credentials, When user submits login form, Then error message "Invalid email or password" is displayed
5. Given inactive account, When user attempts login, Then error message "Account is deactivated" is displayed
6. Given authenticated session, When user accesses protected route, Then access is granted
7. Given no session, When user accesses protected route, Then user is redirected to `/login`

#### Story 1.4: Layout & Navigation Shell

**As a** user,
**I want** a consistent layout with sidebar navigation,
**so that** I can navigate between different modules easily.

**Acceptance Criteria:**

1. Given authenticated user, When viewing any page, Then sidebar with navigation menu is visible
2. Given the sidebar, When rendered, Then it shows user name, role, and logout button
3. Given user role, When sidebar renders, Then only permitted menu items are visible (role-based filtering)
4. Given mobile viewport, When rendered, Then sidebar collapses to hamburger menu
5. Given the main content area, When rendered, Then it has proper padding and max-width for readability
6. Given the header, When rendered, Then it shows current page title and breadcrumbs

#### Story 1.5: User Management CRUD

**As a** Super Admin,
**I want** to manage user accounts,
**so that** I can control who has access to the system.

**Acceptance Criteria:**

1. Given Super Admin role, When accessing `/users`, Then user list is displayed with columns: name, email, role, parish, status, actions
2. Given user list, When "Add User" clicked, Then modal opens with form: name, email, password, role (select), parish (select, conditional), isActive (toggle)
3. Given new user form, When submitted with valid data, Then user is created with hashed password and success toast shown
4. Given existing user, When "Edit" clicked, Then modal opens with pre-filled data (password field empty for security)
5. Given user edit form, When password field is empty, Then existing password is preserved
6. Given user edit form, When password field has value, Then password is updated with new hash
7. Given existing user, When "Deactivate" clicked, Then confirmation dialog appears and user isActive becomes false
8. Given deactivated user, When "Activate" clicked, Then user isActive becomes true
9. Given Super Admin user, When viewing user list, Then cannot delete or deactivate own account
10. Given non-Super Admin role, When accessing `/users`, Then redirect to dashboard with "Access denied" message

#### Story 1.6: RBAC Middleware & API Protection

**As a** system,
**I want** role-based access control on all routes,
**so that** users can only access authorized resources.

**Acceptance Criteria:**

1. Given API route, When request made, Then middleware checks for valid JWT token
2. Given protected API route with role requirement, When user lacks required role, Then 403 Forbidden response returned
3. Given route configuration, When defined, Then each route specifies allowed roles array
4. Given Parish Priest or Secretary role, When accessing parish-scoped data, Then only data for assigned parish is returned
5. Given RBAC middleware, When unauthorized access attempted, Then audit log records the attempt
6. Given client-side navigation, When user lacks permission, Then menu item is hidden AND direct URL access redirects to dashboard

---

### Epic 2: Master Data Management

**Goal:** Implement CRUD operations for all master data entities that other modules depend on. This epic delivers the foundational data management screens.

#### Story 2.1: Parish Management

**As an** authorized user,
**I want** to manage parish records,
**so that** parish information is maintained accurately.

**Acceptance Criteria:**

1. Given authorized role (Super Admin, Manager Priest, Parish Priest for own parish), When accessing `/parishes`, Then parish list is displayed
2. Given parish list, When rendered, Then columns show: name, address, phone, email, priest name, parishioner count, actions
3. Given "Add Parish" action, When clicked, Then modal opens with form: name*, address*, phone, email, notes
4. Given parish form, When submitted with valid data, Then parish is created and list refreshes
5. Given existing parish, When "Edit" clicked, Then modal opens with pre-filled data
6. Given existing parish, When "Delete" clicked, Then confirmation shows "This will affect X parishioners" and soft-deletes if confirmed
7. Given Parish Priest role, When viewing parishes, Then only assigned parish is visible and editable
8. Given search input, When typing, Then list filters by parish name in real-time

#### Story 2.2: Parishioner Management

**As an** authorized user,
**I want** to manage parishioner records,
**so that** parish membership is tracked accurately.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/parishioners`, Then parishioner list is displayed with pagination
2. Given parishioner list, When rendered, Then columns show: name, parish, phone, address, status, actions
3. Given "Add Parishioner" action, When clicked, Then modal opens with form: name*, parishId* (select), phone, address, dateOfBirth, notes
4. Given parishioner form, When parishId is empty, Then validation error "Parish is required" is shown
5. Given Parish Priest/Secretary role, When adding parishioner, Then parishId is auto-set to assigned parish (hidden field)
6. Given existing parishioner, When "Edit" clicked, Then modal opens with pre-filled data
7. Given existing parishioner, When "Delete" clicked, Then soft-delete after confirmation
8. Given filter controls, When parish filter selected, Then list shows only parishioners from that parish
9. Given TanStack Table, When column header clicked, Then list sorts by that column

#### Story 2.3: Fund Category Management

**As an** Accountant or Admin,
**I want** to manage fund categories,
**so that** transactions can be properly categorized.

**Acceptance Criteria:**

1. Given authorized role (Super Admin, Accountant), When accessing `/funds`, Then fund list is displayed
2. Given fund list, When rendered, Then columns show: name, group (A/B/C), description, balance, status, actions
3. Given fund balance, When displayed, Then it calculates: Total Income - Total Expense + Adj Increase - Adj Decrease
4. Given "Add Fund" action, When clicked, Then modal opens with form: name*, group* (select: A/B/C), description, isActive
5. Given group selection, When group A selected, Then label shows "VBCC Funds"
6. Given group selection, When group B selected, Then label shows "Diocese Office Funds"
7. Given group selection, When group C selected, Then label shows "Internal & Pastoral Funds"
8. Given existing fund with transactions, When "Delete" clicked, Then error "Cannot delete fund with existing transactions"
9. Given fund list, When rendered, Then total balance across all funds is shown in summary card

#### Story 2.4: Income/Expense Category Management

**As an** Accountant or Admin,
**I want** to manage income/expense categories,
**so that** transactions have proper classification.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/categories`, Then category list is displayed with tabs: Income, Expense
2. Given category list, When rendered, Then columns show: name, type (income/expense), isSystem, isActive, actions
3. Given "Add Category" action, When clicked, Then modal opens with form: name*, type* (income/expense), description, isActive
4. Given system categories "Employee Salary" and "Asset Rental Income", When rendered, Then they have isSystem=true badge
5. Given system category, When "Delete" clicked, Then error "System categories cannot be deleted"
6. Given system category, When "Toggle Status" clicked, Then error "System categories cannot be deactivated"
7. Given non-system category, When "Delete" clicked and has transactions, Then error "Cannot delete category with existing transactions"

#### Story 2.5: Bank Account Management

**As an** Accountant or Admin,
**I want** to manage bank accounts,
**so that** bank transfers can be tracked properly.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/bank-accounts`, Then account list is displayed
2. Given account list, When rendered, Then columns show: bank name, account number, account holder, balance, isDefault, actions
3. Given account balance, When displayed, Then it calculates from approved bank transfer transactions
4. Given "Add Account" action, When clicked, Then modal opens with form: bankName*, accountNumber*, accountHolder\*, branch, isDefault (toggle)
5. Given isDefault toggle, When enabled on new account, Then previous default account is unset
6. Given existing account with transactions, When "Delete" clicked, Then error "Cannot delete account with existing transactions"
7. Given account list, When rendered, Then total balance across all accounts is shown in summary card

#### Story 2.6: Sender/Receiver Entity Management

**As an** authorized user,
**I want** to manage sender/receiver entities,
**so that** transaction parties are properly recorded.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/entities`, Then entity list is displayed
2. Given entity list, When rendered, Then columns show: name, phone, bank account info, transaction count, actions
3. Given "Add Entity" action, When clicked, Then modal opens with form: name\*, phone, bankName, accountNumber, accountHolder
4. Given entity form, When bank info partially filled, Then validation error "Complete all bank fields or leave all empty"
5. Given searchable select component (for use in other forms), When typing, Then entities filter by name/phone
6. Given searchable select component, When "+" clicked, Then quick-add modal opens inline
7. Given quick-add modal, When submitted, Then new entity created and auto-selected in parent form
8. Given existing entity, When "Edit" clicked, Then modal opens with pre-filled data
9. Given existing entity with transactions, When "Delete" clicked, Then error "Cannot delete entity with existing transactions"

---

### Epic 3: Transaction Management (Core)

**Goal:** Implement the core financial transaction system with income, expense, and adjustment transactions, including the approval workflow. This is the most critical epic for the MVP.

#### Story 3.1: Transaction List with Tabs

**As an** authorized user,
**I want** to view transactions organized by type,
**so that** I can easily find and manage financial records.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/transactions`, Then transaction list with 3 tabs is displayed: Income, Expense, Adjustment
2. Given transaction list, When rendered, Then columns show: date, description, amount, fund, category, entity, status, actions
3. Given status column, When rendered, Then badges show: Pending (yellow), Approved (green), Rejected (red)
4. Given filter panel, When expanded, Then filters available: date range, fund, category, status, entity, payment method
5. Given date range filter, When selected, Then transactions within range are shown
6. Given multiple filters, When applied, Then they combine with AND logic
7. Given "Clear Filters" button, When clicked, Then all filters reset to default
8. Given transaction list, When rendered, Then summary shows: total count, total amount for current filter

#### Story 3.2: Create Income Transaction

**As an** authorized user,
**I want** to create income transactions,
**so that** received funds are properly recorded.

**Acceptance Criteria:**

1. Given authorized role, When clicking "Add Income", Then modal opens with income transaction form
2. Given income form, When rendered, Then fields include: date*, amount*, fundId* (select), categoryId* (select, income categories only), entityId* (searchable select with quick-add), paymentMethod* (cash/bank transfer), bankAccountId (conditional), description, attachments
3. Given paymentMethod = "bank_transfer", When selected, Then bankAccountId becomes required
4. Given paymentMethod = "bank_transfer", When entity has no bank info, Then warning "Selected entity has no bank account information"
5. Given valid income form, When submitted, Then transaction created with status "pending"
6. Given file attachments, When uploaded, Then files saved and linked to transaction
7. Given successful creation, When completed, Then success toast shown and list refreshes
8. Given React Hook Form + Yup, When validation fails, Then field-level errors displayed inline

#### Story 3.3: Create Expense Transaction

**As an** authorized user,
**I want** to create expense transactions,
**so that** payments are properly recorded.

**Acceptance Criteria:**

1. Given authorized role, When clicking "Add Expense", Then modal opens with expense transaction form
2. Given expense form, When rendered, Then fields include: date*, amount*, fundId* (select), categoryId* (select, expense categories only), entityId* (searchable select), paymentMethod*, bankAccountId (conditional), description, attachments
3. Given paymentMethod = "bank_transfer", When selected, Then bankAccountId required AND entity must have bank info
4. Given paymentMethod = "bank_transfer" and entity has no bank info, When form validates, Then error "Recipient must have bank account for bank transfer"
5. Given valid expense form, When submitted, Then transaction created with status "pending"
6. Given validation, When amount <= 0, Then error "Amount must be greater than 0"

#### Story 3.4: Create Adjustment Transaction

**As an** Accountant or Admin,
**I want** to create adjustment transactions,
**so that** fund balances can be corrected when needed.

**Acceptance Criteria:**

1. Given Accountant or Admin role, When clicking "Add Adjustment", Then modal opens with adjustment form
2. Given adjustment form, When rendered, Then fields include: date*, adjustmentType* (increase/decrease), amount*, fundId*, reason\*, attachments
3. Given adjustmentType = "increase", When created, Then transaction adds to fund balance
4. Given adjustmentType = "decrease", When created, Then transaction subtracts from fund balance
5. Given reason field, When empty, Then validation error "Reason is required for adjustments"
6. Given adjustment transaction, When created, Then status is "pending" (requires approval like other transactions)

#### Story 3.5: Transaction Approval Workflow

**As a** Super Admin or Manager Priest,
**I want** to approve or reject transactions,
**so that** financial records are verified before affecting balances.

**Acceptance Criteria:**

1. Given Super Admin or Manager Priest role, When viewing transaction, Then "Approve" and "Reject" buttons are visible
2. Given pending transaction, When "Approve" clicked, Then status changes to "approved" and balance updates immediately
3. Given pending transaction, When "Reject" clicked, Then modal asks for rejection reason
4. Given rejection reason, When submitted, Then status changes to "rejected" with reason stored
5. Given approved transaction, When rendered, Then "Edit" and "Delete" buttons are hidden
6. Given rejected transaction, When rendered, Then "Edit" button is visible (to fix and resubmit)
7. Given Super Admin or Manager Priest, When viewing approved transaction, Then "Unapprove" button is visible
8. Given "Unapprove" action, When clicked, Then status reverts to "pending" and balance recalculates
9. Given bulk selection, When multiple pending transactions selected, Then "Approve Selected" button appears
10. Given non-approval role (Accountant, Parish Priest, Secretary), When viewing transaction, Then approval buttons are hidden

#### Story 3.6: Transaction Edit & Delete

**As an** authorized user,
**I want** to edit or delete my pending transactions,
**so that** I can correct mistakes before approval.

**Acceptance Criteria:**

1. Given pending transaction, When "Edit" clicked, Then modal opens with pre-filled form
2. Given pending transaction edit, When saved, Then transaction updates and audit log records changes
3. Given pending transaction, When "Delete" clicked, Then confirmation dialog appears
4. Given delete confirmation, When confirmed, Then transaction soft-deleted and removed from list
5. Given approved transaction, When user attempts edit via API, Then 403 error "Cannot edit approved transaction"
6. Given rejected transaction, When "Edit" clicked, Then form opens allowing corrections
7. Given rejected transaction edit, When saved, Then status resets to "pending" for re-approval

#### Story 3.7: Fund Balance Calculation

**As a** user,
**I want** to see accurate fund balances,
**so that** I know the current financial status of each fund.

**Acceptance Criteria:**

1. Given fund balance query, When executed, Then formula applies: SUM(approved income) - SUM(approved expense) + SUM(approved adjustment increase) - SUM(approved adjustment decrease)
2. Given fund list page, When rendered, Then each fund shows current balance
3. Given transaction approval, When status changes to approved, Then related fund balance updates in real-time (React Query invalidation)
4. Given transaction unapproval, When status changes to pending, Then fund balance recalculates
5. Given dashboard, When rendered, Then total balance across all funds is displayed
6. Given negative balance, When calculated, Then displayed in red with warning indicator

#### Story 3.8: Bank Account Balance Calculation

**As a** user,
**I want** to see accurate bank account balances,
**so that** I can reconcile with actual bank statements.

**Acceptance Criteria:**

1. Given bank account balance query, When executed, Then formula: SUM(approved income via this account) - SUM(approved expense via this account)
2. Given bank account list, When rendered, Then each account shows current balance
3. Given transaction with bankAccountId, When approved, Then bank account balance updates
4. Given bank account detail view, When accessed, Then list of transactions for this account is shown

---

### Epic 4: HR & Payroll

**Goal:** Implement personnel management and monthly payroll processing with automatic expense transaction creation upon approval.

#### Story 4.1: Personnel Management

**As an** Accountant or Admin,
**I want** to manage personnel records,
**so that** employee information is maintained accurately.

**Acceptance Criteria:**

1. Given authorized role (Super Admin, Accountant), When accessing `/personnel`, Then personnel list is displayed
2. Given personnel list, When rendered, Then columns show: name, phone, email, position, contract status, base salary, actions
3. Given "Add Personnel" action, When clicked, Then modal opens with form: name*, phone*, email, position, address, bankName, accountNumber, accountHolder, notes
4. Given personnel without bank info, When payroll processed, Then warning shown during payroll approval
5. Given existing personnel, When "Edit" clicked, Then modal opens with pre-filled data
6. Given existing personnel, When "Delete" clicked and has payroll history, Then soft-delete only
7. Given personnel list, When contract status filter applied, Then shows only personnel with matching contract status

#### Story 4.2: Employment Contract Management

**As an** Accountant or Admin,
**I want** to manage employment contracts,
**so that** salary and contract terms are properly recorded.

**Acceptance Criteria:**

1. Given personnel detail view, When accessed, Then contract section is visible
2. Given "Add Contract" action, When clicked, Then modal opens with form: contractType* (fixed-term/indefinite), startDate*, endDate (required if fixed-term), baseSalary\*, allowances (JSON/key-value), notes
3. Given contractType = "fixed-term", When selected, Then endDate becomes required
4. Given existing active contract, When new contract added, Then previous contract auto-terminates (endDate = new startDate - 1)
5. Given contract list for personnel, When rendered, Then shows: type, period, base salary, status (active/expired/terminated)
6. Given expired contract (endDate < today), When rendered, Then status shows "Expired" in yellow
7. Given personnel with no active contract, When payroll generated, Then this personnel is excluded

#### Story 4.3: Payroll Generation

**As an** Accountant,
**I want** to generate monthly payroll,
**so that** employee salaries can be processed systematically.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/payroll`, Then payroll list by month is displayed
2. Given payroll list, When rendered, Then columns show: month/year, personnel count, total amount, status, actions
3. Given "Generate Payroll" action, When clicked, Then modal asks for month/year selection
4. Given month/year already has payroll, When attempting to generate, Then error "Payroll for this month already exists"
5. Given valid month/year, When generated, Then system creates payroll with all personnel having active contracts
6. Given generated payroll, When rendered, Then detail shows: personnel name, base salary, allowances, deductions, advances, net pay
7. Given payroll detail, When status is "draft", Then cells are editable (allowances, deductions, advances)
8. Given payroll row, When values change, Then net pay recalculates: baseSalary + allowances - deductions - advances
9. Given payroll generation, When personnel has no bank info, Then warning icon shows on that row

#### Story 4.4: Payroll Approval & Transaction Creation

**As a** Super Admin or Manager Priest,
**I want** to approve payroll,
**so that** salary expenses are officially recorded.

**Acceptance Criteria:**

1. Given draft payroll, When "Submit for Approval" clicked, Then status changes to "pending"
2. Given pending payroll, When Super Admin or Manager Priest views, Then "Approve" and "Reject" buttons visible
3. Given payroll approval, When "Approve" clicked, Then:
   - Status changes to "approved"
   - For each personnel row, expense transaction is created with:
     - categoryId = "Employee Salary" (system category)
     - amount = net pay
     - entityId = personnel (auto-created in entities if not exists)
     - paymentMethod = "bank_transfer" (if personnel has bank info) or "cash"
     - status = "approved" (auto-approved as part of payroll)
4. Given personnel not in entities table, When payroll approved, Then personnel auto-added to entities with their bank info
5. Given approved payroll, When viewed, Then all fields are read-only
6. Given approved payroll, When transactions viewed, Then link to each salary transaction is shown
7. Given payroll rejection, When "Reject" clicked, Then reason required and status changes to "rejected"
8. Given rejected payroll, When edited and resubmitted, Then status returns to "pending"

---

### Epic 5: Asset & Rental Management

**Goal:** Implement asset tracking and rental contract management with automatic income transaction creation for rental payments.

#### Story 5.1: Asset Management

**As an** authorized user,
**I want** to manage diocese assets,
**so that** property information is properly tracked.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/assets`, Then asset list is displayed
2. Given asset list, When rendered, Then columns show: name, type, location, area, value, status (available/rented/maintenance), images thumbnail, actions
3. Given "Add Asset" action, When clicked, Then modal opens with form: name*, type* (select: land/building/equipment/vehicle/other), location*, area, estimatedValue, status*, description, images (multiple upload)
4. Given image upload, When files selected, Then preview thumbnails shown before save
5. Given existing asset, When "Edit" clicked, Then modal opens with pre-filled data and existing images
6. Given asset with active rental contract, When "Delete" clicked, Then error "Cannot delete asset with active rental contract"
7. Given asset status = "rented", When displayed, Then badge shows tenant name from active contract
8. Given asset detail view, When accessed, Then rental history is shown

#### Story 5.2: Rental Contract Management

**As an** authorized user,
**I want** to manage rental contracts,
**so that** tenant agreements are properly documented.

**Acceptance Criteria:**

1. Given authorized role, When accessing `/contracts`, Then contract list is displayed
2. Given contract list, When rendered, Then columns show: asset name, tenant name, rental amount, period, status, next payment due, actions
3. Given "Add Contract" action, When clicked, Then modal opens with form:
   - assetId\* (select available assets)
   - Tenant info: name*, phone*, address\*, email
   - Tenant bank: bankName, accountNumber, accountHolder
   - Contract: startDate*, endDate*, monthlyRent*, deposit, paymentDay* (1-28), fundId\* (which fund receives rental income)
   - attachments (contract documents)
4. Given contract creation, When saved, Then asset status changes to "rented"
5. Given existing contract, When "Edit" clicked, Then only editable: endDate, monthlyRent (as per FR20)
6. Given contract edit restriction, When attempting to edit other fields, Then they are disabled with tooltip "Only duration and amount can be modified"
7. Given contract termination, When "Terminate" clicked, Then endDate set to today and asset status changes to "available"
8. Given active contract, When paymentDay passes, Then visual indicator shows payment is due
9. Given bank transfer payment, When tenant has no bank info, Then warning "Bank transfer not available - tenant has no bank account"

#### Story 5.3: Rental Payment Processing

**As an** authorized user,
**I want** to record rental payments,
**so that** income is properly tracked.

**Acceptance Criteria:**

1. Given active contract, When "Record Payment" clicked, Then payment modal opens
2. Given payment modal, When rendered, Then shows: contract summary, expected amount (monthlyRent), paymentMethod* (cash/bank_transfer), actualAmount*, paymentDate\*, notes
3. Given paymentMethod = "bank_transfer", When selected, Then:
   - Diocese bankAccountId required (select from bank accounts)
   - Tenant must have bank info (validated)
4. Given paymentMethod = "bank_transfer" but tenant has no bank info, When selected, Then error and method auto-switches to cash with message
5. Given valid payment, When submitted, Then income transaction auto-created with:
   - type = "income"
   - categoryId = "Asset Rental Income" (system category)
   - fundId = contract's fundId
   - entityId = tenant (auto-created in entities if not exists)
   - amount = actualAmount
   - status = "pending" (requires approval)
6. Given tenant not in entities table, When payment processed, Then tenant auto-added to entities
7. Given payment history, When contract detail viewed, Then list of all payments with transaction links shown
8. Given contract list, When rendered, Then "overdue" badge shows if payment is past due date

---

### Epic 6: Audit Log & Dashboard

**Goal:** Implement comprehensive audit logging and a role-based dashboard with key statistics.

#### Story 6.1: Audit Log Auto-Recording

**As the** system,
**I want** to automatically record all important changes,
**so that** there is a complete audit trail.

**Acceptance Criteria:**

1. Given any Create operation, When completed, Then audit log records: action="CREATE", userId, entityType, entityId, newValue (JSON), timestamp, ipAddress, userAgent
2. Given any Update operation, When completed, Then audit log records: action="UPDATE", userId, entityType, entityId, oldValue, newValue, changedFields array, timestamp, ipAddress, userAgent
3. Given any Delete operation, When completed, Then audit log records: action="DELETE", userId, entityType, entityId, oldValue (full document), timestamp, ipAddress, userAgent
4. Given entities to log, When configured, Then includes: User, Parish, Parishioner, Fund, Category, BankAccount, Entity, Transaction, Personnel, Contract, Payroll, Asset, RentalContract
5. Given Mongoose middleware, When save/update/delete hooks fire, Then audit log entry is created automatically
6. Given audit log entry, When created, Then it cannot be modified or deleted (immutable)
7. Given API request, When processing, Then IP address and User Agent are captured from request headers

#### Story 6.2: Audit Log Viewing & Search

**As a** Super Admin,
**I want** to view and search audit logs,
**so that** I can investigate changes when needed.

**Acceptance Criteria:**

1. Given Super Admin role, When accessing `/audit-log`, Then log list is displayed (newest first)
2. Given audit log list, When rendered, Then columns show: timestamp, user, action, entity type, entity ID, summary of changes
3. Given filter panel, When expanded, Then filters include: date range\*, user (select), action (CREATE/UPDATE/DELETE), entity type (select)
4. Given date range filter, When not set, Then defaults to last 30 days
5. Given search input, When typing, Then logs filter by content in oldValue/newValue (full-text search)
6. Given log entry, When "View Details" clicked, Then modal shows full oldValue and newValue in formatted JSON or comparison table
7. Given UPDATE action, When details viewed, Then changed fields are highlighted
8. Given pagination, When implemented, Then page size is 50 with infinite scroll or numbered pages
9. Given non-Super Admin role, When accessing `/audit-log`, Then redirect to dashboard with "Access denied"

#### Story 6.3: Dashboard Statistics

**As an** authenticated user,
**I want** to see relevant statistics on the dashboard,
**so that** I have an overview of the system status.

**Acceptance Criteria:**

1. Given authenticated user, When accessing `/dashboard`, Then role-appropriate statistics are displayed
2. Given Super Admin or Manager Priest, When viewing dashboard, Then shows:
   - Total funds balance (sum of all fund balances)
   - Total bank balance (sum of all bank account balances)
   - Pending transactions count (awaiting approval)
   - This month income vs expense comparison
   - Recent transactions list (last 10)
3. Given Accountant, When viewing dashboard, Then shows:
   - Fund balances summary
   - Bank account balances
   - Pending transactions (own entries)
   - Pending payroll status
4. Given Parish Priest or Secretary, When viewing dashboard, Then shows:
   - Parish statistics (parishioner count)
   - Own pending transactions
   - Recent approved transactions
5. Given dashboard cards, When rendered, Then each card is clickable to navigate to detailed view
6. Given income/expense chart, When rendered, Then shows bar chart comparing last 6 months
7. Given React Query, When dashboard loads, Then data is cached and background-refreshed

---

## Next Steps

### Create Architecture

Run `*create-architecture` to create the technical architecture document with:

- Data models (MongoDB schemas)
- API specifications
- Component structure
- Security implementation details

### Create Epic Files

Run `*create-epic` to generate individual epic files in `docs/epics/` folder for implementation tracking.
