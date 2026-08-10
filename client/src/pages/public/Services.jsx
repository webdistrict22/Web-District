import { useCallback, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import FinalCtaLink from "../../components/common/FinalCtaLink";
import ServiceSection from "../../components/services/ServiceSection";
import { servicesPageSections } from "../../data/servicesData";
import useLanguage from "../../hooks/useLanguage";
import useMediaQuery from "../../hooks/useMediaQuery";
import useRestorableAccordion from "../../hooks/useRestorableAccordion";
import { trackCustomEvent } from "../../lib/metaPixel";
import "./Services.css";

const serviceIds = new Set(servicesPageSections.map(({ id }) => id));

const getServiceIdFromHash = (hash) => {
  if (!hash) return null;

  try {
    const serviceId = decodeURIComponent(hash.slice(1));
    return serviceIds.has(serviceId) ? serviceId : null;
  } catch {
    return null;
  }
};

function Services() {
  const { effectiveLanguage, t } = useLanguage();
  const { hash, key: locationKey } = useLocation();
  const isMobile = useMediaQuery("(max-width: 720px)");
  const hashedServiceId = getServiceIdFromHash(hash);
  const [mobileAccordion, setMobileAccordion] = useState(() => ({
    locationKey,
    openServiceId: hashedServiceId,
  }));
  const openServiceId =
    mobileAccordion.locationKey === locationKey
      ? mobileAccordion.openServiceId
      : hashedServiceId;
  const serviceDetails = t("services.details", []);
  const transitionBand = t("services.transitionBand", {});
  const sectionLabels = t("services.sectionLabels", {});
  const services = servicesPageSections.map((section, index) => ({
    ...section,
    ...serviceDetails[index],
  }));

  const trackStartProject = () =>
    trackCustomEvent("StartProjectClick", {
      button_name: "Services Final CTA Start Project",
      language: effectiveLanguage,
    });

  const setOpenServiceId = useCallback((openServiceId) => {
    setMobileAccordion({
      locationKey,
      openServiceId,
    });
  }, [locationKey]);
  const {
    handlePanelClick,
    handlePanelPointerDown,
    rememberOpenPosition,
    toggleItem: toggleService,
  } = useRestorableAccordion({
    openKey: openServiceId,
    restoreBehavior: "smooth",
    setOpenKey: setOpenServiceId,
  });

  useLayoutEffect(() => {
    if (!isMobile || !hashedServiceId) return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hashedServiceId)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
      rememberOpenPosition(hashedServiceId, window.scrollY);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [effectiveLanguage, hashedServiceId, isMobile, locationKey, rememberOpenPosition]);

  return (
    <div className="wd-services-page">
      <PageMeta
        title={t("services.metaTitle")}
        description={t("services.metaDescription")}
        canonical="/services"
      />

      <section
        className="wd-services-hero"
        aria-labelledby="services-page-title"
      >
        <Container>
          <div className="wd-services-hero__content">
            <p className="wd-services-eyebrow">
              {t("services.hero.eyebrow")}
            </p>
            <h1 id="services-page-title" className="font-display">
              {t("services.hero.title")}
            </h1>
          </div>
        </Container>
      </section>

      <div className="wd-services-transition">
        <Container>
          <div className="wd-services-transition__layout">
            <p className="wd-services-transition__range" dir="ltr">
              01—06
            </p>
            <p className="wd-services-transition__label">
              {transitionBand.label}
              <span
                className="wd-services-transition__mobile-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </p>
            <p className="wd-services-transition__prompt">
              {transitionBand.prompt}
              <span aria-hidden="true">↓</span>
            </p>
          </div>
        </Container>
      </div>

      {services.map((service, index) => (
        <ServiceSection
          key={service.id}
          service={service}
          number={String(index + 1).padStart(2, "0")}
          labels={sectionLabels}
          isMobile={isMobile}
          isExpanded={openServiceId === service.id}
          onToggle={() => toggleService(service.id)}
          onPanelPointerDown={handlePanelPointerDown}
          onPanelClick={(event) => handlePanelClick(event, service.id)}
        />
      ))}

      <section
        className="wd-services-cta"
        aria-labelledby="services-final-cta-title"
      >
        <Container>
          <div className="wd-services-cta__layout">
            <div className="wd-services-cta__copy">
              <p className="wd-services-eyebrow">
                {t("services.bottomCta.eyebrow")}
              </p>
              <h2 id="services-final-cta-title" className="font-display">
                {t("services.bottomCta.title")}
              </h2>
              <p>{t("services.bottomCta.description")}</p>
            </div>

            <div className="wd-services-cta__actions">
              <FinalCtaLink
                to="/start"
                tone="dark"
                className="wd-services-cta__primary"
                onClick={trackStartProject}
              >
                {t("common.buttons.startProject")}
              </FinalCtaLink>
              <FinalCtaLink
                to="/process#faq"
                tone="light"
                className="wd-services-cta__secondary"
              >
                {t("common.buttons.viewQuestions")}
              </FinalCtaLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Services;
