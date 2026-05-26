import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Button({
  children,
  to,
  href,
  type = "button",
  variant = "primary",
  icon = true,
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 forced-color-adjust-none disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "wd-champagne-gradient text-[#F3EEE4] shadow-[0_14px_34px_rgba(168,135,79,0.20)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(184,148,88,0.26)]",
    secondary:
      "border border-white/10 bg-white/[0.035] text-[#F8F7F4] hover:border-[#C4A77D]/55 hover:bg-white/[0.06] hover:text-[#C4A77D]",
    secondaryLight:
      "border border-[#080808]/15 bg-[#080808]/5 text-[#080808] hover:border-[#64131A]/35 hover:bg-[#64131A]/8",
    ghost:
      "text-[#D9D4CC] hover:text-[#C4A77D]",
  };

  const content = (
    <>
      {children}
      {icon && <ArrowRight size={17} />}
    </>
  );

  const finalClass = `${baseClass} ${variants[variant]} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={finalClass} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={finalClass} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={finalClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
