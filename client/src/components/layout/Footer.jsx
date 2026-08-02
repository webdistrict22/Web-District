import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import BrandLogo from "./BrandLogo";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";
import useLanguage from "../../hooks/useLanguage";
import {
  trackContact,
  trackCustomEvent,
} from "../../lib/metaPixel";

const contactEvents = {
  whatsapp: "WhatsAppClick",
  phone: "PhoneClick",
  email: "EmailClick",
  instagram: "InstagramClick",
};

function Footer() {
  const { settings } = useSettings();
  const { effectiveLanguage, isArabic, t } = useLanguage();

  const phone = settings.phone || "01130696935";
  const whatsapp = settings.whatsapp || "01130696935";
  const email = settings.email || "web.district22@gmail.com";
  const instagram = settings.instagram || "web__district";
  const currentYear = new Date().getFullYear();
  const trackFooterContact = (method, buttonName) => {
    const params = {
      button_name: buttonName,
      contact_method: method,
      language: effectiveLanguage,
    };

    if (method !== "instagram") {
      trackContact(method, params);
    }

    trackCustomEvent(contactEvents[method], params);
  };

  return (
    <footer className="wd-public-footer">
      <div className="wd-container">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.75fr_0.9fr]">
          <div>
            <BrandLogo size="lg" />
            <p className="mt-4 max-w-md leading-7 text-[#AAA39C]">
              {t("footer.text")}
            </p>
          </div>

          <div>
            <p className="mb-4 font-semibold text-[#F8F7F4]">
              {t("footer.help")}
            </p>

            <div className="space-y-3 text-sm text-[#AAA39C]">
              {[
                { label: t("footer.terms"), path: "/terms" },
                { label: t("footer.privacy"), path: "/privacy" },
              ].map((link) => (
                <Link
                  key={link.path}
                  className="block transition hover:text-[#D6A75D]"
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

            <div className="wd-footer-contact-links">
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                onClick={() =>
                  trackFooterContact("instagram", "Footer Instagram")
                }
              >
                <FaInstagram aria-hidden="true" />
              </a>

              <a
                href={getWhatsappLink(whatsapp)}
                target="_blank"
                rel="noreferrer"
                aria-label={t("footer.whatsapp")}
                title={t("footer.whatsapp")}
                onClick={() =>
                  trackFooterContact("whatsapp", "Footer WhatsApp")
                }
              >
                <MessageCircle aria-hidden="true" />
              </a>

              <a
                href={`tel:${phone}`}
                aria-label="Phone"
                title="Phone"
                onClick={() => trackFooterContact("phone", "Footer Phone")}
              >
                <Phone aria-hidden="true" />
              </a>

              <a
                href={`mailto:${email}`}
                aria-label="Email"
                title="Email"
                onClick={() => trackFooterContact("email", "Footer Email")}
              >
                <Mail aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="wd-footer-copyright">
          © {currentYear} Web District. {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
