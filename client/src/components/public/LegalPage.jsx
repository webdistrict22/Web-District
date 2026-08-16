import Container from "../common/Container";
import FinalCtaLink from "../common/FinalCtaLink";
import PageMeta from "../common/PageMeta";
import useLanguage from "../../hooks/useLanguage";
import "./PublicUtilityPages.css";

function LegalPage({ canonical, translationKey }) {
  const { t } = useLanguage();
  const content = t(translationKey, {});

  return (
    <div className="wd-legal-page">
      <PageMeta
        title={content.metaTitle}
        description={content.metaDescription}
        canonical={canonical}
      />

      <section className="wd-utility-hero">
        <Container>
          <p className="wd-utility-eyebrow">{content.eyebrow}</p>
          <h1 className="font-display">{content.title}</h1>
          <p>{content.description}</p>
        </Container>
      </section>

      <section className="wd-legal-content">
        <Container>
          <div className="wd-legal-list">
            {content.sections.map((section, index) => (
              <article className="wd-legal-section" key={section.title}>
                <span className="wd-legal-section__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display">{section.title}</h2>
                <div>
                  {section.body.map((line) => <p key={line}>{line}</p>)}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="wd-utility-cta">
        <Container>
          <div className="wd-utility-cta__copy">
            <p className="wd-utility-eyebrow">{content.ctaEyebrow}</p>
            <h2 className="font-display">{content.ctaTitle}</h2>
            <p>{content.ctaDescription}</p>
          </div>
          <div className="wd-utility-cta__actions">
            <FinalCtaLink
              to="/start"
              tone="dark"
              className="wd-utility-cta__primary"
            >
              {t("common.buttons.startProject")}
            </FinalCtaLink>
            <FinalCtaLink
              to="/process#faq"
              tone="light"
              className="wd-utility-cta__secondary"
            >
              {t("common.buttons.viewQuestions")}
            </FinalCtaLink>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default LegalPage;
