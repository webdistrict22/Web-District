import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import api, { PUBLIC_CONTENT_TIMEOUT } from "../../lib/axios";
import { mergeProjectsWithFallback } from "../../data/demoProjects";
import Container from "../common/Container";
import ManualCarouselControls from "../common/ManualCarousel";
import useManualCarousel from "../common/useManualCarousel";
import useLanguage from "../../hooks/useLanguage";
import { getImageMetadata } from "../../data/imageMetadata";
import useMediaQuery from "../../hooks/useMediaQuery";
import { trackCustomEvent } from "../../lib/metaPixel";

const scheduleAfterPaint = (callback) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1600 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 650);
  return () => window.clearTimeout(id);
};

function WorkPreview() {
  const [projects, setProjects] = useState([]);
  const { effectiveLanguage, isRtl, t, translateValue } = useLanguage();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const controller = new AbortController();
    const cancel = scheduleAfterPaint(async () => {
      try {
        const { data } = await api.get("/projects/public", {
          signal: controller.signal,
          timeout: PUBLIC_CONTENT_TIMEOUT,
        });
        setProjects(data.projects || []);
      } catch {
        if (!controller.signal.aborted) setProjects([]);
      }
    });
    return () => {
      controller.abort();
      cancel?.();
    };
  }, []);

  const displayProjects = useMemo(
    () => mergeProjectsWithFallback(projects),
    [projects],
  );
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
    items: displayProjects,
    visibleCount: isDesktop ? 4 : 1,
    resetKey: effectiveLanguage,
  });

  return (
    <section className="wd-work-preview" aria-labelledby="work-preview-title">
      <Container>
        <div className="wd-home-section-heading">
          <div>
            <p className="wd-home-eyebrow">{t("home.work.eyebrow")}</p>
            <h2 id="work-preview-title" className="font-display">
              {t("home.work.title")}
            </h2>
            <p>{t("home.work.description")}</p>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="wd-work-viewport wd-manual-carousel-viewport"
          aria-label={t("home.work.eyebrow")}
          onClickCapture={handleClickCapture}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div
            ref={trackRef}
            className="wd-work-track wd-manual-carousel-track"
            dir="ltr"
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map(
              ({ item: project, duplicate }, index) => {
                const isDatabaseProject = Boolean(project._id);
                const rawName = isDatabaseProject ? project.title : project.name;
                const name = t(`work.projects.${project.slug}.name`, rawName);
                const rawType = isDatabaseProject
                  ? project.websiteType
                  : project.type;
                const type = t(
                  `work.projects.${project.slug}.type`,
                  translateValue("websiteTypes", rawType),
                );
                const image = isDatabaseProject
                  ? project.images?.[0]
                  : project.coverImage || project.image;
                const destination = project.isComingSoon
                  ? ""
                  : `/work/${project.slug}`;

                const content = (
                  <article className="wd-work-card" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="wd-work-card__image">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          {...getImageMetadata(image)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </div>
                    <div className="wd-work-card__meta">
                      <div>
                        <h3 className="font-display">{name}</h3>
                        <p>{type}</p>
                      </div>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </div>
                  </article>
                );

                return destination ? (
                  <Link
                    key={`${project._id || project.slug}-${index}`}
                    to={destination}
                    className="wd-work-card-link"
                    aria-label={t("home.work.ariaOpen", undefined, { name })}
                    aria-hidden={duplicate || undefined}
                    tabIndex={duplicate ? -1 : undefined}
                    draggable="false"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={`${project._id || project.slug}-${index}`}
                    className="wd-work-card-link"
                    aria-disabled="true"
                    aria-hidden={duplicate || undefined}
                  >
                    {content}
                  </div>
                );
              },
            )}
          </div>
        </div>

        <ManualCarouselControls
          activeIndex={activeIndex}
          className="wd-work-carousel-controls"
          count={pageCount}
          dotLabel={(index) =>
            t("work.caseStudy.slideLabel", undefined, {
              current: index + 1,
              total: pageCount,
            })
          }
          nextLabel={t("work.projectsNextAria")}
          onNext={next}
          onPrevious={previous}
          onSelect={goTo}
          previousLabel={t("work.projectsPreviousAria")}
        />

        <div className="wd-home-centered-action">
          <Link
            to="/work"
            className="wd-home-button wd-home-button--gold"
            onClick={() =>
              trackCustomEvent("SeeWorkClick", {
                button_name: "Work Preview",
                language: effectiveLanguage,
              })
            }
          >
            {t("common.buttons.viewWork")} <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default WorkPreview;
