import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";

const termsSections = [

  {
    title: "Services",
    body: [
      "Web District provides website design, development, online store, landing page, and custom web services depending on each project scope.",
      "The exact service details are agreed before work begins.",
    ],
  },
  {
    title: "Project requests and proposals",
    body: [
      "Submitting a request, form, or message does not mean a project is automatically accepted.",
      "After reviewing the details, Web District may prepare a proposal, quotation, or contract based on the project scope.",
    ],
  },
  {
    title: "Payments and deposits",
    body: [
      "Payment terms, deposits, milestones, and delivery timing are agreed per project.",
      "Work may depend on receiving the agreed deposit or payment before a stage begins.",
    ],
  },
  {
    title: "Timelines and delays",
    body: [
      "Project timelines are planned around the agreed scope, content, feedback, and technical needs.",
      "Delays in client feedback, content, images, approvals, or third-party access can affect delivery timelines.",
    ],
  },
  {
    title: "Client responsibilities",
    body: [
      "Clients are responsible for providing correct business information, website content, images, brand assets, account access, and approvals.",
      "If Web District helps shape content direction, the client is still responsible for confirming accuracy before launch.",
    ],
  },
  {
    title: "Revisions and small changes",
    body: [
      "Reasonable revisions are handled according to the project agreement and stage of work.",
      "Small changes are different from major new features, page rebuilds, or a change in direction unless agreed separately.",
    ],
  },
  {
    title: "Website content and assets",
    body: [
      "Clients should only provide content, images, logos, fonts, or assets they own or have permission to use.",
      "Web District may showcase completed work in its portfolio unless the client requests otherwise.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "Projects may use third-party services such as hosting, domains, email, analytics, payment platforms, plugins, or APIs.",
      "Those services may have their own pricing, terms, limits, and availability.",
    ],
  },
  {
    title: "Website launch",
    body: [
      "Before launch, Web District checks the agreed pages, responsive layout, core links, and main forms or flows.",
      "Final launch depends on access, approvals, domain or hosting readiness, and any third-party services involved.",
    ],
  },
  {
    title: "Monthly support / website care",
    body: [
      "Monthly support or website care is separate unless it is included in the project agreement.",
      "Care plans may cover small edits, updates, checks, and guidance. Major new features are not included as small monthly edits unless agreed.",
    ],
  },

];

function Terms() {
  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Terms & Conditions"
        description="Read Web District's clear service terms for website requests, proposals, payments, timelines, revisions, launch, and monthly support."
      />

      <section className="wd-section-black pt-32 pb-8 md:pb-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <SectionHeader
              eyebrow="Terms"
              title="Terms & Conditions"
              description="Simple service terms for working with Web District, from first request to launch and support."
            />

          </div>
        </Container>
      </section>

      <section className="wd-section-black pt-4 pb-16 md:pt-6 md:pb-20">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {termsSections.map((section) => (
              <article
                key={section.title}
                className="wd-card-on-black rounded-[1.5rem] p-5 md:p-6"
              >
                <h3 className="font-display text-xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
                  {section.title}
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#D9D4CC] md:text-base">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="wd-section-black pt-0 pb-16 md:pb-20">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 md:p-10">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.65fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  Contact
                </p>
                <h2 className="font-display text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4] md:text-4xl">
                  Questions about these terms?
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-[#D9D4CC]">
                  Start a project when you are ready, contact Web District with
                  any questions, or review monthly Website Care inside our
                  services for support after launch.
                </p>
              </div>

              <div className="grid gap-3">
                <Button to="/start">
                  Start Your Project
                </Button>
                <Button to="/contact" variant="secondary">
                  Contact Web District
                </Button>
                <Button to="/services" variant="secondary">
                  Website Care
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Terms;
