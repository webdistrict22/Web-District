import { useEffect, useMemo, useRef, useState } from "react";
import { getPublicReviews } from "../../lib/publicContentApi";
import Container from "../common/Container";
import SeamlessLoop from "../common/SeamlessLoop";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

const byJojoLogo = "/images/brands-logos/byjojo-logo.webp";

const brandLogos = [
  ["zohour", "/images/brands-logos/zohour-logo.webp"],
  ["s8", "/images/brands-logos/s8-logo.webp"],
  ["atheer", "/images/brands-logos/atheer-logo.webp"],
  ["akm", "/images/brands-logos/akm-logo.webp"],
  ["davinto", "/images/brands-logos/davinto-logo.webp"],
  ["travco", "/images/brands-logos/travco-logo.webp"],
  ["freshcart", "/images/brands-logos/freshcart-logo.webp"],
  ["fresh cart", "/images/brands-logos/freshcart-logo.webp"],
  ["salah", "/images/brands-logos/salahframe-logo.webp"],
  ["ms store", "/images/brands-logos/ms-logo.webp"],
  ["darb", "/images/brands-logos/darb-logo.webp"],
  ["wish a mesh", "/images/brands-logos/wam-logo.webp"],
  ["wam", "/images/brands-logos/wam-logo.webp"],
  ["burn gym", "/images/brands-logos/burngym-logo.webp"],
];

const getLogo = (brand = "") => {
  const normalized = brand.toLowerCase().trim();
  if (normalized.replace(/\s+/g, "") === "byjojo") {
    return byJojoLogo;
  }
  return brandLogos.find(([key]) => normalized.includes(key))?.[1] || "";
};

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function ReviewCard({ review, duplicate = false, isArabic }) {
  const logo = getLogo(review.businessName);
  const rating = Math.max(1, Math.min(5, review.rating || 5));

  return (
    <article
      className="wd-review-card"
      dir={isArabic ? "rtl" : "ltr"}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : 0}
    >
      <div className="wd-review-card__stars" aria-label={`${rating} out of 5 stars`}>
        <span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
      </div>
      <p className="wd-review-card__message">{review.message}</p>
      <footer>
        <span className="wd-review-card__avatar" aria-hidden="true">
          {logo ? <img src={logo} alt="" loading="lazy" /> : getInitials(review.name)}
        </span>
        <span>
          <strong>{review.name}</strong>
          <small>
            {review.role || "Client"}
            {review.businessName ? ` · ${review.businessName}` : ""}
          </small>
        </span>
      </footer>
    </article>
  );
}

function ReviewsPreview() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const { effectiveLanguage, isArabic, t } = useLanguage();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setReviews(await getPublicReviews());
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchReviews);

  useEffect(() => {
    if (!isPaused) return undefined;
    const resumeOutside = (event) => {
      if (
        window.matchMedia("(hover: none)").matches &&
        !event.target.closest?.(".wd-review-card")
      ) {
        setIsPaused(false);
      }
    };
    document.addEventListener("pointerdown", resumeOutside);
    return () => document.removeEventListener("pointerdown", resumeOutside);
  }, [isPaused]);

  const displayReviews = useMemo(() => reviews.filter(Boolean), [reviews]);
  if (isLoading || !displayReviews.length) return null;

  return (
    <section
      ref={sectionRef}
      className="wd-reviews-preview"
      aria-labelledby="reviews-preview-title"
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <Container>
        <div className="wd-reviews-heading">
          <div>
            <p className="wd-home-eyebrow">{t("home.reviews.eyebrow")}</p>
            <h2 id="reviews-preview-title" className="font-display">{t("home.reviews.title")}</h2>
            <p>{t("home.reviews.description")}</p>
          </div>
        </div>
      </Container>

      <SeamlessLoop
        key={effectiveLanguage}
        items={displayReviews}
        direction="left-to-right"
        duration={38}
        paused={isPaused}
        className={`wd-reviews-marquee${isPaused ? " is-paused" : ""}`}
        trackClassName="wd-reviews-track"
        setClassName="wd-reviews-set"
        onClick={(event) => {
          if (event.target.closest(".wd-review-card") && window.matchMedia("(hover: none)").matches) {
            setIsPaused(true);
          }
        }}
        renderItem={(review, { hidden, itemIndex, repeatIndex }) => (
          <ReviewCard
            key={`${review._id || itemIndex}-${repeatIndex}`}
            review={review}
            duplicate={hidden}
            isArabic={isArabic}
          />
        )}
      />
    </section>
  );
}

export default ReviewsPreview;
