import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import useLanguage from "../../hooks/useLanguage";
import { trackCustomEvent } from "../../lib/metaPixel";

function ServicesPreview() {
  const { effectiveLanguage, isRtl, t } = useLanguage();
  const services = t("services.cards", []);
  const itemCount = services.length;
  const trackRef = useRef(null);
  const dragRef = useRef({ dragged: false, startX: 0, startY: 0 });
  const [carouselProgress, setCarouselProgress] = useState({
    language: effectiveLanguage,
    index: 0,
  });
  const activeIndex =
    carouselProgress.language === effectiveLanguage ? carouselProgress.index : 0;

  const startDrag = (event) => {
    dragRef.current = {
      dragged: false,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const trackDrag = (event) => {
    const distanceX = Math.abs(event.clientX - dragRef.current.startX);
    const distanceY = Math.abs(event.clientY - dragRef.current.startY);
    if (distanceX > 8 || distanceY > 8) dragRef.current.dragged = true;
  };

  const updateProgress = () => {
    const track = trackRef.current;
    const firstCard = track?.querySelector("article");
    if (!track || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    setCarouselProgress({
      language: effectiveLanguage,
      index: Math.min(
        services.length - 1,
        Math.max(0, Math.round(Math.abs(track.scrollLeft) / (firstCard.offsetWidth + gap))),
      ),
    });
  };

  const moveTo = (nextIndex) => {
    const track = trackRef.current;
    const firstCard = track?.querySelector("article");
    if (!track || !firstCard || !itemCount) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const wrappedIndex = ((nextIndex % itemCount) + itemCount) % itemCount;
    setCarouselProgress({ language: effectiveLanguage, index: wrappedIndex });
    track.scrollTo({
      left: (isRtl ? -1 : 1) * wrappedIndex * (firstCard.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  const goToPrevious = () => moveTo((activeIndex - 1 + itemCount) % itemCount);
  const goToNext = () => moveTo((activeIndex + 1) % itemCount);

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
          key={effectiveLanguage}
          ref={trackRef}
          className="wd-services-track wd-snap-track"
          onScroll={updateProgress}
          onPointerDown={startDrag}
          onPointerMove={trackDrag}
          aria-label={t("home.services.eyebrow")}
        >
          {services.map((service, index) => (
            <Link
              className="wd-service-panel-link"
              key={service.title}
              to="/services"
              aria-label={`${service.title} — ${t("common.buttons.viewServices")}`}
              draggable="false"
              onClick={(event) => {
                if (dragRef.current.dragged) event.preventDefault();
              }}
            >
              <article className="wd-service-panel">
                <p className="wd-service-panel__number">0{index + 1}</p>
                <div>
                  <h3 className="font-display">{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </article>
            </Link>
          ))}
        </div>

        <div className="wd-carousel-controls wd-carousel-controls--ink wd-services-controls">
          <Link
            to="/services"
            className="wd-home-button wd-home-button--ink wd-services-action"
            onClick={() =>
              trackCustomEvent("ServicesClick", {
                button_name: "Services Preview",
                language: effectiveLanguage,
              })
            }
          >
            {t("common.buttons.viewServices")} <ArrowUpRight size={17} />
          </Link>
          <div dir={isRtl ? "rtl" : "ltr"}>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label={t("home.services.previousAria")}
            >
              {isRtl ? <ArrowRight /> : <ArrowLeft />}
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label={t("home.services.nextAria")}
            >
              {isRtl ? <ArrowLeft /> : <ArrowRight />}
            </button>
          </div>
        </div>

        <div className="wd-services-desktop-action">
          <Link
            to="/services"
            className="wd-home-button wd-home-button--ink"
            onClick={() =>
              trackCustomEvent("ServicesClick", {
                button_name: "Services Preview",
                language: effectiveLanguage,
              })
            }
          >
            {t("common.buttons.viewServices")} <ArrowUpRight size={17} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default ServicesPreview;
