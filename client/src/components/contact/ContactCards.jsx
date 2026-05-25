import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Card from "../common/Card";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";

function ContactCards({ cardClassName = "" }) {
  const { settings } = useSettings();

  const contactOptions = [
    {
      title: "WhatsApp",
      value: settings.whatsapp,
      description: "Fastest way to start.",
      icon: MessageCircle,
      href: getWhatsappLink(
        settings.whatsapp || "01130696935",
        "Hi Web District, I want to ask about building a website."
      ),
    },
    {
      title: "Phone",
      value: settings.phone,
      description: "Call for a quick conversation.",
      icon: Phone,
      href: `tel:${settings.phone}`,
    },
    {
      title: "Email",
      value: settings.email,
      description: "Send project details.",
      icon: Mail,
      href: `mailto:${settings.email}`,
    },
    {
      title: "Instagram",
      value: `@${settings.instagram}`,
      description: "Follow or send a DM.",
      icon: FaInstagram,
      href: `https://instagram.com/${settings.instagram}`,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {contactOptions.map((option) => {
        const Icon = option.icon;

        return (
          <a
            key={option.title}
            href={option.href}
            target={option.title === "Instagram" || option.title === "WhatsApp" ? "_blank" : undefined}
            rel={option.title === "Instagram" || option.title === "WhatsApp" ? "noreferrer" : undefined}
          >
            <Card className={`h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35 ${cardClassName}`}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
                <Icon size={22} />
              </div>

              <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
                {option.title}
              </h3>

              <p className="mt-2 font-medium text-[#F8F7F4]">
                {option.value}
              </p>

              <p className="mt-3 leading-7 text-[#D9D4CC]">
                {option.description}
              </p>
            </Card>
          </a>
        );
      })}
    </div>
  );
}

export default ContactCards;
