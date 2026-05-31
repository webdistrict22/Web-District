import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleSlash,
  HeartHandshake,
  Layout,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import api from "../../lib/axios";
import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ServiceCard from "../../components/services/ServiceCard";
import Loader from "../../components/common/Loader";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink, truncateText } from "../../lib/helpers";
import { servicesPageData } from "../../data/servicesData";

const websiteCareItems = [
  {
    title: "Small content edits",
    description:
      "Update short text, offers, contact details, sections, or repeated content.",
    icon: Sparkles,
  },
  {
    title: "Image or text updates",
    description:
      "Swap images, adjust copy, and keep important pages feeling current.",
    icon: Layout,
  },
  {
    title: "Website health checks",
    description: "Review key pages, forms, links, and responsive behavior.",
    icon: ShieldCheck,
  },
  {
    title: "Small layout improvements",
    description: "Refine compact areas without rebuilding the whole website.",
    icon: CheckCircle2,
  },
  {
    title: "Support and guidance",
    description:
      "Ask questions and get clear direction when your website needs attention.",
    icon: HeartHandshake,
  },
];

const websiteCarePlans = [
  {
    title: "Essential Care",
    bestFor: "Best for small text/image updates.",
    features: [
      "Monthly small edits",
      "Basic website checks",
      "Image or copy swaps",
      "Email or WhatsApp support",
    ],
  },
  {
    title: "Growth Care",
    bestFor: "Best for active brands and stores.",
    features: [
      "Frequent content updates",
      "Offer or product support",
      "Small layout refinements",
      "Monthly improvement notes",
    ],
  },
  {
    title: "Priority Care",
    bestFor:
      "Best for businesses that need faster support and ongoing improvements.",
    features: [
      "Faster support window",
      "Ongoing refinement tasks",
      "Regular health checks",
      "Roadmap guidance",
    ],
  },
];

function Services() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const websiteCareWhatsappLink = getWhatsappLink(
    AGENCY.whatsapp,
    "Hi Web District, I want to ask about Website Care."
  );

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

      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow="Services"
            title="Websites built around the business goal."
            description="You choose the website direction. We shape the structure, visuals, and launch path."
          />


        </section>
        </Container>
      </section>

      <section className="wd-section-black pt-6 pb-16 md:pt-8">
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

      <section className="wd-section-black py-12 md:py-16">
        <Container>
          <section className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/18 bg-[radial-gradient(circle_at_8%_8%,rgba(196,167,125,0.12),transparent_34%),linear-gradient(135deg,#080808,#0B0B0B)] p-6 md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  Website Care
                </p>

                <h2 className="font-display text-4xl font-bold tracking-[-0.06em] text-[#F8F7F4] md:text-5xl">
                  Keep your website polished after launch.
                </h2>

                <p className="mt-5 max-w-xl leading-8 text-[#D9D4CC]">
                  Small updates, fixes, and improvements handled monthly so your
                  website keeps feeling fresh, reliable, and easy to manage.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Button
                  href={websiteCareWhatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} />
                  Ask About Website Care
                </Button>

                <Button to="/start" variant="secondary">
                  Start Your Project
                </Button>
              </div>
            </div>

            <div className="mt-10">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-[#C4A77D]">
                What's included
              </p>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {websiteCareItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="wd-card-on-black rounded-[1.5rem] p-5 md:p-6"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
                        <Icon size={22} />
                      </div>
                      <h3 className="font-display text-xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-7 text-[#D9D4CC]">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#C4A77D]">
                    Monthly care plans
                  </p>
                  <h3 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
                    Support that matches your update rhythm.
                  </h3>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {websiteCarePlans.map((plan) => (
                  <article
                    key={plan.title}
                    className="wd-card-on-black flex h-full flex-col rounded-[1.5rem] border-[#C4A77D]/20 p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="font-display text-2xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
                        {plan.title}
                      </h4>
                      <span className="rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#C4A77D]">
                        Custom quote
                      </span>
                    </div>

                    <p className="mt-4 leading-7 text-[#D9D4CC]">
                      {plan.bestFor}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#F8F7F4]">
                      Monthly support based on your website needs.
                    </p>

                    <ul className="mt-6 space-y-3 text-sm leading-6 text-[#D9D4CC]">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <CheckCircle2
                            className="mt-0.5 shrink-0 text-[#C4A77D]"
                            size={17}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-[#D9D4CC]">
                <CircleSlash
                  className="mt-1 shrink-0 text-[#C4A77D]"
                  size={20}
                />
                <p className="leading-7">
                  <span className="font-semibold text-[#F8F7F4]">
                    Not included:
                  </span>{" "}
                  Major redesigns, large new features, full system rebuilds, or
                  emergency 24/7 support are quoted separately unless agreed.
                </p>
              </div>

              <Button
                href={websiteCareWhatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                <MessageCircle size={17} />
                Ask on WhatsApp
              </Button>
            </div>
          </section>
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
              <Button to="/process#process-questions" variant="secondary">
                View Questions & Answers
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
