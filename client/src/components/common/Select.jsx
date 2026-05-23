function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[#CBD5E1]">
          {label}
        </span>
      )}

      <select
        className={`w-full rounded-2xl border border-white/10 bg-[#07111F] px-4 py-3 text-[#F5F8FC] outline-none transition focus:border-[#C69A4E]/60 ${className}`}
        {...props}
      >
        {children}
      </select>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </label>
  );
}

export default Select;