# Epic 1: Foundation & Authentication

**Status:** Ready
**PRD Reference:** docs/prd.md#epic-1-foundation--authentication

## Goal

Set up project structure, database schema, JWT authentication, and RBAC authorization with 5 roles. This is the foundation for the entire system, enabling secure access control and providing the infrastructure upon which all other features will be built.

## Stories

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

**Dependencies:** None
**Estimated Effort:** 3-4 hours

---

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

**Dependencies:** Story 1.1
**Estimated Effort:** 3-4 hours

---

### Story 1.3: RBAC Implementation

**As an** administrator,
**I want** to assign roles to users,
**so that** they have appropriate access to system features.

**Acceptance Criteria:**
1. Given 5 predefined roles (Super Admin, Diocese Manager, Parish Priest, Accountant, Parish Secretary), When I assign role to user, Then their permissions are updated
2. Given user with specific role, When they access sidebar, Then only permitted menu items are visible
3. Given user without permission, When they access restricted API route, Then they receive 403 Forbidden
4. Given user without permission, When they navigate to restricted URL, Then they're redirected to Dashboard with error

**Dependencies:** Story 1.2
**Estimated Effort:** 3-4 hours

---

### Story 1.4: User Management

**As a** Super Admin,
**I want** to manage user accounts,
**so that** I can control system access.

**Acceptance Criteria:**
1. Given user management page, When I create new user, Then account is created with specified role and parish assignment
2. Given existing user, When I deactivate account, Then user cannot login but data is preserved
3. Given existing user, When I reset password, Then temporary password is set and user must change on next login
4. Given user list with TanStack Table, When I filter by role or parish, Then only matching users are displayed

**Dependencies:** Story 1.3
**Estimated Effort:** 3-4 hours

## Epic Dependencies

- None (this is the foundation epic)

## Notes

- Use NextAuth.js with JWT strategy for authentication
- 5 Roles: Super Admin, Diocese Manager, Parish Priest, Accountant, Parish Secretary
- Password requirements should be enforced via Yup validation
- All API routes must check authentication and authorization
