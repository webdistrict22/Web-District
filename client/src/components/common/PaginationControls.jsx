import useLanguage from "../../hooks/useLanguage";

function PaginationControls({ pagination, onPageChange, disabled = false, tone = "dark" }) {
  const { isArabic } = useLanguage();
  if (!pagination || pagination.totalPages <= 1) return null;

  const isLight = tone === "light";
  const navClass = isLight
    ? "border-[#171411]/14 bg-[#F7F2EC] text-[#171411]"
    : "border-white/10 bg-white/[0.025] text-[#F7F2EC]";
  const buttonClass = isLight
    ? "border-[#171411]/22 bg-transparent text-[#171411]"
    : "border-white/15 text-[#F7F2EC]";
  const labelClass = isLight ? "text-[#6D6862]" : "text-[#D9D4CC]";

  return (
    <nav
      className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${navClass}`}
      aria-label={isArabic ? "صفحات النتائج" : "Results pages"}
    >
      <button
        type="button"
        disabled={disabled || !pagination.hasPrevious}
        onClick={() => onPageChange(pagination.page - 1)}
        aria-label={isArabic ? "الصفحة السابقة" : "Previous page"}
        className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40 ${buttonClass}`}
      >
        {isArabic ? "السابق" : "Previous"}
      </button>
      <span className={`text-sm ${labelClass}`} aria-live="polite">
        {isArabic
          ? `صفحة ${pagination.page} من ${pagination.totalPages}`
          : `Page ${pagination.page} of ${pagination.totalPages}`}
      </span>
      <button
        type="button"
        disabled={disabled || !pagination.hasNext}
        onClick={() => onPageChange(pagination.page + 1)}
        aria-label={isArabic ? "الصفحة التالية" : "Next page"}
        className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40 ${buttonClass}`}
      >
        {isArabic ? "التالي" : "Next"}
      </button>
    </nav>
  );
}

export default PaginationControls;
