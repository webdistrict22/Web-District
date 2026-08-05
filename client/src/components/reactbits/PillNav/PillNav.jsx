import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import "./PillNav.css";

const canUsePointerHover = () =>
  window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;

const itemIsActive = (activeHref, href) =>
  href === "/"
    ? activeHref === "/"
    : activeHref === href || activeHref.startsWith(`${href}/`);

function PillNav({
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  initialLoadAnimation = true,
}) {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const circleRefs = useRef([]);
  const timelineRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const navItemsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const timelines = timelineRefs.current;
    const activeTweens = activeTweenRefs.current;

    const layout = () => {
      if (!isMounted) return;

      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const { width, height } = pill.getBoundingClientRect();
        const radius = ((width * width) / 4 + height * height) / (2 * height);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta =
          Math.ceil(
            radius -
              Math.sqrt(Math.max(0, radius * radius - (width * width) / 4)),
          ) + 1;
        const originY = diameter - delta;
        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;
        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });
        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(height + 100), opacity: 0 });
        }

        timelineRefs.current[index]?.kill();
        const timeline = gsap.timeline({ paused: true });
        timeline.to(
          circle,
          {
            scale: 1.2,
            xPercent: -50,
            duration: 2,
            ease,
            overwrite: "auto",
          },
          0,
        );
        if (label) {
          timeline.to(
            label,
            {
              y: -(height + 8),
              duration: 2,
              ease,
              overwrite: "auto",
            },
            0,
          );
        }
        if (hoverLabel) {
          timeline.to(
            hoverLabel,
            {
              y: 0,
              opacity: 1,
              duration: 2,
              ease,
              overwrite: "auto",
            },
            0,
          );
        }
        timelineRefs.current[index] = timeline;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout).catch(() => {});

    if (initialLoadAnimation && navItemsRef.current) {
      gsap.set(navItemsRef.current, { width: 0, overflow: "hidden" });
      gsap.to(navItemsRef.current, { width: "auto", duration: 0.6, ease });
    }

    return () => {
      isMounted = false;
      window.removeEventListener("resize", layout);
      timelines.forEach((timeline) => timeline?.kill());
      activeTweens.forEach((tween) => tween?.kill());
    };
  }, [ease, initialLoadAnimation, items]);

  useEffect(() => {
    items.forEach((item, index) => {
      if (!itemIsActive(activeHref, item.href)) return;
      activeTweenRefs.current[index]?.kill();
      timelineRefs.current[index]?.progress(0).pause();
    });
  }, [activeHref, items]);

  const handleEnter = (index, isActive, isPointerEvent = false) => {
    const timeline = timelineRefs.current[index];
    if (!timeline) return;
    if (isPointerEvent && !canUsePointerHover()) return;

    if (isActive) {
      activeTweenRefs.current[index]?.kill();
      timeline.progress(0).pause();
      return;
    }

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = timeline.tweenTo(timeline.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (index, isActive, isPointerEvent = false) => {
    const timeline = timelineRefs.current[index];
    if (!timeline) return;
    if (isPointerEvent && !canUsePointerHover()) return;

    if (isActive) {
      activeTweenRefs.current[index]?.kill();
      timeline.progress(0).pause();
      return;
    }

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor,
  };

  return (
    <div className="wd-pill-nav-container">
      <nav
        className={`wd-pill-nav ${className}`}
        aria-label="Primary navigation routes"
        style={cssVars}
      >
        <div className="pill-nav-items" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, index) => {
              const isActive = itemIsActive(activeHref, item.href);

              return (
                <li key={item.href} role="none">
                  <Link
                    role="menuitem"
                    to={item.href}
                    className={`pill${isActive ? " is-active" : ""}`}
                    aria-label={item.ariaLabel || item.label}
                    aria-current={isActive ? "page" : undefined}
                    onClick={item.onSelect}
                    onMouseEnter={() => handleEnter(index, isActive, true)}
                    onMouseLeave={() => handleLeave(index, isActive, true)}
                    onFocus={() => handleEnter(index, isActive)}
                    onBlur={() => handleLeave(index, isActive)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={(element) => {
                        circleRefs.current[index] = element;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default PillNav;
