# Security Policy

## Reporting

Report suspected security issues privately to:

```text
web.district22@gmail.com
```

Do not publish active vulnerabilities, credentials, personal data, access
tokens, or exploit details in public issues.

## Operational Principles

- Real secrets and `.env` files must never be committed.
- Production CORS should allow only approved frontend origins.
- Admin and private client routes require authenticated authorization.
- Admin uploads are limited, image-only, signature-checked, and sent to
  Cloudinary.
- Production errors do not expose stack traces.
- Routine notification failures do not block the underlying saved workflow.
- JWTs and QA credentials must not be shared through screenshots or public
  logs.

## Sessions and account claims

- Access tokens are short-lived and held only in browser memory.
- Refresh tokens are random, hashed in MongoDB, rotated on use, scoped to
  `/api/auth`, and delivered in `HttpOnly` cookies. Production cookies are
  `Secure` and `SameSite=None` for the current cross-origin deployment.
- Refresh/logout mutations require an exact trusted origin and double-submit
  CSRF token. Reuse revokes the token family.
- Guest request/appointment ownership is claimed only after single-use email
  verification, by normalized exact email, inside a transaction with audit
  fields. Unverified signup never claims historical records.
- Passwords require at least 12 characters. Password reset increments the user
  token version and revokes all refresh sessions.

## Email Dependencies

Nodemailer major-version upgrades should be handled separately and tested
against Gmail transport verification, password recovery, notifications, and
the admin-only diagnostic path before production rollout.

## Secret Rotation

Rotate MongoDB, Gmail, Cloudinary, admin, JWT, refresh-token, and outbox
encryption credentials immediately if exposure is suspected. Rotate outbox
encryption only after draining or deliberately migrating pending events.
