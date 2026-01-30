# Security

## Input Validation
- **Library:** Yup
- **Required Rules:** Whitelist approach, validate all input at API boundary
- **Sanitization:** Escape HTML in user-provided strings

## Authentication & Authorization
- **Auth Method:** JWT via NextAuth.js
- **Session Management:** JWT stored in httpOnly cookie
- **Token Expiry:** Access token 1 hour, refresh via session

## RBAC Permissions Matrix
| Permission | SA | DM | PP | ACC | PS |
|------------|----|----|----|----|-----|
| users.* | ✅ | ❌ | ❌ | ❌ | ❌ |
| parishes.write | ✅ | ✅ | ❌ | ❌ | ❌ |
| parishes.read | ✅ | ✅ | ✅ | ✅ | ✅ |
| parishioners.* | ✅ | ✅ | ✅* | ❌ | ✅* |
| transactions.approve | ✅ | ✅ | ❌ | ❌ | ❌ |
| transactions.create | ✅ | ✅ | ✅ | ✅ | ✅ |
| payrolls.approve | ✅ | ✅ | ❌ | ❌ | ❌ |
| payrolls.manage | ✅ | ✅ | ❌ | ✅ | ❌ |
| audit-logs.read | ✅ | ❌ | ❌ | ❌ | ❌ |

*Parish Priest and Parish Secretary are limited to their assigned parish

## Secrets Management
- **Development:** .env.local (git-ignored)
- **Production:** Vercel Environment Variables (encrypted)
- **Code Requirements:** NEVER hardcode secrets, use `process.env`

## API Security
- **Rate Limiting:** Vercel built-in or custom middleware (100 req/min)
- **CORS Policy:** Same-origin only, no external API access
- **HTTPS Enforcement:** Required (Vercel auto-manages)

## Data Protection
- **Encryption at Rest:** MongoDB Atlas encryption
- **Encryption in Transit:** TLS 1.3
- **Password Hashing:** bcrypt with salt rounds 12
- **Sensitive Data:** Bank account numbers masked in responses
