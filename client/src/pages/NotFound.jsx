import Button from "../components/common/Button";
import Container from "../components/common/Container";
import PageMeta from "../components/common/PageMeta";
import "../components/public/PublicUtilityPages.css";
import useLanguage from "../hooks/useLanguage";

function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="wd-not-found">
      <PageMeta
        title={t("notFound.metaTitle")}
        description={t("notFound.metaDescription")}
        robots="noindex,nofollow"
      />

      <Container>
        <div className="wd-not-found__layout">
          <p className="wd-not-found__code" aria-hidden="true">404</p>
          <div className="wd-not-found__copy">
            <h1 className="font-display">{t("notFound.title")}</h1>
            <p>{t("notFound.description")}</p>
            <div className="wd-not-found__actions">
              <Button to="/" className="wd-final-cta-action--light">
                {t("common.buttons.backHome")}
              </Button>
              <Button to="/start" className="wd-final-cta-action--dark">
                {t("common.buttons.startProject")}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default NotFound;
