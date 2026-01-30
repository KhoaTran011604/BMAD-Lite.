# REST API Spec

## API Style
REST with JSON payloads

## Base URL
`/api/v1`

## Authentication
JWT Bearer token via NextAuth.js session

## Common Response Format
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

## Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/login | Login with email/password | No |
| POST | /auth/logout | Logout and invalidate session | Yes |
| GET | /auth/me | Get current user info | Yes |
| PATCH | /auth/change-password | Change password | Yes |

### Users
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /users | List users (paginated) | Yes | SUPER_ADMIN |
| POST | /users | Create user | Yes | SUPER_ADMIN |
| GET | /users/:id | Get user details | Yes | SUPER_ADMIN |
| PATCH | /users/:id | Update user | Yes | SUPER_ADMIN |
| DELETE | /users/:id | Deactivate user | Yes | SUPER_ADMIN |
| POST | /users/:id/reset-password | Reset password | Yes | SUPER_ADMIN |

### Parishes
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /parishes | List parishes | Yes | All |
| POST | /parishes | Create parish | Yes | SUPER_ADMIN, DIOCESE_MANAGER |
| GET | /parishes/:id | Get parish details | Yes | All |
| PATCH | /parishes/:id | Update parish | Yes | SUPER_ADMIN, DIOCESE_MANAGER |
| DELETE | /parishes/:id | Delete parish | Yes | SUPER_ADMIN |

### Parishioners
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /parishioners | List parishioners | Yes | All (filtered by parish for PP/PS) |
| POST | /parishioners | Create parishioner | Yes | PP, PS, SUPER_ADMIN |
| GET | /parishioners/:id | Get parishioner | Yes | All |
| PATCH | /parishioners/:id | Update parishioner | Yes | PP, PS, SUPER_ADMIN |
| DELETE | /parishioners/:id | Delete parishioner | Yes | SUPER_ADMIN |

### Funds
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /funds | List funds with balances | Yes | All |
| POST | /funds | Create fund | Yes | SUPER_ADMIN, ACCOUNTANT |
| GET | /funds/:id | Get fund with balance | Yes | All |
| PATCH | /funds/:id | Update fund | Yes | SUPER_ADMIN, ACCOUNTANT |

### Categories
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /categories | List categories | Yes | All |
| POST | /categories | Create category | Yes | ACCOUNTANT, SUPER_ADMIN |
| PATCH | /categories/:id | Update category | Yes | ACCOUNTANT, SUPER_ADMIN |
| DELETE | /categories/:id | Delete category | Yes | SUPER_ADMIN |

### Bank Accounts
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /bank-accounts | List accounts with balances | Yes | ACCOUNTANT, SUPER_ADMIN, DM |
| POST | /bank-accounts | Create account | Yes | ACCOUNTANT, SUPER_ADMIN |
| PATCH | /bank-accounts/:id | Update account | Yes | ACCOUNTANT, SUPER_ADMIN |

### Entities
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /entities | List/search entities | Yes | All |
| POST | /entities | Create entity | Yes | All |
| PATCH | /entities/:id | Update entity | Yes | ACCOUNTANT, SUPER_ADMIN |

### Transactions
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /transactions | List transactions (filtered) | Yes | All (filtered by parish) |
| POST | /transactions | Create transaction | Yes | All (role-based limits) |
| GET | /transactions/:id | Get transaction | Yes | All |
| PATCH | /transactions/:id | Update transaction | Yes | Creator (if PENDING) |
| DELETE | /transactions/:id | Delete transaction | Yes | Creator (if PENDING) |
| PATCH | /transactions/:id/approve | Approve transaction | Yes | SUPER_ADMIN, DM |
| PATCH | /transactions/:id/reject | Reject transaction | Yes | SUPER_ADMIN, DM |
| PATCH | /transactions/:id/cancel-approval | Cancel approval | Yes | SUPER_ADMIN, DM |
| GET | /transactions/export | Export to CSV | Yes | ACCOUNTANT, SUPER_ADMIN |

### Employees
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /employees | List employees | Yes | ACCOUNTANT, SUPER_ADMIN, DM |
| POST | /employees | Create employee | Yes | ACCOUNTANT, SUPER_ADMIN |
| GET | /employees/:id | Get employee | Yes | ACCOUNTANT, SUPER_ADMIN, DM |
| PATCH | /employees/:id | Update employee | Yes | ACCOUNTANT, SUPER_ADMIN |

### Contracts
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /employees/:id/contracts | List contracts | Yes | ACCOUNTANT, SUPER_ADMIN |
| POST | /employees/:id/contracts | Create contract | Yes | ACCOUNTANT, SUPER_ADMIN |
| PATCH | /contracts/:id | Update contract | Yes | ACCOUNTANT, SUPER_ADMIN |

### Payrolls
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /payrolls | List payrolls | Yes | ACCOUNTANT, SUPER_ADMIN, DM |
| POST | /payrolls/generate | Generate payroll | Yes | ACCOUNTANT |
| GET | /payrolls/:id | Get payroll with items | Yes | ACCOUNTANT, SUPER_ADMIN, DM |
| PATCH | /payrolls/:id/items | Update payroll items | Yes | ACCOUNTANT (if DRAFT) |
| PATCH | /payrolls/:id/approve | Approve payroll | Yes | SUPER_ADMIN, DM |

### Assets
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /assets | List assets | Yes | ACCOUNTANT, SUPER_ADMIN, DM, PP |
| POST | /assets | Create asset | Yes | ACCOUNTANT, SUPER_ADMIN |
| GET | /assets/:id | Get asset | Yes | All |
| PATCH | /assets/:id | Update asset | Yes | ACCOUNTANT, SUPER_ADMIN |
| DELETE | /assets/:id | Delete asset | Yes | SUPER_ADMIN |

### Rental Contracts
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /rental-contracts | List contracts | Yes | ACCOUNTANT, SUPER_ADMIN, DM |
| POST | /rental-contracts | Create contract | Yes | ACCOUNTANT, SUPER_ADMIN |
| GET | /rental-contracts/:id | Get contract | Yes | All |
| PATCH | /rental-contracts/:id | Update contract | Yes | ACCOUNTANT, SUPER_ADMIN |
| POST | /rental-contracts/:id/payments | Record payment | Yes | ACCOUNTANT |

### Audit Logs
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /audit-logs | List audit logs | Yes | SUPER_ADMIN |
| GET | /audit-logs/:id | Get audit log detail | Yes | SUPER_ADMIN |

### Dashboard
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /dashboard/stats | Get dashboard stats | Yes | All (role-filtered) |
| GET | /dashboard/pending | Get pending approvals | Yes | SUPER_ADMIN, DM |
