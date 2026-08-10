import { useEffect, useEffectEvent, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { LogOut, X } from "lucide-react";
import "./PortalLogoutDialog.css";

const focusableSelector = [
  "button:not([disabled])",
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function PortalLogoutDialog({
  open,
  title,
  message,
  cancelText,
  confirmText,
  loadingText,
  closeLabel,
  isSubmitting,
  returnFocusRef,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const titleId = useId();
  const messageId = useId();
  const cancelFromEffect = useEffectEvent(() => {
    if (!isSubmitting) onCancel();
  });

  useEffect(() => {
    if (!open) return undefined;

    const originalOverflow = document.body.style.overflow;
    const returnFocusTo = returnFocusRef?.current;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelFromEffect();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(focusableSelector),
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
      } else if (!event.shiftKey && document.activeElement === lastElement) {
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
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
      document.body.style.overflow = originalOverflow;
      window.requestAnimationFrame(() => {
        if (returnFocusTo?.isConnected) returnFocusTo.focus();
      });
    };
  }, [open, returnFocusRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="wd-portal-logout-dialog__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        className="wd-portal-logout-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        aria-busy={isSubmitting}
        tabIndex="-1"
      >
        <button
          type="button"
          className="wd-portal-logout-dialog__close"
          aria-label={closeLabel}
          disabled={isSubmitting}
          onClick={onCancel}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <span className="wd-portal-logout-dialog__icon" aria-hidden="true">
          <LogOut size={22} />
        </span>
        <p className="wd-portal-logout-dialog__eyebrow">Web District</p>
        <h2 id={titleId} className="font-display">{title}</h2>
        <p id={messageId} className="wd-portal-logout-dialog__message">{message}</p>

        <div className="wd-portal-logout-dialog__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="wd-portal-logout-dialog__cancel"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="wd-portal-logout-dialog__confirm"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? loadingText : confirmText}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default PortalLogoutDialog;
