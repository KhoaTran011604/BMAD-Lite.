# Epic 6: Administration - Assets & Contracts

**Goal:** Implement asset management and rental contract management. Rental payments automatically create income transactions.

## Story 6.1: Asset Management
**As an** administrator,
**I want** to manage diocese assets,
**so that** property inventory is tracked.

**Acceptance Criteria:**
1. Given asset form, When I create asset, Then I can set type, area, value, status, and upload images to Cloudinary
2. Given asset list with TanStack Table, When I filter by status (available/rented/in-use), Then matching assets are shown
3. Given asset images, When I upload multiple, Then all images display in gallery view from Cloudinary
4. Given asset with active rental, When I try to delete, Then system prevents deletion

## Story 6.2: Rental Contract Management
**As an** administrator,
**I want** to manage rental contracts,
**so that** leased property income is tracked.

**Acceptance Criteria:**
1. Given rental form with React Hook Form, When I create contract, Then I must provide tenant info, asset, duration, deposit, and monthly rent
2. Given active contract, When I edit, Then only duration and rent amount can be modified
3. Given contract list, When contract expires soon (30 days), Then warning indicator is displayed
4. Given contract details, When I upload documents, Then attachments are stored in Cloudinary

## Story 6.3: Rental Payment Processing
**As an** accountant,
**I want** to record rental payments,
**so that** income is tracked with proper documentation.

**Acceptance Criteria:**
1. Given active contract, When I record payment, Then income transaction is created linked to contract
2. Given payment form, When selecting fund, Then I can choose which fund receives the income
3. Given transfer payment, When tenant or diocese lacks bank info, Then system blocks transfer option with guidance message
4. Given payment history, When I view contract, Then all payments are listed with status
