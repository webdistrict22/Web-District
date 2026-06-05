import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";

function ReviewsPreview() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/reviews/public");

      setReviews(data.reviews || []);
    } catch (error) {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const displayReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  return (
    <section className="wd-section-black pt-0 pb-20 md:pt-2 md:pb-24">
      <Container>
        <div className="mb-8 flex justify-center">
          <Button to="/start" className="w-full md:w-[360px] lg:w-[420px]">
            {t("common.buttons.startProject")}
          </Button>
        </div>

        <div className="mb-10">
          <SectionHeader
            eyebrow={t("home.reviews.eyebrow")}
            title={t("home.reviews.title")}
            description={t("home.reviews.description")}
          />
        </div>

        {isLoading ? (
          <Card className="p-6">
            <p className="text-[#D9D4CC]">{t("home.reviews.loading")}</p>
          </Card>
        ) : !displayReviews.length ? (
          <Card className="p-6">
            <p className="text-[#F8F7F4]">{t("home.reviews.emptyTitle")}</p>
            <p className="mt-2 text-sm text-[#D9D4CC]">
              {t("home.reviews.emptyDescription")}
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {displayReviews.map((review, index) => (
              <Card key={review._id || index} className="p-6">
                <div className="mb-5 inline-flex rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#F8F7F4]">
                  {t("home.reviews.rating")} {review.rating || 5}/5
                </div>

                <p className="leading-7 text-[#D9D4CC]">"{review.message}"</p>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-[#F8F7F4]">{review.name}</p>
                  <p className="text-sm text-[#D9D4CC]">
                    {review.role || t("home.reviews.client")}
                    {review.businessName ? ` - ${review.businessName}` : ""}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default ReviewsPreview;
