function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[#D9D4CC]">
          {label}
        </span>
      )}

      <textarea
        className={`min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[#F8F7F4] outline-none transition placeholder:text-[#D9D4CC] focus:border-[#C4A77D]/60 ${className}`}
        {...props}
      />

      {error && <p className="mt-2 text-sm text-[#C4A77D]">{error}</p>}
    </label>
  );
}

export default Textarea;