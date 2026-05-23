function Container({ children, className = "" }) {
  return <div className={`wd-container ${className}`}>{children}</div>;
}

export default Container;