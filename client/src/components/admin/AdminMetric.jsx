import { Link } from "react-router";

function AdminMetric({ label, value, note, icon: Icon, to, priority = "primary" }) {
  const content = (
    <>
      <span className="wd-admin-metric__topline">
        <span className="wd-admin-metric__label">{label}</span>
        {Icon ? <Icon size={17} aria-hidden="true" /> : null}
      </span>
      <strong className="font-display wd-admin-metric__value">{value}</strong>
      {note ? <span className="wd-admin-metric__note">{note}</span> : null}
    </>
  );

  const className = `wd-admin-metric wd-admin-metric--${priority}`;

  if (to) {
    return (
      <Link to={to} className={className} aria-label={`${label}: ${value}. ${note || ""}`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default AdminMetric;
