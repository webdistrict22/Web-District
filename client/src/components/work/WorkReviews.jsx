import { useMemo, useState } from "react";
import { getPublicReviews } from "../../lib/publicContentApi";
import Container from "../common/Container";
import useInitialLoad from "../../hooks/useInitialLoad";
import useLanguage from "../../hooks/useLanguage";
import WorkCollection from "./WorkCollection";

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

const hasArabicText = (value = "") => /[\u0600-\u06ff]/.test(value);

function WorkReviewCard({ review, duplicate = false }) {
  const logo = getLogo(review.businessName);
  const rating = Math.max(1, Math.min(5, review.rating || 5));
  const isArabicReview = hasArabicText(review.message);

  return (
    <article
      className="wd-work-review-card"
      dir={isArabicReview ? "rtl" : "ltr"}
      aria-hidden={duplicate || undefined}
    >
      <div className="wd-work-review-card__stars" aria-label={`${rating} out of 5 stars`}>
        <span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
      </div>
      <p className="wd-work-review-card__message">{review.message}</p>
      <footer>
        <span className="wd-work-review-card__logo" aria-hidden="true">
          {logo ? <img src={logo} alt="" loading="lazy" decoding="async" /> : getInitials(review.name)}
        </span>
        <span>
          <strong>{review.name}</strong>
          <small dir="ltr">
            {review.role || "Client"}
            {review.businessName ? ` · ${review.businessName}` : ""}
          </small>
        </span>
      </footer>
    </article>
  );
}

function WorkReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { effectiveLanguage, t } = useLanguage();

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
  const displayReviews = useMemo(() => reviews.filter(Boolean), [reviews]);

  if (isLoading || !displayReviews.length) return null;

  return (
    <section className="wd-work-reviews" aria-labelledby="work-reviews-title">
      <Container>
        <header className="wd-work-section-heading wd-work-section-heading--light">
          <p className="wd-work-eyebrow">{t("home.reviews.eyebrow")}</p>
          <h2 id="work-reviews-title" className="font-display">{t("home.reviews.title")}</h2>
          <p>{t("home.reviews.description")}</p>
        </header>

        <WorkCollection
          items={displayReviews}
          getKey={(review, index) => review._id || `${review.name}-${index}`}
          renderItem={(review, options) => <WorkReviewCard review={review} {...options} />}
          ariaLabel={t("home.reviews.eyebrow")}
          previousLabel={t("work.reviews.previousAria")}
          nextLabel={t("work.reviews.nextAria")}
          resetKey={effectiveLanguage}
          tone="light"
        />
      </Container>
    </section>
  );
}

export default WorkReviews;
