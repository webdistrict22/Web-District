import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";

function ReviewsPreview() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
            Start Your Project
          </Button>
        </div>

        <div className="mb-10">
          <SectionHeader
            eyebrow="Reviews"
            title="Our clients words."
            description="A word from clients who worked with Web District."
          />
        </div>

        {isLoading ? (
          <Card className="p-6">
            <p className="text-[#D9D4CC]">Loading reviews...</p>
          </Card>
        ) : !displayReviews.length ? (
          <Card className="p-6">
            <p className="text-[#F8F7F4]">No approved reviews yet.</p>
            <p className="mt-2 text-sm text-[#D9D4CC]">
              Approved reviews will appear here after they are added or
              submitted by clients.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {displayReviews.map((review, index) => (
              <Card key={review._id || index} className="p-6">
                <div className="mb-5 inline-flex rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#F8F7F4]">
                  Rating {review.rating || 5}/5
                </div>

                <p className="leading-7 text-[#D9D4CC]">"{review.message}"</p>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-[#F8F7F4]">{review.name}</p>
                  <p className="text-sm text-[#D9D4CC]">
                    {review.role || "Client"}
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
