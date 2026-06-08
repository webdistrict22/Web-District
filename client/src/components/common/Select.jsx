import { useId } from "react";

function Select({
  label,
  error,
  children,
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

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-[#D6CFC2]"
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
        className={`w-full rounded-2xl border border-[rgba(243,238,228,0.14)] bg-[#1B1B19] px-4 py-3 text-[#F3EEE4] outline-none transition focus:border-[#C4A77D] ${className}`}
        style={{ colorScheme: "dark", ...style }}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-[#C4A77D]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
