import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import ProcessStepper from "../../components/process/ProcessStepper";
import FAQTabs from "../../components/process/FAQTabs";
import useLanguage from "../../hooks/useLanguage";
import "./Process.css";

function Process() {
  const { t } = useLanguage();
  const fullProcessSteps = t("process.steps", []);
  const faqCategories = t("process.faqCategories", []);

  return (
    <>
      <PageMeta
        title={t("process.hero.eyebrow")}
        description={t("process.hero.description")}
        canonical="/process"
      />

      <section className="wd-process-hero">
        <Container>
          <div className="wd-process-hero__intro">
            <p className="wd-process-hero__eyebrow">{t("process.hero.eyebrow")}</p>
            <h1 className="font-display">{t("process.hero.title")}</h1>
            <p className="wd-process-hero__description">{t("process.hero.description")}</p>
          </div>
          <ProcessStepper steps={fullProcessSteps} />
        </Container>
      </section>

      <section
        id="faq"
        className="wd-process-faq"
      >
        <Container>
          <div className="wd-process-faq__header">
            <p className="wd-process-faq__eyebrow">{t("process.questionsHeader.eyebrow")}</p>
            <h2 className="font-display">{t("process.questionsHeader.title")}</h2>
            <p>{t("process.questionsHeader.description")}</p>
          </div>
          <FAQTabs categories={faqCategories} />
        </Container>
      </section>

      <section className="wd-process-cta">
        <Container>
          <div className="wd-process-cta__inner">
            <div className="wd-process-cta__copy">
              <p className="wd-process-cta__eyebrow">{t("process.cta.eyebrow")}</p>
              <h2 className="font-display">{t("process.cta.title")}</h2>
              <p>{t("process.cta.description")}</p>
            </div>

            <div className="wd-process-cta__actions">
              <Button to="/start" variant="secondary" className="wd-process-cta__primary">
                {t("common.buttons.startProject")}
              </Button>
              <Button to="/work" variant="secondaryLight" className="wd-process-cta__secondary">
                {t("common.buttons.viewWork")}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Process;
