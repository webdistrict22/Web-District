import { motion } from "framer-motion";
import Button from "../common/Button";
import Container from "../common/Container";
import useSettings from "../../hooks/useSettings";

const defaultHeadline = "Your brand, brought online with care.";
const defaultSubline =
  "Elegant websites for brands ready to look more polished, trusted, and complete online.";

const legacyHeadline = "Websites that make businesses look serious.";
const legacySubtextStart = "We build clean, modern websites";

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

  const headline =
    settings.heroHeadline && settings.heroHeadline !== legacyHeadline
      ? settings.heroHeadline
      : defaultHeadline;

  const subline =
    settings.heroSubtext && !settings.heroSubtext.startsWith(legacySubtextStart)
      ? settings.heroSubtext
      : defaultSubline;

  const primaryCTA = normalizeCTA(settings.primaryCTA, "Start Your Project");
  const secondaryCTA = normalizeCTA(settings.secondaryCTA, "View Our Work");

  return (
    <section className="wd-section-black wd-noise relative isolate overflow-hidden pt-32 pb-6 md:pt-36 md:pb-8">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_76%_22%,rgba(196,167,125,0.18),transparent_34%),radial-gradient(circle_at_16%_78%,rgba(100,19,26,0.16),transparent_32%),linear-gradient(120deg,#0B0B0A,#080808_52%,#0B0B0A)]" />
      <div className="absolute inset-0 z-0 hidden bg-[linear-gradient(90deg,rgba(11,11,10,0.92)_0%,rgba(11,11,10,0.72)_45%,rgba(11,11,10,0.52)_100%)] md:block" />
      <div className="absolute inset-0 z-0 bg-[rgba(11,11,10,0.88)] md:hidden" />
      <div className="absolute right-[-12%] top-[18%] z-0 h-80 w-80 rounded-full bg-[#C4A77D]/18 blur-[100px]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-[#0B0B0A] to-transparent" />

      <Container>
        <div className="relative z-10 flex min-h-[440px] items-center py-8 md:min-h-[500px]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-4xl"
          >
            <h1
              className="font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.07em] text-[#F3EEE4] md:text-7xl"
              style={{ textShadow: "0 8px 28px rgba(0,0,0,0.55)" }}
            >
              {headline}
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-8 text-[#D6CFC2]"
              style={{ textShadow: "0 8px 28px rgba(0,0,0,0.55)" }}
            >
              {subline}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button to="/start">{primaryCTA}</Button>
              <Button to="/work" variant="secondary">
                {secondaryCTA}
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
