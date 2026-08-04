import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const TRANSITION_MS = 420;
const SWIPE_THRESHOLD = 42;

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function useManualCarousel({ items, visibleCount = 1, resetKey }) {
  const itemCount = items.length;
  const pageCount = Math.max(1, itemCount - visibleCount + 1);
  const hasLoop = pageCount > 1;
  const cloneCount = hasLoop ? Math.min(visibleCount, itemCount) : 0;
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const stepRef = useRef(0);
  const activeIndexRef = useRef(0);
  const physicalIndexRef = useRef(cloneCount);
  const isTransitioningRef = useRef(false);
  const normalizationTargetRef = useRef(null);
  const safetyTimerRef = useRef(0);
  const resetKeyRef = useRef(resetKey);
  const pointerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    if (!hasLoop) {
      return items.map((item, index) => ({
        item,
        duplicate: false,
        logicalIndex: index,
      }));
    }

    return [
      ...items.slice(-cloneCount).map((item, index) => ({
        item,
        duplicate: true,
        logicalIndex: itemCount - cloneCount + index,
      })),
      ...items.map((item, index) => ({
        item,
        duplicate: false,
        logicalIndex: index,
      })),
      ...items.slice(0, cloneCount).map((item, index) => ({
        item,
        duplicate: true,
        logicalIndex: index,
      })),
    ];
  }, [cloneCount, hasLoop, itemCount, items]);

  const applyPosition = useCallback((physicalIndex, animate) => {
    const track = trackRef.current;
    if (!track || !stepRef.current) return false;

    track.style.transition = animate
      ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : "none";
    track.style.transform = `translate3d(${-physicalIndex * stepRef.current}px, 0, 0)`;
    physicalIndexRef.current = physicalIndex;
    return true;
  }, []);

  const finishTransition = useCallback(() => {
    window.clearTimeout(safetyTimerRef.current);
    const normalizationTarget = normalizationTargetRef.current;

    if (normalizationTarget !== null) {
      normalizationTargetRef.current = null;
      applyPosition(normalizationTarget, false);
      window.requestAnimationFrame(() => {
        isTransitioningRef.current = false;
      });
      return;
    }

    isTransitioningRef.current = false;
  }, [applyPosition]);

  const animateTo = useCallback((physicalIndex, logicalIndex, normalizeTo = null) => {
    if (!hasLoop || isTransitioningRef.current) return false;

    activeIndexRef.current = logicalIndex;
    setActiveIndex(logicalIndex);

    if (prefersReducedMotion()) {
      applyPosition(cloneCount + logicalIndex, false);
      return true;
    }

    isTransitioningRef.current = true;
    normalizationTargetRef.current = normalizeTo;

    if (!applyPosition(physicalIndex, true)) {
      isTransitioningRef.current = false;
      normalizationTargetRef.current = null;
      return false;
    }

    window.clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = window.setTimeout(
      finishTransition,
      TRANSITION_MS + 140,
    );
    return true;
  }, [applyPosition, cloneCount, finishTransition, hasLoop]);

  const move = useCallback((direction) => {
    if (!hasLoop || isTransitioningRef.current) return;

    const current = activeIndexRef.current;
    const next = (current + direction + pageCount) % pageCount;

    if (direction < 0 && current === 0) {
      animateTo(0, next, cloneCount + next);
      return;
    }

    if (direction > 0 && current === pageCount - 1) {
      animateTo(cloneCount + itemCount, next, cloneCount + next);
      return;
    }

    animateTo(cloneCount + next, next);
  }, [animateTo, cloneCount, hasLoop, itemCount, pageCount]);

  const goTo = useCallback((index) => {
    const next = Math.max(0, Math.min(index, pageCount - 1));
    if (next === activeIndexRef.current || isTransitioningRef.current) return;
    animateTo(cloneCount + next, next);
  }, [animateTo, cloneCount, pageCount]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const firstSlide = track?.firstElementChild;
    if (!track || !firstSlide) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    stepRef.current = firstSlide.getBoundingClientRect().width + gap;
    applyPosition(physicalIndexRef.current, false);
  }, [applyPosition]);

  useLayoutEffect(() => {
    const didReset = resetKeyRef.current !== resetKey;
    resetKeyRef.current = resetKey;
    const nextIndex = didReset
      ? 0
      : Math.min(activeIndexRef.current, pageCount - 1);

    activeIndexRef.current = nextIndex;
    physicalIndexRef.current = cloneCount + nextIndex;
    normalizationTargetRef.current = null;
    isTransitioningRef.current = false;
    window.clearTimeout(safetyTimerRef.current);
    setActiveIndex(nextIndex);

    measure();
    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(safetyTimerRef.current);
      observer.disconnect();
    };
  }, [cloneCount, itemCount, measure, pageCount, resetKey]);

  const handlePointerDown = useCallback((event) => {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  }, []);

  const handlePointerUp = useCallback((event) => {
    const pointer = pointerRef.current;
    pointerRef.current = null;
    if (!pointer || pointer.id !== event.pointerId) return;

    const deltaX = event.clientX - pointer.startX;
    const deltaY = event.clientY - pointer.startY;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.15;

    if (!isHorizontalSwipe) return;
    suppressClickRef.current = true;
    move(deltaX < 0 ? 1 : -1);
    window.requestAnimationFrame(() => {
      suppressClickRef.current = false;
    });
  }, [move]);

  const handlePointerCancel = useCallback(() => {
    pointerRef.current = null;
  }, []);

  const handleClickCapture = useCallback((event) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }, []);

  const handleTransitionEnd = useCallback((event) => {
    if (event.target === trackRef.current && event.propertyName === "transform") {
      finishTransition();
    }
  }, [finishTransition]);

  return {
    activeIndex,
    goTo,
    next: () => move(1),
    pageCount,
    previous: () => move(-1),
    slides,
    trackRef,
    viewportRef,
    handleClickCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerUp,
    handleTransitionEnd,
  };
}

export default useManualCarousel;
