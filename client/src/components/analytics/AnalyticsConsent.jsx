import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import useLanguage from "../../hooks/useLanguage";
import { ANALYTICS_CONSENT_EVENT, clearAnalyticsConsent, getAnalyticsConsent, isPrivatePath, setAnalyticsConsent } from "../../lib/analyticsConsent";

function AnalyticsConsent() {
  const { isArabic } = useLanguage();
  const [consent, setConsent] = useState(getAnalyticsConsent);

  useEffect(() => {
    const update = (event) => setConsent(event.detail || getAnalyticsConsent());
    window.addEventListener(ANALYTICS_CONSENT_EVENT, update);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, update);
  }, []);

  const choose = (value) => {
    setAnalyticsConsent(value);
    setConsent(value);
  };
  const beforeSend = (event) => isPrivatePath(new URL(event.url).pathname) ? null : event;

  return (
    <>
      {consent === "accepted" && (
        <>
          <Analytics beforeSend={beforeSend} />
          <SpeedInsights beforeSend={beforeSend} />
        </>
      )}
      {consent === "unset" ? (
        <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#C4A77D]/35 bg-[#0B0B0B]/95 p-4 shadow-2xl backdrop-blur" aria-label={isArabic ? "خيارات الخصوصية" : "Privacy choices"}>
          <p className="text-sm leading-6 text-[#D9D4CC]">{isArabic ? "نستخدم تحليلات اختيارية لتحسين الموقع. يمكنك القبول أو الرفض، ولن يتأثر استخدام الموقع." : "We use optional analytics to improve the site. You can accept or reject them without affecting essential use."}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose("accepted")} className="rounded-full bg-[#C4A77D] px-5 py-2 text-sm font-bold text-[#080808]">{isArabic ? "قبول" : "Accept"}</button>
            <button type="button" onClick={() => choose("rejected")} className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-[#F8F7F4]">{isArabic ? "رفض" : "Reject"}</button>
          </div>
        </aside>
      ) : (
        <button type="button" onClick={() => { clearAnalyticsConsent(); setConsent("unset"); }} className="fixed bottom-3 end-3 z-[90] rounded-full border border-white/15 bg-[#0B0B0B]/90 px-3 py-2 text-xs text-[#D9D4CC] shadow-lg">
          {isArabic ? "خيارات الخصوصية" : "Privacy choices"}
        </button>
      )}
    </>
  );
}

export default AnalyticsConsent;
