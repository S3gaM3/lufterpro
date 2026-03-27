# Deploy on reg.ru (ISPmanager + phpMyAdmin)

## 1) What will be hosted
- `apps/admin` -> static admin panel (domain like `cms.your-domain.ru`).
- `apps/api` -> Node.js API process (domain like `api.your-domain.ru`).
- MySQL 8.0 database managed in ISPmanager/phpMyAdmin.

For your project:
- Admin: `https://cms.lufterpro.ru`
- API: `https://api.lufterpro.ru`

## 2) Prepare server
- Enable Node.js app support in ISPmanager.
- Create 2 domains/subdomains:
  - `cms.your-domain.ru` for admin frontend.
  - `api.your-domain.ru` for backend API.
- Ensure HTTPS is enabled for both.

## 3) Prepare MySQL in ISPmanager/phpMyAdmin
1. Create database `u3459637_default` (or use existing).
2. Create DB user with full rights on this database.
3. Save credentials for `DATABASE_URL`.

`DATABASE_URL` example:
`mysql://db_user:db_password@127.0.0.1:3306/u3459637_default`

## 4) Deploy API (`apps/api`)
1. Upload project to server (git clone or archive).
2. In `apps/api` create `.env`:
   - `NODE_ENV=production`
   - `PORT=4001`
   - `DATABASE_URL=...`
   - `JWT_ACCESS_SECRET=...`
   - `JWT_REFRESH_SECRET=...`
   - `CLIENT_ORIGIN=https://cms.lufterpro.ru`
3. Install and build:
   - `npm ci`
   - `npm run prisma:generate`
   - `npm run prisma:migrate:deploy`
   - `npm run seed` (first deploy only)
   - `npm run build`
4. Run app with PM2:
   - `pm2 start ecosystem.config.cjs`
   - `pm2 save`
5. Configure reverse proxy to `127.0.0.1:4001` (example in `deploy/nginx/api.newlufter.conf.example`).
   Production file for your domain: `deploy/nginx/api.lufterpro.ru.conf`.

## 5) Deploy admin (`apps/admin`)
1. In `apps/admin/.env` set:
   - `VITE_API_URL=https://api.lufterpro.ru/api`
2. Build:
   - `npm ci`
   - `npm run build`
3. Upload contents of `apps/admin/dist` to site root for `cms.your-domain.ru`.
   For your domain use `cms.lufterpro.ru`.
4. Keep `.htaccess` rewrite for SPA routing (`apps/admin/public/.htaccess`).

## 6) Uploads
- API stores media files in `apps/api/uploads`.
- Exposed via `https://api.your-domain.ru/uploads/...`.
- Ensure this directory is writable by app user.

## 7) Smoke checks after deploy
- `GET https://api.your-domain.ru/api/health` -> `{ "status": "ok" }`.
  For your domain: `https://api.lufterpro.ru/api/health`.
- Login in admin panel.
- Create/update/delete: user/category/product/banner/content.
- Upload image and confirm URL is reachable.
- Verify editor role cannot access `/api/audit-logs` and `/api/users`.

## 8) Backup and maintenance
- DB backup in ISPmanager schedule.
- Backup `apps/api/uploads` directory.
- Rotate JWT secrets only during maintenance window.
