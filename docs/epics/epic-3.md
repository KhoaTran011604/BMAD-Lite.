# Epic 3: Finance - Master Data

**Status:** Ready
**PRD Reference:** docs/prd.md#epic-3-finance---master-data

## Goal

Implement financial master data management including 11 funds organized in 3 groups, income/expense categories with system-protected entries, bank accounts with balance tracking, and sender/receiver entities with quick-add functionality. This master data forms the foundation for all financial transactions in the system.

## Stories

### Story 3.1: Fund Management

**As an** accountant,
**I want** to manage the 11 diocese funds,
**so that** I can track financial contributions by purpose.

**Acceptance Criteria:**
1. Given fund list, When page loads, Then all 11 funds are displayed with current balance
2. Given fund form, When I create/edit fund, Then I can set name, group (A/B/C), and description
3. Given fund with transactions, When I view details, Then balance is calculated as SUM(income) - SUM(expense) + SUM(adjustment)
4. Given fund list with TanStack Table, When I filter by group, Then only funds in that group are displayed

**Dependencies:** Epic 1 (Foundation & Authentication)
**Estimated Effort:** 3-4 hours

---

### Story 3.2: Income/Expense Category Management

**As an** accountant,
**I want** to manage income/expense categories,
**so that** transactions can be properly classified.

**Acceptance Criteria:**
1. Given category list, When I create category, Then I can set name, type (income/expense), and parent category
2. Given system categories (Employee Salary, Asset Rental Income), When I try to delete or deactivate, Then system prevents action with warning
3. Given category with transactions, When I view details, Then transaction count is displayed
4. Given category list, When I toggle status, Then category is activated/deactivated

**Dependencies:** Story 3.1
**Estimated Effort:** 2-3 hours

---

### Story 3.3: Bank Account Management

**As an** accountant,
**I want** to manage diocese bank accounts,
**so that** transfer transactions can be properly tracked.

**Acceptance Criteria:**
1. Given bank account form, When I create account, Then I can set bank name, account number, account holder, and purpose
2. Given account list, When page loads, Then each account shows current balance from transactions
3. Given account with transactions, When I view details, Then balance is calculated from transfer transactions
4. Given account list, When I set default account, Then that account is pre-selected in transaction forms

**Dependencies:** Story 3.1
**Estimated Effort:** 2-3 hours

---

### Story 3.4: Sender/Receiver Entity Management

**As an** accountant,
**I want** to manage sender/receiver entities,
**so that** transaction counterparties are properly tracked.

**Acceptance Criteria:**
1. Given entity form, When I create entity, Then I can set name, phone (required), and bank account info
2. Given transaction form, When I select entity field, Then I can search existing entities or quick-add new one via modal
3. Given entity with incomplete bank info, When creating transfer transaction, Then system warns about missing info
4. Given entity list, When I search by name or phone, Then matching entities are displayed

**Dependencies:** Story 3.1
**Estimated Effort:** 3-4 hours

## Epic Dependencies

- **Requires Epic 1:** Authentication and RBAC for access control
- **Note:** Epic 4 (Transactions) depends on this epic being complete

## Notes

- Fund Groups: A (CBCV), B (Diocese Office), C (Internal)
- System categories that cannot be deleted: "Employee Salary" (expense), "Asset Rental Income" (income)
- Bank account balance = SUM(transfer income) - SUM(transfer expense)
- Entity quick-add modal should allow minimal fields (name, phone) with option to add bank info later
- Consider searchable select component (combobox) for entity selection in transaction forms
