import { ArrowLeft, ArrowRight } from "lucide-react";
import "./ManualCarousel.css";

function ManualCarouselControls({
  activeIndex,
  className = "",
  count,
  dotLabel,
  nextLabel,
  onNext,
  onPrevious,
  onSelect,
  previousLabel,
  tone = "dark",
}) {
  if (count <= 1) return null;

  return (
    <div className={`wd-manual-carousel-controls wd-manual-carousel-controls--${tone} ${className}`.trim()}>
      <button type="button" onClick={onPrevious} aria-label={previousLabel}>
        <ArrowLeft aria-hidden="true" />
      </button>
      <div className="wd-manual-carousel-controls__dots">
        {Array.from({ length: count }, (_, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            key={index}
            onClick={() => onSelect(index)}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={dotLabel(index)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <button type="button" onClick={onNext} aria-label={nextLabel}>
        <ArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}

export default ManualCarouselControls;
