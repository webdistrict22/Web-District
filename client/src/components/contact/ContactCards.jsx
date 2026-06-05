import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Card from "../common/Card";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";
import useLanguage from "../../hooks/useLanguage";

function ContactCards({ cardClassName = "" }) {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const cardCopy = t("contact.cards", []);

  const contactOptions = [
    {
      title: cardCopy[0]?.title || "WhatsApp",
      type: "WhatsApp",
      value: settings.whatsapp,
      description: cardCopy[0]?.description,
      icon: MessageCircle,
      href: getWhatsappLink(
        settings.whatsapp || "01130696935",
        t("contact.whatsappMessage")
      ),
    },
    {
      title: cardCopy[1]?.title || "Phone",
      type: "Phone",
      value: settings.phone,
      description: cardCopy[1]?.description,
      icon: Phone,
      href: `tel:${settings.phone}`,
    },
    {
      title: cardCopy[2]?.title || "Email",
      type: "Email",
      value: settings.email,
      description: cardCopy[2]?.description,
      icon: Mail,
      href: `mailto:${settings.email}`,
    },
    {
      title: cardCopy[3]?.title || "Instagram",
      type: "Instagram",
      value: `@${settings.instagram}`,
      description: cardCopy[3]?.description,
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
            target={option.type === "Instagram" || option.type === "WhatsApp" ? "_blank" : undefined}
            rel={option.type === "Instagram" || option.type === "WhatsApp" ? "noreferrer" : undefined}
          >
            <Card className={`h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35 ${cardClassName}`}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
                <Icon size={22} />
              </div>

              <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
                {option.title}
              </h3>

              <p className="mt-2 font-medium text-[#F8F7F4]">
                <span className="wd-ltr">{option.value}</span>
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
