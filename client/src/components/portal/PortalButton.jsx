import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import useLanguage from "../../hooks/useLanguage";

function PortalButton({
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
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const finalClass = `wd-portal-button wd-portal-button--${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {icon ? <ArrowIcon aria-hidden="true" size={16} /> : null}
    </>
  );

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

export default PortalButton;
