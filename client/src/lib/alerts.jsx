import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

export function confirmAction({
  title = "Confirm action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
} = {}) {
  return new Promise((resolve) => {
    let isSettled = false;
    let toastId;

    const close = (value) => {
      if (isSettled) return;
      isSettled = true;
      toast.dismiss(toastId);
      resolve(value);
    };

    toastId = toast.custom(
      (toastState) => (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          className={`w-[min(420px,calc(100vw-32px))] overflow-hidden rounded-[1.35rem] border border-[#C4A77D]/35 bg-[#080808] text-[#F8F7F4] shadow-[0_24px_80px_rgba(0,0,0,0.46)] transition duration-300 ${
            toastState.visible
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          <div className="bg-[radial-gradient(circle_at_0%_0%,rgba(100,19,26,0.20),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(196,167,125,0.16),transparent_34%)] p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#C4A77D]">
                <AlertTriangle size={20} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold tracking-[-0.04em]">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#D9D4CC]">
                  {message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => close(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F8F7F4]/10 bg-[#F8F7F4]/[0.035] text-[#D9D4CC] transition hover:border-[#C4A77D]/40 hover:text-[#F8F7F4]"
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => close(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-[#F8F7F4]/10 bg-[#F8F7F4]/[0.035] px-4 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 hover:text-[#C4A77D]"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={() => close(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-[#A8874F]/45 bg-[#A8874F] px-4 py-3 text-sm font-semibold text-[#F8F7F4] shadow-[0_14px_34px_rgba(168,135,79,0.20)] transition hover:border-[#C4A77D]/65 hover:bg-[#B89458]"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
}
