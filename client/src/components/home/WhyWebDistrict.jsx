import { CheckCircle2 } from "lucide-react";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import { whyPoints } from "../../data/siteData";

function WhyWebDistrict() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow="Why Web District"
            title="Premium, practical, and built around the business goal."
            description="A good website is not just about looking nice. It should make the business easier to understand, easier to trust, and easier to contact."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {whyPoints.map((point) => (
              <Card key={point} className="flex items-center gap-3 p-5">
                <CheckCircle2 size={20} className="text-[#C69A4E]" />
                <p className="font-medium text-[#F5F8FC]">{point}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default WhyWebDistrict;