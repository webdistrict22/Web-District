import PortalButton from "./PortalButton";

function PortalEmptyState({ icon: Icon, title, description, actionText, actionTo }) {
  return (
    <section className="wd-portal-empty">
      {Icon ? (
        <span className="wd-portal-empty__icon" aria-hidden="true">
          <Icon size={22} strokeWidth={1.5} />
        </span>
      ) : null}
      <h2>{title}</h2>
      <p>{description}</p>
      {actionText && actionTo ? (
        <PortalButton to={actionTo}>{actionText}</PortalButton>
      ) : null}
    </section>
  );
}

export default PortalEmptyState;
