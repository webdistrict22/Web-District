function AdminWorkspace({
  children,
  className = "",
  title,
  description,
  action,
  as: Element = "section",
}) {
  return (
    <Element className={`wd-admin-workspace ${className}`.trim()}>
      {title || description || action ? (
        <header className="wd-admin-workspace__header">
          <div>
            {title ? <h2 className="font-display">{title}</h2> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {action ? <div className="wd-admin-workspace__action">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </Element>
  );
}

export default AdminWorkspace;
