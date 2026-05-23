import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";

function ReviewsPreview() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Testimonials"
          title="What clients say"
          description="This section will later show approved reviews from real clients and manually added testimonials from the admin dashboard."
          center
          className="mb-10"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="p-6">
              <div className="mb-5 flex gap-1 text-[#C69A4E]">★★★★★</div>
              <p className="leading-7 text-[#CBD5E1]">
                “Web District gave the website a clean, serious direction and made the process easier to understand.”
              </p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-semibold text-white">Client Name</p>
                <p className="text-sm text-[#94A3B8]">Business Owner</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ReviewsPreview;