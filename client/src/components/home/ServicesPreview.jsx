import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import Container from "../common/Container";
import ManualCarouselControls from "../common/ManualCarousel";
import useManualCarousel from "../common/useManualCarousel";
import useLanguage from "../../hooks/useLanguage";
import useMediaQuery from "../../hooks/useMediaQuery";
import { trackCustomEvent } from "../../lib/metaPixel";
import { servicesPageSections } from "../../data/servicesData";

function ServicesPreview() {
  const { effectiveLanguage, isRtl, t } = useLanguage();
  const services = t("services.cards", []);
  const isMobile = useMediaQuery("(max-width: 767px)");
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
    items: services,
    visibleCount: isMobile ? 1 : Math.max(1, services.length),
    resetKey: effectiveLanguage,
  });

  const trackServicesClick = () =>
    trackCustomEvent("ServicesClick", {
      button_name: "Services Preview",
      language: effectiveLanguage,
    });

  return (
    <section className="wd-services-preview" aria-labelledby="services-preview-title">
      <Container>
        <div className="wd-home-section-heading wd-home-section-heading--ink">
          <div>
            <p className="wd-home-eyebrow">{t("home.services.eyebrow")}</p>
            <h2 id="services-preview-title" className="font-display">
              {t("home.services.title")}
            </h2>
            <p>{t("home.services.description")}</p>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="wd-services-viewport wd-manual-carousel-viewport"
          aria-label={t("home.services.eyebrow")}
          onClickCapture={handleClickCapture}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div
            ref={trackRef}
            className="wd-services-track wd-manual-carousel-track"
            dir="ltr"
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map(
              ({ item: service, duplicate, logicalIndex }, index) => (
                <Link
                  className="wd-service-panel-link"
                  key={`${service.title}-${index}`}
                  to={`/services#${servicesPageSections[logicalIndex].id}`}
                  aria-label={`${service.title} - ${t("common.buttons.viewServices")}`}
                  aria-hidden={duplicate || undefined}
                  tabIndex={duplicate ? -1 : undefined}
                  dir={isRtl ? "rtl" : "ltr"}
                  draggable="false"
                >
                  <article className="wd-service-panel">
                    <p className="wd-service-panel__number">0{logicalIndex + 1}</p>
                    <div>
                      <h3 className="font-display">{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </article>
                </Link>
              ),
            )}
          </div>
        </div>

        {isMobile ? (
          <ManualCarouselControls
            activeIndex={activeIndex}
            className="wd-services-controls"
            count={pageCount}
            dotLabel={(index) =>
              t("work.caseStudy.slideLabel", undefined, {
                current: index + 1,
                total: pageCount,
              })
            }
            nextLabel={t("home.services.nextAria")}
            onNext={next}
            onPrevious={previous}
            onSelect={goTo}
            previousLabel={t("home.services.previousAria")}
            tone="ink"
          />
        ) : null}

        <div className="wd-services-mobile-action">
          <Link
            to="/services"
            className="wd-home-button wd-home-button--ink wd-services-action"
            onClick={trackServicesClick}
          >
            {t("common.buttons.viewServices")} <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="wd-services-desktop-action">
          <Link
            to="/services"
            className="wd-home-button wd-home-button--ink"
            onClick={trackServicesClick}
          >
            {t("common.buttons.viewServices")} <ArrowUpRight size={17} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default ServicesPreview;
