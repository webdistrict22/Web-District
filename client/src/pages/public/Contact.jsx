import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ContactCards from "../../components/contact/ContactCards";
import useLanguage from "../../hooks/useLanguage";

function Contact() {
  const { t } = useLanguage();

  return (
    <main className="bg-[#080808]">
      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionHeader
              eyebrow={t("contact.hero.eyebrow")}
              title={t("contact.hero.title")}
              description={t("contact.hero.description")}
            />

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button to="/start">{t("common.buttons.startProject")}</Button>

              <Button to="/process#process-questions" variant="secondary">
                {t("common.buttons.answerQuestions")}
              </Button>
            </div>
          </div>

        </div>
        </Container>
      </section>

      <section className="wd-section-black pt-6 pb-16 md:pt-8 md:pb-20">
        <Container>
          <ContactCards cardClassName="wd-card-on-black" />
        </Container>
      </section>
    </main>
  );
}

export default Contact;
