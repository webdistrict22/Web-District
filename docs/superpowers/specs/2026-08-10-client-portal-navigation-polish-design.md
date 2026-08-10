# Client Portal Navigation Polish

Date: 2026-08-10

## Objective

Adjust only the authenticated client portal navigation so its dimensions, scroll behavior, mobile-menu typography, language control, and key utilities match the approved public navigation language. The portal remains ticker-free, retains portal-only destinations, and does not modify the public navbar or mobile menu.

## Scope

Implementation is limited to the client portal navigation component and its portal-scoped styles. Existing portal pages, business logic, APIs, authentication, logout behavior, translations, route guards, and content remain unchanged.

The public navigation files are reference-only and must remain diff-clean.

## Navigation Structure

The portal navigation will use one fixed, transformable outer header stack for both desktop and compact modes, following the public navbar structure without adding its ticker.

- Desktop navigation row: 80px.
- Compact/mobile navigation row: 72px plus the phone safe-area inset.
- Existing portal content padding remains reserved for the visible header height, so hiding or revealing the header does not move page content.
- The desktop navigation continues to appear only where all portal links fit without collision.
- The compact navigation retains the current portal routes and responsive breakpoint.

## Scroll Behavior

The portal header will mirror the public navbar controller:

- It is visible at the top of the page.
- It hides when the user scrolls downward beyond 96px.
- It returns when the user scrolls upward.
- Scroll changes smaller than 8px do not toggle it.
- It remains visible while the compact menu is open.
- Keyboard focus entering the header reveals it.
- Route and language changes reset it to visible and synchronize the stored scroll position.
- The transition uses the public 300ms transform treatment and respects reduced-motion preferences already supported by the menu.

## Compact Menu Behavior

The shared `StaggeredMenu` remains the menu implementation, but the portal will mount it inside the fixed outer header stack in the same way as the public navbar instead of making the menu wrapper independently fixed.

This keeps the logo and hamburger/close row stationary while the colored layers and black menu panel slide beneath it. Body scroll lock, Escape-to-close, focus trapping, focus return, click-away behavior, and reduced-motion handling remain owned by the existing shared menu.

The portal-specific mobile-link font override will be removed so route links inherit the exact public menu sizing and responsive rules. Portal route labels, active states, destinations, and ordering remain unchanged.

## Language Control

The portal will reuse the existing public `LanguageToggle` component exactly:

- Same flag treatment.
- Same fixed bottom-left placement.
- Same safe-area offsets.
- Same pill dimensions, typography, hover, and active behavior.
- Same translated accessible label and Arabic/English switching logic.

The current text-only desktop language utility and large mobile-menu language row will be removed to avoid duplicate controls.

## Go Home

The Go Home destination remains `/`.

- Desktop Go Home will use the same gold operational CTA treatment as the public desktop Start Your Project button.
- Compact Go Home will use the shared primary mobile-menu variant used by Start Your Project.
- Only presentation changes; navigation semantics and destination remain unchanged.

## Logout

Logout behavior remains unchanged.

- Its resting state remains a restrained dark utility action.
- On pointer hover, the desktop and compact logout actions receive a portal-scoped red background/border treatment with readable off-white text.
- Touch devices receive no sticky hover behavior.
- Keyboard focus remains clearly visible and accessible.

## Files Expected to Change

- `client/src/components/portal/ClientPortalNav.jsx`
- `client/src/components/portal/Portal.css`
- This specification document

No public navigation file, shared menu implementation, portal page, backend file, Admin file, or translation file is expected to change.

## Verification

Focused browser checks will cover:

- Header hide/reveal at 390px and desktop widths.
- Header visibility while the compact menu is open.
- Stationary logo/close row throughout menu animation.
- Public-sized links at 390px, 430px, and 768px.
- 80px desktop and 72px mobile row dimensions.
- Body scroll lock, Escape, focus trap, and focus return.
- English and Arabic language switching and RTL menu placement.
- Go Home still navigates to `/`.
- Logout receives red hover without touch-hover persistence.
- No content offset regression or layout jump.
- Public navbar and shared menu files remain diff-clean.

Automated verification will run client lint, existing client tests, production build, bundle-budget check, and `git diff --check`.

## Explicit Non-Goals

- No public navbar, ticker, or public mobile-menu change.
- No portal page/content redesign.
- No route, API, authentication, authorization, or logout-logic change.
- No backend, database, email, Admin, deployment, dependency, or configuration change.
- No commit, push, merge, or deployment.
