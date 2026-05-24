import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { getWhatsappLink } from "../../lib/helpers";
import useSettings from "../../hooks/useSettings";

function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="border-t border-white/10 bg-[#020817] py-12">
      <div className="wd-container">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-2xl font-bold tracking-[-0.05em]">
              {settings.agencyName || "Web District"}
            </p>
            <p className="mt-4 max-w-md leading-7 text-[#94A3B8]">
              {settings.footerText ||
                "Clean websites for brands, businesses, and campaigns that need to look serious online."}
            </p>
          </div>

          <div>
            <p className="mb-4 font-semibold text-white">Pages</p>
            <div className="space-y-3 text-sm text-[#94A3B8]">
              <Link className="block hover:text-white" to="/services">
                Services
              </Link>
              <Link className="block hover:text-white" to="/work">
                Some of our work
              </Link>
              <Link className="block hover:text-white" to="/process">
                Process
              </Link>
              <Link className="block hover:text-white" to="/start">
                Start
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-4 font-semibold text-white">Contact</p>

            <div className="space-y-3 text-sm text-[#94A3B8]">
              <a
                className="flex items-center gap-2 hover:text-white"
                href={getWhatsappLink(settings.whatsapp || "01130696935")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>

              <a
                className="flex items-center gap-2 hover:text-white"
                href={`tel:${settings.phone}`}
              >
                <Phone size={16} />
                {settings.phone}
              </a>

              <a
                className="flex items-center gap-2 hover:text-white"
                href={`mailto:${settings.email}`}
              >
                <Mail size={16} />
                {settings.email}
              </a>

              <a
                className="flex items-center gap-2 hover:text-white"
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={16} />
                @{settings.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-[#64748B] md:flex-row">
          <p>© {new Date().getFullYear()} {settings.agencyName || "Web District"}. All rights reserved.</p>
          <p>{settings.heroHeadline || "Websites that make businesses look serious."}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;