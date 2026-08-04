import { useId } from "react";

function Select({
  label,
  error,
  children,
  tone = "dark",
  className = "",
  style,
  id,
  required,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const describedBy = [ariaDescribedBy, error ? errorId : ""]
    .filter(Boolean)
    .join(" ");
  const isLight = tone === "light";
  const labelClass = isLight
    ? "font-semibold text-[#171411]"
    : "font-medium text-[#D6CFC2]";
  const selectClass = isLight
    ? "rounded-xl border-[rgba(23,20,17,0.22)] bg-[#FFFDFC] text-[#171411] focus:border-[#B88A45]"
    : "rounded-2xl border-[rgba(243,238,228,0.24)] bg-[#1B1B19] text-[#F3EEE4] focus:border-[#C4A77D]";
  const errorClass = isLight ? "text-[#64131A]" : "text-[#C4A77D]";

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={selectId}
          className={`mb-2 block text-sm ${labelClass}`}
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy || undefined}
        className={`w-full border px-4 py-3 outline-none transition ${selectClass} ${className}`}
        style={{ colorScheme: isLight ? "light" : "dark", ...style }}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p
          id={errorId}
          className={`mt-2 text-sm ${errorClass}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
