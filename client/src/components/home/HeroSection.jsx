import Button from "../common/Button";
import Container from "../common/Container";
import useSettings from "../../hooks/useSettings";
import useLanguage from "../../hooks/useLanguage";

const defaultHeadline = "Your brand, brought online with care.";
const defaultSubline =
  "Elegant websites for brands ready to look more polished, trusted, and complete online.";

const legacyHeadlines = [
  "Websites that make businesses look serious.",
  "Websites that make your business look serious.",
];
const legacySubtextStarts = [
  "We build clean, modern websites",
  "Clean websites for brands, stores, and businesses that need a stronger online presence.",
];

const normalizeCTA = (value, fallback) => {
  const normalized = String(value || "").trim().toLowerCase();

  if (!normalized || normalized === "book your website" || normalized === "start a request") {
    return fallback;
  }

  if (normalized === "view our work" || normalized === "view our work.") {
    return "View Our Work";
  }

  return value;
};

function HeroSection() {
  const { settings } = useSettings();
  const { isArabic, t } = useLanguage();

  const englishHeadline =
    settings.heroHeadline && !legacyHeadlines.includes(settings.heroHeadline)
      ? settings.heroHeadline
      : defaultHeadline;

  const englishSubline =
    settings.heroSubtext &&
    !legacySubtextStarts.some((legacySubtext) =>
      settings.heroSubtext.startsWith(legacySubtext)
    )
      ? settings.heroSubtext
      : defaultSubline;

  const headline = isArabic ? t("home.hero.headline") : englishHeadline;
  const subline = isArabic ? t("home.hero.subline") : englishSubline;
  const primaryCTA = isArabic
    ? t("home.hero.primaryCTA")
    : normalizeCTA(settings.primaryCTA, t("home.hero.primaryCTA"));
  const secondaryCTA = isArabic
    ? t("home.hero.secondaryCTA")
    : normalizeCTA(settings.secondaryCTA, t("home.hero.secondaryCTA"));

  return (
    <section className="wd-section-black wd-noise relative isolate overflow-hidden pt-32 pb-6 md:pt-36 md:pb-8">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_76%_22%,rgba(196,167,125,0.18),transparent_34%),radial-gradient(circle_at_16%_78%,rgba(100,19,26,0.16),transparent_32%),linear-gradient(120deg,#0B0B0A,#080808_52%,#0B0B0A)]" />
      <div className="absolute inset-0 z-0 hidden bg-[linear-gradient(90deg,rgba(11,11,10,0.92)_0%,rgba(11,11,10,0.72)_45%,rgba(11,11,10,0.52)_100%)] md:block" />
      <div className="absolute inset-0 z-0 bg-[rgba(11,11,10,0.88)] md:hidden" />
      <div className="absolute right-[-10%] top-[18%] z-0 hidden h-72 w-72 rounded-full bg-[#C4A77D]/14 blur-[56px] md:block" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-[#0B0B0A] to-transparent" />

      <Container>
        <div className="relative z-10 flex min-h-[440px] items-center py-8 md:min-h-[500px]">
          <div className="max-w-4xl">
            <h1
              className="font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.07em] text-[#F3EEE4] md:text-7xl"
              style={{
                color: "#F3EEE4",
                WebkitTextFillColor: "#F3EEE4",
                forcedColorAdjust: "none",
                textShadow: "0 5px 18px rgba(0,0,0,0.46)",
              }}
            >
              {headline}
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-8 text-[#D6CFC2]"
              style={{
                color: "#D6CFC2",
                WebkitTextFillColor: "#D6CFC2",
                forcedColorAdjust: "none",
                textShadow: "0 4px 16px rgba(0,0,0,0.42)",
              }}
            >
              {subline}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button to="/start">{primaryCTA}</Button>
              <Button to="/work" variant="secondary">
                {secondaryCTA}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
