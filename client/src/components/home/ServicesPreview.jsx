import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";
import { trackCustomEvent } from "../../lib/metaPixel";

function ServicesPreview() {
  const { effectiveLanguage, t } = useLanguage();
  const serviceTitles = t("home.services.titles", []);

  return (
    <section className="wd-section-black pt-10 pb-16 md:pt-12 md:pb-20">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={t("home.services.eyebrow")}
            title={t("home.services.title")}
            description={t("home.services.description")}
          />
          <Button
            to="/services"
            variant="secondary"
            onClick={() =>
              trackCustomEvent("ServicesClick", {
                button_name: "Services Preview",
                language: effectiveLanguage,
              })
            }
          >
            {t("common.buttons.viewServices")}
          </Button>
        </div>

        <Card className="wd-card-on-black overflow-hidden p-0">
          <div className="grid divide-y divide-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
            {serviceTitles.map((title, index) => (
              <div
                key={title}
                className="group p-6 transition hover:bg-white/[0.025] md:min-h-[160px]"
              >
                <p className="font-display text-sm font-bold text-[#C4A77D]">
                  0{index + 1}
                </p>

                <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4] transition group-hover:text-[#C4A77D] md:text-3xl">
                  {title}
                </h3>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </section>
  );
}

export default ServicesPreview;
