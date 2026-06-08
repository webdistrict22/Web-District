# Web District Maintenance Guide

## Routine Content Updates

### Public Settings

Use `/admin/control` to update agency contact values, hero copy, CTA text, and
footer text. Verify the Home, Contact, and footer areas after saving.

### Projects And Work

Use `/admin/control/projects` to create, edit, feature, show, hide, or upload
images for database-backed projects.

The frontend also contains fallback portfolio content in:

```text
client/src/data/demoProjects.js
```

When adding or changing a fallback project:

1. Keep the slug stable and URL-safe.
2. Add or update project images under `client/public/images/projects`.
3. Add case-study showcase images when needed.
4. Update English and Arabic project strings in
   `client/src/i18n/translations.js`.
5. Add a public case-study URL to `client/public/sitemap.xml` when it should be
   indexed.
6. Run frontend lint and build.

Brand names may remain in English when that is the intended official name.

### Packages And Website Care

Use `/admin/control/packages` for database-backed service packages. The public
Services page uses fallback content immediately and then merges visible package
data.

Website Care is maintained as a section of the Services page. Update its copy in
`client/src/i18n/translations.js` and verify both languages.

### Reviews

Use `/admin/clients/reviews` to approve, reject, hide, or create testimonials.
Client submissions remain moderated before public display.

### FAQ

Use `/admin/control/faq` to create, order, show, hide, or edit FAQ entries.

## Arabic And English

Public and client translation strings live in:

```text
client/src/i18n/translations.js
```

For every new visible public/client string:

1. Add matching English and Arabic keys.
2. Check interpolation placeholders match in both languages.
3. Verify Arabic layout at mobile and desktop widths.
4. Keep technical values, emails, phone numbers, URLs, and official brand names
   readable.
5. Confirm admin pages remain English/LTR.

New project slugs should receive matching entries under the project translation
group when localized descriptions or labels are expected.

## Email Operations

Email uses Gmail SMTP through Nodemailer.

Before testing:

- Confirm `EMAIL_USER` is the Gmail address.
- Confirm `EMAIL_PASS` is a current Gmail App Password.
- Confirm `OWNER_EMAIL` is correct.
- Keep `EMAIL_ALLOW_SELF_SIGNED=false` in production.

Read-only admin diagnostics:

```powershell
cd server
$env:API_BASE_URL="https://web-district.onrender.com/api"
$env:QA_ADMIN_EMAIL="authorized-admin@example.com"
$env:QA_ADMIN_PASSWORD=""
npm.cmd run qa:admin
```

The script does not send an email unless `QA_SEND_TEST_EMAIL=true`. Set
`QA_TEST_EMAIL` to an approved recipient when sending a real diagnostic.

After any Nodemailer major-version upgrade, separately retest transport
verification, password reset, signup, request, appointment, contract, and
explicit diagnostic email paths.

## PWA And Cache Recovery

Normal deployments should update cleanly because navigation is network-first,
the service worker bypasses API data, and HTML/service-worker files are not
aggressively cached.

When changing service-worker caching behavior:

1. Bump `CACHE_NAME` in `client/public/sw.js`.
2. Keep the `web-district-pwa-` prefix so old project caches are deleted.
3. Run a production build.
4. Deploy and confirm `/sw.js` returns no-cache/no-store headers.
5. Test an existing installed PWA and a fresh browser session.

For a single affected browser:

1. Open DevTools, Application, Service Workers.
2. Unregister the Web District service worker.
3. Clear the site's storage and Cache Storage.
4. Close all Web District tabs.
5. Reopen the site online and hard refresh once.

On mobile, clear the browser's site data or remove and reinstall the PWA.

## Search Favicon Updates

Confirm these files still return HTTP 200:

- `/favicon.ico`
- `/favicon-16x16.png`
- `/favicon-32x32.png`
- `/apple-touch-icon.png`
- `/icons/icon-192.png`
- `/icons/icon-512.png`

Search engines cache favicons independently. After a correct deployment, allow
time for recrawling and use the search engine's webmaster tools to request a
fresh crawl when appropriate.

## Render Monitoring

Review Render logs after deployments and when users report failures.

Look for:

- Successful MongoDB connection before the server starts listening
- Repeated 5xx responses
- CORS rejection patterns
- Rate-limit spikes
- SMTP transport failures
- Cloudinary failures
- Duplicate-key or index creation errors

Do not log environment values or user tokens while troubleshooting.

## MongoDB Index Verification

Required named indexes:

- `unique_call_slot_time`
- `unique_settings_singleton`
- `unique_client_contract_review`

Inspect them in Atlas or run:

```javascript
db.callslots.getIndexes()
db.settings.getIndexes()
db.reviews.getIndexes()
```

Before introducing another unique index, audit existing production data for
duplicates and create a backup.

## JWT Secret Rotation

Changing `JWT_SECRET` immediately invalidates all existing sessions.

Safe rotation:

1. Schedule a maintenance window or notify users that they must sign in again.
2. Generate a new long random secret.
3. Update only the Render secret value.
4. Redeploy the backend.
5. Confirm login, `/auth/me`, admin access, and client access.
6. Run protected and admin QA.
7. Never store the previous or new secret in the repository.

## Dependency Maintenance

Review package updates in a separate branch. Avoid mixing major dependency
upgrades with content or production hotfixes.

For Nodemailer major upgrades:

1. Read the migration notes.
2. Update the lockfile intentionally.
3. Run backend syntax and import checks.
4. Deploy to a non-production environment when available.
5. Verify Gmail transport and every critical email workflow.
6. Keep rollback instructions ready.
