import { useEffect, useId, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function ConfirmDialog({
  toastState,
  title,
  message,
  confirmText,
  cancelText,
  onClose,
}) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(focusableSelector)
      );

      if (!focusableElements.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const keepFocusInside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        cancelButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", keepFocusInside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      tabIndex="-1"
      className={`w-[min(420px,calc(100vw-32px))] overflow-hidden rounded-[1.35rem] border border-[#C4A77D]/35 bg-[#080808] text-[#F8F7F4] shadow-[0_24px_80px_rgba(0,0,0,0.46)] transition duration-300 ${
        toastState.visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0"
      }`}
    >
      <div className="bg-[radial-gradient(circle_at_0%_0%,rgba(100,19,26,0.20),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(196,167,125,0.16),transparent_34%)] p-5">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#C4A77D]"
          >
            <AlertTriangle size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <p
              id={titleId}
              className="font-display text-lg font-bold tracking-[-0.04em]"
            >
              {title}
            </p>
            <p
              id={messageId}
              className="mt-2 text-sm leading-6 text-[#D9D4CC]"
            >
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F8F7F4]/10 bg-[#F8F7F4]/[0.035] text-[#D9D4CC] transition hover:border-[#C4A77D]/40 hover:text-[#F8F7F4]"
            aria-label={cancelText}
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={() => onClose(false)}
            className="inline-flex items-center justify-center rounded-2xl border border-[#F8F7F4]/10 bg-[#F8F7F4]/[0.035] px-4 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 hover:text-[#C4A77D]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => onClose(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-[#A8874F]/45 bg-[#A8874F] px-4 py-3 text-sm font-semibold text-[#F8F7F4] shadow-[0_14px_34px_rgba(168,135,79,0.20)] transition hover:border-[#C4A77D]/65 hover:bg-[#B89458]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
