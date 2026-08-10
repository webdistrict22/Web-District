import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import useLanguage from "../../hooks/useLanguage";

function FinalCtaLink({
  children,
  to,
  tone,
  icon = true,
  className = "",
  ...props
}) {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Link
      to={to}
      className={`wd-final-cta-action wd-final-cta-action--${tone} ${className}`.trim()}
      {...props}
    >
      {children}
      {icon ? <ArrowIcon size={17} aria-hidden="true" /> : null}
    </Link>
  );
}

export default FinalCtaLink;
