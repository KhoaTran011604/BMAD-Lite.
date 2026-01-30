# Epic 4: Finance - Transaction Management

**Goal:** Implement core transaction management with three types (Income, Expense, Adjustment), approval workflow, file attachments via Cloudinary, and advanced filtering. Integration with fund and bank account balances.

## Story 4.1: Transaction CRUD
**As a** user with transaction permission,
**I want** to create and manage financial transactions,
**so that** all financial activities are recorded.

**Acceptance Criteria:**
1. Given transaction form with React Hook Form, When I create income/expense, Then I must select fund, category, entity, and payment method
2. Given transfer payment method, When I save transaction, Then I must select a bank account
3. Given transaction list, When page loads, Then transactions are displayed in tabs (Income/Expense/Adjustment)
4. Given pending transaction, When I edit or delete, Then changes are saved; Given approved transaction, Then edit/delete is blocked

## Story 4.2: Adjustment Transactions
**As an** accountant,
**I want** to create adjustment transactions,
**so that** I can correct fund balances with proper documentation.

**Acceptance Criteria:**
1. Given adjustment form, When I create adjustment, Then I must select type (Increase/Decrease) and provide reason
2. Given adjustment, When approved, Then fund balance is updated accordingly
3. Given adjustment list, When I view details, Then adjustment type and reason are clearly displayed
4. Given adjustment history, When I filter by fund, Then only adjustments for that fund are shown

## Story 4.3: Transaction Approval Workflow
**As a** Diocese Manager or Super Admin,
**I want** to approve or reject transactions,
**so that** only valid transactions affect balances.

**Acceptance Criteria:**
1. Given pending transactions, When I view approval queue, Then I can approve individually or in bulk
2. Given transaction approval, When I approve, Then transaction is finalized and balances are updated
3. Given transaction rejection, When I reject with reason, Then transaction is marked rejected and creator is notified
4. Given approved transaction, When I cancel approval (as Super Admin/Diocese Manager), Then balances are reversed

## Story 4.4: File Attachments with Cloudinary
**As a** transaction creator,
**I want** to attach supporting documents,
**so that** transactions have proper documentation.

**Acceptance Criteria:**
1. Given transaction form, When I upload images/documents, Then files are uploaded to Cloudinary and attached to transaction
2. Given attached files, When I click preview, Then images display in lightbox and documents open in new tab
3. Given file upload, When file exceeds size limit (10MB), Then user sees error with allowed size
4. Given transaction details, When I view attachments, Then all Cloudinary URLs are listed with preview thumbnails

## Story 4.5: Advanced Filtering
**As a** finance user,
**I want** to filter transactions by multiple criteria,
**so that** I can find specific transactions quickly.

**Acceptance Criteria:**
1. Given transaction list with TanStack Table, When I apply date range filter, Then only transactions in that period are shown
2. Given filter panel, When I select multiple criteria (fund, category, status, entity), Then results match all criteria
3. Given filter state, When I clear filters, Then all transactions are displayed again
4. Given export function, When I export filtered results, Then CSV file downloads with matching data
