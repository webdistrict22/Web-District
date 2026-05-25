function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[#D9D4CC]">
          {label}
        </span>
      )}

      <select
        className={`w-full rounded-2xl border border-white/10 bg-[#080808] px-4 py-3 text-[#F8F7F4] outline-none transition focus:border-[#C4A77D]/60 ${className}`}
        {...props}
      >
        {children}
      </select>

      {error && <p className="mt-2 text-sm text-[#C4A77D]">{error}</p>}
    </label>
  );
}

export default Select;
