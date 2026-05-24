import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";

const fallbackReviews = [
  {
    name: "Client Name",
    businessName: "Business Owner",
    role: "Founder",
    rating: 5,
    message:
      "Web District gave the website a clean, serious direction and made the process easier to understand.",
  },
  {
    name: "Client Name",
    businessName: "Brand Owner",
    role: "Owner",
    rating: 5,
    message:
      "The process felt clear from the beginning, and the website direction helped the business look more professional.",
  },
  {
    name: "Client Name",
    businessName: "Service Business",
    role: "Manager",
    rating: 5,
    message:
      "Clean design, easy communication, and a website structure that actually matched what the business needed.",
  },
];

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

  const displayReviews = useMemo(() => {
    return reviews.length ? reviews.slice(0, 3) : fallbackReviews;
  }, [reviews]);

  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Testimonials"
            title="What clients say"
            description="Approved reviews and testimonials that show how Web District helps businesses look more serious online."
          />

          <Button to="/start" variant="secondary">
            Start your website
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-6">
            <p className="text-[#94A3B8]">Loading reviews...</p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {displayReviews.map((review, index) => (
              <Card key={review._id || index} className="p-6">
                <div className="mb-5 flex gap-1 text-[#C69A4E]">
                  {"★".repeat(review.rating || 5)}
                  {"☆".repeat(5 - (review.rating || 5))}
                </div>

                <p className="leading-7 text-[#CBD5E1]">“{review.message}”</p>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{review.name}</p>
                  <p className="text-sm text-[#94A3B8]">
                    {review.role || "Client"}
                    {review.businessName ? ` — ${review.businessName}` : ""}
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