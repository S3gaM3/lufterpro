# CMS Architecture

## Scope
- Admin panel with RBAC (`admin`, `editor`).
- Content domains: users, products, categories, banners, WYSIWYG pages, media upload.
- Audit logging for sensitive actions.

## Layers
- Controller: request parsing and response shaping.
- Service logic: validation and RBAC orchestration.
- Data access: Prisma repositories to MySQL.

## Modules
- `auth`: register/login/refresh/logout.
- `users`: CRUD and role assignment.
- `categories`: tree hierarchy, reordering.
- `products`: CRUD, attributes, images, search/filter.
- `banners`: CRUD, schedule by date interval.
- `content`: WYSIWYG-backed HTML page blocks.
- `media`: uploads for editor and entities.
- `audit`: append-only activity history.

## Security
- Password hashing: `bcrypt`.
- Token auth: JWT access + refresh.
- Access control: route guards by role.
- Request hardening: `helmet`, `cors`, rate limiting.
- Input validation: `zod` schemas.

## Data flow
1. Admin UI calls API with access token.
2. Auth middleware validates token and role.
3. Endpoint validates payload with `zod`.
4. Prisma persists data and writes audit event.
5. API returns normalized DTO to UI.
