import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./ManualCarousel.css";

const TOUCH_PRESS_DURATION_MS = 140;
const TOUCH_PRESS_FALLBACK_MS = 160;

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
  const [touchPressedArrow, setTouchPressedArrow] = useState(null);
  const touchPressStartedAtRef = useRef(0);
  const touchPressTimerRef = useRef(0);
  const touchPointerRef = useRef(null);
  const touchPressedControlRef = useRef(null);

  const clearTouchPress = useCallback((control = touchPressedControlRef.current) => {
    window.clearTimeout(touchPressTimerRef.current);
    touchPressTimerRef.current = 0;
    touchPressStartedAtRef.current = 0;
    touchPointerRef.current = null;
    touchPressedControlRef.current = null;
    setTouchPressedArrow(null);

    if (control && document.activeElement === control) control.blur();
  }, []);

  const scheduleTouchPressClear = useCallback((control, delay) => {
    window.clearTimeout(touchPressTimerRef.current);
    touchPressTimerRef.current = window.setTimeout(
      () => clearTouchPress(control),
      delay,
    );
  }, [clearTouchPress]);

  useEffect(() => () => {
    window.clearTimeout(touchPressTimerRef.current);
  }, []);

  if (count <= 1) return null;

  const startTouchPress = (event, arrow) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

    clearTouchPress();
    touchPressStartedAtRef.current = window.performance.now();
    touchPointerRef.current = { id: event.pointerId, released: false };
    touchPressedControlRef.current = event.currentTarget;
    setTouchPressedArrow(arrow);
    scheduleTouchPressClear(event.currentTarget, TOUCH_PRESS_FALLBACK_MS);
  };

  const releaseTouchPress = (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

    if (touchPointerRef.current?.id === event.pointerId) {
      touchPointerRef.current.released = true;
    }

    const elapsed = window.performance.now() - touchPressStartedAtRef.current;
    scheduleTouchPressClear(
      event.currentTarget,
      Math.max(0, TOUCH_PRESS_DURATION_MS - elapsed),
    );
  };

  const cancelTouchPress = (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    clearTouchPress(event.currentTarget);
  };

  const clearUnreleasedTouchPress = (event) => {
    if (touchPointerRef.current?.released) return;
    cancelTouchPress(event);
  };

  const clearTouchFocus = (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

    const control = event.currentTarget;
    window.requestAnimationFrame(() => {
      if (document.activeElement === control) control.blur();
    });
  };

  const pointerReleaseProps = {
    onPointerCancel: clearTouchFocus,
    onPointerUp: clearTouchFocus,
  };

  return (
    <div className={`wd-manual-carousel-controls wd-manual-carousel-controls--${tone} ${className}`.trim()}>
      <button
        type="button"
        className={touchPressedArrow === "previous" ? "is-touch-pressed" : ""}
        onClick={onPrevious}
        aria-label={previousLabel}
        onLostPointerCapture={clearUnreleasedTouchPress}
        onPointerCancel={cancelTouchPress}
        onPointerDown={(event) => startTouchPress(event, "previous")}
        onPointerLeave={clearUnreleasedTouchPress}
        onPointerUp={releaseTouchPress}
      >
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
            {...pointerReleaseProps}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className={touchPressedArrow === "next" ? "is-touch-pressed" : ""}
        onClick={onNext}
        aria-label={nextLabel}
        onLostPointerCapture={clearUnreleasedTouchPress}
        onPointerCancel={cancelTouchPress}
        onPointerDown={(event) => startTouchPress(event, "next")}
        onPointerLeave={clearUnreleasedTouchPress}
        onPointerUp={releaseTouchPress}
      >
        <ArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}

export default ManualCarouselControls;
