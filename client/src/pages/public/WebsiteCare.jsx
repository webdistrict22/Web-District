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
import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink } from "../../lib/helpers";

const lastUpdated = "May 28, 2026";

const includedItems = [
  {
    title: "Small content edits",
    description: "Update short text, offers, contact details, sections, or repeated content.",
    icon: Sparkles,
  },
  {
    title: "Image or text updates",
    description: "Swap images, adjust copy, and keep important pages feeling current.",
    icon: Layout,
  },
  {
    title: "Basic bug fixes",
    description: "Handle small visual or functional issues after launch.",
    icon: Wrench,
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
    description: "Ask questions and get clear direction when your website needs attention.",
    icon: HeartHandshake,
  },
];

const notIncludedItems = [
  "Full redesigns",
  "New large features",
  "New dashboards/systems",
  "Paid ads/media buying",
  "Major page rebuilds",
];

const audienceItems = [
  "Brands that update content often",
  "Businesses that want peace of mind",
  "Clients who want Web District close after launch",
];

const plans = [
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
      "More frequent content updates",
      "Offer or product section support",
      "Small layout improvements",
      "Priority planning guidance",
      "Monthly improvement notes",
    ],
  },
  {
    title: "Priority Care",
    bestFor: "Best for faster support and ongoing improvements.",
    features: [
      "Faster support window",
      "Ongoing refinement tasks",
      "Regular health checks",
      "Launch or campaign support",
      "Roadmap guidance",
    ],
  },
];

function WebsiteCare() {
  const whatsappLink = getWhatsappLink(
    AGENCY.whatsapp,
    "Hi Web District, I want to ask about Website Care monthly support."
  );

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Website Care"
        description="Monthly website care and support from Web District for small edits, updates, fixes, checks, and guidance after launch."
      />

      <section className="wd-section-black pt-32 pb-10 md:pb-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <SectionHeader
                eyebrow="Website Care"
                title="Keep your website polished after launch."
                description="Small updates, fixes, and improvements handled monthly so your website keeps feeling fresh and reliable."
              />

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} />
                  Ask About Website Care
                </Button>
                <Button to="/start" variant="secondary">
                  Start Your Project
                </Button>
              </div>
            </div>


          </div>
        </Container>
      </section>

      <section className="wd-section-black py-14 md:py-16">
        <Container>
          <div className="mb-8">
            <SectionHeader
              eyebrow="Included"
              title="What Website Care can cover."
              description="Light monthly support for the parts of your website that naturally change after launch."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {includedItems.map((item) => {
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
        </Container>
      </section>

      <section className="wd-section-black py-14 md:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-start">
            <SectionHeader
              eyebrow="Fair scope"
              title="What is not included."
              description="Care plans are for ongoing support, not replacing a new project scope."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {notIncludedItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[#D9D4CC]"
                >
                  <CircleSlash className="shrink-0 text-[#C4A77D]" size={18} />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="wd-section-black py-14 md:py-16">
        <Container>
          <div className="mb-8">
            <SectionHeader
              eyebrow="Best for"
              title="Who it is for."
              
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {audienceItems.map((item) => (
              <article
                key={item}
                className="wd-card-on-black rounded-[1.5rem] p-5"
              >
                <CheckCircle2 className="text-[#C4A77D]" size={20} />
                <h3 className="mt-4 font-display text-lg font-bold tracking-[-0.04em] text-[#F8F7F4]">
                  {item}
                </h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="wd-section-black py-14 md:py-16">
        <Container>
          <div className="mb-8">
            <SectionHeader
              eyebrow="Plans"
              title="Monthly care options."
              description="No fixed pricing. We quote based on your website, update rhythm, and support needs."
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.title}
                className="wd-card-on-black flex h-full flex-col border-[#C4A77D]/20 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
                    {plan.title}
                  </h3>
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

                <Button
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  className="mt-7"
                >
                  Ask on WhatsApp
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="wd-section-black pt-8 pb-16 md:pt-10 md:pb-20">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  Keep it fresh
                </p>
                <h2 className="font-display text-4xl font-bold tracking-[-0.06em] text-[#F8F7F4] md:text-5xl">
                  Need help keeping your website fresh?
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
                  Tell us what kind of support you need, and we'll suggest the
                  right monthly care plan.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} />
                  Ask About Website Care
                </Button>
                <Button to="/contact" variant="secondary">
                  Contact Web District
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default WebsiteCare;
