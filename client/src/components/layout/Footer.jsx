import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink } from "../../lib/helpers";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020817] py-12">
      <div className="wd-container">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-2xl font-bold tracking-[-0.05em]">
              Web District
            </p>
            <p className="mt-4 max-w-md leading-7 text-[#94A3B8]">
              Clean websites for brands, businesses, and campaigns that need to look serious online.
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
                href={getWhatsappLink(AGENCY.whatsapp)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>

              <a
                className="flex items-center gap-2 hover:text-white"
                href={`tel:${AGENCY.phone}`}
              >
                <Phone size={16} />
                {AGENCY.phone}
              </a>

              <a
                className="flex items-center gap-2 hover:text-white"
                href={`mailto:${AGENCY.email}`}
              >
                <Mail size={16} />
                {AGENCY.email}
              </a>

              <a
                className="flex items-center gap-2 hover:text-white"
                href={`https://instagram.com/${AGENCY.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={16} />
                @{AGENCY.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-[#64748B] md:flex-row">
          <p>© {new Date().getFullYear()} Web District. All rights reserved.</p>
          <p>Websites that make businesses look serious.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;