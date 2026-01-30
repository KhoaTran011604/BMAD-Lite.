# Infrastructure and Deployment

## Infrastructure as Code
- **Tool:** Vercel CLI or Docker Compose
- **Location:** `/docker` (if using Docker)

## Deployment Strategy
- **Strategy:** Blue-Green via Vercel automatic deployments
- **CI/CD Platform:** GitHub Actions + Vercel

## Environments
- **Development:** Local with MongoDB Atlas dev cluster
- **Staging:** Vercel Preview deployments (per PR)
- **Production:** Vercel Production with MongoDB Atlas production cluster

## Environment Promotion Flow
```
Local Development → PR Preview (Staging) → Main Branch (Production)
```

## Rollback Strategy
- **Primary Method:** Vercel instant rollback to previous deployment
- **Trigger Conditions:** Error rate spike, failed health checks, manual trigger

## Environment Variables
```bash
# Database
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_URL=https://gpbmt.org
NEXTAUTH_SECRET=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_UPLOAD_PRESET=...

# App
NEXT_PUBLIC_APP_URL=https://gpbmt.org
```
