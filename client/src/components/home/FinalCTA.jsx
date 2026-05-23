import Container from "../common/Container";
import Button from "../common/Button";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink } from "../../lib/helpers";

function FinalCTA() {
  return (
    <section className="py-20">
      <Container>
        <div className="overflow-hidden rounded-[2rem] border border-[#C69A4E]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(198,154,78,0.16),transparent_32%),linear-gradient(135deg,#0A1A2D,#020817)] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C69A4E]">
                Start your website
              </p>
              <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-6xl">
                Ready to build your website?
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-[#94A3B8]">
                Start through the website or contact directly. Tell us what you need and we’ll guide you to the right website direction.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button to="/start">Start a request</Button>
              <Button to="/start" variant="secondary">Book a call</Button>
              <Button
                href={getWhatsappLink(
                  AGENCY.whatsapp,
                  "Hi Web District, I want to ask about building a website."
                )}
                variant="secondary"
              >
                WhatsApp us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTA;