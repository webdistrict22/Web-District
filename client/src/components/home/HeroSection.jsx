import { Link } from "react-router";
import RotatingText from "../reactbits/RotatingText/RotatingText";
import useLanguage from "../../hooks/useLanguage";
import useMediaQuery from "../../hooks/useMediaQuery";
import useSettings from "../../hooks/useSettings";
import useSessionImage from "../../hooks/useSessionImage";
import { trackCustomEvent } from "../../lib/metaPixel";
import { getImageMetadata } from "../../data/imageMetadata";
import "./HomeOpening.css";

const defaultSubline =
  "Elegant websites for brands ready to look more polished, trusted, and complete online.";
const legacySubtextStarts = [
  "We build clean, modern websites",
  "Clean websites for brands, stores, and businesses that need a stronger online presence.",
];

function HeroSection() {
  const { settings } = useSettings();
  const { effectiveLanguage, isArabic, t } = useLanguage();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobileHero = useMediaQuery("(max-width: 767px)");
  const heroImageUrl = isMobileHero
    ? "/images/home/phone-home-hero.webp"
    : "/images/home/desktop-home-hero.webp";
  const heroImageMetadata = getImageMetadata(heroImageUrl);
  const { handleLoad: handleHeroLoad, isLoaded: isHeroLoaded } =
    useSessionImage(heroImageUrl);

  const englishSubline =
    settings.heroSubtext &&
    !legacySubtextStarts.some((legacyText) =>
      settings.heroSubtext.startsWith(legacyText),
    )
      ? settings.heroSubtext
      : defaultSubline;
  const subline = isArabic ? t("home.hero.subline") : englishSubline;
  const staticHeadline = isArabic ? "نبني مواقع" : "WE BUILD WEBSITES THAT";
  const rotatingPhrases = isArabic
    ? ["تحقق نتائج.", "تبني الثقة.", "تقدم تجربة سلسة.", "تنمو معك."]
    : ["CONVERT.", "BUILD TRUST.", "FEEL EFFORTLESS.", "GROW WITH YOU."];
  const accessibleHeadline = isArabic
    ? "نبني مواقع تحقق نتائج، وتبني الثقة، وتقدم تجربة سلسة، وتنمو معك."
    : "We build websites that convert, build trust, feel effortless, and grow with you.";

  return (
    <section className="wd-home-hero" aria-labelledby="home-hero-title">
      <picture
        className={`wd-home-hero__background${isHeroLoaded ? " is-ready" : " is-loading"}`}
        aria-hidden="true"
      >
        <img
          src={heroImageUrl}
          alt=""
          width={heroImageMetadata.width}
          height={heroImageMetadata.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={handleHeroLoad}
        />
      </picture>
      <div className="wd-home-hero__overlay" aria-hidden="true" />
      <div className="wd-home-hero__content">
        <h1
          id="home-hero-title"
          className="wd-home-hero__headline font-display"
          aria-label={accessibleHeadline}
        >
          <span className="wd-home-hero__headline-static" aria-hidden="true">
            {staticHeadline}
          </span>
          <span className="wd-home-hero__rotating-row" aria-hidden="true">
            {reducedMotion ? (
              <span className="wd-rotating-text-box">{rotatingPhrases[0]}</span>
            ) : (
              <RotatingText
                key={effectiveLanguage}
                texts={rotatingPhrases}
                splitBy={isArabic ? "lines" : "words"}
                rotationInterval={2600}
                staggerDuration={isArabic ? 0 : 0.025}
                staggerFrom="first"
                mainClassName="wd-rotating-text-box"
                splitLevelClassName="wd-rotating-text-word"
                elementLevelClassName="wd-rotating-text-element"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                animatePresenceMode="wait"
              />
            )}
          </span>
        </h1>

        <p className="wd-home-hero__subline">{subline}</p>

        <div className="wd-home-hero__actions">
          <Link
            to="/start"
            className="wd-home-hero__button wd-home-hero__button--primary"
            onClick={() =>
              trackCustomEvent("StartProjectClick", {
                button_name: "Hero Start Project",
                language: effectiveLanguage,
              })
            }
          >
            {t("home.hero.primaryCTA")}
          </Link>
          <Link
            to="/work"
            className="wd-home-hero__button wd-home-hero__button--secondary"
            onClick={() =>
              trackCustomEvent("SeeWorkClick", {
                button_name: "Hero View Work",
                language: effectiveLanguage,
              })
            }
          >
            {t("home.hero.secondaryCTA")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
