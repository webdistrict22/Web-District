import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import api, { PUBLIC_CONTENT_TIMEOUT } from "../../lib/axios";
import { mergeProjectsWithFallback } from "../../data/demoProjects";
import Container from "../common/Container";
import useLanguage from "../../hooks/useLanguage";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
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

  const displayProjects = useMemo(() => mergeProjectsWithFallback(projects), [projects]);
  const maxIndex = Math.max(0, displayProjects.length - (isDesktop ? 4 : 1));
  const currentIndex = Math.min(activeIndex, maxIndex);
  const itemCount = maxIndex + 1;

  const getStep = () => {
    const track = trackRef.current;
    const card = track?.querySelector("article");
    if (!track || !card) return 0;
    return card.offsetWidth + (Number.parseFloat(getComputedStyle(track).columnGap) || 0);
  };

  const updateProgress = () => {
    const track = trackRef.current;
    const step = getStep();
    if (!track || !step) return;
    setActiveIndex(
      Math.min(maxIndex, Math.max(0, Math.round(Math.abs(track.scrollLeft) / step))),
    );
  };

  const moveTo = (nextIndex) => {
    const wrappedIndex = ((nextIndex % itemCount) + itemCount) % itemCount;
    setActiveIndex(wrappedIndex);
    trackRef.current?.scrollTo({
      left: (isRtl ? -1 : 1) * wrappedIndex * getStep(),
      behavior: "smooth",
    });
  };

  const goToPrevious = () => moveTo((currentIndex - 1 + itemCount) % itemCount);
  const goToNext = () => moveTo((currentIndex + 1) % itemCount);

  const startDrag = (event) => {
    if (event.pointerType === "touch") return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: trackRef.current.scrollLeft,
    };
    trackRef.current.dataset.dragged = "false";
    trackRef.current.setPointerCapture(event.pointerId);
  };

  const drag = (event) => {
    if (!dragRef.current.active) return;
    const distance = event.clientX - dragRef.current.startX;
    if (Math.abs(distance) > 5) trackRef.current.dataset.dragged = "true";
    trackRef.current.scrollLeft = dragRef.current.scrollLeft - distance;
  };

  const stopDrag = () => {
    dragRef.current.active = false;
  };

  return (
    <section className="wd-work-preview" aria-labelledby="work-preview-title">
      <Container>
        <div className="wd-home-section-heading">
          <div>
            <p className="wd-home-eyebrow">{t("home.work.eyebrow")}</p>
            <h2 id="work-preview-title" className="font-display">{t("home.work.title")}</h2>
            <p>{t("home.work.description")}</p>
          </div>
        </div>

        <div
          ref={trackRef}
          className="wd-work-track wd-snap-track"
          onScroll={updateProgress}
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          aria-label={t("home.work.eyebrow")}
        >
          {displayProjects.map((project) => {
            const isDatabaseProject = Boolean(project._id);
            const name = isDatabaseProject ? project.title : project.name;
            const rawType = isDatabaseProject ? project.websiteType : project.type;
            const type = t(`work.projects.${project.slug}.type`, translateValue("websiteTypes", rawType));
            const image = isDatabaseProject ? project.images?.[0] : project.coverImage || project.image;
            const destination = project.isComingSoon ? "" : `/work/${project.slug}`;

            const content = (
              <article className="wd-work-card">
                <div className="wd-work-card__image">
                  {image ? <img src={image} alt={name} loading="lazy" decoding="async" /> : null}
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
                key={project._id || project.slug}
                to={destination}
                className="wd-work-card-link"
                aria-label={t("home.work.ariaOpen", undefined, { name })}
                draggable="false"
                onClick={(event) => {
                  if (trackRef.current?.dataset.dragged === "true") event.preventDefault();
                }}
              >
                {content}
              </Link>
            ) : (
              <div key={project._id || project.slug} className="wd-work-card-link" aria-disabled="true">
                {content}
              </div>
            );
          })}
        </div>

        {(!isDesktop || displayProjects.length > 4) ? (
          <div className="wd-carousel-controls wd-work-carousel-controls">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous project"
            >
              {isRtl ? <ArrowRight /> : <ArrowLeft />}
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next project"
            >
              {isRtl ? <ArrowLeft /> : <ArrowRight />}
            </button>
          </div>
        ) : null}

        <div className="wd-home-centered-action">
          <Link
            to="/work"
            className="wd-home-button wd-home-button--gold"
            onClick={() => trackCustomEvent("SeeWorkClick", { button_name: "Work Preview", language: effectiveLanguage })}
          >
            {t("common.buttons.viewWork")} <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default WorkPreview;
