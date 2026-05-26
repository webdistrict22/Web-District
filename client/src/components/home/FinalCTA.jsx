import { ExternalLink } from "lucide-react";
import Container from "../common/Container";
import Button from "../common/Button";

function FinalCTA({ liveUrl = "" }) {
  const hasLiveUrl = Boolean(liveUrl);

  return (
    <section className="wd-section-black py-16 md:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] md:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.10),transparent_34%)]" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                Start
              </p>
              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-6xl">
                Ready to build something serious?
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#D9D4CC]">
                Tell us what you need. We'll help shape the right website direction.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {hasLiveUrl ? (
                <>
                  <Button
                    href={liveUrl}
                    icon={false}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={17} />
                    Try it yourself
                  </Button>
                  <Button to="/work" variant="secondary">
                    View Work
                  </Button>
                  <Button to="/start" variant="secondary">
                    Start Your Project
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/start">Start Your Project</Button>
                  <Button to="/work" variant="secondary">
                    View Work
                  </Button>
                  <Button to="/process#process-questions" variant="secondary">
                    Answer Your Questions
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTA;
