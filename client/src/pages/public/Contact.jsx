import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import ContactCards from "../../components/contact/ContactCards";
import useLanguage from "../../hooks/useLanguage";
import { trackCustomEvent } from "../../lib/metaPixel";

function Contact() {
  const { effectiveLanguage, t } = useLanguage();

  return (
    <>
      <PageMeta
        title={t("contact.hero.eyebrow")}
        description={t("contact.hero.description")}
        canonical="/contact"
      />

      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
        <div className="max-w-3xl">
            <SectionHeader
              as="h1"
              eyebrow={t("contact.hero.eyebrow")}
              title={t("contact.hero.title")}
              description={t("contact.hero.description")}
            />

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                to="/start"
                onClick={() =>
                  trackCustomEvent("StartProjectClick", {
                    button_name: "Contact Page Start Project",
                    language: effectiveLanguage,
                  })
                }
              >
                {t("common.buttons.startProject")}
              </Button>

              <Button to="/process#process-questions" variant="secondary">
                {t("common.buttons.answerQuestions")}
              </Button>
            </div>
        </div>
        </Container>
      </section>

      <section className="wd-section-black pt-6 pb-16 md:pt-8 md:pb-20">
        <Container>
          <ContactCards cardClassName="wd-card-on-black" />
        </Container>
      </section>
    </>
  );
}

export default Contact;
