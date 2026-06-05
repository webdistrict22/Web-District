import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import BrandLogo from "./BrandLogo";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";
import useLanguage from "../../hooks/useLanguage";

function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();

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
              {t("footer.text")}
            </p>
          </div>

          <div>
            <p className="mb-4 font-semibold text-[#F8F7F4]">
              {t("footer.help")}
            </p>

            <div className="space-y-3 text-sm text-[#D9D4CC]">
              {[
                { label: t("footer.terms"), path: "/terms" },
                { label: t("footer.privacy"), path: "/privacy" },
              ].map((link) => (
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
            <p className="mb-4 font-semibold text-[#F8F7F4]">
              {t("footer.contact")}
            </p>

            <div className="space-y-3 text-sm text-[#D9D4CC]">
              <a
                className="flex items-center gap-2 transition hover:text-[#C4A77D]"
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={16} />
                <span className="wd-ltr">@{instagram}</span>
              </a>

              <a
                className="flex items-center gap-2 transition hover:text-[#C4A77D]"
                href={getWhatsappLink(whatsapp)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                {t("footer.whatsapp")}
              </a>

              <a className="flex items-center gap-2 transition hover:text-[#C4A77D]" href={`tel:${phone}`}>
                <Phone size={16} />
                <span className="wd-ltr">{phone}</span>
              </a>

              <a className="flex items-center gap-2 transition hover:text-[#C4A77D]" href={`mailto:${email}`}>
                <Mail size={16} />
                <span className="wd-ltr">{email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
