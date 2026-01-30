# Error Handling Strategy

## General Approach
- **Error Model:** Structured error responses with code, message, details
- **Exception Hierarchy:** Custom ApiError class extending Error

## Logging Standards
- **Library:** Built-in console + Vercel logs (or Pino for production)
- **Format:** JSON structured logs
- **Levels:** DEBUG, INFO, WARN, ERROR

## Error Handling Patterns

### API Route Errors
```typescript
try {
  // handler logic
} catch (error) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.toJSON() },
      { status: error.statusCode }
    );
  }
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
    { status: 500 }
  );
}
```

### External API Errors (Cloudinary)
- **Retry Policy:** 3 retries with exponential backoff
- **Fallback:** Store file reference, retry upload in background job

### Business Logic Errors
- **Custom Exceptions:** ValidationError, NotFoundError, ForbiddenError, ConflictError
- **Error Codes:** VALIDATION_ERROR, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
