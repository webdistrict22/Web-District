import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import useLanguage from "../../hooks/useLanguage";

function Terms() {
  const { t } = useLanguage();
  const termsSections = t("legal.terms.sections", []);

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title={t("legal.terms.metaTitle")}
        description={t("legal.terms.metaDescription")}
      />

      <section className="wd-section-black pt-32 pb-8 md:pb-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <SectionHeader
              eyebrow={t("legal.terms.eyebrow")}
              title={t("legal.terms.title")}
              description={t("legal.terms.description")}
            />

          </div>
        </Container>
      </section>

      <section className="wd-section-black pt-4 pb-16 md:pt-6 md:pb-20">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {termsSections.map((section) => (
              <article
                key={section.title}
                className="wd-card-on-black rounded-[1.5rem] p-5 md:p-6"
              >
                <h3 className="font-display text-xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
                  {section.title}
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#D9D4CC] md:text-base">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="wd-section-black pt-0 pb-16 md:pb-20">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 md:p-10">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.65fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  {t("legal.terms.ctaEyebrow")}
                </p>
                <h2 className="font-display text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4] md:text-4xl">
                  {t("legal.terms.ctaTitle")}
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-[#D9D4CC]">
                  {t("legal.terms.ctaDescription")}
                </p>
              </div>

              <div className="grid gap-3">
                <Button to="/start">
                  {t("common.buttons.startProject")}
                </Button>
                <Button to="/contact" variant="secondary">
                  {t("common.buttons.contactWebDistrict")}
                </Button>
                <Button to="/services" variant="secondary">
                  {t("common.buttons.websiteCare")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Terms;
