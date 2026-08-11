function AdminPageHeader({ eyebrow, title, description, action, className = "" }) {
  return (
    <header className={`wd-admin-page-header ${className}`.trim()}>
      <div className="wd-admin-page-header__copy">
        {eyebrow ? <p className="wd-admin-eyebrow">{eyebrow}</p> : null}
        <h1 className="font-display">{title}</h1>
        {description ? <p className="wd-admin-page-header__description">{description}</p> : null}
      </div>
      {action ? <div className="wd-admin-page-header__action">{action}</div> : null}
    </header>
  );
}

export default AdminPageHeader;
