# Web District Production Runbook

This runbook uses the existing Atlas database and the existing Render service. Maintenance commands are read-only unless both `--apply` and `ALLOW_MAINTENANCE_APPLY=YES` are present. Never expose connection strings in logs or release notes.

## Current migration state

- The production hardening code is prepared but not deployed by this local verification task.
- The production audit reported 707 legacy `CallSlot` documents without authoritative `startsAt`/`endsAt`. All 707 parsed successfully in dry-run; none were modified.
- Reconciliation classifies missing authoritative timestamps as malformed before backfill. This is a structural classification, not evidence that the legacy `date`, `startTime`, or `endTime` strings are invalid.
- The CallSlot audit reported no missing index and one extra legacy index. Repository history identifies it as `unique_call_slot_time`, the original non-partial unique `{ date: 1, startTime: 1, endTime: 1 }` index. Keep it during backfill; it still prevents duplicate legacy wall-clock slots.
- The Review audit reported one missing and one extra index. The desired additive public-query index is `{ archivedAt: 1, status: 1, isVisible: 1, createdAt: -1 }`, named `public_reviews_active`. Re-read live definitions with `maintenance:index-details` before applying; the guarded index command will not drop extras or overwrite a conflicting name.
- Three clients are unverified. Unverified clients are retained and cannot claim guest records. Seeded admins are created verified; a legacy admin becomes verified only after a successful password login. Do not bulk-verify clients.
- `ACCESS_TOKEN_EXPIRES_IN` is authoritative. `JWT_EXPIRES_IN` is legacy and unused.

## A-E. Exact database preparation order

Run from `server` against the intended production `MONGO_URI`. Do not begin until an Atlas backup has completed and restore access has been checked.

1. **Atlas backup:** create and verify an on-demand Atlas snapshot. Record its timestamp and restore target.
2. **Backfill dry-run:** keep `ALLOW_MAINTENANCE_APPLY=NO`, then run:

   ```powershell
   npm.cmd run maintenance:slot-backfill
   ```

3. **Guarded backfill:** review the counts, then run:

   ```powershell
   $env:ALLOW_MAINTENANCE_APPLY="YES"
   npm.cmd run maintenance:slot-backfill -- --apply
   ```

4. **First reconciliation:**

   ```powershell
   npm.cmd run maintenance:slot-reconcile
   ```

5. **Additive indexes:** inspect exact definitions, dry-run, then create only missing non-conflicting indexes:

   ```powershell
   npm.cmd run maintenance:index-details
   npm.cmd run maintenance:indexes
   npm.cmd run maintenance:indexes -- --apply
   ```

   Do not drop `unique_call_slot_time` or any Review index in this rollout. If `nameConflicts` is non-empty, stop and review that named index; the script intentionally refuses to replace it.

6. **Second reconciliation:**

   ```powershell
   npm.cmd run maintenance:slot-reconcile
   ```

7. **Slot-maintenance dry-run:**

   ```powershell
   npm.cmd run maintenance:slots
   ```

8. **Review candidates:** confirm every expired candidate is unbooked, has no `bookedBy`, is not protected, and is not referenced by an appointment. Preserve historical booked/referenced slots.
9. **Guarded cleanup:**

   ```powershell
   npm.cmd run maintenance:slots -- --apply
   ```

10. **Final reconciliation:**

    ```powershell
    npm.cmd run maintenance:slot-reconcile
    npm.cmd run maintenance:slot-backfill
    npm.cmd run maintenance:indexes
    ```

11. **Close the maintenance window:**

    ```powershell
    $env:ALLOW_MAINTENANCE_APPLY="NO"
    ```

The backfill is additive and batched. It writes only `startsAt`, `endsAt`, and normalized `timezone`; it preserves the legacy wall-clock fields, booking state, appointment ownership, and documents themselves. Re-running it is safe because already-converted documents no longer match its candidate query.

## F-J. Environment and domains

Configure these on the current Render service: `NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_DAYS`, `CLIENT_URL`, `ALLOWED_ORIGINS`, `BUSINESS_TIMEZONE`, `BOOKING_WINDOW_DAYS`, `SLOT_MAINTENANCE_INTERVAL_MS`, `OUTBOX_ENCRYPTION_KEY`, `EMAIL_OUTBOX_ENABLED`, `EMAIL_OUTBOX_POLL_MS`, `EMAIL_OUTBOX_LEASE_MS`, `EMAIL_OUTBOX_BATCH_SIZE`, `EMAIL_USER`, `EMAIL_PASS`, `OWNER_EMAIL`, `EMAIL_FROM_NAME`, `EMAIL_ALLOW_SELF_SIGNED`, the three `CLOUDINARY_*` values, and `ALLOW_MAINTENANCE_APPLY=NO`.

- Use independent token secrets. `OUTBOX_ENCRYPTION_KEY` must be exactly 64 hexadecimal characters.
- Keep `EMAIL_ALLOW_SELF_SIGNED=false` and `ALLOW_MAINTENANCE_APPLY=NO` during normal runtime.
- Add `api.web-district.com` to the existing Render service, copy Render's required DNS target into the DNS provider, and wait for Render-managed TLS to become valid. Do not create another backend service.
- Set Vercel `VITE_API_URL` to `https://api.web-district.com/api` for the production build.
- Set `CLIENT_URL` to the canonical HTTPS frontend origin. Set `ALLOWED_ORIGINS` to the exact canonical and intentionally supported frontend origins only; never use `*` with credentialed requests.
- Production refresh and CSRF cookies are HttpOnly/Secure as applicable, credentialed, and configured for the frontend/API cross-origin deployment. Verify `Access-Control-Allow-Credentials: true` and exact-origin reflection.

## K-L. Deployment order

1. Deploy the hardening-compatible backend to the current Render service first.
2. Verify liveness/readiness and compatibility with the still-current frontend.
3. Deploy the frontend from the verified production build.
4. Verify public routes, login/registration/verification, session restoration, logout, admin/client guards, pagination, requests, and booking in English and Arabic.
5. Meta Pixel initializes automatically only when a valid Pixel ID is built in. Vercel Analytics and Speed Insights load automatically. Admin and authenticated account routes remain excluded from nonessential analytics; no consent popup or privacy-choice control exists.

## M. One authorized SMTP verification

After deployment and only with an authorized recipient, first inspect protected email diagnostics and transporter verification. Then submit one controlled workflow that queues one email. Confirm the outbox moves from pending/processing to delivered and record only event status/message metadata—never recipient data or payload content. This is the only live-send verification in the rollout.

## N. Health and readiness

Check, in order:

```text
GET https://api.web-district.com/api/health/live
GET https://api.web-district.com/api/health/ready
GET https://api.web-district.com/api/health/diagnostics   (authorized admin)
GET https://api.web-district.com/api/settings/email-diagnostics   (authorized admin)
```

Confirm MongoDB is connected, both workers are initialized, outbox backlog is understood, reconciliation has no unexpected conflicts, and no elevated 5xx/429 rate appears. Confirm an ad blocker can block Meta Pixel without affecting navigation or forms.

## O. Rollback

- Frontend: restore the previous Vercel deployment.
- Backend: restore the previous release on the current Render service. Keep new secrets available while new refresh sessions or encrypted outbox documents exist; otherwise users may need to sign in again and queued email processing must remain paused.
- Email incident: set `EMAIL_OUTBOX_ENABLED=false`, redeploy, and retain queued records for investigation.
- Database: do not reverse the additive timestamp backfill or drop indexes blindly. Restore the verified snapshot only for confirmed data corruption under an incident window.
- After rollback, run read-only reconciliation and health checks. Keep `ALLOW_MAINTENANCE_APPLY=NO`.
