import { useState } from "react";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function VerificationNotice() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [status, setStatus] = useState("");
  if (!user || user.role !== "client" || user.emailVerified) return null;

  const resend = async () => {
    setStatus("loading");
    try {
      await api.post("/auth/resend-verification");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div role="status" className="mb-6 rounded-2xl border border-[#C4A77D]/30 bg-[#C4A77D]/10 p-4 text-sm text-[#F8F7F4]">
      <p>{t("auth.verificationNotice.description")}</p>
      <p className="mt-2 text-[#D9D4CC]">{t("auth.verificationNotice.spamGuidance")}</p>
      <button type="button" onClick={resend} disabled={status === "loading"} className="mt-3 font-semibold text-[#C4A77D] underline-offset-4 hover:underline disabled:opacity-60">
        {status === "sent" ? t("auth.verificationNotice.sent") : t("auth.verificationNotice.resend")}
      </button>
      {status === "sent" ? (
        <p className="mt-2 text-[#D9D4CC]">{t("auth.verificationNotice.resentGuidance")}</p>
      ) : null}
      {status === "error" && <p role="alert" className="mt-2 text-red-300">{t("auth.verificationNotice.error")}</p>}
    </div>
  );
}

export default VerificationNotice;
