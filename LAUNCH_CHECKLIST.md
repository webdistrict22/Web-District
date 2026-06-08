# Web District Launch Checklist

## Pre-Deploy

- [ ] Confirm the intended branch and change set.
- [ ] Confirm no `.env` file or credential is staged.
- [ ] Confirm Node.js 20 LTS or newer is available.
- [ ] Run frontend lint.
- [ ] Run frontend production build.
- [ ] Run backend syntax and safe import checks.
- [ ] Run `qa:public` against the target API.
- [ ] Run `qa:protected` against the target API.
- [ ] Optionally run `qa:admin` with authorized credentials.
- [ ] Keep `QA_SEND_TEST_EMAIL=false` unless a real email test is intended.
- [ ] Keep `QA_RUN_WRITE_TESTS=false` for normal deployment verification.
- [ ] Review Vercel and Render environment variables.
- [ ] Confirm `VITE_API_URL` includes `/api`.
- [ ] Confirm production CORS origins contain only approved domains.
- [ ] Confirm MongoDB Atlas backup and access settings.

Frontend commands:

```powershell
cd client
npm.cmd run lint
npm.cmd run build
```

Backend read-only QA:

```powershell
cd server
$env:API_BASE_URL="https://web-district.onrender.com/api"
npm.cmd run qa:public
npm.cmd run qa:protected
npm.cmd run qa
```

## Deploy

- [ ] Deploy or verify the Render backend.
- [ ] Confirm `/api/health` returns healthy JSON.
- [ ] Confirm Render logs show a successful MongoDB connection.
- [ ] Confirm there are no startup or index errors.
- [ ] Deploy the Vercel frontend.
- [ ] Confirm both production domains resolve correctly.

## Public Website

- [ ] Home opens on desktop and mobile.
- [ ] Services opens and Website Care appears inside Services.
- [ ] Work opens with project cards.
- [ ] Each published case study opens.
- [ ] Process opens.
- [ ] Contact opens with direct WhatsApp, phone, email, and Instagram links.
- [ ] Start request submits successfully.
- [ ] Future appointment slots load.
- [ ] Appointment booking succeeds.
- [ ] English and Arabic toggles work.
- [ ] Arabic uses RTL without affecting email, phone, or URL readability.
- [ ] Mobile navigation opens, traps focus, closes with Escape, and restores focus.
- [ ] Welcome intro does not swap branding during its animation.

## Authentication And Portals

- [ ] Signup creates a client account.
- [ ] Client login redirects to `/account`.
- [ ] Admin login redirects to `/admin`.
- [ ] Invalid or expired sessions redirect cleanly.
- [ ] Client requests load.
- [ ] Client appointments load.
- [ ] Client contracts and proposals load.
- [ ] A Sent contract can be accepted once.
- [ ] Review submission works for an eligible contract.
- [ ] Admin dashboard statistics load.
- [ ] Admin project, package, FAQ, slot, review, request, and contract tools load.

## Email

- [ ] Admin email-status diagnostics show configured values without secrets.
- [ ] Password reset email works.
- [ ] Signup notifications are delivered.
- [ ] Request notifications are delivered.
- [ ] Appointment notifications are delivered.
- [ ] Contract notifications are delivered.
- [ ] An explicit admin test email works when intentionally enabled.

## PWA And Static Files

- [ ] PWA service worker registers.
- [ ] DevTools shows the current service worker controlling the page.
- [ ] `/sw.js` returns no-cache/no-store headers.
- [ ] `/manifest.webmanifest` opens.
- [ ] `/robots.txt` opens.
- [ ] `/sitemap.xml` opens.
- [ ] `/favicon.ico` opens.
- [ ] Hashed CSS and JavaScript files return HTTP 200.
- [ ] Hashed `/assets/*` use immutable caching.
- [ ] No raw or unstyled HTML appears after refresh or deployment.
- [ ] Offline fallback works after one successful online visit.

## Monitoring

- [ ] Vercel Analytics is active.
- [ ] Vercel Speed Insights is active.
- [ ] Render logs have no repeating server errors.
- [ ] MongoDB Atlas shows expected connections and indexes.
- [ ] Cloudinary accepts a valid admin image upload.
- [ ] Invalid or fake image uploads are rejected.

## Safety

- [ ] Never commit `.env` files.
- [ ] Never paste JWT, SMTP, MongoDB, Cloudinary, or admin secrets into docs.
- [ ] Do not run production write QA casually.
- [ ] Production write QA requires both `QA_RUN_WRITE_TESTS=true` and
      `QA_ALLOW_PRODUCTION_WRITES=true`.
- [ ] Record and remove any intentionally created QA records.
