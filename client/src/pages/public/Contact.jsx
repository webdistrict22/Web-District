import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ContactCards from "../../components/contact/ContactCards";
import ContactForm from "../../components/contact/ContactForm";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink } from "../../lib/helpers";

function Contact() {
  return (
    <main className="pb-20 pt-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="Tell us what you need and we’ll guide you."
              description="Start with a message, WhatsApp, Instagram, or email. If you already know what website you need, the Start page is the fastest way to submit your request."
            />

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button to="/start">Start a request</Button>

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

            <div className="mt-10 rounded-[1.6rem] border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-5">
              <p className="text-sm leading-7 text-[#F1D08B]">
                For the clearest start, include your business name, website type, deadline if any, and whether you already have content or branding.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="mt-14">
          <ContactCards />
        </div>
      </Container>
    </main>
  );
}

export default Contact;