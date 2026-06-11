import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  MessageCircle,
} from "lucide-react";
import Card from "../common/Card";
import useLanguage from "../../hooks/useLanguage";
import useSettings from "../../hooks/useSettings";
import { AGENCY } from "../../lib/constants";
import { getWhatsappLink } from "../../lib/helpers";
import {
  trackContact,
  trackCustomEvent,
} from "../../lib/metaPixel";

const optionIcons = {
  request: FileText,
  call: CalendarDays,
};

function StartOptions({ activeOption, setActiveOption, cardClassName = "", className = "" }) {
  const { settings } = useSettings();
  const { effectiveLanguage, t } = useLanguage();
  const options = t("start.options.items", []).map((option) => ({
    ...option,
    icon: optionIcons[option.id] || FileText,
  }));
  const whatsappLink = getWhatsappLink(
    settings.whatsapp || AGENCY.whatsapp,
    t("start.whatsapp.message")
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
    <Card className={`p-6 lg:sticky lg:top-28 ${cardClassName} ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C4A77D]">
        {t("start.options.eyebrow")}
      </p>

      <h2 className="font-display mt-4 text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[#F8F7F4]">
        {t("start.options.title")}
      </h2>

      <p className="mt-4 text-sm leading-7 text-[#D9D4CC]">
        {t("start.options.description")}
      </p>

      <div className="mt-7 grid gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = activeOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveOption(option.id)}
              aria-pressed={isActive}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                isActive
                  ? "border-[#C4A77D]/55 bg-[#C4A77D]/14 text-[#F8F7F4]"
                  : "border-white/10 bg-white/[0.03] text-[#D9D4CC] hover:border-[#C4A77D]/30 hover:text-[#F8F7F4]"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
                <Icon size={22} />
              </span>

              <span className="min-w-0">
                <span className="block font-semibold text-[#F8F7F4]">
                  {option.title}
                </span>

                <span className="mt-1 block text-sm leading-6 text-[#D9D4CC]">
                  {option.description}
                </span>
              </span>

              {isActive && (
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#C4A77D]" />
              )}
            </button>
          );
        })}

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("start.whatsapp.button")}
          onClick={handleWhatsappClick}
          className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left text-[#D9D4CC] transition duration-300 hover:-translate-y-0.5 hover:border-[#C4A77D]/30 hover:bg-white/[0.04] hover:text-[#F8F7F4]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 text-[#F8F7F4]">
            <MessageCircle size={22} />
          </span>

          <span className="min-w-0">
            <span className="block font-semibold text-[#F8F7F4]">
              {t("start.whatsapp.title")}
            </span>
            <span className="mt-1 block text-sm leading-6 text-[#D9D4CC]">
              {t("start.whatsapp.description")}
            </span>
            <span className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#C4A77D]">
              <span>{t("start.whatsapp.button")}</span>
              <ExternalLink size={14} className="shrink-0" />
            </span>
          </span>
        </a>
      </div>

      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-sm leading-7 text-[#D9D4CC]">
          {t("start.options.footer")}
        </p>
      </div>
    </Card>
  );
}

export default StartOptions;
