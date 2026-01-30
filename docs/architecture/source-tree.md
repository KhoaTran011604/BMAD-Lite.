# Source Tree

```
gpbmt-org/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth pages group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Protected pages group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── parishes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── parishioners/
│   │   │   │   └── page.tsx
│   │   │   ├── finance/
│   │   │   │   ├── funds/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── bank-accounts/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── entities/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── transactions/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── hr/
│   │   │   │   ├── employees/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── payrolls/
│   │   │   │       └── page.tsx
│   │   │   ├── administration/
│   │   │   │   ├── assets/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── rental-contracts/
│   │   │   │       └── page.tsx
│   │   │   ├── system/
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── audit-logs/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── v1/
│   │   │       ├── users/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── parishes/
│   │   │       │   └── route.ts
│   │   │       ├── parishioners/
│   │   │       │   └── route.ts
│   │   │       ├── funds/
│   │   │       │   └── route.ts
│   │   │       ├── categories/
│   │   │       │   └── route.ts
│   │   │       ├── bank-accounts/
│   │   │       │   └── route.ts
│   │   │       ├── entities/
│   │   │       │   └── route.ts
│   │   │       ├── transactions/
│   │   │       │   ├── route.ts
│   │   │       │   ├── export/
│   │   │       │   │   └── route.ts
│   │   │       │   └── [id]/
│   │   │       │       ├── route.ts
│   │   │       │       ├── approve/
│   │   │       │       │   └── route.ts
│   │   │       │       └── reject/
│   │   │       │           └── route.ts
│   │   │       ├── employees/
│   │   │       │   └── route.ts
│   │   │       ├── payrolls/
│   │   │       │   ├── route.ts
│   │   │       │   └── generate/
│   │   │       │       └── route.ts
│   │   │       ├── assets/
│   │   │       │   └── route.ts
│   │   │       ├── rental-contracts/
│   │   │       │   └── route.ts
│   │   │       ├── audit-logs/
│   │   │       │   └── route.ts
│   │   │       └── dashboard/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── breadcrumb.tsx
│   │   ├── forms/
│   │   │   ├── transaction-form.tsx
│   │   │   ├── parish-form.tsx
│   │   │   ├── employee-form.tsx
│   │   │   └── ...
│   │   ├── tables/
│   │   │   ├── transactions-table.tsx
│   │   │   ├── parishes-table.tsx
│   │   │   └── ...
│   │   └── shared/
│   │       ├── generic-form.tsx      # Wrapper for all forms
│   │       ├── generic-table.tsx     # Wrapper for all tables
│   │       ├── entity-select.tsx
│   │       ├── file-upload.tsx
│   │       ├── date-range-picker.tsx
│   │       └── status-badge.tsx
│   │
│   ├── queries/                      # React Query hooks (domain-based)
│   │   ├── keys.ts                   # CENTRALIZED query keys for ALL domains
│   │   ├── transactions/
│   │   │   ├── queries.ts            # useTransactions, useTransaction
│   │   │   ├── mutations.ts          # useCreateTransaction, useApproveTransaction
│   │   │   └── index.ts              # Barrel export
│   │   ├── funds/
│   │   │   ├── queries.ts            # useFunds, useFund
│   │   │   ├── mutations.ts          # useCreateFund, useUpdateFund
│   │   │   └── index.ts
│   │   ├── categories/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── bank-accounts/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── entities/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── parishes/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── parishioners/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── employees/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── payrolls/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── assets/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── rental-contracts/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── users/
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── index.ts
│   │   ├── audit-logs/
│   │   │   ├── queries.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── queries.ts
│   │   │   └── index.ts
│   │   └── auth/
│   │       ├── queries.ts            # useCurrentUser
│   │       ├── mutations.ts          # useLogin, useLogout
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connection.ts         # MongoDB connection
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── role.model.ts
│   │   │       ├── parish.model.ts
│   │   │       ├── parishioner.model.ts
│   │   │       ├── fund.model.ts
│   │   │       ├── category.model.ts
│   │   │       ├── bank-account.model.ts
│   │   │       ├── entity.model.ts
│   │   │       ├── transaction.model.ts
│   │   │       ├── employee.model.ts
│   │   │       ├── contract.model.ts
│   │   │       ├── payroll.model.ts
│   │   │       ├── payroll-item.model.ts
│   │   │       ├── asset.model.ts
│   │   │       ├── rental-contract.model.ts
│   │   │       ├── rental-payment.model.ts
│   │   │       ├── audit-log.model.ts
│   │   │       └── index.ts
│   │   ├── services/
│   │   │   ├── transaction.service.ts
│   │   │   ├── payroll.service.ts
│   │   │   ├── audit.service.ts
│   │   │   ├── cloudinary.service.ts
│   │   │   └── ...
│   │   ├── auth/
│   │   │   ├── auth.config.ts        # NextAuth config
│   │   │   ├── auth.ts               # NextAuth instance exports
│   │   │   ├── credentials.ts        # verifyCredentials + SessionUser
│   │   │   ├── index.ts              # Auth module barrel export
│   │   │   └── rbac.ts               # RBAC middleware
│   │   ├── validations/
│   │   │   ├── transaction.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   └── ...
│   │   ├── api/
│   │   │   ├── client.ts             # API client for React Query
│   │   │   ├── endpoints.ts          # API endpoint constants
│   │   │   ├── validate.ts           # BE validation middleware (Yup)
│   │   │   └── types.ts              # API request/response types
│   │   └── utils/
│   │       ├── api-response.ts
│   │       ├── api-error.ts
│   │       └── helpers.ts
│   │
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   ├── auth-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── models.types.ts
│   │
│   └── proxy.ts                      # Next.js 16 route protection (Node.js runtime)
│
├── public/
│   └── ...
│
├── tests/
│   ├── unit/
│   │   └── services/
│   │       └── transaction.service.test.ts
│   └── integration/
│       └── api/
│           └── transactions.test.ts
│
├── scripts/
│   └── seed.ts                       # Database seeding
│
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
├── components.json                   # shadcn/ui config
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
