import Button from "../common/Button";

function AdminEmptyState({ icon: Icon, title, description, actionText, actionTo, onAction }) {
  return (
    <section className="wd-admin-empty" aria-live="polite">
      {Icon ? (
        <span className="wd-admin-empty__icon" aria-hidden="true">
          <Icon size={21} />
        </span>
      ) : null}
      <h2 className="font-display">{title}</h2>
      <p>{description}</p>
      {actionText ? (
        <Button to={actionTo} onClick={onAction} className="wd-admin-action">
          {actionText}
        </Button>
      ) : null}
    </section>
  );
}

export default AdminEmptyState;
