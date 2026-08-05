# Web District Production Runbook

This runbook is deliberately staged. Back up MongoDB first, deploy the backend before the frontend, and keep the previous release available for rollback. Never point maintenance scripts at production until their dry-run output has been reviewed.

## 1. Preflight and backup

1. Confirm Node.js 22.22 or newer and npm 10.
2. Take and verify an Atlas snapshot.
3. Confirm the MongoDB deployment supports multi-document transactions (Atlas replica set/sharded cluster).
4. Configure every required variable in `server/.env.example`; generate separate values for `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, and `OUTBOX_ENCRYPTION_KEY`.
5. Keep `ALLOW_MAINTENANCE_APPLY=NO`, `QA_SEND_TEST_EMAIL=false`, and all production-write QA flags false.
6. Run `npm ci`, backend syntax/unit tests, frontend lint/build, sitemap generation, and the bundle check in a staging checkout.

## 2. Read-only database audits

From `server`, using the intended database URI:

```powershell
npm.cmd run maintenance:indexes
npm.cmd run maintenance:slot-backfill
npm.cmd run maintenance:slot-reconcile
npm.cmd run maintenance:claim-audit
```

These commands are read-only without `--apply`. Save the count-only output with the release record; it contains IDs for inconsistent slot samples but no customer contact data.

## 3. Apply database preparation

After reviewing the backup and dry runs, set `ALLOW_MAINTENANCE_APPLY=YES` only in the controlled maintenance shell:

```powershell
$env:ALLOW_MAINTENANCE_APPLY="YES"
npm.cmd run maintenance:slot-backfill -- --apply
npm.cmd run maintenance:indexes -- --apply
npm.cmd run maintenance:slots -- --apply
npm.cmd run maintenance:slot-reconcile
```

The index script only creates missing indexes. It reports obsolete indexes but never drops them. After confirming no duplicate active slots, manually remove the legacy `unique_call_slot_time` index so the partial `unique_active_call_slot_time` policy can govern active records. Treat any other index drop as a separate reviewed operation.

Unset `ALLOW_MAINTENANCE_APPLY` when finished.

## 4. Backend rollout

1. Deploy one backend instance with the complete environment.
2. Check `/api/health/live`, then `/api/health/ready`.
3. Authenticate as an admin and inspect `/api/health/diagnostics` and `/api/settings/email-diagnostics`.
4. Confirm outbox and slot workers report initialized and the reconciliation counts are zero or understood.
5. Scale to the desired instance count. MongoDB leases make worker polling multi-instance safe.
6. Do not use the email-send diagnostic until a recipient and maintenance window are explicitly approved; SMTP verification is available without sending mail.

## 5. Frontend rollout

1. Generate `client/public/sitemap.xml` and build the exact release artifact.
2. Deploy with `VITE_API_URL` pointing to the production API `/api` base.
3. Verify navigation, refresh survival, logout, email verification, client lists, admin pagination, and Cairo-labelled booking slots.
4. Confirm analytics requests occur only after consent and do not fire on account/admin routes.

## 6. Rollback

- Frontend: restore the previous Vercel deployment.
- Backend: restore the previous Render release. Keep the new secrets available while any new refresh sessions/outbox documents remain; a rollback that cannot read them will force sign-in and pause email delivery but must not delete them.
- Database: do not reverse data migrations blindly. The slot backfill is additive, archive fields are backward-compatible, and new collections can remain. Restore the snapshot only for confirmed data corruption, with an outage declared.
- If email delivery misbehaves, set `EMAIL_OUTBOX_ENABLED=false`, redeploy the backend, and retain queued events for investigation.

## 7. Ongoing checks

- Alert on readiness failures, elevated 5xx/429 rates, growing failed/retry outbox counts, and non-zero slot reconciliation counts.
- Run `maintenance:slot-reconcile` after scheduling incidents and `maintenance:indexes` after schema releases.
- Rotate secrets independently. Rotating `JWT_SECRET` invalidates access tokens; rotating `REFRESH_TOKEN_SECRET` invalidates refresh sessions; rotating `OUTBOX_ENCRYPTION_KEY` requires draining or migrating pending encrypted events first.
