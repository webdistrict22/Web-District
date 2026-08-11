# Web District Admin body design correction

Date: 2026-08-11  
Status: Approved architecture, awaiting written-spec review

## Objective

Refine the current uncommitted Admin redesign so its body uses the finished Client Portal's premium visual language while remaining denser and more operational. The approved Admin navbar remains locked. The correction replaces fragmented dark dashboard cards with a black editorial shell, confident page headings, and one primary off-white workspace containing summary, filters, records, forms, and empty states.

This is a presentation-only Admin refinement. Existing data, API, validation, mutation, pagination, filtering, upload, confirmation, authorization, and routing behavior remains unchanged.

## Locked scope

The following remain untouched:

- `AdminNav`, its desktop and mobile layouts, dimensions, timing, scroll behavior, route state, Go Home, Logout, confirmation, focus management, and body-scroll handling;
- Client Portal code and design;
- public pages and navigation;
- authentication pages and behavior;
- alerts and logout dialog;
- backend, APIs, DTOs, MongoDB, email, security, analytics, slot maintenance, deployment, and route loading.

The task changes only Admin body JSX, Admin-scoped presentation primitives, and Admin-scoped CSS. Existing uncommitted work is refined in place and preserved. No commit, push, or deployment occurs.

## Visual system

The page shell remains `#050505`. Page headings stay editorial and unboxed. Each Admin page uses one dominant workspace surface in `#F7F2EC`, with `#EEE8DF` reserved for useful secondary field or subsection backgrounds. Workspace text uses `#171411`; gold remains `#D6A75D`; supporting text uses the existing warm stone family. Semantic destructive red remains the only additional color.

The workspace uses a restrained outer border and radius. Internal hierarchy comes from typography, grid, spacing, and thin divider lines. Borders are limited to the outer workspace, form controls, record separators, active tabs, necessary buttons, and semantic status badges.

Admin spacing is tighter than Client Portal spacing, but both areas clearly belong to the same product family.

## Shared Admin body primitives

The correction keeps shared pieces narrow in responsibility:

- `AdminWorkspace`: the main off-white operational surface with optional heading/action areas and internal section divisions;
- `AdminMetric` and the metric container: metrics become cells in one combined summary rather than detached cards;
- `AdminToolbar`: becomes an internal filter section without its own floating card treatment;
- `AdminEmptyState`: becomes concise inline workspace content without large fixed height or duplicated actions;
- a lightweight local mode control for Manage/Create or Manage/Add states.

Existing page-specific record components remain page-specific because their data and actions differ. This is not a general component-library rewrite.

## Page structure

Most pages follow this sequence:

1. locked Admin navbar;
2. unboxed `ADMIN DASHBOARD` eyebrow, large title, description, and optional page action;
3. one off-white workspace;
4. combined summary cells;
5. optional filter section;
6. records, form, loading, error, or empty content within the same workspace.

A second workspace is allowed only when it communicates a genuinely separate task, such as Overview recent activity.

## Overview

Overview removes Quick Actions, Available Slots, Visible Projects, and Visible FAQ. It retains Website Requests, Booked Calls, Pending Reviews, and Clients in one `Platform at a glance` workspace. Existing supporting counts remain where useful.

Latest Requests and Latest Calls share one Recent Activity workspace. Desktop uses two internal columns; mobile stacks them. They are separated by typography and dividers rather than floating dark cards. Existing data sources, refresh action, errors, and navigation destinations remain unchanged.

## Requests

Requests uses one off-white workspace containing:

- combined Total, New, In Progress, and Completed summary cells;
- search, status, website-type, Apply, and Reset controls;
- request records, loading/error state, or a restrained empty state.

The empty state removes its duplicate Open Start Page action because the page header already provides it.

Populated requests become structured rows separated by dividers. They retain client/submitted identity, business, website type, status, submitted date, description, phone, email, deadline, budget, brand/content readiness, preferred contact, linked client, status editing, admin notes, Save, Create Contract, and Archive. Desktop can use a content/action grid; mobile stacks in logical reading order.

## Appointments

Appointments mirrors the Requests workspace architecture with combined Total, Pending, Accepted, and Done summary cells and its existing search/status filters. The empty state removes the duplicate Manage Slots action.

Records retain human-readable English Cairo date/time, client and business identity, topic, contact details, linked client, client notes, admin notes, status editing, Save, Create Contract, and Archive. Appointment values and mutations are unchanged.

## Contracts

Contracts gains two local presentation modes:

- Manage Contracts, the default;
- Create Contract.

Manage mode contains one off-white workspace with combined Total, Draft, Sent, and In Progress metrics, existing filters, Create Contract action, records, pagination, and empty state. Existing contract records retain all content and actions but use clean rows with divider-based internal groupings.

Create mode displays the approved five-section form inside one off-white workspace:

1. Client and proposal;
2. Scope;
3. Timeline;
4. Pricing;
5. Notes.

Sections are headings, support text, fields, and dividers—not nested cards. Existing request/appointment source selection, URL prefill, field values, validation, numeric conversion, submission keys, idempotency headers, edit mode, status actions, reset behavior, and payload construction remain unchanged. A request/appointment source URL automatically opens Create mode. Editing a contract opens the same form in edit mode. A clear return to Manage mode is available.

Fields inside the light workspace use warm-light backgrounds, dark text, muted readable placeholders, subtle warm borders, and gold focus treatment. Browser date/time controls, selects, textareas, disabled states, autofill, and validation messages remain legible. Compatible fields use two columns on desktop; mobile uses one column.

## Clients and Reviews

Accounts and Reviews remain approved local secondary tabs.

Client Accounts uses one off-white workspace containing its subheading/action, combined Total, Active, Disabled, and With Requests metrics, filters, and master/detail content. Client records use direct typography and simple grids instead of mini-cards. They retain status, joined date, name, business, email, phone, request/call/review counts, Show Details, and Enable/Disable actions.

Desktop retains master/detail side-by-side inside one coherent workspace. Selected detail is not a floating dashboard card. Mobile places selected detail immediately after the selected record and suppresses the desktop duplicate. Activity sections remain readable and divider-based.

Reviews gains two local modes:

- Manage Reviews, the default;
- Add Testimonial.

Manage mode contains combined Total, Approved, Pending, and Visible metrics, existing filters, moderation records/actions, pagination, and an Add Testimonial action. Add mode contains the existing manual testimonial form inside one off-white workspace. All fields, validation, logo/upload behavior, visibility, moderation, payloads, and API behavior remain unchanged. Editing an existing review opens the form mode with its existing values.

## Control workspace

Slots, FAQ, Packages, and Projects remain approved local secondary tabs and are not sticky. Each active manager renders an off-white workspace beneath them.

### Slots

Slots gains Manage Slots and Create Slot modes, defaulting to Manage. Manage mode contains combined Total, Available, Booked, and Inactive metrics, existing filtering, Create Slot action, clean slot rows, and pagination. Rows retain friendly Cairo date/time, notes, Edit, Activate/Disable, Delete, booked-slot disabled controls, and the protection explanation.

Create mode contains Date, Start Time, End Time, Notes, and Create Call Slot in a compact light form. Editing a slot opens this form with existing values. Existing payloads and booked protections remain unchanged.

### FAQ

FAQ defaults to management. Add FAQ and Edit reveal the existing form within the workspace. Records use clean divider-separated sections and retain question, answer, category/order where supported, visibility, editing, and deletion.

### Packages

Packages defaults to management. Add and Edit reveal the existing complete package form. All name, type, description, feature, best-for, pricing, order, custom, featured, visibility, filtering, toggle, and delete behavior remains intact.

### Projects

Projects defaults to management. Add and Edit reveal the complete existing project form. All identity, case-study, feature/page/tag, image/upload, URL, order, featured, visibility, filtering, and deletion behavior remains intact. Public Work output is untouched.

## Records, buttons, and empty states

Records are light structured rows inside the workspace, separated by thin lines or restrained row boundaries. They do not become nested workspace cards. Long names, emails, descriptions, scopes, notes, prices, dates, URLs, and statuses wrap safely.

Primary buttons remain gold. Secondary buttons adapt to light surfaces with the established inversion behavior. Destructive actions remain visually secondary by default and turn red on supported hover/focus. Touch devices do not retain hover styling.

Empty states are concise internal content. Duplicate CTAs are removed where the page header or mode control already provides the action. No empty state uses a large fixed height.

## Responsive behavior

Verification targets 390, 430, 768, and 1366 pixels.

- Mobile keeps the locked 72-pixel navbar and one clear page heading.
- Each page has one main off-white workspace.
- Combined metrics use a 2-by-2 internal grid.
- Filters and forms stack in one column.
- Manage/Create controls fit without horizontal overflow.
- Records stack in logical order and preserve usable actions.
- Client master/detail becomes sequential.
- Control tabs remain horizontally usable without becoming sticky.
- Pagination remains visible.
- Long values wrap without clipping.
- No nested-card regression or excessive empty vertical space appears.

Desktop at 1366 pixels retains the locked 80-pixel navbar and uses compact operational grids within the 1440-pixel-capped shell.

## Accessibility and performance

The existing semantic `main`, page-level `h1`, labels, error associations, focus handling, route state, and keyboard behavior remain. New mode controls use buttons with clear pressed/current state. Workspace sections use semantic headings and logical DOM order. Focus remains visible on light surfaces. Disabled controls remain distinguishable.

No dependency is added. Existing lazy routes and data-fetching behavior remain. Mode state is local presentation state; it does not duplicate server data. Long lists retain existing pagination, and no new request waterfall is introduced.

## Verification

After implementation:

- client lint;
- existing client unit tests;
- client production build;
- bundle-budget check;
- `git diff --check`;
- final `git status --short`.

Focused visual QA covers the requested 1366-pixel desktop and 390-pixel mobile pages, with structural checks at 430 and 768 pixels. Populated Requests, Appointments, Contracts, Clients, Slots, and Reviews are checked with real local data or temporary local-only fixtures. All fixtures and QA hooks are removed afterward. No production data mutation or email occurs.

## Explicit exclusions

- No Admin navbar or menu change.
- No Client Portal change.
- No public-site or public-navigation change.
- No authentication or alert change.
- No backend, API, database, email, security, analytics, maintenance, or deployment change.
- No dependency installation.
- No commit, push, or deployment.
