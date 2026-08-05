import useLanguage from "../../hooks/useLanguage";

function PaginationControls({ pagination, onPageChange, disabled = false }) {
  const { isArabic } = useLanguage();
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <nav className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4" aria-label={isArabic ? "صفحات النتائج" : "Results pages"}>
      <button type="button" disabled={disabled || !pagination.hasPrevious} onClick={() => onPageChange(pagination.page - 1)} aria-label={isArabic ? "الصفحة السابقة" : "Previous page"} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-40">
        {isArabic ? "السابق" : "Previous"}
      </button>
      <span className="text-sm text-[#D9D4CC]" aria-live="polite">
        {isArabic ? `صفحة ${pagination.page} من ${pagination.totalPages}` : `Page ${pagination.page} of ${pagination.totalPages}`}
      </span>
      <button type="button" disabled={disabled || !pagination.hasNext} onClick={() => onPageChange(pagination.page + 1)} aria-label={isArabic ? "الصفحة التالية" : "Next page"} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-40">
        {isArabic ? "التالي" : "Next"}
      </button>
    </nav>
  );
}

export default PaginationControls;
