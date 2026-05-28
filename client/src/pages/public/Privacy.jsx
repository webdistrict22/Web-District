import PageMeta from "../../components/common/PageMeta";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";

const privacySections = [
  {
    title: "Information we collect",
    body: [
      "We may collect details you submit, such as name, email, phone number, WhatsApp number, business name, website needs, appointment details, and project information.",
      "If you create a client account, we may also store account details needed to manage your dashboard and requests.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use information to respond to messages, review project requests, manage appointments, prepare proposals or contracts, deliver services, and communicate about your project.",
      "We may also use general website activity to improve the website experience.",
    ],
  },
  {
    title: "Forms and website requests",
    body: [
      "When you send a website request or contact form, the information helps us understand your goals and suggest the right next step.",
      "Please avoid sending sensitive personal information unless it is necessary for your request.",
    ],
  },
  {
    title: "Client accounts",
    body: [
      "Client accounts may show requests, appointments, contracts, project status, reviews, and profile information connected to your work with Web District.",
      "Account access should be kept private by the user.",
    ],
  },
  {
    title: "Cookies / analytics note",
    body: [
      "The website may use basic cookies, analytics, or similar tools to understand performance and visitor activity.",
      "These tools help us improve the site and do not change the price or availability of our services.",
    ],
  },
  {
    title: "Email and communication",
    body: [
      "If you contact us by email, WhatsApp, Instagram, phone, or website form, we may keep the conversation so we can respond and manage the project properly.",
      "You can ask us to update or remove unnecessary contact details.",
    ],
  },
  {
    title: "Data storage",
    body: [
      "Information may be stored in our website system, email inbox, project records, hosting environment, or approved business tools.",
      "We aim to keep information only as long as needed for communication, service delivery, records, or reasonable business purposes.",
    ],
  },
  {
    title: "Sharing information",
    body: [
      "We do not sell personal information.",
      "We may use third-party services such as hosting, email, analytics, payment/contact platforms, or technical tools when needed to operate the website and deliver services.",
    ],
  },
  {
    title: "User rights",
    body: [
      "You can contact us to ask about the information we hold, request corrections, or ask for information to be removed where reasonably possible.",
      "Some records may need to be kept for project, contract, security, or business reasons.",
    ],
  },
];

function Privacy() {
  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Privacy Policy"
        description="Learn how Web District collects and uses information submitted through forms, client accounts, messages, and website requests."
      />

      <section className="wd-section-black pt-32 pb-8 md:pb-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <SectionHeader
              eyebrow="Privacy"
              title="Privacy Policy"
              description="A clear look at the information we collect and how it helps us respond, plan, and support your website project."
            />

          </div>
        </Container>
      </section>

      <section className="wd-section-black pt-4 pb-16 md:pt-6 md:pb-20">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privacySections.map((section) => (
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
                  Need to ask about your data?
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-[#D9D4CC]">
                  Start a project when you are ready, or contact Web District
                  if you have a privacy question before moving forward.
                </p>
              </div>

              <div className="grid gap-3">
                <Button to="/start">
                  Start Your Project
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

export default Privacy;
