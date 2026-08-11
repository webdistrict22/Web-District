function AdminToolbar({ children, className = "" }) {
  return (
    <section className={`wd-admin-toolbar ${className}`.trim()} aria-label="Filters and controls">
      {children}
    </section>
  );
}

export default AdminToolbar;
