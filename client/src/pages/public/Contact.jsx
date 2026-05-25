import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ContactCards from "../../components/contact/ContactCards";
import ContactForm from "../../components/contact/ContactForm";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";

function Contact() {
  const { settings } = useSettings();

  return (
    <main className="bg-[#080808]">
      <section className="wd-section-black pt-32 pb-14 md:pb-16">
        <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="Tell us what you need."
              description="Message us directly, or use the Start page if you already know the website direction."
            />

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button to="/start">Start Your Project</Button>

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
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[#C4A77D]/20 bg-[#0B0B0B] p-5">
            <p className="text-sm leading-7 text-[#F8F7F4]">
              For a faster reply, include your business name, website type,
              and deadline if you have one.
            </p>
          </div>
        </div>
        </Container>
      </section>

      <section className="wd-section-black py-16 md:pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <ContactForm className="wd-card-on-black" />
            <ContactCards cardClassName="wd-card-on-black" />
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Contact;
