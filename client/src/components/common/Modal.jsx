import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title = "",
  description = "",
  children,
  footer,
  maxWidth = "max-w-2xl",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        className="absolute inset-0 bg-[#020817]/80 backdrop-blur-md"
      />

      <div
        className={`relative w-full ${maxWidth} overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0A1A2D] shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-5 border-b border-white/10 p-6">
          <div>
            {title && (
              <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#94A3B8]">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#94A3B8] transition hover:border-red-400/40 hover:text-red-300"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="border-t border-white/10 bg-white/[0.025] p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;