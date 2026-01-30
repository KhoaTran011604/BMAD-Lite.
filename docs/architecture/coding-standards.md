# Coding Standards

## Core Standards
- **Language:** TypeScript 5.x (strict mode)
- **Runtime:** Node.js 20.x LTS
- **Style & Linting:** ESLint + Prettier

## Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Files (components) | kebab-case | transaction-form.tsx |
| Files (utils) | kebab-case | api-response.ts |
| Components | PascalCase | TransactionForm |
| Functions | camelCase | createTransaction |
| Constants | SCREAMING_SNAKE | MAX_FILE_SIZE |
| Types/Interfaces | PascalCase with I prefix | ITransaction |
| Enums | PascalCase | TransactionType |
| Database collections | snake_case plural | transactions |
| API routes | kebab-case | /api/v1/bank-accounts |
| Query keys | camelCase with Keys suffix | transactionKeys |

## Critical Rules
- **No `any` type:** Use proper typing or `unknown` with type guards
- **Explicit return types:** All functions must have explicit return types
- **No hardcoded values:** Use constants or environment variables
- **Error boundaries:** Wrap page components in error boundaries
- **Form validation:** Always validate on both client (Yup) and server (Yup) using shared schemas
- **Optimistic updates:** Use TanStack Query mutations with optimistic updates for better UX
- **Centralized query keys:** Always use `queries/keys.ts` for query keys - NEVER create per-domain keys
- **Use GenericForm/GenericTable:** Always use wrapper components instead of building forms/tables from scratch
- **Mutation callbacks:** Never show toast/messages inside mutation hooks - use callbacks from component
- **Generic hooks:** All query/mutation hooks must use TypeScript generics for proper type inference
