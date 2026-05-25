import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ProcessTimeline from "../../components/process/ProcessTimeline";
import { fullProcessSteps } from "../../data/processData";

function Process() {
  return (
    <main className="bg-[#080808]">
      <section className="wd-section-black pt-32 pb-14 md:pb-16">
        <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow="Process"
            title="A clear path from request to launch."
            description="Simple steps, fewer surprises, and a website direction everyone understands."
          />

          <div className="rounded-[1.6rem] border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-5">
            <p className="text-sm leading-7 text-[#F8F7F4]">
              The goal is clarity before build. That keeps the website sharper
              and the project easier to move.
            </p>
          </div>
        </section>
        </Container>
      </section>

      <section className="wd-section-black py-16">
        <Container>
          <ProcessTimeline steps={fullProcessSteps} cardClassName="wd-card-on-black" />
        </Container>
      </section>

      <section className="wd-section-black py-16 md:py-20">
        <Container>
        <section className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                Start with clarity
              </p>

              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                Tell us the goal.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
                We'll help shape the right website direction from there.
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

export default Process;
