import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  FaArrowTrendUp,
  FaBagShopping,
  FaBed,
  FaBoxOpen,
  FaCalendarDays,
  FaCarrot,
  FaCartShopping,
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaCreditCard,
  FaEnvelopeOpenText,
  FaGears,
  FaGift,
  FaGlobe,
  FaHouse,
  FaImage,
  FaIndustry,
  FaLayerGroup,
  FaLeaf,
  FaLocationDot,
  FaMagnifyingGlass,
  FaMobileScreenButton,
  FaPlane,
  FaReceipt,
  FaRotate,
  FaRulerCombined,
  FaShieldHalved,
  FaShirt,
  FaSliders,
  FaStore,
  FaSuitcaseRolling,
  FaTruckFast,
  FaUser,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import {
  GiBilledCap,
  GiFlowerEmblem,
  GiPerfumeBottle,
  GiRolledCloth,
} from "react-icons/gi";
import "./LogoLoop.css";

const symbolIcons = {
  account: FaUser,
  analytics: FaChartLine,
  bag: FaBagShopping,
  bed: FaBed,
  booking: FaCalendarDays,
  browser: FaStore,
  bundle: FaGift,
  calendar: FaCalendarDays,
  cap: GiBilledCap,
  cart: FaCartShopping,
  categories: FaMagnifyingGlass,
  clothing: FaShirt,
  dashboard: FaChartPie,
  delivery: FaTruckFast,
  fabric: GiRolledCloth,
  factory: FaIndustry,
  flower: GiFlowerEmblem,
  frame: FaImage,
  freshProduce: FaCarrot,
  globe: FaGlobe,
  growth: FaArrowTrendUp,
  home: FaHouse,
  inquiry: FaEnvelopeOpenText,
  layers: FaLayerGroup,
  leaf: FaLeaf,
  location: FaLocationDot,
  luggage: FaSuitcaseRolling,
  management: FaGears,
  mobileShopping: FaMobileScreenButton,
  orders: FaReceipt,
  package: FaBoxOpen,
  payment: FaCreditCard,
  perfume: GiPerfumeBottle,
  plane: FaPlane,
  productionRequest: FaClipboardList,
  repeatPurchase: FaRotate,
  secureCheckout: FaShieldHalved,
  shirt: FaShirt,
  sliders: FaSliders,
  sparkle: FaWandMagicSparkles,
  storefront: FaStore,
  variants: FaRulerCombined,
};

function LoopItem({ symbol, itemKey }) {
  const Icon = symbolIcons[symbol];
  if (!Icon) return null;

  return (
    <span className="wd-logo-loop__item" aria-hidden="true" key={itemKey}>
      <Icon />
    </span>
  );
}

function LogoLoop({ items = [], ariaLabel }) {
  const viewportRef = useRef(null);
  const firstSequenceRef = useRef(null);
  const frameRef = useRef(0);
  const [repeatCount, setRepeatCount] = useState(1);
  const [groupWidth, setGroupWidth] = useState(0);

  const measure = useCallback(() => {
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const viewportWidth = viewportRef.current?.getBoundingClientRect().width || 0;
      const sequenceWidth = firstSequenceRef.current?.getBoundingClientRect().width || 0;

      if (!viewportWidth || !sequenceWidth) return;

      const nextRepeatCount = Math.max(
        1,
        Math.ceil((viewportWidth + 1) / sequenceWidth),
      );
      const nextGroupWidth = sequenceWidth * nextRepeatCount;

      setRepeatCount((current) =>
        current === nextRepeatCount ? current : nextRepeatCount,
      );
      setGroupWidth((current) =>
        Math.abs(current - nextGroupWidth) < 0.5 ? current : nextGroupWidth,
      );
    });
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const firstSequence = firstSequenceRef.current;
    const observer = new ResizeObserver(measure);

    if (viewport) observer.observe(viewport);
    if (firstSequence) observer.observe(firstSequence);

    measure();
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener?.("loadingdone", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [items, measure]);

  if (!items.length) return null;

  const renderSequence = (groupIndex, repeatIndex) => (
    <div
      className="wd-logo-loop__sequence"
      ref={groupIndex === 0 && repeatIndex === 0 ? firstSequenceRef : undefined}
      key={`${groupIndex}-${repeatIndex}`}
      aria-hidden="true"
    >
      {items.map((symbol, itemIndex) => (
        <LoopItem
          symbol={symbol}
          itemKey={`${groupIndex}-${repeatIndex}-${symbol}-${itemIndex}`}
          key={`${symbol}-${itemIndex}`}
        />
      ))}
    </div>
  );

  return (
    <div
      ref={viewportRef}
      className="wd-logo-loop"
      dir="ltr"
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className="wd-logo-loop__track"
        data-ready={groupWidth > 0 || undefined}
        style={{ "--wd-logo-loop-distance": `${groupWidth}px` }}
      >
        {[0, 1].map((groupIndex) => (
          <div className="wd-logo-loop__group" aria-hidden="true" key={groupIndex}>
            {Array.from({ length: repeatCount }, (_, repeatIndex) =>
              renderSequence(groupIndex, repeatIndex),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoLoop;
