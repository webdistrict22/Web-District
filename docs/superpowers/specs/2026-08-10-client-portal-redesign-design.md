# Web District client portal redesign

Date: 2026-08-10
Status: Approved design, awaiting written-spec review

## Objective

Transform the authenticated client portal into a private Web District workspace that inherits the public site's black, gold, ivory, typography, spacing, and navigation character without becoming a generic admin dashboard.

The redesign is limited to `/account` routes and the scoped password reveal fix on authentication pages. Existing APIs, authentication, authorization, ownership, session refresh, verification, guest-record claiming, pagination, mutations, statuses, contract actions, review eligibility, translations, RTL behavior, analytics exclusions, and server DTOs remain unchanged.

## Existing problems

The current portal is organized around a permanent left sidebar and a repeated welcome card. Every secondary page begins with another large bordered heading card, and populated records break their information into many smaller bordered cards. Overview repeats profile data and navigation links. Reviews repeat the same access rule twice. Profile repeats navigation again. The result is visually dense even when little data exists.

The current portal also underuses horizontal space, does not share the public navbar's visual character, formats appointment details as separate technical fields, and uses dark surfaces for every hierarchy level. The password field does not suppress the Microsoft Edge native reveal control, which can duplicate the custom reveal button.

## Design direction

Design read: a private agency workspace for Web District clients, calm and editorial, using the public site's black, signature gold, and warm off-white language.

- Design variance: 5. Asymmetric enough to avoid dashboard-template symmetry, but orderly for account data.
- Motion intensity: 3. Motion is limited to navigation transitions and direct interaction feedback.
- Visual density: 3. Spacious page introductions and efficient records with restrained grouping.
- Stack: existing React 19, React Router, Tailwind CSS 4, native scoped CSS, GSAP only through the existing staggered menu.
- Dependencies: no new packages.

The visual signature is a fixed black portal header followed by dark editorial page introductions and warm document-like workspace surfaces. The contrast is intentional and follows the user's requested public-site language. Containers are used only where they clarify a record, form, or account section.

## Portal architecture

### Client portal shell

The existing account layout becomes a dedicated portal shell. It owns:

- private page metadata;
- the fixed portal navigation;
- verification notice placement;
- one semantic `main` element;
- the fixed-header content offset;
- safe-area spacing;
- the centered wide content container;
- route-level suspense and the account outlet.

The shell removes the permanent sidebar and repeated welcome banner. Only the Overview page contains a personal greeting.

### Client portal navigation

Desktop navigation is fixed at the top with a solid `#050505` background. It contains the WD logo and a subtle Client Portal identifier, seven route links, language switch, Go Home, and Logout. The active route uses a restrained gold treatment and `aria-current="page"`.

The desktop layout remains one line and compact. It appears only when all seven route links and utilities fit comfortably. The compact navigation activates before collision. There is no horizontal navigation scrolling and no secondary sticky navigation.

The compact navigation instantiates the existing generic staggered-menu component with portal-only items. It does not import public destinations or modify the public navbar. It preserves the existing menu's fast opening character, early link settlement, Escape handling, focus containment, focus restoration, reduced-motion behavior, click-away behavior, and body-scroll lock.

Both desktop and compact headers remain fixed. The shell reserves their height from first render to prevent layout jumps or hidden headings. Mobile spacing accounts for `env(safe-area-inset-top)` where supported.

### Shared portal presentation components

Small portal-specific components are introduced only where they remove real duplication:

- `PortalPageHeader`: eyebrow, semantic page title, supporting copy, and optional primary action.
- `PortalEmptyState`: decorative icon, title, description, and optional action without a fixed oversized height.
- `PortalStatusSummary`: Overview summary links based on real account responses.
- Portal record structures and scoped style utilities for metadata, notes, and actions.

Shared public and admin components are not visually changed. If the existing shared contract component must support a client-specific presentation, the client branch is explicit and the admin branch retains its current output.

## Page designs

### Overview

Overview is the only page with a personal greeting. Its dark introduction contains:

- `CLIENT PORTAL` context;
- `Welcome back, {first name}.` where a first name exists;
- `Your Web District workspace.` as the primary heading;
- concise supporting copy;
- Start Your Project and Book a Call actions.

The compact status summary fetches the existing requests, appointments, and contracts endpoints with a minimal page size. Pagination totals provide real counts. The latest returned contract provides the real project status. The summary contains Requests, Calls, Contracts, and Active project links. Loading and unavailable states remain compact and do not block the rest of the page.

The workflow preserves the four real steps from the existing translation data in one compact sequence. It does not infer new backend state.

### Requests

The page starts with an unboxed editorial heading and New request action. Empty state uses one compact surface.

Populated requests use wide warm record articles. Each record prioritizes business or client name, website type, submitted date, status, project details, preferred contact, budget, and deadline when provided. Contact and readiness fields remain available but are grouped as sparse metadata rather than nested cards. Admin notes remain visually distinct. Existing pagination is unchanged.

### Appointments

The page starts with an unboxed heading and Book another call action. Empty state uses one compact surface.

Populated appointments use the existing slot fields and Cairo-aware formatting. The primary schedule presentation is two lines:

1. full friendly weekday and date;
2. friendly time range followed by the translated Cairo time label.

Raw ISO-like output and the `Africa/Cairo` identifier are never displayed. Topic, status, client notes, admin notes, and existing contact information remain available. Status behavior is unchanged.

### Contracts and proposals

The page starts with an unboxed heading and Start a new request action. Empty state remains simple.

Client contracts use a premium document hierarchy. Title, business, website type, status, created date, scope, total price, deposit, remaining balance, deadline, included pages, included features, payment notes, and client notes are displayed only when returned by the client DTO.

Accept and note actions keep the existing endpoints, confirmation flow, idempotency behavior, loading states, and ownership protections. Financial information is prominent and uses tabular figures. Mobile presentation stacks without a wide table. Admin contract rendering remains unchanged.

### Project Status

The page starts with an unboxed heading and route action. Empty state directs the client to start a request.

Populated progress maps only existing visible contract statuses: Sent, Accepted, In Progress, and Completed. Cancelled remains a terminal state. No new project stages or database states are introduced. The visual progression uses typography, a restrained track, and a strong current-state label instead of five separate bordered cards.

### Reviews

The page introduction contains one explanation only. Locked accounts see one compact state with a View contracts action.

Eligible accounts see the current form with its existing fields, contract filtering, validation, idempotency key, and submission endpoint. The form uses the warm workspace surface and light-tone controls. When submission succeeds, the returned review response is kept in local state and the page shows a clear pending-moderation state for the current session. No edit affordance is shown. No client review-history endpoint is invented.

### Profile

The page starts with an unboxed heading and an optional compact Start a new request action.

Desktop uses two columns:

- primary details: name, business, email, phone, and account type;
- account and security: email verification state, existing password-reset route, guest-record linking explanation, and relevant account notes.

There is no invented profile editor. Email and phone preserve LTR isolation. Mobile stacks both sections naturally. Repeated Requests, Calls, and Reviews navigation cards are removed.

## Styling system

Portal styles are scoped under a portal root class to avoid public and admin regressions.

Core colors:

- main black: `#050505`;
- signature gold: `#D6A75D`;
- primary off-white: `#F7F2EC`;
- soft ivory: `#EEE8DF`;
- dark ink: `#171411`;
- soft black: `#0C0B0A`;
- stone gray: `#AAA39C`;
- warm taupe: `#6D6862`.

The portal uses one shape rule: modest 10 to 14 pixel radii for operational surfaces, pill treatment only for status labels, and compact button radii matching the current public site. Shadows are minimal. Borders are sparse and functional. Hover inversion is limited to fine pointers so touch devices do not retain hover states.

Typography continues the existing Web District Sora display and Inter body stack to match the locked public site. Arabic uses the existing Arabic stack and removes artificial letter spacing.

## Responsive behavior

The implementation is checked at 390, 430, 768, 1024, 1366, and 1440 pixels.

- 390 and 430: fixed compact header, safe-area aware, single-column records, full-width actions where helpful, no horizontal overflow.
- 768: single-column or deliberate two-column metadata where space permits.
- 1024: compact navigation remains active if seven links and utilities do not fit safely.
- 1366 and 1440: desktop navbar and wide centered workspace.
- Wider viewports: content remains constrained and does not stretch excessively.

Long names, business names, descriptions, emails, notes, prices, dates, and Arabic strings wrap without clipping. Directional arrows mirror in RTL. Status text and dates remain readable.

## Accessibility

- One semantic `main` per account route shell.
- One meaningful `h1` per page.
- `aria-current="page"` for active portal navigation.
- Visible focus treatment for all controls.
- Correct button and link semantics.
- Escape, focus containment, focus restoration, and body-scroll management in the compact menu.
- Reduced-motion-safe menu and interaction transitions.
- Decorative empty-state icons hidden from assistive technology.
- Form labels remain above fields with inline validation.
- Email and phone values use LTR isolation.
- Touch targets are at least approximately 44 pixels.

## Password reveal fix

Scoped authentication CSS hides the Microsoft browser-native password reveal and clear controls through `::-ms-reveal` and `::-ms-clear`. Autofill, autocomplete, password managers, and the existing custom reveal button remain intact.

The custom button remains `type="button"`, keyboard accessible, localized, approximately 44 by 44 pixels, `aria-pressed`, correctly positioned in RTL, and available on Login, Signup, and Reset Password.

## Data and error handling

All existing route-level requests, mutations, pagination behavior, and error handling remain. Overview summary requests use existing authenticated endpoints and tolerate partial failures without hiding the page. No server endpoint, DTO, model, ownership rule, archive rule, or status transition changes.

Loading, empty, error, populated, action-in-progress, locked, eligible, and successful-review states receive distinct but consistent presentations.

## Verification

Required automated verification:

- client lint;
- client production build;
- client bundle-budget check;
- existing client tests;
- `git diff --check`;
- final `git status --short`.

Focused browser verification covers the requested empty and populated portal routes, contract actions without submitting mutations, review locked and eligible states when safely previewable, Profile, the compact menu, Arabic RTL, and the six target widths. Local-only route interception or temporary fixtures may be used for visual QA and must be removed afterward. No production database writes or emails are permitted.

## Explicit exclusions

- No Admin redesign.
- No backend changes.
- No database writes.
- No emails.
- No public page or public navigation changes.
- No authentication-page redesign beyond the scoped password reveal fix.
- No commit, push, merge, deployment, or dependency installation.
