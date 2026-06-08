import { useId } from "react";

function Textarea({
  label,
  error,
  className = "",
  style,
  id,
  required,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const describedBy = [ariaDescribedBy, error ? errorId : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-2 block text-sm font-medium text-[#D6CFC2]"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy || undefined}
        className={`min-h-32 w-full resize-y rounded-2xl border border-[rgba(243,238,228,0.14)] bg-[#1B1B19] px-4 py-3 text-[#F3EEE4] outline-none transition placeholder:text-[rgba(214,207,194,0.55)] focus:border-[#C4A77D] ${className}`}
        style={{ colorScheme: "dark", ...style }}
        {...props}
      />

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

export default Textarea;
