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
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "wd-gold-gradient text-[#020817] shadow-[0_0_34px_rgba(198,154,78,0.18)] hover:-translate-y-0.5",
    secondary:
      "border border-white/10 bg-white/[0.03] text-[#F5F8FC] hover:border-[#C69A4E]/45 hover:bg-white/[0.06]",
    ghost:
      "text-[#94A3B8] hover:text-[#F5F8FC]",
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
      <Link to={to} className={finalClass} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={finalClass} {...props}>
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