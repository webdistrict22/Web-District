# Web District Deployment Guide

## Production Architecture

- Frontend: Vercel
- Backend: Render Starter
- Database: MongoDB Atlas
- Email: Gmail SMTP through Nodemailer
- Uploaded project images: Cloudinary
- Recommended runtime: Node.js 20 LTS or newer

Deploy the backend before the frontend when changing API behavior or environment
configuration. Run the read-only QA suites after each deployment.

## Frontend: Vercel

Create or configure the Vercel project with:

```text
Root Directory: client
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Add this production environment variable:

```env
VITE_API_URL=https://web-district.onrender.com/api
```

The value must include `/api`. Redeploy after changing any `VITE_*` value
because Vite embeds it during the build.

### Domains

Attach and verify:

- `www.web-district.com`
- `web-district.com`

Use the preferred domain consistently for redirects and canonical links. The
current frontend metadata uses `https://www.web-district.com`.

### Vercel Configuration

`client/vercel.json` provides:

- SPA fallback to `index.html`
- No-cache handling for HTML, the service worker, and manifest
- Immutable one-year caching for hashed `/assets/*`
- Frontend security headers

Do not place immutable caching on `index.html` or `sw.js`.

### Frontend Post-Deploy Checks

Open and verify:

- https://www.web-district.com/
- https://www.web-district.com/robots.txt
- https://www.web-district.com/sitemap.xml
- https://www.web-district.com/favicon.ico
- https://www.web-district.com/manifest.webmanifest
- https://www.web-district.com/sw.js

Confirm `/sw.js` returns a no-cache policy and hashed `/assets/*` files return
`public, max-age=31536000, immutable`.

Also confirm Vercel Analytics and Speed Insights are receiving production data.

## Backend: Render

Create or configure a Render Web Service with:

```text
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Recommended health check:

```text
/api/health
```

Expected public URL:

```text
https://web-district.onrender.com
```

Render Starter provides more predictable availability than free services that
sleep aggressively, but application health and response times should still be
monitored.

### Required Render Environment

```env
NODE_ENV=production
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=30d
CLIENT_URL=https://www.web-district.com
ALLOWED_ORIGINS=https://www.web-district.com,https://web-district.com
EMAIL_USER=
EMAIL_PASS=
OWNER_EMAIL=web.district22@gmail.com
EMAIL_FROM_NAME=Web District
EMAIL_ALLOW_SELF_SIGNED=false
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Requirements:

- Render normally injects `PORT`; the application uses `5000` as its local
  fallback. Do not hardcode a different production port.
- Generate `JWT_SECRET` with a cryptographically secure password manager or
  secret generator.
- Use a Gmail App Password for `EMAIL_PASS`.
- Keep `EMAIL_ALLOW_SELF_SIGNED=false` in production.
- Do not add localhost to production `ALLOWED_ORIGINS`.
- Do not log or paste secret values into tickets or deployment notes.

### Optional Admin Seed

The one-time seed command is:

```powershell
npm.cmd run seed
```

It reads:

```env
ADMIN_FULL_NAME=Web District Admin
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_PHONE=
```

These values are seed-only. Run the seed intentionally, verify the admin can
sign in, then remove or rotate the seed password.

### Render Post-Deploy Checks

1. Open `/api/health`.
2. Confirm logs show `MongoDB connected`.
3. Confirm startup does not listen before MongoDB connects.
4. Run `qa:public` and `qa:protected`.
5. Optionally run `qa:admin` with temporary shell credentials.
6. Check logs for email, CORS, rate-limit, or duplicate-index errors.

## MongoDB Atlas

1. Create a dedicated database user with a strong unique password.
2. Put the complete Atlas connection string in `MONGO_URI`.
3. Configure Network Access for the Render service. Restrict access when
   practical; if broad access is required, rely on strong credentials and
   revisit the rule regularly.
4. Confirm the production database and collections are correct before seeding.
5. Configure Atlas backups or another tested recovery process.

### Required Indexes

Verify these named indexes after deployment:

- `unique_call_slot_time`
- `unique_settings_singleton`
- `unique_client_contract_review`

In Atlas, use each collection's Indexes tab. With `mongosh`, inspect:

```javascript
db.callslots.getIndexes()
db.settings.getIndexes()
db.reviews.getIndexes()
```

Do not drop or recreate production indexes casually. Resolve conflicting legacy
data before applying a unique index.

## Gmail SMTP

1. Enable two-step verification on the Gmail account.
2. Create a Gmail App Password.
3. Set `EMAIL_USER` to the Gmail address.
4. Set `EMAIL_PASS` to the App Password.
5. Set `OWNER_EMAIL` to the notification recipient.
6. Keep `EMAIL_ALLOW_SELF_SIGNED=false`.

Email diagnostics are admin-only. Safe configuration reads are covered by the
admin QA smoke test. Sending a real test email requires
`QA_SEND_TEST_EMAIL=true` and should be done intentionally.

Normal notification failures are non-blocking for core saves. Password reset
and explicit email diagnostics should be tested after SMTP changes.

## Cloudinary

Configure:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Project uploads are admin-only, limited to 5 MB, and accept valid JPEG, PNG,
WEBP, or GIF files. MIME type and file signature must agree. SVG is not
accepted. Cloudinary stores the resulting image as WebP.

After changing Cloudinary credentials, upload one small test image through the
admin project manager and confirm its HTTPS URL renders publicly.

## Release Verification

From `client`:

```powershell
npm.cmd run lint
npm.cmd run build
```

From `server`, against production:

```powershell
$env:API_BASE_URL="https://web-district.onrender.com/api"
npm.cmd run qa:public
npm.cmd run qa:protected
npm.cmd run qa
```

Admin QA skips without credentials. Write QA must remain disabled unless the
test is deliberately approved.

Use [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for the full handoff sequence.
