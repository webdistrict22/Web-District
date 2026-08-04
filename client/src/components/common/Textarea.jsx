import { useId } from "react";

function Textarea({
  label,
  error,
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
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const describedBy = [ariaDescribedBy, error ? errorId : ""]
    .filter(Boolean)
    .join(" ");
  const isLight = tone === "light";
  const labelClass = isLight
    ? "font-semibold text-[#171411]"
    : "font-medium text-[#D6CFC2]";
  const textareaClass = isLight
    ? "rounded-xl border-[rgba(23,20,17,0.22)] bg-[#FFFDFC] text-[#171411] placeholder:text-[#6D6862] focus:border-[#B88A45]"
    : "rounded-2xl border-[rgba(243,238,228,0.24)] bg-[#1B1B19] text-[#F3EEE4] placeholder:text-[#D6CFC2] focus:border-[#C4A77D]";
  const errorClass = isLight ? "text-[#64131A]" : "text-[#C4A77D]";

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={textareaId}
          className={`mb-2 block text-sm ${labelClass}`}
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
        className={`min-h-32 w-full resize-y border px-4 py-3 outline-none transition ${textareaClass} ${className}`}
        style={{ colorScheme: isLight ? "light" : "dark", ...style }}
        {...props}
      />

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

export default Textarea;
