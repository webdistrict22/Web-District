# Alerts, Logout Confirmation, and Case-Study CTA Design

## Objective

Polish three existing interface details without changing unrelated layout, navigation, routes, content, authentication behavior, or business logic:

1. Make every standard application alert match the current Web District visual system and dismiss predictably.
2. Require explicit confirmation before a client logs out from either portal navigation layout.
3. Correct only the first `Start Your Project` button in the individual case-study CTA so it matches the established light final-CTA button.

## Scope Boundaries

- Keep all existing alert messages and the actions that trigger them.
- Apply the alert presentation and timing globally because all standard alerts share the application-level `react-hot-toast` toaster.
- Do not convert confirmation dialogs into timed notifications. A confirmation remains visible until the user chooses an action.
- Add logout confirmation only to the client portal navigation. Do not change authentication endpoints, session clearing, redirects, or other logout behavior.
- On the case-study CTA, change only the first `Start Your Project` control. Keep the `Have Questions?` control, its destination, design, and behavior unchanged.
- Do not redesign other CTA sections, portal content, public navigation, admin pages, forms, or backend code.

## Alert Design and Timing

The application-level toaster will provide one consistent presentation for existing success and error calls. Alerts will use:

- a compact solid `#050505` surface;
- off-white text from the existing palette;
- a restrained border and shadow;
- gold status treatment for success and red status treatment for errors;
- compact spacing, icon sizing, and typography consistent with the redesigned portal;
- responsive width that stays inside the mobile viewport;
- positioning below the fixed navigation row, including phone safe-area inset where relevant.

Timing will be explicit:

- success: 4,000 milliseconds;
- error: 6,000 milliseconds;
- other standard informational alerts: 4,000 milliseconds.

The existing confirmation helper may continue to use an indefinite duration because it represents a decision, not an informational alert. Standard alerts will retain `react-hot-toast` lifecycle behavior and leave the DOM after their exit transition.

## Logout Confirmation Flow

Both the desktop Logout button and the compact-menu Logout link will call one portal-level request-to-logout handler instead of invoking `logout()` immediately.

The handler opens a dedicated portal logout dialog. On compact layouts, the menu closes as part of the same selection flow before the dialog becomes the active interface.

The dialog will:

- use `role="alertdialog"`, an accessible name, and an accessible description;
- render over a subdued backdrop with a solid `#050505` panel, gold hairline details, off-white copy, and a red destructive confirmation action;
- provide localized English and Arabic title, explanation, Cancel, Confirm, and in-progress text;
- focus the safe Cancel action when opened;
- trap keyboard focus while open;
- close on Cancel, Escape, close control, or backdrop interaction;
- restore focus to the Logout trigger when cancelled;
- lock page scrolling while open and restore the prior body overflow value when closed;
- prevent repeated confirmation while logout is in progress;
- call the existing authentication `logout()` function only after explicit confirmation.

After confirmation, the existing authentication flow remains responsible for the API request, local session cleanup, navigation protection, and the `Logged out successfully.` toast. Cancelling performs no authentication or session mutation.

## Case-Study CTA Correction

The visual conflict comes from the first case-study CTA combining the generic primary `Button` styles with the shared light final-CTA styles. The higher-priority champagne background wins, producing the incorrect muted-gold button.

Only that first control will switch to the established shared `FinalCtaLink` light treatment already used by the correct final CTA:

- destination remains `/start`;
- label remains `Start Your Project` through the existing translation key;
- no arrow icon is added;
- light resting surface, dark text, border, focus ring, hover inversion, and pressed motion come from the shared final-CTA component;
- the case-study-specific width, height, and responsive layout remain intact.

The second `Have Questions?` button is not modified.

## Component Boundaries

- The global toaster configuration owns standard alert appearance and timeout defaults.
- A focused portal logout-dialog component owns modal presentation, focus management, keyboard handling, and body-scroll locking.
- `ClientPortalNav` owns whether the logout dialog is open and connects confirmation to the existing `logout()` callback.
- The shared `FinalCtaLink` remains the source of truth for the corrected first case-study CTA behavior.

No new dependency is required.

## Verification

Automated checks:

- lint;
- unit tests;
- production build;
- bundle check;
- `git diff --check`;
- a diff audit confirming unrelated public navigation and the second case-study CTA remain unchanged.

Responsive browser checks:

- success alert appearance and removal after four seconds;
- error alert appearance and removal after six seconds;
- toast clearance below desktop and compact fixed navigation, including mobile safe-area positioning;
- desktop and compact Logout both open the dialog without logging out immediately;
- Cancel, close control, backdrop, and Escape preserve the authenticated session;
- keyboard focus stays within the dialog and returns to the initiating control after cancellation;
- body scrolling is locked only while the dialog is open;
- Confirm logs out once and produces the redesigned success alert;
- English, Arabic, LTR, and RTL dialog behavior;
- corrected first case-study CTA resting, hover, focus, and pressed states at desktop and mobile widths;
- unchanged `Have Questions?` button behavior and destination.

