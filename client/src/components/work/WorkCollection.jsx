import ManualCarouselControls from "../common/ManualCarousel";
import useManualCarousel from "../common/useManualCarousel";
import useLanguage from "../../hooks/useLanguage";

function WorkCollection({
  items,
  getKey,
  renderItem,
  ariaLabel,
  previousLabel,
  nextLabel,
  resetKey,
  tone = "dark",
}) {
  const { isRtl, t } = useLanguage();
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
  } = useManualCarousel({ items, visibleCount: 1, resetKey });

  return (
    <>
      <div className="wd-work-grid" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <div className="wd-work-grid__item" key={getKey(item, index)}>
            {renderItem(item, { duplicate: false, priority: index === 0 })}
          </div>
        ))}
      </div>

      <div className={`wd-work-mobile-collection wd-work-mobile-collection--${tone}`}>
        <div
          ref={viewportRef}
          className="wd-work-mobile-viewport wd-manual-carousel-viewport"
          aria-label={ariaLabel}
          onClickCapture={handleClickCapture}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div
            ref={trackRef}
            className="wd-work-mobile-track wd-manual-carousel-track"
            dir="ltr"
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map(({ item, duplicate }, index) => (
              <div
                className="wd-work-mobile-slide"
                key={`${getKey(item, index)}-${index}`}
                aria-hidden={duplicate || undefined}
                dir={isRtl ? "rtl" : "ltr"}
              >
                {renderItem(item, { duplicate, priority: false })}
              </div>
            ))}
          </div>
        </div>

        <ManualCarouselControls
          activeIndex={activeIndex}
          className="wd-work-mobile-controls"
          count={pageCount}
          dotLabel={(index) =>
            t("work.caseStudy.slideLabel", undefined, {
              current: index + 1,
              total: pageCount,
            })
          }
          nextLabel={nextLabel}
          onNext={next}
          onPrevious={previous}
          onSelect={goTo}
          previousLabel={previousLabel}
          tone={tone}
        />
      </div>
    </>
  );
}

export default WorkCollection;
