# Tech Stack

## Cloud Infrastructure
- **Provider:** Vercel (primary) or any Node.js hosting
- **Database:** MongoDB Atlas (managed cloud)
- **File Storage:** Cloudinary (CDN-backed)
- **Deployment Regions:** Auto (Vercel Edge) or single region

## Technology Stack Table
| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | Next.js | 15.x | Fullstack React framework | App Router, Server Components, API Routes in one |
| Language | TypeScript | 5.x | Primary language | Type safety, better DX, fewer runtime errors |
| Runtime | Node.js | 20.x LTS | Server runtime | Stable LTS, required by Next.js |
| Database | MongoDB | 7.x | Document database | Flexible schema, good for hierarchical data |
| ODM | Mongoose | 8.x | MongoDB ODM | Schema validation, middleware, TypeScript support |
| Auth | NextAuth.js | 5.x | Authentication | Built for Next.js, JWT support, extensible |
| Styling | Tailwind CSS | 3.x | Utility CSS | Rapid development, consistent design |
| UI Components | shadcn/ui | latest | Component library | Accessible, customizable, Tailwind-based |
| Forms | React Hook Form | 7.x | Form management | Performance, minimal re-renders |
| Validation | Yup | 1.x | Schema validation | Declarative, integrates with RHF |
| Data Tables | TanStack Table | 8.x | Table/grid component | Headless, powerful filtering/sorting |
| Server State | TanStack Query | 5.x | Data fetching | Caching, background updates, optimistic UI |
| File Storage | Cloudinary | SDK | Image/file hosting | CDN, transformations, generous free tier |
| Icons | Lucide React | latest | Icon library | Consistent, tree-shakeable |
| Date | date-fns | 3.x | Date utilities | Lightweight, functional API |
