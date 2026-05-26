import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import BrandLogo from "./BrandLogo";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";

const defaultFooterText =
  "Clean websites for brands, stores, and businesses that need to look serious online.";

function Footer() {
  const { settings } = useSettings();

  const phone = settings.phone || "01130696935";
  const whatsapp = settings.whatsapp || "01130696935";
  const email = settings.email || "web.district22@gmail.com";
  const instagram = settings.instagram || "web__district";
  const footerText = settings.footerText || defaultFooterText;

  return (
    <footer className="border-t border-white/10 bg-[#080808] py-12">
      <div className="wd-container">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <BrandLogo size="lg" />
            <p className="mt-4 max-w-md leading-7 text-[#D9D4CC]">
              {footerText}
            </p>
          </div>

          <div>
            <p className="mb-4 font-semibold text-[#F8F7F4]">Contact</p>

            <div className="space-y-3 text-sm text-[#D9D4CC]">
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

              <a
                className="flex items-center gap-2 transition hover:text-[#C4A77D]"
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={16} />
                @{instagram}
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
