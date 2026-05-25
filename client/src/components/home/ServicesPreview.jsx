import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import api from "../../lib/axios";
import { truncateText } from "../../lib/helpers";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";

const serviceBlueprints = [
  {
    title: "Online Stores",
    match: ["online", "store", "ecommerce", "e-commerce"],
    description: "Product websites built to make browsing and buying feel clear.",
    points: ["Product pages", "Cart direction", "Mobile checkout"],
  },
  {
    title: "Business Websites",
    match: ["business", "company", "companies"],
    description: "Professional websites that explain the business fast.",
    points: ["Clear pages", "Lead forms", "Trust sections"],
  },
  {
    title: "Landing Pages",
    match: ["landing", "campaign"],
    description: "Focused pages for launches, offers, ads, and lead capture.",
    points: ["Sharp message", "Strong CTA", "Fast mobile flow"],
  },
  {
    title: "Custom Websites",
    match: ["custom", "system", "portal"],
    description: "Tailored web builds for workflows that need more than pages.",
    points: ["Custom logic", "Dashboards", "Booking flows"],
  },
];

const findPackage = (packages, matchTerms) =>
  packages.find((item) => {
    const text = `${item.name || ""} ${item.websiteType || ""}`.toLowerCase();
    return matchTerms.some((term) => text.includes(term));
  });

function ServicesPreview() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/packages/public");

      setPackages(data.packages || []);
    } catch (error) {
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const displayItems = useMemo(() => {
    return serviceBlueprints.map((service) => {
      const packageItem = findPackage(packages, service.match);
      const description = packageItem?.shortDescription || service.description;
      const points = packageItem?.features?.length ? packageItem.features : service.points;

      return {
        title: service.title,
        description: truncateText(description, 105),
        points: points.slice(0, 3),
        priceLabel: packageItem?.priceLabel,
      };
    });
  }, [packages]);

  return (
    <section className="wd-section-black py-16 md:py-20">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="What we build"
            title="Four clear website directions."
            description="Pick the direction that matches the goal. We keep the structure clean from there."
          />
          <Button to="/services" variant="secondary">
            View services
          </Button>
        </div>

        {isLoading ? (
          <Card className="wd-card-on-black p-6">
            <p className="text-[#D9D4CC]">Loading website options...</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayItems.map((item, index) => (
              <Card
                key={item.title}
                className="wd-card-on-black flex min-h-[300px] flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/30"
              >
                <p className="font-display text-sm font-bold text-[#C4A77D]">
                  0{index + 1}
                </p>

                <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.04em]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#D9D4CC]">
                  {item.description}
                </p>

                <div className="mt-6 grid gap-3">
                  {item.points.map((point) => (
                    <div key={point} className="flex gap-2 text-sm text-[#D9D4CC]">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#C4A77D]"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {item.priceLabel && (
                  <p className="mt-auto pt-5 text-sm font-semibold text-[#F8F7F4]">
                    {item.priceLabel}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default ServicesPreview;
