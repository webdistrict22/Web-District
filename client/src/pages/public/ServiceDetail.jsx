import { Link, useParams } from "react-router";
import Container from "../../components/common/Container";
import FinalCtaLink from "../../components/common/FinalCtaLink";
import RouteMeta from "../../components/common/RouteMeta";
import ServiceSection from "../../components/services/ServiceSection";
import NotFound from "../NotFound";
import {
  getServiceBySlug,
  serviceById,
  serviceCatalog,
} from "../../data/servicesData";
import { workProjects } from "../../data/demoProjects";
import useLanguage from "../../hooks/useLanguage";
import "./Services.css";
import "./ServiceDetail.css";

function RelatedWork({ service, page, t, isRtl }) {
  const projects = service.relatedProjectSlugs
    .map((slug) => workProjects.find((project) => project.slug === slug))
    .filter(Boolean);

  if (!projects.length) return null;

  return (
    <section
      className="wd-service-detail-proof"
      aria-labelledby={`${service.id}-proof-title`}
    >
      <Container>
        <header className="wd-service-detail-heading">
          <p>{page.proofEyebrow}</p>
          <h2 id={`${service.id}-proof-title`} className="font-display">
            {page.proofTitle}
          </h2>
          <span>{page.proofDescription}</span>
        </header>

        <div className="wd-service-detail-projects">
          {projects.map((project) => {
            const name = t(`work.projects.${project.slug}.name`, project.name);
            const description = t(
              `work.projects.${project.slug}.description`,
              project.description,
            );

            return (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="wd-service-detail-project"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <span className="wd-service-detail-project__type">
                  {t(
                    `work.projects.${project.slug}.type`,
                    project.type || project.businessType,
                  )}
                </span>
                <h3 className="font-display">{name}</h3>
                <p>{description}</p>
                <span className="wd-service-detail-project__link">
                  {isRtl ? "عرض دراسة الحالة" : "View case study"}
                  <span aria-hidden="true">↗</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function RelatedServices({ service, page, isRtl }) {
  const relatedServices = service.relatedServiceIds
    .map((id) => serviceById.get(id))
    .filter(Boolean);

  if (!relatedServices.length) return null;

  return (
    <section
      className="wd-service-detail-related"
      aria-labelledby={`${service.id}-related-title`}
    >
      <Container>
        <header className="wd-service-detail-heading wd-service-detail-heading--dark">
          <p>{page.relatedEyebrow}</p>
          <h2 id={`${service.id}-related-title`} className="font-display">
            {page.relatedTitle}
          </h2>
        </header>

        <nav
          className="wd-service-detail-related__links"
          aria-label={isRtl ? "خدمات Web District المرتبطة" : "Related Web District services"}
        >
          {relatedServices.map((relatedService) => {
            const relatedPage = relatedService.page[isRtl ? "ar" : "en"];

            return (
              <Link key={relatedService.id} to={relatedService.path}>
                <span>{relatedPage.name}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            );
          })}
        </nav>
      </Container>
    </section>
  );
}

function ServiceDetail() {
  const { serviceSlug } = useParams();
  const { effectiveLanguage, isRtl, t } = useLanguage();
  const service = getServiceBySlug(serviceSlug);

  if (!service) return <NotFound />;

  const page = service.page[effectiveLanguage] || service.page.en;
  const serviceIndex = serviceCatalog.findIndex((item) => item.id === service.id);
  const translatedDetails = t("services.details", [])[serviceIndex] || {};
  const sectionLabels = t("services.sectionLabels", {});
  const serviceNumber = String(serviceIndex + 1).padStart(2, "0");
  const sectionService = {
    ...service,
    ...translatedDetails,
    path: undefined,
    detailLinkLabel: undefined,
    reverse: false,
  };

  return (
    <div className="wd-services-page wd-service-detail-page">
      <RouteMeta path={service.path} />

      <section
        className="wd-services-hero wd-service-detail-hero"
        aria-labelledby="service-detail-title"
      >
        <Container>
          <div className="wd-services-hero__content">
            <p className="wd-services-eyebrow">{page.eyebrow}</p>
            <h1 id="service-detail-title" className="font-display">
              {page.title}
            </h1>
            <p className="wd-service-detail-hero__intro">{page.intro}</p>
          </div>
        </Container>
      </section>

      <div className="wd-services-transition" aria-hidden="true">
        <Container>
          <div className="wd-services-transition__layout">
            <p className="wd-services-transition__range" dir="ltr">
              {serviceNumber}—06
            </p>
            <p className="wd-services-transition__label">{page.name}</p>
            <p className="wd-services-transition__prompt">
              {isRtl ? "التفاصيل" : "The details"}
              <span>↓</span>
            </p>
          </div>
        </Container>
      </div>

      <section
        className="wd-service-detail-context"
        aria-labelledby="service-detail-context-title"
      >
        <Container>
          <div className="wd-service-detail-context__layout">
            <header>
              <p className="wd-services-eyebrow">{page.contextEyebrow}</p>
              <h2 id="service-detail-context-title" className="font-display">
                {page.contextTitle}
              </h2>
            </header>
            <div className="wd-service-detail-context__body">
              {page.contextParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <ServiceSection
        service={sectionService}
        number={serviceNumber}
        labels={sectionLabels}
        isMobile={false}
        isExpanded
      />

      <RelatedWork service={service} page={page} t={t} isRtl={isRtl} />
      <RelatedServices service={service} page={page} isRtl={isRtl} />

      <section
        className="wd-services-cta"
        aria-labelledby="service-detail-cta-title"
      >
        <Container>
          <div className="wd-services-cta__layout">
            <div className="wd-services-cta__copy">
              <p className="wd-services-eyebrow">
                {t("services.bottomCta.eyebrow")}
              </p>
              <h2 id="service-detail-cta-title" className="font-display">
                {t("services.bottomCta.title")}
              </h2>
              <p>{t("services.bottomCta.description")}</p>
            </div>

            <div className="wd-services-cta__actions">
              <FinalCtaLink
                to="/start"
                tone="dark"
                className="wd-services-cta__primary"
              >
                {t("common.buttons.startProject")}
              </FinalCtaLink>
              <FinalCtaLink
                to="/services"
                tone="light"
                className="wd-services-cta__secondary"
              >
                {t("common.buttons.viewServices")}
              </FinalCtaLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default ServiceDetail;
