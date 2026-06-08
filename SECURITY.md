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

## Session Storage

The current frontend stores JWT authentication in `localStorage`. This is an
accepted current architecture with known exposure if malicious script executes
in the page. Maintain strict dependency, upload, and content practices.

A future security upgrade may migrate sessions to secure, `httpOnly`,
`SameSite` cookies. That should be implemented and tested as a dedicated
authentication change, not a casual maintenance edit.

## Email Dependencies

Nodemailer major-version upgrades should be handled separately and tested
against Gmail transport verification, password recovery, notifications, and
the admin-only diagnostic path before production rollout.

## Secret Rotation

Rotate MongoDB, Gmail, Cloudinary, admin, and JWT credentials immediately if
exposure is suspected. Rotating `JWT_SECRET` signs out all current users.
