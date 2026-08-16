# Legal CTA Button Alignment Design

**Date:** 2026-08-16  
**Status:** Approved design; implementation pending

## Objective

Make the two CTA buttons shared by the Terms and Privacy pages use the same established component, visual treatment, and interactions as the equivalent CTA buttons on the Services page.

## Root Cause

`LegalPage` still renders the generic `Button` component while applying only the dark/light modifier classes from the final CTA system. Those modifier classes provide colors but do not supply the complete `FinalCtaLink` base treatment. Work and Services were already migrated to `FinalCtaLink`, which is why their CTA buttons have the intended sizing, hover inversion, press motion, focus treatment, icon color, and RTL arrow behavior.

## Selected Approach

Replace the two generic `Button` instances in `LegalPage` with `FinalCtaLink` instances and give the legal CTA its own small sizing hooks matching Services.

This avoids coupling the legal pages to Services-specific class names and avoids duplicating the shared CTA behavior.

## Button Mapping

### Start Your Project

- Keep the existing translated label.
- Keep the destination `/start`.
- Use `tone="dark"`.
- Preserve the directional arrow.
- Resting state: near-black background with off-white text.
- Fine-pointer hover: off-white background with dark text and the shared one-pixel lift.

### View Questions & Answers

- Keep the existing translated label.
- Keep the destination `/process#faq`.
- Use `tone="light"`.
- Preserve the directional arrow.
- Resting state: off-white background with dark text.
- Fine-pointer hover: near-black background with off-white text and the shared one-pixel lift.

## Sizing and Responsive Behavior

- Match the Services CTA button minimum height and compact corner radius.
- Preserve the existing legal CTA action column and its responsive behavior.
- Preserve full-width behavior where the existing mobile layout supplies it.
- Keep arrow direction controlled by the existing language/RTL logic in `FinalCtaLink`.
- Keep the shared reduced-motion behavior and visible keyboard focus treatment.

## Scope Boundaries

Only these implementation areas may change:

- `client/src/components/public/LegalPage.jsx`
- the legal CTA button sizing rules in `client/src/components/public/PublicUtilityPages.css`

Do not change:

- button labels or translations;
- destinations or hash navigation;
- CTA copy, layout, background, or spacing;
- Terms or Privacy content;
- Work, Services, Process, Home, footer, navbar, Client Portal, or Admin code;
- shared `FinalCtaLink`, `Button`, or global CTA behavior.

## Verification

After implementation:

1. Confirm Terms and Privacy both inherit the correction through `LegalPage`.
2. Confirm the labels and destinations remain `/start` and `/process#faq`.
3. Confirm dark/light resting colors and hover inversion match Services.
4. Confirm arrows inherit text color and reverse correctly in RTL.
5. Confirm keyboard focus and active press states remain visible.
6. Confirm desktop and mobile action layouts do not overflow.
7. Run lint, unit tests, production build, bundle check, and `git diff --check`.

## Acceptance Criteria

The Terms and Privacy CTA buttons visually and behaviorally match the established Services CTA pair while retaining their exact wording, destinations, responsive placement, and accessibility behavior. No unrelated page or component changes.
