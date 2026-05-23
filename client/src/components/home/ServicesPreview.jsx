import { CheckCircle2 } from "lucide-react";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";
import { services } from "../../data/siteData";

function ServicesPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="What we build"
            title="Clean websites for different business goals."
            description="Web District is not limited to one niche. We build the website type that fits the business goal."
          />
          <Button to="/services" variant="secondary">
            View services
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C69A4E]/30">
              <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">
                {service.title}
              </h3>
              <p className="mt-4 leading-7 text-[#94A3B8]">{service.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.points.map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <CheckCircle2 size={16} className="text-[#C69A4E]" />
                    {point}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ServicesPreview;