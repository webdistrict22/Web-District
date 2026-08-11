# Web District final Admin dashboard redesign

Date: 2026-08-11
Status: Approved design, awaiting written-spec review

## Objective

Transform the authenticated Admin area into a premium Web District operational control room: dark, compact, fast to scan, and clearly part of the same product ecosystem as the public site and Client Portal without copying the Client Portal's calmer density.

The redesign is limited to the `/admin` shell and Admin page presentation. Existing authentication, authorization, APIs, DTOs, state, payloads, mutations, validation, pagination, filters, archive protections, status transitions, contract idempotency, upload behavior, and business rules remain unchanged.

## Existing problems

The current Admin area is constrained by a permanent 280-pixel sidebar and repeats a large Control Center card on every route. Most pages then repeat a giant heading card, four large metric cards, a filter card, and one card per record. Populated records frequently contain additional bordered boxes, producing dark card soup and reducing usable width.

The Overview page gives seven metrics equal visual priority and repeats navigation through five oversized quick-action cards. Requests and Appointments bury useful information inside nested containers. The Contract form is functionally complete but visually flat and difficult to scan. Client detail is duplicated in the selected list card and the detail panel. Control pages wrap local navigation inside another large card. Slot and content managers use more surface area and borders than their operational tasks require.

## Design direction

Design read: the Web District design system becomes a premium operational control room.

- Visual density: compact and information-forward, but not crowded.
- Motion: limited to established navigation transitions and direct interaction feedback.
- Stack: existing React, React Router, Tailwind, scoped native CSS, and GSAP only through the existing staggered menu.
- Dependencies: no new packages.
- Visual signature: a fixed black Admin navigation row above a wide dark workspace with compact metrics, quiet dividers, restrained elevated surfaces, and gold reserved for navigation state and primary actions.

The redesign removes containers rather than replacing dark card soup with large white areas.

## Scope and implementation boundary

The approved approach is an Admin-scoped structural redesign:

- replace the sidebar with `AdminNav`;
- introduce only small Admin-specific primitives where duplication is real;
- restructure manager presentation and JSX without changing their operational logic;
- keep Admin styles under an Admin root namespace;
- reuse stable menu and logout interaction patterns without modifying Public or Client Portal code;
- avoid a broad component-library rewrite.

Public pages, public navigation, Client Portal pages and navigation, authentication design, email templates, backend code, database code, API DTOs, security middleware, slot maintenance, outbox processing, and deployment configuration remain outside the edit boundary.

## Admin shell

### Layout

`AdminLayout` becomes a full-width shell that owns:

- private Admin metadata;
- the fixed Admin navigation;
- one semantic `main` element;
- the fixed-header content offset;
- safe-area-aware mobile spacing;
- a generous centered content container;
- route-level suspense and the Admin outlet.

The permanent sidebar and repeated Admin Control Center card are removed. The content container is capped near 1440 pixels, with 24 to 32 pixel desktop gutters and 16 pixel mobile gutters. This gives 1366-pixel workspaces substantially more usable width while preventing records from becoming excessively wide at 1920 pixels.

### Admin navigation

Desktop navigation uses the established Web District 80-pixel row with a solid `#050505` background, no transparency, and no backdrop blur. It contains:

- WD logo;
- a small uppercase `ADMIN` text identifier in muted gold/stone, separated clearly from the logo and rendered without a badge, pill, or card;
- Overview, Requests, Appointments, Contracts, Clients, and Control;
- a gold Go Home action matching the public primary navigation CTA's design while retaining the existing `/` destination;
- a neutral Logout control that becomes destructive red on fine-pointer hover.

The `ADMIN` label does not affect navbar height, route spacing, menu timing, or navigation behavior. Mobile uses the logo only.

Active routing uses the longest relevant Admin route match so Clients stays active for `/admin/clients/reviews` and Control stays active for `/admin/control/*`. Active links receive restrained gold treatment and `aria-current="page"`.

The desktop row appears only at the established wide breakpoint where six links and utilities fit safely. Narrower widths use the compact menu rather than squeezing or horizontally scrolling primary navigation.

### Scroll behavior

The navigation copies the finished interaction pattern without creating a divergent system:

- visible initially and near the top of the page;
- hides after meaningful downward scrolling;
- returns on upward scrolling;
- returns whenever keyboard focus enters the header;
- stays visible while the compact menu is open;
- resets correctly after route changes;
- reserves its full height from first render so headings never sit behind it and no layout jump occurs;
- reduces or removes animation for reduced-motion users.

### Compact menu

The compact Admin menu uses the existing staggered-menu component and established Admin-only item data. It preserves:

- the 72-pixel safe-area-aware mobile header row;
- existing logo and toggle sizing;
- the same panel direction, timing, and early link readiness as Public and Client Portal;
- a stationary logo/close row that does not slide with the panel;
- body scroll locking;
- Escape and click-away closing;
- focus containment and restoration;
- adequate tap targets;
- non-sticky touch hover behavior.

Items are Overview, Requests, Appointments, Contracts, Clients, and Control, followed by Go Home and Logout utilities. No language switch is added because Admin is not translated.

### Logout confirmation

Admin Logout uses the established accessible logout-confirmation component with English Admin copy. It supports Cancel, Escape, backdrop close, focus trapping, body scroll lock, focus restoration, and duplicate-submit protection. Existing logout logic runs only after confirmation.

## Admin presentation system

All Admin styling is scoped beneath `.wd-admin`.

Core palette:

- main black: `#050505`;
- soft black: `#0C0B0A`;
- elevated dark: `#171411`;
- signature gold: `#D6A75D`;
- primary off-white: `#F7F2EC`;
- soft ivory: `#EEE8DF`;
- stone gray: `#AAA39C`;
- warm taupe: `#6D6862`.

Operational surfaces use restrained 10 to 14 pixel radii, sparse low-contrast borders, and minimal shadows. Pills are reserved for status or compact categorical labels. Headings rely on typography and spacing rather than bordered intro boxes. Primary actions are gold; secondary actions are dark or off-white; destructive actions remain neutral until supported hover/focus treatment turns red.

Shared Admin components are intentionally limited to:

- `AdminNav`;
- `AdminPageHeader` for eyebrow/context, semantic title, description, and optional action;
- `AdminMetric` for compact contextual values;
- `AdminToolbar` for consistently arranged search, filters, and compact controls;
- `AdminEmptyState` for concise loading-complete empty or filtered-empty states.

Record layouts stay in their managers because their data and actions differ materially. Existing common form controls and buttons remain available; Admin-scoped modifiers provide the denser presentation without creating another general component system.

## Page designs

### Overview

The page begins with an unboxed `ADMIN DASHBOARD` heading, the existing management description, and the existing Refresh Stats action.

Metrics are split by operational priority:

- primary: Requests, Calls, Reviews, Clients;
- secondary: Slots, Projects, FAQ.

Primary metrics are compact, immediately readable, and retain the useful supporting status counts. Secondary values receive quieter emphasis. Latest Requests and Latest Calls form a balanced two-column activity workspace and stack on smaller screens. Each item prioritizes identity, status, and time without nested cards. Quick actions become a compact row or grid of direct links instead of five oversized management cards.

All existing overview fetches, refresh behavior, totals, latest-item sources, destinations, and error handling remain unchanged.

### Requests

The page uses a plain heading, compact metrics, and a single Admin toolbar containing existing search, status, and website-type filters.

Populated request records prioritize:

- status, website type, and created date;
- business or request identity and submitted name;
- project details;
- phone, email, deadline, and budget;
- brand identity, content readiness, preferred contact, and linked client where present.

Supporting values become a compact metadata grid separated by typography and quiet dividers rather than nested cards. Status editing, admin notes, Save, Create Contract, and Archive occupy a clear action workspace without appearing as a card inside a card. Existing draft state, update payload, filter behavior, pagination, archive endpoint, and confirmation remain unchanged.

### Appointments

Appointments use the same efficient structure as Requests, with existing search and status controls. Records prioritize status, booked date, business/client identity, topic, slot schedule, contact details, and linked client.

Slot presentation uses the existing shared formatting utility in English where canonical slot data is available. The UI shows a friendly weekday/date, a readable time range, and explicit Cairo-time context without changing stored or submitted values.

Status, client notes, admin notes, Save, Create Contract, Archive, filters, pagination, and all existing mutations remain unchanged.

### Contracts

The functionally complete creation form is reorganized into five visual sections:

1. client and proposal source;
2. scope, pages, and features;
3. timeline and dates;
4. pricing and deposit;
5. payment, client, and admin notes.

Sections use headings, spacing, and restrained dividers rather than nested cards. The form is two columns where relationships benefit from proximity and one column on mobile. Every existing field remains present: title, client and business identity, contact information, website type, scope, pages, features, timeline, start date, deadline, price, deposit percentage, payment notes, status, admin notes, and client notes.

Source selection and prefill behavior, validation, numeric conversion, create/edit mode, payload construction, submission key, `Idempotency-Key`, loading state, and reset behavior remain unchanged.

Existing contracts receive an Admin-only record presentation rather than changing the shared Client Portal contract output. Records preserve status, website type, created date, title, client/business, scope, price breakdown, deadline, pages, features, payment notes, client notes, and admin actions. Edit, Mark Sent, In Progress, quick status transitions, and Archive retain their existing rules and endpoints.

### Clients and reviews

Accounts and Reviews remain local secondary tabs beneath the Clients page header. The tabs are lighter than primary navigation and are not sticky.

Client metrics and search/status filters become compact. Desktop uses a clear list-and-detail workspace. Selecting a client updates the existing detail request and selected state. Mobile places selected detail immediately after the selected record while suppressing the duplicate desktop panel, eliminating the current repeated presentation without adding routes or changing state behavior.

Client records prioritize name, business, status, joined date, email, phone, and activity counts. The selected panel preserves profile information and existing request, appointment, and review activity. Status changes retain the existing endpoint and payload. Disabling an account is neutral by default and destructive on supported hover/focus treatment; enabling remains non-destructive.

Reviews retain manual creation, editing, rating, moderation status, visibility, search, filters, pagination, quick updates, and deletion confirmation. Their form, toolbar, populated records, and empty state adopt the shared Admin hierarchy without changing any request or mutation.

### Control workspace

Control uses local secondary tabs for Slots, FAQ, Packages, and Projects. Tabs sit below the page header, remain lighter than the main navigation, may scroll horizontally where needed, and do not become sticky.

The repeated outer Control card is removed. The active manager renders directly in the workspace. Existing initial-tab routing and redirected legacy paths remain unchanged.

### Slots

Slots use a compact create/edit form, summary metrics, toolbar, and dense records. Date and time are presented through the existing English formatting utilities with explicit Cairo-time context. The underlying date, start time, end time, timezone, and payload remain unchanged.

Available, booked, and inactive filtering, editing, activation/deactivation, deletion, pagination, and booked-slot protections remain exactly as implemented. Booked controls remain disabled with a clear explanatory message.

### FAQ

FAQ keeps question, answer, category, order, and visibility fields. The editor uses one restrained work surface, followed by compact search/visibility controls and dense question records. Edit, show/hide, delete confirmation, ordering, and all API behavior remain unchanged.

### Packages

Packages retain name, website type, description, features, best-for content, price label, order, custom state, featured state, and visibility. The form uses internal grouping and dividers. Records prioritize package identity, website type, visibility/featured/custom state, and price before supporting copy and actions. All existing create, edit, toggle, filter, and delete behavior remains unchanged.

### Projects

Projects retain project name, website type, business type, descriptions, case study, key features, pages, tags, images/media, live URL, external case-study URL, order, featured state, and visibility. The editor groups identity, case-study content, media, links, and publishing controls without altering image upload or submission behavior.

Records prioritize project identity, visibility, featured state, website/business type, image, and links, with secondary content grouped beneath. Search, type/visibility filters, create/edit, image upload, toggles, and deletion remain unchanged.

## Loading, empty, error, and populated states

Manager loading behavior continues to use existing loaders and initial-load logic. Empty states appear only after loading completes and distinguish true empty data from filtered results where the manager already has enough context. They remain compact and action-oriented without fixed oversized heights.

Populated records are the primary design target. Long names, emails, phone numbers, business names, descriptions, notes, URLs, prices, dates, and categorical values wrap without clipping. Existing error alerts and recoverable refresh behavior remain in place.

## Alerts and destructive actions

Admin continues using the established global alert design. No Admin notification system is added.

- success and informational notifications dismiss after four seconds;
- errors dismiss after six seconds;
- confirmation dialogs remain until the user chooses.

Existing destructive confirmations remain mandatory. Delete, archive, disable, and logout controls use neutral default styling with red destructive treatment on fine-pointer hover and visible keyboard focus. Touch devices do not retain hover styling.

## Responsive behavior

The implementation is checked at 390, 430, 768, 1024, and 1366 pixels, with structural confidence at 1440 and 1920 pixels.

- 390 and 430: fixed 72-pixel safe-area-aware compact header, logo only, one-column forms and records, intentional metadata order, comfortable actions, no horizontal page overflow.
- 768: compact navigation remains active; metrics and metadata use deliberate two-column arrangements where useful; complex forms remain readable.
- 1024: no squeezed primary navigation; two-column record or form layouts are used only where they remain comfortable.
- 1366: fixed 80-pixel desktop navigation and wide operational workspace.
- Wider desktop: content remains capped near 1440 pixels.

Toolbars wrap before collision. Controls become full width only when useful. Client master/detail becomes sequential on mobile. Contract and complex content forms become one column. Control tabs may horizontally scroll but no secondary navigation becomes sticky.

## Accessibility

- One semantic `main` in the Admin shell.
- One meaningful `h1` per Admin page.
- `aria-current="page"` for active primary and secondary navigation.
- Visible focus treatment for every interactive element.
- Correct link and button semantics.
- Existing labels and error associations for form controls.
- Focus containment, Escape, focus restoration, and body-scroll management for compact navigation and logout confirmation.
- Reduced-motion-safe navigation and interaction transitions.
- Logical DOM order that matches mobile reading order.
- Sufficient palette contrast.
- Approximately 44-pixel interactive targets where practical.
- No clickable non-semantic containers.

## Performance

No dependency is added. Existing private/lazy Admin routes remain lazy. Data fetching, request parameters, caching behavior, memoization, and mutation ordering are not altered. Scoped CSS and small presentational components avoid route-level duplication without making the Admin bundle materially heavier.

## Verification

Required automated checks:

- client lint;
- existing client unit tests;
- client production build;
- client bundle-budget check;
- `git diff --check`;
- final `git status --short`.

Full backend or integration suites do not run unless backend code unexpectedly changes. Server code should change zero files.

Focused browser verification covers:

- desktop Overview populated metrics;
- Requests empty and populated previews;
- Appointments empty and populated previews;
- Contract creation and populated contract previews;
- populated Clients and selected-client detail;
- Control Slots populated state;
- FAQ, Packages, and Projects populated or safely available empty states;
- mobile Admin menu, Overview, populated request and appointment, contract form, client list/detail, Slots, and Control tabs;
- one 768-pixel tablet pass.

Real local populated data is preferred. If unavailable, temporary in-memory frontend fixtures may be used for structural QA and must be removed before completion. Browser QA must not write production data, trigger emails, or submit destructive mutations.

## Explicit exclusions

- No backend change.
- No production database write.
- No email sent.
- No Client Portal redesign or code change.
- No public page redesign or code change.
- No public navbar or mobile-menu code change.
- No authentication-page redesign.
- No API, DTO, authorization, security, outbox, or slot-maintenance change.
- No dependency installation.
- No commit, push, merge, or deployment.

## Final reporting contract

The implementation report must concisely cover the main problems found, exact files changed, Admin navigation architecture, scroll and compact-menu behavior, every redesigned Admin area, destructive actions, logout confirmation, alerts, accessibility, populated-state and responsive QA, lint, tests, build, bundle check, `git diff --check`, and final git status.

It must explicitly confirm that no backend file changed, no production database write occurred, no email was sent, no Client Portal or public page/navigation code changed, and no commit, push, or deployment occurred.
