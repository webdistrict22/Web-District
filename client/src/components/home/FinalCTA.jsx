import { ExternalLink } from "lucide-react";
import Container from "../common/Container";
import Button from "../common/Button";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";

function FinalCTA({ liveUrl = "" }) {
  const { settings } = useSettings();
  const hasLiveUrl = Boolean(liveUrl);

  return (
    <section className="wd-section-black py-16 md:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#C4A77D]/22 bg-[radial-gradient(circle_at_82%_18%,rgba(196,167,125,0.18),transparent_32%),radial-gradient(circle_at_8%_92%,rgba(100,19,26,0.20),transparent_34%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] md:p-12">
          <img
            src="/images/backgrounds/section-bg.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-72 saturate-[0.9]"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(32,32,32,0.94),rgba(32,32,32,0.68)),radial-gradient(circle_at_82%_18%,rgba(196,167,125,0.22),transparent_34%),radial-gradient(circle_at_8%_92%,rgba(100,19,26,0.16),transparent_34%)]" />

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
                  <Button
                    href={getWhatsappLink(
                      settings.whatsapp || "01130696935",
                      "Hi Web District, I want to ask about building a website."
                    )}
                    variant="secondary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
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
