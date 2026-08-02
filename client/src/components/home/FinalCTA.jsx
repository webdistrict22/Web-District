import { ExternalLink } from "lucide-react";
import Container from "../common/Container";
import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";
import { trackCustomEvent } from "../../lib/metaPixel";

function FinalCTA({ liveUrl = "" }) {
  const hasLiveUrl = Boolean(liveUrl);
  const { effectiveLanguage, t } = useLanguage();
  const trackStartProject = () =>
    trackCustomEvent("StartProjectClick", {
      button_name: "Final CTA Start Project",
      language: effectiveLanguage,
    });
  const trackSeeWork = () =>
    trackCustomEvent("SeeWorkClick", {
      button_name: "Final CTA View Work",
      language: effectiveLanguage,
    });

  if (!hasLiveUrl) {
    return (
      <section className="wd-final-cta" aria-labelledby="home-final-cta-title">
        <Container>
          <p className="wd-home-eyebrow">{t("home.finalCta.eyebrow")}</p>
          <h2 id="home-final-cta-title" className="font-display">
            {t("home.finalCta.title")}
          </h2>
          <p>{t("home.finalCta.description")}</p>
          <div className="wd-final-cta__actions">
            <Button to="/start" icon={false} onClick={trackStartProject} className="wd-final-cta__primary">
              {t("common.buttons.startProject")}
            </Button>
            <Button
              to="/work"
              variant="secondary"
              onClick={trackSeeWork}
              className="wd-final-cta__secondary"
            >
              {t("common.buttons.viewWorkShort")}
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="wd-section-black py-16 md:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] md:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.10),transparent_34%)]" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                {t("home.finalCta.eyebrow")}
              </p>
              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-6xl">
                {t("home.finalCta.title")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#D9D4CC]">
                {t("home.finalCta.description")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Button href={liveUrl} icon={false} target="_blank" rel="noreferrer">
                <ExternalLink size={17} />
                {t("home.finalCta.tryIt")}
              </Button>
              <Button
                to="/work"
                variant="secondary"
                onClick={trackSeeWork}
                className="wd-final-cta__secondary"
              >
                {t("common.buttons.viewWorkShort")}
              </Button>
              <Button to="/start" variant="secondary" onClick={trackStartProject}>
                {t("common.buttons.startProject")}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTA;
