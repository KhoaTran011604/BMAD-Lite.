# Epic 7: System - Audit & Dashboard

**Goal:** Implement comprehensive audit logging for traceability and role-based dashboards for management overview.

## Story 7.1: Audit Log System
**As a** Super Admin,
**I want** to view system audit logs,
**so that** I can trace all user actions for accountability.

**Acceptance Criteria:**
1. Given CRUD operation on important entity, When action completes, Then audit log entry is created automatically
2. Given audit log entry, When I view details, Then I see user, action, timestamp, IP, old value, new value
3. Given audit log list with TanStack Table, When I filter by user/action/entity/date range, Then matching entries are shown
4. Given old/new values, When I view detail, Then changes are displayed in JSON diff or comparison table format

## Story 7.2: Dashboard - Super Admin & Diocese Manager
**As a** Super Admin or Diocese Manager,
**I want** to see diocese-wide statistics,
**so that** I can monitor overall financial health.

**Acceptance Criteria:**
1. Given dashboard, When page loads, Then summary cards show total income, expense, and net by period
2. Given dashboard, When I view charts, Then income/expense trend by month is visualized
3. Given dashboard, When I view pending approvals, Then count of pending transactions and payrolls is shown
4. Given dashboard, When I click summary card, Then I'm navigated to detailed list view

## Story 7.3: Dashboard - Parish Level
**As a** Parish Priest,
**I want** to see my parish statistics,
**so that** I can monitor parish financial activities.

**Acceptance Criteria:**
1. Given Parish Priest dashboard, When page loads, Then only my parish data is shown
2. Given parish stats, When I view summary, Then income/expense for my parish is displayed
3. Given recent activity, When I view list, Then my recent transactions and their status are shown
4. Given parishioner count, When I view stats, Then total parishioners in my parish is displayed
