# User Manual (Admin Panel)

## Roles
- `admin`: full access, including user management and audit logs.
- `editor`: manage categories/products/banners/content/media.

## Login
1. Open admin app (`apps/admin`).
2. Enter email/password.
3. Click `Войти`.

## Users (admin only)
- Create account: email, password, role.
- Edit account: status, role, password reset.
- Delete account: remove user from CMS.

## Categories
- Create top-level or nested category.
- Set display order.
- Use reorder flow to persist sort changes.

## Products
- Add name, slug, category, price, stock state.
- Fill short/full description and attributes.
- Attach images.
- Use search/filter by name and category.

## Banners
- Add title, image URL, destination URL.
- Set visibility interval (`startsAt`/`endsAt` in ISO format).
- Enable/disable with `isActive`.

## Content Editor
- Edit page blocks via WYSIWYG.
- Insert media and save content by key.

## Audit Logs
- Available to `admin`.
- Shows key system actions and timestamps.
