function AuthStatus({ children, tone = "error" }) {
  return (
    <div
      className={`wd-auth-status wd-auth-status--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

export default AuthStatus;
