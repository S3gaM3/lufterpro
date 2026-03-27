# Technical Specification

## Repository layout
- `apps/api`: Express + TypeScript + Prisma API.
- `apps/admin`: React + Vite admin panel.
- `packages/shared-types`: shared domain types.
- `docs`: architecture and operation documents.

## Environment
### API (`apps/api/.env`)
- `PORT`
- `DATABASE_URL` (MySQL 8.0, db `u3459637_default`)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`

### Admin (`apps/admin/.env`)
- `VITE_API_URL` (default `http://localhost:4001/api`)

## Backend endpoints
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- Users: `/api/users`
- Categories: `/api/categories`, `/api/categories/reorder`
- Products: `/api/products`
- Banners: `/api/banners`
- Content: `/api/content`
- Media: `/api/media/upload`
- Audit: `/api/audit-logs`

## Deployment
1. Configure MySQL 8.0 and `DATABASE_URL`.
2. Run Prisma migration (`npm run prisma:migrate` in `apps/api`).
3. Seed first admin (`npm run seed` in `apps/api`).
4. Build API and admin (`npm run build -w apps/api`, `npm run build -w apps/admin`).
5. Serve API and static admin build behind reverse proxy.

## Testing checklist
- Auth success/failure scenarios.
- RBAC checks for `admin` vs `editor`.
- CRUD for all CMS entities.
- Content editor save/render.
- Banner date window behavior.
