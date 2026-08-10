import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function StaggeredMenu({
  position = "right",
  colors = ["#B497CF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = "",
  logoUrl = "/src/assets/logos/reactbits-gh-white.svg",
  logoAlt = "Logo",
  logoLink = "/",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  accentColor = "#5227FF",
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  openMenuLabel = "Open menu",
  closeMenuLabel = "Close menu",
  headerAriaLabel = "Main navigation header",
  panelAriaLabel = "Mobile navigation",
  reducedMotion = false,
  onLogoClick,
  onMenuOpen,
  onMenuClose,
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElementsRef = useRef([]);
  const openTimelineRef = useRef(null);
  const closeTweenRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll(".sm-prelayer"))
        : [];
      preLayerElementsRef.current = preLayers;
      const offscreen = position === "left" ? -100 : 100;

      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      if (toggleButtonRef.current) {
        gsap.set(toggleButtonRef.current, { color: menuButtonColor });
      }
    });

    return () => context.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElementsRef.current;
    if (!panel) return null;

    openTimelineRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const itemElements = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel"),
    );
    const numberElements = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"),
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));
    const offscreen = position === "left" ? -100 : 100;

    if (reducedMotion) {
      gsap.set([...layers, panel], { xPercent: 0, opacity: 1 });
      gsap.set(itemElements, { yPercent: 0, rotate: 0 });
      gsap.set(numberElements, { "--sm-num-opacity": 1 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 1 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 0, opacity: 1 });
      return gsap.timeline({ paused: true }).to({}, { duration: 0 });
    }

    if (itemElements.length) gsap.set(itemElements, { yPercent: 140, rotate: 10 });
    if (numberElements.length) {
      gsap.set(numberElements, { "--sm-num-opacity": 0 });
    }
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const timeline = gsap.timeline({ paused: true });
    layers.forEach((layer, index) => {
      timeline.fromTo(
        layer,
        { xPercent: offscreen },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        index * 0.07,
      );
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;
    timeline.fromTo(
      panel,
      { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemElements.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.03;
      timeline.to(
        itemElements,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.65,
          ease: "power4.out",
          stagger: { each: 0.045, from: "start" },
        },
        itemsStart,
      );
      if (numberElements.length) {
        timeline.to(
          numberElements,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        timeline.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart,
        );
      }
      if (socialLinks.length) {
        timeline.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04,
        );
      }
    }

    openTimelineRef.current = timeline;
    return timeline;
  }, [position, reducedMotion]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const timeline = buildOpenTimeline();
    if (!timeline) {
      busyRef.current = false;
      return;
    }
    timeline.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    timeline.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTimelineRef.current?.kill();
    openTimelineRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElementsRef.current;
    if (!panel) return;
    const allElements = [...layers, panel];
    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to(allElements, {
      xPercent: offscreen,
      duration: reducedMotion ? 0 : 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemElements = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel"),
        );
        const numberElements = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item",
          ),
        );
        if (itemElements.length && !reducedMotion) {
          gsap.set(itemElements, { yPercent: 140, rotate: 10 });
        }
        if (numberElements.length) {
          gsap.set(numberElements, { "--sm-num-opacity": 0 });
        }
        busyRef.current = false;
      },
    });
  }, [position, reducedMotion]);

  const animateColor = useCallback(
    (opening) => {
      const button = toggleButtonRef.current;
      if (!button) return;
      colorTweenRef.current?.kill();
      const targetColor =
        changeMenuColorOnOpen && opening
          ? openMenuButtonColor
          : menuButtonColor;
      colorTweenRef.current = gsap.to(button, {
        color: targetColor,
        delay: reducedMotion ? 0 : 0.18,
        duration: reducedMotion ? 0 : 0.3,
        ease: "power2.out",
      });
    },
    [
      changeMenuColorOnOpen,
      menuButtonColor,
      openMenuButtonColor,
      reducedMotion,
    ],
  );

  useEffect(() => {
    if (!toggleButtonRef.current) return;
    gsap.set(toggleButtonRef.current, {
      color:
        changeMenuColorOnOpen && openRef.current
          ? openMenuButtonColor
          : menuButtonColor,
    });
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateColor(false);
  }, [animateColor, onMenuClose, playClose]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    if (target) previouslyFocusedRef.current = document.activeElement;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateColor(target);
  }, [
    animateColor,
    onMenuClose,
    onMenuOpen,
    playClose,
    playOpen,
  ]);

  useEffect(() => {
    if (!closeOnClickAway || !open) return undefined;
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu, closeOnClickAway, open]);

  useEffect(() => {
    if (!open) {
      if (previouslyFocusedRef.current) {
        window.requestAnimationFrame(() => {
          const focusTarget = toggleButtonRef.current || previouslyFocusedRef.current;
          focusTarget?.focus?.();
          previouslyFocusedRef.current = null;
        });
      }
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector(focusableSelector)?.focus();
    }, reducedMotion ? 0 : 150);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = [
        ...(panelRef.current?.querySelectorAll(focusableSelector) || []),
        toggleButtonRef.current,
      ].filter(Boolean);
      if (!focusableElements.length) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [closeMenu, open, reducedMotion]);

  useEffect(
    () => () => {
      openTimelineRef.current?.kill();
      closeTweenRef.current?.kill();
      colorTweenRef.current?.kill();
      itemEntranceTweenRef.current?.kill();
      document.body.style.overflow = "";
    },
    [],
  );

  const layerColors = (() => {
    const raw = colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
    const result = [...raw];
    if (result.length >= 3) result.splice(Math.floor(result.length / 2), 1);
    return result;
  })();

  return (
    <div
      className={`wd-staggered-menu staggered-menu-wrapper${
        isFixed ? " fixed-wrapper" : ""
      } ${className}`.trim()}
      style={accentColor ? { "--sm-accent": accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {layerColors.map((color) => (
          <div key={color} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>

      <header className="staggered-menu-header" aria-label={headerAriaLabel}>
        <a
          href={logoLink}
          className="sm-logo"
          aria-label="Web District"
          onClick={onLogoClick}
        >
          <img
            src={logoUrl}
            alt={logoAlt}
            className="sm-logo-img"
            draggable={false}
            width={96}
            height={48}
          />
        </a>
        <button
          ref={toggleButtonRef}
          className="sm-toggle"
          aria-label={open ? closeMenuLabel : openMenuLabel}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span className="sm-icon" aria-hidden="true">
            <span className="sm-icon-line sm-icon-line--top" />
            <span className="sm-icon-line sm-icon-line--middle" />
            <span className="sm-icon-line sm-icon-line--bottom" />
          </span>
        </button>
      </header>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label={panelAriaLabel}
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <div className="sm-panel-inner">
          <ul
            className="sm-panel-list"
            role="list"
            data-numbering={displayItemNumbering || undefined}
          >
            {items.length ? (
              items.map((item, index) => (
                <li
                  className={`sm-panel-itemWrap${
                    item.variant ? ` sm-panel-itemWrap--${item.variant}` : ""
                  }`}
                  key={`${item.label}-${item.link}`}
                >
                  <a
                    className={`sm-panel-item${item.active ? " is-active" : ""}`}
                    href={item.link}
                    aria-label={item.ariaLabel}
                    aria-current={item.active ? "page" : undefined}
                    data-index={index + 1}
                    onClick={(event) => {
                      item.onSelect?.(event);
                      closeMenu();
                    }}
                  >
                    <span className="sm-panel-itemLabel">{item.label}</span>
                  </a>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems.length ? (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((socialItem) => (
                  <li key={socialItem.link} className="sm-socials-item">
                    <a
                      href={socialItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                    >
                      {socialItem.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export default StaggeredMenu;
