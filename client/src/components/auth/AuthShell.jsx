import Container from "../common/Container";
import PageMeta from "../common/PageMeta";
import "./Auth.css";

function AuthShell({
  children,
  description,
  eyebrow,
  metaDescription = description,
  metaTitle = eyebrow,
  title,
}) {
  return (
    <section className="wd-auth-page">
      <PageMeta
        title={metaTitle}
        description={metaDescription}
        robots="noindex,nofollow"
      />

      <Container>
        <div className="wd-auth-layout">
          <header className="wd-auth-intro">
            <p className="wd-auth-eyebrow">{eyebrow}</p>
            <h1 className="font-display">{title}</h1>
            <p className="wd-auth-description">{description}</p>
            <span className="wd-auth-index" aria-hidden="true">
              WD / ACCOUNT
            </span>
          </header>

          {children}
        </div>
      </Container>
    </section>
  );
}

export function AuthPanel({ children, className = "", ...props }) {
  return (
    <div className={`wd-auth-panel ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default AuthShell;
