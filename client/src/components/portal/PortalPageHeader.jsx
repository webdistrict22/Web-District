function PortalPageHeader({ eyebrow, title, description, action, className = "" }) {
  return (
    <header className={`wd-portal-page-header ${className}`.trim()}>
      <div className="wd-portal-page-header__copy">
        <p className="wd-portal-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p className="wd-portal-page-header__description">{description}</p> : null}
      </div>
      {action ? <div className="wd-portal-page-header__action">{action}</div> : null}
    </header>
  );
}

export default PortalPageHeader;
