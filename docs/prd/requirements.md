# Requirements

## Functional
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

## Non Functional
- NFR1: System must be responsive, working well on desktop and tablet
- NFR2: API response time < 500ms for standard CRUD operations
- NFR3: Support minimum 50 concurrent users
- NFR4: Data must be backed up daily
- NFR5: Encrypt sensitive data (passwords, bank account information)
- NFR6: System availability of 99.5%
