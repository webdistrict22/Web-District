import { ExternalLink, MessageCircle } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";
import useSettings from "../../hooks/useSettings";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink } from "../../lib/helpers";
import { trackContact, trackCustomEvent } from "../../lib/metaPixel";

function WhatsappAlternative() {
  const { settings } = useSettings();
  const { effectiveLanguage, t } = useLanguage();
  const whatsappLink = getWhatsappLink(
    settings.whatsapp || AGENCY.whatsapp,
    t("start.whatsapp.message"),
  );

  const handleWhatsappClick = () => {
    const params = {
      button_name: "Start page WhatsApp",
      contact_method: "whatsapp",
      language: effectiveLanguage,
    };

    trackContact("whatsapp", params);
    trackCustomEvent("WhatsAppClick", params);
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleWhatsappClick}
      className="wd-start-whatsapp__link"
    >
      <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>
        <strong>{t("start.whatsapp.title")}</strong>{" "}
        {t("start.whatsapp.description")}
      </span>
      <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

export default WhatsappAlternative;
