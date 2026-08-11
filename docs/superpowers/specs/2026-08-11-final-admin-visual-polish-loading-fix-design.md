# Final Admin Visual Polish and Loading Fix Design

**Date:** 2026-08-11  
**Status:** Approved design; implementation pending  
**Scope:** Admin interface only

## Objective

Complete one narrow polish pass over the approved Admin redesign. The work will unify the few remaining legacy-looking controls, refine mode and local tab presentation, and correct both Admin loading placements without changing application behavior.

The approved Admin navigation, layout, information architecture, page hierarchy, state flows, APIs, payloads, validation, mutations, filters, pagination behavior, confirmations, and authorization rules remain unchanged.

## Boundaries

This work must not:

- modify the Public website or Client Portal;
- change the fixed Admin navbar dimensions, logo treatment, navigation items, menu timing, menu behavior, or scroll behavior;
- change backend code, API contracts, database behavior, authentication decisions, authorization rules, or security behavior;
- add new application features, reorganize Admin pages, or redesign approved page structures;
- create a broad shared component-library rewrite;
- connect to or write to production, send emails, commit, push, or deploy.

Shared components may be read and reused, but visual overrides must remain Admin-scoped. A shared file will be edited only if an Admin-only solution is impossible; the current design does not require that.

## Selected Approach

Use Admin-scoped CSS plus a small number of explicit semantic hooks in existing Admin JSX.

This approach has the lowest blast radius while producing a coherent Admin control system. It avoids changing the global `Button` component and avoids repetitive page-by-page styling patches.

## Findings and Root Causes

### Buttons and controls

Several Admin actions still inherit global button treatments created for other surfaces:

- primary actions can retain the champagne gradient, lift, and heavier shadow;
- secondary actions can look inconsistent against the Admin's off-white workspaces;
- the global `secondaryLight` hover treatment uses a red border/background even for non-destructive actions;
- Reset controls do not have a clear Admin-specific tertiary treatment and may lack contrast;
- Admin pagination calls currently omit the component's existing light tone;
- icon color generally follows `currentColor`, but Admin styling does not explicitly guarantee that relationship across all button states.

### Mode switch and local tabs

The dashboard mode switch is an inline-flex element placed in a grid context, allowing it to stretch into a large bordered bar. Its heavy filled active state competes with the page hierarchy.

Local management tabs work correctly but retain a more boxed presentation than the final Admin visual language requires.

### Loading

There are two separate visual loading paths:

1. `AdminRoute` renders the compact, non-page Loader while authentication is being checked. Because it is outside `AdminLayout`, it appears as a partial block instead of a centered initial access state.
2. `AdminLayout` uses the same compact Loader as the lazy-route Suspense fallback. Its containing section does not stretch through the available main-content height, so the fallback can occupy a small card-like area rather than centering beneath the fixed navbar.

These are placement and presentation problems only. Authentication and lazy-loading logic do not need to change.

## Detailed Design

### 1. Admin button hierarchy

All new styling is rooted beneath `.wd-admin` or an explicitly Admin-owned class.

#### Primary actions

- Use a solid `#D6A75D` background with dark text.
- Remove the gradient and heavy shadow within Admin only.
- Use the established compact Admin radius and control height.
- On fine-pointer devices, use a restrained lightening/lift response; active state returns to the resting position.
- Focus remains clearly visible and keyboard accessible.

#### Secondary actions

- In light Admin workspaces, use a dark background, off-white text, and a restrained warm border.
- Keep hover/focus high-contrast without introducing destructive red.
- Page-header actions use the same hierarchy with sizing appropriate to the header.

#### Tertiary Reset actions

- Add an Admin-only semantic Reset class to the existing Reset buttons in Requests, Appointments, Contracts, and Clients.
- Use a light/transparent treatment with readable dark text and a subtle warm border.
- Disable Reset only when all relevant filters already equal their existing defaults:
  - Requests: empty search, `All` status, and `All` website type;
  - Appointments, Contracts, and Clients: empty search and `All` status.
- Disabling Reset changes presentation and click availability only; it does not alter filter values, filter logic, request behavior, or reset handlers.
- Refresh actions remain Refresh actions and are not converted to Reset.

#### Destructive and disabled actions

- Destructive controls stay visually neutral at rest.
- Red appears on hover and keyboard focus only.
- Disabled controls use a clearly muted, non-destructive appearance, retain adequate label contrast, and do not show an active hover treatment.

#### Icons

- Admin button and action icons explicitly inherit `currentColor` for both `color` and `stroke`.
- Existing icon components and arrow directions remain unchanged.

### 2. Pagination

- Pass the existing `tone="light"` option to Admin pagination in Requests, Appointments, Contracts, Clients, Reviews, and Slots.
- Preserve page counts, navigation logic, disabled rules, labels, and handlers.
- Apply only small Admin-scoped consistency adjustments if the existing light tone still leaves a contrast or disabled-state mismatch.

### 3. Dashboard mode switch

- Keep the existing component, labels, state, `aria-pressed` semantics, and handlers.
- Prevent grid stretching with start alignment.
- Remove the large enclosing bar, background panel, and heavy border.
- Present the options as compact text controls with a quiet gold active indicator.
- Use warm stone for inactive text and clear focus styling.
- On mobile, allow the options to share the available width without horizontal overflow.

### 4. Local management tabs

- Keep the existing tab structure, scrolling behavior, state, and click handlers.
- Reduce the boxed/pill appearance.
- Use a visually related compact active indicator and quiet inactive treatment.
- Preserve legibility, touch targets, keyboard focus, and horizontal scrolling where needed.

### 5. Initial Admin authentication loading

- In `AdminRoute`, render the existing Loader in its page presentation while `isAuthLoading` is true.
- Keep the existing text and all authentication branches exactly as they are.
- The loader centers within the full viewport because the Admin layout and navbar have not yet mounted at this stage.

### 6. In-layout lazy Admin route loading

- Wrap the Suspense Loader in an Admin-owned route-loading container.
- Make the existing Admin main/container/section chain stretch through its available content box.
- Center the Loader within the remaining Admin content region beneath the fixed navbar.
- Remove the fallback's inner card border, radius, background, and shadow only in this route-loading context so the loading state reads as part of the workspace rather than another nested card.
- Preserve the existing logo animation and loading text.
- Do not hardcode a second navbar offset or change the navbar; the approved Admin layout offset remains the single source of positioning.
- Switching routes must not create a layout jump or horizontal overflow.

### 7. Small consistency polish

Small adjustments are allowed only when directly required to make the touched controls consistent, including control height, radius, gaps, wrapping, and focus visibility. They must not change content hierarchy, page structure, record density, data presentation, or navigation.

## Expected Implementation Surface

The expected implementation files are limited to:

- `client/src/styles/Admin.css` for Admin-scoped visual rules;
- `client/src/components/layout/AdminLayout.jsx` for the in-layout loading wrapper;
- `client/src/routes/AdminRoute.jsx` for the initial page loader presentation;
- the Admin manager files containing Reset controls and pagination calls;
- Admin mode/tab components only if a semantic class or accessibility-preserving hook is needed.

The exact changed-file list will be reported after implementation. No global Public or Client Portal stylesheet should change.

## Verification

After implementation:

1. Review the diff to confirm every change is Admin-scoped and behavior-preserving.
2. Run lint and the existing relevant tests.
3. Run the production build and bundle-size check.
4. Run `git diff --check`.
5. Visually verify at 1366px desktop and 390px mobile:
   - primary, secondary, Reset, destructive, and disabled treatments;
   - icon color inheritance;
   - pagination contrast and disabled states;
   - dashboard mode switch and local management tabs;
   - full-page authentication loading;
   - lazy-route loading centered beneath the fixed Admin navbar;
   - no horizontal overflow, overlap, or navbar regression.
6. If a temporary local-only preview or fixture is required, remove it and every generated QA artifact before handoff.
7. Confirm Public and Client Portal files were not changed and no backend, production, email, commit, push, or deployment action occurred.

## Acceptance Criteria

The pass is complete when the remaining Admin controls share one compact visual hierarchy, Reset and disabled states are unambiguous, destructive emphasis appears only when appropriate, mode/tabs no longer resemble oversized legacy bars, and both Admin loaders occupy the correct visual region—all without any functional or cross-surface change.
