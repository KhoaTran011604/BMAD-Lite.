# Technical Assumptions

## Repository Structure
Monorepo
Rationale: Single codebase with Next.js fullstack simplifies deployment, enables shared types, and reduces complexity

## Service Architecture
Monolith
Rationale: Medium-scale system (~50 users), no need for microservices complexity. Next.js fullstack with API routes provides clean architecture that's easy to develop, deploy, and maintain

## Testing Requirements
Unit + Integration
Rationale: Unit tests for critical business logic (balance calculations, approval workflows). Integration tests for API routes and database operations

## Additional Technical Assumptions and Requests
- **Framework:** Next.js 15+ (App Router, Server Components, API Routes)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** MongoDB with Mongoose ODM
- **File Storage:** Cloudinary
- **Form Management:** React Hook Form + Yup validation
- **Data Tables:** TanStack React Table
- **Server State:** TanStack React Query
- **Authentication:** NextAuth.js with JWT
- **Deployment:** Vercel (recommended) or Docker
