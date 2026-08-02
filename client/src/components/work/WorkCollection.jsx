import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

function WorkCollection({
  items,
  getKey,
  renderItem,
  ariaLabel,
  previousLabel,
  nextLabel,
  isRtl = false,
  tone = "dark",
}) {
  const trackRef = useRef(null);
  const activeIndexRef = useRef(0);
  const physicalIndexRef = useRef(items.length > 1 ? 1 : 0);
  const isNormalizingRef = useRef(false);
  const normalizationFrameRef = useRef(null);
  const settleTimerRef = useRef(null);
  const hasLoop = items.length > 1;
  const slides = hasLoop ? [items.at(-1), ...items, items[0]] : items;

  const scrollToPhysicalSlide = useCallback((index, behavior = "smooth") => {
    const track = trackRef.current;
    const target = track?.querySelector(`[data-work-slide-index="${index}"]`);
    if (!track || !target || !track.clientWidth || !target.getBoundingClientRect().width) {
      return false;
    }

    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resolvedBehavior = shouldReduceMotion ? "auto" : behavior;
    const previousBehavior = track.style.scrollBehavior;
    if (resolvedBehavior === "auto") track.style.scrollBehavior = "auto";
    target.scrollIntoView({ behavior: resolvedBehavior, block: "nearest", inline: "start" });
    physicalIndexRef.current = index;

    if (resolvedBehavior === "auto") {
      window.requestAnimationFrame(() => {
        if (trackRef.current) trackRef.current.style.scrollBehavior = previousBehavior;
      });
    }

    return true;
  }, []);

  const normalizeToPhysicalSlide = useCallback((index) => {
    window.clearTimeout(settleTimerRef.current);
    isNormalizingRef.current = true;

    const didScroll = scrollToPhysicalSlide(index, "auto");
    if (!didScroll) {
      isNormalizingRef.current = false;
      return false;
    }

    window.cancelAnimationFrame(normalizationFrameRef.current);
    normalizationFrameRef.current = window.requestAnimationFrame(() => {
      isNormalizingRef.current = false;
    });

    return true;
  }, [scrollToPhysicalSlide]);

  const scrollToItem = useCallback((index, behavior = "smooth") => {
    if (!items.length) return false;

    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    const physicalIndex = hasLoop ? nextIndex + 1 : nextIndex;
    const didScroll = scrollToPhysicalSlide(physicalIndex, behavior);

    if (didScroll) activeIndexRef.current = nextIndex;
    return didScroll;
  }, [hasLoop, items.length, scrollToPhysicalSlide]);

  const settlePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track || !items.length || isNormalizingRef.current) return;

    const trackRect = track.getBoundingClientRect();
    const trackStart = isRtl ? trackRect.right : trackRect.left;
    const slideElements = [...track.querySelectorAll("[data-work-slide-index]")];
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slideElements.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideStart = isRtl ? rect.right : rect.left;
      const distance = Math.abs(slideStart - trackStart);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    physicalIndexRef.current = closestIndex;

    if (!hasLoop) {
      activeIndexRef.current = closestIndex;
      return;
    }

    if (closestIndex === 0) {
      activeIndexRef.current = items.length - 1;
      normalizeToPhysicalSlide(items.length);
      return;
    }

    if (closestIndex === items.length + 1) {
      activeIndexRef.current = 0;
      normalizeToPhysicalSlide(1);
      return;
    }

    activeIndexRef.current = closestIndex - 1;
  }, [hasLoop, isRtl, items.length, normalizeToPhysicalSlide]);

  useLayoutEffect(() => {
    if (!items.length) {
      activeIndexRef.current = 0;
      return undefined;
    }

    activeIndexRef.current = Math.min(activeIndexRef.current, items.length - 1);

    const restorePosition = () => {
      scrollToItem(activeIndexRef.current, "auto");
    };

    restorePosition();
    const frame = window.requestAnimationFrame(restorePosition);
    const resizeObserver = new ResizeObserver(restorePosition);

    if (trackRef.current) resizeObserver.observe(trackRef.current);
    window.addEventListener("resize", restorePosition);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(normalizationFrameRef.current);
      window.clearTimeout(settleTimerRef.current);
      isNormalizingRef.current = false;
      resizeObserver.disconnect();
      window.removeEventListener("resize", restorePosition);
    };
  }, [isRtl, items, scrollToItem]);

  const handleScroll = useCallback(() => {
    if (isNormalizingRef.current) return;

    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      if (!isNormalizingRef.current) settlePosition();
    }, 140);
  }, [settlePosition]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !("onscrollend" in track)) return undefined;

    const handleScrollEnd = () => {
      if (isNormalizingRef.current) return;

      window.clearTimeout(settleTimerRef.current);
      settlePosition();
    };

    track.addEventListener("scrollend", handleScrollEnd);
    return () => track.removeEventListener("scrollend", handleScrollEnd);
  }, [settlePosition]);

  const move = (step) => {
    if (!hasLoop) return;

    const currentIndex = activeIndexRef.current;
    const nextIndex = (currentIndex + step + items.length) % items.length;
    const isWrapping =
      (step < 0 && currentIndex === 0) ||
      (step > 0 && currentIndex === items.length - 1);

    if (isWrapping) {
      const cloneIndex = step < 0 ? 0 : items.length + 1;
      if (scrollToPhysicalSlide(cloneIndex, "smooth")) {
        activeIndexRef.current = nextIndex;
      }
      return;
    }

    scrollToItem(nextIndex, "smooth");
  };

  return (
    <>
      <div className="wd-work-grid" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <div className="wd-work-grid__item" key={getKey(item, index)}>
            {renderItem(item, { duplicate: false })}
          </div>
        ))}
      </div>

      <div className={`wd-work-mobile-collection wd-work-mobile-collection--${tone}`}>
        <div
          ref={trackRef}
          className="wd-work-mobile-track"
          dir={isRtl ? "rtl" : "ltr"}
          aria-label={ariaLabel}
          onScroll={handleScroll}
        >
          {slides.map((item, index) => {
            const duplicate = hasLoop && (index === 0 || index === slides.length - 1);
            return (
              <div
                className="wd-work-mobile-slide"
                data-work-slide-index={index}
                key={`${getKey(item, index)}-${index}`}
                aria-hidden={duplicate || undefined}
              >
                {renderItem(item, { duplicate })}
              </div>
            );
          })}
        </div>

        {hasLoop ? (
          <div className="wd-work-mobile-controls">
            <button type="button" onClick={() => move(-1)} aria-label={previousLabel}>
              {isRtl ? <ArrowRight aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => move(1)} aria-label={nextLabel}>
              {isRtl ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default WorkCollection;
