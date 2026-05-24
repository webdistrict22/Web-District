import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { services as fallbackServices } from "../../data/siteData";

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
    if (packages.length) {
      const featured = packages.filter((item) => item.isFeatured);
      return (featured.length ? featured : packages).slice(0, 4);
    }

    return fallbackServices.slice(0, 4);
  }, [packages]);

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

        {isLoading ? (
          <Card className="p-6">
            <p className="text-[#94A3B8]">Loading website options...</p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {displayItems.map((item) => {
              const isFromDatabase = Boolean(item._id);

              const title = isFromDatabase ? item.name : item.title;
              const description = isFromDatabase
                ? item.shortDescription
                : item.description;
              const points = isFromDatabase
                ? item.features?.slice(0, 4) || []
                : item.points || [];
              const label = isFromDatabase ? item.websiteType : "Service";

              return (
                <Card
                  key={item._id || item.title}
                  className="p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C69A4E]/30"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">
                      {title}
                    </h3>

                    <Badge>{label}</Badge>
                  </div>

                  <p className="leading-7 text-[#94A3B8]">{description}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-sm text-[#CBD5E1]"
                      >
                        <CheckCircle2 size={16} className="text-[#C69A4E]" />
                        {point}
                      </div>
                    ))}
                  </div>

                  {isFromDatabase && item.priceLabel && (
                    <div className="mt-6 rounded-2xl border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-4">
                      <p className="text-sm font-semibold text-[#F1D08B]">
                        {item.priceLabel}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default ServicesPreview;