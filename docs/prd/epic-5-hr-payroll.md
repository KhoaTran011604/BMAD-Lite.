# Epic 5: HR & Payroll

**Goal:** Implement employee management with labor contracts and monthly payroll generation. Approved payroll automatically creates salary expense transactions.

## Story 5.1: Employee Management
**As an** HR user,
**I want** to manage employee records,
**so that** I can track diocese staff.

**Acceptance Criteria:**
1. Given employee form, When I create employee, Then I can set personal info and position
2. Given employee list with TanStack Table, When I filter by contract status, Then only matching employees are shown
3. Given employee details, When I view profile, Then contract history is displayed
4. Given employee, When I update basic info, Then changes are saved with audit log

## Story 5.2: Labor Contract Management
**As an** HR user,
**I want** to manage employee contracts,
**so that** salary and employment terms are documented.

**Acceptance Criteria:**
1. Given employee, When I create contract, Then I can set type (fixed/indefinite), salary, start date, and end date
2. Given fixed-term contract, When approaching expiry (30 days), Then system shows warning indicator
3. Given employee with active contract, When I try to create new contract, Then system prevents overlap
4. Given contract list, When I view details, Then salary and terms are clearly displayed

## Story 5.3: Monthly Payroll Generation
**As an** accountant,
**I want** to generate monthly payroll,
**so that** employees are paid correctly.

**Acceptance Criteria:**
1. Given payroll page, When I select month without existing payroll, Then I can generate new payroll
2. Given payroll generation, When I generate, Then all employees with active contracts are included
3. Given pending payroll, When I edit line items, Then I can adjust allowances, deductions, and advances
4. Given month with existing payroll, When I try to generate, Then system prevents duplicate

## Story 5.4: Payroll Approval and Transaction Creation
**As a** Diocese Manager,
**I want** to approve payroll,
**so that** salary payments are authorized and recorded.

**Acceptance Criteria:**
1. Given pending payroll, When I approve, Then payroll status changes to approved (read-only)
2. Given approval process, When employee not in sender/receiver list, Then system auto-adds from employee info
3. Given approved payroll, When approval completes, Then expense transactions are created for each employee
4. Given created transactions, When I view, Then they link back to payroll and employee record
