import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import BrandLogo from "./BrandLogo";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";

const footerText =
  "We don't just build websites. We craft digital work that feels like art.";

const legalLinks = [
  { label: "Website Care", path: "/website-care" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
];

function Footer() {
  const { settings } = useSettings();

  const phone = settings.phone || "01130696935";
  const whatsapp = settings.whatsapp || "01130696935";
  const email = settings.email || "web.district22@gmail.com";
  const instagram = settings.instagram || "web__district";

  return (
    <footer className="border-t border-white/10 bg-[#080808] py-12">
      <div className="wd-container">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.75fr_0.9fr]">
          <div>
            <BrandLogo size="lg" />
            <p className="mt-4 max-w-md leading-7 text-[#D9D4CC]">
              {footerText}
            </p>
          </div>

          <div>
            <p className="mb-4 font-semibold text-[#F8F7F4]">Help</p>

            <div className="space-y-3 text-sm text-[#D9D4CC]">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  className="block transition hover:text-[#C4A77D]"
                  to={link.path}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 font-semibold text-[#F8F7F4]">Contact</p>

            <div className="space-y-3 text-sm text-[#D9D4CC]">
              <a
                className="flex items-center gap-2 transition hover:text-[#C4A77D]"
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={16} />
                @{instagram}
              </a>

              <a
                className="flex items-center gap-2 transition hover:text-[#C4A77D]"
                href={getWhatsappLink(whatsapp)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>

              <a className="flex items-center gap-2 transition hover:text-[#C4A77D]" href={`tel:${phone}`}>
                <Phone size={16} />
                {phone}
              </a>

              <a className="flex items-center gap-2 transition hover:text-[#C4A77D]" href={`mailto:${email}`}>
                <Mail size={16} />
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
