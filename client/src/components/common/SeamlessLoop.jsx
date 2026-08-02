import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function SeamlessLoop({
  items,
  renderItem,
  className = "",
  trackClassName = "",
  groupClassName = "",
  setClassName = "",
  direction,
  duration = 30,
  paused = false,
  onClick,
  viewportWidthGroups = false,
}) {
  const viewportRef = useRef(null);
  const firstSetRef = useRef(null);
  const frameRef = useRef(0);
  const [repeatCount, setRepeatCount] = useState(1);
  const [groupWidth, setGroupWidth] = useState(0);

  const measure = useCallback(() => {
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const viewportWidth = viewportRef.current?.getBoundingClientRect().width || 0;
      const setWidth = firstSetRef.current?.getBoundingClientRect().width || 0;
      if (!viewportWidth || !setWidth) return;

      const nextRepeatCount = viewportWidthGroups
        ? 1
        : Math.max(1, Math.ceil((viewportWidth + 1) / setWidth));
      const nextGroupWidth = viewportWidthGroups
        ? viewportWidth
        : setWidth * nextRepeatCount;
      setRepeatCount((current) =>
        current === nextRepeatCount ? current : nextRepeatCount,
      );
      setGroupWidth((current) =>
        Math.abs(current - nextGroupWidth) < 0.5 ? current : nextGroupWidth,
      );
    });
  }, [viewportWidthGroups]);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(measure);
    const viewport = viewportRef.current;
    const firstSet = firstSetRef.current;
    if (viewport) observer.observe(viewport);
    if (firstSet) observer.observe(firstSet);

    measure();
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener?.("loadingdone", measure);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", measure);
      window.removeEventListener("resize", measure);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [items, measure]);

  const renderSet = (groupIndex, repeatIndex) => (
    <div
      key={`${groupIndex}-${repeatIndex}`}
      ref={groupIndex === 0 && repeatIndex === 0 ? firstSetRef : undefined}
      className={`wd-seamless-loop__set ${setClassName}`.trim()}
      aria-hidden={groupIndex === 1 || repeatIndex > 0 || undefined}
    >
      {items.map((item, itemIndex) =>
        renderItem(item, {
          hidden: groupIndex === 1 || repeatIndex > 0,
          itemIndex,
          repeatIndex,
        }),
      )}
    </div>
  );

  return (
    <div
      ref={viewportRef}
      className={`wd-seamless-loop ${className}`.trim()}
      dir="ltr"
      onClick={onClick}
    >
      <div
        className={`wd-seamless-loop__track ${trackClassName}${paused ? " is-paused" : ""}`.trim()}
        data-direction={direction}
        data-ready={groupWidth > 0 || undefined}
        style={{
          "--wd-loop-distance": `${groupWidth}px`,
          "--wd-loop-duration": `${duration}s`,
        }}
      >
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            className={`wd-seamless-loop__group ${groupClassName}`.trim()}
            aria-hidden={groupIndex === 1 || undefined}
          >
            {Array.from({ length: repeatCount }, (_, repeatIndex) =>
              renderSet(groupIndex, repeatIndex),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeamlessLoop;
