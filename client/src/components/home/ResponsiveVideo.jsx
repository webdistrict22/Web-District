import { useEffect, useRef, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";

const videoFamilies = {
  mobile: {
    webm: "/videos/match-cut-mobile.webm",
    mp4: "/videos/match-cut-mobile.mp4",
    poster: "/videos/match-cut-mobile-poster.webp",
    width: 1080,
    height: 1920,
  },
  desktop: {
    webm: "/videos/match-cut-desktop.webm",
    mp4: "/videos/match-cut-desktop.mp4",
    poster: "/videos/match-cut-desktop-poster.webp",
    width: 1920,
    height: 1080,
  },
};

function ResponsiveVideo() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const familyName = isMobile ? "mobile" : "desktop";
  const family = videoFamilies[familyName];
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [loadedFamily, setLoadedFamily] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const canLoad = loadedFamily === familyName;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadedFamily(familyName);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "500px 0px", threshold: 0 },
    );
    preloadObserver.observe(section);
    return () => preloadObserver.disconnect();
  }, [familyName, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    visibilityObserver.observe(section);
    return () => visibilityObserver.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canLoad || reducedMotion) return undefined;

    const syncPlayback = () => {
      if (isVisible && document.visibilityState === "visible") {
        const playPromise = video.play();
        playPromise?.catch(() => undefined);
      } else {
        video.pause();
      }
    };

    document.addEventListener("visibilitychange", syncPlayback);
    video.addEventListener("canplay", syncPlayback);
    syncPlayback();

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      video.removeEventListener("canplay", syncPlayback);
      video.pause();
    };
  }, [canLoad, familyName, isVisible, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={`wd-responsive-video wd-responsive-video--${familyName}`}
      aria-label="Web District showcase video"
    >
      {reducedMotion ? (
        <img
          src={family.poster}
          width={family.width}
          height={family.height}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <video
          key={familyName}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={family.poster}
          width={family.width}
          height={family.height}
          aria-hidden="true"
          tabIndex="-1"
          disablePictureInPicture
        >
          {canLoad ? (
            <>
              <source src={family.webm} type="video/webm" />
              <source src={family.mp4} type="video/mp4" />
            </>
          ) : null}
        </video>
      )}
    </section>
  );
}

export default ResponsiveVideo;
