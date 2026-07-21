export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

export const getFixedHeaderOffset = () => {
  if (typeof document === "undefined") return 0;

  const header = document.querySelector("header");
  const height = header?.getBoundingClientRect().height || 0;

  return height + 16;
};

export const focusElementWithHeaderOffset = (element) => {
  if (!element || typeof window === "undefined") return;

  const offset = getFixedHeaderOffset();
  const rect = element.getBoundingClientRect();
  const needsScroll = rect.top < offset || rect.bottom > window.innerHeight;

  if (needsScroll) {
    const top = window.scrollY + rect.top - offset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  element.focus?.({ preventScroll: true });
};

export const focusFirstInvalidControl = (form, names = []) => {
  if (!form) return;

  window.requestAnimationFrame(() => {
    const escapeSelector = (value) =>
      window.CSS?.escape ? window.CSS.escape(value) : String(value).replaceAll('"', '\\"');
    const target = names
      .map((name) =>
        form.querySelector(
          `[name="${escapeSelector(name)}"], [data-validation-name="${escapeSelector(name)}"]`
        )
      )
      .find(Boolean);

    focusElementWithHeaderOffset(target);
  });
};
