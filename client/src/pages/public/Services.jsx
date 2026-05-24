import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ServiceCard from "../../components/services/ServiceCard";
import ServiceDetails from "../../components/services/ServiceDetails";
import Loader from "../../components/common/Loader";
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

    return packages.map((item) => ({
      title: item.name,
      label: item.websiteType,
      description: item.shortDescription,
      longDescription: item.shortDescription,
      includes: item.features?.length
        ? item.features
        : ["Custom website direction", "Mobile-first layout", "Clear CTA flow"],
      bestFor: item.bestFor?.length
        ? item.bestFor
        : ["Brands", "Businesses", "Campaigns"],
      priceLabel: item.priceLabel,
      isCustom: item.isCustom,
      isFeatured: item.isFeatured,
    }));
  }, [packages]);

  return (
    <main className="pb-20 pt-32">
      <PageMeta
        title="Services"
        description="Explore Web District website services including online stores, business websites, landing pages, and custom websites."
      />

      <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow="Services"
            title="Websites built around the business goal."
            description="Web District builds clean, professional websites for brands, businesses, companies, campaigns, and custom digital needs."
          />

          <div className="rounded-[1.6rem] border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-5">
            <p className="text-sm leading-7 text-[#F1D08B]">
              We are not limited to one niche. The website direction depends on
              what your business needs: selling, presenting, collecting leads,
              booking calls, or running a custom process.
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="mt-14">
            <Loader text="Loading website options..." />
          </section>
        ) : (
          <>
            <section className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                />
              ))}
            </section>

            <section className="mt-24 space-y-10">
              <SectionHeader
                eyebrow="Details"
                title="Choose a clear website direction."
                description="Each service can be simple or advanced depending on the business, content, features, and launch goal."
                center
              />

              <div className="space-y-8">
                {services.map((service, index) => (
                  <ServiceDetails
                    key={service.title}
                    service={service}
                    reverse={index % 2 !== 0}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        <section className="mt-24 overflow-hidden rounded-[2rem] border border-[#C69A4E]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(198,154,78,0.16),transparent_32%),linear-gradient(135deg,#0A1A2D,#020817)] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C69A4E]">
                Not sure what you need?
              </p>

              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                Start with the goal. We’ll guide the website direction.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-[#94A3B8]">
                You do not need to know every technical detail. Tell us what
                your business does, what you want the website to achieve, and
                we’ll help shape the right structure.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button to="/start">Book your website</Button>
              <Button to="/contact" variant="secondary">
                Ask first
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}

export default Services;