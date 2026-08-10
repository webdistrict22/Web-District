# Final public polish design

## Scope and constraints

Apply a targeted shared-system polish to the current public website without changing the working production API/auth flows or redesigning the admin and client portals. Keep normal route and hash navigation instant. Do not commit, push, deploy, send email, or write production data.

## Client architecture

- Consolidate final CTA color and interaction states in the shared CTA stylesheet. Every state (`link`, `visited`, `hover`, `active`, and `focus-visible`) must pair its background, text fill, and icon stroke; hover-only transformations are limited to fine pointers.
- Extend `useRestorableAccordion` with a local restore behavior. Services and case-study qualities use smooth restoration unless reduced motion is requested; FAQ keeps restoration disabled.
- Remove FAQ container sizing that changes when an item opens. Stable header minimums and natural answer height preserve wrapping without reserving empty space.
- Keep the Process stepper progress, content, and controls in one bordered surface. The content is separated by dividers and whitespace rather than an inner card. Touch controls use active feedback, fine-pointer hover, and safe post-tap blur.
- Navigate successful project requests and calls to `/success` only after the API resolves. Use `replace` plus navigation state for optional call-slot display; query parameters contain only the success type.
- Rebuild Success, auth, legal, and 404 views using current black/gold/off-white editorial primitives. Shared `AuthShell`, `AuthStatus`, and `PasswordField` components prevent layout and behavior drift.
- `PasswordField` owns visibility state, preserves autocomplete, reserves trailing inline space, uses an always-visible touch-sized button, mirrors correctly in RTL, and exposes localized labels plus `aria-pressed`.
- A pure password-policy helper returns required, length, predictability, and mismatch reasons shared by Signup and Reset Password. Server messages are mapped by reason rather than overwritten.

## Email architecture

- Keep one table-based, inline-styled compact renderer with a hidden preheader, restrained single CTA, plain-text fallback, safe escaping, and current palette.
- Generate all user-facing destinations from validated `CLIENT_URL` paths. Verification/reset tokens appear only in their required URLs.
- Add a single server slot-display formatter based on authoritative `startsAt`, `endsAt`, and `BUSINESS_TIMEZONE`, with friendly Cairo wording and 12-hour English output. Notification payloads reuse it.

## Verification

- Use existing client build, lint, bundle checks, server syntax/unit/integration commands, and `git diff --check`.
- Add lightweight tests with the existing Node test runner for password policy, success destinations, Cairo slot formatting, templates, and links. Do not add a new test framework solely for FAQ.
- Use browser automation for desktop, 390–430px mobile, English/Arabic, CTA states, FAQ/stepper behavior, auth/password toggles, success variants, and changed stale public pages.

## Self-review

The design contains no placeholders, keeps all normal navigation instant, restricts smooth restoration to the two approved expandable interactions, preserves FAQ no-restore behavior, and avoids changes to admin/client presentation.
