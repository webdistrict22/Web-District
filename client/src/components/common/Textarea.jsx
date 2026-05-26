function Textarea({ label, error, className = "", style, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[#D6CFC2]">
          {label}
        </span>
      )}

      <textarea
        className={`min-h-32 w-full resize-y rounded-2xl border border-[rgba(243,238,228,0.14)] bg-[#1B1B19] px-4 py-3 text-[#F3EEE4] outline-none transition placeholder:text-[rgba(214,207,194,0.55)] focus:border-[#C4A77D] ${className}`}
        style={{ colorScheme: "dark", ...style }}
        {...props}
      />

      {error && <p className="mt-2 text-sm text-[#C4A77D]">{error}</p>}
    </label>
  );
}

export default Textarea;
