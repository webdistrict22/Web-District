import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleSlash,
  HeartHandshake,
  Layout,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import api, { PUBLIC_CONTENT_TIMEOUT } from "../../lib/axios";
import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ServiceCard from "../../components/services/ServiceCard";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink, truncateText } from "../../lib/helpers";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";
import {
  trackContact,
  trackCustomEvent,
} from "../../lib/metaPixel";

const websiteCareIcons = [
  Sparkles,
  Layout,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
];

function Services() {
  const [packages, setPackages] = useState([]);
  const { effectiveLanguage, isArabic, t } = useLanguage();
  const websiteCareWhatsappLink = getWhatsappLink(
    AGENCY.whatsapp,
    t("services.care.whatsappMessage")
  );
  const trackWebsiteCareWhatsapp = (buttonName) => {
    const params = {
      button_name: buttonName,
      contact_method: "whatsapp",
      language: effectiveLanguage,
    };

    trackContact("whatsapp", params);
    trackCustomEvent("WhatsAppClick", params);
  };
  const trackStartProject = (buttonName) =>
    trackCustomEvent("StartProjectClick", {
      button_name: buttonName,
      language: effectiveLanguage,
    });

  const fetchPackages = async () => {
    try {
      const { data } = await api.get("/packages/public", {
        timeout: PUBLIC_CONTENT_TIMEOUT,
      });

      setPackages(data.packages || []);
    } catch {
      setPackages([]);
    }
  };

  useInitialLoad(fetchPackages);

  const services = useMemo(() => {
    const fallbackServices = t("services.cards", []);

    if (isArabic || !packages.length) return fallbackServices;

    const apiServices = packages
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

    return [
      ...apiServices,
      ...fallbackServices.slice(apiServices.length, 4),
    ].slice(0, 4);
  }, [isArabic, packages, t]);

  const websiteCareItems = t("services.care.items", []).map((item, index) => ({
    ...item,
    icon: websiteCareIcons[index] || Sparkles,
  }));
  const websiteCarePlans = t("services.care.plans", []);

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title={t("services.metaTitle")}
        description={t("services.metaDescription")}
        canonical="/services"
      />

      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow={t("services.hero.eyebrow")}
            title={t("services.hero.title")}
            description={t("services.hero.description")}
          />


        </section>
        </Container>
      </section>

      <section className="wd-section-black pt-6 pb-16 md:pt-8">
        <Container>
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
        </Container>
      </section>

      <section className="wd-section-black py-12 md:py-16">
        <Container>
          <section className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/18 bg-[radial-gradient(circle_at_8%_8%,rgba(196,167,125,0.12),transparent_34%),linear-gradient(135deg,#080808,#0B0B0B)] p-6 md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  {t("services.care.eyebrow")}
                </p>

                <h2 className="font-display text-4xl font-bold tracking-[-0.06em] text-[#F8F7F4] md:text-5xl">
                  {t("services.care.title")}
                </h2>

                <p className="mt-5 max-w-xl leading-8 text-[#D9D4CC]">
                  {t("services.care.description")}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Button
                  href={websiteCareWhatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackWebsiteCareWhatsapp("Website Care Primary WhatsApp")
                  }
                >
                  <MessageCircle size={17} />
                  {t("services.care.ask")}
                </Button>

                <Button
                  to="/start"
                  variant="secondary"
                  onClick={() =>
                    trackStartProject("Website Care Start Project")
                  }
                >
                  {t("common.buttons.startProject")}
                </Button>
              </div>
            </div>

            <div className="mt-10">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-[#C4A77D]">
                {t("services.care.included")}
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
                    {t("services.care.monthly")}
                  </p>
                  <h3 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
                    {t("services.care.monthlyTitle")}
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
                        {t("services.care.customQuote")}
                      </span>
                    </div>

                    <p className="mt-4 leading-7 text-[#D9D4CC]">
                      {plan.bestFor}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#F8F7F4]">
                      {t("services.care.monthlySupport")}
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
                    {t("services.care.notIncludedLabel")}
                  </span>{" "}
                  {t("services.care.notIncluded")}
                </p>
              </div>

              <Button
                href={websiteCareWhatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                onClick={() =>
                  trackWebsiteCareWhatsapp("Website Care Secondary WhatsApp")
                }
              >
                <MessageCircle size={17} />
                {t("services.care.askWhatsapp")}
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
                {t("services.bottomCta.eyebrow")}
              </p>

              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                {t("services.bottomCta.title")}
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
                {t("services.bottomCta.description")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button
                to="/start"
                onClick={() =>
                  trackStartProject("Services Bottom Start Project")
                }
              >
                {t("common.buttons.startProject")}
              </Button>
              <Button to="/process#process-questions" variant="secondary">
                {t("common.buttons.viewQuestions")}
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
