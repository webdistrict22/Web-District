import { useEffect, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";

const welcomeStorageKey = "webDistrictWelcomeSeen";
const logoSrc = "/images/logo/web-district-logo.webp";

let runtimeWelcomeSeen = false;

function canUseSessionStorage() {
  try {
    if (typeof window === "undefined") return false;
    const testKey = "__wd_welcome_test__";
    window.sessionStorage.setItem(testKey, "1");
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function shouldShowWelcome() {
  if (typeof window === "undefined") return false;

  if (!canUseSessionStorage()) {
    if (runtimeWelcomeSeen) return false;
    runtimeWelcomeSeen = true;
    return true;
  }

  return window.sessionStorage.getItem(welcomeStorageKey) !== "true";
}

function markWelcomeSeen() {
  runtimeWelcomeSeen = true;

  try {
    window.sessionStorage.setItem(welcomeStorageKey, "true");
  } catch {
    // Session storage can be blocked in private or hardened browser modes.
  }
}

function WelcomeIntro() {
  const [isVisible, setIsVisible] = useState(shouldShowWelcome);
  const [isLeaving, setIsLeaving] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { t } = useLanguage();

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const leaveDelay = prefersReducedMotion ? 300 : 1120;
    const unmountDelay = prefersReducedMotion ? 420 : 1380;

    const leaveTimer = window.setTimeout(() => {
      markWelcomeSeen();
      setIsLeaving(true);
    }, leaveDelay);

    const unmountTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, unmountDelay);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [isVisible, prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      className={`wd-welcome-intro ${isLeaving ? "is-leaving" : ""}`}
      aria-label={t("welcome.aria")}
      role="status"
    >
      <style>
        {`
          .wd-welcome-intro {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background:
              radial-gradient(circle at 50% 42%, rgba(154,116,70,0.25), transparent 25%),
              radial-gradient(circle at 18% 18%, rgba(196,167,125,0.10), transparent 28%),
              linear-gradient(180deg, #0B0B0A 0%, #0B0B0A 52%, #1B1B19 100%);
            color: #F3EEE4;
            opacity: 1;
            transition: opacity 220ms ease, visibility 220ms ease;
          }

          .wd-welcome-intro.is-leaving {
            opacity: 0;
            visibility: hidden;
          }

          .wd-welcome-intro::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(243,238,228,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(243,238,228,0.08) 1px, transparent 1px);
            background-size: 54px 54px;
            opacity: 0.055;
            mask-image: linear-gradient(to bottom, black, transparent 72%);
          }

          .wd-welcome-panel {
            position: relative;
            z-index: 1;
            display: flex;
            width: min(420px, calc(100% - 40px));
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .wd-welcome-logo-wrap {
            position: relative;
            display: flex;
            height: 92px;
            width: 164px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid rgba(196,167,125,0.30);
            border-radius: 22px;
            background: rgba(11,11,10,0.78);
            box-shadow: 0 18px 48px rgba(0,0,0,0.38);
            animation: wdWelcomeLogo 360ms cubic-bezier(.2,.8,.2,1) both;
          }

          .wd-welcome-logo-wrap::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent, rgba(196,167,125,0.16), transparent);
            opacity: 0.7;
          }

          .wd-welcome-logo {
            position: absolute;
            inset: 0;
            z-index: 1;
            height: 100%;
            width: 100%;
            object-fit: cover;
            opacity: 1;
            transition: opacity 160ms ease;
          }

          .wd-welcome-fallback {
            position: relative;
            z-index: 1;
            font-family: "Sora", system-ui, sans-serif;
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #F3EEE4;
          }

          .wd-welcome-logo.is-loading {
            opacity: 0;
          }

          .wd-welcome-title {
            margin: 28px 0 0;
            font-family: "Sora", system-ui, sans-serif;
            font-size: clamp(2rem, 6vw, 3.6rem);
            font-weight: 800;
            letter-spacing: -0.06em;
            line-height: 0.98;
            color: #F3EEE4;
            animation: wdWelcomeText 360ms 80ms cubic-bezier(.2,.8,.2,1) both;
          }

          .wd-welcome-subline {
            margin: 16px 0 0;
            max-width: 34rem;
            font-size: clamp(0.95rem, 2.6vw, 1.08rem);
            line-height: 1.7;
            color: #D6CFC2;
            animation: wdWelcomeText 360ms 140ms cubic-bezier(.2,.8,.2,1) both;
          }

          .wd-welcome-progress {
            position: relative;
            margin-top: 30px;
            height: 1px;
            width: min(260px, 74vw);
            overflow: hidden;
            border-radius: 999px;
            background: rgba(243,238,228,0.12);
            animation: wdWelcomeText 260ms 180ms ease both;
          }

          .wd-welcome-progress span {
            display: block;
            height: 100%;
            width: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, transparent, #C4A77D, #9A7446, transparent);
            transform-origin: left;
            animation: wdWelcomeProgress 980ms 120ms ease both;
          }

          @keyframes wdWelcomeLogo {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.94);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes wdWelcomeText {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes wdWelcomeProgress {
            from {
              transform: scaleX(0);
              opacity: 0.4;
            }
            to {
              transform: scaleX(1);
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .wd-welcome-logo-wrap,
            .wd-welcome-title,
            .wd-welcome-subline,
            .wd-welcome-progress,
            .wd-welcome-progress span {
              animation-duration: 1ms;
              animation-delay: 0ms;
            }

            .wd-welcome-intro {
              transition-duration: 80ms;
            }
          }
        `}
      </style>

      <div className="wd-welcome-panel">
        <div className="wd-welcome-logo-wrap">
          {(!logoLoaded || logoFailed) && (
            <span className="wd-welcome-fallback">Web District</span>
          )}

          {!logoFailed && (
            <img
              src={logoSrc}
              alt="Web District"
              width="164"
              height="92"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={`wd-welcome-logo ${logoLoaded ? "" : "is-loading"}`}
              onLoad={() => setLogoLoaded(true)}
              onError={() => {
                setLogoFailed(true);
                setLogoLoaded(false);
              }}
            />
          )}
        </div>

        <h1 className="wd-welcome-title">{t("welcome.title")}</h1>
        <p className="wd-welcome-subline">
          {t("welcome.subline")}
        </p>

        <div className="wd-welcome-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}

export default WelcomeIntro;
