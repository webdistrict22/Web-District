import { useState } from "react";
import useLanguage from "../../hooks/useLanguage";

const logoSrc = "/images/logo/web-district-logo.webp";

function BrandLogo({ size = "md", showText = true }) {
  const [isFailed, setIsFailed] = useState(false);
  const { t } = useLanguage();

  const imageSize = size === "lg" ? "h-16 w-28" : "h-12 w-24";

  return (
    <span className="flex items-center gap-3">
      <span
        className={`relative flex ${imageSize} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#C4A77D]/25 bg-[#080808]/88`}
      >
        {!isFailed ? (
          <img
            src={logoSrc}
            alt="Web District"
            width={size === "lg" ? 112 : 96}
            height={size === "lg" ? 64 : 48}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={() => setIsFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-sm font-black tracking-[-0.08em] text-[#F8F7F4]">
            WD
          </span>
        )}
      </span>

      {showText && (
        <span className="hidden sm:block">
          <span className="block font-display text-lg font-bold tracking-[-0.04em] text-[#F8F7F4]">
            Web District
          </span>
          <span className="block text-xs text-[#D9D4CC]">
            {t("brand.tagline")}
          </span>
        </span>
      )}
    </span>
  );
}

export default BrandLogo;
