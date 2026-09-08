import {
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import {
  ChevronDown,
  ExternalLink,
  Star,
} from "lucide-react";
import Container from "../common/Container";
import Button from "../common/Button";
import FinalCtaLink from "../common/FinalCtaLink";
import ManualCarouselControls from "../common/ManualCarousel";
import useManualCarousel from "../common/useManualCarousel";
import LogoLoop from "../reactbits/LogoLoop/LogoLoop";
import { getPublicReviews } from "../../lib/publicContentApi";
import useLanguage from "../../hooks/useLanguage";
import { workProjects } from "../../data/demoProjects";
import { getRelatedServicesForProject } from "../../data/servicesData";
import ProjectCard from "./ProjectCard";
import useMediaQuery from "../../hooks/useMediaQuery";
import useRestorableAccordion from "../../hooks/useRestorableAccordion";
import "./CaseStudySection.css";
import { getImageMetadata } from "../../data/imageMetadata";

const QUALITY_KEYS = [
  "experience",
  "performance",
  "security",
  "operations",
  "growth",
];

const MONTHLY_VOLUME_KEYS = new Set([
  "monthlySessions",
  "monthlyOrders",
  "totalConversions",
  "sampleOrders",
  "qualifiedLeads",
  "monthlyBookingLeads",
]);

const getImageSource = (image) =>
  typeof image === "string" ? image : image?.src;

function useDesktopShowcase() {
  return useMediaQuery("(min-width: 1024px)");
}

function ShowcaseGrid({ images, name, t }) {
  return (
    <div className="wd-case-study-showcase-grid">
      {images.map((image, index) => (
        <figure className="wd-case-study-showcase-grid__surface" key={image}>
          <img
            src={image}
            alt={t("work.caseStudy.showcaseImageAlt", undefined, {
              name,
              number: String(index + 1).padStart(2, "0"),
            })}
            {...getImageMetadata(image)}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}

function ShowcaseCarousel({ images, name, t }) {
  const {
    activeIndex,
    goTo,
    handleClickCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerUp,
    handleTransitionEnd,
    next,
    pageCount,
    previous,
    slides,
    trackRef,
    viewportRef,
  } = useManualCarousel({
    items: images,
    visibleCount: 1,
    resetKey: images.join("|"),
  });

  if (!images.length) return null;

  return (
    <div
      className="wd-case-study-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("work.caseStudy.carouselLabel", undefined, { name })}
    >
      <div
        ref={viewportRef}
        className="wd-case-study-carousel__viewport wd-manual-carousel-viewport"
        onClickCapture={handleClickCapture}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="wd-case-study-carousel__track wd-manual-carousel-track"
          dir="ltr"
          onTransitionEnd={handleTransitionEnd}
        >
        {slides.map(({ item: image, duplicate, logicalIndex }, index) => {
          const source = getImageSource(image);

          return (
            <div
              className="wd-case-study-carousel__slide"
              key={`${source}-${index}`}
              aria-hidden={duplicate || undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={t("work.caseStudy.slideLabel", undefined, {
                current: logicalIndex + 1,
                total: images.length,
              })}
            >
              <div className="wd-case-study-carousel__surface">
                <img
                  src={source}
                  alt={t("work.caseStudy.showcaseImageAlt", undefined, {
                    name,
                    number: String(logicalIndex + 1).padStart(2, "0"),
                  })}
                  className="wd-case-study-carousel__image"
                  {...getImageMetadata(source)}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <ManualCarouselControls
        activeIndex={activeIndex}
        className="wd-case-study-carousel-controls"
        count={pageCount}
        dotLabel={(index) => t("work.caseStudy.slideLabel", undefined, {
          current: index + 1,
          total: pageCount,
        })}
        nextLabel={t("work.caseStudy.nextImage")}
        onNext={next}
        onPrevious={previous}
        onSelect={goTo}
        previousLabel={t("work.caseStudy.previousImage")}
      />
    </div>
  );
}

function OtherProjectsCarousel({ currentSlug, t, isRtl }) {
  const items = useMemo(
    () => workProjects.filter((item) => item.slug !== currentSlug),
    [currentSlug],
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const {
    activeIndex,
    goTo,
    handleClickCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerUp,
    handleTransitionEnd,
    next,
    pageCount,
    previous,
    slides,
    trackRef,
    viewportRef,
  } = useManualCarousel({
    items,
    visibleCount: isDesktop ? 4 : 1,
    resetKey: currentSlug,
  });

  return (
    <div
      className="wd-case-study-other-projects__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("work.caseStudy.moreWorkEyebrow")}
    >
      <div
        ref={viewportRef}
        className="wd-case-study-other-projects__viewport wd-manual-carousel-viewport"
        onClickCapture={handleClickCapture}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="wd-case-study-other-projects__track wd-manual-carousel-track"
          dir="ltr"
          onTransitionEnd={handleTransitionEnd}
        >
        {slides.map(({ item, duplicate }, index) => {
          return (
            <div
              className="wd-case-study-other-projects__slide"
              key={`${item.slug}-${index}`}
              aria-hidden={duplicate || undefined}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <ProjectCard project={item} duplicate={duplicate} />
            </div>
          );
        })}
        </div>
      </div>

      <ManualCarouselControls
        activeIndex={activeIndex}
        className="wd-case-study-other-projects-controls"
        count={pageCount}
        dotLabel={(index) => t("work.caseStudy.slideLabel", undefined, {
          current: index + 1,
          total: pageCount,
        })}
        nextLabel={t("work.caseStudy.nextProject")}
        onNext={next}
        onPrevious={previous}
        onSelect={goTo}
        previousLabel={t("work.caseStudy.previousProject")}
      />
    </div>
  );
}

function DetailGroup({ title, items, isRtl }) {
  if (!items?.length) return null;

  return (
    <div className="wd-case-study-detail-group">
      <h4>{title}</h4>
      <p className="wd-case-study-detail-group__items" dir={isRtl ? "rtl" : "ltr"}>
        {items.join(isRtl ? "، " : ", ")}.
      </p>
    </div>
  );
}

function PerformanceSnapshot({ metrics, strongResults, t, isRtl }) {
  const localizedResults = strongResults?.[isRtl ? "ar" : "en"] || [];

  if (!metrics?.length) return null;

  return (
    <div className="wd-case-study-performance">
      <h4>{t("work.caseStudy.performanceSnapshot")}</h4>
      <div className="wd-case-study-metrics">
        {metrics.map(([labelKey, value]) => {
          const isMonthlyVolume = MONTHLY_VOLUME_KEYS.has(labelKey);

          return (
            <div className="wd-case-study-metric" key={labelKey}>
              <span>{t(`work.caseStudy.metricLabels.${labelKey}`)}</span>
              <bdi dir={isMonthlyVolume && isRtl ? "rtl" : "ltr"}>
                {isMonthlyVolume ? (
                  <>{t("work.caseStudy.metricAround")} <span dir="ltr">{value}</span></>
                ) : value}
              </bdi>
            </div>
          );
        })}
      </div>
      {localizedResults.length ? (
        <div className="wd-case-study-results">
          <h4>{t("work.caseStudy.strongResults")}</h4>
          <ul dir={isRtl ? "rtl" : "ltr"}>
            {localizedResults.map((result) => <li key={result}>{result}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SecurityProtections({ security, t, isRtl }) {
  const groups = security?.groups || security?.verified;
  if (!groups?.length) return null;

  const locale = isRtl ? "ar" : "en";

  return (
    <div className="wd-case-study-security wd-case-study-safeguards">
      {groups.map((group) => (
        <section className="wd-case-study-safeguards__group" key={group.key || group.title.en}>
          <h4>
            {group.key
              ? t(`work.caseStudy.securityLabels.${group.key}`)
              : group.title[locale]}
          </h4>
          <ul dir={isRtl ? "rtl" : "ltr"}>
            {group.items[locale].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}

function QualitiesAccordion({ project, qualities, t, isRtl }) {
  const accordionId = useId().replaceAll(":", "");
  const [openKey, setOpenKey] = useState(null);
  const {
    handlePanelClick,
    handlePanelPointerDown,
    toggleItem: toggleTopic,
  } = useRestorableAccordion({
    openKey,
    restoreBehavior: "smooth",
    setOpenKey,
  });

  return (
    <div className="wd-case-study-accordion">
      {QUALITY_KEYS.map((key, index) => {
        const isOpen = openKey === key;
        const buttonId = `${accordionId}-${key}-button`;
        const panelId = `${accordionId}-${key}-panel`;
        const content = qualities[key]?.[isRtl ? "ar" : "en"];
        const paragraph = key === "security"
          ? project.security?.summary?.[isRtl ? "ar" : "en"] || content?.paragraph
          : content?.paragraph;

        if (!content) return null;

        return (
          <div
            className={`wd-case-study-accordion__item${isOpen ? " is-open" : ""}`}
            key={key}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleTopic(key)}
              >
                <span className="wd-case-study-accordion__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{t(`work.caseStudy.qualityTopics.${key}`)}</span>
                <ChevronDown
                  className="wd-case-study-accordion__icon"
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              className="wd-case-study-accordion__panel"
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              onPointerDown={handlePanelPointerDown}
              onClick={(event) => handlePanelClick(event, key)}
            >
              <div>
                <p dir={isRtl ? "rtl" : "ltr"}>{paragraph}</p>
                {key === "experience" && content.points?.length ? (
                  <ul dir={isRtl ? "rtl" : "ltr"}>
                    {content.points.slice(0, 3).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                {key === "experience" ? (
                  <DetailGroup
                    title={t("work.caseStudy.publicPages")}
                    items={project.publicPages?.[isRtl ? "ar" : "en"]}
                    isRtl={isRtl}
                  />
                ) : null}
                {key === "performance" ? (
                  <PerformanceSnapshot
                    metrics={project.metrics}
                    strongResults={project.strongResults}
                    t={t}
                    isRtl={isRtl}
                  />
                ) : null}
                {key === "security" ? (
                  <SecurityProtections
                    security={project.security}
                    t={t}
                    isRtl={isRtl}
                  />
                ) : null}
                {key === "operations" ? (
                  <div className="wd-case-study-management-groups">
                    {(project.managementGroups || []).map((group, groupIndex) => (
                      <DetailGroup
                        key={group.title.en}
                        title={project.slug === "s8-factory"
                          ? group.title[isRtl ? "ar" : "en"]
                          : t(groupIndex === 0
                            ? "work.caseStudy.ownerControls"
                            : "work.caseStudy.customerOperations")}
                        items={group.items[isRtl ? "ar" : "en"]}
                        isRtl={isRtl}
                      />
                    ))}
                  </div>
                ) : null}
                {key === "growth" && project.launchInventory ? (
                  <DetailGroup
                    title={t("work.caseStudy.launchScope")}
                    items={[project.launchInventory[isRtl ? "ar" : "en"]]}
                    isRtl={isRtl}
                  />
                ) : null}
                {key === "growth" && content.points?.length ? (
                  <DetailGroup
                    title={t("work.caseStudy.builtToExpand")}
                    items={content.points.slice(0, 3)}
                    isRtl={isRtl}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const normalizeReviewValue = (value = "") =>
  value.toLocaleLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "");

function ProjectReview({ project, name, logoImage, t }) {
  const [review, setReview] = useState(null);

  useEffect(() => {
    let active = true;
    const timerId = window.setTimeout(async () => {
      try {
        const reviews = await getPublicReviews();
        const aliases = (project.reviewAliases || [name]).map(
          normalizeReviewValue,
        );
        const match = reviews.find((item) => {
          const businessName = normalizeReviewValue(item.businessName);
          return aliases.some(
            (alias) =>
              alias &&
              (businessName === alias || businessName.includes(alias)),
          );
        });

        if (active) setReview(match || null);
      } catch {
        if (active) setReview(null);
      }
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      active = false;
    };
  }, [name, project.reviewAliases]);

  if (!review) return null;

  const rating = Math.max(1, Math.min(5, review.rating || 5));
  const quoteIsArabic = /[\u0600-\u06ff]/.test(review.message || "");
  const reviewImage = review.image || review.logoImage || review.avatar || logoImage;

  return (
    <section className="wd-case-study-review" aria-labelledby="project-review-title">
      <Container>
        <header className="wd-case-study-review__heading">
          <p>{t("work.caseStudy.reviewEyebrow")}</p>
          <h2 id="project-review-title" className="font-display">
            {t("work.caseStudy.reviewTitle")}
          </h2>
          <span>{t("work.caseStudy.reviewDescription")}</span>
        </header>
        <article className="wd-case-study-review__card">
          <div className="wd-case-study-review__meta" dir="ltr">
            <div className="wd-case-study-review__owner">
              <span className="wd-case-study-review__avatar" aria-hidden="true">
                <img
                  src={reviewImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = logoImage;
                  }}
                />
              </span>
              <span className="wd-case-study-review__identity">
                <strong>{review.name}</strong>
                <small dir="ltr">{review.role || "Client"}</small>
                <small>{review.businessName || name}</small>
              </span>
            </div>
            <div
              className="wd-case-study-review__stars"
              aria-label={t("work.caseStudy.reviewRating", undefined, { rating })}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  aria-hidden="true"
                  className={index < rating ? "is-filled" : ""}
                />
              ))}
            </div>
          </div>
          <blockquote dir={quoteIsArabic ? "rtl" : "ltr"}>{review.message}</blockquote>
        </article>
      </Container>
    </section>
  );
}

function CaseStudySection({ project }) {
  const { isRtl, t, translateValue } = useLanguage();
  const isDesktopShowcase = useDesktopShowcase();
  const isDatabaseProject = Boolean(project._id);
  const rawName = isDatabaseProject ? project.title : project.name;
  const name = t(`work.projects.${project.slug}.name`, rawName);
  const relatedServices = getRelatedServicesForProject(project.slug);
  const serviceLocale = isRtl ? "ar" : "en";
  const rawType = isDatabaseProject ? project.websiteType : project.type;
  const rawSubtitle = project.businessType || rawType;
  const subtitle = t(
    `work.projects.${project.slug}.businessType`,
    translateValue("websiteTypes", rawSubtitle),
  );
  const rawSummary = isDatabaseProject
    ? project.shortDescription || project.fullDescription
    : project.description || project.overview;
  const summary = t(`work.projects.${project.slug}.description`, rawSummary);
  const logoImage = project.logoImage || project.coverImage || project.image;
  const showcaseImages = (
    project.showcaseImages ||
    (isDatabaseProject ? project.images?.slice(1, 4) || [] : [])
  )
    .map(getImageSource)
    .filter(Boolean)
    .slice(0, 3);
  const qualities = project.qualities || {};
  const hasLiveUrl = /^https?:\/\//i.test(project.liveUrl || "");
  const logoStyle = {
    "--case-study-logo-scale": project.logoScale || 1,
    "--case-study-logo-position": project.logoPosition || "center",
  };

  return (
    <article className="wd-case-study-page">
      <section className="wd-case-study-intro" aria-labelledby="case-study-title">
        <Container>
          <div className="wd-case-study-intro__row">
            <div className="wd-case-study-intro__identity">
              <figure className="wd-case-study-intro__logo" style={logoStyle}>
                <img
                  src={logoImage}
                  alt={t("work.caseStudy.logoImageAlt", undefined, { name })}
                  {...getImageMetadata(logoImage)}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </figure>
              <div className="wd-case-study-intro__heading">
                <h1 id="case-study-title" className="font-display" dir="auto">
                  {name}
                </h1>
                <p className="wd-case-study-intro__subtitle">{subtitle}</p>
                {relatedServices.length ? (
                  <nav
                    className="wd-case-study-intro__service-links"
                    aria-label={
                      isRtl
                        ? "خدمات Web District المرتبطة"
                        : "Related Web District services"
                    }
                  >
                    {relatedServices.map((service) => (
                      <Link key={service.id} to={service.path}>
                        {service.page[serviceLocale].name}
                      </Link>
                    ))}
                  </nav>
                ) : null}
              </div>
            </div>
            <div className="wd-case-study-intro__body">
              <p className="wd-case-study-intro__summary">{summary}</p>
              {hasLiveUrl ? (
                <Button
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={false}
                  className="wd-case-study-intro__live"
                  aria-label={t("work.caseStudy.liveProjectAria", undefined, { name })}
                >
                  {t("work.caseStudy.liveProject")}
                  <ExternalLink size={16} aria-hidden="true" />
                </Button>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="wd-case-study-logo-loop">
        <LogoLoop
          items={project.logoLoop}
          ariaLabel={t("work.caseStudy.logoLoopLabel", undefined, { name })}
        />
      </section>

      <section className="wd-case-study-showcase" aria-labelledby="showcase-title">
        <Container>
          <header className="wd-case-study-heading">
            <p>{t("work.caseStudy.showcase")}</p>
            <h2 id="showcase-title" className="font-display">
              {t("work.caseStudy.showcaseTitle")}
            </h2>
          </header>
          {isDesktopShowcase ? (
            <ShowcaseGrid images={showcaseImages} name={name} t={t} />
          ) : (
            <ShowcaseCarousel images={showcaseImages} name={name} t={t} />
          )}
        </Container>
      </section>

      <section className="wd-case-study-qualities" aria-labelledby="qualities-title">
        <Container>
          <header className="wd-case-study-heading wd-case-study-heading--light">
            <p>{t("work.caseStudy.qualitiesEyebrow")}</p>
            <h2 id="qualities-title" className="font-display">
              {t("work.caseStudy.qualitiesTitle")}
            </h2>
          </header>
          <QualitiesAccordion
            key={project.slug}
            project={project}
            qualities={qualities}
            t={t}
            isRtl={isRtl}
          />
        </Container>
      </section>

      <ProjectReview
        key={project.slug}
        project={project}
        name={name}
        logoImage={logoImage}
        t={t}
      />

      <section
        className="wd-case-study-other-projects"
        aria-labelledby="other-projects-title"
      >
        <Container>
          <header className="wd-case-study-other-projects__heading">
            <p>{t("work.caseStudy.moreWorkEyebrow")}</p>
            <h2 id="other-projects-title" className="font-display">
              {t("work.caseStudy.moreWorkTitle")}
            </h2>
            <span>{t("work.caseStudy.moreWorkDescription")}</span>
          </header>
          <OtherProjectsCarousel
            key={project.slug}
            currentSlug={project.slug}
            t={t}
            isRtl={isRtl}
          />
        </Container>
      </section>

      <section className="wd-case-study-cta" aria-labelledby="case-study-cta-title">
        <Container>
          <p className="wd-case-study-cta__eyebrow">
            {t("work.caseStudy.ctaEyebrow")}
          </p>
          <h2 id="case-study-cta-title" className="font-display">
            {t("work.caseStudy.ctaTitle")}
          </h2>
          <p className="wd-case-study-cta__description">
            {t("work.caseStudy.ctaDescription")}
          </p>
          <div className="wd-case-study-cta__actions">
            <FinalCtaLink
              to="/start"
              tone="light"
              icon={false}
              className="wd-case-study-cta__light-button"
            >
              {t("common.buttons.startProject")}
            </FinalCtaLink>
            <Button
              to="/process#faq"
              variant="secondary"
              icon={false}
              className="wd-case-study-cta__dark-button wd-final-cta-action--dark"
            >
              {t("work.caseStudy.haveQuestions")}
            </Button>
          </div>
        </Container>
      </section>
    </article>
  );
}

export default CaseStudySection;
