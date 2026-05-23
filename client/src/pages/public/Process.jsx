import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ProcessTimeline from "../../components/process/ProcessTimeline";
import ClientRequirements from "../../components/process/ClientRequirements";
import AfterStartOptions from "../../components/process/AfterStartOptions";
import {
  afterStartOptions,
  clientNeeds,
  fullProcessSteps,
} from "../../data/processData";

function Process() {
  return (
    <main className="pb-20 pt-32">
      <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow="Process"
            title="A clear process from request to launch."
            description="Web District keeps the website process simple, organized, and professional so the project does not feel confusing or random."
          />

          <div className="rounded-[1.6rem] border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-5">
            <p className="text-sm leading-7 text-[#F1D08B]">
              The goal is not just to build pages. The goal is to understand the business, choose the right structure, and launch a website that makes the business easier to trust.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <ProcessTimeline steps={fullProcessSteps} />
        </section>

        <section className="mt-24">
          <SectionHeader
            eyebrow="Client side"
            title="What we may need from you."
            description="You do not need to have everything ready from day one, but these details help us plan faster and build more accurately."
            center
            className="mb-12"
          />

          <ClientRequirements requirements={clientNeeds} />
        </section>

        <section className="mt-24">
          <SectionHeader
            eyebrow="After starting"
            title="What happens after you submit?"
            description="Whether you start with a website request or a call appointment, the next step is designed to make the project clearer."
            center
            className="mb-12"
          />

          <AfterStartOptions options={afterStartOptions} />
        </section>

        <section className="mt-24 overflow-hidden rounded-[2rem] border border-[#C69A4E]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(198,154,78,0.16),transparent_32%),linear-gradient(135deg,#0A1A2D,#020817)] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C69A4E]">
                Start with clarity
              </p>

              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                Tell us the goal. We’ll help shape the website.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-[#94A3B8]">
                You do not need to know every technical detail. Start with your business, your goal, and what you want the website to do.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button to="/start">Start a request</Button>
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

export default Process;