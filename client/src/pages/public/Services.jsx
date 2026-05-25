import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ServiceCard from "../../components/services/ServiceCard";
import Loader from "../../components/common/Loader";
import { truncateText } from "../../lib/helpers";
import { servicesPageData } from "../../data/servicesData";

function Services() {
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

  const services = useMemo(() => {
    if (!packages.length) return servicesPageData;

    return packages
      .map((item) => ({
        title: item.name,
        label: item.websiteType,
        description: truncateText(item.shortDescription, 110),
        longDescription: truncateText(item.shortDescription, 140),
        includes: item.features?.length
          ? item.features.slice(0, 3)
          : ["Custom website direction", "Mobile-first layout", "Clear CTA flow"],
        bestFor: item.bestFor?.length
          ? item.bestFor.slice(0, 3)
          : ["Brands", "Businesses", "Campaigns"],
        priceLabel: item.priceLabel,
        isCustom: item.isCustom,
        isFeatured: item.isFeatured,
      }))
      .slice(0, 4);
  }, [packages]);

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Services"
        description="Explore Web District website services including online stores, business websites, landing pages, and custom websites."
      />

      <section className="wd-section-black pt-32 pb-14 md:pb-16">
        <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow="Services"
            title="Websites built around the business goal."
            description="Choose the website direction. We shape the structure, visuals, and launch path."
          />

          <div className="rounded-[1.6rem] border border-[#C4A77D]/20 bg-[#0B0B0B] p-5">
            <p className="text-sm leading-7 text-[#F8F7F4]">
              Selling, presenting, collecting leads, or running custom logic.
              The build follows the goal.
            </p>
          </div>
        </section>
        </Container>
      </section>

      <section className="wd-section-black py-16">
        <Container>
        {isLoading ? (
          <section>
            <Loader text="Loading website options..." />
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                className="wd-card-on-black"
              />
            ))}
          </section>
        )}
        </Container>
      </section>

      <section className="wd-section-black py-16 md:py-20">
        <Container>
        <section className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                Not sure what you need?
              </p>

              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                Start with the goal.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
                Tell us what the website should do. We'll shape the right structure.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button to="/start">Start Your Project</Button>
              <Button to="/contact" variant="secondary">
                Ask first
              </Button>
            </div>
          </div>
        </section>
        </Container>
      </section>
    </main>
  );
}

export default Services;
