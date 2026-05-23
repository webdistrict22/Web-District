function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[#CBD5E1]">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[#F5F8FC] outline-none transition placeholder:text-[#64748B] focus:border-[#C69A4E]/60 ${className}`}
        {...props}
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </label>
  );
}

export default Input;