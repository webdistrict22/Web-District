import { useId, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordField({
  "aria-describedby": ariaDescribedBy,
  autoComplete,
  error,
  helper,
  hideLabel,
  id,
  label,
  name,
  onChange,
  placeholder,
  required,
  showLabel,
  value,
}) {
  const generatedId = useId();
  const inputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const describedBy = [
    ariaDescribedBy,
    helper ? helperId : "",
    error ? errorId : "",
  ]
    .filter(Boolean)
    .join(" ");

  const toggleVisibility = (event) => {
    const input = inputRef.current;
    const selectionStart = input?.selectionStart;
    const selectionEnd = input?.selectionEnd;
    setIsVisible((current) => !current);

    if (event.detail > 0 && input) {
      window.requestAnimationFrame(() => {
        input.focus({ preventScroll: true });
        if (selectionStart !== null && selectionEnd !== null) {
          input.setSelectionRange(selectionStart, selectionEnd);
        }
      });
    }
  };

  const VisibilityIcon = isVisible ? EyeOff : Eye;
  const visibilityLabel = isVisible ? hideLabel : showLabel;

  return (
    <div className="wd-password-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="wd-password-field__control">
        <input
          ref={inputRef}
          id={inputId}
          type={isVisible ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className="wd-password-field__input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="wd-password-field__toggle"
          aria-label={visibilityLabel}
          aria-pressed={isVisible}
          title={visibilityLabel}
          onClick={toggleVisibility}
        >
          <VisibilityIcon aria-hidden="true" />
        </button>
      </div>
      {helper ? (
        <p id={helperId} className="wd-password-field__helper">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="wd-password-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default PasswordField;
