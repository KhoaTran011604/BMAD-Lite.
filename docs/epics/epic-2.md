# Epic 2: Parish & Parishioner Management

**Status:** Ready
**PRD Reference:** docs/prd.md#epic-2-parish--parishioner-management

## Goal

Implement CRUD operations for parishes and parishioners with hierarchical relationship. Each parishioner must belong to exactly one parish. This module establishes the organizational structure that underpins user assignments and data visibility throughout the system.

## Stories

### Story 2.1: Parish Management

**As an** administrator,
**I want** to manage parish information,
**so that** I can maintain accurate parish records.

**Acceptance Criteria:**
1. Given parish list page, When I click add, Then I can create new parish with name, address, phone, and founding date
2. Given existing parish, When I edit details, Then changes are saved and reflected in list
3. Given parish with parishioners, When I try to delete, Then system prevents deletion with warning
4. Given parish list with TanStack Table, When I search by name, Then matching parishes are displayed

**Dependencies:** Epic 1 (Foundation & Authentication)
**Estimated Effort:** 3-4 hours

---

### Story 2.2: Parishioner Management

**As a** parish secretary,
**I want** to manage parishioner records,
**so that** I can maintain accurate membership data.

**Acceptance Criteria:**
1. Given parishioner form, When I create record, Then parishioner is created with required parish assignment
2. Given parishioner list, When I filter by parish, Then only parishioners from that parish are shown
3. Given Parish Priest role, When I view parishioners, Then I only see parishioners from my assigned parish
4. Given parishioner details, When I update info, Then changes are saved with audit log entry

**Dependencies:** Story 2.1
**Estimated Effort:** 3-4 hours

## Epic Dependencies

- **Requires Epic 1:** Authentication and RBAC must be in place for role-based data filtering

## Notes

- Parish Priests and Parish Secretaries should only see their own parish's parishioners
- Super Admin and Diocese Manager can see all parishes and parishioners
- Deleting a parish should be prevented if it has associated parishioners or users
- Consider adding parish statistics (parishioner count) to list view
