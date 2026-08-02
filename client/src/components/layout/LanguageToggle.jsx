import useLanguage from "../../hooks/useLanguage";

function FlagBadge({ language }) {
  if (language === "ar") {
    return (
      <span
        className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[1px] border border-[#F7F2EC]/25 shadow-[0_0_0.5rem_rgba(214,167,93,0.16)]"
        aria-hidden="true"
      >
        <span className="absolute inset-x-0 top-0 h-1/3 bg-[#CE2029]" />
        <span className="absolute inset-x-0 top-1/3 h-1/3 bg-[#F7F2EC]" />
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#111111]" />
        <span className="absolute left-1/2 top-1/2 h-1 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-[#D6A75D]" />
      </span>
    );
  }

  return (
    <span
      className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[1px] border border-[#F7F2EC]/25 shadow-[0_0_0.5rem_rgba(214,167,93,0.16)]"
      aria-hidden="true"
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, #B22234 0 7.7%, #F7F2EC 7.7% 15.4%)",
        }}
      />
      <span className="absolute left-0 top-0 h-[54%] w-[45%] bg-[#3C3B6E]" />
    </span>
  );
}

function LanguageToggle() {
  const { isArabic, t, toggleLanguage } = useLanguage();
  const displayedLanguage = isArabic ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("nav.languageSwitchLabel")}
      className="fixed left-[max(16px,env(safe-area-inset-left))] bottom-[max(16px,env(safe-area-inset-bottom))] z-[65] inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#D6A75D]/45 bg-[#050505]/94 px-3.5 text-[0.62rem] font-black tracking-[0.1em] text-[#F7F2EC] shadow-[0_12px_32px_rgba(0,0,0,0.36)] backdrop-blur-md transition duration-200 hover:border-[#D6A75D] hover:bg-[#D6A75D] hover:text-[#171411] active:translate-y-px"
    >
      <FlagBadge language={displayedLanguage} />
      <span>{isArabic ? "EN" : "العربية"}</span>
    </button>
  );
}

export default LanguageToggle;
