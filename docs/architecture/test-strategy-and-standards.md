# Test Strategy and Standards

## Testing Philosophy
- **Approach:** Test-After for MVP, prioritize critical paths
- **Coverage Goals:** 70% for services, 50% overall

## Test Types and Organization

### Unit Tests
- **Framework:** Vitest
- **Location:** `tests/unit/`
- **Focus:** Service layer business logic, utility functions

### Integration Tests
- **Framework:** Vitest + Supertest
- **Scope:** API routes with mocked database
- **Location:** `tests/integration/`

## Test Data Management
- **Strategy:** Factory functions + fixtures
- **Fixtures:** `tests/fixtures/`

## Key Test Scenarios
1. Transaction creation with all validation rules
2. Approval workflow state transitions
3. Payroll generation and transaction creation
4. RBAC permission enforcement
5. Balance calculations
